// Prueba de ACEPTACIÓN del spike (S06): calcular una ruta y guardarla.
//
// Recorre el flujo completo con las piezas reales:
//   OrsCalculadorRutas (S02) → NuevaRuta → PrismaRutaRepository (S04) → PostgreSQL
// Solo Openrouteservice está simulado (fetch falso); la base de datos es real
// (movilidad_test en local o Testcontainers en el CI).
// Comprueba que los dos adaptadores encajan: lo que devuelve uno lo guarda bien el otro.
// Se ejecuta con `npm run test:int`.


// ###### BLOQUE 1 ######
// Imports y datos

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';  // Vitest (JUnit + Mockito)
import { OrsCalculadorRutas } from '../../src/rutas/infrastructure/ors-calculador-rutas.js';       // Adaptador real de Openrouteservice (S02)
import { PrismaRutaRepository } from '../../src/rutas/infrastructure/prisma-ruta.repository.js';   // Adaptador real de PostgreSQL (S04)
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js'; // Ayuda para la base de datos de pruebas (S04)

const castellon = { lat: 39.9864, lon: -0.0513 };                    // Origen
const valencia = { lat: 39.4699, lon: -0.3763 };                     // Destino

const respuestaOrs = {                                               // Copia recortada de la respuesta real de Openrouteservice (la misma del S05)
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
        summary: { distance: 74512.3, duration: 3478.9 },            // Metros y segundos
      },
    },
  ],
};

// ###### BLOQUE 2 ######
// Preparación (antes y después de cada prueba)

describe('S06 · Calcular una ruta y guardarla', () => {
  // Calculador REAL de Openrouteservice; solo cambiamos la URL y la clave (el fetch irá falseado)
  const calculador = new OrsCalculadorRutas({ apiKey: 'clave-de-prueba', baseUrl: 'https://ors.falso' });

  let bd: BaseDatosPruebas;                // Base de datos PostgreSQL real (movilidad_test o Testcontainers)
  let repositorio: PrismaRutaRepository;   // Repositorio REAL que escribe en esa base de datos

  beforeAll(async () => {                  // Una sola vez: como @BeforeAll en JUnit
    bd = await prepararBaseDatosPruebas(); // Arranca la BD y aplica las migraciones
    repositorio = new PrismaRutaRepository(bd.prisma); // Le "inyectamos" la conexión a mano, como un new en Java
  });

  beforeEach(async () => {                 // Antes de CADA prueba: como @BeforeEach
    await bd.prisma.ruta.deleteMany();     // Tabla vacía: cada prueba empieza de cero
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(respuestaOrs))); // ORS responde con nuestra ruta de ejemplo
  });

  afterEach(() => {                        // Después de CADA prueba: como @AfterEach
    vi.unstubAllGlobals();                 // Devolvemos el fetch original
  });

  afterAll(async () => {                   // Al terminar todo: como @AfterAll
    await bd.cerrar();                     // Cerramos la conexión (y el contenedor si lo hubo)
  });

    // ###### BLOQUE 3 ###### EV: calcular una ruta y guardarla
  it('EV · calcula la ruta Castellón → Valencia en coche y queda guardada', async () => {
    const calculada = await calculador.calcular(castellon, valencia, 'coche'); // Paso 1: el adaptador de ORS calcula la ruta
    const guardada = await repositorio.guardar(calculada);                    // Paso 2: el repositorio la guarda en PostgreSQL

    expect(await repositorio.listar()).toEqual([guardada]);  // En la BD hay exactamente 1 ruta, la que acabamos de guardar
    expect(guardada).toMatchObject({                          // Y tiene los datos que devolvió ORS:
      origen: castellon,
      destino: valencia,
      modo: 'coche',
      distanciaM: 74512.3,                                    // summary.distance de respuestaOrs
      duracionS: 3478.9,                                      // summary.duration de respuestaOrs
      geometria: respuestaOrs.features[0].geometry,           // La línea de la ruta, intacta
    });
  });

    // ###### BLOQUE 4 ###### EI: punto no enrutable → error y no se guarda nada
  it('EI · si ORS no encuentra ruta, lanza un error y no se guarda ninguna ruta', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(            // Sustituimos la respuesta del beforeEach por un error:
      Response.json(
        { error: { code: 2010, message: 'Could not find routable point within a radius of 350.0 meters' } }, // Mensaje real de ORS
        { status: 404 },                                          // ORS contesta 404
      ),
    ));

    await expect(                                                 // Esperamos que la cadena calcular → guardar falle
      calculador.calcular(castellon, valencia, 'coche').then((ruta) => repositorio.guardar(ruta)),
    ).rejects.toThrow('Openrouteservice');                        // con el error de nuestro adaptador

    expect(await repositorio.listar()).toEqual([]);              // Y la BD sigue vacía: no se guardó nada
  });
}); // Fin del describe
