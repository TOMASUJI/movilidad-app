// El adaptador OrsCalculadorRutas
// Es la clase que implementa CalculadorRutas llamando Openrouteservice por HTTP

//###### BLOQUE 1 ######
// Imports

import type { CalculadorRutas } from '../application/ports/calculador-rutas.js';
import type { Coordenada, LineaRuta, ModoTransporte, NuevaRuta } from '../domain/ruta.js';

export interface ConfiguracionOrs {
  apiKey: string;
  baseUrl: string;
}

//###### BLOQUE 2 ######
// La tabla de perfiles

// const PERFILES está fuera de la clase y sin export, es una constante privada del archivo (en java private final)
const PERFILES: Record<ModoTransporte, string> = {      // Record<ModoTransporte, string> es el tipo: “un objeto cuyas claves son todos los ModoTransporte y cuyos valores son textos” Para usarlo: PERFILES['coche'] devuelve 'driving-car'
  coche: 'driving-car',
  bici: 'cycling-regular',
  pie: 'foot-walking',
};


export class OrsCalculadorRutas implements CalculadorRutas {
  constructor(private readonly config: ConfiguracionOrs) {}       // El mismo atajo que tomamos siempre para inicializar una instancia de ConfiguracionOrs private final

  async calcular(origen: Coordenada, destino: Coordenada, modo: ModoTransporte): Promise<NuevaRuta> {
    const url = `${this.config.baseUrl}/v2/directions/${PERFILES[modo]}/geojson`;   // Completamos la URL

    const respuesta = await fetch(url, {                                            // fetch recibe la URL y un objeto con las opciones.
      method: 'POST',
      headers: {
        Authorization: this.config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [origen.lon, origen.lat],         // importante poner lon y lat al reves que nuestro domain "Coordenada[lat, lon]" ya que Openrouteservice exige [lon, lat]
          [destino.lon, destino.lat],
        ],
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Openrouteservice respondió ${respuesta.status}: ${detalle}`);
    }

    const datos = (await respuesta.json()) as RespuestaOrs;                   //Lee el cuerpo y lo convierte de texto a objeto, el "as" es un cast.
    const primera = datos.features[0];                                        //datos.features[0] coge la primera y única ruta
    if (!primera) {                                                           //Si viene vacía damos un mensaje de error
      throw new Error('Openrouteservice no devolvió ninguna ruta');
    }

    return {                                                                  //El return devuelve la nueva ruta
      origen,
      destino,
      modo,
      distanciaM: primera.properties.summary.distance,
      duracionS: primera.properties.summary.duration,
      geometria: primera.geometry,
    };
  }
}


//###### BLOQUE 5 ######
// Describe la fomra del JSON que devuelve Openrouteservice
// Va sin export porque solo lo usa este adaptador, nada más en la app lo usa
interface RespuestaOrs {
  features: {
    geometry: LineaRuta;
    properties: { summary: { distance: number; duration: number } };
  }[];
}


