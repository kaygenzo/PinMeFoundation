<?php
  include("config.php");

  $tableName = "Zone";

  $bdd = new PDO("mysql:host=localhost;dbname=$databaseName;charset=utf8", $user, $pass);
  $response = $bdd->query("SELECT * FROM $tableName");
  $result = array();
  // $json = json_encode($response);
  while($data = $response->fetch()) {
    $row_array['name']=$data['name'];
    $row_array['color']=$data['color'];
    array_push($result,$row_array);
  }
  $response->closeCursor();

  echo json_encode($result);
?>
