import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // <--- IMPORTAR
import { provideToastr } from 'ngx-toastr'; // <--- IMPORTAR
import { withHashLocation } from '@angular/router';
// 1. IMPORTACIONES DE FIREBASE
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// 2. IMPORTAMOS TU ARCHIVO DE ENTORNO
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // --- TU CONFIGURACIÓN ACTUAL (MANTENEMOS ZONELESS) ---
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(), // <--- MANTENIDO (Vital para tu proyecto)
    provideRouter(routes),
    provideHttpClient(),
    provideRouter(routes, withHashLocation()),// <--- Agrega esto

    // --- NUEVO: ANIMACIONES Y TOASTR ---
    provideAnimations(), 
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    }),

    // --- FIREBASE ---
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};