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
        "readOrders" : readOrders,
        "cancelOrder" : cancelOrder
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
        const row =await query("INSERT INTO Orders (customerID, saledate, total, status) VALUES (?, ?, ?,?)", [call.request.customerID, new Date(), call.request.total,"In Progress"]);
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
    console.log("Reading orders for " + call.request.customerID);
    try{
        const rows =await query(`Select Ord.*, COUNT(Det.orderID) as productcount from Orders as Ord
                                 LEFT JOIN OrderDetails as Det on Ord.orderID=Det.orderID
                                  where Ord.customerID=${call.request.customerID} group by orderID`);
        response={"orders":rows};
        console.log(JSON.stringify(rows));
    }catch(err){
        console.log(err);
        console.log("Product insert query failed: " + err);
    }
    callback(null, response);
}

async function cancelOrder(call,callback) {
    let response={};
    try{
        await query(`UPDATE Orders SET status='Cancelled' WHERE orderID='${call.request.orderID}'`);
        response={"result":true,"message":"Order is cancelled"};
    }catch(err){
        console.log(err);
        console.log("order Cancel query failed: " + err);
        response={"result":false,"message":"Operation failed!"};
    }
    callback(null, response);
}