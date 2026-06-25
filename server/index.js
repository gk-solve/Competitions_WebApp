// REST API (V0.2) for Competitions WebApp.
// Replaces the V0.1 PHP JSON endpoints (api/*.php) one route at a time, same SQLite database.

const express = require('express');
const { getDatabase } = require('./db');

const app = express();
const port = 3000;

const db = getDatabase();

// GET /api/competitions - list of competitions/tracks, sorted by date.
app.get('/api/competitions', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT
                CompetitionTrack_Id,
                Sport,
                Competition_Name,
                Competition_Track,
                Competition_Date,
                Location_Country,
                Location_City
            FROM Competitions
            ORDER BY Competition_Date
        `).all();

        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/competitors - list of competitors, sorted by name.
app.get('/api/competitors', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT
                Competitor_Id,
                First_Name,
                Last_Name,
                Country_Residence
            FROM Competitors
            ORDER BY Last_Name, First_Name
        `).all();

        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/results - all results, joined via the Results_View SQL view.
app.get('/api/results', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT *
            FROM Results_View
            ORDER BY
                Competition_Date DESC,
                Sport,
                Competition_Name,
                Individual_Rank
        `).all();

        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Competitions WebApp REST API listening on http://localhost:${port}`);
});
