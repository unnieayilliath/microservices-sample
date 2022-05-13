
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
                $('#logonmessage').html(data);
                alert("Thanks!"+data);
            }
        });
    });
});