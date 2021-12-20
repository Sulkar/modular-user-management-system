<?php
require_once('./templates/Template.php');

// Initialize the session
session_start();

// Check if the user is already logged in, if yes then redirect him to welcome page
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){

    //echo "<h1>Logged in</h1>";
}else{
    //echo "<h1>not logged in</h1>";
}


$tpl = new Template( './templates/' );



print $tpl->render( 'header', array(
    'myNumber' => 55,
    'myString' => 'Richi'
));

//


print $tpl->render( 'body', array(
    'myNumber' => 55,
    'myString' => 'Richi'
));


print $tpl->render( 'footer', array(
    'myNumber' => 55,
    'myString' => 'Richi'
));

?>