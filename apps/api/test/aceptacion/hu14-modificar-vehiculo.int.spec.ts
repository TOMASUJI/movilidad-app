// Prueba de aceptación de la HU14 · Modificar vehículo
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js';
import { crearSesion, crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';
import { VehiculosService } from '../../src/vehiculos/application/vehiculos.service.js';
import {
  LicensePlateChangeException,
  ConsumptionInvalidException,
  EngineTypeInvalidException,
  VehicleCurrentlyUsingException,
} from '../../src/vehiculos/domain/excepciones.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';


describe('HU14 · Modificar vehículo', () => {
    let bd: BaseDatosPruebas;
    let servicio: VehiculosService;
    let registro: MemoriaRegistroProcesos;
    beforeAll(async () => {
      bd = await prepararBaseDatosPruebas(); // Conecta con la base de datos de pruebas
      registro = new MemoriaRegistroProcesos();
      servicio = new VehiculosService();
      });

      beforeEach(() => vaciarBaseDatos(bd.prisma)); // Cada prueba empieza con las tablas vacías
      afterAll(() => bd.cerrar());

      it('EV14.1 · un usuario con sesión modifica el consumo de un vehículo', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: edita el consumo del "Toyota Yaris" a 7,0
        await servicio.modificarVehiculo('1234QWR', usuario.id, { consumo: 7.0 });

        // THEN: el sistema actualiza el dato y el resto queda igual
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');

        expect(yaris?.consumo).toBe(7.0);
        expect(yaris?.modelo).toBe('Toyota Yaris');
        expect(vehiculos).toHaveLength(2);
      });

      it('EV14.2 · un usuario con sesión cambia el nombre de un vehículo', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: cambia el nombre del "Toyota Yaris" a "Toyota Yaris Cross"
        await servicio.modificarVehiculo('1234QWR', usuario.id, { modelo: 'Toyota Yaris Cross' });

        // THEN: el sistema actualiza el nombre
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');

        expect(yaris?.modelo).toBe('Toyota Yaris Cross');
        expect(yaris?.consumo).toBe(6.0);
      });

      it('EV14.3 · un usuario con sesión cambia el tipo de motor de un vehículo', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: cambia el motor del "Toyota Yaris" a "1,5 L gasolina" (combustible GASOLINA)
        await servicio.modificarVehiculo('1234QWR', usuario.id, {
          motor: '1,5 L gasolina',
          combustible: 'GASOLINA',
        });

        // THEN: el sistema actualiza el tipo de motor
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');

        expect(yaris?.motor).toBe('1,5 L gasolina');
        expect(yaris?.tipoCombustible).toBe('GASOLINA');
      });

      it('EI14.1 · Inválido: el sistema no permite cambiar la matrícula, dato no modificable', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: intenta cambiar la matrícula del "Toyota Yaris" a "4564TWR"
        // THEN: el sistema lanza la excepción "LicensePlateChangeException" y no le deja cambiarla
        await expect(servicio.modificarVehiculo(vehUno.id , usuario.id, { matricula: '4564TWR' }))
            .rejects
            .toThrow(LicensePlateChangeException);

        // THEN: la matrícula sigue siendo la original
        const vehiculos = await servicio.listar(usuario.id);
        expect(vehiculos.map((v) => v.matricula)).toContain('1234QWR');
        expect(vehiculos.map((v) => v.matricula)).not.toContain('4564TWR');
      });

      it('EI14.2a · Inválido: el sistema no permite un consumo negativo o cero', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        const vehDos = await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: intenta poner el consumo del "Toyota Yaris" a -1
        // THEN: el sistema lanza la excepción "ConsumptionInvalidException"
        await expect(servicio.modificarVehiculo(vehUno.id, usuario.id, { consumo: -1 }))
            .rejects
            .toThrow(ConsumptionInvalidException);

        // THEN: el consumo sigue siendo el original
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');
        expect(yaris?.consumo).toBe(6.0);
      });

      it('EI14.2b · Inválido: el sistema no permite un consumo negativo o cero', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        const vehDos = await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: intenta poner el consumo del "Toyota Yaris" a 0
        // THEN: el sistema lanza la excepción "ConsumptionInvalidException"
        await expect(servicio.modificarVehiculo('1234QWR', usuario.id, { consumo: 0 }))
            .rejects
            .toThrow(ConsumptionInvalidException);

        // THEN: el consumo sigue siendo el original
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');
        expect(yaris?.consumo).toBe(6.0);
      });

      it('EI14.3 · Inválido: el sistema no permite un consumo no numérico', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: intenta poner el consumo del "Toyota Yaris" a "abc"
        // THEN: el sistema lanza la excepción "ConsumptionInvalidException"
        await expect(servicio.modificarVehiculo(vehUno.id, usuario.id, { consumo: 'abc' as unknown as number }))
            .rejects
            .toThrow(ConsumptionInvalidException);

        // THEN: el consumo sigue siendo el original
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');
        expect(yaris?.consumo).toBe(6.0);
      });

      it('EI14.4 · Inválido: el sistema no permite un tipo de motor inexistente', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y lista de vehículos = ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: intenta cambiar el combustible del "Toyota Yaris" a "PLUTONIO"
        // THEN: el sistema lanza la excepción "EngineTypeInvalidException"
        await expect(servicio.modificarVehiculo(vehUno.id , usuario.id, { combustible: 'PLUTONIO' }))
            .rejects
            .toThrow(EngineTypeInvalidException);

        // THEN: el combustible sigue siendo el original
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');
        expect(yaris?.tipoCombustible).toBe('HIBRIDO');
      });

      it('EI14.5 · Inválido: el sistema no permite modificar un vehículo en uso en un cálculo', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada, 2 vehículos y el "Toyota Yaris" en un proceso activo
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L diesel', 'DIESEL', 6.0);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // Simulamos proceso activo con 'Toyota Yaris' en uso
        const idProceso = await registro.iniciar(usuario.id, vehUno.id);

        // WHEN: intenta modificar el consumo del "Toyota Yaris" a 7,0
        // THEN: el sistema lanza la excepción "VehicleCurrentlyUsingException" y no le deja modificar
        await expect(servicio.modificarVehiculo(vehUno.id, usuario.id, { consumo: 7.0 }))
            .rejects
            .toThrow(VehicleCurrentlyUsingException);

        // THEN: el consumo sigue siendo el original
        const vehiculos = await servicio.listar(usuario.id);
        const yaris = vehiculos.find((v) => v.matricula === '1234QWR');
        expect(yaris?.consumo).toBe(6.0);
      });

});
