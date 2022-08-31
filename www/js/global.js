/**
 *  Global Javascript, available from all files
 *  all functions have the prefix "global"
 */
var LOADING = false;

//universal Create Element function
function globalCreateElement(type, props, ...children) {
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
function globalShowLoader(parentElementID) {
  let parent = document.getElementById(parentElementID);
  let loader = globalCreateElement(
    "div",
    {
      id: "loader",
      className: "d-flex justify-content-center align-items-center my-2",
    },
    //child 1
    globalCreateElement("div", { className: "spinner-border text-success", role: "status" }, globalCreateElement("span", { className: "visually-hidden" }, "Loading...")),
    //child 2
    globalCreateElement("span", { className: "ms-2 text-success" }, "Loading...")
  );

  parent.appendChild(loader);
  LOADING = true;
}
function globalHideLoader(parentElementID) {
  let parent = document.getElementById(parentElementID);
  parent.innerHTML = "";
  LOADING = false;
}
function globalIsLoading() {
  return LOADING;
}
// header error DIV
function globalShowError(message) {
  let errorDiv = document.getElementById("head_error");
  errorDiv.classList.remove("d-none");
  errorDiv.innerHTML = message;
  globalHideSuccess();
}
function globalHideError() {
  let errorDiv = document.getElementById("head_error");
  errorDiv.classList.add("d-none");
}
// header success DIV
function globalShowSuccess(message) {
  let errorDiv = document.getElementById("head_success");
  errorDiv.classList.remove("d-none");
  errorDiv.innerHTML = message;
  globalHideError();
}
function globalHideSuccess() {
  let errorDiv = document.getElementById("head_success");
  errorDiv.classList.add("d-none");
}
// universal CRUD function
async function globalDatabaseCRUD(data) {
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
async function globalDatabaseDirectCRUD(query) {
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
function globalGetTableColumns(data) {
  return Object.keys(data[0]);
}

// get SESSION variables
async function globalGetSessionVariables() {
  return fetch("./db/getSessionVariable.php", {
    method: "post",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.result;
    })
    .catch(function (error) {
      return error;
    });
}

//get column names from table
async function globalGetColumnNames(currentTableName) {
  let sqlGetColumnsQuery = {
    sqlQuery: "SHOW COLUMNS FROM " + currentTableName,
    sqlValues: [],
  };
  let columnData = await globalDatabaseCRUD(sqlGetColumnsQuery);
  let columnArray = [];
  columnData.result.forEach((element) => {
    columnArray.push(element["Field"]);
  });
  return columnArray;
}

//get all tables from database
async function globalGetTableNames() {
  let sqlGetTablesQuery = {
    sqlQuery: "SHOW TABLES",
    sqlValues: [],
  };
  let tablesData = await globalDatabaseCRUD(sqlGetTablesQuery);
  let tableArray = [];
  tablesData.result.forEach((element) => {
    tableArray.push(Object.values(element)[0]);
  });
  return tableArray;
}
