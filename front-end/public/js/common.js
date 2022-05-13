$(document).ready(function () {
    // on page load existing cart data
    displaySideNav();
    //show logged in user information
    displayUserInfo();
});

const nav=[
    {"text":"Show Products","page":"index.html"},
    {"text":"Show Cart","page":"cart.html"},
    {"text":"Login","page":"login.html"},
    {"text":"Logout","page":""},
    {"text":"Register","page":"register.html"},
    {"text":"New Product","page":"newproduct.html"}
  ]
function redirect(page){
    window.location.assign(page);
}
function logout(){
    setCookie("user","",0);
    window.location.assign("login.html");
}
function displaySideNav() {
    const loggedInUser=getCookie("user");
    let navHtml=""
    for(i=0; i<nav.length;i++){
        if(nav[i].text=="Logout"){
            if(loggedInUser!=""){
                navHtml+="<li><button onclick='logout()'>" +  nav[i].text + "</button></li>";
            }
        }else if(nav[i].text=="Login"){
            if(loggedInUser=="")
            {
                navHtml+="<li><button onclick='redirect(&quot;"+nav[i].page +"&quot;)'>" +  nav[i].text + "</button></li>";
            }
        }else{
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