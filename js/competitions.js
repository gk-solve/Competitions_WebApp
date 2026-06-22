document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('competitions-container');

    try {

        const competitions = await fetchJson('api/competitions.php');

        if (competitions.length === 0) {
            container.innerHTML = '<p>Aucune compétition trouvée.</p>';
            return;
        }

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

        container.innerHTML = html;
    }
    catch (error) {

        container.innerHTML =
            '<p>Erreur lors du chargement des compétitions.</p>';
    }
});