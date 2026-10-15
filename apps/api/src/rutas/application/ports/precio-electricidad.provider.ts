// Hace lo mismo que precio-combustible.provider.ts

export interface ProveedorPrecioElectrico {
  precioEurPorMWh(): Promise<number>; // €/MWh
}

export const PROVEEDOR_PRECIO_ELECTRICIDAD = Symbol('PROVEEDOR_PRECIO_ELECTRICIDAD');
