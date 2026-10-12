//###### BLOQUE 1 ######
// El modo de transporte puede ser coche, bici o pie. Sería como un enum en Java
// export es como el modificador publicn en java, permite usarlo desde otros archivos.
// type ModoTransporte creaun nuevo tipo llamado ModoTransporte, que puede ser uno de los tres valores: 'coche', 'bici' o 'pie'.
// La brra "|" significa "o", es decir, el tipo ModoTransporte puede ser 'coche' o 'bici' o 'pie'.
// En java escribiríamos ModoTransporte.COCHE, aquí el valor es directamente el texto 'coche'.

export type ModoTransporte = 'coche' | 'bici' | 'pie';


//###### BLOQUE 2 ######
// interface define la forma de una Coordenada, primero el nombre y luego el tipo, al revés que java.
// TypeScript solo tiene un tipo numerico, no hay distinción entre int y float como en Java.

export interface Coordenada {
  lat: number;
  lon: number;
}

//###### BLOQUE 3 ######
// LineaRuta es el dibujo de la ruta, una lista de puntos por los que pasa, luego se unen por una linea.
// type 'LineString' es un tipo de geometría de GeoJSON, que es un estándar para representar datos geográficos.
// es el mismo truco el en el bloque 1 pero con una sola opción, el tipo de geometría es siempre 'LineString'.
// coordinates se lee de dentor hacia afuera. [number, number] es un par de números: un array de exactamente dos elementos. Si pones tres, da error.
// [] al final indica una lista de esos pares.
// Ejemplo: [[-0.38, 39.47], [-0.37, 39.48], [-0.36, 39.49]] son tres puntos del recorrido.
// En GeoJSON, el primer número es la longitud (lon) y el segundo es la latitud (lat), al revés que en la interfaz Coordenada.

export interface LineaRuta {
  type: 'LineString';
  coordinates: [number, number][];
}

// ###### BLOQUE 4 ######
// Esta es la pieza principal: junta todo lo de los bloques anteriores.

export interface Ruta {
  id: string;                   // Identificador único de la ruta.
  origen: Coordenada;           // Punto de inicio de la ruta. (bloque 2)
  destino: Coordenada;          // Punto de destino de la ruta. (bloque 2)
  modo: ModoTransporte;         // Modo de transporte utilizado. (bloque 1)
  distanciaM: number;           // Distancia total de la ruta en metros.
  duracionS: number;            // Duración total de la ruta en segundos.
  geometria: LineaRuta;         // Geometría de la ruta. (bloque 3)
  creadaEn: Date;               // Fecha y hora de creación de la ruta.
}


// ###### BLOQUE 5 ######
// El problema que resuelve: cuando la aplicación quiere guardar una ruta, todavía no tiene ni id ni creadaEn,
// porque esos dos datos los pone la base de datos en el momento de guardar. Así que no puede crear una Ruta completa. Hace falta un tipo “ruta sin esos dos campos”.
// Omit<Ruta, 'id' | 'creadaEn'> significa: toma la interfaz Ruta y quítale los campos id y creadaEn.
// el método guardar del siguiente archivo recibirá una NuevaRuta y devolverá una Ruta.
// Es decir, “te doy una ruta sin id y me devuelves la misma ya guardada, con su id y su fecha”.

export type NuevaRuta = Omit<Ruta, 'id' | 'creadaEn'>;
