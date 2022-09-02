/**
 *  Startpage Javascript
 */

//create Database Table "users" Button
document.getElementById("btnCreateDbTable").addEventListener("click", function () {
  let createUsersTableQuery = "CREATE TABLE users ( id int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(100), password varchar(100), email varchar(100) )";
  //username: admin, password: admin
  let insertAdminAccountQuery = "INSERT INTO users (username, password, email) VALUES ('admin', '$2y$10$oVTOgeJfF0jZTaoDQia9jeZ8GPS78kHgje6fEmF4CcnXjTxOomRem', 'admin@example.com')";

  //create table users
  (async () => {
    let data = await globalDatabaseCRUD(createUsersTableQuery);
    if (data["error"] == "") {
      //create admin/admin account
      (async () => {
        let data = await globalDatabaseCRUD(insertAdminAccountQuery);
        if (data["error"] == "") {
          globalShowSuccess("Created table users and admin/admin account.");
        } else {
          globalShowError(data["error"]["errorInfo"]);
        }
      })();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
});

// START
