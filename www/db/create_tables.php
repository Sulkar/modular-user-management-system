<?php
// Include config file
require_once "config.php";
 
// Define variables and initialize with empty values
$username = "admin";
$password = "admin";
   
// Prepare an insert statement
$sql = "INSERT INTO users (username, password) VALUES (:username, :password)";
    
if($stmt = $pdo->prepare($sql)){
    // Bind variables to the prepared statement as parameters
    $stmt->bindParam(":username", $param_username, PDO::PARAM_STR);
    $stmt->bindParam(":password", $param_password, PDO::PARAM_STR);
    
    // Set parameters
    $param_username = $username;
    $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
    
    // Attempt to execute the prepared statement
    if($stmt->execute()){
        // Redirect to login page
        header("location: login.php");
    } else{
        echo "Oops! Something went wrong. Please try again later.";
    }

    // Close statement
    unset($stmt);
}
    
// Close connection
unset($pdo);
