// Prueba de aceptación de la HU02 · Iniciar sesión

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  prepararBaseDatosPruebas,
  type BaseDatosPruebas,
} from '../support/base-datos-pruebas.js';
import { crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';

import { SesionService } from '../../src/usuarios/application/sesion.service.js';
import { PrismaUsuarioRepository } from '../../src/usuarios/infrastructure/prisma-usuario.repository.js';
import { PrismaSesionRepository } from '../../src/usuarios/infrastructure/prisma-sesion.repository.js';
import { Argon2Cifrador } from '../../src/usuarios/infrastructure/argon2-cifrador.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';
import { WrongPasswordException } from '../../src/usuarios/domain/excepciones.js';

describe('HU02 · Iniciar sesión', () => {
  let bd: BaseDatosPruebas;
  let cifrador: Argon2Cifrador;
  let servicio: SesionService;

  beforeAll(async () => {
    bd = await prepararBaseDatosPruebas();
  });

  beforeEach(async () => {
    await vaciarBaseDatos(bd.prisma);

    cifrador = new Argon2Cifrador();

    servicio = new SesionService(
      new PrismaUsuarioRepository(bd.prisma),
      new PrismaSesionRepository(bd.prisma),
      cifrador,
      new MemoriaRegistroProcesos(),
    );
  });

  afterAll(() => bd.cerrar());

    it('EV2.1 · con la contraseña correcta se inicia la sesión', async () => {
    // GIVEN: el usuario está registrado con la contraseña "34jUEgu@n7"
    const usuario = await crearUsuario(bd.prisma, {
        correo: 'ana.martinez@gmail.com',
        contrasenaCifrada: await cifrador.cifrar('34jUEgu@n7'),
    });

    // WHEN: inicia sesión con el correo y la contraseña correctos
    const sesion = await servicio.iniciarSesion(
        'ana.martinez@gmail.com',
        '34jUEgu@n7',
    );

    // THEN: la sesión corresponde al usuario y se ha guardado
    expect(sesion.idUsuario).toBe(usuario.id);
    expect(await bd.prisma.sesion.count()).toBe(1);
    });
    
    it('EI2.1 · con una contraseña incorrecta, WrongPasswordException', async () => {
    // GIVEN: el usuario está registrado con la contraseña "34jUEgu@n7"
    await crearUsuario(bd.prisma, {
        correo: 'ana.martinez@gmail.com',
        contrasenaCifrada: await cifrador.cifrar('34jUEgu@n7'),
    });

    // WHEN + THEN: al usar una contraseña incorrecta, lanza la excepción
    await expect(
        servicio.iniciarSesion('ana.martinez@gmail.com', '50jUEgu@n7'),
    ).rejects.toThrow(WrongPasswordException);

    // THEN: no se ha creado ninguna sesión
    expect(await bd.prisma.sesion.count()).toBe(0);
    });

});