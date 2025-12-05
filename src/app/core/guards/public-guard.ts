import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth';

/**
 * Guard que protege rutas públicas (login/register)
 *
 * Funcionalidad:
 * - Si el usuario NO está autenticado → Permite el acceso
 * - Si está autenticado → Redirige a /home
 *
 * Evita que usuarios autenticados vean páginas de login/register
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si NO está autenticado, puede acceder a rutas públicas
  if (!authService.isAuthenticated()) {
    console.log('✅ publicGuard: Usuario no autenticado, mostrando página pública');
    return true;
  }

  console.log('❌ publicGuard: Usuario ya autenticado, redirigiendo a home');
  
  // Si ya está autenticado, redirigir a home (Paso 5)
  router.navigate(['/home']);
  return false;
};