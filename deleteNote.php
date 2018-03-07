<?php
  include("config.php");
  
  $tableName = "Note";

  $bdd = new PDO("mysql:host=localhost;dbname=$databaseName;charset=utf8", $user, $pass);
  if( isset($_POST['id']) ) {
    //update
    $req = $bdd->prepare("DELETE FROM $tableName WHERE _id = ?");
    $req->execute(array($_POST['id']));
    $row_array['status']='200';
    echo json_encode($row_array);
    $req->closeCursor();
  }
  else {
    $row_array['status']='404';
    echo json_encode($row_array);
  }
?>
