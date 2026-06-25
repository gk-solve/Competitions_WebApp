# Structured API error: carries an HTTP status and a machine-readable code,
# so the centralized exception handler in main.py can format a consistent JSON body.
# Mirrors server/errors.js (the Express version).

class ApiError(Exception):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
