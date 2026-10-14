<script setup>
import DataTable from '../DataTable.vue';
import { useFetchJson } from '../useFetchJson';

const COLUMNS = [
    { key: 'Last_Name', header: 'Last name' },
    { key: 'First_Name', header: 'First name' },
    { key: 'Country_Residence', header: 'Country' },
];

const { data, error } = useFetchJson('/api/competitors');
</script>

<template>
  <div class="card">
    <h2>Competitors</h2>

    <p v-if="error">Error while loading competitors.</p>
    <p v-else-if="!data" class="loading">Loading competitors...</p>
    <DataTable
      v-else
      :columns="COLUMNS"
      :rows="data"
      empty-message="No competitors found."
    />
  </div>
</template>
