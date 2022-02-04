<?php
require_once('./templates/Template.php');

// Initialize the session
session_start();
$login_err = "";

// Check if the user is already logged in, if yes then redirect him to welcome page
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    //exit;
} else {
    // Include login file
    require_once "./db/db_login.php";
}

$tpl = new Template('./templates/');

print $tpl->render('header', array(
    'db_error' => $login_err
));

print $tpl->render('tmp-body', array(
    'myNumber' => 55,
    'myString' => 'Richi'
));

print $tpl->render('footer', array(
    'myNumber' => 55,
    'myString' => 'Richi'
));
