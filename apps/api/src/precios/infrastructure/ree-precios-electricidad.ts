// Adaptador de Red Eléctrica (REE): cumple el puerto PreciosElectricidad usando la API pública apidatos.ree.es.
// Pide los precios PVPC hora a hora de un día, hace la media y la pasa de €/MWh a €/kWh.

// ###### BLOQUE 1 ###### Imports y configuración
import type { PrecioElectricidad, PreciosElectricidad } from '../application/ports/precios-electricidad.js';

export interface ConfiguracionRee {
  baseUrl: string;                                              // 'https://apidatos.ree.es' en la app real; 'https://ree.falso' en las pruebas
}

// ###### BLOQUE 2 ###### La clase
export class ReePreciosElectricidad implements PreciosElectricidad {  // implements: como en Java, el compilador obliga a tener precioMedio()
  constructor(private readonly config: ConfiguracionRee) {}

  async precioMedio(fecha: string): Promise<PrecioElectricidad> {
    // Paso 1: pedir a REE el día completo, hora a hora
    const url =
      `${this.config.baseUrl}/es/datos/mercados/precios-mercados-tiempo-real` +
      `?start_date=${fecha}T00:00&end_date=${fecha}T23:59&time_trunc=hour`;
    const respuesta = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!respuesta.ok) throw new Error(`Red Eléctrica respondió ${respuesta.status}`);

    // Paso 2: quedarnos con los precios del grupo PVPC (saltándonos el spot)
    const datos = (await respuesta.json()) as RespuestaRee;
    const pvpc = datos.included?.find((grupo) => grupo.type === 'PVPC');      // find: como stream().filter(...).findFirst() en Java
    const precios = pvpc?.attributes.values.map((hora) => hora.value) ?? [];  // Si no hay PVPC, lista vacía
    if (precios.length === 0) throw new Error(`Red Eléctrica no devolvió precios PVPC para el ${fecha}`);

    // Paso 3: media en €/MWh → €/kWh, redondeada a 4 decimales
    const mediaMwh = precios.reduce((suma, p) => suma + p, 0) / precios.length;
    return {
      fecha,
      eurosPorKwh: Math.round((mediaMwh / 1000) * 10000) / 10000,                 // 184,80 €/MWh → 0,1848 €/kWh
      horas: precios.length,
    };
  }
}

// ###### BLOQUE 3 ###### Forma de la respuesta de REE (solo lo que usamos)
interface RespuestaRee {
  included?: { type: string; attributes: { values: { value: number }[] } }[];
}
