// La clase PrismaRutaRepository implementa la interfaz RutaRepository, que define los métodos que la aplicación necesita para guardar y leer rutas.

// ###### BLOQUE 1 ######
// imports

import type { PrismaClient, Ruta as RutaFila } from '../../generated/prisma/client.js';   // PrismaClient es la conexión que llega por el constructor. RutaFila es el tipo de la fila de la tabla rutas, que es diferente del tipo Ruta de la aplicación.
import type { RutaRepository } from '../application/ports/ruta.repository.js';            // La interfaz que se va a implementar.
import type { LineaRuta, ModoTransporte, NuevaRuta, Ruta } from '../domain/ruta.js';      // Nuestros tipos de dominio.


// ###### BLOQUE 2 ######
// La clase y su constructor

export class PrismaRutaRepository implements RutaRepository {         // Es una clase pública como en java. Implements funciona igual que en java: obliga a implementar los métodos de la interfaz RutaRepository.
  constructor(private readonly prisma: PrismaClient) {}             // En typscript el constructor no se llama como la clase, se declara como constructor.
  // Al poner private readonly delante de un parámetro del constructor typescript declara el atributo primsa en la clase, lo hace privado y no reasignable (como final en java).

  // ###### BLOQUE 3 ######

  async guardar(ruta: NuevaRuta): Promise<Ruta> {
    const fila = await this.prisma.ruta.create({
      data: {
        origenLat: ruta.origen.lat,
        origenLon: ruta.origen.lon,
        destinoLat: ruta.destino.lat,
        destinoLon: ruta.destino.lon,
        modo: ruta.modo,
        distanciaM: ruta.distanciaM,
        duracionS: ruta.duracionS,
        geometria: { ...ruta.geometria },
      },
    });

    return aDominio(fila);
  }

  // ###### BLOQUE 5 ###### (aquí irán listar y buscarPorId)
  async listar(): Promise<Ruta[]> {
    const filas = await this.prisma.ruta.findMany();                      // findMany devuelve todas las filas de la tabla, como un SELECT * FROM rutas.
    return filas.map(aDominio);                                           // Traduce cada fila a nuestra Ruta y devuelve la lista nueva.
      // aDominio va sin paréntesis porque se pasa la función en si a map para que la use con cada fila.
  }

  async buscarPorId(id: string): Promise<Ruta | null> {
    const fila = await this.prisma.ruta.findUnique({ where: { id } });    // findUnique es com SELECT * FROM rutas WHERE id = ?.
    return fila ? aDominio(fila) : null;                                  // el operador ternario igual que en java, si hay fila la traduce, si no devuelve null.
  }

}


// ###### BLOQUE 4 ######
// Traductor de fila de la tabla (RutaFila) a nuestra Ruta de dominio. Va fuera de la clase y sin export: es como un private static de Java.

function aDominio(fila: RutaFila): Ruta {
  return {
    id: fila.id,
    origen: { lat: fila.origenLat, lon: fila.origenLon },
    destino: { lat: fila.destinoLat, lon: fila.destinoLon },
    modo: fila.modo as ModoTransporte,
    distanciaM: fila.distanciaM,
    duracionS: fila.duracionS,
    geometria: fila.geometria as unknown as LineaRuta,
    creadaEn: fila.creadaEn,
  };
}
