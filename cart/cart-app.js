const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("../datacontracts/cart.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const cartPackage = grpcObject.cartPackage;
const server = new grpc.Server();
server.bind("0.0.0.0:1002", grpc.ServerCredentials.createInsecure());
server.addService(cartPackage.Cart.service,
    {
        "addCartItem": addToCart,
        "readCart" : returnCart,
        "deleteCartItem" : removeFromCart,
        "clear":clearCart
    });
server.start();

let cartTable = []
// this method adds an item to the cart ( an in memory array in this sample)
function addToCart (call, callback) {
    // find the product in the cart
    let cartItem=cartTable.find(c=> c.productID==call.request.productID);
    if(cartItem){
        console.log("Updating product quantity in cart");
        // the product already exists in cart, so just update the number and price
        cartItem.quantity+=parseInt(call.request.quantity);
        cartItem.price+=parseFloat(call.request.price);
    }else{
        console.log("Adding new product to cart");
        // product is new in the cart, so add 
        cartItem = {
            "cartId": cartTable.length + 1,
            "productID": call.request.productID,
            "price": parseFloat(call.request.price),
            "quantity": parseInt(call.request.quantity),
            "image": call.request.image,
            "name": call.request.name,
        }
        cartTable.push(cartItem)
    }
    callback(null, cartItem);
}

// this method streams cart items back to client
function returnCart(call, callback) {
    console.log("Received request");
    callback(null, {items:cartTable});
}
function clearCart(call, callback) {
    console.log("Clearing cart");
    cartTable=[];
    callback(null, {"result":true});
}

// this method adds an item to the cart ( an in memory array in this sample)
function removeFromCart (call, callback) {
    let response={}
    const index=cartTable.findIndex(c=> parseInt(c.cartId)==parseInt(call.request.cartId))
    console.log(`Item found in cart at index = ${index}`)
    if(index>-1){
        // remove product from array
        cartTable.splice(index,1);
        response={result:true,message:""}
        
    }else{
        response={result:false,message:"Item not found"}
    }
    callback(null, response);
}
