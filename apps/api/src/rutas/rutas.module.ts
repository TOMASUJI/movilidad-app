// Módulo de rutas
// Es el archivo que jutna todas las piezas de la carpeta rutas, le dice a Nest qué controladores hay y qué objetos tiene que crear y con qué llave guardarlos.

//###### BLOQUE 1 ######

import { Module } from '@nestjs/common';                                              // Module indica que es un archivo de configuración
import { PrismaPg } from '@prisma/adapter-pg';                                        // Para crear la conexión con la base de datos
import { PrismaClient } from '../generated/prisma/client.js';
import { RUTA_REPOSITORY } from './application/ports/ruta.repository.js';             // La llave con la que se guarda el repositorio (interfaz que desaparece al compilar)
import { PrismaRutaRepository } from './infrastructure/prisma-ruta.repository.js';    // La implementación que se guarda con la llave
import { RutasController } from './interface/http/rutas.controller.js';               // El controlador de rutas (resuelve las peticiones http)


//###### BLOQUE 2 ######
// A revisar lo de dentro de los proveedores, no lo he entendido muy bien

@Module({                                                                             // El @Module que indica configuración
  controllers: [RutasController],                                                     // Registra el controlador, así nest sabe que tiene que atender /rutas
  providers: [                                                                        // Es la lista que nest tiene que crear y guardar
    //Proveedor 1, la conexión
    {
      provide: PrismaClient,
      useFactory: () =>
        new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }) }),
    },
    //Proveedor 2, el repositorio
    {
      provide: RUTA_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new PrismaRutaRepository(prisma),
      inject: [PrismaClient],
    },
  ],
})
export class RutasModule {}



