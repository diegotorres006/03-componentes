import { Routes } from '@angular/router';
import { EstilosPage } from './features/estilos-page/estilos-page';

export const routes: Routes = [
    { path: 'estilos', component: EstilosPage },

    { path: '', redirectTo: '/estilos', pathMatch: 'full' }
];