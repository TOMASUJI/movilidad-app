// Clase combustible


export type TipoCombustible = 'gasolina95' | 'gasoleoA';      // Nuestros nombres para los tipos de combustible, el adaptador los traducirá a 1 y 4 (lo que devuelve la api del ministerio)

export interface PrecioMedio {                                // Además del precio guarda de cuantas gasolineras sale la media y la fecha de los datos
  combustible: TipoCombustible;
  idProvincia: string;
  eurosPorLitro: number;
  gasolineras: number;
  fecha: string;
}

export interface PreciosCombustible {                         // Puerto con un solo método
  precioMedio(combustible: TipoCombustible, idProvincia: string): Promise<PrecioMedio>;
}

export const PRECIOS_COMBUSTIBLE = Symbol('PRECIOS_COMBUSTIBLE');       // La llave para Nest
