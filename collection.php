<?php

require 'config.php';

//get all the entries in the links table and return them as json
$result = mysqli_query($con, "SELECT * FROM links");

//get all the results in an array
$links = array();
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $links[] = $row;
}

if ($result) {
    echo (json_encode($links));
} else {
    echo 'error: ' . mysqli_error($con);
}
