import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './pages/Home.vue';
import Competitions from './pages/Competitions.vue';
import Competitors from './pages/Competitors.vue';
import Results from './pages/Results.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/competitions', component: Competitions },
        { path: '/competitors', component: Competitors },
        { path: '/results', component: Results },
    ],
});

createApp(App).use(router).mount('#app');
