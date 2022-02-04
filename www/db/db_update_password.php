<?php
session_start();

// Include config file
require_once "config.php";

// reset infos
$_SESSION["last_result"] = $_SESSION["last_error"] = "";


// Define variables and initialize with empty values
$new_password = $confirm_password = "";
$new_password_err = $confirm_password_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validate new password
    if (empty(trim($_POST["new_password"]))) {
        $new_password_err = "Please enter the new password.";
    } elseif (strlen(trim($_POST["new_password"])) < 4) {
        $new_password_err = "Password must have atleast 4 characters.";
    } else {
        $new_password = trim($_POST["new_password"]);
    }

    // Validate confirm password
    if (empty(trim($_POST["confirm_password"]))) {
        $confirm_password_err = "Please confirm the password.";
    } else {
        $confirm_password = trim($_POST["confirm_password"]);
        if (empty($new_password_err) && ($new_password != $confirm_password)) {
            $confirm_password_err = "Password did not match.";
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
                $_SESSION["last_result"] = "Password updated successfully";
                header("location: ../profile.php");
                exit();
            } else {
                $_SESSION["last_error"] = "Problems updating password.";
                header("location: ../profile.php");
                exit();
            }

            // Close statement
            unset($stmt);
        }
    }

    // Close connection
    unset($pdo);
    
    $_SESSION["last_error"] = "Problems updating password.";
    header("location: ../profile.php");
    exit();
}
