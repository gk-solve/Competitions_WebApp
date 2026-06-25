package com.competitionswebapp;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

// Centralized error handling: routes throw ApiError instead of formatting their own response,
// so the JSON error shape stays consistent (matches server/index.js, main.py, Program.cs).
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiError.class)
    public ResponseEntity<Object> handleApiError(ApiError error) {
        return ResponseEntity
            .status(error.getStatusCode())
            .body(Map.of("error", Map.of("code", error.getCode(), "message", error.getMessage())));
    }

    // Unknown route -> 404 with the same JSON error shape as the rest of the API.
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNotFound(NoHandlerFoundException error) {
        String message = "Route not found: " + error.getHttpMethod() + " " + error.getRequestURL();
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", Map.of("code", "NOT_FOUND", "message", message)));
    }
}
