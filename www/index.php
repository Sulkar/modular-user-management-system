<?php
require_once('./templates/Template.php');


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