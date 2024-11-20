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

// Change values to connect to DB
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
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

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: "Please provide both username and password." });
    }

    // Array that will store the errors
    const passwordErrors = [];

    // Password strength requirements
    if (password.length < 8) {
        passwordErrors.push("• Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
        passwordErrors.push("• Password must include at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        passwordErrors.push("• Password must include at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
        passwordErrors.push("• Password must include at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        passwordErrors.push("• Password must include at least one special character.");
    }

    try {
        const existingUser = await query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "This username is already taken." });
        }

        // Print the list of errors to rectify in order to sign up
        if (passwordErrors.length > 0) {
            return res.status(400).json({ message: passwordErrors });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await query('INSERT INTO users (username, isAdmin, password, favourites) VALUES(?, 0, ?, "[]")', [username, hashedPassword]);

        res.status(201).json({ message: "User registered successfully." });

    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { password, username } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Invalid format" });
    }

    try {
        const results = await query('SELECT * FROM users WHERE username=?', [username]);

        if (results.length === 0) {
            return res.status(203).json({ message: "This username is not registered." });
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
            res.status(200).json({ username: user.username, favourites: user.favourites, userId: user.id, isAdmin: user.isAdmin, sessionToken: token, message: "Succesful login" });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
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

app.get('/quizzes/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        if (quizId === undefined) {
            return res.status(400).json({ message: "Invalid format" });
        }
        let result = await query('SELECT * FROM quiz WHERE quiz.id=?', [quizId]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        console.log(result)
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Error fetching quizzes' });
    }
});

//search
app.get('/quizzes', async (req, res) => {
    try {
        const { difficulty, type, favourites, name } = req.query;
        let results = await query('SELECT * FROM quiz');
        if (difficulty && difficulty !== "all") {
            console.log(typeof difficulty, typeof results[2].difficultylevel)
            results = results.filter(quiz => quiz.difficultylevel.toString() === difficulty.toString());
        }
        if (type) {
            results = results.filter(quiz => quiz.type === type);
        }
        if (favourites) {
            results = results.filter(quiz => favourites.includes(quiz.id) || favourites.includes(quiz.id.toString()));
        }
        if (name) {
            // not sure....
            results = results.filter(quiz => quiz.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No quizzes found" });
        }
        //console.log(results);
        results = await Promise.all(
            results.map(async quiz => {
                const ownerName = await query('SELECT username FROM users WHERE id=?', [quiz.ownerid]);
                quiz.ownername = ownerName[0].username;
                return quiz
            })
        );
        return res.status(200).json(results);
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
        if (payload.id !== userId) {
            return res.status(403).json({ message: "your are not this user owner" });
        }
        let user = await query('SELECT * FROM users WHERE id=?', [userId]);
        if (user === undefined) {
            return res.status(404).json({ message: 'user not found' });
        }
        user = user[0];
        let newFavourites = user.favourites;
        if (!(user.favourites instanceof Array)) {
            newFavourites = JSON.parse(user.favourites);
        }
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
        console.log(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.post('/save-score', async (req, res) => {
    const { userId, quizId, score } = req.body;
    try {
        let results = await query('SELECT * FROM scores WHERE userid = ? AND quizid = ?', [userId, quizId]);
        if (results.length === 0) {
            await query('INSERT INTO scores (userid, quizid, score) VALUES (?, ?, ?)', [userId, quizId, score]);
            res.status(201).json({ message: 'Score saved successfully.' });
        } else {
            await query('UPDATE scores SET score = ? WHERE id = ?', [score, results[0].id]);
            res.status(200).json({ message: 'Score updated successfully.' });
        }
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'An error occurred while saving the score.' });
    }
});

app.get('/scores/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
        let results = await query('SELECT u.username, s.score\n' +
            'FROM scores s\n' +
            '         JOIN users u ON u.id = s.userid\n' +
            '         JOIN quiz q ON q.id = s.quizid\n' +
            'WHERE s.quizid = ?\n' +
            'ORDER BY s.score\n' +
            'LIMIT 10;', [quizId]);
        console.log(results)
        if (results.length === 0) {
            return res.sendStatus(204);
        }
        return res.status(200).json(results);
    } catch (err) {
        res.status(500).json("err : " + err)
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

