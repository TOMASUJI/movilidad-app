// Módulo de precios de combustible (S03).
//
// Junta las piezas de la carpeta "precios": registra el controlador y guarda,
// con la llave PRECIOS_COMBUSTIBLE, la implementación que habla con el Ministerio.
// Es el "guardarropa": el controlador pide por la llave y Nest le entrega el adaptador.



// ###### BLOQUE 1 ######
// Imports (sin "type": todo se usa al ejecutar)

import { Module } from '@nestjs/common';                                                         // El decorador @Module (como @Configuration)
import { PRECIOS_COMBUSTIBLE } from './application/ports/precios-combustible.js';                // La llave
import { MinisterioPreciosCombustible } from './infrastructure/ministerio-precios-combustible.js'; // La implementación que se guarda con esa llave
import { PreciosController } from './interface/http/precios.controller.js';                     // El controlador


// ###### BLOQUE 2 ######
// El módulo

@Module({
  controllers: [PreciosController],                        // Activa GET /api/precios/combustible
  providers: [
    {
      provide: PRECIOS_COMBUSTIBLE,                        // La llave (el "ticket")
      useFactory: () =>                                    // La receta para crear el objeto (como el cuerpo de un método @Bean)
        new MinisterioPreciosCombustible({
          baseUrl:
            process.env['CARBURANTES_BASE_URL'] ??         // Si existe la variable en el .env, se usa esa dirección...
            'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes',  // ...si no, la oficial del Ministerio
        }),
    },
  ],
})
export class PreciosModule {}                              // La clase queda vacía: todo está en la anotación
