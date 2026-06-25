// REST API (V0.2 alternative) for Competitions WebApp, built with ASP.NET Core instead of
// Express/FastAPI, for a side-by-side comparison. Same SQLite database and same route/error-shape
// contract as the other two backends.

using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:8080");

var app = builder.Build();

var projectRoot = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..");

// Fail fast with a clear message if the SQLite file is missing/unreadable.
SqliteConnection db;
try
{
    db = Db.GetDatabase();
}
catch (SqliteException error)
{
    Console.Error.WriteLine($"Failed to open the database: {error.Message}");
    Environment.Exit(1);
    return;
}

// Static frontend (HTML/CSS/JS), mirroring server/index.js and fastapi-server/main.py.
// Mounted per-directory rather than on projectRoot so data/ and aspnetcore-server/ (source,
// bin/obj) are never reachable over HTTP.
foreach (var dir in new[] { "css", "js", "assets" })
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(projectRoot, dir)),
        RequestPath = $"/{dir}"
    });
}

string[] pages = ["index.htm", "competitions.htm", "competitors.htm", "results.htm"];
foreach (var page in pages)
{
    app.MapGet($"/{page}", () => Results.File(Path.Combine(projectRoot, page), "text/html"));
}
app.MapGet("/", () => Results.Redirect("/index.htm"));

// GET /api/competitions - list of competitions/tracks, sorted by date.
app.MapGet("/api/competitions", () =>
{
    try
    {
        using var command = db.CreateCommand();
        command.CommandText = """
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
        """;

        return Results.Json(ReadRows(command));
    }
    catch (SqliteException error)
    {
        throw new ApiError(500, "DB_ERROR", error.Message);
    }
});

// GET /api/competitors - list of competitors, sorted by name.
app.MapGet("/api/competitors", () =>
{
    try
    {
        using var command = db.CreateCommand();
        command.CommandText = """
            SELECT
                Competitor_Id,
                First_Name,
                Last_Name,
                Country_Residence
            FROM Competitors
            ORDER BY Last_Name, First_Name
        """;

        return Results.Json(ReadRows(command));
    }
    catch (SqliteException error)
    {
        throw new ApiError(500, "DB_ERROR", error.Message);
    }
});

// GET /api/results - all results, joined via the Results_View SQL view.
app.MapGet("/api/results", () =>
{
    try
    {
        using var command = db.CreateCommand();
        command.CommandText = """
            SELECT *
            FROM Results_View
            ORDER BY
                Competition_Date DESC,
                Sport,
                Competition_Name,
                Individual_Rank
        """;

        return Results.Json(ReadRows(command));
    }
    catch (SqliteException error)
    {
        throw new ApiError(500, "DB_ERROR", error.Message);
    }
});

// Centralized error handling: routes throw ApiError instead of formatting their own
// response, so the JSON error shape stays consistent (matches server/index.js and main.py).
app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (ApiError error)
    {
        context.Response.StatusCode = error.StatusCode;
        await context.Response.WriteAsJsonAsync(new { error = new { code = error.Code, message = error.Message } });
    }
});

// Unknown route -> 404 with the same JSON error shape as the rest of the API.
app.MapFallback(context =>
{
    context.Response.StatusCode = 404;
    return context.Response.WriteAsJsonAsync(new
    {
        error = new
        {
            code = "NOT_FOUND",
            message = $"Route not found: {context.Request.Method} {context.Request.Path}"
        }
    });
});

app.Run();

// Materializes a SqliteDataReader into a list of column-name -> value dictionaries,
// the shape System.Text.Json serializes as a plain JSON array of objects.
static List<Dictionary<string, object?>> ReadRows(SqliteCommand command)
{
    var rows = new List<Dictionary<string, object?>>();
    using var reader = command.ExecuteReader();

    while (reader.Read())
    {
        var row = new Dictionary<string, object?>();
        for (var i = 0; i < reader.FieldCount; i++)
        {
            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
        }
        rows.Add(row);
    }

    return rows;
}
