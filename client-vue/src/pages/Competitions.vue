<script setup>
import DataTable from '../DataTable.vue';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Competition' },
    { key: 'Competition_Track', header: 'Track' },
    { key: 'Competition_Date', header: 'Date' },
    { key: 'Location_City', header: 'City' },
    { key: 'Location_Country', header: 'Country' },
];

const { data, error } = useFetchJson('/api/competitions');
</script>

<template>
  <div class="card">
    <h2>Competitions</h2>

    <p v-if="error">Error while loading competitions.</p>
    <p v-else-if="!data" class="loading">Loading competitions...</p>
    <DataTable
      v-else
      :columns="COLUMNS"
      :rows="data"
      empty-message="No competitions found."
    />
  </div>
</template>
