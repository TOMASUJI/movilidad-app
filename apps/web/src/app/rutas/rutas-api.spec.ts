// La prueba del servicio
// La misma idea que el S05 pero en la web

// El servicio llamará a POST /api/rutas/calcular y en la prueba no habrá API real, alngula trae un servidor http falso de serie para las pruebas

// La prueba comprobará:
//     1. Llama a la URL correcta (api/rutas/calcular) con POST
//     2. Envia en el cuerpo el origen, destino y modo
//     3. Devuelve la ruta que responde la api


//###### BLOQUE 1 ######
// Imports y datos de ejemplo

import { TestBed } from '@angular/core/testing';                                                    // El "contenedor" de angular para pruebas. Crea los servicios con inyección de dependencias
import { provideHttpClient } from '@angular/common/http';                                           // Activa el cliente HTTP de Angular
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';     // Sustituye el cliente por la versión falsa que no sale a la red
import { afterEach, beforeEach, describe, expect, it } from 'vitest';                               // Lo de siempre de vitest
import type { Coordenada, RutaCalculada } from './ruta';                                            //
import { RutasApi } from './rutas-api';                                                             // El servicio que vamos a probar

const castellon: Coordenada = { lat: 39.9864, lon: -0.0513 };
const valencia: Coordenada = { lat: 39.4699, lon: -0.3763 };

const rutaCalculada: RutaCalculada = {
  origen: castellon,
  destino: valencia,
  modo: 'coche',
  distanciaM: 73728.4,
  duracionS: 3195.1,
  geometria: {
    type: 'LineString',
    coordinates: [
      [-0.0513, 39.9864],
      [-0.3763, 39.4699],
    ],
  },
};

//###### BLOQUE 2 ######
// La prueba

describe('RutasApi', () => {
  let api: RutasApi;
  let servidorFalso: HttpTestingController;

  beforeEach(() => {                                                              // Preparamos el contenedor
    TestBed.configureTestingModule({                                              // Monta un contenedor de angular para la prueba
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(RutasApi);                                               // Pide al contenedor el servicio, angular lo crea y le inyecta el http falso
    servidorFalso = TestBed.inject(HttpTestingController);                        // Pide el mando del servidor falso
  });

  afterEach(() => {                                                               // Comprueba que no quedó ninguna petición sin antender
    servidorFalso.verify();
  });

  // La prueba

  it('pide la ruta con POST /api/rutas/calcular y devuelve la respuesta', async () => {
    const promesa = api.calcular(castellon, valencia, 'coche');                                         // Pedimos calcular pero la respuesta no llegará hasta que la "enviemos" nosotros

    const peticion = servidorFalso.expectOne('/api/rutas/calcular');                                    // Comprueba que llega exactamente una petición a la ruta esperada
    expect(peticion.request.method).toBe('POST');                                                       // Comprobamos que es una petición post
    expect(peticion.request.body).toEqual({ origen: castellon, destino: valencia, modo: 'coche' });     // Comprobamos que el cuerpo lleva origen, destino y modo

    peticion.flush(rutaCalculada);                                                                      // Hace que el servidor falso responda con la ruta de ejemplo

    expect(await promesa).toEqual(rutaCalculada);                                                       // Recogemos el resultado y comprobamos que es la ruta que  respondió el servidor
  });
});
