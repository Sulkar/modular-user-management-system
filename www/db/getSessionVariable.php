<?php

session_start();
$data["result"] = $_SESSION;
// return results
echo json_encode($data);
