<script setup>
import DataTable from '../DataTable.vue';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Compétition' },
    { key: 'Competition_Track', header: 'Épreuve' },
    { key: 'Competition_Date', header: 'Date' },
    { key: 'Location_City', header: 'Ville' },
    { key: 'Location_Country', header: 'Pays' },
];

const { data, error } = useFetchJson('/api/competitions');
</script>

<template>
  <div class="card">
    <h2>Liste des compétitions</h2>

    <p v-if="error">Erreur lors du chargement des compétitions.</p>
    <p v-else-if="!data" class="loading">Chargement des compétitions...</p>
    <DataTable
      v-else
      :columns="COLUMNS"
      :rows="data"
      empty-message="Aucune compétition trouvée."
    />
  </div>
</template>
