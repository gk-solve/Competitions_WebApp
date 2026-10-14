<script setup>
import DataTable from '../DataTable.vue';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Competition' },
    { key: 'Competition_Track', header: 'Track' },
    { key: 'Last_Name', header: 'Last name' },
    { key: 'First_Name', header: 'First name' },
    { key: 'Country_Residence', header: 'Country' },
    { key: 'Elapsed_Time', header: 'Time' },
    { key: 'Individual_Rank', header: 'Rank' },
    { key: 'Result_Status', header: 'Status' },
];

const { data, error } = useFetchJson('/api/results');
</script>

<template>
  <div class="card">
    <h2>Competition results</h2>

    <p v-if="error">Error while loading results.</p>
    <p v-else-if="!data" class="loading">Loading results...</p>
    <DataTable
      v-else
      :columns="COLUMNS"
      :rows="data"
      empty-message="No results found."
    />
  </div>
</template>
