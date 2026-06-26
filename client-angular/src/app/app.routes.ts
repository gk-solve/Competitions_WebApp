import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { Competitions } from './pages/competitions';
import { Competitors } from './pages/competitors';
import { Results } from './pages/results';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'competitions', component: Competitions },
    { path: 'competitors', component: Competitors },
    { path: 'results', component: Results },
];
