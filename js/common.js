// Shared fetch helper used by every page-specific script to call the PHP JSON endpoints.

async function fetchJson(url) {
    try {
        const response = await fetch(url);

        // Treat any non-2xx HTTP status as a failure.
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        // Log for debugging, then let the caller's catch block update the UI.
        console.error(error);
        throw error;
    }
}