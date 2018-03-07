<?php
  include("config.php");
  
  $tableName = "Note";

  $bdd = new PDO("mysql:host=localhost;dbname=$databaseName;charset=utf8", $user, $pass);
  $req = $bdd->prepare("SELECT * FROM $tableName WHERE department = ? ORDER BY modification DESC");
  $req->execute(array($_GET['department']));
  $result = array();
  // $json = json_encode($response);
  while($data = $req->fetch()) {
    $row_array['id']=$data['_id'];
    $row_array['department']=$data['department'];
    $row_array['author']=$data['author'];
    $row_array['content']=$data['content'];
    $row_array['creation']=$data['creation'];
    $row_array['modification']=$data['modification'];
    array_push($result,$row_array);
  }
  $req->closeCursor();

  echo json_encode($result);
?>
