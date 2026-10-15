import { ConsumoCombustible, ConsumoElectrico } from './consumo.js';

// Dos funciones independientes dependiendo si es de combustion o eléctrico
// En los dos tiene que introducirle la distancia que se va a hacer, el consumo y los euros por litro o por MWh
// Cada una devuelve el coste en €

export function costeCombustion( distanciaM: number, consumo: ConsumoCombustible, eurPorLitro: number): number {
  const km = distanciaM / 1000;
  const litros = (km * consumo.litrosPor100Km) / 100;
  return litros * eurPorLitro;
}

export function costeElectrico( distanciaM: number, consumo: ConsumoElectrico, eurPorMWh: number): number {
  const km = distanciaM / 1000;
  const kwh = (km * consumo.kwhPor100Km) / 100;
  const eurPorKwh = eurPorMWh / 1000;
  return kwh * eurPorKwh;
}
