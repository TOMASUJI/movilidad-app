// Panel flotante que muestra los precios actuales de la gasolina y de la electricidad, y de dónde salen.
// Es un componente independiente del mapa: solo pide los precios al abrir la página y los enseña.

// ###### BLOQUE 1 ###### Imports y provincia
import { Component, inject, signal } from '@angular/core';
import { PreciosApi, type PrecioCombustible, type PrecioElectricidad } from '../precios-api';

const CASTELLON = '12';                                       // Código de provincia del Ministerio (en el spike, siempre Castellón)

// ###### BLOQUE 2 ###### El componente
@Component({
  selector: 'app-panel-precios',                              // Se usará como <app-panel-precios /> en app.html
  templateUrl: './panel-precios.html',
  styleUrl: './panel-precios.scss',
})
export class PanelPrecios {
  private readonly api = inject(PreciosApi);

  protected readonly gasolina = signal<PrecioCombustible | null>(null);        // null = todavía cargando
  protected readonly electricidad = signal<PrecioElectricidad | null>(null);
  protected readonly errorGasolina = signal(false);                            // true = no se pudo obtener
  protected readonly errorElectricidad = signal(false);

  constructor() {
    // Lanzamos las dos peticiones a la vez; cada una rellena su señal cuando llega (o marca su error)
    this.api.gasolina95(CASTELLON)
      .then((precio) => this.gasolina.set(precio))
      .catch(() => this.errorGasolina.set(true));

    this.api.electricidadHoy()
      .then((precio) => this.electricidad.set(precio))
      .catch(() => this.errorElectricidad.set(true));
  }
}
