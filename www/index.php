<?php
/*
    Page: Index / Startpage
*/
require_once('./templates/Template.php');

// Initialize the session
session_start();

// Templates
$tpl = new Template('./templates/');
// Header
print $tpl->render('tmp-header', array('page_css' => '/templates/index_msush/style.css'));
// Body
print $tpl->render('/index_msush/body', array());
// Footer
print $tpl->render('tmp-footer', array(
    'page_javascript1' => '/templates/index_msush/script.js'
));
