import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { DaisyuiPageComponent } from './features/daisyui-page/daisyui-page';
import { SimpsonsPageComponent } from './features/simpsons-page/simpsons-page';
import { SimpsonsDetailPage } from './features/simpson-detail-page/simpson-detail-page';
import { authGuard } from '../app/core/guards/auth-guard';
import { publicGuard } from '../app/core/guards/public-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login', // Redirige al login por defecto
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPageComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
    canActivate: [publicGuard]
  },
  // La ruta de simpsons solo debe aparecer UNA vez y debe ser la protegida
  {
    path: 'simpsons',
    loadComponent: () => import('./features/simpsons-page/simpsons-page').then(m => m.SimpsonsPageComponent),
    canActivate: [authGuard] 
  },
  {
    path: 'simpsons/:id',
    component: SimpsonsDetailPage,
    canActivate: [authGuard] // También deberías proteger el detalle
  },
  {
    path: 'estilos',
    component: EstilosPage,
    canActivate: [authGuard]
  },
  {
     path: 'home', // Si usas home para DaisyUI
     component: DaisyuiPageComponent,
     canActivate: [authGuard]
  }

];