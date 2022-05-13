$(document).ready(function () {
    // on page load existing cart data
    displaySideNav();
    //show logged in user information
    displayUserInfo();
});

const nav=[
    {"text":"Home","page":"index.html","AdminOnly":false,"display":"always"},
    {"text":"Show Cart","page":"cart.html","AdminOnly":false,"display":"always"},
    {"text":"Logout","page":"","AdminOnly":false,"display":"authenticated"},
    {"text":"My Account","page":"myaccount.html","AdminOnly":false,"display":"authenticated"},
    {"text":"My Orders","page":"newpmyorders.html","AdminOnly":false,"display":"authenticated"},
    {"text":"Show Customers","page":"customers.html","AdminOnly":true,"display":"authenticated"},
    {"text":"New Product","page":"newproduct.html","AdminOnly":true,"display":"authenticated"},
    {"text":"Login","page":"login.html","AdminOnly":false,"display":"anonymous"},
    {"text":"Register","page":"register.html","AdminOnly":false,"display":"anonymous"},
  ]
function redirect(page){
    window.location.assign(page);
}
function logout(){
    setCookie("user","",0);
    setCookie("isAdmin",false);
    //clear server side variables
    $.ajax
    ({
        type: "POST",
        url: "/logout",
        contentType: 'application/json',
        data: "",
        success: function (data) {
            const response=JSON.parse(data);
            if(response.result){
              alert(response.message);
                window.location.reload();
            }else{
                alert(response.message);
            }
        }
    });
    window.location.assign("login.html");
}
function displaySideNav() {
    const loggedInUser=getCookie("user");
    const isLoggedInSession=loggedInUser!="";
    const isAdmin=getCookie("isAdmin");
    let navHtml=""
    for(i=0; i<nav.length;i++){

        if(nav[i].AdminOnly){
          //nav only for admins
          if(isAdmin=="true"){
            navHtml+="<li><button onclick='redirect(&quot;"+nav[i].page +"&quot;)'>" +  nav[i].text + "</button></li>";
          }
        }else if(nav[i].display=="authenticated"){
          //nav only during authenticated browsing
          if(isLoggedInSession){
            if(nav[i].text=="Logout"){
              navHtml+="<li><button onclick='logout()'>" +  nav[i].text + "</button></li>";
            }else{
              navHtml+="<li><button onclick='redirect(&quot;"+nav[i].page +"&quot;)'>" +  nav[i].text + "</button></li>";
            }
          }
        }else if(nav[i].display=="anonymous"){
          //nav only during anonymous browsing
          if(!isLoggedInSession){
              navHtml+="<li><button onclick='redirect(&quot;"+nav[i].page +"&quot;)'>" +  nav[i].text + "</button></li>";
          }
        }else{
          // navigation which are always present
          navHtml+="<li><button onclick='redirect(&quot;"+nav[i].page +"&quot;)'>" +  nav[i].text + "</button></li>";
        }
    }
    document.getElementById("sideNav").innerHTML = navHtml;
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function displayUserInfo(){
      const userDisplayname=getCookie("user");
      if(userDisplayname!=""){
        document.getElementById("spanUser").innerHTML = `Welcome, ` + userDisplayname;
      }
  }