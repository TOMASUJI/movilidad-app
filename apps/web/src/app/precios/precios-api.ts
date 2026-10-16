// Servicio de la web para pedir a NUESTRA API los precios del combustible y de la electricidad.
// Igual que RutasApi, pero para precios. La web nunca llama directamente al Ministerio ni a REE.

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// ###### BLOQUE 1 ###### Tipos de las respuestas (copia de los de la API, como hicimos con Ruta)
export interface PrecioCombustible {
  combustible: 'gasolina95' | 'gasoleoA';
  idProvincia: string;      // '12' = Castellón
  eurosPorLitro: number;
  gasolineras: number;      // Cuántas gasolineras entran en la media
  fecha: string;            // Fecha de los datos según el Ministerio
}

export interface PrecioElectricidad {
  fecha: string;            // 'AAAA-MM-DD'
  eurosPorKwh: number;      // Media PVPC del día
  horas: number;
}

// ###### BLOQUE 2 ###### El servicio
@Injectable({ providedIn: 'root' })                 // Un solo servicio para toda la app (como un @Service singleton de Spring)
export class PreciosApi {
  private readonly http = inject(HttpClient);

  gasolina95(idProvincia: string): Promise<PrecioCombustible> {
    return firstValueFrom(
      this.http.get<PrecioCombustible>('/api/precios/combustible', {
        params: { tipo: 'gasolina95', provincia: idProvincia },        // → ?tipo=gasolina95&provincia=12
      }),
    );
  }

  electricidadHoy(): Promise<PrecioElectricidad> {
    return firstValueFrom(this.http.get<PrecioElectricidad>('/api/precios/electricidad')); // Sin fecha → la API usa hoy
  }
}
