// Puerto (interfaz) para guardar, buscar y borrar sesiones.
// Igual que UsuarioRepository: dice QUÉ se hace; CÓMO lo decidirá su adaptador (Prisma).

// Explicación visual de lo que es un token:
// Un token de sesion es como una pulsera de un festival, te la ponen al entrar y mientras la lleves te dejan entrar sin volver a enseñar la entrada

import type { Sesion } from '../../domain/usuario.js';    // La sesión del bloque 2 de usuario.ts

export interface SesionRepository {
  guardar(sesion: Sesion): Promise<Sesion>;                  // HU02: al iniciar sesión, se crea
  buscarPorToken(token: string): Promise<Sesion | null>;     // ¿Esta "pulsera" es válida? (HU03, HU04, HU05, vehículos)
  eliminar(token: string): Promise<void>;                    // HU04: al cerrar sesión, se borra
}

export const SESION_REPOSITORY = Symbol('SESION_REPOSITORY');
