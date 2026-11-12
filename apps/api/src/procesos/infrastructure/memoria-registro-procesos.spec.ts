// Prueba unitaria del adaptador MemoriaRegistroProcesos (sin base de datos).

// ###### BLOQUE 1 ###### Preparación
import { MemoriaRegistroProcesos } from './memoria-registro-procesos.js';

describe('MemoriaRegistroProcesos', () => {
  let registro: MemoriaRegistroProcesos;

  beforeEach(() => {
    registro = new MemoriaRegistroProcesos();     // Un registro nuevo y vacío antes de cada prueba
  });

  // ###### BLOQUE 2 ###### Pruebas

  it('sin procesos, el usuario no tiene ninguno activo', async () => {
    expect(await registro.hayProcesoActivo('ana')).toBe(false);
  });

  it('al iniciar un proceso con vehículo, el usuario y el vehículo quedan ocupados', async () => {
    await registro.iniciar('ana', 'yaris');

    expect(await registro.hayProcesoActivo('ana')).toBe(true);
    expect(await registro.vehiculoEnUso('yaris')).toBe(true);
  });

  it('un proceso sin vehículo no ocupa ningún vehículo', async () => {
    await registro.iniciar('ana');

    expect(await registro.hayProcesoActivo('ana')).toBe(true);
    expect(await registro.vehiculoEnUso('yaris')).toBe(false);
  });

  it('al terminar el proceso, el usuario y el vehículo quedan libres', async () => {
    const id = await registro.iniciar('ana', 'yaris');

    await registro.terminar(id);

    expect(await registro.hayProcesoActivo('ana')).toBe(false);
    expect(await registro.vehiculoEnUso('yaris')).toBe(false);
  });

  it('los procesos de un usuario no afectan a otro', async () => {
    await registro.iniciar('ana', 'yaris');

    expect(await registro.hayProcesoActivo('pablo')).toBe(false);
  });
});
