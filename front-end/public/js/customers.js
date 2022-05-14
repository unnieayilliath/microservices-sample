$(document).ready(function () {
    getUsers();
});
function getUsers() {
    $.ajax({
        dataType: "json",
        url: "/users",
        success: function (data) {
            displayUsers(data);
        }
    });
}
var Userheaders = ["User Name", "Firstname", "Lastname", "Email", "isAdmin"];
function displayUsers(users) {
    var out = "<h1> Users </h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Userheaders.length; i++) {
        out += '<th >' + Userheaders[i] + '</th>';
    }
    out += "</tr>";
    for (i = 0; i < users.length; i++) {
        out += "<tr>";
        out += '<td>' + users[i].username + '</td>';
        out += '<td>' + users[i].firstname + '</td>';
        out += '<td>' + users[i].lastname + '</td>';
        out += '<td>' + users[i].email + '</td>';
        out += '<td>' + users[i].isAdmin + '</td>';
        out += "</tr>";
    }
    out += '<tfoot><tr><td style="background:#000;color:#fff"><b>Total</b></td><td colspan="5"><b>'+users.length+'</b></td></tr></tfoot>';
    out += '</table>';
    out += '<br>';
    out += '<button style="background:#ff6900;color:#fff;padding:5px;border:none;font-size:large" onclick="checkout()">Checkout</button><br>';
    out+='<div id="cartmessage"></div>';
    document.getElementById("divCustomers").innerHTML = out;
}
