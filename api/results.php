<?php

// JSON endpoint: returns all competition results, joined with competition and
// competitor details via the Results_View SQL view.

header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $pdo = getDatabase();

    // Results_View already joins Results/Competitions/Competitors and formats
    // Elapsed_Time, so no joins are needed here.
    $sql = "
        SELECT
            *
        FROM Results_View
        ORDER BY
            Competition_Date DESC,
            Sport,
            Competition_Name,
            Individual_Rank
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