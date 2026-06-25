# REST API (V0.2 alternative) for Competitions WebApp, built with FastAPI instead of Express,
# for a side-by-side comparison. Same SQLite database and same route/error-shape contract
# as the Express version in server/.

import sqlite3
import sys
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from db import get_database
from errors import ApiError

PROJECT_ROOT = Path(__file__).resolve().parent.parent

app = FastAPI()

# Fail fast with a clear message if the SQLite file is missing/unreadable.
try:
    db = get_database()
except sqlite3.Error as error:
    print(f"Failed to open the database: {error}", file=sys.stderr)
    sys.exit(1)

# Static frontend (HTML/CSS/JS), mirroring server/index.js.
# Mounted per-directory rather than on PROJECT_ROOT so data/ and fastapi-server/ are
# never reachable over HTTP.
app.mount("/css", StaticFiles(directory=PROJECT_ROOT / "css"), name="css")
app.mount("/js", StaticFiles(directory=PROJECT_ROOT / "js"), name="js")
app.mount("/assets", StaticFiles(directory=PROJECT_ROOT / "assets"), name="assets")

PAGES = ["index.htm", "competitions.htm", "competitors.htm", "results.htm"]

for page in PAGES:
    app.add_api_route(
        f"/{page}",
        lambda page=page: FileResponse(PROJECT_ROOT / page),
        methods=["GET"],
    )


@app.get("/")
def root():
    return RedirectResponse(url="/index.htm")


# GET /api/competitions - list of competitions/tracks, sorted by date.
@app.get("/api/competitions")
def get_competitions():
    try:
        rows = db.execute("""
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
        """).fetchall()

        return [dict(row) for row in rows]
    except sqlite3.Error as error:
        raise ApiError(500, "DB_ERROR", str(error))


# GET /api/competitors - list of competitors, sorted by name.
@app.get("/api/competitors")
def get_competitors():
    try:
        rows = db.execute("""
            SELECT
                Competitor_Id,
                First_Name,
                Last_Name,
                Country_Residence
            FROM Competitors
            ORDER BY Last_Name, First_Name
        """).fetchall()

        return [dict(row) for row in rows]
    except sqlite3.Error as error:
        raise ApiError(500, "DB_ERROR", str(error))


# GET /api/results - all results, joined via the Results_View SQL view.
@app.get("/api/results")
def get_results():
    try:
        rows = db.execute("""
            SELECT *
            FROM Results_View
            ORDER BY
                Competition_Date DESC,
                Sport,
                Competition_Name,
                Individual_Rank
        """).fetchall()

        return [dict(row) for row in rows]
    except sqlite3.Error as error:
        raise ApiError(500, "DB_ERROR", str(error))


# Centralized error handling: every route raises ApiError instead of formatting
# its own response, so the JSON error shape stays consistent (matches server/index.js).
@app.exception_handler(ApiError)
def handle_api_error(request: Request, error: ApiError):
    return JSONResponse(
        status_code=error.status_code,
        content={"error": {"code": error.code, "message": error.message}},
    )


# Unknown route (and other HTTP errors, e.g. 404) -> same JSON error shape as the rest of the API.
@app.exception_handler(StarletteHTTPException)
def handle_http_exception(request: Request, error: StarletteHTTPException):
    code = "NOT_FOUND" if error.status_code == 404 else "HTTP_ERROR"
    message = error.detail if error.status_code != 404 else f"Route not found: {request.method} {request.url.path}"

    return JSONResponse(
        status_code=error.status_code,
        content={"error": {"code": code, "message": message}},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8080)
