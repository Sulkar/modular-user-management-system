/**
 *  Global Javascript, available from all files
 */
var LOADING = false;

//universal Create Element function
function createElement(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string" && typeof child != "number" && child != null) {
      dom.appendChild(child);
    } else {
      dom.appendChild(document.createTextNode(child));
    }
  }
  return dom;
}
//create loader spinner
function showLoader(parentElementID) {
  let parent = document.getElementById(parentElementID);
  let loader = createElement(
    "div",
    {
      id: "loader",
      className: "d-flex justify-content-center align-items-center my-2",
    },
    //child 1
    createElement("div", { className: "spinner-border text-success", role: "status" }, createElement("span", { className: "visually-hidden" }, "Loading...")),
    //child 2
    createElement("span", { className: "ms-2 text-success" }, "Loading...")
  );

  parent.appendChild(loader);
  LOADING = true;
}
function hideLoader(parentElementID) {
  let parent = document.getElementById(parentElementID);
  parent.innerHTML = "";
  LOADING = false;
}
function isLoading() {
  return LOADING;
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
// universal CRUD function
async function databaseDirectCRUD(query) {
  return fetch("./db/db_direct_CRUD.php", {
    method: "post",
    body: JSON.stringify(query),
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
//global function to get columns of table data
function getTableColumns(data) {
  return Object.keys(data[0]);
}

//get column names from table
async function getColumnNames(currentTableName) {
  let sqlGetColumnsQuery = {
    sqlQuery: "SHOW COLUMNS FROM " + currentTableName,
    sqlValues: [],
  };
  let columnData = await databaseCRUD(sqlGetColumnsQuery);
  let columnArray = [];
  columnData.result.forEach((element) => {
    columnArray.push(element["Field"]);
  });
  return columnArray;
}

//get all tables from database
async function getTableNames() {
  let sqlGetTablesQuery = {
    sqlQuery: "SHOW TABLES",
    sqlValues: [],
  };
  let tablesData = await databaseCRUD(sqlGetTablesQuery);
  let tableArray = [];
  tablesData.result.forEach((element) => {
    tableArray.push(Object.values(element)[0]);
  });
  return tableArray;
}
