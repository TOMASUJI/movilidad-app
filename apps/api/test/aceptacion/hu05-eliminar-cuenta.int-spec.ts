// Prueba de aceptación de la HU05 · Eliminar la cuenta

// ###### BLOQUE 1 ###### Imports
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js';
import { crearSesion, crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';
import { UsuariosService } from '../../src/usuarios/application/usuarios.service.js';
import { SesionService } from '../../src/usuarios/application/sesion.service.js';
import { PrismaUsuarioRepository } from '../../src/usuarios/infrastructure/prisma-usuario.repository.js';
import { PrismaSesionRepository } from '../../src/usuarios/infrastructure/prisma-sesion.repository.js';
import { Argon2Cifrador } from '../../src/usuarios/infrastructure/argon2-cifrador.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';
import { NotLoggedInUserException } from '../../src/usuarios/domain/excepciones.js';

describe('HU05 · Eliminar la cuenta', () => {
  // ###### BLOQUE 2 ###### Preparación
  let bd: BaseDatosPruebas;
  let servicio: UsuariosService;

  beforeAll(async () => {
    bd = await prepararBaseDatosPruebas();
  });

  beforeEach(async () => {
    await vaciarBaseDatos(bd.prisma);
    const usuarios = new PrismaUsuarioRepository(bd.prisma);
    const cifrador = new Argon2Cifrador();
    const sesion = new SesionService(usuarios, new PrismaSesionRepository(bd.prisma), cifrador, new MemoriaRegistroProcesos());
    servicio = new UsuariosService(usuarios, cifrador, sesion);
  });

  afterAll(() => bd.cerrar());

    // ###### BLOQUE 3 ###### Ayuda: ¿existe todavía la cuenta de ese correo?
  const cuentaExiste = async (correo: string) =>
    (await bd.prisma.usuario.findUnique({ where: { correo } })) !== null;

    // ###### BLOQUE 4 ###### Escenarios
  it('EV5 · con la sesión iniciada, se elimina la cuenta', async () => {
    // GIVEN: la cuenta "ana.martinez@gmail.com" existe y tiene la sesión iniciada
    const usuario = await crearUsuario(bd.prisma, { correo: 'ana.martinez@gmail.com' });
    const token = await crearSesion(bd.prisma, usuario.id);

    // WHEN: decide eliminar su cuenta
    await servicio.eliminarCuenta(token);

    // THEN: la cuenta asociada a "ana.martinez@gmail.com" se ha eliminado
    expect(await cuentaExiste('ana.martinez@gmail.com')).toBe(false);
  });

    it('EI5 · sin la sesión iniciada, NotLoggedInUserException', async () => {
    // GIVEN: la cuenta "ana.martinez@gmail.com" existe, pero no tiene la sesión iniciada
    await crearUsuario(bd.prisma, { correo: 'ana.martinez@gmail.com' });

    // WHEN + THEN: al intentar eliminarla con un token que no es de ninguna sesión, salta la excepción...
    await expect(servicio.eliminarCuenta('token-sin-sesion'))
      .rejects.toThrow(NotLoggedInUserException);

    // ...y la cuenta no se elimina
    expect(await cuentaExiste('ana.martinez@gmail.com')).toBe(true);
  });
});

