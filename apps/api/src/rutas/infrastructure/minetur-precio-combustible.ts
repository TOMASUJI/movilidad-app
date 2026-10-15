//###### BLOQUE 1 ######
// IMPORTS

import type { ProveedorPrecioCombustible } from '../application/ports/precio-combustible.provider.js';
import type { TipoCombustible } from '../domain/consumo.js';

//###### BLOQUE 2 ######
// Traducción: nuestro dominio -> nombre del campo en el JSON del Ministerio
// Interfaz especifica la forma de la respuesta del ministerio que es el nombre de la gasolinera,
// y el precio de los combustibles
const CAMPO_MINISTERIO: Record<TipoCombustible, string> = {
  gasolina95: 'Precio Gasolina 95 E5',
  gasoleoA: 'Precio Gasoleo A',
};

interface RespuestaMinisterio {
  ListaEESSPrecio: Record<string, string>[];
}


//###### BLOQUE 3 ######
// Clase para el precio del ministerio y constructor
export class MineturAdaptadorCombustiblePrecio implements ProveedorPrecioCombustible {
  constructor(private readonly baseUrl: string) {}

  //###### BLOQUE 4 ######
  // Llamamos al http y control de errores
  async precioPorLitro(provincia: string, combustible: TipoCombustible): Promise<number> {
    const url = `${this.baseUrl}/FiltroProvincia/${provincia}`;

    const inicio = performance.now();
    const respuesta = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Ministerio: la API respondió ${respuesta.status}: ${detalle}`);
    }

    //###### BLOQUE 5 ######
    // Medimos el tiempo y el tamaño del JSON
    const texto = await respuesta.text();
    const ms = Math.round(performance.now() - inicio);
    const kb = (Buffer.byteLength(texto) / 1024).toFixed(1);
    console.log(`[Ministerio] ${ms} ms, ${kb} KB`);


    //###### BLOQUE 6 ######
    // Extraemos el precio y calculamos la media
    const datos = JSON.parse(texto) as RespuestaMinisterio;
    const campo = CAMPO_MINISTERIO[combustible];

    const precios = datos.ListaEESSPrecio
      .map((gasolinera) => gasolinera[campo])
      .filter((precio) => Boolean(precio))
      .map((precio) => parseFloat(precio.replace(',', '.')));

    if (precios.length === 0) {
      throw new Error(`Ministerio: no hay precios de ${combustible} en la provincia ${provincia}`);
    }
    return precios.reduce((suma, precio) => suma + precio, 0) / precios.length;
  }
}
