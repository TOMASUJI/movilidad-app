// Prueba de aceptación de la HU01 · Registrarse

// ###### BLOQUE 1 ###### Imports
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js';
import { crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';
import { UsuariosService } from '../../src/usuarios/application/usuarios.service.js';
import { SesionService } from '../../src/usuarios/application/sesion.service.js';
import { PrismaUsuarioRepository } from '../../src/usuarios/infrastructure/prisma-usuario.repository.js';
import { PrismaSesionRepository } from '../../src/usuarios/infrastructure/prisma-sesion.repository.js';
import { Argon2Cifrador } from '../../src/usuarios/infrastructure/argon2-cifrador.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';
import { UserExistsAlreadyException } from '../../src/usuarios/domain/excepciones.js';


describe('HU01 · Registrarse', () => {
  // ###### BLOQUE 2 ###### Preparación
  let bd: BaseDatosPruebas;
  let servicio: UsuariosService;

  beforeAll(async () => {
    bd = await prepararBaseDatosPruebas();               // Conecta con la base de datos de pruebas (una vez)
  });

  beforeEach(async () => {
    await vaciarBaseDatos(bd.prisma);                    // Cada prueba empieza con las tablas vacías
    const usuarios = new PrismaUsuarioRepository(bd.prisma);
    const cifrador = new Argon2Cifrador();
    const sesion = new SesionService(usuarios, new PrismaSesionRepository(bd.prisma), cifrador, new MemoriaRegistroProcesos());
    servicio = new UsuariosService(usuarios, cifrador, sesion);
  });

  afterAll(() => bd.cerrar());                           // Cierra la conexión al terminar

  // ###### BLOQUE 3 ###### Ayuda: la lista de correos registrados, en orden de alta
  const correosRegistrados = async () => (await bd.prisma.usuario.findMany({ orderBy: { creadoEn: 'asc' } })).map((u) => u.correo);

  // ###### BLOQUE 4 ###### Escenarios
  it('EV1.1 · con un correo nuevo se registra el usuario', async () => {
    // GIVEN: los correos registrados son ["test@gmail.com"]
    await crearUsuario(bd.prisma, { correo: 'test@gmail.com' });

    // WHEN: se da de alta con "ana.martinez@gmail.com" y "34jUEgu@n7"
    const usuario = await servicio.registrar('ana.martinez@gmail.com', '34jUEgu@n7');

    // THEN: confirma el registro y la lista queda ["test@gmail.com", "ana.martinez@gmail.com"]
    expect(usuario.correo).toBe('ana.martinez@gmail.com');
    expect(await correosRegistrados()).toEqual(['test@gmail.com', 'ana.martinez@gmail.com']);
  });

  it('EI1.1 · con un correo ya registrado, UserExistsAlreadyException', async () => {
    // GIVEN: los correos registrados son ["test@gmail.com"]
    await crearUsuario(bd.prisma, { correo: 'test@gmail.com' });

    // WHEN + THEN: al darse de alta con "test@gmail.com" salta la excepción...
    await expect(servicio.registrar('test@gmail.com', '34jUEgu@n7'))
      .rejects.toThrow(UserExistsAlreadyException);

    // ...y la lista sigue siendo ["test@gmail.com"]
    expect(await correosRegistrados()).toEqual(['test@gmail.com']);
  });

});
