/*
  Data Page Javascript
*/

console.log("Hello from sql.");

//execute SQL Button
document.getElementById("btnExecuteSQL").addEventListener("click", function () {
  showLoader("loaderDIV");
  resetDataTable("dataTable");
  let sqlQueryText = document.getElementById("txtSQLData").value;
  let sqlQuery = {
    sqlQuery: sqlQueryText,
    sqlValues: [],
  };
  let columnNames = undefined;
  let sqlStatementType = undefined;
  let currentTableName = undefined;
  (async () => {
    //what happened SELECT, CREATE, ...
    if (sqlQueryText.match(/CREATE TABLE/i)) {
      sqlStatementType = "CREATE";
      currentTableName = sqlQueryText.match(/CREATE TABLE\s(\w+)/i)[1];
    } else if (sqlQueryText.match(/SELECT/i)) {
      sqlStatementType = "SELECT";
      currentTableName = sqlQueryText.match(/FROM\s(\w+)/i)[1];
      columnNames = await getColumnNames(currentTableName);
    }else if (sqlQueryText.match(/DROP TABLE/i)) {
      sqlStatementType = "DROP TABLE";
      currentTableName = sqlQueryText.match(/DROP TABLE\s(\w+)/i)[1];
    }

    let data = await databaseCRUD(sqlQuery);

    if (data["error"] == "") {
      hideError();
      if (sqlStatementType == "SELECT") {
        let values = data["result"];
        createDataTable("dataTable", values, columnNames);
      } else if (sqlStatementType == "CREATE") {
        showSuccess("Table " + currentTableName + " created successfully.");
      } else if (sqlStatementType == "DROP TABLE") {
        showSuccess("Table " + currentTableName + " deleted successfully.");
      } 
      hideLoader("loaderDIV");
    } else {
      showError(data["error"]["errorInfo"]);
      hideLoader("loaderDIV");
    }
  })();
});

//creates a table of the database results
function resetDataTable(tableId) {
  document.getElementById(tableId).innerHTML = "";
}
function createDataTable(tableId, dataValues, columnNames) {
  let dataTable = document.getElementById(tableId);
  dataTable.innerHTML = "";
  let dataTableHead = createElement("thead", {});
  let dataTableTr = createElement("tr", {});
  //create header columns
  columnNames.forEach((column) => {
    dataTableTr.appendChild(createElement("th", {}, column));
  });
  dataTableHead.appendChild(dataTableTr);
  dataTable.appendChild(dataTableHead);

  //create rows with items
  let dataTableBody = createElement("tbody", {});
  dataValues.forEach((row) => {
    let dataTableBodyTr = createElement("tr", {});
    Object.values(row).forEach((item) => {
      dataTableBodyTr.appendChild(createElement("td", { dataTest: "2" }, item));
    });
    dataTableBody.appendChild(dataTableBodyTr);
  });

  dataTable.appendChild(dataTableBody);
}
// START
