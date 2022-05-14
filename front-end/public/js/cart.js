$(document).ready(function () {
    // on page load existing cart data
    getCart();
});
var Cartheaders = ["Product Name", "Price", "Picture", "delete", "Quantity","Total"];
function getCart() {
    $.ajax({
        dataType: "json",
        url: "/cart",
        success: function (data) {
            displayCart(data, "cart");
        }
    });
}

function displayCart(cart, name) {
    var out = "<h1> Shopping Cart</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Cartheaders.length; i++) {
        out += '<th >' + Cartheaders[i] + '</th>';
    }
    out += "</tr>";
    var total=0;
    for (i = 0; i < cart.length; i++) {
        out += "<tr>";
        out += '<td>' + cart[i].name + '</td>';
        out += '<td>' + cart[i].price + '</td>';
        out += '<td> <img src="';
        out += "images/" + cart[i].image + '" style="width:104px;height:100px;">';
        out += '<td> <button onclick="deleteCartItem(' + cart[i].cartId;
        out1 = ")" + '">Delete</button></td>';
        out += out1;
        out += '<td>' + cart[i].quantity + '</td>';
        out += '<td>' + cart[i].price* cart[i].quantity + '</td>';
        out += "</tr>";
        total += cart[i].price* cart[i].quantity;
    }
    out += '<tfoot><tr><td style="background:#000;color:#fff"><b>Total</b></td><td colspan="5"><b>'+total+'</b></td></tr></tfoot>';
    out += '</table>';
    out += '<br>';
    out += '<button style="background:#ff6900;color:#fff;padding:5px;border:none;font-size:large;cursor:pointer" onclick="checkout()">Checkout</button><br>';
    out+='<div id="cartmessage"></div>';
    document.getElementById(name).innerHTML = out;
}

function deleteCartItem(cartId) {
    var o ={id: cartId};
    var fd =JSON.stringify(o);
    $.ajax
    ({
        type: "POST",
        url: "/delete",
        contentType: 'application/json',
        data: fd,
        success: function (data) {
            alert("The product is removed from the cart");
            //refresh cart
            getCart();

        },
        error:function(error){
            alert("Operation failed! " + error.responseText);
        }
    });
}

function checkout() {
    let proceed = confirm("Are you sure to buy these products?");
    if(proceed){
        $.post(
            "/checkout",
            {
            },
            function (data) {
                $('#cartmessage').html(data);
            }
         );
    }
}