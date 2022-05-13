$(document).ready(function () {
    // on page load existing cart data
    getAccountDetails();

    $('#updateDetailsForm').on("submit",function(event) {
        event.preventDefault();
        var o={};
        var a = $('#updateDetailsForm').serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
       
        var fd =JSON.stringify(o);
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
function getAccountDetails() {
    $.ajax({
        dataType: "json",
        url: "/accountdetails",
        success: function (data) {
            if(data){
                accountData=data;
                displayAccountDetails(data);
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

function editAccountDetails(){
        $("#inputfname").val(accountData.firstname);
        $("#inputlname").val(accountData.lastname);
        $("#inputemail").val(accountData.email);
        $("#inputphone").val(accountData.phonenumber);
        $("#divUpdateDetails").show();
        $("#divShowDetails").hide();
}