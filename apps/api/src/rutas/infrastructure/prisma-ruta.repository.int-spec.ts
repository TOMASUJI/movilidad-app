// La prueba de integración de la clase PrismaRutaRepository.

// ###### BLOQUE 1 ######
// imports

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
// Lo que se importa de vitest:
  // -- describe: agrupa varias pruebas relacionadas.
  // -- it: define una prueba individual.
  // -- expect: hace afirmaciones sobre el resultado de la prueba.
  // -- beforeAll: se ejecuta antes de todas las pruebas del bloque describe.
  // -- beforeEach: se ejecuta antes de cada prueba del bloque describe.
  // -- afterAll: se ejecuta después de todas las pruebas del bloque describe.


import type { NuevaRuta } from '../domain/ruta.js';                       // El tipo del objeto que se guarda en la base de datos.
import { PrismaRutaRepository } from './prisma-ruta.repository.js';       // La clase que vamos a probar.
import {
  prepararBaseDatosPruebas,
  type BaseDatosPruebas,
} from '../../../test/support/base-datos-pruebas.js';                     // El archivo de ayuda para elegir la base de datos de pruebas y crear la tabla rutas.

// ###### BLOQUE 2 ######
describe('PrismaRutaRepository', () => {                                  // Agrupa todas las pruebas de esta clase. El texto es el nombre que se ve en la consola al ejecutar las pruebas.
  let bd: BaseDatosPruebas;                                               // Variables compartidas por todas las pruebas.
  let repositorio: PrismaRutaRepository;                                  // Se declaran quí y se rellenan en beforeAll.

  beforeAll(async () => {
    bd = await prepararBaseDatosPruebas();                                // Prepara la base de datos de pruebas y devuelve la conexión de prisma ya abierta.
    repositorio = new PrismaRutaRepository(bd.prisma);                    // Crea el repositorio con la conexión de prisma. Se usará en todas las pruebas.
  });

  beforeEach(async () => {                                                // Antes de cada prueba.
    await bd.prisma.ruta.deleteMany();                                    // Borra todas las rutas de la tabla para que cada prueba empiece con la tabla vacía.
  });

  afterAll(async () => {                                                  // Al final de todas las pruebas.
    await bd.cerrar();                                                    // Cierra la conexión y el contenedor si lo hubo.
  });


  // ###### BLOQUE 3 ######
  // Las pruebas.

  // Creamos un objeto de prueba que representa una ruta de Castellón a Valencia en coche.
  const castellonValencia: NuevaRuta = {
    origen: { lat: 39.9864, lon: -0.0513 },
    destino: { lat: 39.4699, lon: -0.3763 },
    modo: 'coche',
    distanciaM: 74500,
    duracionS: 3480,
    geometria: {
      type: 'LineString',
      coordinates: [
        [-0.0513, 39.9864],
        [-0.2, 39.7],
        [-0.3763, 39.4699],
      ],
    },
  };

  // it define una prueba individual. El texto es el nombre que se ve en la consola al ejecutar las pruebas.

  //####################################################################################
  // PRUEBA 1: guardar una ruta y recuperarla por su id.
  //####################################################################################

  it('guarda una ruta y la recupera por su id', async () => {
    const guardada = await repositorio.guardar(castellonValencia);      // Guardo la ruta en la base de datos y espero a que termine.

    expect(guardada.id).toBeDefined();                                  // Compruebo que la ruta guardada tiene un id generado por la base de datos.
    expect(guardada.creadaEn).toBeInstanceOf(Date);                     // Compruebo que la ruta guardada tiene una fecha de creación generada por la base de datos.

    const encontrada = await repositorio.buscarPorId(guardada.id);      // Busco la ruta por su id y espero a que termine.
    expect(encontrada).toEqual(guardada);                               // Compruebo que la ruta encontrada es igual a la ruta guardada.
  });

  //####################################################################################
  // PRUEBA 2: listar las rutas guardadas.
  //####################################################################################
  it('lista las rutas guardadas', async () => {                                             // Se define otra prueba. El texto es el nombre que se en terminal.
    const primera = await repositorio.guardar(castellonValencia);                           // Guardo la primera ruta y espero a que termine.
    const segunda = await repositorio.guardar({ ...castellonValencia, modo: 'bici' });      // Guardo la segunda ruta con el mismo origen y destino pero en bici, y espero a que termine. Los tres puntos ... copian todos los campos del objeto castellonValencia, y luego modo: 'bici' cambia el campo modo a 'bici'.

    const rutas = await repositorio.listar();                                               // Listo todas las rutas guardadas y espero a que termine.

    expect(rutas).toHaveLength(2);                                                          // Compruebo que hay dos rutas en la lista.
    expect(rutas).toEqual(expect.arrayContaining([primera, segunda]));                      // Compruebo que la lista contiene las dos rutas guardadas. expect.arrayContaining() permite que la lista tenga más elementos, pero al menos debe contener los dos objetos guardados.
  });

  //####################################################################################
  // PRUEBA 3: buscar una ruta que no existe.
  //####################################################################################
  it('devuelve null si la ruta no existe', async () => {
    const encontrada = await repositorio.buscarPorId('00000000-0000-0000-0000-000000000000');  // Busco una ruta con un id que no existe y espero a que termine.

    expect(encontrada).toBeNull();                                                             // Compruebo que la ruta encontrada es null, porque no existe ninguna ruta con ese id.
  });
});

