<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <h1>Compétitions Sportives</h1>

    <nav>
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/competitions">Compétitions</RouterLink>
      <RouterLink to="/competitors">Compétiteurs</RouterLink>
      <RouterLink to="/results">Résultats</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>Base de données sportive - Version 1.0</footer>
</template>
