package com.competitionswebapp;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Component;

// Resolves the Competitions WebApp project root (one level up from this Maven module),
// shared by Db (data/Competitions.sqlite) and WebConfig (static frontend files).
@Component
public class ProjectPaths {

    private final Path root = Paths.get("").toAbsolutePath().getParent();

    public Path getRoot() {
        return root;
    }
}
