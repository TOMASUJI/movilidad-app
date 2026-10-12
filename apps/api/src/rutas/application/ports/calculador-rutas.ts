// Mismo tipo de archivo que ruta.repository.ts
// Interfaz que dice qué necesita la app ("calcúlame una ruta")

//###### BLOQUE 1 ######
// imports e interfaz

import type { Coordenada, ModoTransporte, NuevaRuta } from '../../domain/ruta.js';

export interface CalculadorRutas {
  calcular(origen: Coordenada, destino: Coordenada, modo: ModoTransporte): Promise<NuevaRuta>;
}

//###### BLOQUE 2 ######
// La llave para Nest
export const CALCULADOR_RUTAS = Symbol('CALCULADOR_RUTAS');

// Un solo método calcular que recibe dos coordenadas y el método de transporte

