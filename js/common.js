async function fetchJson(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}