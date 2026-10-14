<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <h1>Sports Competitions</h1>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/competitions">Competitions</RouterLink>
      <RouterLink to="/competitors">Competitors</RouterLink>
      <RouterLink to="/results">Results</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>Sports database - Version 1.0</footer>
</template>
