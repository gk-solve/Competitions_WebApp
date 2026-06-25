<script setup>
import DataTable from '../DataTable.vue';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Last_Name', header: 'Nom' },
    { key: 'First_Name', header: 'Prénom' },
    { key: 'Country_Residence', header: 'Pays' },
];

const { data, error } = useFetchJson('/api/competitors');
</script>

<template>
  <div class="card">
    <h2>Liste des compétiteurs</h2>

    <p v-if="error">Erreur lors du chargement des compétiteurs.</p>
    <p v-else-if="!data" class="loading">Chargement des compétiteurs...</p>
    <DataTable
      v-else
      :columns="COLUMNS"
      :rows="data"
      empty-message="Aucun compétiteur trouvé."
    />
  </div>
</template>
