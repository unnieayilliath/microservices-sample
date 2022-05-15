var mysql = require('mysql');
const util = require('util');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("../datacontracts/catalogue.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const cataloguePackage = grpcObject.cataloguePackage;
const server = new grpc.Server();
server.bind("0.0.0.0:1001", grpc.ServerCredentials.createInsecure());
server.addService(cataloguePackage.Catalogue.service,
    {
        "addProduct": addToCatalogue,
        "readCatalogue" : returnCatalogue,
        "getProduct" : getProduct
    });

server.start();
var db = mysql.createConnection({
    host:     'backend-db',
    user:     'root',
    password: '12345678',
    database: 'cataloguedb'
});
// for async/await mysql queries
const query = util.promisify(db.query).bind(db);
// this method adds an item to the cart ( an in memory array in this sample)
async function addToCatalogue (call, callback) {
    console.log("Create new product");
    console.log(JSON.stringify(call.request));
    let response={};
    const isExists=await validateProduct(call.request.name);
    if(!isExists){
        // validation passed
        response=await InsertNewCatalogueItem(call);

    }else{
        response={"result":false,"message":"This product already exists!"};
    }
    callback(null, response);
}

async function InsertNewCatalogueItem(call) {
    let response={};
    try{
        var image = `car${getRandomIntInclusive(1, 6)}.jpeg`;
        const rows = await query("INSERT INTO Products (name, quantity, price,image) VALUES (?, ?, ?,?)", [call.request.name, call.request.quantity, call.request.price, image]);
        response={"result":true,"message":"This product is added to catalogue!"};
    }catch(err){
        console.log(err);
        console.log("Product insert query failed: " + err);
        response={"result":false,"message":"Operation failed!"};
    }
    return response;
}

async function validateProduct(productName) {
    try{
        const rows=await query(`SELECT * FROM Products where name='${productName}'`);
        console.log(rows.length)
        return rows != null && rows.length > 0;
    }
    catch(err){
        console.log("Product validation query failed: " + err);
        return false;
    }
}
// this method streams cart items back to client
async function returnCatalogue(call, callback) {
    let products=[];
    try{
        console.log("Received request");
        products=await query("SELECT * FROM products");
    }catch(err){
        console.log("Product read query failed: " + err);
        return false;
    }
    callback(null, {items:products});
}

// 
async function getProduct (call, callback) {
    let product={};
    try{
        console.log(call);
        const rows=await query(`SELECT * FROM products where productID=${call.request.productID}`);
        if(rows!=null && rows.length>0){
            product=rows[0];
        }
    }catch(err){
        console.log("Product read query failed: " + err);
    }
    callback(null, product);
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
