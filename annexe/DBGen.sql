CREATE DATABASE japanese_learning_db;

USE japanese_learning_db;

CREATE TABLE users(
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    isAdmin boolean NOT NULL,
    password varchar(255) NOT NULL,
    favourites JSON,
    PRIMARY KEY (id)
);

CREATE TABLE quiz(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    ownerid int NOT NULL,
    content JSON,
    difficultylevel int,
    PRIMARY KEY (id),
    FOREIGN KEY (ownerid) REFERENCES users(id)
);

CREATE TABLE scores (
    id int NOT NULL AUTO_INCREMENT,
    userid int NOT NULL,
    quizid int NOT NULL,
    score int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (quizid) REFERENCES quiz(id) 
);


INSERT INTO users (username, isAdmin, favourites, password)
VALUES ('admin', 1, [], '$2b$10$/Q/BntW8/cAwW2akU06SwunH6IW4R66634nNP/2pZk4PpV681uJt2');

INSERT INTO users (username, isAdmin, favourites, password)
VALUES ('user1', 0, [], '$2b$10$NyhqY2PgidBiubTSGUfuneYz/4cUoSsgihmgcbTR9bV33Pt.UC7em');

INSERT INTO quiz (name, ownerid, content, difficultylevel) VALUES 
(
    'Basic basic', 
    1, 
    '[
        {
            "id": 0,
            "type": "simple",
            "title": "What does こんにちは mean?",
            "picture": "",
            "answers": [
                {"id": 0, "content": "Goodbye"},
                {"id": 1, "content": "Hello"},
                {"id": 2, "content": "Thank you"}
            ],
            "correct_answers": [1]
        },
        {
            "id": 1,
            "type": "simple",
            "title": "Translate: みず",
            "picture": "",
            "answers": [
                {"id": 0, "content": "Fire"},
                {"id": 1, "content": "Water"},
                {"id": 2, "content": "Earth"}
            ],
            "correct_answers": [1]
        }
    ]',
    1
),
(
    'Basic', 
    1, 
    '[
        {
            "id": 0,
            "type": "simple",
            "title": "What is the meaning of 私は学生です?",
            "picture": "",
            "answers": [
                {"id": 0, "content": "I am a teacher"},
                {"id": 1, "content": "I am a student"},
                {"id": 2, "content": "I am a doctor"},
                {"id": 3, "content": "I am a mother"}
            ],
            "correct_answers": [1]
        },
        {
            "id": 1,
            "type": "simple",
            "title": "Translate: 食べる",
            "picture": "",
            "answers": [
                {"id": 0, "content": "To sleep"},
                {"id": 1, "content": "To eat"},
                {"id": 2, "content": "To read"},
                {"id": 3, "content": "To go"}

            ],
            "correct_answers": [1]
        },
        {
            "id": 2,
            "type": "simple",
            "title": "Translate: あなたの猫はかわいですよ。",
            "picture": "",
            "answers": [
                {"id": 0, "content": "Mon chien est adorable"},
                {"id": 1, "content": "Notre chat est mignon"},
                {"id": 2, "content": "Ton chat est tres mignon non?"},
                {"id": 3, "content": "Ton chat est mignon!"}
            ],
            "correct_answers": [3]
        }
    ]',
    2
);

