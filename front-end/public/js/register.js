

$(document).ready(function () {
    // register form submit event handler
    $('#registerForm').on( "submit",function(event) {
        event.preventDefault();
        $("#register").hide();
        var o={};
        var a = $('#registerForm').serializeArray();
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
        console.log(fd);
        $.ajax
        ({
            type: "POST",
            url: "/register",
            contentType: 'application/json',
            data: fd,
            success: function () {

                alert("Thanks!");
            }
        });

    });
});