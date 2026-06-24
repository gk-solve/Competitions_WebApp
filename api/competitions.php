<?php

// JSON endpoint: returns the full list of competitions/tracks, sorted by date.

// Verbose error display enabled for debugging this endpoint specifically.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $pdo = getDatabase();

    // No filtering/pagination here: every row is returned, sorted in SQL.
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

    // Pretty-print and keep accented characters readable in the raw JSON.
    echo json_encode(
        $statement->fetchAll(),
        JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
    );
}
catch (Throwable $e) {

    // Any DB/connection failure becomes a 500 with the error message as JSON.
    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage()
    ]);
}