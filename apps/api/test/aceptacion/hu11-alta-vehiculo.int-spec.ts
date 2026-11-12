// Prueba de aceptación de la HU11 · Alta vehiculo
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepararBaseDatosPruebas, type BaseDatosPruebas } from '../support/base-datos-pruebas.js';
import { crearSesion, crearUsuario, vaciarBaseDatos } from '../support/datos-pruebas.js';
import { VehiculosService } from '../../src/vehiculos/application/vehiculos.service.js';
import { CarAlreadyAddedException, LicensePlateInvalidException, FuelConsumptionInvalidException, CarModelMissingException } from '../../src/vehiculos/domain/excepciones.js';


describe('HU11 · Alta vehiculo', () => {
    let bd: BaseDatosPruebas;
    let servicio: VehiculosService;
    beforeAll(async () => {
      bd = await prepararBaseDatosPruebas(); // Conecta con la base de datos de pruebas
      servicio =  new VehiculosService();
    });

    beforeEach(() => vaciarBaseDatos(bd.prisma)); // Cada prueba empieza con las tablas vacías
    afterAll(() => bd.cerrar());

    it('EV11.1, · un usuario con sesión da de alta su vehiculo, habiendo dado de alta anteriormente', async () => {
      // GIVEN: un usuario (ana@gmail.com) con la sesión iniciada y  existen vehículos registrados
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);
      await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );


      // WHEN: da de alta el vehiculo ('Volkswagen','Volkswagen Polo','1,0 L gasolina', consumo:'5,2')
      const vehiculo = await servicio.darAlta('5678TYP', usuario.id,'Volkswagen','Volkswagen Polo','1,0 L gasolina', 'GASOLINA', 5.2 );

      // THEN: se inserta su vehiculo correctamente
      expect(vehiculo).not.toBeNull();

      const total = await bd.prisma.vehiculo.count({ where: { idUsuario: usuario.id } });
      expect(total).toBe(2);
    });

    it('EV11.2, · un usuario con sesión da de alta su vehiculo, sin haber dado de alta anteriormente', async () => {
      // GIVEN: un usuario (ana@gmail.com) con la sesión iniciada y no existen vehículos registrados
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);

      // WHEN: da de alta el vehiculo (modelo:'Toyota Yaris', matricula:'1234QWR', motor:'1,5L Diesel', consumo:'6,0')
      const vehiculo = await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );

      // THEN: se inserta su vehiculo correctamente
      expect(vehiculo).not.toBeNull();
    });

    it('EV11.3, · un usuario con sesión da de alta su vehiculo, habiendo dado de alta anteriormente un mismo modelo con distinta matrícula', async () => {
      // GIVEN: un usuario (ana@gmail.com) con la sesión iniciada y  existen vehículos registrados
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);
      await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );


      // WHEN: da de alta el vehiculo (modelo:'Toyota Yaris', matricula:'1234QWR', motor:'1,5L Diesel', consumo:'6,0')
      const vehiculo = await servicio.darAlta('5678TYP', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );

      // THEN: se inserta su vehiculo correctamente
      expect(vehiculo).not.toBeNull();

      const total = await bd.prisma.vehiculo.count({ where: { idUsuario: usuario.id } });
      expect(total).toBe(2);
    });

    it('EV11.3, · un usuario con sesión da de alta su vehiculo, habiendo dado de alta anteriormente un mismo modelo con distinta matrícula', async () => {
      // GIVEN: un usuario (ana@gmail.com) con la sesión iniciada y  existen vehículos registrados
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);
      await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );


      // WHEN: da de alta el vehiculo (modelo:'Toyota Yaris', matricula:'1234QWR', motor:'1,5L Diesel', consumo:'6,0')
      const vehiculo = await servicio.darAlta('5678TYP', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );

      // THEN: se inserta su vehiculo correctamente
      expect(vehiculo).not.toBeNull();

      const total = await bd.prisma.vehiculo.count({ where: { idUsuario: usuario.id } });
      expect(total).toBe(2);
    });

    it('EV11.4, · un usuario con sesión da de alta su vehiculo, habiendo dado de alta anteriormente un mismo modelo con distinta matrícula', async () => {
      // GIVEN: un usuario (ana@gmail.com) con la sesión iniciada ha dado de alta el vehiculo (modelo:'Toyota Yaris', matricula:'1234QWR', motor:'1,5L Hibrido', consumo:'6,0')
      // y  otro usuario (manolo@gmail.com) con sesión iniciada
      const usuario1 = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });
      const usuario2 = await crearUsuario(bd.prisma, { correo: 'manolo@gmail.com'});

      const token1 = await crearSesion(bd.prisma, usuario1.id);
      const token2 = await crearSesion(bd.prisma, usuario2.id);
      await servicio.darAlta('1234QWR', usuario1.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );


      // WHEN: da de alta el vehiculo (modelo:'Toyota Yaris', matricula:'1234QWR', motor:'1,5L Diesel', consumo:'6,0')
      const vehiculo = await servicio.darAlta('1234QWR', usuario2.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );

      // THEN: se inserta su vehiculo correctamente
      expect(vehiculo).not.toBeNull();
    });


    it('EI11.1 · vehículo duplicado exacto ', async () => {
      // GIVEN:  usuario habiendo iniciado sesión y
      // su lista de vehículos= [“Toyota Yaris” (“1234QWR”, “1,5 L Diesel",”6,0”) ]
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);


      const vehiculoPr = await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );

      //WHEN: el usuario añade otro vehículo con los datos[“Toyota Yaris”(“1234QWR”, “1,5 L Diesel”,”6,0”) ]
      //THEN: no deja añadirlo y salta la excepción
      await expect(servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 )).rejects.toThrow(CarAlreadyAddedException);
    });

    it('EI11.2 · matrícula con formato inválido', async () => {
      // GIVEN:  usuario habiendo iniciado sesión y
      // su lista de vehículos está vacía
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);

      //WHEN: el usuario añade un vehículo con los datos[“Toyota Yaris”(“1234QWRH”, “1,5 L Diesel”,”6,0”) ]
      //THEN: no deja dar de alta y salta la excepción LicensePlateInvalidException
      await expect(servicio.darAlta('1234QWRH', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 )).rejects.toThrow(LicensePlateInvalidException);
    });

    it('EI11.3 · consumo negativo o cero', async () => {
      // GIVEN:  usuario habiendo iniciado sesión y
      // su lista de vehículos está vacía
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);

      //WHEN: el usuario añade un vehículo con los datos[“Toyota Yaris”(“1234QWR”, “1,5 L Diesel”,”-10”) ]
      //THEN: no deja dar de alta y salta la excepción LicensePlateInvalidException
      await expect(servicio.darAlta('1234QWRH', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', -10 )).rejects.toThrow(FuelConsumptionInvalidException);
    });

    it('EI11.4 · dos vehículos con misma matrícula, pero datos distintos', async () => {
      // GIVEN:  usuario habiendo iniciado sesión y
      // su lista de vehículos= [“Toyota Yaris” (“1234QWR”, “1,5 L híbrido”,”6,0”) ]
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);


      const vehiculoPr = await servicio.darAlta('1234QWR', usuario.id,'Toyota','Toyota Yaris','1,5L Diesel', 'DIESEL', 6.0 );

      //WHEN: el usuario añade otro vehículo con los datos[Volskwagen Polo”(“1234QWR”, “1,0 L Gasolina”,”6,0”) ]
      //THEN: no deja añadirlo y salta la excepción
      await expect(servicio.darAlta('1234QWR', usuario.id,'Volskwagen','Volskwagen Polo','1,0L Gasolina', 'GASOLINA', 5.2 )).rejects.toThrow(CarAlreadyAddedException);
    });

    it('EI11.5 · marca o modelo vacío', async () => {
      // GIVEN:  usuario habiendo iniciado sesión y
      // su lista de vehículos está vacía
      const usuario = await crearUsuario(bd.prisma, { correo: 'ana@gmail.com'
      });

      const token = await crearSesion(bd.prisma, usuario.id);

      //WHEN: el usuario añade un vehículo con los datos[“”(“1234QWRH”, “1,5 L Diesel”,”6,0”) ]
      //THEN: no deja dar de alta y salta la excepción LicensePlateInvalidException
      await expect(servicio.darAlta('1234QWRH', usuario.id,'Toyota','','1,5L Diesel', 'DIESEL', 6.0 )).rejects.toThrow(CarModelMissingException);
    });


  });
