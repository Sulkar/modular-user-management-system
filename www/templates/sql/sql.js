/*
  Data Page Javascript
*/

console.log("Hello from sql.");

//execute SQL Commands
$("#btnSqlAddColumn").on("click", function () {
  $("#txtSQLData").val("ALTER TABLE users ADD COLUMN klasse VARCHAR(10) AFTER email;");
});
$("#btnSqlRemoveColumn").on("click", function () {
  $("#txtSQLData").val("ALTER TABLE users DROP COLUMN klasse;");
});
$("#btnSqlCreateTable").on("click", function () {
  $("#txtSQLData").val("CREATE TABLE students (id INT(6) AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(30), lastname VARCHAR(30), email VARCHAR(50));");
});
$("#btnSqlDeleteTable").on("click", function () {
  $("#txtSQLData").val("DROP TABLE students;");
});
$("#btnSqlAlterColumn").on("click", function () {
  $("#txtSQLData").val("ALTER TABLE students MODIFY email TEXT;");
});



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
    } else if (sqlQueryText.match(/DROP TABLE/i)) {
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
