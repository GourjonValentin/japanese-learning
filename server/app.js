const express = require('express');
const logger = require('morgan');
const mysql = require('mysql2');
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// Load environment variables from .env file
require('dotenv').config();
const verifyToken = require('./middleware');


const app = express();
const port = process.env.SERVER_PORT || 3000;
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;


app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(cors())


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root2',
    password: '',
    database: 'japanese_learning_db'
})

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
    }
});


app.get('/', (req, res) => {
    res.status(200).send({ status: "Connected to japanese-learning server" });
});

const util = require('util');

// Promisify db.query
const query = util.promisify(db.query).bind(db);

// AUTH

app.post('/login', async (req, res) => {
    const { password, username } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Invalid format" });
    }

    try {
        const results = await query('SELECT * FROM users WHERE username=?', [username]);

        if (results.length === 0) {
            return res.status(203).json({ message: "This username is not registered" });
        }

        // Assuming results[0] holds the user information
        const user = results[0];

        // Validate password
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            var token = jwt.sign(
                { username: username, id: user.id },
                secretKey,
                { expiresIn: '1h' }
            )
            res.status(200).json({ username: user.username, favourites: user.favourites, userId: user.id, isAdmin: user.isAdmin, sessionToken: token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Error: ", err.message);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});



app.post('/auth/check', async (req, res) => {
    const token = req.body.sessionToken;
    const { status, message, payload } = verifyToken(token, secretKey);
    if (status === 200) {
        res.status(200).json({ payload });
    } else {
        res.status(status).json({ message });
    }

});

// DICTIONARY

app.get('/jisho', async (req, res) => {
    try {
        const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${req.query.keyword}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.statusText });
        } else {
            res.status(500).json({ error: 'Error fetching data' });
        }
    }
});

app.get('/quizzes', async (req, res) => {
    try {
        const { difficulty, type, favourites } = req.query;
        let results = await query('SELECT * FROM quiz');
        if (results.length === 0) {
            return res.status(404).json({ message: "No quizzes found" });
        }
        if (difficulty) {
            results = results.filter(quiz => quiz.difficulty = difficulty);
        }
        if (type) {
            results = results.filter(quiz => quiz.type = type);
        }
        if (favourites) {
            results = results.filter(quiz => quiz.id in JSON.parse(favourites));
        }
        console.log(results);
        results = await Promise.all(
            results.map(async quiz => {
                const ownerName = await query('SELECT username FROM users WHERE id=?', [quiz.ownerid]);
                quiz.ownername = ownerName[0].username;
                return quiz
            })
        );
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Error fetching quizzes' });
    }
});

app.post('/create', async (req,res) => {
    const { quizName, quizDifficulty, quizType, quizQuestions, ownerId} = req.body;
    console.log(quizQuestions);
    try {
        await query('INSERT INTO quiz(name, type, difficultylevel, content, ownerid) VALUES (?, ?, ?, ?, ?)',[quizName, quizType, quizDifficulty, quizQuestions, ownerId]);

        //await query(`INSERT INTO quiz(name, type, content, ownerid) VALUES (${quizName}, ${quizType}, [{"title":"zedgf","picture":"","answers":[{"id":"0","content":"zed"},{"id":"1","content":"edfg"}],"correct_answers":["0"]}][{"title":"zedgf","picture":"","answers":[{"id":"0","content":"zed"},{"id":"1","content":"edfg"}],"correct_answers":["0"]}]${JSON.stringify(JSON.parse(quizQuestions))}, ${parseInt(ownerId)}`)
        return res.sendStatus(201);
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err});
    }

});

app.post('/users/edit-favourite', async (req, res) => {
    try {
        const { mode, quizId, userId, sessionToken } = req.body;

        // check if the user login is matching its id
         const { payload } = verifyToken(sessionToken, secretKey);
         console.log(payload);
         if (payload.id !== userId){
         return res.status(403).json({message : "your are not this user owner"});
        }
        let user = await query('SELECT * FROM users WHERE id=?', [userId]);
        if (user === undefined) {
            return res.status(404).json({ message: 'user not found' });
        }
        user = user[0];
        console.log(user);
        console.log(user.favourites instanceof Array)

        let newFavourites = JSON.parse(user.favourites);
        console.log(newFavourites);
        if (newFavourites === null || newFavourites === undefined) {
            newFavourites = [];
        }
        if (mode === 'delete') { // ca marche ???
            newFavourites = newFavourites.filter((el) => {
                return el !== quizId;
            })
        }
        else if (mode === 'add') {
            if (newFavourites.includes(quizId)) {
                console.log("already in the list");
                return res.status(409).json({ message: "quiz already in the user favourite quiz" })
            }
            newFavourites.push(quizId);
        }
        console.log(newFavourites);
        // try catch the following query ???
        const result = await query('UPDATE users SET favourites=? WHERE id=?', [JSON.stringify(newFavourites), userId]);
        if (result) {
            console.log("update done");
            console.log(typeof newFavourites);
            return res.status(200).json({ favourites: newFavourites });
        }
    } catch (err) {
        console.error("Error: ", err.message);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

