// Ayudas para preparar los GIVEN de las pruebas de aceptación.
// Meten datos DIRECTAMENTE en la base de datos con Prisma, sin pasar por los servicios,
// para que una prueba no dependa de que otras historias estén ya programadas.

// ###### BLOQUE 1 ###### Imports y vaciar la base de datos
import { randomUUID } from 'node:crypto';                                    // Generador de textos aleatorios únicos (para los tokens)
import type { PrismaClient } from '../../src/generated/prisma/client.js';   // El cliente que generó Prisma con nuestro esquema

// Deja las tablas vacías. Se llama antes de CADA prueba, para que todas empiecen igual.

export async function vaciarBaseDatos(prisma: PrismaClient): Promise<void> {
  await prisma.vehiculo.deleteMany();      // Primero las tablas que dependen de usuarios…
  await prisma.sesion.deleteMany();
  await prisma.usuario.deleteMany();       // …y al final los usuarios
}

// ###### BLOQUE 2 ###### Crear un usuario
interface DatosUsuarioPrueba {
  correo: string;
  contrasenaCifrada?: string;   // Opcional: si la prueba no comprueba contraseñas, da igual cuál sea
  nombre?: string;
  telefono?: string;            // Opcional: lo necesita la HU03
}

// Mete un usuario en la tabla "usuarios" y lo devuelve (con el id que le ha puesto la base de datos)
export async function crearUsuario(prisma: PrismaClient, datos: DatosUsuarioPrueba) {
  return prisma.usuario.create({
    data: {
      correo: datos.correo,
      contrasenaCifrada: datos.contrasenaCifrada ?? 'hash-de-prueba',   // Si no se indica, un texto cualquiera
      nombre: datos.nombre ?? null,                                      // Si no se indica, sin nombre
      telefono: datos.telefono ?? null,                                  // Si no se indica, sin teléfono
    },
  });
}

// ###### BLOQUE 3 ###### Crear una sesión
// Mete una sesión para ese usuario y devuelve su token (la "pulsera" que la prueba usará en el WHEN)
export async function crearSesion(prisma: PrismaClient, idUsuario: string): Promise<string> {
  const sesion = await prisma.sesion.create({
    data: {
      token: randomUUID(),      // Un token aleatorio y único
      idUsuario,                // De quién es la sesión
    },
  });
  return sesion.token;
}
