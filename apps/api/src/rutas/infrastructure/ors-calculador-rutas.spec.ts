// Prueba con Openrouteservice simulado

//###### BLOQUE 1 ######
// imports
import { afterEach, describe, expect, it, vi } from 'vitest';       // Lo mismo que en la prueba del S04, aftereach se ejecuta después de cada preuba y "vi" es la "caja de herramientas" de vitest para crear objetos falsos, como mockito en java
import { OrsCalculadorRutas } from './ors-calculador-rutas.js';     // La clase bajo pruebas

//###### BLOQUE 2 ######
// La respuesta falas de Openrouteservice

// Esto es una copia reducida de lo que devuelve de verdad POST /v2/directions/{profile}/geojson
const respuestaOrs = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-0.0513, 39.9864],
          [-0.2, 39.7],
          [-0.3763, 39.4699],
        ],
      },
      properties: {
        summary: { distance: 74512.3, duration: 3478.9 },
      },
    },
  ],
};


//###### BLOQUE 3 ######
// Estructura de la primera prueba

describe('OrsCalculadorRutas', () => {
  const calculador = new OrsCalculadorRutas({                         // Esto define como será el constructor del adaptador
    apiKey: 'clave-de-prueba',                                        // Recibirá la clave
    baseUrl: 'https://ors.falso',                                     // Y la dirección base
  });

  afterEach(() => {
    vi.unstubAllGlobals();                                            // Al acabar cada prueba, devuelve el fetch real
  });

  it('pide la ruta a Openrouteservice y la traduce a NuevaRuta', async () => {
    // vi.fn crea una función falsa que apunta como la llaman
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaOrs));       // Cuando llamen a la función falsa devolverá una respuesta HTTP 200 con nuestro JSON "respuestaOrs"
    vi.stubGlobal('fetch', fetchFalso);                                              // Cambia el fetch real por el falso solo durante la prueba

    const ruta = await calculador.calcular(
      { lat: 39.9864, lon: -0.0513 },
      { lat: 39.4699, lon: -0.3763 },
      'coche',
    );

    expect(fetchFalso).toHaveBeenCalledWith(
      'https://ors.falso/v2/directions/driving-car/geojson',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'clave-de-prueba' }),                 // Que al menos tenga esto
        body: JSON.stringify({ coordinates: [[-0.0513, 39.9864], [-0.3763, 39.4699]] }),
      }),
    );

    expect(ruta).toEqual({                                                                      // Comprueba que el resultado es la nueva ruta correcta
      origen: { lat: 39.9864, lon: -0.0513 },
      destino: { lat: 39.4699, lon: -0.3763 },
      modo: 'coche',
      distanciaM: 74512.3,
      duracionS: 3478.9,
      geometria: respuestaOrs.features[0].geometry,
    });
  });

  //###### BLOQUE 4 ######
  // Segunda prueba, prueba con parámetros
  it.each([
    ['coche', 'driving-car'],
    ['bici', 'cycling-regular'],
    ['pie', 'foot-walking'],
  ] as const)('usa el perfil %s → %s de Openrouteservice', async (modo, perfil) => {
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaOrs));
    vi.stubGlobal('fetch', fetchFalso);

    await calculador.calcular({ lat: 39.9864, lon: -0.0513 }, { lat: 39.4699, lon: -0.3763 }, modo);

    expect(fetchFalso).toHaveBeenCalledWith(
      `https://ors.falso/v2/directions/${perfil}/geojson`,
      expect.anything(),
    );
  });


  // Tercera prueba, responde con un error

  it('lanza un error si Openrouteservice responde con un error', async () => {
    const respuestaError = Response.json(
      { error: { code: 2010, message: 'Could not find routable point within a radius of 350.0 meters' } },
      { status: 404 },
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuestaError));

    await expect(
      calculador.calcular({ lat: 0, lon: 0 }, { lat: 39.4699, lon: -0.3763 }, 'coche'),
    ).rejects.toThrow('Openrouteservice');
  });



});





