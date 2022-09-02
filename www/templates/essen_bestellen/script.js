/*
  Essen bestellen Page Javascript
  - needs schueler_essen table:
  CREATE TABLE schueler_essen (
    id int(11) NOT NULL AUTO_INCREMENT,
    schueler_id int(11),
    essen_id int(11),
    tag varchar(15),
    PRIMARY KEY (id),
    UNIQUE KEY schueler_essen_UN (schueler_id, tag)
  );
*/

//global variables
let CURRENT_TABLE_NAME = undefined;
let CURRENT_COLUMN_NAMES = [];
let CURRENT_TABLE_VALUES = [];
let UPDATE_VALUES = [];
let DELETE_VALUES = [];
let CURRENT_EDIT_ESSEN_ID = undefined;

let SELECTED_WEEK_START = undefined;
let SELECTED_WEEK_END = undefined;

let CURRENCT_KLASSE = undefined;
let CURRENT_STUDENTS = [];

//start
$(document).ready(function () {
  fillSelectWithWeeks();
  globalGetSessionVariables().then(function (session) {
    CURRENCT_KLASSE = session.klasse;
    $("#klassenname").html(CURRENCT_KLASSE);
    loadStudentData().then(function () {
      loadEssenData().then(function () {
        loadStudentEssenData();
      });
    });
  });
});

function getIdsFromDataArray(dataArray) {
  let idArray = [];
  dataArray.forEach((row) => {
    idArray.push(row.id);
  });
  return idArray;
}

function loadStudentEssenData() {
  globalShowLoader("loaderDIV");
  CURRENT_TABLE_NAME = "schueler_essen";
  let loadStudentEssenQuery = "SELECT * FROM " + CURRENT_TABLE_NAME + " WHERE schueler_id IN (" + getIdsFromDataArray(CURRENT_STUDENTS).join() + ")";
  loadStudentEssenQuery += " AND tag >= '" + SELECTED_WEEK_START + "' AND tag <= '" + SELECTED_WEEK_END + "'";

  (async () => {
    let data = await globalDatabaseCRUD(loadStudentEssenQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      addStudentEssenToTable();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

function addStudentEssenToTable() {
  CURRENT_TABLE_VALUES.forEach((row) => {
    $("#" + row.schueler_id + "_" + row.tag)
      .find(".essenid_" + row.essen_id + ">.essenRadio")
      .prop("checked", true);
  });
}

function fillSelectWithWeeks() {
  let currentDate = new Date();
  let firstDateInCurrentYear = new Date(currentDate.getFullYear(), 0, 1);
  let lastDateInCurrentYear = new Date(currentDate.getFullYear(), 11, 31);
  //console.log("last Date current year: " + lastDateInCurrentYear);
  //console.log("first Date current year: " + firstDateInCurrentYear);
  var daysFromFirstDate = Math.floor((currentDate - firstDateInCurrentYear) / (24 * 60 * 60 * 1000));
  var daysFromLastDate = Math.floor((lastDateInCurrentYear - firstDateInCurrentYear) / (24 * 60 * 60 * 1000));

  let firstDateWeekNumber = 1;
  var currentWeekNumber = Math.ceil(daysFromFirstDate / 7);
  let lastDateWeekNumber = Math.ceil(daysFromLastDate / 7);

  // Display the calculated result
  //console.log("first week number: " + firstDateWeekNumber);
  //console.log("current week number: " + currentWeekNumber);
  //console.log("last week number: " + lastDateWeekNumber);

  //create wochen datum data
  let data = [];
  const optionsStart = { month: "2-digit", day: "2-digit" };
  const optionsEnd = { month: "2-digit", day: "2-digit", year: "numeric" };
  for (let i = 0; i < lastDateWeekNumber; i++) {
    let start = getStartDateOfWeek(i + 1, 2022).toLocaleDateString("de-DE", optionsStart);
    let end = getEndDateOfWeek(i + 1, 2022).toLocaleDateString("de-DE", optionsEnd);
    data.push({ wochennr: i + 1, woche: "(" + (i + 1) + ". KW)", start: start, end: end });
  }

  //fill select with values
  $("#selectEssenVerwaltenWoche").append('<option value="' + 0 + '">Alle Wochen anzeigen </option>');
  for (var index = 0; index < data.length; index++) {
    $("#selectEssenVerwaltenWoche").append('<option value="' + data[index].wochennr + '">' + data[index].woche + " " + data[index].start + " - " + data[index].end + "</option>");
  }
  $("#selectEssenVerwaltenWoche option[value='" + currentWeekNumber + "']").prop("selected", true);
  $("#selectEssenVerwaltenWoche option[value='" + currentWeekNumber + "']").addClass("currentOption");
  SELECTED_WEEK_START = formatDateForSql(getStartDateOfWeek(currentWeekNumber, 2022));
  SELECTED_WEEK_END = formatDateForSql(getEndDateOfWeek(currentWeekNumber, 2022));
}

$("#selectEssenVerwaltenWoche").on("change", function () {
  let selectedWeek = this.value;
  if (selectedWeek == 0) {
    let currentDate = new Date();
    SELECTED_WEEK_START = formatDateForSql(new Date(currentDate.getFullYear(), 0, 1));
    SELECTED_WEEK_END = formatDateForSql(new Date(currentDate.getFullYear(), 11, 31));
  } else {
    SELECTED_WEEK_START = formatDateForSql(getStartDateOfWeek(selectedWeek, 2022));
    SELECTED_WEEK_END = formatDateForSql(getEndDateOfWeek(selectedWeek, 2022));
  }
  loadStudentData().then(function () {
    loadEssenData().then(function () {
      loadStudentEssenData();
    });
  });
});

function formatDateForSql(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getStartDateOfWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}
function getEndDateOfWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  ISOweekStart = addDays(ISOweekStart, 6);
  return ISOweekStart;
}

//load data
async function loadStudentData() {
  globalShowLoader("loaderDIV");
  resetDataTable("dataTable");
  CURRENT_TABLE_NAME = "students";
  let loadStudentQuery = "SELECT id, firstname, lastname FROM " + CURRENT_TABLE_NAME + " WHERE klasse = '" + CURRENCT_KLASSE + "';";

  await (async () => {
    CURRENT_COLUMN_NAMES = ["Vorname", "Nachname", "Mo", "Di", "Mi", "Do", "Fr"]; //await globalGetColumnNames(CURRENT_TABLE_NAME);
    let data = await globalDatabaseCRUD(loadStudentQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      CURRENT_STUDENTS = CURRENT_TABLE_VALUES;
      createEssenDataTable("dataTable", CURRENT_TABLE_VALUES, CURRENT_COLUMN_NAMES);
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

//resets created data table
function resetDataTable(tableId) {
  document.getElementById(tableId).innerHTML = "";
}

//creates a table of the database results
function createEssenDataTable(tableId, dataValues, columnNames) {
  //dates for days
  let tempDateMo = new Date(SELECTED_WEEK_START);
  let tempDateDi = addDays(SELECTED_WEEK_START, 1);
  let tempDateMi = addDays(SELECTED_WEEK_START, 2);
  let tempDateDo = addDays(SELECTED_WEEK_START, 3);
  let tempDateFr = addDays(SELECTED_WEEK_START, 4);
  let dayDateMap = { Mo: tempDateMo, Di: tempDateDi, Mi: tempDateMi, Do: tempDateDo, Fr: tempDateFr };

  let dataTable = document.getElementById(tableId);
  dataTable.innerHTML = "";
  let essenTable = "<thead><tr>";
  //create header columns
  columnNames.forEach((column) => {
    if (column == "Mo") {
      essenTable += "<th>" + column + "<br>" + tempDateMo.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit" }) + "</th>";
    } else if (column == "Di") {
      essenTable += "<th>" + column + "<br>" + tempDateDi.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit" }) + "</th>";
    } else if (column == "Mi") {
      essenTable += "<th>" + column + "<br>" + tempDateMi.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit" }) + "</th>";
    } else if (column == "Do") {
      essenTable += "<th>" + column + "<br>" + tempDateDo.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit" }) + "</th>";
    } else if (column == "Fr") {
      essenTable += "<th>" + column + "<br>" + tempDateFr.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit" }) + "</th>";
    } else {
      essenTable += "<th>" + column + "</th>";
    }
  });
  //add edit column
  essenTable += "</thead>";

  essenTable += "<tbody>";
  //create rows with items
  const regexExpIsDate = /\d{4}-\d{2}-\d{2}/;

  dataValues.forEach((row, index1) => {
    essenTable += "<tr>";
    let currentStudentId = undefined;
    Object.values(row).forEach((item, index2) => {
      if (index2 == 0) {
        //id of row
        currentStudentId = item;
      } else {
        essenTable += "<td id='id_" + index1 + "'_'" + index2 + "'>";
        //check for dates and display dd.mm.yyyy
        if (regexExpIsDate.test(item)) {
          var tempDate = new Date(item);
          const options = { month: "2-digit", day: "2-digit", year: "numeric" };
          tempDate = tempDate.toLocaleDateString("de-DE", options);
          essenTable += tempDate;
        } else {
          essenTable += item;
        }
        //add combo
        essenTable += "</td>";
      }
    });
    //radio buttons essen mo-fr
    const days = ["Mo", "Di", "Mi", "Do", "Fr"];
    days.forEach((day) => {
      let sqlFormatDate = formatDateForSql(dayDateMap[day]);
      //add combo
      essenTable += "<td id='" + currentStudentId + "_" + sqlFormatDate + "'>";
      //radio: essen typ 1
      essenTable += "<div class='form-check' data-essenid=''>";
      essenTable +=
        "<input class='form-check-input essenRadio typ1 " + sqlFormatDate + "' type='radio' name='flexRadioDefault" + day + "-" + index1 + "' id='radioId-1-" + day + "-" + index1 + "' disabled>";
      essenTable += "<label class='form-check-label typ1 " + sqlFormatDate + "' for='radioId-1-" + day + "-" + index1 + "'>fleisch</label>";
      essenTable += "</div>";
      //radio: essen typ 2
      essenTable += "<div class='form-check' data-essenid=''>";
      essenTable +=
        "<input class='form-check-input essenRadio typ2 " + sqlFormatDate + "' type='radio' name='flexRadioDefault" + day + "-" + index1 + "' id='radioId-2-" + day + "-" + index1 + "' disabled>";
      essenTable += "<label class='form-check-label typ2 " + sqlFormatDate + "' for='radioId-2-" + day + "-" + index1 + "'>vegetarisch</label>";
      essenTable += "</div>";
      //radio: kein essen
      essenTable += "<div class='form-check essenid_0' data-essenid='0'>";
      essenTable +=
        "<input class='form-check-input essenRadio typ3 " + sqlFormatDate + "' type='radio' name='flexRadioDefault" + day + "-" + index1 + "' id='radioId-3-" + day + "-" + index1 + "' disabled>";
      essenTable += "<label class='form-check-label typ3 " + sqlFormatDate + "' for='radioId-3-" + day + "-" + index1 + "'>kein Essen</label>";
      essenTable += "</div>";
      essenTable += "</td>";
    });

    essenTable += "</tr>";
  });
  essenTable += "</tbody>";

  $("#" + tableId).append(essenTable);

  //add on change event to radio controls
  $(".essenRadio").on("change", function () {
    let tempStudentId = $(this).parent().parent().attr("id").split("_")[0];
    let tempEssenId = $(this).parent().data("essenid");
    let tempTag = $(this).parent().parent().attr("id").split("_")[1];
    //console.log("student id: " + tempStudentId);
    //console.log("essen id: " + tempEssenId);
    //console.log("tag: " + tempTag);
    updateEssenAuswahl(tempStudentId, tempEssenId, tempTag);
  });
}

function updateEssenAuswahl(studentId, essenId, tag) {
  let sqlQuery = "INSERT INTO schueler_essen(schueler_id, essen_id, tag) VALUES(" + studentId + "," + essenId + ",'" + tag + "')";
  sqlQuery += " ON DUPLICATE KEY UPDATE schueler_id = " + studentId + ", essen_id = " + essenId + ", tag = '" + tag + "'";

  (async () => {
    let data = await globalDatabaseCRUD(sqlQuery);
    if (data["error"] == "") {
      // success
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

async function loadEssenData() {
  globalShowLoader("loaderDIV");

  CURRENT_TABLE_NAME = "essen";
  let loadEssenQuery = "SELECT * FROM " + CURRENT_TABLE_NAME + " WHERE tag >= '" + SELECTED_WEEK_START + "' AND tag <= '" + SELECTED_WEEK_END + "' ORDER BY tag;";

  await (async () => {
    let data = await globalDatabaseCRUD(loadEssenQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      addEssenToTable();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

function addEssenToTable() {
  CURRENT_TABLE_VALUES.forEach((row) => {
    if (row.typ == "fleisch") {
      $(".essenRadio.typ1." + row.tag + "").prop("disabled", false);
      $(".essenRadio.typ3." + row.tag + "").prop("disabled", false);
      $(".form-check-label.typ1." + row.tag + "")
        .parent()
        .addClass("essenid_" + row.id);
      $(".form-check-label.typ1." + row.tag + "")
        .parent()
        .data("essenid", row.id);
    } else {
      $(".essenRadio.typ2." + row.tag + "").prop("disabled", false);
      $(".essenRadio.typ3." + row.tag + "").prop("disabled", false);
      $(".form-check-label.typ2." + row.tag + "")
        .parent()
        .addClass("essenid_" + row.id);
      $(".form-check-label.typ2." + row.tag + "")
        .parent()
        .data("essenid", row.id);
    }
  });
}

