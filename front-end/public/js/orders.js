$(document).ready(function () {
    getOrders();
});
function getOrders() {
    $.ajax({
        dataType: "json",
        url: "/orders",
        success: function (data) {
            displayOrders(data);
        }
    });
}
var Orderheaders = ["Order ID","Sale Date","No. Of Products", "Total Price","Status",""];
function displayOrders(orders) {
    var html = `<h1> Orders by ${getCustomerName()} </h1>
                <table border=1 width=100%>
                <tr style="font-size: 20px;" >`;
    var i;
    for (i = 0; i < Orderheaders.length; i++) {
        html += `<th >${Orderheaders[i]}</th>`;
    }
    html += "</tr>";
    for (i = 0; i < orders.length; i++) {
        html += `<tr>
                <td>${orders[i].orderID}</td>
                <td>${orders[i].saledate}</td>
                <td>${orders[i].productcount}</td>
                <td>${orders[i].total}</td>
                <td>${orders[i].status}</td>`;
        if(orders[i].status=="In Progress"){
            html+=`<td><button onclick="cancelOrder('${orders[i].orderID}')">Cancel Order</button></td>`;
        }
        html+=`</tr>`;
    }
    html += `<tfoot><tr><td style="background:#000;color:#fff"><b>Total</b></td><td colspan="5"><b>${orders.length}</b></td></tr></tfoot>
            </table>
            <br>`;
    document.getElementById("divOrders").innerHTML = html;
}
function getCustomerName(){
    let user=getParameterByName("user");
    if(user){
        return user;
    }else{
        return getCookie("user");
    }
}

function cancelOrder(orderId){
    const payload={"orderID":orderId};
    $.ajax
    ({
        type: "POST",
        url: "/cancelorder",
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (data) {
            const response=JSON.parse(data);
            if(response.result){
              alert(response.message);
                //redirect user to home page
                window.location.reload();
            }else{
                alert(response.message);
            }
        }
    });
}