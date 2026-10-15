//###### BLOQUE 1 ######
// Imports y datos falsos
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MineturAdaptadorCombustiblePrecio } from './minetur-precio-combustible.js';

const respuestaMinisterio = {
  ListaEESSPrecio: [
    { 'Precio Gasolina 95 E5': '1,500', 'Precio Gasoleo A': '1,400' },
    { 'Precio Gasolina 95 E5': '1,600', 'Precio Gasoleo A': '' },
  ],
};

//###### BLOQUE 2 ######
// Describe agrupa los tests y el adaptador crea una url falsa
describe('MineturAdaptadorCombustiblePrecio', () => {
  const adaptador = new MineturAdaptadorCombustiblePrecio('https://ministerio.falso');

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  //###### BLOQUE 3 ######
  // Test del camino normal
  it('devuelve la media de la provincia en €/litro', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(Response.json(respuestaMinisterio));
    vi.stubGlobal('fetch', fetchFalso);

    const precio = await adaptador.precioPorLitro('12', 'gasolina95');

    expect(fetchFalso).toHaveBeenCalledWith(
      'https://ministerio.falso/FiltroProvincia/12',
      expect.anything(),
    );
    expect(precio).toBeCloseTo(1.55);
  });

  //###### BLOQUE 4 ######
  // Ignoramos las gasolineras sin precio
  it('ignora las gasolineras que no venden ese combustible', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(respuestaMinisterio)));

    const precio = await adaptador.precioPorLitro('12', 'gasoleoA');

    expect(precio).toBeCloseTo(1.4);
  });

  //###### BLOQUE 5 ######
  // Este es el caso de error
  it('lanza un error si el Ministerio responde con un error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({}, { status: 500 })));

    await expect(adaptador.precioPorLitro('12', 'gasolina95')).rejects.toThrow('Ministerio');
  });
});
