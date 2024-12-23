CREATE DATABASE japanese_learning_db;

USE japanese_learning_db;

CREATE TABLE users(
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    isAdmin boolean NOT NULL,
    password varchar(255) NOT NULL,
    favorites JSON,
    avatarPath varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE quiz(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    type varchar(255),
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
    score float NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (quizid) REFERENCES quiz(id)
);


INSERT INTO users (username, isAdmin, favorites, password, avatarPath)
VALUES ('admin', 1, '[4]', '$2b$10$wOU9lNroLNfZuLYULutBDeA.bZw2EQqVWCMSAncKBGClWBnjm5u/W', 'https://api.multiavatar.com/t4nlelhk3br.svg');

INSERT INTO users (username, isAdmin, favorites, password, avatarPath)
VALUES ('user1', 0, '[5]', '$2b$10$IC7Nxb.hZUw9WAw./euVKuJBmNLdUeDrdCd9qzzb1F2Ndcjyk1lzC', 'https://api.multiavatar.com/c6195hhi8y8.svg');

INSERT INTO quiz (name, type, ownerid, content, difficultylevel) VALUES 
(
    'Basic basic',
    'simple',
    1, 
    '[
        {
            "id": 0,
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
    'simple',
    2,
    '[
        {
            "id": 0,
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
            "title": "Translate: あなたの猫はかわいですよ。",
            "picture": "",
            "answers": [
                {"id": 0, "content": "My dog is adorable"},
                {"id": 1, "content": "Our cat is cute"},
                {"id": 2, "content": "Your cat is cute dont you think ?"},
                {"id": 3, "content": "Your cat is so cute!"}
            ],
            "correct_answers": [3]
        }
    ]',
    2
);

INSERT INTO quiz(name, type, ownerid, difficultylevel, content) VALUES
(
    'Tokyo Ghoul - 東京喰種',
    'anime',
    1,
    3,
    '[
        {
            "id": 0,
            "title": "What does Liz say ?",
            "picture": "https://i.ibb.co/kqHMKXN/Capture-d-e-cran-2024-11-09-a-19-18-12.png",
            "answers": [
                {"id": 0, "content": "I see you"},
                {"id": 1, "content": "Do you see me well?"},
                {"id": 2, "content": "Look at you"},
                {"id": 3, "content": "I saw you"}
            ],
            "correct_answers": [3]
        },
        {
            "id": 1,
            "title": "How do you pronounce つかまえた ?",
            "picture": "https://i.ibb.co/wCZRDSH/Capture-d-e-cran-2024-11-09-a-19-13-09.png",
            "answers": [
                {"id": 0, "content": "Tsukamaena"},
                {"id": 1, "content": "Ukamaeta"},
                {"id": 2, "content": "Ukamaena"},
                {"id": 3, "content": "Tsukamaeta"}
            ],
            "correct_answers": [3]
        },
        {
            "id": 2,
            "title": "What is the translation of この目",
            "picture": "https://i.ibb.co/Swr1fSq/Capture-d-e-cran-2024-11-09-a-19-22-14.png",
            "answers": [
                {"id": 0, "content": "This eye !!!"},
                {"id": 1, "content": "My body !!!"},
                {"id": 2, "content": "This body !!!"},
                {"id": 3, "content": "My eye !!!"}
            ],
            "correct_answers": [0]
        },
        {
            "id": 3,
            "title": "What is the pronounciation of この目",
            "picture": "https://i.ibb.co/Swr1fSq/Capture-d-e-cran-2024-11-09-a-19-22-14.png",
            "answers": [
                {"id": 0, "content": "Kono itsu"},
                {"id": 1, "content": "Sono me"},
                {"id": 2, "content": "Sono itsu"},
                {"id": 3, "content": "Kono me"}
            ],
            "correct_answers": [3]
        }
    ]'
),
(
    'Chainsaw Man - チェンソーマン',
    'anime',
    1,
    3,
    '[
        {
            "id": 0,
            "title": "What is the translation of 死 (し) ?",
            "picture": "https://i.ibb.co/By4Xm9g/Capture-d-e-cran-2024-11-09-a-19-29-16.png",
            "answers": [
                {"id": 0, "content": "Monster"},
                {"id": 1, "content": "Blood"},
                {"id": 2, "content": "Power"},
                {"id": 3, "content": "Death"}
            ],
            "correct_answers": [3]
        },
        {
            "id": 1,
            "title": "What is the prononciation of ポチタ ?",
            "picture": "https://i.ibb.co/fDHwHBh/Capture-d-e-cran-2024-11-09-a-19-32-57.png",
            "answers": [
                {"id": 0, "content": "porita"},
                {"id": 1, "content": "pochita"},
                {"id": 2, "content": "horita"},
                {"id": 3, "content": "hochita"}
            ],
            "correct_answers": [1]
        },
        {
            "id": 2,
            "title": "What is Denshi saying ?",
            "picture": "https://i.ibb.co/k0jWS5b/Capture-d-e-cran-2024-11-09-a-19-35-08.png",
            "answers": [
                {"id": 0, "content": "Gaâhahahaâ"},
                {"id": 1, "content": "Gyayayayayayha"},
                {"id": 2, "content": "Hahahahhahaha"},
                {"id": 3, "content": "Pouahahaha"}
            ],
            "correct_answers": [0]
        }
    ]'
),
(
    'Attack On Titan - 進撃の巨人',
    'anime',
    2,
    2,
    '[
        {
            "id": 0,
            "title": "What is the translation of 自由だ (じゆだ) ?",
            "picture": "https://stat.ameba.jp/user_images/20220202/15/masaecox-x/d5/97/p/o0500028215069601519.png",
            "answers": [
                {"id": 0, "content": "The sea"},
                {"id": 1, "content": "Freedom"},
                {"id": 2, "content": "Power"},
                {"id": 3, "content": "Death"}
            ],
            "correct_answers": [1]
        },
        {
            "id": 1,
            "title": "What does Eren say (たたかえ) ?",
            "picture": "https://i.pinimg.com/originals/bc/da/35/bcda35cf0df8da64a4fa83a0f4e2ab43.jpg",
            "answers": [
                {"id": 0, "content": "Fight"},
                {"id": 1, "content": "Run"},
                {"id": 2, "content": "Who am I"},
                {"id": 3, "content": "Think"}
            ],
            "correct_answers": [0]
        }
    ]'
);
