CREATE DATABASE japanese_learning_db;

USE japanese_learning_db;

CREATE TABLE users(
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    isAdmin boolean NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE quiz(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    ownerid int NOT NULL,
    content JSON,
    PRIMARY KEY (id),
    FOREIGN KEY (ownerid) REFERENCES users(id)
);


INSERT INTO users(username, password, isAdmin) 
VALUES 
("admin", "STrongPassWord", 1),
("Val", "val", 0),
("Lacuca", "123", 0),
("FaRESTAURANT", "bg")