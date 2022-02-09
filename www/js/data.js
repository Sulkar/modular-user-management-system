/*
  Data Page Javascript
*/

console.log("Hello from data.");

//load data
function loadDataData() {
  showLoader("loaderDIV");
  let profileData = {
    sqlQuery: "SELECT * FROM students",
    sqlValues: [],
  };
  (async () => {
    let data = await databaseCRUD(profileData);
    console.log(data);
    removeLoader("loaderDIV");
    if (data["error"] == "") {
      if (data["result"].length > 0) {
        // fill DOM with data
        createDataTable("dataTable", data["result"]);
      }
    } else {
      showError(data["error"]["errorInfo"]);
    }
  })();
}

//creates a table of the database results
function createDataTable(tableId, dataResult) {
  let dataTable = document.getElementById(tableId);
  dataTable.innerHTML = "";
  let dataTableHead = createElement("thead", {});
  let dataTableTr = createElement("tr", {});
  //create header columns
  Object.keys(dataResult[0]).forEach((headerItem) => {
    dataTableTr.appendChild(createElement("th", {}, headerItem));
  });
  dataTableHead.appendChild(dataTableTr);
  dataTable.appendChild(dataTableHead);

  //create rows with items
  let dataTableBody = createElement("tbody", {});
  dataResult.forEach((row) => {
    let dataTableBodyTr = createElement("tr", {});
    Object.values(row).forEach((item) => {
      dataTableBodyTr.appendChild(createElement("td", {}, item));
    });
    dataTableBody.appendChild(dataTableBodyTr);
  });

  dataTable.appendChild(dataTableBody);
}

//create Database Table "students" Button
document
  .getElementById("btnCreateDatabaseTable")
  .addEventListener("click", function () {
    let createStudentsTableData = {
      sqlQuery:
        "CREATE TABLE students ( id int NOT NULL AUTO_INCREMENT PRIMARY KEY, firstname varchar(100), lastname varchar(100), country varchar(100), birth_date DATE )",
      sqlValues: [],
    };
    (async () => {
      let data = await databaseCRUD(createStudentsTableData);
      console.log(data);
      if (data["error"] == "") {
        // fill DOM with data
        showSuccess("Created table students");
      } else {
        showError(data["error"]["errorInfo"]);
      }
    })();
  });

//Modal: import data button
document
  .getElementById("btnImportDataModal")
  .addEventListener("click", function () {
    let dataToImport = document.getElementById("txtImportData").value;
    let columnsArray = [":firstname", ":lastname", ":country", ":birth_date"];
    let sqlValues = createSqlValues(dataToImport, columnsArray);
    let insertStudentsTableData = {
      sqlQuery:
        "INSERT INTO students (firstname, lastname, country, birth_date) VALUES (:firstname, :lastname, :country, :birth_date)",
      sqlValues: sqlValues,
    };
    (async () => {
      let data = await databaseCRUD(insertStudentsTableData);
      console.log(data);
      if (data["error"] == "") {
        // fill DOM with data
        showSuccess("Inserted data into table students");
        loadDataData();
      } else {
        showError(data["error"]["errorInfo"]);
      }
    })();
  });

//creates sql values out of the textarea inputs
function createSqlValues(csvData, columnsArray) {
  let sqlRows = [];
  let rowsArray = csvData.split("\n");
  rowsArray.forEach((row) => {
    let sqlRowValues = [];
    let valuesArray = row.split(",");
    valuesArray.forEach((value, index) => {
      sqlRowValues.push([columnsArray[index], value]);
    });
    sqlRows.push(sqlRowValues);
  });
  return sqlRows;
}

// START
loadDataData();
