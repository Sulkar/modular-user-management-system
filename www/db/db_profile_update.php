<?php
session_start();

// Include config file
require_once "config.php";

// reset infos
$_SESSION["last_result"] = $_SESSION["last_error"] = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        //try to update db of code
        $sql_update = "UPDATE users SET email = :email WHERE id = :id";

        $stmt = $pdo->prepare($sql_update);
        // Bind variables to the prepared statement as parameters
        $stmt->bindParam(":id", $param_id, PDO::PARAM_STR);
        $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);

        $param_id = $_SESSION["id"];
        $param_email = $_POST["new_email"];

        // Attempt to execute the prepared statement
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            //update
            $_SESSION["last_result"] = "E-Mail updated.";
            header("location: ../profile.php");
            exit();
        }
    } catch (Exception $e) {
        $_SESSION["last_error"] = "Problems updating profile data.";
        header("location: ../profile.php");
        exit();
    }
}

// Close statement
unset($stmt);

// Close connection
unset($pdo);
