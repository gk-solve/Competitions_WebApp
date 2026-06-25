import DataTable from '../DataTable';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Compétition' },
    { key: 'Competition_Track', header: 'Épreuve' },
    { key: 'Last_Name', header: 'Nom' },
    { key: 'First_Name', header: 'Prénom' },
    { key: 'Country_Residence', header: 'Pays' },
    { key: 'Elapsed_Time', header: 'Temps' },
    { key: 'Individual_Rank', header: 'Rang' },
    { key: 'Result_Status', header: 'Statut' },
];

export default function Results() {
    const { data, error } = useFetchJson('/api/results');

    return (
        <div className="card">
            <h2>Résultats des compétitions</h2>

            {error && <p>Erreur lors du chargement des résultats.</p>}
            {!error && !data && <p className="loading">Chargement des résultats...</p>}
            {!error && data && (
                <DataTable
                    columns={COLUMNS}
                    rows={data}
                    emptyMessage="Aucun résultat trouvé."
                />
            )}
        </div>
    );
}
