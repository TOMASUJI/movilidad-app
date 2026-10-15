// El adaptador de los precios del ministerio
// Probado por la prueba con el mismo nombre

//###### BLOQUE 1 ######

import type { PrecioMedio, PreciosCombustible, TipoCombustible } from '../application/ports/precios-combustible.js';    // Importamos los tres tipos del puerto

export interface ConfiguracionMinisterio {                                                                              // Tiene solo la dirección base, sin api, ya que es pública
  baseUrl: string;
}

const PRODUCTOS: Record<TipoCombustible, string> = {                                                                    // Tabla que traduce nuestros nombres a los del ministerio
  gasolina95: '1',
  gasoleoA: '4',
};


//###### BLOQUE 2 ######
// La petición al ministerio

export class MinisterioPreciosCombustible implements PreciosCombustible {
  constructor(private readonly config: ConfiguracionMinisterio) {}

  async precioMedio(combustible: TipoCombustible, idProvincia: string): Promise<PrecioMedio> {
    // La url junta la dirección base, la provincia y el número de producto, traducido con la tabla del bloque 1. Con gasolina 95 en Castellón
    const url = `${this.config.baseUrl}/EstacionesTerrestres/FiltroProvinciaProducto/${idProvincia}/${PRODUCTOS[combustible]}`;

    // Como no ponemos method, fetch usa GET por defecto, igual que el navegador al abrir una dirección
    const respuesta = await fetch(url, {
      headers: { Accept: 'application/json' },    // significa “quiero la respuesta en JSON”
    });

    if (!respuesta.ok) {
      throw new Error(`El servicio de precios del Ministerio respondió ${respuesta.status}`);
    }

    //###### BLOQUE 3 ######
    // Lee la respuesta y calcula la media

    const datos = (await respuesta.json()) as RespuestaMinisterio;

    // Esto funciona como un stream en Java


    const precios = datos.ListaEESSPrecio
      .map((gasolinera) => gasolinera.PrecioProducto)         // De cada gasolinera se queda solo con el precio
      .filter((precio) => precio !== '')                      // Quita las gasolineras sin precio
      .map((precio) => Number(precio.replace(',', '.')));     // Cambia la coma por punto y lo convierte a número

    if (precios.length === 0) {                               // si no queda ningún precio, lanza el error
      throw new Error(`Provincia ${idProvincia} sin precios de ${combustible} en el Ministerio`);
    }

    // Suma todos los precios empezando desde 0.
    const media = precios.reduce((suma, precio) => suma + precio, 0) / precios.length;

    return {
      combustible,
      idProvincia,
      eurosPorLitro: Math.round(media * 1000) / 1000,       // Redondea a tres decimales
      gasolineras: precios.length,
      fecha: datos.Fecha,
    };
  }
}

interface RespuestaMinisterio {                             // Describe la parte del JSON que usamos: la fecha y, de cada gasolinera, solo su precio
  Fecha: string;
  ListaEESSPrecio: { PrecioProducto: string }[];
}















