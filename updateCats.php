<?php

require 'config.php';

//can add multiple, comma separated cats
$add_cat = $_GET['add_cat'];
$add_cat_arr = explode(',', $add_cat);
//only single catname to remove
$remove_cat = $_GET['remove_cat'];

//status var
$success = true;
$error_msg = '';

//get existing cats first
$existing_cats = mysqli_query($con, "SELECT categoryNAME FROM categories");
$categoryNames = array();
while ($rowCat = mysqli_fetch_array($existing_cats)) {
    $categoryNames[] = $rowCat['categoryNAME'];
}


//then query to add cats, if they don't exist already
if ($add_cat != '') {
    foreach ($add_cat_arr as $cat_raw) {
        $cat = trim($cat_raw);
        if (!in_array($cat, $categoryNames)) {
            $add_cat_query = mysqli_query($con, "INSERT INTO categories (categoryNAME) VALUES ('$cat')");
            if (!$add_cat_query) {
                $success = false;
                $error_msg = mysqli_error($con);
            }
        }
    }
}

//then query to remove cat
if ($remove_cat) {
    $remove_cat_query = mysqli_query($con, "DELETE FROM categories WHERE categoryNAME = '$remove_cat'");
    if (!$remove_cat_query) {
        $success = false;
        $error_msg = mysqli_error($con);
    }
}

if ($success) {
    echo 'OK';
} else {
    echo 'latest error: ' . $error_msg;
}
