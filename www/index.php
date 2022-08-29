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
print $tpl->render('tmp-header', array());
// Body
print $tpl->render('tmp-index', array());
// Footer
print $tpl->render('tmp-footer', array(  
    'page_javascript' => '/js/index.js'
));
