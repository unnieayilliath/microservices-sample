const nav=[
            {"text":"Show Products","page":"index.html"},
            {"text":"Show Cart","page":"cart.html"},
            {"text":"Login","page":"login.html"},
            {"text":"Register","page":"register.html"},
            {"text":"New Product","page":"newproduct.html"}
          ]
$(document).ready(function () {
    // on page load existing cart data
    displaySideNav();
});
function redirect(page){
    window.location.assign(page);
}
function displaySideNav() {
    let navHtml=""
    for(i=0; i<nav.length;i++){
        navHtml+="<li><button onclick='redirect(&quot;"+nav[i].page +"&quot;)'>" +  nav[i].text + "</button></li>";
    }
    document.getElementById("sideNav").innerHTML = navHtml;
}