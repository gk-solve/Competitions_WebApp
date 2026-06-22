document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('results-container');

    try {

        const results = await fetchJson('api/results.php');

        if (results.length === 0) {
            container.innerHTML = '<p>Aucun résultat trouvé.</p>';
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
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Pays</th>
                            <th>Temps</th>
                            <th>Rang</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        results.forEach(r => {

            html += `
                <tr>
                    <td>${r.Sport}</td>
                    <td>${r.Competition_Name}</td>
                    <td>${r.Competition_Track}</td>
                    <td>${r.Last_Name}</td>
                    <td>${r.First_Name}</td>
                    <td>${r.Country_Residence}</td>
                    <td>${r.Elapsed_Time ?? ''}</td>
                    <td>${r.Individual_Rank ?? ''}</td>
                    <td>${r.Result_Status}</td>
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
            '<p>Erreur lors du chargement des résultats.</p>';
    }
});