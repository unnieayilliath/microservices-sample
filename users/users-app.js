var mysql = require('mysql');
const util = require('util');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("../datacontracts/user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.userPackage;
const server = new grpc.Server();
server.bind("0.0.0.0:1002", grpc.ServerCredentials.createInsecure());
server.addService(userPackage.User.service,
    {
        "register": register,
        "login" : login
    });

server.start();
var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'password',
    database: 'customerdb'
});
// for async/await mysql queries
const query = util.promisify(db.query).bind(db);
// this method adds an item to the cart ( an in memory array in this sample)
async function register (call, callback) {
    console.log("Register new user");
    const result=false;
    const validationResult=await validateUser(call.request.username);
    if(validationResult){
        // validation passed
        result=await CreateNewUserAccount(call);
    }
    callback(null, result);
}

async function CreateNewUserAccount(call) {
    try{
         await query("INSERT INTO Customer (username, password, address) VALUES (?, ?, ?)", [call.request.username, call.request.password, call.request.address]);
        return true;
    }catch(err){
        console.log(err);
        console.log("Product insert query failed: " + err);
        return false;
    }
}

async function validateUser(username) {
    try{
        const rows=await query(`SELECT * FROM Customer where username='${username}'`);
        return rows != null && rows.length > 0;
    }
    catch(err){
        console.log("Registration validation query failed: " + err);
        return false;
    }
}
// this method streams cart items back to client
async function returnUsers(call, callback) {
    let products=[];
    try{
        console.log("Received request");
        products=await query("SELECT * FROM Customer")
    }catch(err){
        console.log("Product read query failed: " + err);
        return false;
    }
    callback(null, {items:products});
}
// 
async function login (call, callback) {
    let product={};
    console.log("Validating authentication request for " +call.request.username)
    try{
        const rows=await query(`SELECT * FROM Customer where username='${call.request.username}' and password='${call.request.password}'`);
        if(rows!=null && rows.length>0){
            product=rows[0];
        }
    }catch(err){
        console.log("Product read query failed: " + err);
    }
    callback(null, product);
}
