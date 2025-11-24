import { Routes } from '@angular/router';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { DaisyuiPageComponent } from './features/daisyui-page/daisyui-page';

export const routes: Routes = [
    { path: 'estilos', component: EstilosPage },


    { path: '', component: DaisyuiPageComponent }
];