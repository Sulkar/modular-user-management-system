/*
  Data Page Javascript
*/

let CURRENT_TABLE_NAME = undefined;
let CURRENT_COLUMN_NAMES = [];
let CURRENT_TABLE_VALUES = [];
let UPDATE_VALUES = [];
let DELETE_VALUES = [];

//update speicher button
function updateBtnSpeichern(type) {
  if (type == "success") {
    document.getElementById("btnSaveData").classList.remove("btn-danger");
    document.getElementById("btnSaveData").classList.add("btn-success");
  } else {
    document.getElementById("btnSaveData").classList.remove("btn-success");
    document.getElementById("btnSaveData").classList.add("btn-danger");
  }
}

//load data
function loadDataData() {
  globalShowLoader("loaderDIV");
  resetDataTable("dataTable");
  CURRENT_TABLE_NAME = document.getElementById("selectTables").value;
  let sqlQuery = "SELECT * FROM " + CURRENT_TABLE_NAME;

  (async () => {
    CURRENT_COLUMN_NAMES = await globalGetColumnNames(CURRENT_TABLE_NAME);
    let data = await globalDatabaseCRUD(sqlQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      createEditableDataTable("dataTable", CURRENT_TABLE_VALUES, CURRENT_COLUMN_NAMES);
      fillModalWithTableColumns(CURRENT_TABLE_NAME);
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

async function fillModalWithTableColumns(CURRENT_TABLE_NAME) {
  let columns = await globalGetColumnNames(CURRENT_TABLE_NAME);
  document.getElementById("columnsSpan").innerHTML = "" + columns.join(", ").replace("id, ", "");
  document.getElementById("txtImportData").innerHTML = "" + columns.join(", ").replace("id, ", "");
}

//resets created databse table
function resetDataTable(tableId) {
  document.getElementById(tableId).innerHTML = "";
}
//creates a table of the database results
function createEditableDataTable(tableId, dataValues, columnNames) {
  let dataTable = document.getElementById(tableId);
  dataTable.innerHTML = "";
  let dataTableHead = globalCreateElement("thead", {});
  let dataTableTr = globalCreateElement("tr", {});
  //create header columns
  columnNames.forEach((column) => {
    dataTableTr.appendChild(globalCreateElement("th", {}, column));
  });
  //add edit column
  dataTableTr.appendChild(globalCreateElement("th", {}, "edit"));
  dataTableHead.appendChild(dataTableTr);
  dataTable.appendChild(dataTableHead);

  //create rows with items
  let dataTableBody = globalCreateElement("tbody", {});
  dataValues.forEach((row, index1) => {
    let dataTableBodyTr = globalCreateElement("tr", {});
    Object.values(row).forEach((item, index2) => {
      if (index2 == 0) {
        let currentTd = globalCreateElement("td", { className: "sqlID", id: "id_" + index1 + "_" + index2 }, item);
        dataTableBodyTr.appendChild(currentTd);
      } else {
        let currentTd = undefined;
        if (item.length > 250) {
          item = item.substring(0, 250);
          item += " ...";
          currentTd = globalCreateElement("td", { id: "id_" + index1 + "_" + index2, className: "wordBreakAll textTooLong" }, item);
        } else {
          currentTd = globalCreateElement("td", { id: "id_" + index1 + "_" + index2, className: "" }, item);
          currentTd.addEventListener("click", function (e) {
            e.stopPropagation();
            this.setAttribute("contenteditable", "true");
            this.focus();
            updateBtnSpeichern("danger");
          });
        }

        dataTableBodyTr.appendChild(currentTd);
      }
    });
    //add edit symbols 1) deleteButton
    let deleteButton = globalCreateElement("span", { className: "deleteButton", id: Object.values(row)[0] }, "X");
    deleteButton.style.color = "red";
    deleteButton.style.cursor = "Pointer";
    deleteButton.addEventListener("click", function () {
      deleteRowTemporary(this.id);
    });
    dataTableBodyTr.appendChild(globalCreateElement("td", {}, deleteButton));

    dataTableBody.appendChild(dataTableBodyTr);
  });

  dataTable.appendChild(dataTableBody);
}

//button save data
document.getElementById("btnSaveData").addEventListener("click", function () {
  checkForUpdates();
  updateBtnSpeichern("success");
  let updateQuery = createUpdateQuery();
  let deleteQuery = createDeleteQuery();

  if (updateQuery != undefined) {
    (async () => {
      let data = await globalDatabaseCRUD(updateQuery);
      if (data["error"] == "") {
        // fill DOM with data
        globalShowSuccess("Data updated successfully");
        loadDataData();
      } else {
        globalShowError(data["error"]["errorInfo"]);
      }
    })();
  }
  if (deleteQuery != undefined) {
    (async () => {
      let data = await globalDatabaseCRUD(deleteQuery);
      if (data["error"] == "") {
        // fill DOM with data
        globalShowSuccess("Data deleted successfully");
        loadDataData();
      } else {
        globalShowError(data["error"]["errorInfo"]);
      }
    })();
  }
});

function getRowFromId(tempId) {
  return tempId.match(/(id_)(\d+)_(\d+)/)[2];
}

function createUpdateQuery() {
  let updateQuery = ""; // UPDATE students SET score1 = 5, score2 = 8 WHERE id = 1;
  UPDATE_VALUES.forEach((updateValue) => {
    updateQuery += "UPDATE " + CURRENT_TABLE_NAME + " SET " + updateValue[1] + " = '" + updateValue[2] + "' WHERE id = " + updateValue[0] + ";";
  });
  if (updateQuery != "") return updateQuery;
  else return undefined;
}

function createDeleteQuery() {
  let deleteQuery = "";
  DELETE_VALUES.forEach((deleteId) => {
    deleteQuery += "DELETE FROM " + CURRENT_TABLE_NAME + " WHERE id = " + deleteId + ";";
  });
  if (deleteQuery != "") return deleteQuery;
  else return undefined;
}

//function: Sucht in der Tablle nach geänderten Werten und speichert diese im UPDATE_VALUES Array
function checkForUpdates() {
  UPDATE_VALUES = [];
  //iteriert durch alle th im body = dort werden die IDs der Tabelle aufgelistet

  document.querySelectorAll("#dataTable tbody .sqlID").forEach((element) => {
    var thisId = element.id;
    var tempRow = getRowFromId(thisId);
    var sqlIdOfRow = parseInt(element.innerHTML);
    var maxColumns = CURRENT_COLUMN_NAMES.length;

    Object.values(CURRENT_TABLE_VALUES).forEach((element) => {
      if (Object.values(element)[0] == sqlIdOfRow) {
        //check every data of current row
        for (var i = 0; i < maxColumns; i++) {
          let tempCell = document.querySelector("#id_" + tempRow + "_" + i);
          let rowCellValue = tempCell.textContent;

          if (!tempCell.classList.contains("textTooLong") && rowCellValue !== String(Object.values(element)[i])) {
            Object.values(element)[i] = rowCellValue;
            var columnName = CURRENT_COLUMN_NAMES[i];
            var rowIdValueArray = [sqlIdOfRow, columnName, rowCellValue];
            UPDATE_VALUES.push(rowIdValueArray);
          }
        }
      }
    });
  });
  return UPDATE_VALUES;
}

//select change
document.getElementById("selectTables").addEventListener("change", function () {
  updateBtnSpeichern("success");
  loadDataData();
});

//Modal: import data button
document.getElementById("btnImportDataModal").addEventListener("click", function () {
  let dataToImport = document.getElementById("txtImportData").value;

  //prepare columns Array for sql statement
  let valuesArray = dataToImport
    .split(",")
    .map((value) => value.trimLeft().trimRight())
    .map((value) => `'${value}'`);

  let columnsArray = CURRENT_COLUMN_NAMES.filter((columnName) => {
    return columnName != "id";
  });

  //create dynamic sql statement based on current table
  let importQuery = "INSERT INTO " + CURRENT_TABLE_NAME + " (" + columnsArray.join(",") + ") VALUES (" + valuesArray.join(",") + ")";

  console.log(importQuery);
  (async () => {
    let data = await globalDatabaseCRUD(importQuery);
    if (data["error"] == "") {
      // fill DOM with data
      globalShowSuccess("Inserted data into table " + CURRENT_TABLE_NAME);
      loadDataData();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
});

//function deleteRow
function deleteRowTemporary(rowId) {
  updateBtnSpeichern("danger");
  DELETE_VALUES.push(rowId);
  let deleteIndex = undefined;
  CURRENT_TABLE_VALUES.forEach((row, index) => {
    if (Object.values(row)[0] == rowId) {
      deleteIndex = index;
    }
  });
  if (deleteIndex != undefined) {
    CURRENT_TABLE_VALUES.splice(deleteIndex, 1);
  }

  resetDataTable("dataTable");
  createEditableDataTable("dataTable", CURRENT_TABLE_VALUES, CURRENT_COLUMN_NAMES);
}

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

async function fillSelectTables() {
  let selectTables = document.getElementById("selectTables");
  let tableNames = await globalGetTableNames();
  let options = tableNames.map((tname) => `<option value=${tname.toLowerCase()}>${tname}</option>`).join("\n");
  selectTables.innerHTML = options;
}

// START - fill select then load data
fillSelectTables().then(function () {
  loadDataData();
});
