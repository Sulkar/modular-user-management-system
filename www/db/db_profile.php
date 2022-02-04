<?php

// Include config file
require_once "config.php";

// Define variables and initialize with empty values
$email = "";

// Prepare a select statement
$sql = "SELECT email FROM users WHERE id = :id";

if ($stmt = $pdo->prepare($sql)) {
    // Bind variables to the prepared statement as parameters
    $stmt->bindParam(":id", $param_id, PDO::PARAM_STR);

    // Set parameters
    $param_id = $_SESSION["id"];

    // Attempt to execute the prepared statement
    if ($stmt->execute()) {
        // Check if username exists, if yes then verify password
        if ($stmt->rowCount() == 1) {
            if ($row = $stmt->fetch()) {
                $email = $row["email"];
            }
        } else {
            // Username doesn't exist, display a generic error message
            $profile_err = "Problems getting profile data.";
        }
    } else {
        echo "Problems getting profile data.";
    }

    // Close statement
    unset($stmt);
}


// Close connection
unset($pdo);
