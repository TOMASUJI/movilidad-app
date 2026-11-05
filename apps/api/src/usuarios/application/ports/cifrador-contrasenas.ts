// Puerto (interfaz) para proteger las contraseñas.
// Las contraseñas NUNCA se guardan tal cual: se guarda su "huella" (hash) y se compara con ella.

export interface CifradorContrasenas {
  cifrar(contrasena: string): Promise<string>;                          // HU01: "34jUEgu@n7" → "$argon2id$v=19$m=65536…"
  comprobar(contrasena: string, cifrada: string): Promise<boolean>;     // HU02: ¿esta contraseña corresponde a esa huella?
}

export const CIFRADOR_CONTRASENAS = Symbol('CIFRADOR_CONTRASENAS');
