<?php
session_start();

// Include config file
require_once "config.php";

// data from js file
$data = json_decode(file_get_contents('php://input'), true);

// Define variables and initialize with empty values
$new_password = $data["newPassword"];
$confirm_password = $data["confirmPassword"];
$new_password_err = $confirm_password_err = "";

$results["passwordChanged"] = false;
$results["result"] = "";
$results["error"] = "";

// Validate new password
if (empty(trim($new_password))) {
    $new_password_err = "Please enter the new password.";
    $results["error"] = $new_password_err;
} elseif (strlen(trim($new_password)) < 4) {
    $new_password_err = "Password must have atleast 4 characters.";
    $results["error"] = $new_password_err;
} else {
    $new_password = trim($new_password);
}

// Validate confirm password
if (empty(trim($confirm_password))) {
    $confirm_password_err = "Please confirm the password.";
    $results["error"] = $confirm_password_err;
} else {
    $confirm_password = trim($confirm_password);
    if (empty($new_password_err) && ($new_password != $confirm_password)) {
        $confirm_password_err = "Password did not match.";
        $results["error"] = $confirm_password_err;
    }
}

// Check input errors before updating the database
if (empty($new_password_err) && empty($confirm_password_err)) {
    // Prepare an update statement
    $sql = "UPDATE users SET password = :password WHERE id = :id";

    if ($stmt = $pdo->prepare($sql)) {
        // Bind variables to the prepared statement as parameters
        $stmt->bindParam(":password", $param_password, PDO::PARAM_STR);
        $stmt->bindParam(":id", $param_id, PDO::PARAM_INT);

        // Set parameters
        $param_password = password_hash($new_password, PASSWORD_DEFAULT);
        $param_id = $_SESSION["id"];

        // Attempt to execute the prepared statement
        if ($stmt->execute()) {
            // Password updated successfully.
            $results["passwordChanged"] = true;
            $results["result"] = "Password updated successfully";
        } else {
            $results["error"] = "Problems updating password.";
        }

        // Close statement
        unset($stmt);
    }
}

// Close connection
unset($pdo);

// return results
echo json_encode($results);