// Shared fetch helper used by every page component to call the REST API.
// Mirrors js/common.js from the vanilla-JS frontend.

export async function fetchJson(url) {
    const response = await fetch(url);

    // Treat any non-2xx HTTP status as a failure.
    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
    }

    return response.json();
}
