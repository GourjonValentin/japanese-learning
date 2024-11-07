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

function parseTranslation(jishoResponse) {
    const data = jishoResponse.data;
    let idGen = 0;
    return data.map(word => {
        const id = idGen++;
        const japanese = word.japanese.map(jp => {return { id: idGen++ , word: jp.word, reading: jp.reading } })
        const english = word.senses.map(sense => {return { id: idGen++ , english_definitions: sense.english_definitions } });
        return { id, japanese, english };
    });
}

async function testParse(keyword) {
    const resp = await fetch(`http://localhost:3000/api/jisho?keyword=${keyword}`);
    const data = await resp.json();
    console.log(parseTranslation(data));
}

testParse('dog');

app.get('/', (req, res) => {
    res.status(200).send({ status: "Connected to japanese-learning server" });
});

const util = require('util');

// Promisify db.query
const query = util.promisify(db.query).bind(db);

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
                { username: username },
                secretKey,
                { expiresIn: '1h' }
            )
            res.status(200).json({ username: "username", sessionToken: token });
        } else {
            res.status(403).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Error: ", err.message);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.get('/api/jisho', async (req, res) => {
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


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

