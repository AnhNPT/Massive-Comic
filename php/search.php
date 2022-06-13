<?php
$searchKey = $_GET["key"];

$db = pg_connect("host=localhost port=5432 dbname=comic_data user=postgres password=AnhNPT");

$query = "select * from comic where comic_name LIKE '%".$searchKey."%';";

$result = pg_query($query);
  while ($row = pg_fetch_assoc($result)) {
    $rows[] = $row; 
  }
  echo json_encode($rows); 
?>