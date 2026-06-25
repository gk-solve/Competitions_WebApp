import DataTable from '../DataTable';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Last_Name', header: 'Nom' },
    { key: 'First_Name', header: 'Prénom' },
    { key: 'Country_Residence', header: 'Pays' },
];

export default function Competitors() {
    const { data, error } = useFetchJson('/api/competitors');

    return (
        <div className="card">
            <h2>Liste des compétiteurs</h2>

            {error && <p>Erreur lors du chargement des compétiteurs.</p>}
            {!error && !data && <p className="loading">Chargement des compétiteurs...</p>}
            {!error && data && (
                <DataTable
                    columns={COLUMNS}
                    rows={data}
                    emptyMessage="Aucun compétiteur trouvé."
                />
            )}
        </div>
    );
}
