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
print $tpl->render('tmp-header', array('page_css' => '/templates/login/style.css'));
// Body
print $tpl->render('/login/body', array());
// Footer
print $tpl->render('tmp-footer', array(
    'page_javascript1' => '/templates/login/script.js'
));

