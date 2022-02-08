/**
 *  Global Javascript, available from all files
 */

//universal Create Element function
function createElement(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string" && typeof child != "number")
      dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
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

