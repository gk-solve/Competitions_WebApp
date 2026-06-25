// Shared SQLite connection factory used by all REST routes.
// Mirrors server/db.js (Express) and db.py (FastAPI) for parity; same SQLite file, read-only.

using Microsoft.Data.Sqlite;

public static class Db
{
    public static SqliteConnection GetDatabase()
    {
        var databaseFile = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "Competitions.sqlite");

        var connectionString = new SqliteConnectionStringBuilder
        {
            DataSource = databaseFile,
            Mode = SqliteOpenMode.ReadOnly
        }.ToString();

        var connection = new SqliteConnection(connectionString);
        connection.Open();

        // Enforce FK constraints (Results -> Competitions/Competitors), off by default in SQLite.
        using var pragma = connection.CreateCommand();
        pragma.CommandText = "PRAGMA foreign_keys = ON";
        pragma.ExecuteNonQuery();

        return connection;
    }
}
