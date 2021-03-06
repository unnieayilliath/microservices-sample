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
var Userheaders = ["Customer ID","User Name", "Firstname", "Lastname", "Email", "isAdmin","",""];
function displayUsers(users) {
    var html = `<h1> Users </h1>
                <table border=1 width=100%>
                <tr style="font-size: 20px;" >`;
    var i;
    for (i = 0; i < Userheaders.length; i++) {
        html += `<th >${Userheaders[i]}</th>`;
    }
    html += "</tr>";
    for (i = 0; i < users.length; i++) {
        html += `<tr>
                <td>${users[i].customerID}</td>
                <td>${users[i].username}</td>
                <td>${users[i].firstname}</td>
                <td>${users[i].lastname}</td>
                <td>${users[i].email}</td>
                <td>${users[i].isAdmin}</td>
                <td><button onclick="editUser('${users[i].username}')">Edit</button></td>
                <td><button onclick="viewOrders('${users[i].username}','${users[i].firstname} ${users[i].lastname}')">View Orders</button></td>
                </tr>`;
    }
    html += `<tfoot><tr><td style="background:#000;color:#fff"><b>Total</b></td><td colspan="8"><b>${users.length}</b></td></tr></tfoot>
            </table>
            <br>`;
    document.getElementById("divCustomers").innerHTML = html;
}

function editUser(username){
    window.open(`myaccount.html?user=${username}`,"_blank");
}
function viewOrders(customerID,username){
    window.open(`orders.html?username=${customerID}&user=${username}`,"_blank");
}