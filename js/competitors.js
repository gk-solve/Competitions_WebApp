// Loads the competitors list from the API and renders it as a table in competitors.htm.

document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('competitors-container');

    try {

        // Fetch all competitors (already sorted by name by the API).
        const competitors = await fetchJson('api/competitors.php');

        if (competitors.length === 0) {
            container.innerHTML = '<p>Aucun compétiteur trouvé.</p>';
            return;
        }

        // Build the table markup as a string, one row per competitor.
        let html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Pays</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        competitors.forEach(c => {

            html += `
                <tr>
                    <td>${c.Last_Name}</td>
                    <td>${c.First_Name}</td>
                    <td>${c.Country_Residence}</td>
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
            '<p>Erreur lors du chargement des compétiteurs.</p>';
    }
});