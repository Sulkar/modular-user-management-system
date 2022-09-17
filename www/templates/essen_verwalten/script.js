/*
  Essen verwalten Page Javascript
*/

//global variables
let CURRENT_TABLE_NAME = undefined;
let CURRENT_COLUMN_NAMES = [];
let CURRENT_TABLE_VALUES = [];
let UPDATE_VALUES = [];
let DELETE_VALUES = [];
let CURRENT_EDIT_ESSEN_ID = undefined;

let SELECTED_WEEK_NR = undefined;
let SELECTED_WEEK_START = undefined;
let SELECTED_WEEK_END = undefined;
let DAYS_FOR_PREPARATION = 5;
let WEEK_SELECTION_START_MONTH = 9;

//start
$(document).ready(function () {
  fillSelectWithWeeks();
  $("#summernote").summernote({
    toolbar: [
      ["style", ["bold", "underline"]],
      ["fontsize", ["fontsize"]],
      ["color", ["color"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
    callbacks: { onImageUpload: onImageUploadFunc("#summernote") },
  });

  $("#summernoteEdit").summernote({
    toolbar: [
      ["style", ["bold", "underline"]],
      ["fontsize", ["fontsize"]],
      ["color", ["color"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
    callbacks: { onImageUpload: onImageUploadFunc("#summernoteEdit") },
  });
  loadDataData();
  setLastEditDay();
});

$("#btnDrucken").on("click", function () {
  window.print();
});

//summernote auto resize image
let onImageUploadFunc = function (elementId) {
  return function (image) {
    resizeImage(image[0], elementId);
  };
};

function resizeImage(file, elementId) {
  let image = new Image();
  let url = window.URL ? window.URL : window.webkitURL;

  image.src = url.createObjectURL(file);
  image.onload = function (e) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let width = 600;
    let factor = image.width / width;
    let height = image.height / factor;

    if (image.height > image.width) {
      height = 300;
      factor = image.height / height;
      width = image.width / factor;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    $(elementId).summernote("editor.insertImage", canvas.toDataURL("jpeg", 0.7));
  };
}

function getWeekNumber(date) {
  let tdt = new Date(date.valueOf());
  let dayn = (date.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  let firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

function fillSelectWithWeeks() {
  let currentDate = new Date();
  var currentWeekNumber = getWeekNumber(currentDate);

  //create wochen datum data
  const optionsStart = { month: "2-digit", day: "2-digit" };
  const optionsEnd = { month: "2-digit", day: "2-digit", year: "numeric" };

  let weekData = [];
  let startYear = undefined;
  if (currentDate.getMonth() < WEEK_SELECTION_START_MONTH - 1) {
    startYear = currentDate.getFullYear() - 1;
  } else {
    startYear = currentDate.getFullYear();
  }
  let startMonthDate = new Date(startYear, WEEK_SELECTION_START_MONTH - 1, 1);
  let tempWeekNr = getWeekNumber(startMonthDate);

  for (let i = 0; i < 52; i++) {
    if (tempWeekNr > 52) {
      tempWeekNr = 1;
      startYear++;
    }

    let start = getStartDateOfWeek(tempWeekNr, startYear); //.toLocaleDateString("de-DE", optionsStart);
    let end = getEndDateOfWeek(tempWeekNr, startYear); //.toLocaleDateString("de-DE", optionsEnd);
    weekData.push({ wochennr: tempWeekNr, year: startYear, woche: "(" + tempWeekNr + ". KW)", start: start, end: end });
    tempWeekNr++;
  }

  let nextEditWeekStart = getNextEditWeekStart(weekData);

  //set globals
  SELECTED_WEEK_NR = currentWeekNumber;
  SELECTED_WEEK_START = formatDateForSql(getStartDateOfWeek(currentWeekNumber, currentDate.getFullYear())); //-> wird für lastEditDay verwendet
  SELECTED_WEEK_END = formatDateForSql(getEndDateOfWeek(currentWeekNumber, currentDate.getFullYear()));

  //fill select with values
  $("#selectEssenVerwaltenWoche").append('<option value="' + 0 + '">Alle Wochen anzeigen </option>');
  for (var index = 0; index < weekData.length; index++) {
    if (weekData[index].start < nextEditWeekStart) {
      $("#selectEssenVerwaltenWoche").append(
        '<option class="oldOption" value="' +
          weekData[index].wochennr +
          "_" +
          weekData[index].year +
          '">' +
          weekData[index].woche +
          " " +
          weekData[index].start.toLocaleDateString("de-DE", optionsStart) +
          " - " +
          weekData[index].end.toLocaleDateString("de-DE", optionsEnd) +
          "</option>"
      );
    } else if (weekData[index].start >= nextEditWeekStart) {
      $("#selectEssenVerwaltenWoche").append(
        '<option class="newOption" value="' +
          weekData[index].wochennr +
          "_" +
          weekData[index].year +
          '">' +
          weekData[index].woche +
          " " +
          weekData[index].start.toLocaleDateString("de-DE", optionsStart) +
          " - " +
          weekData[index].end.toLocaleDateString("de-DE", optionsEnd) +
          "</option>"
      );
    } else {
      $("#selectEssenVerwaltenWoche").append(
        '<option value="' +
          weekData[index].wochennr +
          "_" +
          weekData[index].year +
          '">' +
          weekData[index].woche +
          " " +
          weekData[index].start.toLocaleDateString("de-DE", optionsStart) +
          " - " +
          weekData[index].end.toLocaleDateString("de-DE", optionsEnd) +
          "</option>"
      );
    }
  }
  $("#selectEssenVerwaltenWoche option[value='" + currentWeekNumber + "_" + currentDate.getFullYear() + "']").prop("selected", true);
  $("#selectEssenVerwaltenWoche option[value='" + currentWeekNumber + "_" + currentDate.getFullYear() + "']").addClass("currentOption");
}

function getNextEditWeekStart(weekData) {
  let currentDate = new Date();
  let nextEditWeekStart = undefined;
  for (let index = 0; index < weekData.length; index++) {
    if (weekData[index].start > addDays(currentDate, DAYS_FOR_PREPARATION)) {
      nextEditWeekStart = weekData[index].start;
      break;
    }
  }
  return nextEditWeekStart;
}

$("#selectEssenVerwaltenWoche").on("change", function () {
  let selectedWeek = this.value.split("_")[0];
  let selectedYear = this.value.split("_")[1];
  SELECTED_WEEK_NR = this.value.split("_")[0];
  
  if (selectedWeek == 0) {
    let currentDate = new Date();
    SELECTED_WEEK_START = formatDateForSql(new Date(currentDate.getFullYear(), 0, 1));
    SELECTED_WEEK_END = formatDateForSql(new Date(currentDate.getFullYear(), 11, 31));
  } else {
    SELECTED_WEEK_START = formatDateForSql(getStartDateOfWeek(selectedWeek, selectedYear));
    SELECTED_WEEK_END = formatDateForSql(getEndDateOfWeek(selectedWeek, selectedYear));
  }
  loadDataData();
  setLastEditDay();
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

function subtractDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
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
function loadDataData() {
  globalShowLoader("loaderDIV");
  resetDataTable("dataTable");
  CURRENT_TABLE_NAME = "essen";
  let dataQuery = "SELECT * FROM " + CURRENT_TABLE_NAME + " WHERE tag >= '" + SELECTED_WEEK_START + "' AND tag <= '" + SELECTED_WEEK_END + "' ORDER BY tag;";

  (async () => {
    CURRENT_COLUMN_NAMES = await globalGetColumnNames(CURRENT_TABLE_NAME);
    let data = await globalDatabaseCRUD(dataQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
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
  const regexExpIsDate = /\d{4}-\d{2}-\d{2}/;

  dataValues.forEach((row, index1) => {
    essenTable += "<tr>";
    Object.values(row).forEach((item, index2) => {
      if (index2 == 0) {
        essenTable += "<td class='sqlID' id='id_" + index1 + "'_'" + index2 + "'>";
        essenTable += item;
        essenTable += "</td>";
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
        essenTable += "</td>";
      }
    });

    let penIcon =
      "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg>";
    essenTable += "<td><span id='" + Object.values(row)[0] + "' class='essenEdit' data-bs-toggle='modal' data-bs-target='#modalEssenBearbeiten'>" + penIcon + "</span></td>";
    essenTable += "</tr>";
  });
  essenTable += "</tbody>";

  $("#" + tableId).append(essenTable);

  //edit button click
  $(".essenEdit").on("click", function () {
    fillEssenBearbeitenForm(this.id);
  });
}

function getLastEditDay() {
  //firstDayOfWeek - 4 = Montag - 4 = Donnerstag
  let lastEditDay = new Date(SELECTED_WEEK_START);
  return subtractDays(lastEditDay, DAYS_FOR_PREPARATION);
}

function setLastEditDay() {
  let lastEditDay = getLastEditDay();
  let currentDay = new Date();

  if (currentDay < lastEditDay)
    $("#letzterBestelltag").html("<span class='newOption'>Letzte Bestellmöglichkeit: " + lastEditDay.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit", year: "numeric" }) + "</span>");
  else $("#letzterBestelltag").html("<span class='oldOption'>Letzte Bestellmöglichkeit: " + lastEditDay.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit", year: "numeric" }) + "</span>");
}

//fills essen modal when edit is clicked
function fillEssenBearbeitenForm(id) {
  CURRENT_EDIT_ESSEN_ID = undefined;
  CURRENT_TABLE_VALUES.forEach((row) => {
    if (row.id == id) {
      CURRENT_EDIT_ESSEN_ID = id;
      $("#txtEssenNameEdit").val(row.name);
      $("#selectTagEdit").val(row.tag);
      $("#summernoteEdit").summernote("code", row.beschreibung);
      $("#selectEssenTypEdit option[value='" + row.typ + "']").prop("selected", true);
    }
  });
}

//check if essen should be deleted
$("#btnEssenLoeschenJa").on("click", function () {
  let sqlQuery = "DELETE FROM essen WHERE id = " + CURRENT_EDIT_ESSEN_ID;
  (async () => {
    let data = await globalDatabaseCRUD(sqlQuery);
    if (data["error"] == "") {
      globalShowSuccess("Essen wurde gelöscht");
      loadDataData();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
});

//updates essen after edit
$("#btnEssenAendern").on("click", function () {
  let essenName = $("#txtEssenNameEdit").val();
  let essenTag = $("#selectTagEdit").val();
  let essenBeschreibungHtml = $("#summernoteEdit").summernote("code");
  let essenTyp = $("#selectEssenTypEdit").val();
  let sqlQuery = "UPDATE essen set name='" + essenName + "', tag = '" + essenTag + "', beschreibung = '" + essenBeschreibungHtml + "', typ = '" + essenTyp + "' WHERE id = " + CURRENT_EDIT_ESSEN_ID;

  (async () => {
    let data = await globalDatabaseCRUD(sqlQuery);
    if (data["error"] == "") {
      // fill DOM with data
      globalShowSuccess("Essen wurde geändert.");
      loadDataData();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
});

//Modal: neues Essen erstellen
document.getElementById("btnNeuesEssenErstellen").addEventListener("click", function () {
  let essenName = $("#txtEssenName").val();
  let essenTag = $("#selectTag").val();
  let essenBeschreibungHtml = $("#summernote").summernote("code");
  let essenTyp = $("#selectEssenTypEdit").val();
  let sqlQuery = "INSERT INTO essen (name, tag, beschreibung, typ) VALUES ('" + essenName + "','" + essenTag + "','" + essenBeschreibungHtml + "','" + essenTyp + "')";
  (async () => {
    let data = await globalDatabaseCRUD(sqlQuery);
    if (data["error"] == "") {
      // fill DOM with data
      globalShowSuccess("Inserted data into table ");
      loadDataData();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
});
