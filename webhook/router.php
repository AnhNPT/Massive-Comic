<?php

$json = file_get_contents('php://input');
file_put_contents("logs.txt", $json);

$data = json_decode($json);

$event = $data->event;
$collection = $data->collection;

if ($collection == "chapter") {

    if ($event == "items.get") {
        getChapter($data);
    }

    if ($event == "items.create" || $event == "items.update" || $event == "items.delete") {
        hookChapter($data);
    }

}

// Chapter
function getChapter($data) {
    $payload = $data->payload;
    $comicID = $payload->id_comic;
    echo updateComicView($comicID);
}

function hookChapter($data) {
    $payload = $data->payload;
    $comicID = $payload->id_comic;
    $chapterName = $payload->chapter_name;
    echo updateComicMetaData($comicID, $chapterName);
}

// Comic
function updateComicMetaData($comicID, $chapterName) {
    $dbConn = getDBConnect();

    $queryCount = 'select COUNT(*) from chapter where id_comic = '.$comicID.';';
    $count = countNumber($dbConn, $queryCount);

    $queryUpdate = 'update comic set comic_total_chapter = '.$count.', newest_chapter = \''.$chapterName.'\' where id = '.$comicID.';';
    return update($dbConn, $queryUpdate);
}

function updateComicView($comicID) {
    $dbConn = getDBConnect();

    $queryCount = 'select comic_view from comic where id = '.$comicID.';';
    $count = query($dbConn, $queryCount);
    $rawCount = (int)$count + 1;
    
    $query = 'mutation { update_comic_item(id: '.$comicID.', data: {comic_view: '.$rawCount.'}) }';

    return callAPI($query);
}

// Query
function getDBConnect() {
    $hostname = "localhost";
    $post = "5432";
    $dbname = "comic_data";
    $username = "postgres";
    $password = "AnhNPT";

    // Create connection
    return pg_connect('host='.$hostname.' port='.$post.' dbname='.$dbname.' user='.$username.' password='.$password);
}

function query($dbConn, $query) {
    $query = pg_query($dbConn, $query);
    if ($query) {
            while ($row = pg_fetch_row($query)) {
            return $row[0];
        }
    } else {
        return 'false';
    }
}

function countNumber($dbConn, $query) {
    $query = pg_query($dbConn, $query);
    if ($query) {
        while ($row = pg_fetch_row($query)) {
            return $row[0];
        }
    } else {
        return 0;
    }
}

function update($dbConn, $query) {
    $query = pg_query($dbConn, $query);
    if ($query) {
        return 'true';
    } else {
        return 'false';
    }
}

function callAPI($query) {
    $token = '51d84695a55fdb365e85c91474986a61d115538058ab9132217b310574026512';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:8055/graphql');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $token,
    ]);

    // body string
    $body = '{
        "query": "'.$query.'"
    }';
    // set body
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

    $response = curl_exec($ch);
    if (is_null($response)) { return ''; }

    curl_close($ch);

    return $body;
}