DROP DATABASE IF EXISTS customerdb;
CREATE DATABASE IF NOT EXISTS customerdb;
use customerdb;
CREATE TABLE Customer (
    customerID    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL,
    firstname VARCHAR(40) NOT NULL,
    lastname VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL,
    phonenumber VARCHAR(10),
    creditcardprovider varchar(10),
    creditcardnumber VARCHAR(16),
    creditcardname  VARCHAR(16),
    creditcardexpiry VARCHAR(10),
    isAdmin BOOLEAN DEFAULT false,
    challengequestion VARCHAR(255),
    challengeanswer VARCHAR(40),
    PRIMARY KEY  (customerID)
);

CREATE TABLE CustomerAddress(
    customeraddressID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    customerID INT UNSIGNED  NOT NULL,
    streetname varchar(100),
    city varchar(100),
    country varchar(100),
    PRIMARY KEY  (customeraddressID)
);

INSERT INTO Customer (username, password, firstname, lastname, email, isAdmin)
 VALUES ('Unnie', 'Pass123', 'Unnie','Ayilliath','unnie@unnie.com',true);


