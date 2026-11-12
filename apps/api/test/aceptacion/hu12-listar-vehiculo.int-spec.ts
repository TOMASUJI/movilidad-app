// Prueba de aceptación de la HU12 · Listar vehículos
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js';
import { crearSesion, crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';
import { VehiculosService } from '../../src/vehiculos/application/vehiculos.service.js';
import { NotLoggedInUserException } from '../../src/usuarios/domain/excepciones.js';
import { NoVehiclesRegisteredException } from '../../src/vehiculos/domain/excepciones.js';


describe('HU12 · Listar vehículos', () => {
    let bd: BaseDatosPruebas;
    let servicio: VehiculosService;
    beforeAll(async () => {
      bd = await prepararBaseDatosPruebas(); // Conecta con la base de datos de pruebas
      servicio =  new VehiculosService();
      });

      beforeEach(() => vaciarBaseDatos(bd.prisma)); // Cada prueba empieza con las tablas vacías
      afterAll(() => bd.cerrar());

      it('EV12.1 · un usuario con sesión ve sus vehículos', async () => {
        // GIVEN: ana@gmail.com tiene la sesión iniciada y un vehículo
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
        });

        const token = await crearSesion(bd.prisma, usuario.id);
        await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0 );


        // WHEN: pide la lista
        const lista = await servicio.listar(usuario.id);

        // THEN: aparece su vehículo
        expect(lista).toHaveLength(1);
      });

      it('EV12.2 · un usuario con varios vehículos los ve todos', async () => {
        // GIVEN: ana@gmail.com tiene la sesión iniciada y tres vehículos
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);
        await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5 L híbrido', 'HIBRIDO', 6.0 );
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2);
        await servicio.darAlta('1234BCD', usuario.id, 'Seat', 'Seat Ibiza', '1,0 L gasolina', 'GASOLINA', 5.0);
        await servicio.darAlta('9012FGH', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L gasolina', 'GASOLINA', 4.8);

        // WHEN: pide la lista
        const lista = await servicio.listar(usuario.id);

        // THEN: aparecen los tres vehículos
        expect(lista).toHaveLength(3);
      });

      it('EV12.3 · los favoritos salen primero y se indica el predeterminado', async () => {
        // GIVEN: ana@gmail.com tiene tres vehículos, dos favoritos y uno predeterminado
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);
        await servicio.darAlta('5678TYP', usuario.id, 'Volkswagen', 'Volkswagen Polo', '1,0 L gasolina', 'GASOLINA', 5.2, true);
        await servicio.darAlta('1234BCD', usuario.id, 'Seat', 'Seat Ibiza', '1,0 L gasolina', 'GASOLINA', 5.0, true);
        await servicio.darAlta('9012FGH', usuario.id, 'Toyota', 'Toyota Yaris', '1,5 L gasolina', 'GASOLINA', 4.8, false, true);


        // WHEN: pide la lista
        const lista = await servicio.listar(usuario.id);

        // THEN: los favoritos van antes que el que no lo es
        expect(lista).toHaveLength(3);
        expect(lista[0].favorito).toBe(true);
        expect(lista[1].favorito).toBe(true);
        expect(lista[2].favorito).toBe(false);

        // AND: solo 9012FGH aparece como predeterminado
        const predeterminados = lista.filter((v) => v.predeterminado);
        expect(predeterminados).toHaveLength(1);
        expect(predeterminados[0].matricula).toBe('9012FGH');
      });
      it('EI12.1 · sin sesión iniciada no puede listar', async () => {
        await expect(servicio.listar('token-que-no-existe')).rejects.toThrow(NotLoggedInUserException);
      });

      it('EI12.2 · un usuario sin vehículos registrados no obtiene lista', async () => {
        // GIVEN: ana@gmail.com tiene la sesión iniciada pero ningún vehículo
        const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com' });
        const token = await crearSesion(bd.prisma, usuario.id);

        // WHEN / THEN: al pedir la lista se rechaza
        await expect(servicio.listar(usuario.id)).rejects.toThrow(NoVehiclesRegisteredException);
      });

    });
