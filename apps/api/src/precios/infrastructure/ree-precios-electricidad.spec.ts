// Pruebas del adaptador de Red Eléctrica (REE) para el precio de la electricidad.
// No se llama a la API real: se sustituye fetch por un doble que devuelve una respuesta preparada,
// copiada de la respuesta real que vimos en PowerShell.

// ###### BLOQUE 1 ###### Imports y respuesta de ejemplo
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReePreciosElectricidad } from './ree-precios-electricidad.js';      // Todavía no existe: por eso la prueba empieza en rojo

const respuestaRee = {
  included: [
    { type: 'Precio mercado spot', id: '600', attributes: { title: 'Precio mercado spot', values: [{ value: 100 }] } }, // Lo ponemos PRIMERO a propósito: el adaptador tiene que saltárselo
    {
      type: 'PVPC', id: '1001',
      attributes: {
        title: 'PVPC',
        values: [                                                              // Las tres primeras horas reales del 16/10 (en €/MWh)
          { value: 196.93, datetime: '2026-10-16T00:00:00.000+02:00' },
          { value: 182.79, datetime: '2026-10-16T01:00:00.000+02:00' },
          { value: 174.69, datetime: '2026-10-16T02:00:00.000+02:00' },
        ],
      },
    },
  ],
};

// ###### BLOQUE 2 ###### Preparación
describe('ReePreciosElectricidad', () => {
  const ree = new ReePreciosElectricidad({ baseUrl: 'https://ree.falso' });   // URL falsa: el fetch irá simulado

  afterEach(() => {
    vi.unstubAllGlobals();                                                     // Devolvemos el fetch original después de cada prueba
  });

  // ###### BLOQUE 3 ###### Pruebas
  it('calcula la media PVPC del día en €/kWh', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(respuestaRee)));

    const precio = await ree.precioMedio('2026-10-16');

    expect(precio).toEqual({ fecha: '2026-10-16', eurosPorKwh: 0.1848, horas: 3 }); // (196,93 + 182,79 + 174,69) / 3 = 184,80 €/MWh → 0,1848 €/kWh
  });

  it('pide a REE el día completo, hora a hora', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaRee));
    vi.stubGlobal('fetch', fetchFalso);

    await ree.precioMedio('2026-10-16');

    const url = String(fetchFalso.mock.calls[0][0]);                           // La URL con la que se llamó a fetch (primer argumento de la primera llamada)
    expect(url).toContain('start_date=2026-10-16T00:00');
    expect(url).toContain('end_date=2026-10-16T23:59');
    expect(url).toContain('time_trunc=hour');
  });

  it('lanza un error si REE no responde bien', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

    await expect(ree.precioMedio('2026-10-16')).rejects.toThrow('Red Eléctrica');
  });

  it('lanza un error si no vienen precios PVPC', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ included: [respuestaRee.included[0]] }))); // Solo el grupo spot

    await expect(ree.precioMedio('2026-10-16')).rejects.toThrow('PVPC');
  });
});
