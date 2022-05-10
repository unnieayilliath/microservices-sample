var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');
var mysql = require('mysql');
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];


var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'password',
    database: 'shop'
});
var cart = [];
var theuser=null;
var theuserid =null;
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    if (request.method == 'POST') {
        switch (path) {
            /* TODO */
            case "/newProduct":
                 var body = '';
                console.log("Create new product");
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    var obj = JSON.parse(body);
                    console.log(JSON.stringify(obj));
                    var query = "SELECT * FROM Products where name='"+obj.name+"'";
                    response.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });
                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) {
                                response.end("error");
                                throw err;
                            }
                            if (rows!=null && rows.length>0) {
                                console.log(" product already in database");
                                response.end('{"error": "2","reason":"Product already exists in database"}');
                            }
                            else{
                                query = "INSERT INTO Products (name, quantity, price,image)"+
                                        "VALUES(?, ?, ?,?)";
                               /*  var min = Math.ceil(min);
                                var max = Math.floor(max);
                                var rnd= Math.floor(Math.random() * (max - min + 1) + min);  */
                                var image=`car${getRandomIntInclusive(1,6)}.jpeg`;
                                db.query(
                                    query,
                                    [obj.name,obj.quantity,obj.price,image],
                                    function(err, result) {
                                        if (err) {
                                            // 2 response is an sql error
                                            response.end('{"error": "3"}');
                                            throw err;
                                        }
                                        newProductId = result.insertId;
                                        var obj = {
                                            id: newProductId
                                        }
                                        response.end(JSON.stringify(obj));
                                    }
                                );
                            }
                        }
                    );
                });
                break;
        } //switch
    }
    else {
        switch (path) {
            case "/getProducts"    :
                console.log("getProducts");
                response.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                var query = "SELECT * FROM products ";
                db.query(
                    query,
                    [],
                    function(err, rows) {
                        if (err) throw err;
                        console.log(JSON.stringify(rows, null, 2));
                        response.end(JSON.stringify(rows));
                        console.log("Products sent");
                    }
                );
                break;
            case "/getProduct"    :
                console.log("getProduct");
                var body="";
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    var product = JSON.parse(body);
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where productID="+
                        product.id;
                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows[0]));
                            console.log("Products sent");
                        }
                    );

                });
                break;
        }
    }
});
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
server.listen(3002);
