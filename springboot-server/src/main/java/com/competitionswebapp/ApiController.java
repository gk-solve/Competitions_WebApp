package com.competitionswebapp;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// REST API (V0.2 alternative) for Competitions WebApp, built with Spring Boot instead of
// Express/FastAPI/ASP.NET Core, for a side-by-side comparison. Same SQLite database and same
// route/error-shape contract as the other three backends.
@RestController
public class ApiController {

    private final Db db;

    public ApiController(Db db) {
        this.db = db;
    }

    // GET /api/competitions - list of competitions/tracks, sorted by date.
    @GetMapping("/api/competitions")
    public List<Map<String, Object>> getCompetitions() {
        return query("""
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
        """);
    }

    // GET /api/competitors - list of competitors, sorted by name.
    @GetMapping("/api/competitors")
    public List<Map<String, Object>> getCompetitors() {
        return query("""
            SELECT
                Competitor_Id,
                First_Name,
                Last_Name,
                Country_Residence
            FROM Competitors
            ORDER BY Last_Name, First_Name
        """);
    }

    // GET /api/results - all results, joined via the Results_View SQL view.
    @GetMapping("/api/results")
    public List<Map<String, Object>> getResults() {
        return query("""
            SELECT *
            FROM Results_View
            ORDER BY
                Competition_Date DESC,
                Sport,
                Competition_Name,
                Individual_Rank
        """);
    }

    // Runs a read-only query and materializes the ResultSet into column-name -> value maps,
    // the shape Jackson serializes as a plain JSON array of objects.
    private List<Map<String, Object>> query(String sql) {
        try (Statement statement = db.getConnection().createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {

            ResultSetMetaData metaData = resultSet.getMetaData();
            List<Map<String, Object>> rows = new ArrayList<>();

            while (resultSet.next()) {
                Map<String, Object> row = new LinkedHashMap<>();
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    row.put(metaData.getColumnName(i), resultSet.getObject(i));
                }
                rows.add(row);
            }

            return rows;
        }
        catch (SQLException error) {
            throw new ApiError(500, "DB_ERROR", error.getMessage());
        }
    }
}
