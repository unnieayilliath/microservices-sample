var mysql = require('mysql');
const util = require('util');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("../datacontracts/order.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const orderPackage = grpcObject.orderPackage;
const server = new grpc.Server();
server.bind("0.0.0.0:1003", grpc.ServerCredentials.createInsecure());
server.addService(orderPackage.Order.service,
    {
        "createOrder": createOrder,
        "readOrders" : readOrders
    });

server.start();
var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'password',
    database: 'orderdb'
});
// for async/await mysql queries
const query = util.promisify(db.query).bind(db);

async function createOrder(call,callback) {
    let response={};
    try{
        console.log(JSON.stringify(call.request));
        const row =await query("INSERT INTO Orders (customerID, saledate, total) VALUES (?, ?, ?)", [call.request.customerID, new Date(), call.request.total]);
        const orderId=row.insertId;
        var mySQLInsertQuery = "INSERT INTO OrderDetails (orderID, productID, quantity) VALUES ? ";
        let orderDetails = [];
        if(call.request.items){
            for(i=0;i<call.request.items.length;i++)
            {
                orderDetails.push([orderId,call.request.items[i].productID,call.request.items[i].quantity]);
            }
        }
        const bulkinsert=await query(mySQLInsertQuery,[orderDetails]);
        response={"result":true,"message":"Order is created successfully!"}
    }catch(err){
        //console.log(err);
        console.log("Product insert query failed: " + err);
        response={"result":false,"message":"Operation failed!"}
    }
    callback(null, response);
}
async function readOrders(call,callback) {
    let response={};
    try{
        const rows =await query("Select * from Orders");
        response=rows;
        console.log(JSON.stringify(rows));
    }catch(err){
        console.log(err);
        console.log("Product insert query failed: " + err);
    }
    callback(null, response);
}