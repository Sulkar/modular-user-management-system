<?php
/*
    Page: Profile
*/
require_once('./templates/Template.php');

// Initialize the session
session_start();

// Check if the user is logged in, if not then redirect to startpage
if (!isset($_SESSION["loggedIn"]) && !$_SESSION["loggedIn"] === true) {
    header("location: ../");
    exit;
}

// Templates
$tpl = new Template('./templates/');
// Header
print $tpl->render('tmp-header', array('page_css' => '/templates/profile/style.css'));
// Body
print $tpl->render('/profile/body', array());
// Footer
print $tpl->render('tmp-footer', array(
    'page_javascript' => '/templates/profile/script.js'
));
