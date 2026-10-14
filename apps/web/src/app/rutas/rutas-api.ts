// El servicio de RutasApi





import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { Coordenada, ModoTransporte, RutaCalculada } from './ruta';

@Injectable({ providedIn: 'root' })                                                                       // Convierte la clase en un servicio que Angular puede inyectar y 'root' hace que haya una sola instancia en toda la aplicación
export class RutasApi {                                                                                   // Pide a Angular el cliente HTTP. Es la inyección de dependencias de Angular escrita como atributo
  private readonly http = inject(HttpClient);

  calcular(origen: Coordenada, destino: Coordenada, modo: ModoTransporte): Promise<RutaCalculada> {
    return firstValueFrom(
      this.http.post<RutaCalculada>('/api/rutas/calcular', { origen, destino, modo }),                    // Hace el post
    );
  }
}
