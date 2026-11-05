// Puerto (interfaz) para guardar y leer usuarios.
// Dice QUÉ se puede hacer con los usuarios; CÓMO (Prisma + PostgreSQL) lo decidirá su adaptador.

import type { Usuario } from '../../domain/usuario.js';    // La ficha que hicimos en el paso 0.10a

export interface UsuarioRepository {
  guardar(correo: string, contrasenaCifrada: string): Promise<Usuario>;    // HU01: dar de alta
  buscarPorCorreo(correo: string): Promise<Usuario | null>;                // HU01 (¿ya existe?) y HU02 (iniciar sesión)
  buscarPorId(id: string): Promise<Usuario | null>;                        // Saber quién es el de la sesión
  actualizar(usuario: Usuario): Promise<Usuario>;                          // HU03: modificar la cuenta
  eliminar(id: string): Promise<void>;                                     // HU05: eliminar la cuenta
}

export const USUARIO_REPOSITORY = Symbol('USUARIO_REPOSITORY');           // La "llave" para que NestJS lo inyecte
