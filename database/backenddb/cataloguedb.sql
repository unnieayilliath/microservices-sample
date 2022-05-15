DROP DATABASE IF EXISTS cataloguedb;
CREATE DATABASE IF NOT EXISTS cataloguedb;
use cataloguedb;
CREATE TABLE IF NOT EXISTS products (
         productID    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
         name         VARCHAR(30)   NOT NULL DEFAULT '',
         quantity     INT UNSIGNED  NOT NULL DEFAULT 0,
         price        DECIMAL(7,2)  NOT NULL DEFAULT 99999.99,
         image        VARCHAR(30)   NOT NULL DEFAULT '',
         PRIMARY KEY  (productID)
       );
INSERT INTO products (name, quantity, price, image) VALUES
         ('Car 1', 10000, 0.48,'car1.jpeg'),
         ('Car 2', 8000, 0.49,'car2.jpeg');
         INSERT INTO products (name, quantity, price, image) VALUES
                  ('Car 5', 100, 0.22,'car4.jpeg'),
                  ('Car 6', 80, 0.33,'car3.jpeg');

