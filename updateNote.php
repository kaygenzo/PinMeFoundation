<?php
  include("config.php");

  $tableName = "Note";

  $bdd = new PDO("mysql:host=localhost;dbname=$databaseName;charset=utf8", $user, $pass);
  if( isset($_POST['id']) ) {
    //update
    $req = $bdd->prepare("UPDATE $tableName set content = ? WHERE _id = ?");
    $req->execute(array($_POST['content'], $_POST['id']));
    $row_array['status']='200';
    echo json_encode($row_array);
    $req->closeCursor();
  }
  else {
    $req = $bdd->prepare("INSERT INTO $tableName(department, author, content) VALUES(?,?,?)");
    $req->execute(array($_POST['department'], $_POST['author'], $_POST['content']));
    $id = $bdd->lastInsertId();

    $req = $bdd->prepare("SELECT * FROM $tableName WHERE _id = ?");
    $req->execute(array($id));
    $res = $req->fetch();

    $data['id']=$res['_id'];
    $data['department']=$res['department'];
    $data['author']=$res['author'];
    $data['content']=$res['content'];
    $data['creation']=$res['creation'];
    $data['modification']=$res['modification'];

    $row_array['status']='200';
    $row_array['data']=$data;

    echo json_encode($row_array);

    $req->closeCursor();
  }
?>
