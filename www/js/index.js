/**
 *  Main Javascript, available from all files
 */

// header error DIV
function showError(message) {
  let errorDiv = document.getElementById("head_error");
  errorDiv.classList.remove("d-none");
  errorDiv.innerHTML = message;
  hideSuccess();
}
function hideError() {
  let errorDiv = document.getElementById("head_error");
  errorDiv.classList.add("d-none");
}
// header success DIV
function showSuccess(message) {
  let errorDiv = document.getElementById("head_success");
  errorDiv.classList.remove("d-none");
  errorDiv.innerHTML = message;
  hideError();
}
function hideSuccess() {
  let errorDiv = document.getElementById("head_success");
  errorDiv.classList.add("d-none");
}
// universal CRUD function
async function databaseCRUD(data) {
  return fetch("./db/db_CRUD.php", {
    method: "post",
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch(function (error) {
      return error;
    });
}








/*
  TESTS 
*/
let data1 = {
  table: "users",
  fields: ["username", "email"],
  values: [
    ["richi", "richi@gmail.com"],
    ["simi", "simi@gmail.com"],
  ],
};

let phpFile = "./db/db_update.php";

// database custom query CRUD

let data2 = {
  sqlQuery: "SELECT * FROM users",
  sqlValues: [],
};

let data = {
  sqlQuery:
    "INSERT INTO schueler_essen(schueler_id, essen_id, tag) VALUES(:schueler_id, :essen_id, :tag) ON DUPLICATE KEY UPDATE schueler_id = :schueler_id, essen_id = :essen_id, tag = :tag",
  sqlValues: [
    [
      [":schueler_id", 1],
      [":essen_id", 12001],
      [":tag", "02-08-2022"],
    ],
    [
      [":schueler_id", 31],
      [":essen_id", 1201],
      [":tag", "02-08-2022"],
    ],
    [
      [":schueler_id", 22],
      [":essen_id", 1201],
      [":tag", "02-08-2022"],
    ],
    [
      [":schueler_id", 31],
      [":essen_id", 1201],
      [":tag", "02-06-2022"],
    ],
    [
      [":schueler_id", 22],
      [":essen_id", 1201],
      [":tag", "02-06-2022"],
    ],
  ],
};

// START

document.getElementById("btnTest").addEventListener("click", function () {
  console.log("hlello");

  (async () => {
    console.log(await databaseCRUD(data2));
  })();

  console.log("ddd");
});
