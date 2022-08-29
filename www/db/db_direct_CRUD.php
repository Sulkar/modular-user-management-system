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

$sqlQuery = $data;

try {
    $stmt = $pdo->query($sqlQuery);

    $results["result"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
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
