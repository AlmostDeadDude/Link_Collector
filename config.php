<?php

//adjust this to your needs

//local version (MAMP)
// $user = 'root';
// $password = 'root';
// $db = 'link_collector';
// $host = '127.0.0.1';
// $port = 3306;

//hosted version
$user = 'u579090749_main_collector';
$password = '$VQu-Wn$C:vTN#4X';
$db = 'u579090749_link_collector';
$host = 'localhost';

//establish connection
$con = mysqli_connect($host, $user, $password, $db);
if (!$con) {
    die(json_encode("Connection failed: " . mysqli_connect_error()));
}
