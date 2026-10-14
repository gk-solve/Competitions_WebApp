# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Competitions WebApp displays and queries amateur sports competition results (running, cycling, open-water swimming). It is mid-migration from **V0.1** to **V0.2**:

- **Presentation**: a Vue 3 single-page app in `client-vue/` (Vite + Vue Router), replacing the V0.1 vanilla-JS/`.htm` pages. Vue was chosen over React and Angular after a side-by-side comparison (the `ReactFrontEnd` and `AngularFrontEnd` branches are kept as reference only).
- **Business logic**: a Node.js/Express REST API in `server/` (replaced the V0.1 PHP JSON endpoints, which have been removed).
- **Data**: still a single SQLite database at `data/Competitions.sqlite` for now; a future step will migrate this to Azure SQL (likely in a VNet) — keep that in mind before adding SQLite-specific behavior that would be costly to port.

## Running the app

Build the Vue app, then start the Express server, both from the project root:

```bash
(cd client-vue && npm install && npm run build)   # rebuild after any change in client-vue/src/
(cd server && npm install)                        # first time only
node server/index.js
```

This single Express process serves **both** the REST API and the built SPA (`client-vue/dist`) on **port 8080** (fixed by convention for this app — the `run-app` skill and habitual links assume this port). Open `http://localhost:8080/`; `/competitions`, `/competitors` and `/results` are client-side routes.

Express serves the **production build**, not a dev server: `client-vue/dist` is gitignored, so it must be rebuilt after a fresh checkout or any change in `client-vue/src/`, otherwise the browser shows stale code. `npm run dev` (Vite dev server) has no proxy configured for `/api`, so it can't reach the API as-is.

To inspect or modify the database directly:

```bash
sqlite3 data/Competitions.sqlite
```

There is no automated test command. `npm run lint` in `client-vue/` runs oxlint on the frontend. Otherwise, verify changes by loading the pages in a browser and checking the `/api/*` JSON output directly (e.g. `http://localhost:8080/api/results`).

## Architecture

### Vue frontend (`client-vue/src/`)

- `main.js` creates the app and declares the Vue Router routes (`createWebHistory`, so URLs have no `#`).
- `App.vue` holds the shared layout: header, navigation (`RouterLink`s), `<RouterView />`, footer.
- `api.js` exports `fetchJson(url)`, which throws on any non-2xx HTTP status.
- `useFetchJson.js` is a composable wrapping `fetchJson` that exposes reactive `{ data, error }` refs. Every data page uses it.
- `DataTable.vue` is the generic table component shared by the 3 data pages. It takes `columns` (`{ key, header }` array), `rows` and `emptyMessage` props.
- `pages/` holds one component per route: `Home.vue`, `Competitions.vue`, `Competitors.vue`, `Results.vue`.

### Route ↔ page ↔ endpoint pairing

Each data page follows the same fixed pattern. When changing one piece, check the other two:

| Route | Page component | Endpoint |
|---|---|---|
| `/competitions` | `pages/Competitions.vue` | `GET /api/competitions` |
| `/competitors` | `pages/Competitors.vue` | `GET /api/competitors` |
| `/results` | `pages/Results.vue` | `GET /api/results` |

Each page declares a `COLUMNS` constant mapping JSON keys (the SQL column names) to English headers, calls `useFetchJson('/api/...')`, then renders an error message, a loading message, or `<DataTable>`. Follow this pattern when adding a page.

Styling comes from the global `css/style.css` at the project root, linked from `client-vue/index.html` (not bundled by Vite). Same for `assets/favicon.ico`. Components don't use scoped styles.

### Express server (`server/`)

- `server/db.js` exposes a single `getDatabase()` factory returning a read-only `better-sqlite3` connection, with `PRAGMA foreign_keys = ON`.
- `server/errors.js` defines `ApiError(statusCode, code, message)` — throw/`next()` this (not a plain `Error`) for anything that should produce a specific HTTP status and machine-readable `code` in the response.
- `server/index.js`:
  - Mounts `/api/competitions`, `/api/competitors`, `/api/results` (read-only `SELECT`s, no filtering/pagination — all rows always returned, sorted in SQL). `results` reads from the `Results_View` SQL view rather than joining tables in route code; prefer extending the view over adding joins here.
  - Serves the frontend with three `express.static` mounts only: `/css`, `/assets` and `client-vue/dist`. It deliberately doesn't use a single `express.static(projectRoot)`, so `data/` (the SQLite file) and `server/` (source, `node_modules`) are never reachable over HTTP.
  - Has a catch-all GET route (any path not starting with `/api/`) that returns `client-vue/dist/index.html`, so deep links like `/results` survive a full page reload. It's registered **before** the API routes. Any new API route must stay under `/api/`, otherwise this fallback swallows it.
  - Has a catch-all 404 handler (in practice only reached by unknown `/api/*` or non-GET requests) and a centralized error-handling middleware (last in the chain) that formats every error as `{"error": {"code": ..., "message": ...}}`. Routes should call `next(new ApiError(...))` on failure rather than formatting their own error response.
  - Fails fast at startup (`process.exit(1)`) if the SQLite file can't be opened.

### Database schema (`data/Competitions.sqlite`)

Three base tables plus one view:

- `Competitions(CompetitionTrack_Id PK, Sport, Competition_Name, Competition_Track, Competition_Date, Location_Country, Location_City)`
- `Competitors(Competitor_Id PK, First_Name, Last_Name, Country_Residence)`
- `Results(Result_Id PK, CompetitionTrack_Id FK, Competitor_Id FK, Elapsed_Time_ms, Individual_Rank, Result_Status)` — FKs cascade on update/delete, `UNIQUE(CompetitionTrack_Id, Competitor_Id)`, `Result_Status` constrained to `FINISHED | DNF | DNS | DSQ`, `Elapsed_Time_ms`/`Individual_Rank` must be `> 0` when not NULL.
- `Results_View` joins all three tables and additionally computes `Elapsed_Time` as a formatted `HH:MM:SS.mmm` string from `Elapsed_Time_ms`. Any new result-related query should go through this view rather than re-deriving the time format elsewhere.

### i18n

All UI labels (page components, `COLUMNS` headers, error and loading messages) are in English; keep new UI strings consistent with this. Data values coming from the database (sport names, tracks, countries, etc.) are **not** translated and are displayed as stored.
