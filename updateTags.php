<?php

require 'config.php';

//can add multiple, comma separated tags
$add_tag = $_GET['add_tag'];
$add_tag_arr = explode(',', $add_tag);
//only single tagname to remove
$remove_tag = $_GET['remove_tag'];

//status var
$success = true;
$error_msg = '';

//get existing cats first
$existing_tags = mysqli_query($con, "SELECT tagNAME FROM tags");
$tagNames = array();
while ($rowCat = mysqli_fetch_array($existing_tags)) {
    $tagNames[] = $rowCat['tagNAME'];
}


//then query to add tags, if they don't exist already
if ($add_tag != '') {
    foreach ($add_tag_arr as $tag_raw) {
        $tag = trim($tag_raw);
        if (!in_array($tag, $tagNames)) {
            $add_tag_query = mysqli_query($con, "INSERT INTO tags (tagNAME) VALUES ('$tag')");
            if (!$add_tag_query) {
                $success = false;
                $error_msg = mysqli_error($con);
            }
        }
    }
}

//then query to remove cat
if ($remove_tag) {
    $remove_tag_query = mysqli_query($con, "DELETE FROM tags WHERE tagNAME = '$remove_tag'");
    if (!$remove_tag_query) {
        $success = false;
        $error_msg = mysqli_error($con);
    }
}

if ($success) {
    echo 'OK';
} else {
    echo 'latest error: ' . $error_msg;
}
