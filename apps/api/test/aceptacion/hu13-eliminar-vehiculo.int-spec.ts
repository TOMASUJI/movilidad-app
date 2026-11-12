// Prueba de aceptación de la HU13 · Eliminar vehículo
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js';
import { crearSesion, crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';
import { VehiculosService } from '../../src/vehiculos/application/vehiculos.service.js';
import { VehicleCurrentlyUsingException, VehicleInSavedRouteException } from '../../src/vehiculos/domain/excepciones.js';
import { MemoriaRegistroProcesos } from '../../src/procesos/infrastructure/memoria-registro-procesos.js';


describe('HU13 · Eliminar vehiculo', () => {
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

      it('EV13.1, · un usuario un usuario con sesión elimina un vehículo que no está en uso', async () => {
        // GIVEN: un usuario (ana@gmail.com) con la sesión iniciada y lista de mis vehículos es ["Toyota Yaris", "Volkswagen Polo"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'});
        const token = await crearSesion(bd.prisma, usuario.id);

        await servicio.darAlta('1234QWR', usuario.id,'Toyota', 'Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0 );
        await servicio.darAlta('5678TYP', usuario.id,'Volkswagen','Volkswagen Polo','1,0L Gasolina', 'GASOLINA', 5.2 );

        // WHEN: elimina el vehiculo (modelo:'Toyota Yaris', matricula:'1234QWR', motor:'1,5L Hibrido', consumo:'6,0')
        const vehiculo = await servicio.eliminarVehiculo('1234QWR', token);

        // THEN: el sistema elimina ese coche y la lista se queda = ["Volkswagen Polo"]
        const vehiculosRestantes = await servicio.listar(usuario.id);

        expect(vehiculosRestantes).toHaveLength(1);
        expect(vehiculosRestantes[0].matricula).toBe('5678TYP');
        expect(vehiculosRestantes[0].modelo).toBe('Volkswagen Polo');
      });

      it('EV13.2 · un usuario con sesión elimina su único vehículo', async () => {
        // GIVEN: ana@gmail.com con la sesión iniciada y un único vehículo ["Toyota Yaris"]
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const veh = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0 );

        // WHEN: elimina el vehículo (matrícula: '1234QWR')
        await servicio.eliminarVehiculo(veh.id, usuario.id);

        // THEN: el sistema lo elimina y el usuario se queda sin vehículos
        // (se comprueba con Prisma porque listar una lista vacía puede lanzar excepción)
        const total = await servicio.listar(usuario.id);
        expect(total).toBe(0);
      });

      it('EV13.3 · eliminar el vehículo predeterminado limpia la preferencia (HU26)', async () => {
        // GIVEN: ana@gmail.com con dos vehículos y "Toyota Yaris" como predeterminado
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0 , false, true);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: elimina el vehículo predeterminado
        await servicio.eliminarVehiculo('1234QWR', usuario.id);

        // THEN: el vehículo se elimina y ningún vehículo queda como predeterminado
        const vehiculosRestantes = await servicio.listar(usuario.id);

        expect(vehiculosRestantes).toHaveLength(1);
        expect(vehiculosRestantes[0].matricula).toBe('5678TYP');
        expect(vehiculosRestantes.some((v) => v.predeterminado)).toBe(false);
      });

      it('EV13.4 · un usuario con sesión elimina un vehículo favorito', async () => {
        // GIVEN: ana@gmail.com con dos vehículos y "Toyota Yaris" marcado como favorito
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0, true);
        const vehDos = await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);

        // WHEN: elimina el vehículo favorito
        await servicio.eliminarVehiculo(vehUno.id, usuario.id);

        // THEN: el sistema lo elimina y la lista se queda = ["Volkswagen Polo"]
        const vehiculosRestantes = await servicio.listar(usuario.id);

        expect(vehiculosRestantes).toHaveLength(1);
        expect(vehiculosRestantes[0].matricula).toBe('5678TYP');
        expect(vehiculosRestantes[0].modelo).toBe('Volkswagen Polo');
      });

      it('EI13.1 · Inválido: el sistema no permite eliminar un vehículo si está en uso en un cálculo', async () => {
        // GIVEN: usuario con sesión iniciada, 2 vehículos registrados y el "Toyota Yaris" está en un proceso activo
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);



        const vehUno = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0 );
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);


        // Simulamos proceso activo con 'Toyota Yaris' en uso
        const idProceso = await registro.iniciar(usuario.id, vehUno.id);

        // WHEN: usuario quiere eliminar el coche "Toyota Yaris"
        // THEN: el sistema lanza la excepción "VehicleCurrentlyUsingException" y no le deja eliminar
        await expect(servicio.eliminarVehiculo(vehUno.id, usuario.id))
            .rejects
            .toThrow(VehicleCurrentlyUsingException);

        // THEN: la lista de vehículos sigue siendo la misma = ["Toyota Yaris", "Volkswagen Polo"]
        const vehiculosRestantes = await servicio.listar(usuario.id);
        expect(vehiculosRestantes).toHaveLength(2);
    });

    it('EI13.2 · Inválido: el sistema no permite eliminar un vehículo asociado a una ruta guardada', async () => {
        // GIVEN: usuario con sesión iniciada, 2 vehículos registrados y el "Toyota Yaris" asociado a una ruta guardada
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        const yaris = await servicio.darAlta('1234QWR', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L híbrido', 'HIBRIDO', 6.0 );
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);


        const idProceso = await registro.iniciar(usuario.id, yaris.id);

        // WHEN: usuario quiere eliminar el coche "Toyota Yaris"
        // THEN: el sistema lanza la excepción "VehicleInSavedRouteException" y no le deja eliminar
        await expect(servicio.eliminarVehiculo(yaris.id, usuario.id))
            .rejects
            .toThrow(VehicleInSavedRouteException);

        // THEN: la lista de vehículos sigue siendo la misma = ["Toyota Yaris", "Volkswagen Polo"]
        const vehiculosRestantes = await servicio.listar(usuario.id);
        expect(vehiculosRestantes).toHaveLength(2);
      });
});
