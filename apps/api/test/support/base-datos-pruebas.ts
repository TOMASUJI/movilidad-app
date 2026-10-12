// Esto no es una prueba, es una herramienta que usan las pruebas.
// Qué hace este archivo:
// 1. Decide qué base de datos usar: movilidad_test o un contenedor de testcontainers.
// 2. Crea la tabla rutas.
// 3. Devuelve una conexión de primsa ya abierta y una forma de cerrar la conexión al terminar la prueba.


// ###### BLOQUE 1 ######

import { execSync } from 'node:child_process';    // execSync ejecuta un comando de la terminal y espera a que termine. Si el comando devuelve un error, lanza una excepción.
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'; // PostgreSqlContainer es la clase que crea un contenedor de PostgreSQL para pruebas.
import { PrismaPg } from '@prisma/adapter-pg';  // PrismaPg es la clase que crea una conexión de Prisma a PostgreSQL. Se usa para crear la tabla rutas.
import { PrismaClient } from '../../src/generated/prisma/client.js';  // PrismaClient es la clase que crea una conexión de Prisma a la base de datos. Se usa para abrir y cerrar la conexión.

//###### BLOQUE 2 ######
// Esto es lo que recibirá la prueba cuando pida una base de datos de pruebas.

export interface BaseDatosPruebas {
  prisma: PrismaClient;               // La conexión ya abierta y con las tablas creadas.
  cerrar(): Promise<void>;            // Un método que cierra la conexión y borra el contenedor de testcontainers si se ha usado.
}

// ##### BLOQUE 3 ######
// Elegir la base de datos.

// function es una funció suelta, no está dentro de una clase. Se puede llamar desde cualquier parte del archivo.
// async indica que dentro se usa await, que quiere decir que hay operaciones que tardan un tiempo en completarse, como abrir la conexión a la base de datos o crear el contenedor de testcontainers.

export async function prepararBaseDatosPruebas(): Promise<BaseDatosPruebas> {
  let contenedor: StartedPostgreSqlContainer | undefined;                         // let declara una variable que puede cambiar de valor. Aquí se usa para guardar el contenedor de testcontainers si se crea uno.
  let url = process.env['TEST_DATABASE_URL'];                                     // process.env contiene las variables de entorno. No lleva tipo porque typscript lo deduce (string | undefined). Si no está definida, url será undefined.

  if (!url) {                                                                     // Si la url no tiene valor:
    contenedor = await new PostgreSqlContainer('postgres:17-alpine').start();     // Crea el contenedor con PostgreSQL 17 y lo arranca. El await espera a que esté listo para aceptar conexiones,
    url = contenedor.getConnectionUri();                                          // y guarda la url de conexión en la variable url.
  }


  // ##### BLOQUE 4 ######
    execSync('npx prisma migrate deploy', {                                       // Ejecuta las migraciones de primsa/migrations sobre la base de datos de prueba.
    env: { ...process.env, DATABASE_URL: url },                                   // Son las variables de entorno con las que se ejecuta el comando.
    stdio: 'inherit',                                                             // Muestra en consola lo que escribe prisma.
  });

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });  // Abrimos la conexión de prisma.

  // Aquí devolvemos un objeto con la conexión de prisma y un método para cerrar la conexión y el contenedor si se ha creado uno.
  return {
    prisma,
    async cerrar() {
      await prisma.$disconnect();
      await contenedor?.stop();       // El valor ? indica que se ejecuta stop() solo si contenedor tiene valor.
    },
  };
}


