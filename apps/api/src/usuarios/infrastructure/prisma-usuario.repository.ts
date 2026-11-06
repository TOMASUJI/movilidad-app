// Adaptador del puerto UsuarioRepository: guarda y lee usuarios en PostgreSQL usando Prisma.

//###### BLOQUE 1 ######
// Imports

import type { PrismaClient } from '../../generated/prisma/client.js'; // El cliente que genera Prisma a partir de schema.prisma
import type { Usuario } from '../domain/usuario.js';
import type { UsuarioRepository} from '../application/ports/usuario.repository.js'  // El puerto (la interfaz) que vamos a implementar

// ###### BLOQUE 2 ######
// La clase

export class PrismaUsuarioRepository implements UsuarioRepository{

  constructor(private readonly prisma: PrismaClient){}               // Recibe la conexión ya abierta

  // ###### BLOQUE 3 ######
  async guardar (correo: string, contrasenaCifrada: string): Promise<Usuario> {
    throw new Error('No implementado (HU01)');
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    throw new Error('No implementado (HU01)');
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    throw new Error('No implementado (HU02)');
  }

  async actualizar(usuario: Usuario): Promise<Usuario>{
    throw new Error('No implementado (HU03)');
  }

  async eliminar (id: string): Promise<void>{
    throw new Error('No implementado (HU05)');
  }
}

