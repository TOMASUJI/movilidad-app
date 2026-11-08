// Entidades del dominio de usuarios (R1): qué es un usuario y qué es una sesión para nuestra app.
// TypeScript puro: no importa nada de Prisma ni de NestJS (es el núcleo de la arquitectura hexagonal).

// ###### BLOQUE 1 ###### El usuario
export interface Usuario {
  id: string;
  correo: string;
  contrasenaCifrada: string;     // El hash de argon2, NUNCA la contraseña en claro
  nombre: string | null;         // null = todavía no lo ha rellenado (lo hará en la HU03)
  telefono: string | null;
  ciudad: string | null;
}

// ###### BLOQUE 2 ###### La sesión
export interface Sesion {
  token: string;                 // Identifica la sesión; la web lo guardará en una cookie
  idUsuario: string;             // De quién es la sesión (el id de un Usuario)
  creadaEn: Date;                // Cuándo se inició
}


// ###### BLOQUE 3 ###### Los datos que se pueden modificar de la cuenta (HU03)
export interface DatosCuenta {
  nombre?: string;               // ? = opcional: solo se envía lo que se quiere cambiar
  correo?: string;
  telefono?: string;
  ciudad?: string;
}
