// Este es el módulo principal de la app, que Nest carga al arrancar
// Este archivo lo ha generado automáticamente Nest menos aquello que tenga comentarios explicativos

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RutasModule } from './rutas/rutas.module.js'; //



@Module({
  imports: [RutasModule],           //Hemos añadido dentro de imports "RutasModule", que estaba vacío. Imports es la lista de modulos que forman la app.
  // Al arrancar la app Nest recorre cada módulo de la lista, crea sus proveedores (la conexión y repo) y registra sus controladores(ej. /rutas)
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
