// Servicio de usuarios: casos de uso de la cuenta (HU01 registrarse, HU03 modificar, HU05 eliminar).

// ###### BLOQUE 1 ######
// Imports
import type { DatosCuenta, Usuario } from '../domain/usuario.js';           // Las entidades del dominio
import type { CifradorContrasenas } from './ports/cifrador-contrasenas.js'; // Puerto: cifrar la contraseña al registrarse
import type { UsuarioRepository } from './ports/usuario.repository.js';     // Puerto: guardar, actualizar y borrar usuarios
import type { SesionService } from './sesion.service.js';                   // El "portero": quién es el usuario de un token
import { UserExistsAlreadyException } from '../domain/excepciones.js';

// ###### BLOQUE 2 ######
// La clase
export class UsuariosService {
  constructor(
    private readonly usuarios: UsuarioRepository,       // Para guardar, actualizar y borrar usuarios
    private readonly cifrador: CifradorContrasenas,     // Para cifrar la contraseña al registrarse (HU01)
    private readonly sesion: SesionService,             // Para saber quién está logueado (HU03 y HU05)
  ) {}

  // ###### BLOQUE 3 ######

  // HU01: Registra un usuario nuevo; si el correo ya existe, UserExistsAlreadyException
  async registrar(correo: string, contrasena: string): Promise<Usuario>{
    if (await this.usuarios.buscarPorCorreo(correo)) {        // 0. ¿ya existe ese correo?
      throw new UserExistsAlreadyException();
    }
    const cifrada = await this.cifrador.cifrar(contrasena);
    return this.usuarios.guardar(correo, cifrada);
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
