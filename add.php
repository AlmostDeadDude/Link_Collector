<?php
// // we add the entry to the database and confirm it
// require 'config.php';

// //get request contains url, categorie, tags, date
// $url = $_GET['url'];
// $category = $_GET['category'];
// $tags = $_GET['tags'];
// $date = date("Y-m-d");

// $tags_arr = explode(',', $tags);
// $tags_extended = '-' . implode('-', $tags_arr) . '-';

// $addQuery = mysqli_query($con, "INSERT INTO links (linkURL, linkCATEGORY, linkTAGS, linkDATE) VALUES ('$url', '$category', '$tags_extended', '$date')");

// if ($addQuery) {
echo 'OK';
// } else {
//     echo 'error: ' . mysqli_error($con);
// }
