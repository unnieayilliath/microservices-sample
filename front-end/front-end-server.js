const express = require("express") 
//const session = require('express-session')
var request      = require("request")
var bodyParser   = require("body-parser")
var cookieParser = require("cookie-parser")
var async        = require("async")
var http = require("http")
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
// Cart service
const cartPackageDef = protoLoader.loadSync("../datacontracts/cart.proto", {});
const cartgRPCObject = grpc.loadPackageDefinition(cartPackageDef);
const cartPackage = cartgRPCObject.cartPackage;
const cartClient = new cartPackage.Cart("0.0.0.0:1000",grpc.credentials.createInsecure());
// Catalogue service
const cataloguePackageDef = protoLoader.loadSync("../datacontracts/catalogue.proto", {});
const cataloguegRPCObject = grpc.loadPackageDefinition(cataloguePackageDef);
const cataloguePackage = cataloguegRPCObject.cataloguePackage;
const catalogueClient = new cataloguePackage.Catalogue("0.0.0.0:1001",grpc.credentials.createInsecure());
// User service
const userPackageDef = protoLoader.loadSync("../datacontracts/user.proto", {});
const usergRPCObject = grpc.loadPackageDefinition(userPackageDef);
const userPackage = usergRPCObject.userPackage;
const userClient = new userPackage.User("0.0.0.0:1002",grpc.credentials.createInsecure());
var cookie_name = "logged_in"
var session1= {
    name: 'md.sid',
    secret: 'sooper secret',
    resave: false,
    saveUninitialized: true
}
let sessionData={ "username":"", "isAdmin":false};

const app = express() 
 var helpers = {};
/* Public: errorHandler is a middleware that handles your errors
   *
   * Example:
   *
   * var app = express();
   * app.use(helpers.errorHandler);
   * */
  helpers.errorHandler = function(err, req, res, next) {
    var ret = {
      message: err.message,
      error:   err
    };
    res.
      status(err.status || 500).
      send(ret);
  };
  helpers.mylogger = function(req, res, next) {

   console.log('body '+JSON.stringify(req.body));
    next();
  };

  helpers.sessionMiddleware = function(err, req, res, next) {
    if(!req.cookies.logged_in) {
      res.session.customerId = null;
    }
  };

  /* Responds with the given body and status 200 OK  */
  helpers.respondSuccessBody = function(res, body) {
    helpers.respondStatusBody(res, 200, body);
  }
  helpers.respondStatusBody = function(res, statusCode, body) {
    res.writeHeader(statusCode);
    res.write(body);
    res.end();
  }

  helpers.respondStatusBodyJSON = function(res, statusCode, body) {
    res.writeHeader(statusCode);
    res.write(JSON.stringify(body));
    res.end();
  }

  /* Responds with the given statusCode */
  helpers.respondStatus = function(res, statusCode) {
    res.writeHeader(statusCode);
    res.end();
  }

  helpers.simpleHttpRequest = function(url, res, next) {
    request.get(url, function(error, response, body) {
      if (error) return next(error);
      helpers.respondSuccessBody(res, body);
    }.bind({res: res}));
  }

  /* TODO: Add documentation */
  helpers.getCustomerId = function(req, env) {
    // Check if logged in. Get customer Id
    var logged_in = req.cookies.logged_in;

    // TODO REMOVE THIS, SECURITY RISK
    if (env == "development" && req.query.custId != null) {
      return req.query.custId;
    }

    if (!logged_in) {
      if (!req.session.id) {
        throw new Error("User not logged in.");
      }
      // Use Session ID instead
      return req.session.id;
    }

    return req.session.customerId;
  }
// Port Number Setup 
var PORT = process.env.port || 3000 
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.errorHandler);


app.get("/", function(req, res){ 
	req.session.name = 'GeeksforGeeks'
	return res.send("Session Set") 
}) 

app.get("/getProducts", function (req, res, next) {
    catalogueClient.readCatalogue({"id":1},(err, response) => {
        console.log("Response received");
            if(response){
                console.log("Catalogue data returned " + JSON.stringify(response));
                res.writeHeader(200);
                if(response.items){
                res.write(JSON.stringify(response.items));
                }else{
                res.write(JSON.stringify([]));
                }
                res.end();
            }
            if(err){
                console.log("Catalogue data fetch failed: " + JSON.stringify(err));
                res.writeHeader(401);
                res.write(JSON.stringify(response));
                res.end();
            }
    });
  });

  app.post("/newProduct", function(req, res, next) {
    console.log("Posting new Product: " + JSON.stringify(req.body));
    catalogueClient.addProduct({ "price": item.price,"quantity":qty,"image":"","name":item.name}, (err, response) => {
        if(response){
            console.log("Added new item: " + JSON.stringify(response));
            res.writeHeader(200);
            res.write("");
            res.end();
        }
        if(err){
            res.writeHeader(401);
            res.write("");
            res.end();
        }
    });
});

app.get("/cart", function (req, res, next) {
    console.log("Request received: " + req.url );
    cartClient.readCart({"id":1},(err, response) => {
        console.log("Response received");
            if(response){
                console.log("Cart data returned " + JSON.stringify(response));
                res.writeHeader(200);
                if(response.items){
                    res.write(JSON.stringify(response.items));
                }else{
                    res.write(JSON.stringify([]));
                }
                res.end();
            }
            if(err){
                console.log("Cart data fetch failed: " + JSON.stringify(err));
                res.writeHeader(401);
                res.write(JSON.stringify(err));
                res.end();
            }
    });
});

// Delete item from cart
app.post("/delete", function (req, res, next) {
        console.log("Attempting to delete from cart: " + JSON.stringify(req.body));
        cartClient.deleteCartItem({"cartId":req.body.id},(err, response) => {
            console.log("Response received");
            if(response){
                console.log("Cart item deleted " + JSON.stringify(response));
                res.writeHeader(200);
                res.write(JSON.stringify(response));
                res.end();
            }
            if(err){
                console.log("Cart data delete failed: " + JSON.stringify(err));
                res.writeHeader(401);
                res.write(JSON.stringify(response));
                res.end();
            }
        });
});

// Add new item to cart
app.post("/cart", function (req, res, next) {
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));
    if (req.body.id == null) {
        next(new Error("Must pass id of item to add"), 400);
        return;
    }
    var qty = req.body.qty;
    catalogueClient.getProduct({"productID":req.body.id},(err, prodResponse) => {
        if(prodResponse){
            cartClient.addCartItem({ "productID": prodResponse.productID,"price": prodResponse.price,"quantity":qty,"image":prodResponse.image,"name":prodResponse.name}, (err, response) => {
                if(response){
                    console.log("Added new item: " + JSON.stringify(response));
                    res.writeHeader(200);
                    res.write("");
                    res.end();
                }
                if(err){
                    res.writeHeader(401);
                    res.write("");
                    res.end();
                }
            });
        }
        if(err){
            console.log("Cart data add failed: " + JSON.stringify(err));
            res.writeHeader(401);
            res.write("");
            res.end();
        }
    });
});



app.post("/login", function(req, res, next) {

    console.log("logging in  Customer: " + JSON.stringify(req.body));
    userClient.login({"username":req.body.name,"password":req.body.password},(err,response)=>{
        if (err !== null ) {
            console.log("error "+JSON.stringify(err));
            res.status(500);
            res.end();
            return;
        }
        if (response) {
            sessionData.username=response.username;
            sessionData.isAdmin=response.isAdmin;
            console.log(response);
            res.status(200);
            res.end(JSON.stringify(response));
            return;
        }
    });
});

app.post("/logout", function(req, res, next) {
    console.log("logging out Customer: " + JSON.stringify(req.body));
    sessionData.username="";
    sessionData.isAdmin=false;
});

// Create Customer - TO BE USED FOR TESTING ONLY (for now)
app.post("/register", function(req, res, next) {
    console.log("Posting Customer: " + JSON.stringify(req.body));
    userClient.register({"username":req.body.username,
                        "password":req.body.password,
                        "firstname":req.body.firstname,
                        "lastname":req.body.lastname,
                        "email":req.body.email,
                        "phonenumber":req.body.phonenumber
    },(err,response)=>{
        if (err !== null ) {
            console.log("error "+JSON.stringify(err));
            res.status(500);
            res.end(JSON.stringify(false));
            return;
        }
        if (response) {
            console.log(response);
            res.status(200);
            res.end(JSON.stringify(response));
            return;
        }
    });
});

// reset password
app.post("/resetpassword", function(req, res, next) {
    console.log("resetting password: " + JSON.stringify(req.body));
    const username=req.body.username?req.body.username:sessionData.username;
    userClient.resetPassword({"username":username,
                        "oldpassword":req.body.oldpassword,
                        "newpassword":req.body.newpassword,
    },(err,response)=>{
        if (err !== null ) {
            console.log("error "+JSON.stringify(err));
            res.status(500);
            res.end(JSON.stringify(false));
            return;
        }
        if (response) {
            console.log(response);
            res.status(200);
            res.end(JSON.stringify(response));
            return;
        }
    });
});

// reset password
app.post("/updatepayment", function(req, res, next) {
    console.log("Update Payment: " + JSON.stringify(req.body));
    userClient.updatePayment({"username":sessionData.username,
                        "creditcardprovider":req.body.creditcardprovider,
                        "creditcardnumber":req.body.creditcardnumber,
                        "creditcardname":req.body.creditcardname,
                        "creditcardexpiry":req.body.creditcardexpiry,
    },(err,response)=>{
        if (err !== null ) {
            console.log("error "+JSON.stringify(err));
            res.status(500);
            res.end(JSON.stringify(false));
            return;
        }
        if (response) {
            console.log(response);
            res.status(200);
            res.end(JSON.stringify(response));
            return;
        }
    });
});
app.get("/accountdetails", function (req, res, next) {
    console.log("Request received: " + req.url );
    const username=req.body.username?req.body.username:sessionData.username;
    userClient.getAccountDetails({"username":username},(err, response) => {
        console.log("Response received");
            if(response){
                console.log("user data returned " + JSON.stringify(response));
                res.writeHeader(200);
                res.write(JSON.stringify(response));
                res.end();
            }
            if(err){
                console.log("user account data fetch failed: " + JSON.stringify(err));
                res.writeHeader(401);
                res.write(JSON.stringify(err));
                res.end();
            }
    });
});
app.post("/accountdetails", function (req, res, next) {
    console.log("Request received: " + req.url );
    const username=req.body.username?req.body.username:sessionData.username;
    userClient.updateAccountDetails({"username":username,
                                     "firstname":req.body.firstname,
                                     "lastname":req.body.lastname,
                                     "email":req.body.email,
                                     "phonenumber":req.body.phonenumber
        },(err, response) => {
        console.log("Response received");
            if(response){
                console.log("user data updated " + JSON.stringify(response));
                res.writeHeader(200);
                res.write(JSON.stringify(response));
                res.end();
            }
            if(err){
                console.log("user account data update failed: " + JSON.stringify(err));
                res.writeHeader(401);
                res.write(JSON.stringify(err));
                res.end();
            }
    });
});

app.get("/users", function (req, res, next) {
    userClient.readUsers({"id":1},(err, response) => {
        console.log("Response received");
            if(response){
                console.log("Users data returned " + JSON.stringify(response));
                res.writeHeader(200);
                if(response.users){
                res.write(JSON.stringify(response.users));
                }else{
                res.write(JSON.stringify([]));
                }
                res.end();
            }
            if(err){
                console.log("Catalogue data fetch failed: " + JSON.stringify(err));
                res.writeHeader(401);
                res.write(JSON.stringify(response));
                res.end();
            }
    });
  });
app.listen(PORT, function(error){ 
	if(error) throw error 
	console.log("Server created Successfully on PORT :", PORT) 
}) 

