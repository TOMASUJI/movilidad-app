// Puerto (interfaz) para obtener el precio de la electricidad.
// El resto de la aplicación solo conoce este contrato; quién lo cumple (REE u otro) se decide en precios.module.ts.

// ###### BLOQUE 1 ######
// El dato que devuelve
export interface PrecioElectricidad {
  fecha: string;          // Día consultado, formato 'AAAA-MM-DD' (p. ej., '2026-10-16')
  eurosPorKwh: number;    // Precio medio PVPC del día, ya pasado a €/kWh
  horas: number;          // Cuántos precios horarios entran en la media (normalmente 24)
}

// ###### BLOQUE 2 ######
// El contrato
export interface PreciosElectricidad {
  precioMedio(fecha: string): Promise<PrecioElectricidad>;   // Como un método abstracto de una interface Java que devuelve un CompletableFuture<PrecioElectricidad>
}

// ###### BLOQUE 3 ###### La "llave" para la inyección de dependencias
export const PRECIOS_ELECTRICIDAD = Symbol('PRECIOS_ELECTRICIDAD');   // Igual que PRECIOS_COMBUSTIBLE: como un @Qualifier en Spring
