import DataTable from '../DataTable';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Compétition' },
    { key: 'Competition_Track', header: 'Épreuve' },
    { key: 'Competition_Date', header: 'Date' },
    { key: 'Location_City', header: 'Ville' },
    { key: 'Location_Country', header: 'Pays' },
];

export default function Competitions() {
    const { data, error } = useFetchJson('/api/competitions');

    return (
        <div className="card">
            <h2>Liste des compétitions</h2>

            {error && <p>Erreur lors du chargement des compétitions.</p>}
            {!error && !data && <p className="loading">Chargement des compétitions...</p>}
            {!error && data && (
                <DataTable
                    columns={COLUMNS}
                    rows={data}
                    emptyMessage="Aucune compétition trouvée."
                />
            )}
        </div>
    );
}
