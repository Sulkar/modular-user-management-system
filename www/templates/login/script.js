/*
  Login Page Javascript
*/

console.log("Hello from login.");

//Login Button
document.getElementById("loginButton").addEventListener("click", function () {
  let dataLogin = {
    username: document.getElementById("login_username").value,
    password: document.getElementById("login_password").value,
  };  
  databaseLogin(dataLogin);
});

//database login
function databaseLogin(data) {
  fetch("/templates/login/db_login.php", {
    method: "post",
    body: JSON.stringify(data),
  })
    .then((response) => {
      let responseJson = response.json();
      return responseJson;
    })
    .then((data) => {
      if (data.loggedIn) {
        window.location.href = "/";
      } else {
        globalShowError(data["error"]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
