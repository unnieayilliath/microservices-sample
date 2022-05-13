var headers = ["Product Name", "Price", "Picture", "Quantity", "Buy Button"];
$(document).ready(function () {
    getProducts();
});
function getProducts() {
    $("#products").show();
    $("#cart").hide();
    $.ajax({
        dataType: "json",
        url: "/getProducts",
        success: function (data) {
            displayProducts(data, "products");
        }
    });
}


function addToCart(prodid, fieldname) {
    var num = document.getElementById(fieldname).value;
    var dat = {
        id: prodid,
        qty : num
    };
    console.log(dat);
    $.ajax
    ({
        type: "POST",
        url: "/cart",
        contentType: 'application/json',
        //json object to sent to the authentication url
        data: JSON.stringify(dat),
        success: function () {
            alert("Added to cart!");
        }
    });
}


function displayProducts(products, name) {
    var out = "<table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < headers.length; i++) {
        out += '<th >' + headers[i] + '</th>';
    }
    out += "</tr>";
    for (i = 0; i < products.length; i++) {
        out += "<tr>";
        out += '<td>' + products[i].name + '</td>';
        out += '<td>' + products[i].price + '</td>';
        out += '<td> <img src="';
        out += "images/" + products[i].image + '" style="width:104px;height:100px;">';
        out += '<td>' + 'quantity <input type="text" value="1" name="';
        out += 'quantity' + i + '" id="quant' + i
        out += '">' + '</td>';

        out += '<td> <button onclick="addToCart(' + products[i].productID;
        out += ",'quant" + i + "')" + '">Buy</button></td>';
        out += "</tr>";
    }
    out += "</table>";
    document.getElementById(name).innerHTML = out;
}


