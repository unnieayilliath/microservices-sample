DROP DATABASE IF EXISTS orderdb;
CREATE DATABASE IF NOT EXISTS orderdb;
use orderdb;
CREATE TABLE Orders (
    orderID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    customerID INT UNSIGNED  NOT NULL,
    saledate VARCHAR(40) NOT NULL,
    total FLOAT NOT NULL,
    status varchar(20) NOT NULL,
    PRIMARY KEY  (orderID)
);

CREATE TABLE OrderDetails (
    orderdetailsID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    orderID INT UNSIGNED  NOT NULL,
    productID INT UNSIGNED  NOT NULL,
    quantity INT UNSIGNED  NOT NULL,
    PRIMARY KEY  (orderdetailsID)
);

