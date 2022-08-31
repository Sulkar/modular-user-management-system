<?php

// Include config file
require_once "config.php";

// data from js file
$data = json_decode(file_get_contents('php://input'), true);

// get variables from javascript
$username = $data["username"];
$password = $data["password"];
$username_err = $password_err = $login_err = "";
$results["loggedIn"] = false;
$results["error"] = "";

// Check if username is empty
if (empty(trim($username))) {
    $username_err = "Please enter username.";
    $results["error"] = $username_err;
} else {
    $username = trim($username);
}

// Check if password is empty
if (empty(trim($password))) {
    $password_err = "Please enter your password.";
    $results["error"] = $password_err;
} else {
    $password = trim($password);
    
}

// Validate credentials
if (empty($username_err) && empty($password_err)) {
    try {
        // Prepare a select statement
        $sql = "SELECT * FROM users WHERE username = :username";

        if ($stmt = $pdo->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bindParam(":username", $param_username, PDO::PARAM_STR);

            // Set parameters
            $param_username = trim($username);

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Check if username exists, if yes then verify password
                if ($stmt->rowCount() == 1) {
                    if ($row = $stmt->fetch()) {
                        $id = $row["id"];
                        $username = $row["username"];
                        $role = $row["role"];
                        $klasse = $row["klasse"];
                        $db_password = $row["password"];
                        //if (password_verify($password, $hashed_password)) {
                        if ($password == $db_password) {
                           
                            session_start();
                            // Store data in session variables
                            $_SESSION["loggedIn"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;
                            $_SESSION["role"] = $role;
                            $_SESSION["klasse"] = $klasse;
                            // update result
                            $results["loggedIn"] = true;
                        } else {
                            // Password is not valid, display a generic error message
                            $results["error"] = "Username or Password are incorrect.";
                        }
                    }
                } else {
                    // Username doesn't exist, display a generic error message
                    $results["error"] = "Username or Password are incorrect.";
                }
            } else {
                $results["error"] = "Username or Password are incorrect.";
            }

            // Close statement
            unset($stmt);
        }
    } catch (Exception $exception) {
        $results["error"] = $exception;
    }
}

// Close connection
unset($pdo);

// return results
echo json_encode($results);
