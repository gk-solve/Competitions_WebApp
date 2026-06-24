<?php

// Shared PDO/SQLite connection factory used by all JSON endpoints in this folder.

function getDatabase()
{
    // Resolve the SQLite file relative to this script, not the caller's cwd.
    $databaseFile = __DIR__ . '/../data/Competitions.sqlite';

    // Throw on errors and return rows as associative arrays by default.
    $pdo = new PDO(
        'sqlite:' . $databaseFile,
        null,
        null,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    // Enforce FK constraints (Results -> Competitions/Competitors), off by default in SQLite.
    $pdo->exec('PRAGMA foreign_keys = ON');

    return $pdo;
}