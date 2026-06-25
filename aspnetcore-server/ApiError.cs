// Structured API error: carries an HTTP status and a machine-readable code,
// so the centralized exception-handling middleware in Program.cs can format a
// consistent JSON body. Mirrors server/errors.js (Express) and errors.py (FastAPI).

public class ApiError : Exception
{
    public int StatusCode { get; }
    public string Code { get; }

    public ApiError(int statusCode, string code, string message) : base(message)
    {
        StatusCode = statusCode;
        Code = code;
    }
}
