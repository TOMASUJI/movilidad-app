// Este archivo define los tipos para la web (que es una ruta para la web)
// Es casi una copia de ruta.ts de la api RutaCalculada es la misma forma que NuevaRuta, que es lo que devuelve POST /api/rutas/calcular

// No lo importamos desde la api porque son dos programas distintos, la web se ejecuta en el navegador y no puede incluir codigo de la api


export type ModoTransporte = 'coche' | 'bici' | 'pie';

export interface Coordenada {
  lat: number;
  lon: number;
}

export interface LineaRuta {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface RutaCalculada {
  origen: Coordenada;
  destino: Coordenada;
  modo: ModoTransporte;
  distanciaM: number;
  duracionS: number;
  geometria: LineaRuta;
}
