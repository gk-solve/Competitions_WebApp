<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $pdo = getDatabase();

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