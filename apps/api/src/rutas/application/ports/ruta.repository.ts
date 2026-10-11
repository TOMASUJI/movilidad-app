// Info: Un puerto es el nombre que da la arquitectura hexagonal a una interfaz con la que
// la app dice qué necesita del exterior, sin decir como se consigue.
// Aquí lo que necestia es guardar y leer rutas. El cómo (Prisma y PostgreSQL) se pone en el adaptador, que es la clase que implementa esta interfaz.

// ###### BLOQUE 1 ######
// Estamos importando NuevaRuta y Ruta desde el archivo ruta.ts, que están en la carpeta domain con el modificador export.
// tenemos que inddicar la ruta desde la que importamos, que es ../../domain/ruta.js.
// type avisa de que solo se importan tipos, no código que se ejecute.
// el .js es porque la importación se resuelve cuando el archivo ya está compilado a JavaScript, y el archivo compilado se llama ruta.js.

import type { NuevaRuta, Ruta } from '../../domain/ruta.js';

// ###### BLOQUE 2 ######
// Esto es igual que en java: una interfaz con tres métodos sin cuerpo, que se implementarán en la clase adaptadora.
// Promise<Ruta> significa que el método devuelve una promesa, ya que el resultado llegará mas tarde, cuando la base de datos responda.
// Mientras espera, el servidor no se queda bloqueado: atiende otras peticiones.

export interface RutaRepository {
  guardar(ruta: NuevaRuta): Promise<Ruta>;        // El método guardar recibe una NuevaRuta (sin ID ni fecha de creación) y devuelve una Ruta.
  listar(): Promise<Ruta[]>;                      // El método listar no recibe nada y devuelve todas las rutas guardadas en una lista "Ruta[]".
  buscarPorId(id: string): Promise<Ruta | null>;  // El método buscarPorId recibe un id y devuelve la Ruta con ese id, o null si no existe.
}

// ###### BLOQUE 3 ######
// Esta última línea aún no la entiendo, en principio es porque NestJS al compilar borra las interfaces al compilar, y necesitamos un identificador para inyectar la
// clase adaptadora que implementa esta interfaz. Es el equivalente a "public static final Object RUTA_REPOSITORY = new Object()" en java.

export const RUTA_REPOSITORY = Symbol('RUTA_REPOSITORY');
