
$(document).ready(function () {
   
    $('#newProductForm').on( "submit",function(event) {
        event.preventDefault();
        var o={};
        var a = $('#newProductForm').serializeArray();
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
        if(o["name"].trim()==""){
            // if name ontains only spaces then reject validation
            alert("Please enter a valid product name!");
            return;
        }
        if(o["price"].trim()=="0"){
            // if name ontains only spaces then reject validation
            alert("Please enter a valid price!");
            return;
        }
        var fd =JSON.stringify(o);
        console.log(fd);
        $.ajax
        ({
            type: "POST",
            url: "/newProduct",
            contentType: 'application/json',
            data: fd,
            success: function (response) {
                const responseData=JSON.parse(response);
                if(responseData.result){
                    alert("New product is added to catalogue!");
                    window.location.assign("index.html");
                }else{
                    document.getElementById("validationMessage").innerHTML=responseData.message;
                }
            },
            error: function(error){
                alert("Operation failed!. " + error.responseText);
                console.log(error);
            }
        });

    });
});