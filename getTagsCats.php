<?php
//this script connects to db and gets all the tags and categories

require 'config.php';

//status var
$success = true;
$error_msg = '';

$resultTags = mysqli_query($con, "SELECT tagNAME FROM tags");
if (!$resultTags) {
    $success = false;
    $error_msg = mysqli_error($con);
}
//fetch all the tags
$tagNames = array();
while ($rowTag = mysqli_fetch_array($resultTags)) {
    $tagNames[] = $rowTag['tagNAME'];
}

$resultCategories = mysqli_query($con, "SELECT categoryNAME FROM categories");
if (!$resultCategories) {
    $success = false;
    $error_msg = mysqli_error($con);
}
//fetch all the categories
$categoryNames = array();
while ($rowCat = mysqli_fetch_array($resultCategories)) {
    $categoryNames[] = $rowCat['categoryNAME'];
}

if ($success) {
    //return resultTags and resultCategories in json format
    echo json_encode(array($tagNames, $categoryNames));
} else {
    echo 'latest error: ' . $error_msg;
}
