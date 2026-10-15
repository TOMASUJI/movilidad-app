import type { ProveedorPrecioElectrico } from '../application/ports/precio-electricidad.provider.js';

//###### BLOQUE 1 ######
// Serie de la respuesta de REData que usamos como precio. La otra que trae es 'Precio mercado spot'.
const SERIE_PRECIO = 'PVPC';

interface SerieRee {
  attributes: {
    title: string;
    values: { value: number; datetime: string }[];
  };
}

interface RespuestaRee {
  included?: SerieRee[];
}

export class ReeAdaptadorPrecioElectricidad implements ProveedorPrecioElectrico {
  constructor(private readonly baseUrl: string) {}

  async precioEurPorMWh(): Promise<number> {
    //###### BLOQUE 2 ######
    // Contruimos la URL con la fecha de hoy

    const hoy = this.fechaDeHoy();
    const url =
      `${this.baseUrl}/es/datos/mercados/precios-mercados-tiempo-real` +
      `?start_date=${hoy}T00:00&end_date=${hoy}T23:59&time_trunc=hour`;

    const inicio = performance.now();
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Red Eléctrica: la API respondió ${respuesta.status}: ${detalle}`);
    }
    const texto = await respuesta.text();
    const ms = Math.round(performance.now() - inicio);
    const kb = (Buffer.byteLength(texto) / 1024).toFixed(1);
    console.log(`[Red Eléctrica] ${ms} ms, ${kb} KB`);

    //###### BLOQUE 3 ######
    // Extraemos los valores y la media
    const datos = JSON.parse(texto) as RespuestaRee;
    const serie = datos.included?.find((s) => s.attributes.title === SERIE_PRECIO);
    const valores = serie?.attributes.values ?? [];

    if (valores.length === 0) {
      throw new Error('Red Eléctrica: la respuesta no trae valores de precio');
    }
    return valores.reduce((suma, v) => suma + v.value, 0) / valores.length;
  }

  //###### BLOQUE 4 ######
  // Método privado que calcula la fecha actual
  // Fecha local en formato AAAA-MM-DD (sin pasar por UTC, que puede dar el día anterior)
  private fechaDeHoy(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}
