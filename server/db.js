// Shared SQLite connection factory used by all REST routes.
// Mirrors api/db.php for V0.1 parity; the SQLite file itself is unchanged.

const path = require('path');
const Database = require('better-sqlite3');

const databaseFile = path.join(__dirname, '..', 'data', 'Competitions.sqlite');

function getDatabase() {
    const db = new Database(databaseFile, { readonly: true });

    // Enforce FK constraints (Results -> Competitions/Competitors), off by default in SQLite.
    db.pragma('foreign_keys = ON');

    return db;
}

module.exports = { getDatabase };
