<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $pdo = getDatabase();

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