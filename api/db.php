<?php

function getDatabase()
{
    $databaseFile = __DIR__ . '/../data/Competitions.sqlite';

    $pdo = new PDO(
        'sqlite:' . $databaseFile,
        null,
        null,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    $pdo->exec('PRAGMA foreign_keys = ON');

    return $pdo;
}