<?php
/*
    Page: Login
*/
require_once('./templates/Template.php');

// Initialize the session
session_start();

// Templates
$tpl = new Template('./templates/');
// Header
print $tpl->render('tmp-header', array());
// Body
print $tpl->render('tmp-login', array());
// Footer
print $tpl->render('tmp-footer', array(
    'page_javascript' => '/js/login.js'
));
