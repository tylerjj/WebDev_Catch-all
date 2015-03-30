
<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 'On');
//start session
session_start();
?>
<?php
    date_default_timezone_set('America/New_York');
    
    //GET JSON STRING FROM POST
    $myJSON = $_POST['data'];

    //DECODE JSON STRING INTO AN ASSOCIATIVE ARRAY
    $myArray = json_decode($myJSON, true);
    
    //GET VALUES FROM ARRAY
    $username = $myArray['username'];
    $password = $myArray['password'];

    // PARSE FILE FOR MATCHING USERNAME/PASSWORD COMBINATION
//TODO
    $file = file_get_contents("./users.txt", FILE_USE_INCLUDE_PATH);

    
 //   $arrayOfJSONs = array();
    $arrayOfJSONs = json_decode($file, true);
    
//    echo "File: ";
//    var_dump($file);
//    echo "</br>";

    $match = "false";
    for ($i = 0;  $i<=$arrayOfJSONs["username"].count() and $i<=$arrayOfJSONs["password"].count(); $i++){
        if (($username==$arrayOfJSONs['username'][$i])and($password==$arrayOfJSONs['password'][$i])){
            $match = "true";
            $_SESSION['username'] = $username;
        }
    }

//    echo "Username array: ";
//    var_dump($arrayOfJSONs['username']);  
//    echo "</br>";

//    echo "Password array: ";
//    var_dump($arrayOfJSONs['password']);  
//    echo "</br>";

    //STORE USERNAME IN SESSION VARIABLE
//    $_SESSION['username'] = $username;

    // RETURN MATCH RESULTS
//    echo "Match results: ";
    echo $match;
//    echo "</br>";

    //NOTE: THIS IS JUST FOR FUTURE RFERENCE:
    //    To send back a json, encode an associative array.
    ////$returnJSON = json_encode($myArray);
    ////echo $returnJSON;
    
?>