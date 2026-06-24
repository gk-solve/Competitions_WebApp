<?php

// JSON endpoint: returns the full list of competitors, sorted by name.

header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $pdo = getDatabase();

    // No filtering/pagination here: every row is returned, sorted in SQL.
    $sql = "
        SELECT
            Competitor_Id,
            First_Name,
            Last_Name,
            Country_Residence
        FROM Competitors
        ORDER BY Last_Name, First_Name
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