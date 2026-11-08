// Prueba de aceptación de la HU03 · Modificar los datos de la cuenta

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
import { UsuariosService } from '../../src/usuarios/application/usuarios.service.js';
import { SesionService } from '../../src/usuarios/application/sesion.service.js';
import { PrismaUsuarioRepository } from '../../src/usuarios/infrastructure/prisma-usuario.repository.js';
import { PrismaSesionRepository } from '../../src/usuarios/infrastructure/prisma-sesion.repository.js';
import { Argon2Cifrador } from '../../src/usuarios/infrastructure/argon2-cifrador.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';
import { WrongModificationException } from '../../src/usuarios/domain/excepciones.js';

describe('HU03 · Modificar los datos de la cuenta', () => {
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
    const sesion = new SesionService(
      usuarios,
      new PrismaSesionRepository(bd.prisma),
      cifrador,
      new MemoriaRegistroProcesos(),
    );
    servicio = new UsuariosService(usuarios, cifrador, sesion);
  });

  afterAll(() => bd.cerrar());

  // ###### BLOQUE 3 ###### Ayudas
  // GIVEN común: Ana Martínez, con teléfono "+34 555 33 22 12" y la sesión iniciada
  const anaConSesion = async () => {
    const usuario = await crearUsuario(bd.prisma, {
      correo: 'ana.martinez@gmail.com',
      nombre: 'Ana Martínez',
      telefono: '+34 555 33 22 12',
    });
    const token = await crearSesion(bd.prisma, usuario.id);
    return { usuario, token };
  };

  // El teléfono que hay guardado ahora mismo en la base de datos
  const telefonoGuardado = async (idUsuario: string) =>
    (await bd.prisma.usuario.findUnique({ where: { id: idUsuario } }))
      ?.telefono;

  // ###### BLOQUE 4 ###### Escenarios
  it('EV3.1 · con un teléfono válido se actualiza el dato', async () => {
    // GIVEN: Ana Martínez, con el teléfono "+34 555 33 22 12", ha iniciado sesión
    const { usuario, token } = await anaConSesion();

    // WHEN: se modifica el teléfono a "+34 578 32 45 21"
    const actualizado = await servicio.modificar(token, {
      telefono: '+34 578 32 45 21',
    });

    // THEN: confirma la actualización y el teléfono pasa a ser "+34 578 32 45 21"
    expect(actualizado.telefono).toBe('+34 578 32 45 21');
    expect(await telefonoGuardado(usuario.id)).toBe('+34 578 32 45 21');
  });

  it('EI3.1 · con un teléfono de 10 dígitos, WrongModificationException', async () => {
    // GIVEN: Ana Martínez, con el teléfono "+34 555 33 22 12", ha iniciado sesión
    const { usuario, token } = await anaConSesion();

    // WHEN + THEN: al modificar el teléfono a "+34 578 32 45 214" salta la excepción...
    await expect(
      servicio.modificar(token, { telefono: '+34 578 32 45 214' }),
    ).rejects.toThrow(WrongModificationException);

    // ...y el dato no se actualiza
    expect(await telefonoGuardado(usuario.id)).toBe('+34 555 33 22 12');
  });
});
