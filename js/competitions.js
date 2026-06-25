// Loads the competitions list from the API and renders it as a table in competitions.htm.

document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('competitions-container');

    try {

        // Fetch all competitions/tracks (already sorted by date by the API).
        const competitions = await fetchJson('api/competitions');

        if (competitions.length === 0) {
            container.innerHTML = '<p>Aucune compétition trouvée.</p>';
            return;
        }

        // Build the table markup as a string, one row per competition.
        let html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sport</th>
                            <th>Compétition</th>
                            <th>Épreuve</th>
                            <th>Date</th>
                            <th>Ville</th>
                            <th>Pays</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        competitions.forEach(c => {

            html += `
                <tr>
                    <td>${c.Sport}</td>
                    <td>${c.Competition_Name}</td>
                    <td>${c.Competition_Track}</td>
                    <td>${c.Competition_Date}</td>
                    <td>${c.Location_City}</td>
                    <td>${c.Location_Country}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        // Inject the finished table into the page.
        container.innerHTML = html;
    }
    catch (error) {

        // fetchJson already logged the error; just inform the user.
        container.innerHTML =
            '<p>Erreur lors du chargement des compétitions.</p>';
    }
});