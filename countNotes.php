<?php
  include("config.php");
  
  $tableName = "Note";

  $bdd = new PDO("mysql:host=localhost;dbname=$databaseName;charset=utf8", $user, $pass);
  if( isset($_GET['department']) ) {
    //update
    $req = $bdd->prepare("SELECT COUNT(*) as count FROM $tableName WHERE department = ?");
    $req->execute(array($_GET['department']));
    $res = $req->fetch();

    $data['count']=$res['count'];
    $data['department']=$_GET['department'];

    $row_array['status']='200';
    $row_array['data']=$data;
    echo json_encode($row_array);
    $req->closeCursor();
  }
  else {
    $row_array['status']='404';
    echo json_encode($row_array);
  }
?>
