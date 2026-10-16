// Archivo generado automáticamente por nest menos aquello que tenga un comentario explicativo

import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { Mapa } from './rutas/mapa/mapa';             //
import { PanelPrecios } from './precios/panel-precios/panel-precios';   // El panel de precios

@Component({
  imports: [Mapa, PanelPrecios],   // Componentes que usa la plantilla de App
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('web');
}
