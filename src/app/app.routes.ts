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
    redirectTo: 'home', // Redirige a home por defecto (Paso 1)
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPageComponent),
    canActivate: [publicGuard] // Solo si NO está autenticado
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
    canActivate: [publicGuard] // Solo si NO está autenticado
  },
  {
    path: 'home',
    loadComponent: () => import('./features/daisyui-page/daisyui-page').then(m => m.DaisyuiPageComponent)
    // SIN guard: Accesible para todos (Paso 1)
  },
  {
    path: 'estilos',
    loadComponent: () => import('./features/estilos-page/estilos-page').then(m => m.EstilosPage),
    canActivate: [authGuard] // Requiere autenticación
  },
  {
    path: 'simpsons',
    loadComponent: () => import('../app/features/simpsons-page/simpsons-page').then(m => m.SimpsonsPageComponent),
    canActivate: [authGuard] // Requiere autenticación
  },
  {
    path: 'simpsons/:id',
    loadComponent: () => import('./features/simpson-detail-page/simpson-detail-page').then(m => m.SimpsonsDetailPage),
    canActivate: [authGuard] // Requiere autenticación
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];