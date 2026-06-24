# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Competitions WebApp displays and queries amateur sports competition results (running, cycling, open-water swimming). This is **V0.1**, an intentionally lightweight 3-tier monolith:

- **Presentation**: static HTML/CSS + vanilla JavaScript (no framework, no build step)
- **Business logic**: PHP scripts in `api/` acting as JSON endpoints (not a REST API)
- **Data**: a single SQLite database at `data/Competitions.sqlite`

A planned **V0.2** (not yet started) will move to a JS framework (React/Angular/Vue), real REST APIs, and Azure SQL instead of SQLite — keep this in mind before adding heavy abstractions to V0.1 that would only be thrown away.

## Running the app

No build tooling, package manager, or test suite exists. To run locally, serve the directory with PHP's built-in server (needs the `sqlite3` PHP extension enabled):

```bash
php -S localhost:8080
```

Then open `http://localhost:8080/index.htm` (or `competitions.htm`, `competitors.htm`, `results.htm`).

To inspect or modify the database directly:

```bash
sqlite3 data/Competitions.sqlite
```

There is no automated lint/test/build command in this repo — verify changes by loading the pages in a browser and checking the `api/*.php` JSON output directly (e.g. `http://localhost:8080/api/results.php`).

## Architecture

### Page ↔ script ↔ endpoint pairing

Each page follows the same fixed pattern; when changing one piece, check the other two:

| Page | Script | Endpoint | Container element |
|---|---|---|---|
| `competitions.htm` | `js/competitions.js` | `api/competitions.php` | `#competitions-container` |
| `competitors.htm` | `js/competitors.js` | `api/competitors.php` | `#competitors-container` |
| `results.htm` | `js/results.js` | `api/results.php` | `#results-container` |

Each page-specific script: fetches JSON via `fetchJson()` (defined in `js/common.js`, loaded first), builds an HTML `<table>` string by hand, and injects it with `innerHTML`. There is no shared rendering helper between pages — table-building is duplicated intentionally per page; follow the existing style rather than introducing a shared abstraction (V0.1 is meant to stay minimal before the V0.2 rewrite).

### PHP endpoints (`api/`)

- `db.php` exposes a single `getDatabase()` factory returning a PDO connection to the SQLite file, with `PDO::ERRMODE_EXCEPTION`, `FETCH_ASSOC` default, and `PRAGMA foreign_keys = ON`.
- Each endpoint (`competitions.php`, `competitors.php`, `results.php`) follows the same shape: set `Content-Type: application/json`, `require_once 'db.php'`, run one read-only `SELECT`, `echo json_encode(..., JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)`, and on `Throwable` return HTTP 500 with `{"error": "..."}`. Follow this exact pattern for any new endpoint.
- `competitions.php` has `display_errors` / `error_reporting(E_ALL)` enabled for debugging — be aware this can leak internals; it is not present in the other two endpoints, so don't assume it's the standard.
- `results.php` reads from the `Results_View` SQL view rather than joining tables in PHP — prefer extending the view over adding joins in endpoint code.
- Endpoints take no query parameters and apply no filtering/pagination; all rows are always returned, sorted in SQL.

### Database schema (`data/Competitions.sqlite`)

Three base tables plus one view:

- `Competitions(CompetitionTrack_Id PK, Sport, Competition_Name, Competition_Track, Competition_Date, Location_Country, Location_City)`
- `Competitors(Competitor_Id PK, First_Name, Last_Name, Country_Residence)`
- `Results(Result_Id PK, CompetitionTrack_Id FK, Competitor_Id FK, Elapsed_Time_ms, Individual_Rank, Result_Status)` — FKs cascade on update/delete, `UNIQUE(CompetitionTrack_Id, Competitor_Id)`, `Result_Status` constrained to `FINISHED | DNF | DNS | DSQ`, `Elapsed_Time_ms`/`Individual_Rank` must be `> 0` when not NULL.
- `Results_View` joins all three tables and additionally computes `Elapsed_Time` as a formatted `HH:MM:SS.mmm` string from `Elapsed_Time_ms`. Any new result-related query should go through this view rather than re-deriving the time format elsewhere.

### Access control

- `.htaccess` in the project root area (`api/.htaccess`, `data/.htaccess`) denies direct web access to dotfiles, `.sqlite`/`.db` files, and directory listing. `data/.htaccess` denies all access outright — the database must only ever be reached through the PHP endpoints, never served directly.

### i18n

All user-facing text (pages, table headers, error messages) is in French; keep new UI strings consistent with this.
