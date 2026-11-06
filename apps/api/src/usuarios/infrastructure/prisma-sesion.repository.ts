// Adaptador del puerto SesionRepository: guarda, busca y borra sesiones en PostgreSQL usando Prisma.
// De momento es un ESQUELETO: cada historia implementará el método que necesite (ATDD).

// ###### BLOQUE 1 ###### Imports
import type { PrismaClient } from '../../generated/prisma/client.js';                // ../../ = src/
import type { Sesion } from '../domain/usuario.js';                                  // Sesion está en usuario.ts (bloque 2)
import type { SesionRepository } from '../application/ports/sesion.repository.js';   // El puerto que vamos a implementar


// ###### BLOQUE 2 ###### La clase
export class PrismaSesionRepository implements SesionRepository {
  constructor(private readonly prisma: PrismaClient) {}       // Recibe la conexión ya abierta

  async guardar(sesion: Sesion): Promise<Sesion>{
    throw new Error('No implementado (HU02)');                  // HU02: al iniciar sesión, se crea
  }
  async buscarPorToken(token: string): Promise<Sesion | null>{  // ¿Esta "pulsera" es válida? (HU03, HU04, HU05, vehículos)
    throw new Error('No implementado (HU02)');
  }
  async eliminar(token: string): Promise<void>{
    throw new Error('No implementado (HU04');                   // Al cerrar sesión se borra
  }

}
