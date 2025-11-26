import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { DaisyuiPageComponent } from './features/daisyui-page/daisyui-page';
import { SimpsonsPage } from './features/simpsons-page/simpsons-page';
import { SimpsonsDetailPage } from './features/simpson-detail-page/simpson-detail-page';

export const routes: Routes = [

  {
    path: '',
    component: DaisyuiPageComponent
  },

  {
    path: 'estilos',
    component: EstilosPage
  },

  {
    path: 'simpsons',
    component: SimpsonsPage
  },

  {
    path: 'simpsons/:id',
    component: SimpsonsDetailPage
  }


];