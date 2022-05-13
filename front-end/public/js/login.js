
$(document).ready(function () {
    // register form submit handler
    $('#logonForm').on( "submit",function(event) {
        event.preventDefault();
        $("#login").hide();
        var o={};
        var a = $('#logonForm').serializeArray();
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
            url: "/login",
            contentType: 'application/json',
            data: fd,
            success: function (data) {
                const userInfo=JSON.parse(data);
                setCookie("user",userInfo.firstname+" " + userInfo.lastname,1);
                setCookie("isAdmin",userInfo.isAdmin);
                //redirect user to home page
                window.location.assign("index.html");
            }
        });
    });
});

