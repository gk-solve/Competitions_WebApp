// Structured API error: carries an HTTP status and a machine-readable code,
// so the centralized error handler in index.js can format a consistent JSON body.

class ApiError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

module.exports = { ApiError };
