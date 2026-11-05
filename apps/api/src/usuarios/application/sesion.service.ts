// Servicio de sesión (casos de uso de HU02 y HU04) y "portero" del resto de historias.
// De momento es un ESQUELETO: los métodos existen para que las pruebas compilen y se ejecuten,
// pero lanzan "No implementado". La lógica se escribirá en la iteración 1 (ATDD: primero las pruebas en rojo).

// ###### BLOQUE 1 ###### Imports y dependencias
import type { Sesion, Usuario } from '../domain/usuario.js';
import type { CifradorContrasenas } from './ports/cifrador-contrasenas.js';
import type { SesionRepository } from './ports/sesion.repository.js';
import type { UsuarioRepository } from './ports/usuario.repository.js';

export class SesionService {
  constructor(
    private readonly usuarios: UsuarioRepository,       // Para buscar al usuario por su correo o id
    private readonly sesiones: SesionRepository,        // Para crear, buscar y borrar sesiones
    private readonly cifrador: CifradorContrasenas,     // Para comprobar la contraseña al iniciar sesión
  ) {}

    // ###### BLOQUE 2 ###### Métodos (esqueleto: se implementarán en la iteración 1)

  // HU02: comprueba correo y contraseña; si son correctos, crea una sesión y la devuelve
  async iniciarSesion(correo: string, contrasena: string): Promise<Sesion> {
    throw new Error('No implementado (HU02)');
  }

  // HU04: borra la sesión de ese token; si no existe, UserNotLoggedInException
  async cerrarSesion(token: string): Promise<void> {
    throw new Error('No implementado (HU04)');
  }

  // El "portero": devuelve el usuario de la sesión; si el token no es válido, UserNotLoggedInException
  async usuarioDeSesion(token: string): Promise<Usuario> {
    throw new Error('No implementado (HU02)');
  }
}
