// REST API (V0.2) for Competitions WebApp.
// Replaces the V0.1 PHP JSON endpoints (api/*.php) one route at a time, same SQLite database.

const path = require('path');
const express = require('express');
const { getDatabase } = require('./db');
const { ApiError } = require('./errors');

const app = express();
const port = 8080;
const projectRoot = path.join(__dirname, '..');

// Static frontend: the built Angular SPA (client-angular/dist), plus css/ and assets/
// still served from the project root since the Angular app links to them directly
// (see client-angular/src/index.html) instead of bundling its own copy.
app.use('/css', express.static(path.join(projectRoot, 'css')));
app.use('/assets', express.static(path.join(projectRoot, 'assets')));
app.use(express.static(path.join(projectRoot, 'client-angular', 'dist')));

// Client-side routing (Angular Router): any non-API, non-static GET falls back to the
// SPA shell so deep links like /competitions survive a full page reload.
app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(projectRoot, 'client-angular', 'dist', 'index.html'));
});

// Fail fast with a clear message if the SQLite file is missing/unreadable.
let db;
try {
    db = getDatabase();
}
catch (error) {
    console.error('Failed to open the database:', error.message);
    process.exit(1);
}

// GET /api/competitions - list of competitions/tracks, sorted by date.
app.get('/api/competitions', (req, res, next) => {
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
        next(new ApiError(500, 'DB_ERROR', error.message));
    }
});

// GET /api/competitors - list of competitors, sorted by name.
app.get('/api/competitors', (req, res, next) => {
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
        next(new ApiError(500, 'DB_ERROR', error.message));
    }
});

// GET /api/results - all results, joined via the Results_View SQL view.
app.get('/api/results', (req, res, next) => {
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
        next(new ApiError(500, 'DB_ERROR', error.message));
    }
});

// Unknown route -> 404 with the same JSON error shape as the rest of the API.
app.use((req, res) => {
    res.status(404).json({
        error: { code: 'NOT_FOUND', message: `Route not found: ${req.method} ${req.path}` }
    });
});

// Centralized error handler: every route forwards failures here via next(error)
// instead of formatting the response itself, so the JSON error shape stays consistent.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';

    res.status(statusCode).json({
        error: { code, message: err.message }
    });
});

app.listen(port, () => {
    console.log(`Competitions WebApp REST API listening on http://localhost:${port}`);
});
