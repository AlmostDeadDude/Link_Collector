<?php

//adjust this to your needs
$user = 'root';
$password = 'root';
$db = 'link_collector';
$host = '127.0.0.1';
$port = 3306;

//establish connection
$con = mysqli_connect($host, $user, $password, $db);
if (!$con) {
    die(json_encode("Connection failed: " . mysqli_connect_error()));
}
