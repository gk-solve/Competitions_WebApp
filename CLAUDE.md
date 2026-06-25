# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Competitions WebApp displays and queries amateur sports competition results (running, cycling, open-water swimming). It is mid-migration from **V0.1** to **V0.2**:

- **Presentation**: static HTML/CSS + vanilla JavaScript (no framework, no build step) — unchanged from V0.1.
- **Business logic**: a Node.js/Express REST API in `server/` (replaced the V0.1 PHP JSON endpoints, which have been removed).
- **Data**: still a single SQLite database at `data/Competitions.sqlite` for now; a future step will migrate this to Azure SQL (likely in a VNet) — keep that in mind before adding SQLite-specific behavior that would be costly to port.

## Running the app

No build tooling beyond npm. From `server/`:

```bash
cd server
npm install   # first time only
node index.js
```

This single Express process serves **both** the REST API and the static frontend on **port 8080** (fixed by convention for this app — the `run-app` skill and habitual links assume this port). Open `http://localhost:8080/index.htm` (or `competitions.htm`, `competitors.htm`, `results.htm`).

To inspect or modify the database directly:

```bash
sqlite3 data/Competitions.sqlite
```

There is no automated lint/test/build command in this repo — verify changes by loading the pages in a browser and checking the `/api/*` JSON output directly (e.g. `http://localhost:8080/api/results`).

## Architecture

### Page ↔ script ↔ endpoint pairing

Each page follows the same fixed pattern; when changing one piece, check the other two:

| Page | Script | Endpoint | Container element |
|---|---|---|---|
| `competitions.htm` | `js/competitions.js` | `GET /api/competitions` | `#competitions-container` |
| `competitors.htm` | `js/competitors.js` | `GET /api/competitors` | `#competitors-container` |
| `results.htm` | `js/results.js` | `GET /api/results` | `#results-container` |

Each page-specific script: fetches JSON via `fetchJson()` (defined in `js/common.js`, loaded first), builds an HTML `<table>` string by hand, and injects it with `innerHTML`. There is no shared rendering helper between pages — table-building is duplicated intentionally per page; follow the existing style rather than introducing a shared abstraction.

### Express server (`server/`)

- `server/db.js` exposes a single `getDatabase()` factory returning a read-only `better-sqlite3` connection, with `PRAGMA foreign_keys = ON`.
- `server/errors.js` defines `ApiError(statusCode, code, message)` — throw/`next()` this (not a plain `Error`) for anything that should produce a specific HTTP status and machine-readable `code` in the response.
- `server/index.js`:
  - Mounts `/api/competitions`, `/api/competitors`, `/api/results` (read-only `SELECT`s, no filtering/pagination — all rows always returned, sorted in SQL). `results` reads from the `Results_View` SQL view rather than joining tables in route code; prefer extending the view over adding joins here.
  - Serves the static frontend by mounting `express.static` **per directory** (`/css`, `/js`, `/assets`) and explicit `app.get` routes for each `.htm` page — deliberately not a single `express.static(projectRoot)`, so `data/` (the SQLite file) and `server/` (source, `node_modules`) are never reachable over HTTP.
  - Has a catch-all 404 handler and a centralized error-handling middleware (last in the chain) that formats every error as `{"error": {"code": ..., "message": ...}}`. Routes should call `next(new ApiError(...))` on failure rather than formatting their own error response.
  - Fails fast at startup (`process.exit(1)`) if the SQLite file can't be opened.

### Database schema (`data/Competitions.sqlite`)

Three base tables plus one view:

- `Competitions(CompetitionTrack_Id PK, Sport, Competition_Name, Competition_Track, Competition_Date, Location_Country, Location_City)`
- `Competitors(Competitor_Id PK, First_Name, Last_Name, Country_Residence)`
- `Results(Result_Id PK, CompetitionTrack_Id FK, Competitor_Id FK, Elapsed_Time_ms, Individual_Rank, Result_Status)` — FKs cascade on update/delete, `UNIQUE(CompetitionTrack_Id, Competitor_Id)`, `Result_Status` constrained to `FINISHED | DNF | DNS | DSQ`, `Elapsed_Time_ms`/`Individual_Rank` must be `> 0` when not NULL.
- `Results_View` joins all three tables and additionally computes `Elapsed_Time` as a formatted `HH:MM:SS.mmm` string from `Elapsed_Time_ms`. Any new result-related query should go through this view rather than re-deriving the time format elsewhere.

### i18n

All user-facing text (pages, table headers, error messages) is in French; keep new UI strings consistent with this.
