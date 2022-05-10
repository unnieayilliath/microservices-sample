var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")

    , app = express();


app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];

app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));
    var max = 0;
    var ind = 0;
    for (ind = 0; ind < cart.length; ind++)
        if (max < cart[ind].cartid)
            max = cart[ind].cartid;
    var cartid = max + 1;
    // find the product in the cart
    var cartItem=cart.find(c=> c.productID==obj.productID)
    // check if it exists, if it does not exists the value is undefined
    if(cartItem){
        // the product already exists in cart, so just update the number and price
        cartItem.quantity+=parseInt(obj.quantity);
        cartItem.price+=parseFloat(obj.price);
    }else{
        // product is new in the cart, so add 
        var data = {
            "cartid": cartid,
            "productID": obj.productID,
            "name": obj.name,
            "price": parseFloat(obj.price),
            "image": obj.image,
            "quantity": parseInt(obj.quantity)
        };
        cart.push(data);
    }
    console.log(JSON.stringify(cart));
    res.status(201);
    res.send("");
});

/* toDO */
app.delete("/cart/items/:id", function (req, res, next) {
    var body = '';
    console.log("Delete item from cart: for custId " + req.url + ' ' +
        req.params.id.toString());
    // find the index of the product in array
    const index=cart.findIndex(c=> parseInt(c.cartid)==parseInt(req.params.id))
    console.log(`Item found in cart at index = ${index}`)
    if(index>-1){
        // remove product from array
        cart.splice(index,1);
        res.send("Item is removed from cart");
        res.status(201);
    }else{
        res.send("Item is not found in cart!")
        res.status(500);
    }
});


app.get("/cart", function (req, res, next) {


    //var custId = req.params.custId;
    //console.log("getCart" + custId);


    //console.log('custID ' + custId);


    console.log(JSON.stringify(cart, null, 2));

    res.send(JSON.stringify(cart));
    console.log("cart sent");

});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
