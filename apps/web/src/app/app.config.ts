// Este código es generado automáticamente por Angular menos aquello con comentarios explicativos


import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';   // import para activar https

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()                                     // sin esto, al arrancar la web saldría un error “No provider for HttpClient”.
  ]
};
