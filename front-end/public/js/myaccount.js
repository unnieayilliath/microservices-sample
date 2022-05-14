let global_username="";
$(document).ready(function () {
    // on page load existing cart data
    getAccountDetails();

    $('#updateDetailsForm').on("submit",function(event) {
        event.preventDefault();
        var fd = ParseFormData("updateDetailsForm");
        $.ajax
        ({
            type: "POST",
            url: "/accountdetails",
            contentType: 'application/json',
            data: fd,
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
    });

    $('#changePaymentForm').on("submit",function(event) {
        event.preventDefault();
        var fd = ParseFormData("changePaymentForm");
        $.ajax
        ({
            type: "POST",
            url: "/updatepayment",
            contentType: 'application/json',
            data: fd,
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
    });


    // reset password
    $('#changePasswordForm').on("submit",function(event) {
        event.preventDefault();
        const password1=document.getElementById("p1").value;
        const password2=document.getElementById("p2").value;
        if(password1!=password2){
            alert("Passwords do not match! Please try again");
            return false;
        }
        let formData={
            "oldpassword":document.getElementById("oldPassword").value,
            "newpassword":password1,
        }
        if (global_username != "") {
            formData.username=global_username
        }
        $.ajax
        ({
            type: "POST",
            url: "/resetpassword",
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (data) {
                const response=JSON.parse(data);
                if(response.result){
                  alert(response.message);
                  logout();
                }else{
                    alert(response.message);
                }
            }
        });
    });
});
let accountData={};
function ParseFormData(formName) {
    var o={};
    if (global_username != "") {
        o["username"] = global_username;
    }
    var a = $(`#${formName}`).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    var fd = JSON.stringify(o);
    return fd;
}

function getAccountDetails() {
    const username=getParameterByName("user");
    alert(username);
    let querystring={};
    if(username && username!=""){
        querystring=`?username=${username}`;
        global_username=username;
    }
    $.ajax({
        dataType: "json",
        url: `/accountdetails${querystring}`,
        success: function (data) {
            if(data){
                accountData=data;
                displayAccountDetails(data);
                displayPaymentDetails(data);
            }
        }
    });
}

function displayAccountDetails(data){

    const html=`<h3>${data.username}</h3>
    <table>
        <tr>
            <td>Firstname</td>
            <td><span>${data.firstname}</span></td>
        </tr>
        <tr>
            <td>Lastname</td>
            <td><span>${data.lastname}</span></td>
        </tr>
        <tr>
            <td>Email</td>
            <td><span>${data.email}</span></td>
        </tr>
        <tr>
            <td>Phone</td>
            <td><span>${data.phonenumber?data.phonenumber:""}</span></td>
        </tr>
    </table>
    <br/>
    <input type="submit" class="btn" value="Edit" onclick="editAccountDetails()">`
    document.getElementById("divShowDetails").innerHTML = html;
    $("#divUpdateDetails").hide();
    $("#divShowDetails").show();
}

function displayPaymentDetails(data){
    let html="<h3>Payment Details</h3>";
    if(data.creditcardprovider){
        html+=`
        <table>
            <tr>
                <td>Card Type</td>
                <td><span>${data.creditcardprovider}</span></td>
            </tr>
            <tr>
                <td>Card Ending:</td>
                <td><span>${data.creditcardendingnumber}</span></td>
            </tr>
        </table>`
    }else{
        html+=`Payment method is not entered.`
    }
    html+=`<br/><br/><input type="submit" class="btn" onclick="editPaymentDetails()" value="Edit">`;
    document.getElementById("divShowPayment").innerHTML = html;
    $("#divShowPayment").show();
    $("#divChangePayment").hide();
}

function editAccountDetails(){
        $("#inputfname").val(accountData.firstname);
        $("#inputlname").val(accountData.lastname);
        $("#inputemail").val(accountData.email);
        $("#inputphone").val(accountData.phonenumber);
        $("#divUpdateDetails").show();
        $("#divShowDetails").hide();
}
function editPaymentDetails(){
    $("#divShowPayment").hide();
    $("#divChangePayment").show();
}