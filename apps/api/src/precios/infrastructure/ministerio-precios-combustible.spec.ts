// Prueba del adaptador del Ministerio (S03) con la API simulada.
//
// Comprueba que MinisterioPreciosCombustible:
//   - pide los precios de una provincia y un combustible a la URL correcta
//     (gasolina95 → producto 1, gasoleoA → producto 4) y en formato JSON;
//   - convierte los precios con coma ("1,859") a número y calcula la media,
//     redondeada a tres decimales, ignorando las gasolineras sin precio;
//   - lanza un error claro si el servicio falla o si no hay ningún precio.
//
// No llama a internet: `fetch` se sustituye por una función falsa que
// devuelve una copia recortada de la respuesta real del Ministerio.
// Se ejecuta con `npm test`.

//###### BLOQUE 1 ######
// Imports y respuesta falsa

import { afterEach, describe, expect, it, vi } from 'vitest';                                   // Imports de Vitest
import { MinisterioPreciosCombustible } from './ministerio-precios-combustible.js';             // La clase que vamos a probar (no existe aún cuando escribimos este código)

const respuestaMinisterio = {                                                                                     // Copia recortada de la respuesta del ministerio
  Fecha: '16/10/2026 0:41:22',                                                                                    // Solo 4 gasolineras y pocos datos cada una
  ListaEESSPrecio: [
    { Rótulo: 'COOPNOSTRA', Municipio: 'Albocàsser', IDProvincia: '12', PrecioProducto: '1,859' },                // Un precio normal con coma
    { Rótulo: 'REPSOL', Municipio: 'Albocàsser', IDProvincia: '12', PrecioProducto: '1,879' },                    // Otro para poder hacer una media
    { Rótulo: 'COOP. SAN ISIDRO', Municipio: 'Alcalà de Xivert', IDProvincia: '12', PrecioProducto: '1,805' },    // Un tercero más barato
    { Rótulo: 'SIN PRECIO', Municipio: 'Morella', IDProvincia: '12', PrecioProducto: '' },                        // Una gasolinera sin precio
  ],
  ResultadoConsulta: 'OK',
};

//###### BLOQUE 2 ######
// Preparación de la prueba

describe('MinisterioPreciosCombustible', () => {                                                      // Agrupa todas las pruebas de esta clase, como la clase de prueba de JUnit.
  const precios = new MinisterioPreciosCombustible({ baseUrl: 'https://ministerio.falso' });          // Crea una sola vez el objeto que vamos a probar, y lo comparten todas las pruebas. Solo recibe baseUrl, sin clave, porque la API del Ministerio es pública. Openrouteservice, en cambio, necesitaba apiKey

  afterEach(() => {
    vi.unstubAllGlobals();                                                                            // Después de cada prueba, devuelve el fetch real a su sitio
  });                                                                                                 // fetch es la función que trae Node para hacer peticiones HTTP


  //###### BLOQUE 3 ######
  // La primera prueba, la media

  it('pide los precios de la provincia y calcula la media', async () => {
    // Given
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaMinisterio));                 // vi.fn() crea una función falsa, como un mock, .mockResolvedValue(Response.json(respuestaMinisterio)): cuando la llamen, devolverá una respuesta HTTP 200 con el JSON del bloque 1
    vi.stubGlobal('fetch', fetchFalso);                                                               // la pone en el sitio del fetch real, como acabamos de ver.


    // When
    const resultado = await precios.precioMedio('gasolina95', '12');                                  // "Dame el precio medio de la gasolina 95 en la provincia 12 (Castellón)"

    // Then
    expect(fetchFalso).toHaveBeenCalledWith(
      'https://ministerio.falso/EstacionesTerrestres/FiltroProvinciaProducto/12/1',                   //dirección base + /EstacionesTerrestres/FiltroProvinciaProducto/ + 12 (provincia) + /1 (producto). Aquí se comprueba la traducción: 'gasolina95' es nuestro nombre y 1 el del Ministerio.
      expect.objectContaining({ headers: expect.objectContaining({ Accept: 'application/json' }) }),  // para que responda en JSON y no en XML como en el navegador.
    );
    expect(resultado).toEqual({                                                                       // Expect significa que al menso contiene lo siguiente
      combustible: 'gasolina95',
      idProvincia: '12',
      eurosPorLitro: 1.848,
      gasolineras: 3,
      fecha: '16/10/2026 0:41:22',
    });
  });


  //###### BLOQUE 4 ######
  // Prueba de los combustibles

  it.each([                                                                                             // Es como el @Parametrized test de java, la prueba se ejecuta una vez por fila de la tabla
    ['gasolina95', '1'],                                                                                // tiene que pedir el producto 1 (Gasolina 95 E5).
    ['gasoleoA', '4'],                                                                                  // tiene que pedir el producto 4 (Gasóleo A habitual).
  ] as const)('usa el producto %s → %s del Ministerio', async (combustible, producto) => {              // %s → %s se rellena con los valores de cada fila
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaMinisterio));
    vi.stubGlobal('fetch', fetchFalso);

    await precios.precioMedio(combustible, '12');

    expect(fetchFalso).toHaveBeenCalledWith(
      `https://ministerio.falso/EstacionesTerrestres/FiltroProvinciaProducto/12/${producto}`,
      expect.anything(),
    );
  });


  //###### BLOQUE 6 ######
  // Pruebas de error

  // Primera prueba, simula que el servicio está caido
  it('lanza un error si el servicio del Ministerio falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Servicio no disponible', { status: 503 })));

    await expect(precios.precioMedio('gasolina95', '12')).rejects.toThrow('Ministerio');
  });

  // Segunda prueba, no hay ningún precio
  it('lanza un error si ninguna gasolinera tiene precio', async () => {
    const sinPrecios = { ...respuestaMinisterio, ListaEESSPrecio: [{ PrecioProducto: '' }] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(sinPrecios)));

    await expect(precios.precioMedio('gasolina95', '12')).rejects.toThrow('sin precios');
  });
});
