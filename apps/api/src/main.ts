// Es el punto de entrada, lo primero que se ejecuta al arrancar la API, en java sería la clase "public static void main()"
// Este archivo también es generaddo automáticamente por Nest menos aquello que está explicado por comentarios

import 'dotenv/config';                                           // Esta línea lee .env y carga sus variables en process.env.Tiene que ser la primera línea, para que las variables ya estén cargadas cuando se ejecute todo lo demás.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');                                     // Pone /api delante de todas las URL. El controlador decía rutas, así que la URL final es /api/rutas. Así, cuando la web y la API estén en el mismo dominio, todo lo que empiece por /api va a la API y lo demás a la web.
  await app.listen(process.env.PORT ?? 3000);                     // Ya venía puesto: usa la variable PORT si existe y, si no, el 3000. El ?? significa “si lo de la izquierda está vacío, usa lo de la derecha”.
}
await bootstrap();
