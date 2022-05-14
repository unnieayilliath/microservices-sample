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
        "login" : login,
        "updatePayment" : updatePayment,
        "resetPassword" : resetPassword,
        "getAccountDetails" : getAccountDetails,
        "updateAccountDetails": updateAccountDetails,
        "readUsers":returnUsers,
        "generateTemporaryPassword":generateTemporaryPassword
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
    const response={"result":false,"message":""};
    const isUsernameTaken=await checkUserExists(call.request.username);
    if(!isUsernameTaken){
        // validation passed
        response.result=await CreateNewUserAccount(call);
        if(response.result){
            response.message="Account is created";
        }else{
            response.message="Operation failed: Please try again";
        }
        
    }else{
        console.log("Username already taken");
        response.result=false;
        response.message="This username is not available!";
    }
    console.log(JSON.stringify(response));
    callback(null, response);
}

async function CreateNewUserAccount(call) {
    try{
         await query("INSERT INTO Customer (username, password, firstname, lastname, email, phonenumber) VALUES (?, ?, ?,?,?,?)", [call.request.username, call.request.password, call.request.firstname, call.request.lastname, call.request.email, call.request.phonenumber]);
        return true;
    }catch(err){
        console.log(err);
        console.log("Product insert query failed: " + err);
        return false;
    }
}

async function checkUserExists(username) {
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
    let users=[];
    try{
        console.log("Received request");
        users=await query("SELECT * FROM Customer")
    }catch(err){
        console.log("User read query failed: " + err);
    }
    callback(null, {users:users});
}
// 
async function login (call, callback) {
    let response={};
    console.log("Validating authentication request for " +call.request.username)
    try{
        const rows=await query(`SELECT * FROM Customer where username='${call.request.username}' and password='${call.request.password}'`);
        if(rows!=null && rows.length>0){
            response=rows[0];
        }
    }catch(err){
        console.log("Authentication query failed: " + err);
    }
    callback(null, response);
}

async function getAccountDetails (call, callback) {
    let user={};
    console.log("Getting account details for " +call.request.username)
    try{
        const rows=await query(`SELECT * FROM Customer where username='${call.request.username}'`);
        if(rows!=null && rows.length>0){
            user=rows[0];
            if(rows[0].creditcardnumber)
            {
                user.creditcardendingnumber=rows[0].creditcardnumber.substring(rows[0].creditcardnumber.length-4,rows[0].creditcardnumber.length);
            }
        }
    }catch(err){
        console.log("Product read query failed: " + err);
    }
    callback(null, user);
}

async function resetPassword (call, callback) {
    let response={};
    console.log("Resetting password for" +call.request.username)
    try{
        let rows=await query(`SELECT * FROM Customer where username='${call.request.username}' and password='${call.request.oldpassword}'`);
        if(rows!=null && rows.length>0){
            // password verification successful
            rows=await query(`UPDATE Customer SET password='${call.request.newpassword}' WHERE username='${call.request.username}'`);
            response={"result":true, "message":"Password is updated"}

        }else{
            response={"result":false, "message":"Please enter current password correctly"}
        }
    }catch(err){
        console.log("Password reset failed: " + err);
        response={"result":false, "message":"Something went wrong. Please try again"}
    }
    callback(null, response);
}

async function updatePayment (call, callback) {
    let response={};
    console.log("Update payment for" +call.request.username)
    try{
            // password verification successful
            let rows=await query(`UPDATE Customer SET creditcardprovider='${call.request.creditcardprovider}',creditcardnumber='${call.request.creditcardnumber}',creditcardname='${call.request.creditcardname}',creditcardexpiry='${call.request.creditcardexpiry}' WHERE username='${call.request.username}'`);
            response={"result":true, "message":"Payment details are updated"}
        }catch(err){
        console.log("Update payment query failed: " + err);
        response={"result":false, "message":"Something went wrong. Please try again"}
    }
    callback(null, response);
}

async function updateAccountDetails (call, callback) {
    let response={};
    console.log("Update details for" +call.request.username)
    try{
            // password verification successful
            let rows=await query(`UPDATE Customer SET firstname='${call.request.firstname}',lastname='${call.request.lastname}',email='${call.request.email}',phonenumber='${call.request.phonenumber}' WHERE username='${call.request.username}'`);
            response={"result":true, "message":"Account details are updated"}
        }catch(err){
        console.log("Update Account query failed: " + err);
        response={"result":false, "message":"Something went wrong. Please try again"}
    }
    callback(null, response);
}
async function generateTemporaryPassword (call, callback) {
    let response={};
    console.log("Generating temporary password for" +call.request.username)
    try{
            const temporaryPassword=`Welcome@${Math.floor(Math.random()*90000) + 10000}`;
            // password verification successful
            rows=await query(`UPDATE Customer SET password='${temporaryPassword}' WHERE username='${call.request.username}'`);
            response={"result":true, "message":temporaryPassword}
    }catch(err){
        console.log("Password generation failed: " + err);
        response={"result":false, "message":"Something went wrong. Please try again"}
    }
    callback(null, response);
}