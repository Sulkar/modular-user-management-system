<?php
/* 
Javascript Teststring:

(async () => {
    let data = await globalDatabaseCRUD("select * from users");
    console.log(data);
})();
  
*/

//start session and check role permissions:
$userHasPermission = false;
$results["error"]["errorInfo"] = "Database access denied!";

session_start();
//1)user must be logged in to do CRUD operations
if (!isset($_SESSION["loggedIn"]) && !$_SESSION["loggedIn"] === true) {
    exit;
}

/* check sql query for permissions
    - select (all)
    - update (teacher, admin)
    - delete (admin)
    - create (admin)
    - alter (admin)
*/
$sqlSelect = false;
$sqlUpdate = false;
$sqlDelete = true;
$sqlCreate = false;
$sqlAlter = false;

//2)user has role admin
if ($sqlUpdate) {
    if (isset($_SESSION["role"]) && ($_SESSION["role"] === "lehrer" || $_SESSION["role"] === "admin")) {
        $userHasPermission = true;
    }
} else if ($sqlDelete) {

    if (isset($_SESSION["role"]) && ($_SESSION["role"] === "admin")) {
        $userHasPermission = true;
    }
}


if ($userHasPermission) {
    // Include config file
    require_once "config.php";

    // data from js file
    $data = json_decode(file_get_contents('php://input'), true);


    $results["error"] = "";

    $sqlQuery = $data;

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
