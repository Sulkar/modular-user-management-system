/*
  Essen Übersicht Page Javascript
*/

//global variables
let CURRENT_TABLE_NAME = undefined;
let CURRENT_COLUMN_NAMES = [];
let CURRENT_TABLE_VALUES = [];

let SELECTED_WEEK_NR = undefined;
let SELECTED_WEEK_START = undefined;
let SELECTED_WEEK_END = undefined;
let DAYS = ["Mo", "Di", "Mi", "Do"];
let DAYS_FOR_PREPARATION = 5;
let WEEK_SELECTION_START_MONTH = 9;

let CURRENCT_KLASSE = "Alle Klassen";
let CURRENT_STUDENTS = [];
let CURRENT_ESSEN_DATA = [];
let CURRENT_KLASSEN_DATA = [];

let CURRENT_USER_ROLE = undefined;
let MODE_UEBERSICHT = false;

//start
$(document).ready(function () {
  fillSelectWithWeeks();
  globalGetSessionVariables().then(function (session) {
    CURRENT_USER_ROLE = session.role;
    loadClassesData().then(function () {
      initData("alle");
      setLastEditDay();
    });
  });
});

$("#switchAusgabeUebersicht").on("click", function () {
  let tempSwitch = $(this);
  let labelForTempSwitch = $("label[for='" + $(this).attr("id") + "']");
  if (tempSwitch.is(":checked")) {
    labelForTempSwitch.text("Übersicht");
    MODE_UEBERSICHT = true;
  } else {
    labelForTempSwitch.text("Ausgabe");
    MODE_UEBERSICHT = false;
  }
  //update view
  if (CURRENCT_KLASSE == "Alle Klassen") {
    initData("alle");
  } else {
    initData("klasse");
  }
  setLastEditDay();
});

$("#btnDrucken").on("click", function () {
  //set file name with title
  let filename = "Übersicht Essen " + SELECTED_WEEK_NR + ". KW ";
  filename += new Date(SELECTED_WEEK_START).toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit" });
  filename += " - ";
  filename += new Date(SELECTED_WEEK_END).toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit", year: "numeric" });
  filename += " - " + CURRENCT_KLASSE;
  document.title = filename;
  window.print();
});

function setLastEditDay() {
  let lastEditDay = getLastEditDay();
  let currentDay = new Date();

  if (currentDay < lastEditDay)
    $("#letzterBestelltag").html("<span class='newOption'>Letzte Bestellmöglichkeit: " + lastEditDay.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit", year: "numeric" }) + "</span>");
  else $("#letzterBestelltag").html("<span class='oldOption'>Letzte Bestellmöglichkeit: " + lastEditDay.toLocaleDateString("de-DE", { month: "2-digit", day: "2-digit", year: "numeric" }) + "</span>");
}

function getLastEditDay() {
  //firstDayOfWeek - 4 = Montag - 4 = Donnerstag
  let lastEditDay = new Date(SELECTED_WEEK_START);
  lastEditDay.setDate(lastEditDay.getDate() - DAYS_FOR_PREPARATION);
  return lastEditDay;
}

function getIdsFromDataArray(dataArray) {
  let idArray = [];
  dataArray.forEach((row) => {
    idArray.push(row.id);
  });
  return idArray;
}

async function loadStudentEssenData() {
  globalShowLoader("loaderDIV");
  CURRENT_TABLE_NAME = "schueler_essen";
  let loadStudentEssenQuery = "SELECT * FROM " + CURRENT_TABLE_NAME + " WHERE schueler_id IN (" + getIdsFromDataArray(CURRENT_STUDENTS).join() + ")";
  loadStudentEssenQuery += " AND tag >= '" + SELECTED_WEEK_START + "' AND tag <= '" + SELECTED_WEEK_END + "'";

  await (async () => {
    let data = await globalDatabaseCRUD(loadStudentEssenQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      if (MODE_UEBERSICHT) updateRadiosStudentEssenToTable();
      else addStudentEssenToTable();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

function updateRadiosStudentEssenToTable() {
  CURRENT_TABLE_VALUES.forEach((schuelerEssen) => {
    $("#radioId_" + schuelerEssen.essen_id + "_" + schuelerEssen.tag + "_" + schuelerEssen.schueler_id).prop("checked", true);
  });
}

function addStudentEssenToTable() {
  CURRENT_TABLE_VALUES.forEach((schuelerEssen) => {
    let tempButtonId = "buttonId_" + schuelerEssen.schueler_id + "_" + schuelerEssen.tag;
    if (schuelerEssen.essen_id == 0) {
      $("#" + schuelerEssen.schueler_id + "_" + schuelerEssen.tag).prepend("kein Essen<br>");
      $("#" + tempButtonId).removeClass("d-none");
    } else {
      $("#spanId_" + schuelerEssen.essen_id + "_" + schuelerEssen.tag + "_" + schuelerEssen.schueler_id).removeClass("d-none");
      $("#spanId_" + schuelerEssen.essen_id + "_" + schuelerEssen.tag + "_" + schuelerEssen.schueler_id).append("<br>");
      $("#" + tempButtonId).removeClass("d-none");
    }
    changeEssenAbgeholtButtonStatus(tempButtonId, schuelerEssen.status);
  });
}

function changeEssenAbgeholtButtonStatus(buttonId, status) {
  //status 1 = abgeholt - grün
  if (status == 1) {
    $("#" + buttonId).data("status", "abgeholt");
    $("#" + buttonId).removeClass("btn-secondary");
    $("#" + buttonId).addClass("btn-success");
    $("#" + buttonId).html("abgeholt");
  }
  //status 2 = nicht abgeholt - rot
  else if (status == 2) {
    $("#" + buttonId).data("status", "nicht_abgeholt");
    $("#" + buttonId).removeClass("btn-secondary");
    $("#" + buttonId).addClass("btn-danger");
    $("#" + buttonId).html("nicht abgeholt");
  }
  //status 3 = krank - orange
  else if (status == 3) {
    $("#" + buttonId).data("status", "krank");
    $("#" + buttonId).removeClass("btn-secondary");
    $("#" + buttonId).addClass("btn-warning");
    $("#" + buttonId).html("🚑 krank");
  }
}

function showEssenUebersicht() {
  let dataTableUebersicht = document.getElementById("dataTableEssenUebersicht");
  dataTableUebersicht.innerHTML = "";
  let essenUbersichtTable = "<thead><tr>";
  essenUbersichtTable += "<th>Essen</th>";
  essenUbersichtTable += "<th>Datum</th>";
  essenUbersichtTable += "<th>Anzahl</th>";
  essenUbersichtTable += "</tr></thead>";
  essenUbersichtTable += "<tbody>";

  let gesamtCounter = 0;
  const regexExpIsDate = /\d{4}-\d{2}-\d{2}/;

  CURRENT_ESSEN_DATA.forEach((essen) => {
    essenUbersichtTable += "<tr>";
    essenUbersichtTable += "<td>" + essen.name + "</td>";
    let tempDate = "";
    if (regexExpIsDate.test(essen.tag)) {
      tempDate = new Date(essen.tag);
      const options = { month: "2-digit", day: "2-digit", year: "numeric" };
      tempDate = tempDate.toLocaleDateString("de-DE", options);
    }
    essenUbersichtTable += "<td>" + tempDate + "</td>";
    let tempEssenCount = 0;
    if (essen.count != undefined) {
      tempEssenCount = essen.count;
    }
    essenUbersichtTable += "<td>" + tempEssenCount + "</td>";
    essenUbersichtTable += "</tr>";
    gesamtCounter += tempEssenCount;
  });

  //gesamt Essen
  essenUbersichtTable += "<tr>";
  essenUbersichtTable += "<td style='font-weight: bolder;'>gesamt</td>";
  essenUbersichtTable += "<td></td>";
  essenUbersichtTable += "<td style='font-weight: bolder;'>" + gesamtCounter + "</td>";
  essenUbersichtTable += "</tr>";

  //gesamt Schüler
  /*essenUbersichtTable += "<tr>";
  essenUbersichtTable += "<td style='font-weight: bolder;'>Anzahl Schüler</td>";
  essenUbersichtTable += "<td></td>";
  let gesamtAnzahlSchueler = getSchuelerAnzahl(CURRENCT_KLASSE);
  essenUbersichtTable += "<td style='font-weight: bolder;'>" + gesamtAnzahlSchueler + "</td>";
  essenUbersichtTable += "</tr>";*/

  essenUbersichtTable += "</tbody><br>";
  dataTableUebersicht.innerHTML = essenUbersichtTable;
}

async function countEssenSchulerData() {
  globalShowLoader("loaderDIV");
  CURRENT_TABLE_NAME = "schueler_essen";
  let loadStudentEssenQuery = "";
  if (CURRENCT_KLASSE == "Alle Klassen") {
    loadStudentEssenQuery = "SELECT * FROM " + CURRENT_TABLE_NAME + " WHERE tag >= '" + SELECTED_WEEK_START + "' AND tag <= '" + SELECTED_WEEK_END + "'";
  } else {
    loadStudentEssenQuery = "SELECT * FROM " + CURRENT_TABLE_NAME + " WHERE schueler_id IN (" + getIdsFromDataArray(CURRENT_STUDENTS).join() + ")";
    loadStudentEssenQuery += " AND tag >= '" + SELECTED_WEEK_START + "' AND tag <= '" + SELECTED_WEEK_END + "'";
  }
  await (async () => {
    let data = await globalDatabaseCRUD(loadStudentEssenQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      let essenCountData = data["result"];
      addEssenCountToEssen(essenCountData);
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

async function addEssenCountToEssen(essenCountData) {
  CURRENT_ESSEN_DATA.push({ id: 0, name: "kein Essen", tag: "" });
  CURRENT_ESSEN_DATA.forEach((essen) => {
    essenCountData.forEach((essenCount) => {
      if (essen.id == essenCount.essen_id) {
        if (essen.count == undefined) {
          essen.count = 1;
        } else {
          essen.count = essen.count + 1;
        }
      }
    });
  });
}

async function loadClassesData() {
  globalShowLoader("loaderDIV");
  CURRENT_TABLE_NAME = "schueler";
  let loadClassesQuery = "SELECT COUNT(id) AS 'schueler_gesamt', klasse FROM " + CURRENT_TABLE_NAME + " GROUP BY klasse";

  await (async () => {
    let data = await globalDatabaseCRUD(loadClassesQuery);
    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      CURRENT_KLASSEN_DATA = data["result"];
      fillSelectWithClasses();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

function getSchuelerAnzahl(klasse) {
  let anzahl = 0;
  CURRENT_KLASSEN_DATA.forEach((data) => {
    if (klasse == "Alle Klassen") {
      anzahl += data.schueler_gesamt;
    } else {
      if (klasse == data.klasse) anzahl += data.schueler_gesamt;
    }
  });
  return anzahl;
}

function fillSelectWithClasses() {
  //fill select with values
  $("#selectEssenUebersichtKlasse").append('<option value="Alle Klassen">Alle Klassen</option>');
  CURRENT_TABLE_VALUES.forEach((value) => {
    $("#selectEssenUebersichtKlasse").append('<option value="' + value.klasse + '">' + value.klasse + "</option>");
  });
  $("#selectEssenUebersichtKlasse option[value='Alle Klassen']").prop("selected", true);
}

$("#selectEssenUebersichtKlasse").on("change", function () {
  let selectedClass = this.value;
  CURRENCT_KLASSE = selectedClass;

  if (CURRENCT_KLASSE == "Alle Klassen") {
    initData("alle");
  } else {
    initData("klasse");
  }
});

function initData(type) {
  if (type == "klasse") {
    loadStudentData().then(function () {
      loadEssenData().then(function () {
        loadStudentEssenData().then(function () {
          countEssenSchulerData().then(function () {
            showEssenUebersicht();
          });
        });
      });
    });
  } else if ((type = "alle")) {
    loadEssenData().then(function () {
      countEssenSchulerData().then(function () {
        showEssenUebersicht();
        resetDataTable("dataTable");
      });
    });
  }
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

  if (CURRENCT_KLASSE == "Alle Klassen") {
    initData("alle");
  } else {
    initData("klasse");
  }
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
async function loadStudentData() {
  globalShowLoader("loaderDIV");
  resetDataTable("dataTable");
  CURRENT_TABLE_NAME = "schueler";
  let loadStudentQuery = "SELECT id, firstname, lastname FROM " + CURRENT_TABLE_NAME + " WHERE klasse = '" + CURRENCT_KLASSE + "' ORDER BY lastname;";

  await (async () => {
    CURRENT_COLUMN_NAMES = ["Name"].concat(DAYS); //await globalGetColumnNames(CURRENT_TABLE_NAME);
    let data = await globalDatabaseCRUD(loadStudentQuery);

    globalHideLoader("loaderDIV");
    if (data["error"] == "") {
      CURRENT_TABLE_VALUES = data["result"];
      CURRENT_STUDENTS = CURRENT_TABLE_VALUES;
      createEssenDataTable("dataTable", CURRENT_TABLE_VALUES, CURRENT_COLUMN_NAMES);
      if (!MODE_UEBERSICHT) initEssenAbgeholtButtons();
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
    let currentStudentFirstname = undefined;
    Object.values(row).forEach((item, index2) => {
      if (index2 == 0) {
        //if of first student -> no seperate column
        currentStudentId = item;
      } else if (index2 == 1) {
        //firstname of student -> no seperate column
        currentStudentFirstname = item;
      } else {
        essenTable += "<td id='id_" + index1 + "'_'" + index2 + "'>";
        //check for dates and display dd.mm.yyyy
        if (regexExpIsDate.test(item)) {
          var tempDate = new Date(item);
          const options = { month: "2-digit", day: "2-digit", year: "numeric" };
          tempDate = tempDate.toLocaleDateString("de-DE", options);
          essenTable += tempDate;
        } else {
          //firstname + surname
          essenTable += currentStudentFirstname + "<br>" + item;
        }
        //add combo
        essenTable += "</td>";
      }
    });
    //radio buttons essen mo-fr
    DAYS.forEach((day) => {
      let sqlFormatDate = formatDateForSql(dayDateMap[day]);
      //add combo
      essenTable += "<td class='" + sqlFormatDate + "' id='" + currentStudentId + "_" + sqlFormatDate + "'>";

      if (MODE_UEBERSICHT) essenTable += createKeinEssenRadio(sqlFormatDate, currentStudentId);
      else essenTable += createEssenAbgeholtButton(sqlFormatDate, currentStudentId);
      //

      essenTable += "</td>";
    });

    essenTable += "</tr>";
  });
  essenTable += "</tbody>";

  $("#" + tableId).append(essenTable);
}
function initEssenAbgeholtButtons() {
  //add on click button essen abgeholt
  $(".btnEssenAbgeholt").on("click", function () {
    let studentId = $(this).attr("id").split("_")[1];
    let essenTag = $(this).attr("id").split("_")[2];
    let currentButtonStatus = 0;

    let tempButtonStatus = $(this).data("status");
    if (tempButtonStatus == "start") {
      $(this).data("status", "abgeholt");
      $(this).removeClass("btn-secondary");
      $(this).addClass("btn-success");
      $(this).html("abgeholt");
      currentButtonStatus = 1;
    } else if (tempButtonStatus == "abgeholt") {
      $(this).data("status", "nicht_abgeholt");
      $(this).removeClass("btn-success");
      $(this).addClass("btn-danger");
      $(this).html("nicht abgeholt");
      currentButtonStatus = 2;
    } else if (tempButtonStatus == "nicht_abgeholt") {
      $(this).data("status", "krank");
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-warning");
      $(this).html("🚑 krank");
      currentButtonStatus = 3;
    } else if (tempButtonStatus == "krank") {
      $(this).data("status", "start");
      $(this).removeClass("btn-warning");
      $(this).addClass("btn-secondary");
      $(this).html("offen");
      currentButtonStatus = 0;
    }

    updateEssenStatus(studentId, essenTag, currentButtonStatus);
  });
}

function initRadioEvents() {
  //add on change event to radio controls
  $(".essenRadio").on("change", function () {
    let tempStudentId = $(this).parent().attr("id").split("_")[0];
    let tempEssenId = $(this).data("essenid");
    let tempTag = $(this).parent().attr("id").split("_")[1];
    //console.log("student id: " + tempStudentId);
    //console.log("essen id: " + tempEssenId);
    //console.log("tag: " + tempTag);
    updateEssenAuswahl(tempStudentId, tempEssenId, tempTag).then(function () {
      //display updated data
      initData("klasse");
    });
  });
  //add on click essen link events
  $(".essenModalLink").on("click", function () {
    let clickedEssen = findEssenDataById($(this).attr("id").split("_")[1]);
    fillModalEssenAnzeigenWithData(clickedEssen);
  });
}

$("#searchEssen").on("click", function () {
  let essenName = $("#modalEssenAnzeigen_Name").html();
  window.open("http://google.com/search?q=" + essenName);
});

function fillModalEssenAnzeigenWithData(essenData) {
  $("#modalEssenAnzeigen_Name").html(essenData.name);
  $("#modalEssenAnzeigen_Typ").html(essenData.typ);
  $("#modalEssenAnzeigen_Beschreibung").html(essenData.beschreibung);
}

function createEssenAbgeholtButton(sqlFormatDate, currentStudentId) {
  let essenAbgeholtButton = "<button type='button' class='btn btn-secondary btnEssenAbgeholt d-none' data-status='start' id='buttonId_" + currentStudentId + "_" + sqlFormatDate + "'>offen</button>";
  return essenAbgeholtButton;
}

function createKeinEssenRadio(sqlFormatDate, studentId) {
  let essenId = 0;
  let keinEssenRadio = "";
  keinEssenRadio += "<input class='form-check-input essenRadio typ3 " + sqlFormatDate + "' type='radio' id='radioId_" + essenId + "_" + sqlFormatDate + "_" + studentId + "'";
  keinEssenRadio += " data-essenid='0'";
  if (CURRENT_USER_ROLE == "admin") {
    keinEssenRadio += " name='grp-" + sqlFormatDate + "-" + studentId + "' >";
  } else {
    keinEssenRadio += " name='grp-" + sqlFormatDate + "-" + studentId + "' disabled>";
  }

  keinEssenRadio += " <label class='form-check-label typ3 " + sqlFormatDate + "' for='radioId_" + essenId + "_" + sqlFormatDate + "_" + studentId + "'>kein Essen</label>";
  return keinEssenRadio;
}

function createEssenRadio(essen, studentId) {
  let essenRadio = "";
  essenRadio += "<input class='form-check-input essenRadio " + essen.tag + "' type='radio' id='radioId_" + essen.id + "_" + essen.tag + "_" + studentId + "'";
  essenRadio += " data-essenid='" + essen.id + "'";
  if (CURRENT_USER_ROLE == "admin") {
    essenRadio += " name='grp-" + essen.tag + "-" + studentId + "' >";
  } else {
    essenRadio += " name='grp-" + essen.tag + "-" + studentId + "' disabled>";
  }
  essenRadio += " <a class='essenModalLink' id='essenId_" + essen.id + "' href='#' data-bs-toggle='modal' data-bs-target='#modalEssenAnzeigen'>" + essen.name + "</a>";
  return essenRadio;
}
function addEssenToTd(essen, studentId) {
  let essenSpan = "";
  essenSpan += "<span id='spanId_" + essen.id + "_" + essen.tag + "_" + studentId + "' class='d-none'";
  essenSpan += " data-essenid='" + essen.id + "'>" + essen.name + "</span>";
  return essenSpan;
}

async function updateEssenStatus(studentId, tag, status) {
  let sqlQuery = "UPDATE schueler_essen SET status = " + status + " WHERE schueler_id = " + studentId + " AND tag = '" + tag + "'";

  await (async () => {
    let data = await globalDatabaseCRUD(sqlQuery);
    if (data["error"] == "") {
      // success
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

async function updateEssenAuswahl(studentId, essenId, tag) {
  let sqlQuery = "INSERT INTO schueler_essen(schueler_id, essen_id, tag) VALUES(" + studentId + "," + essenId + ",'" + tag + "')";
  sqlQuery += " ON DUPLICATE KEY UPDATE schueler_id = " + studentId + ", essen_id = " + essenId + ", tag = '" + tag + "'";

  await (async () => {
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
      CURRENT_ESSEN_DATA = data["result"];
      addEssenToTable();
    } else {
      globalShowError(data["error"]["errorInfo"]);
    }
  })();
}

function findEssenDataById(essenId) {
  let foundEssen = "";
  CURRENT_ESSEN_DATA.forEach((essen) => {
    if (essen.id == essenId) {
      foundEssen = essen;
    }
  });
  return foundEssen;
}

function getTdsByDay(day) {
  let tdsForDay = [];
  $("#dataTable tbody td." + day).each(function () {
    tdsForDay.push(this);
  });
  return tdsForDay;
}
function getStudentIdFromTd(tempTd) {
  return $(tempTd).attr("id").split("_")[0];
}

function addEssenToTable() {
  CURRENT_TABLE_VALUES.forEach((essen) => {
    let dayTds = getTdsByDay(essen.tag);
    dayTds.forEach((dayTd) => {
      let tempStudentId = getStudentIdFromTd(dayTd);
      if (MODE_UEBERSICHT) $(dayTd).prepend(createEssenRadio(essen, tempStudentId) + "<br>");
      else $(dayTd).prepend(addEssenToTd(essen, tempStudentId));
    });
  });
  //
  initRadioEvents();
}
