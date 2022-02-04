<?php
require_once('./templates/Template.php');

// Initialize the session
session_start();
$email = "";

// Check if the user is already logged in, if yes then redirect him to start page
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    require_once "./db/db_profile.php";
} else {
    header("location: ../");
    exit;
}

$tpl = new Template('./templates/');

print $tpl->render('header', array(
    'db_error' => $_SESSION["last_error"],
    'db_result' => $_SESSION["last_result"]
));

print $tpl->render('tmp-profile', array(
    'username' => $_SESSION["username"],
    'email' => $email
));

print $tpl->render('footer', array(

));

// reset infos
$_SESSION["last_result"] = $_SESSION["last_error"] = "";