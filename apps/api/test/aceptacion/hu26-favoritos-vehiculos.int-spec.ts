// Prueba de aceptación de la HU26 · Favoritos de vehículos

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

import { VehiculosService } from '../../src/vehiculos/application/vehiculos.service.js';

import { FavoriteLimitExceededException } from '../../src/vehiculos/domain/excepciones.js';

describe('HU26 · Favoritos de vehículos', () => {
  let bd: BaseDatosPruebas;
  let servicio: VehiculosService;

  beforeAll(async () => {
    bd = await prepararBaseDatosPruebas();
    servicio = new VehiculosService();
  });

  beforeEach(() => vaciarBaseDatos(bd.prisma));

  afterAll(() => bd.cerrar());

  it('EV26.1 · marcar un vehículo como favorito', async () => {
    // GIVEN: sesión iniciada y vehículos = ["Toyota Yaris", "Volkswagen Polo"], ninguno favorito
    const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
    const token = await crearSesion(bd.prisma, usuario.id);

    await bd.prisma.vehiculo.create({
      data: {
        idUsuario: usuario.id,
        nombre: 'Toyota Yaris',
        matricula: '1234QWR',
        motor: '1,5 L híbrido',
        tipoMotor: 'HIBRIDO',
        consumo: 6.0,
      },
    });

    const polo = await bd.prisma.vehiculo.create({
      data: {
        idUsuario: usuario.id,
        nombre: 'Volkswagen Polo',
        matricula: '5678TYP',
        motor: '1,0 L gasolina',
        tipoMotor: 'GASOLINA',
        consumo: 5.2,
      },
    });

    // WHEN: marca "Volkswagen Polo" como favorito
    await servicio.marcarFavorito(token, polo.id);

    // THEN: "Volkswagen Polo" queda como favorito y "Toyota Yaris" no
    const favoritos = await bd.prisma.vehiculo.findMany({
      where: {
        idUsuario: usuario.id,
        favorito: true,
      },
    });

    expect(favoritos.map((v) => v.nombre)).toEqual(['Volkswagen Polo']);
  });

   it('EI26.1 · con cinco favoritos, FavoriteLimitExceededException y el Golf no cambia', async () => {
    // GIVEN: usuario con sesión iniciada y cinco vehículos ya favoritos
    const usuario = await crearUsuario(bd.prisma, {
      correo: 'ana.martinez@gmail.com',
    });
    await crearSesion(bd.prisma, usuario.id);

    // El escenario no especifica los datos de los cinco favoritos existentes.
    await bd.prisma.vehiculo.createMany({
      data: Array.from({ length: 5 }, (_, indice) => ({
        idUsuario: usuario.id,
        nombre: `Vehículo favorito ${indice + 1}`,
        matricula: `${1000 + indice}BCD`,
        motor: '1,0 L gasolina',
        tipoMotor: 'GASOLINA' as const,
        consumo: 5.2,
        favorito: true,
      })),
    });
    const golf = await bd.prisma.vehiculo.create({
      data: {
        idUsuario: usuario.id,
        nombre: 'Volkswagen Golf',
        matricula: '9012BCD',
        motor: '1,5 L gasolina',
        tipoMotor: 'GASOLINA',
        consumo: 6.0,
        favorito: false,
      },
    });

    // WHEN + THEN: al intentar marcar el Golf, se rechaza por superar el límite
    // La función async permite comprobar tanto errores síncronos como promesas rechazadas.
    await expect(async () => {
      await servicio.marcarFavorito(golf.id, usuario.id);
    }).rejects.toThrow(FavoriteLimitExceededException);

    // THEN: el Golf no se marca y se conservan los cinco favoritos existentes
    expect(
      await bd.prisma.vehiculo.findUnique({ where: { id: golf.id } }),
    ).toEqual(golf);
    expect(
      await bd.prisma.vehiculo.count({
        where: { idUsuario: usuario.id, favorito: true },
      }),
    ).toBe(5);
  });
});