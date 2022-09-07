<?php
session_start();

// data from js file
$data = json_decode(file_get_contents('php://input'), true);

$new_password = $data;
$results["password_hash"] = "";

$results["password_hash"] = password_hash($new_password, PASSWORD_DEFAULT);

// return results
echo json_encode($results);
