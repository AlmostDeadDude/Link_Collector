<?php
// we search for the entry in database using given attributes
require 'config.php';

//get request contains categorie and tags
$category = $_GET['category'];
//tags can be empty, in this case we don't filter by tags

$tags = explode(',', $_GET['tags']);

//search query is looking for links with given category and containing all the tags in any order
$searchQuery = "SELECT * FROM links WHERE linkCATEGORY = '$category'";
if ($_GET['tags'] != '') {
    foreach ($tags as $tag) {
        $searchQuery .=  " AND linkTAGS LIKE '%-" . $tag . "-%'";
    }
}

$result = mysqli_query($con, $searchQuery);
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
