<script setup>
import DataTable from '../DataTable.vue';
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

const { data, error } = useFetchJson('/api/results');
</script>

<template>
  <div class="card">
    <h2>Résultats des compétitions</h2>

    <p v-if="error">Erreur lors du chargement des résultats.</p>
    <p v-else-if="!data" class="loading">Chargement des résultats...</p>
    <DataTable
      v-else
      :columns="COLUMNS"
      :rows="data"
      empty-message="Aucun résultat trouvé."
    />
  </div>
</template>
