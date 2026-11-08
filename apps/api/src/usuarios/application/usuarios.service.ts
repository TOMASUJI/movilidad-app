// Servicio de usuarios: casos de uso de la cuenta (HU01 registrarse, HU03 modificar, HU05 eliminar).
// De momento es un ESQUELETO: los métodos existen para que las pruebas se ejecuten (en rojo).

// ###### BLOQUE 1 ######
// Imports
import type { DatosCuenta, Usuario } from '../domain/usuario.js';           // Las entidades del dominio
import type { CifradorContrasenas } from './ports/cifrador-contrasenas.js'; // Puerto: cifrar la contraseña al registrarse
import type { UsuarioRepository } from './ports/usuario.repository.js';     // Puerto: guardar, actualizar y borrar usuarios
import type { SesionService } from './sesion.service.js';                   // El "portero": quién es el usuario de un token

// ###### BLOQUE 2 ######
// La clase
export class UsuariosService {
  constructor(
    private readonly usuarios: UsuarioRepository,       // Para guardar, actualizar y borrar usuarios
    private readonly cifrador: CifradorContrasenas,     // Para cifrar la contraseña al registrarse (HU01)
    private readonly sesion: SesionService,             // Para saber quién está logueado (HU03 y HU05)
  ) {}

  // ###### BLOQUE 3 ######

  // HU01: Registra un usuario nuevo; si el correo ya existe, UserExistAlrredyExcepiton
  async registrar(correo: string, contrasena: string): Promise<Usuario>{
    throw new Error('No implementado (HU01)');
  }

  // HU03: cambia los datos del usuario logueado; si un dato no es válido, WrongModificationException
  async modificar(token: string, datos: DatosCuenta): Promise<Usuario>{
    throw new Error('No implementado (HU03)');
  }

  // HU05: elemina la cuenta del usuario loguead; sin sesión, NotLoggedInUserException
  async eliminarCuenta(token: string){
    throw new Error('No implementado (HU05)');
  }
}
