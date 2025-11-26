import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <--- AGREGAMOS ESTO

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(), // <--- ESTO ES LO QUE TU PROYECTO NECESITA
    provideRouter(routes),
    provideHttpClient() // <--- Y ESTO ES LO QUE NECESITA LA API
  ]
};