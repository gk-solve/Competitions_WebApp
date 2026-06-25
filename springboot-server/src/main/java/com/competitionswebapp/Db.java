package com.competitionswebapp;

import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.stereotype.Component;
import org.sqlite.SQLiteConfig;

// Shared SQLite connection factory used by all REST routes.
// Mirrors server/db.js (Express), db.py (FastAPI), and Db.cs (ASP.NET Core) for parity;
// same SQLite file, read-only.
@Component
public class Db {

    private final Connection connection;

    public Db(ProjectPaths projectPaths) throws SQLException {
        Path databaseFile = projectPaths.getRoot().resolve("data").resolve("Competitions.sqlite");

        // The Xerial driver expects read-only mode via SQLiteConfig, not a "?mode=ro" query
        // string (that's the Python sqlite3 URI convention, silently treated here as part of
        // the filename and creating an empty database instead of opening the real one).
        SQLiteConfig config = new SQLiteConfig();
        config.setReadOnly(true);

        connection = DriverManager.getConnection("jdbc:sqlite:" + databaseFile, config.toProperties());

        // Enforce FK constraints (Results -> Competitions/Competitors), off by default in SQLite.
        try (Statement pragma = connection.createStatement()) {
            pragma.execute("PRAGMA foreign_keys = ON");
        }
    }

    public Connection getConnection() {
        return connection;
    }
}
