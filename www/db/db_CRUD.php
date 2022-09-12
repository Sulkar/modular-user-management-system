<?php
/* 
Javascript Teststring:

(async () => {
    let data = await globalDatabaseCRUD("select * from users");
    console.log(data);
})();
  
*/
// Include config file
require_once "config.php";

//start session and check role permissions:
$userHasPermission = false;


session_start();
//1)user must be logged in to do CRUD operations
if (!isset($_SESSION["loggedIn"]) && !$_SESSION["loggedIn"] === true && !isset($_SESSION["role"])) {
    exit;
}



// data from js file
$data = json_decode(file_get_contents('php://input'), true);
$sqlQuery = $data;

//check sql query for permissions
$sqlSelect = false;
$sqlShow = false;
$sqlUpdate = false;
$sqlDrop = false;
$sqlCreate = false;
$sqlAlter = false;
$sqlInsert = false;
$sqlDelete = false;

$regex_select = "/\bselect\b/i";
if (preg_match($regex_select, $sqlQuery) == 1) $sqlSelect = true;
$regex_show = "/\bshow\b/i";
if (preg_match($regex_show, $sqlQuery) == 1) $sqlShow = true;
$regex_update = "/\bupdate\b/i";
if (preg_match($regex_update, $sqlQuery) == 1) $sqlUpdate = true;
$regex_drop = "/\bdrop\b/i";
if (preg_match($regex_drop, $sqlQuery) == 1) $sqlDrop = true;
$regex_create = "/\bcreate\b/i";
if (preg_match($regex_create, $sqlQuery) == 1) $sqlCreate = true;
$regex_alter = "/\balter\b/i";
if (preg_match($regex_alter, $sqlQuery) == 1) $sqlAlter = true;
$regex_insert = "/\binsert\b/i";
if (preg_match($regex_insert, $sqlQuery) == 1) $sqlInsert = true;
$regex_delete = "/\bdelete\b/i";
if (preg_match($regex_delete, $sqlQuery) == 1) $sqlDelete = true;


//2) check for role privilegs
$denyError = "";
if ($sqlCreate || $sqlDelete) {
    if (in_array($_SESSION["role"], array("admin"))) {
        $userHasPermission = true;
    } else {
        $denyError = "CREATE";
    }
} else if ($sqlDrop) {
    if (in_array($_SESSION["role"], array("admin"))) {
        $userHasPermission = true;
    } else {
        $denyError = "DROP";
    }
} else if ($sqlAlter) {
    if (in_array($_SESSION["role"], array("admin"))) {
        $userHasPermission = true;
    } else {
        $denyError = "ALTER";
    }
} else if ($sqlInsert) {
    if (in_array($_SESSION["role"], array("admin", "mensa"))) {
        $userHasPermission = true;
    } else {
        $denyError = "INSERT";
    }
} else if ($sqlUpdate) {
    if (in_array($_SESSION["role"], array("admin", "mensa"))) {
        $userHasPermission = true;
    } else {
        $denyError = "UPDATE";
    }
} else if ($sqlSelect) {
    if (in_array($_SESSION["role"], array("admin", "mensa", "lehrer"))) {
        $userHasPermission = true;
    } else {
        $denyError = "SELECT";
    }
} else if ($sqlShow) {
    if (in_array($_SESSION["role"], array("admin", "mensa", "lehrer"))) {
        $userHasPermission = true;
    } else {
        $denyError = "SHOW";
    }
}

//3) allow custom querries
if (in_array($_SESSION["role"], array("lehrer"))) {
    // INSERT INTO schueler_essen(schueler_id, essen_id, tag) VALUES(8,0,'2022-09-19') ON DUPLICATE KEY UPDATE schueler_id = 8, essen_id = 0, tag = '2022-09-19'
    $regex_insert_essen = "/INSERT INTO schueler_essen\(schueler_id, essen_id, tag\) VALUES\(\d+,\d+,'\d+-\d+-\d+'\) ON DUPLICATE KEY UPDATE schueler_id \= \d+, essen_id \= \d+, tag \= '\d+-\d+-\d+'/i";
    if (preg_match($regex_insert_essen, $sqlQuery) == 1) $userHasPermission = true;
}
if (in_array($_SESSION["role"], array("mensa"))) {
    // "DELETE FROM essen WHERE id = 36";
    $regex_delete_essen = "/DELETE FROM essen WHERE id = \d+/i";
    if (preg_match($regex_delete_essen, $sqlQuery) == 1) $userHasPermission = true;
}

$results["error"]["errorInfo"] = "Database access denied! (" . $denyError . ")";

if ($userHasPermission) {
    $results["error"] = "";
    try {
        $stmt = $pdo->query($sqlQuery);

        $results["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $exception) {
        $results["error"] = $exception;
    }

    // Close statement
    unset($stmt);

    // Close connection
    unset($pdo);
}
// return results
echo json_encode($results);
