/*
  Data Page Javascript
*/

console.log("Hello from data.");
let CURRENT_TABLE_NAME = undefined;
let CURRENT_COLUMN_NAMES = [];
let CURRENT_TABLE_VALUES = [];
let UPDATE_VALUES = [];
let DELETE_VALUES = [];

$(document).ready(function () {
  $("#summernote").summernote();
});

//load data
function loadDataData() {
  showLoader("loaderDIV");
  resetDataTable("dataTable");
  CURRENT_TABLE_NAME = "essen";
  let profileData = {
    sqlQuery: "SELECT * FROM " + CURRENT_TABLE_NAME,
    sqlValues: [],
  };
  (async () => {
    CURRENT_COLUMN_NAMES = await getColumnNames(CURRENT_TABLE_NAME);
    let data = await databaseCRUD(profileData);

    hideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      createEssenDataTable("dataTable", CURRENT_TABLE_VALUES, CURRENT_COLUMN_NAMES);
    } else {
      showError(data["error"]["errorInfo"]);
    }
  })();
}

//resets created databse table
function resetDataTable(tableId) {
  document.getElementById(tableId).innerHTML = "";
}
//creates a table of the database results
function createEssenDataTable(tableId, dataValues, columnNames) {
  let dataTable = document.getElementById(tableId);
  dataTable.innerHTML = "";
  let essenTable = "<thead><tr>";
  //create header columns
  columnNames.forEach((column) => {
    essenTable += "<th>" + column + "</th>";
  });
  //add edit column
  essenTable += "<th>edit</th></thead>";

  essenTable += "<tbody>";
  //create rows with items
  dataValues.forEach((row, index1) => {
    essenTable += "<tr>";
    Object.values(row).forEach((item, index2) => {
      if (index2 == 0) {
        essenTable += "<td class='sqlID' id='id_" + index1 + "'_'" + index2 + "'>";
        essenTable += item;
        essenTable += "</td>";
      } else {
        essenTable += "<td id='id_" + index1 + "'_'" + index2 + "'>";
        essenTable += item;
        essenTable += "</td>";
      }
    });

    let penIcon =
      "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg>";
    essenTable += "<td><span id='" + Object.values(row)[0] + "' class='essenEdit'>" + penIcon + "</span></td>";
    essenTable += "</tr>";
  });
  essenTable += "</tbody>";

  $("#" + tableId).append(essenTable);

  $(".essenEdit").on("click", function(){
    console.log(this.id)
    //open modal with data for editing
  })
}


//Modal: import data button
document.getElementById("btnNeuesEssenErstellen").addEventListener("click", function () {
  // TODO ....
  let essenName = $("#txtEssenName").val();
  let essenTag = $("#selectTag").val();
  let essenBeschreibungHtml = $("#summernote").summernote("code");

  //create dynamic sql statement based on current table
  let sqlQuery = "INSERT INTO essen (name, tag, beschreibung) VALUES ('" + essenName + "','" + essenTag + "','" + essenBeschreibungHtml + "')";

  (async () => {
    let data = await databaseDirectCRUD(sqlQuery);
    if (data["error"] == "") {
      // fill DOM with data
      showSuccess("Inserted data into table ");
      //loadDataData();
    } else {
      showError(data["error"]["errorInfo"]);
    }
  })();
});

async function fillSelectTables() {
  let selectTables = document.getElementById("selectTables");
  let tableNames = await getTableNames();
  let options = tableNames.map((tname) => `<option value=${tname.toLowerCase()}>${tname}</option>`).join("\n");
  selectTables.innerHTML = options;
}

// START - fill select then load data
loadDataData();
