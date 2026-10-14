// Shared fetch helper used by every page component to call the REST API.

export async function fetchJson(url) {
    const response = await fetch(url);

    // Treat any non-2xx HTTP status as a failure.
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    return response.json();
}
