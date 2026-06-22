<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $pdo = getDatabase();

    $sql = "
        SELECT
            CompetitionTrack_Id,
            Sport,
            Competition_Name,
            Competition_Track,
            Competition_Date,
            Location_Country,
            Location_City
        FROM Competitions
        ORDER BY Competition_Date
    ";

    $statement = $pdo->query($sql);

    echo json_encode(
        $statement->fetchAll(),
        JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
    );
}
catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage()
    ]);
}