<script setup>
// Generic table renderer shared by the 3 data pages: given column definitions
// ({ header, key }) and rows, renders the same markup/classes as the vanilla-JS version.
defineProps({
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    emptyMessage: { type: String, required: true },
});
</script>

<template>
  <p v-if="rows.length === 0">{{ emptyMessage }}</p>

  <div v-else class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="row.id ?? index">
          <td v-for="column in columns" :key="column.key">{{ row[column.key] ?? '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
