/*
  Profile Page Javascript
*/

let CURRENT_USER_ID = undefined;

//start
$(document).ready(function () {
  globalGetSessionVariables().then(function (session) {
    CURRENT_USER_ID = session.id;
    loadProfileData();
  });
});

//update email Button
function loadProfileData() {
  let profileQuery = "SELECT username, email FROM users WHERE id = " + CURRENT_USER_ID;
  //update db
  (async () => {
    let data = await globalDatabaseCRUD(profileQuery);
    if (data["error"] == "") {
      // fill DOM with data
      document.getElementById("profile_username1").innerHTML = data["result"][0].username;
      document.getElementById("profile_username2").innerHTML = data["result"][0].username;
      document.getElementById("profile_email").innerHTML = data["result"][0].email;
    } else {
      globalShowError(data["error"]);
    }
  })();
}

//update email Button
document.getElementById("updateEmail").addEventListener("click", function () {
  let newEmail = document.getElementById("newEmail").value;
  let dataUpdateEmailQuery = "UPDATE users SET email = " + newEmail + " WHERE id = " + CURRENT_USER_ID;

  //update db
  (async () => {
    let data = await globalDatabaseCRUD(dataUpdateEmailQuery);
    console.log(data);
    if (data["error"] == "") {
      globalShowSuccess("Email changed successfully.");
      loadProfileData();
    } else {
      globalShowError(data["error"]);
    }
  })();
});

//change password Button
document.getElementById("changePasswordButton").addEventListener("click", function () {
  let dataChangePassword = {
    newPassword: document.getElementById("newPassword").value,
    confirmPassword: document.getElementById("confirmPassword").value,
  };
  databaseChangePassword(dataChangePassword);
});

//database change password
function databaseChangePassword(data) {
  fetch("/templates/profile/db_update_password.php", {
    method: "post",
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch(function (error) {
      console.log(error);
    })
    .then((data) => {
      //
      console.log(data);
      if (data["passwordChanged"]) {
        globalShowSuccess(data["result"]);
      } else {
        globalShowError(data["error"]);
      }
    });
}
