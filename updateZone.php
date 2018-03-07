<?php
  include("config.php");

  $tableName = "Zone";

  $bdd = new PDO("mysql:host=localhost;dbname=$databaseName;charset=utf8", $user, $pass);
  $req = $bdd->prepare("SELECT COUNT(*) AS count FROM $tableName WHERE name=?");
  $req->execute(array($_POST['name']));
  $res = $req->fetch();
  if($res['count']==0) {
    //new insert
    $req = $bdd->prepare("INSERT INTO $tableName(name, color) VALUES(?,?)");
    $req->execute(array($_POST['name'],$_POST['color']));
    echo 200;
  }
  else {
    //update
    $req = $bdd->prepare("UPDATE $tableName set color = ? WHERE name = ?");
    $req->execute(array($_POST['color'],$_POST['name']));
    echo 200;
  }

  // $result = array();
  // // $json = json_encode($response);
  // while($data = $response->fetch()) {
  //   $row_array['name']=$data['name'];
  //   $row_array['color']=$data['color'];
  //   array_push($result,$row_array);
  // }
  $req->closeCursor();

  // echo json_encode($result);
?>
