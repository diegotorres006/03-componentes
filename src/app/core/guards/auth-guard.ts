import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth';

/**
 * Guard que protege rutas requiriendo autenticación
 *
 * Funcionalidad:
 * - Si el usuario está autenticado → Permite el acceso
 * - Si no está autenticado → Redirige a /login
 * - Guarda la URL intentada para redirigir después del login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay un usuario autenticado
  if (authService.isAuthenticated()) {
    console.log('✅ authGuard: Usuario autenticado, permitiendo acceso');
    return true;
  }

  console.log('❌ authGuard: Usuario no autenticado, redirigiendo a login y guardando URL de destino');
  
  // Guardar la URL intentada (state.url) para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};