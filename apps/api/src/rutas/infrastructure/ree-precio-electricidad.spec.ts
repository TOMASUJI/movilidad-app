// Misma estructura que minetur-precio-combustible.spec.ts

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReeAdaptadorPrecioElectricidad } from './ree-precio-electricidad.js';

// Versión reducida de la respuesta real: dos series, con el spot ANTES que el PVPC
const respuestaRee = {
  included: [
    {
      attributes: {
        title: 'Precio mercado spot',
        values: [
          { value: 0, datetime: '2026-10-15T00:00:00.000+02:00' },
          { value: 0, datetime: '2026-10-15T01:00:00.000+02:00' },
        ],
      },
    },
    {
      attributes: {
        title: 'PVPC',
        values: [
          { value: 100, datetime: '2026-10-15T00:00:00.000+02:00' },
          { value: 200, datetime: '2026-10-15T01:00:00.000+02:00' },
        ],
      },
    },
  ],
};

describe('ReeAdaptadorPrecioElectricidad', () => {
  const adaptador = new ReeAdaptadorPrecioElectricidad('https://ree.falso');

  // Restaura el fetch y devuelve el reloj a la normalidad
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('devuelve la media del PVPC del día en €/MWh, aunque no sea la primera serie', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(respuestaRee)));

    const precio = await adaptador.precioEurPorMWh();

    expect(precio).toBeCloseTo(150);
  });

  // Engaña el reloj para poder realizar los tests
  it('construye start_date y end_date a partir de la fecha actual', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0)); // 15 de octubre de 2026 (los meses empiezan en 0)
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaRee));
    vi.stubGlobal('fetch', fetchFalso);

    await adaptador.precioEurPorMWh();

    expect(fetchFalso).toHaveBeenCalledWith(
      'https://ree.falso/es/datos/mercados/precios-mercados-tiempo-real' +
        '?start_date=2026-10-15T00:00&end_date=2026-10-15T23:59&time_trunc=hour',
    );
  });

  it('lanza un error si la respuesta no trae la serie PVPC', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ included: [] })));

    await expect(adaptador.precioEurPorMWh()).rejects.toThrow('Red Eléctrica');
  });

  it('lanza un error si Red Eléctrica responde con un error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({}, { status: 500 })));

    await expect(adaptador.precioEurPorMWh()).rejects.toThrow('Red Eléctrica');
  });
});
