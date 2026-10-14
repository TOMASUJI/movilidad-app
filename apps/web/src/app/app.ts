// Archivo generado automáticamente por nest menos aquello que tenga un comentario explicativo

import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { Mapa } from './rutas/mapa/mapa';             //

@Component({
  imports: [Mapa],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('web');
}
