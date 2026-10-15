//###### BLOQUE 1 ######
// imports
import { describe, expect, it } from 'vitest';
import { costeCombustion, costeElectrico } from './coste-ruta.js';
import { ConsumoCombustible, ConsumoElectrico } from './consumo.js';


describe('route-cost', () => {
  it('calcula el coste en coche de combustión', () => {
    const consumo: ConsumoCombustible = {
      tipoMotor: 'combustion',
      tipoCombustible: 'gasolina95',
      litrosPor100Km: 5,
    };

    expect(costeCombustion(200_000, consumo, 1.5)).toBeCloseTo(15);
  });

  it('calcula el coste en eléctrico', () => {
    const consumo: ConsumoElectrico = {
      tipoMotor: 'electrico',
      kwhPor100Km: 15,
    };

    expect(costeElectrico(100_000, consumo, 100)).toBeCloseTo(1.5);
  });
});
