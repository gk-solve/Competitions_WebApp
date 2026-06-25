# Shared SQLite connection factory used by all REST routes.
# Mirrors server/db.js (the Express version) for parity; same SQLite file, read-only.

import sqlite3
from pathlib import Path

DATABASE_FILE = Path(__file__).resolve().parent.parent / "data" / "Competitions.sqlite"


def get_database() -> sqlite3.Connection:
    # Read-only connection via the sqlite3 URI mode (uri=True required for the mode= query param).
    connection = sqlite3.connect(f"file:{DATABASE_FILE}?mode=ro", uri=True, check_same_thread=False)

    # Return rows as dict-like objects instead of plain tuples.
    connection.row_factory = sqlite3.Row

    # Enforce FK constraints (Results -> Competitions/Competitors), off by default in SQLite.
    connection.execute("PRAGMA foreign_keys = ON")

    return connection
