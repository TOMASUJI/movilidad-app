// Interfaz del cálculo del precio del consumo

//###### BLOQUE 1 ######
// imports e interfaz

import { TipoCombustible } from "../../domain/consumo.js";

export interface ProveedorPrecioCombustible {
    precioPorLitro(provincia: String , combustible: TipoCombustible): Promise<number>; // Devuelve €/litro
}

//###### BLOQUE 2 ######
// La llave para Nest

export const PROVEEDOR_PRECIO_COMBUSTIBLE = Symbol('PROVEEDOR_PRECIO_COMBUSTIBLE');
