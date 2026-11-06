// Adaptador del puerto CifradorContrasenas: calcula y comprueba huellas (hash) de contraseñas con argon2.
// De momento es un ESQUELETO: la librería argon2 se instalará en la HU01, cuando se implemente.

// ###### BLOQUE 1 ###### Import
import type { CifradorContrasenas } from '../application/ports/cifrador-contrasenas.js';   // El puerto que vamos a implementar

// ###### BLOQUE 2 ###### La clase
export class Argon2Cifrador implements CifradorContrasenas {
    // ###### BLOQUE 3 ###### Métodos (esqueleto: se implementan en la historia indicada)

  async cifrar(contrasena: string): Promise<string> {
    throw new Error('No implementado (HU01)');           // Al registrarse se guarda la huella, no la contraseña
  }

  async comprobar(contrasena: string, cifrada: string): Promise<boolean> {
    throw new Error('No implementado (HU02)');           // Al iniciar sesión se compara con la huella guardada
  }
}
