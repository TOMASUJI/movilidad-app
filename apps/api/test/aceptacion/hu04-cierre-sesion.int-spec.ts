// Prueba de aceptación de la HU04 · Cerrar sesión

// ###### BLOQUE 1 ###### Imports
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  prepararBaseDatosPruebas,
  type BaseDatosPruebas,
} from '../support/base-datos-pruebas.js';
import {
  crearSesion,
  crearUsuario,
  vaciarBaseDatos,
} from '../support/datos-pruebas.js';

import { SesionService } from '../../src/usuarios/application/sesion.service.js';
import { PrismaUsuarioRepository } from '../../src/usuarios/infrastructure/prisma-usuario.repository.js';
import { PrismaSesionRepository } from '../../src/usuarios/infrastructure/prisma-sesion.repository.js';
import { Argon2Cifrador } from '../../src/usuarios/infrastructure/argon2-cifrador.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';
import { InProgressProcessException } from '../../src/usuarios/domain/excepciones.js';

describe('HU04 · Cerrar sesión', () => {
  // ###### BLOQUE 2 ###### Preparación
  let bd: BaseDatosPruebas;
  let procesos: MemoriaRegistroProcesos;
  let servicio: SesionService;

  beforeAll(async () => {
    bd = await prepararBaseDatosPruebas();
  });

  beforeEach(async () => {
    await vaciarBaseDatos(bd.prisma);

    procesos = new MemoriaRegistroProcesos();

    servicio = new SesionService(
      new PrismaUsuarioRepository(bd.prisma),
      new PrismaSesionRepository(bd.prisma),
      new Argon2Cifrador(),
      procesos,
    );
  });

  afterAll(() => bd.cerrar());

  // ###### BLOQUE 3 ###### Escenarios
  it('EV4.1 · sin procesos en ejecución, se cierra la sesión', async () => {
    // GIVEN: el usuario ha iniciado sesión y no hay procesos en ejecución
    const usuario = await crearUsuario(bd.prisma, {
      correo: 'ana.martinez@gmail.com',
    });
    const token = await crearSesion(bd.prisma, usuario.id);

    // WHEN: decide cerrar sesión
    await servicio.cerrarSesion(token);

    // THEN: la sesión ya no existe
    expect(await bd.prisma.sesion.findUnique({ where: { token } })).toBeNull();
  });

  it('EI4.1 · con un proceso en ejecución, InProgressProcessException', async () => {
    // GIVEN: el usuario ha iniciado sesión y tiene un proceso en ejecución
    const usuario = await crearUsuario(bd.prisma, {
      correo: 'ana.martinez@gmail.com',
    });
    const token = await crearSesion(bd.prisma, usuario.id);
    await procesos.iniciar(usuario.id);

    // WHEN + THEN: al intentar cerrar sesión, lanza la excepción
    await expect(servicio.cerrarSesion(token)).rejects.toThrow(
      InProgressProcessException,
    );

    // THEN: la sesión sigue abierta
    expect(
      await bd.prisma.sesion.findUnique({ where: { token } }),
    ).not.toBeNull();
  });
});
