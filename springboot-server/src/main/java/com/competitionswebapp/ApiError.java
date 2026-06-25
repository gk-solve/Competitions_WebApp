package com.competitionswebapp;

// Structured API error: carries an HTTP status and a machine-readable code, so the
// centralized exception handler in GlobalExceptionHandler can format a consistent JSON body.
// Mirrors server/errors.js (Express), errors.py (FastAPI), and ApiError.cs (ASP.NET Core).
public class ApiError extends RuntimeException {

    private final int statusCode;
    private final String code;

    public ApiError(int statusCode, String code, String message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getCode() {
        return code;
    }
}
