/*
  Profile Page Javascript
*/

console.log("Hello from profile.");

//update email Button
function loadProfileData() {
  let profileData = {
    sqlQuery: "SELECT username, email FROM users WHERE id = :id",
    sqlValues: [[[":id", "SESSION_id"]]],
  };
  //update db
  (async () => {
    let data = await globalDatabaseCRUD(profileData);
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
  let dataUpdateEmail = {
    sqlQuery: "UPDATE users SET email = :email WHERE id = :id",
    sqlValues: [
      [
        [":email", document.getElementById("newEmail").value],
        [":id", "SESSION_id"],
      ],
    ],
  };
  //update db
  (async () => {
    let data = await globalDatabaseCRUD(dataUpdateEmail);
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
document
  .getElementById("changePasswordButton")
  .addEventListener("click", function () {
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

// START
loadProfileData();