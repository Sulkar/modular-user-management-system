<?php
session_start();

// Include config file
require_once "config.php";


// data from js file
$data = json_decode(file_get_contents('php://input'), true);

$results["inserted"] = false;
$results["updated"] = false;
$results["deleted"] = false;
$results["error"] = "";

$sqlQuery = $data["sqlQuery"];
$sqlValues = $data["sqlValues"];

/*$sqlQuery = "SELECT * FROM users";
$sqlValues = [];

$sqlQuery = "SELECT username, email FROM users WHERE id = :id AND email = :email";
$sqlValues = [[[":id", 1], [":email", "123"]]];

$sqlQuery = "INSERT INTO users(username, email, password) VALUES(:username, :email, :password)";
$sqlValues = [[[":username", "Richi"], [":email", "test@example.com"], [":password", "easy123"]]];

$sqlQuery = "INSERT INTO schueler_essen(schueler_id, essen_id, tag) VALUES(:schueler_id, :essen_id, :tag) ON DUPLICATE KEY UPDATE schueler_id = :schueler_id, essen_id = :essen_id, tag = :tag";
$sqlValues = [[[":schueler_id", 1], [":essen_id", 2], [":tag", "02-07-2022"]]];
*/

function createParameterData($sqlValues)
{
    $parametersData = [];
    foreach ($sqlValues as $parameterData) {
        $parametersForOneQuery = [];
        foreach ($parameterData as $parameter) {


            //$_SESSION['id']
            if ($parameter[1] == "SESSION_id") {
                $parametersForOneQuery += array($parameter[0] => $_SESSION['id']);
            } else {
                $parametersForOneQuery += array($parameter[0] => $parameter[1]);
            }
        }
        $parametersData[] = $parametersForOneQuery;
    }
    return $parametersData;
}

$parameterData = createParameterData($sqlValues);

try {
    $stmt = $pdo->prepare($sqlQuery);

    if (count($parameterData) > 0) {
        foreach ($parameterData as $parametersForOneQuery) {
            $stmt->execute($parametersForOneQuery);
        }
    } else {
        $stmt->execute();
    }

    $results["result"] = $stmt->fetchAll();
    $results["inserted"] = true;
} catch (Exception $exception) {
    $results["error"] = $exception;
}

// Close statement
unset($stmt);

// Close connection
unset($pdo);

// return results
echo json_encode($results);
