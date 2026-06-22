document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('competitors-container');

    try {

        const competitors = await fetchJson('api/competitors.php');

        if (competitors.length === 0) {
            container.innerHTML = '<p>Aucun compétiteur trouvé.</p>';
            return;
        }

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

        container.innerHTML = html;
    }
    catch (error) {

        container.innerHTML =
            '<p>Erreur lors du chargement des compétiteurs.</p>';
    }
});