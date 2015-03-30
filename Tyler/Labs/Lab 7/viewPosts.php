<?php
    //start session
    session_start();
?>
<?
    //use file_get_contents from posts.txt
    //Store those contents into this json container.
    $myJSON;
    //convert to php object(json_decode/json_encode)
    //In other words, turn json string into a php array.
    $myArray;

    //Loop through object
        //    Create html rows w/ a link to update post(that will use 
        //javascript to bring up a prompt to get the update and then   
        //make an ajax call to updatePosts.php to do the update) and 
        //then refreshes only the table (and not the rest of the 
        //page).

    //Store the post object in the session object. 


<?