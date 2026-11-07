// Excepciones del dominio de usuarios.
// Aquí van las que usan varias historias; cada historia añadirá las suyas en su rama
// (por ejemplo, UserExistsAlreadyException en la HU01).

// Se lanza cuando se intenta algo que requiere la sesión iniciada (HU03, HU04, HU05 y HU11-HU14)
export class NotLoggedInUserException extends Error {   // Clase que herda de Error
  constructor() {
    super('El usuario no tiene la sesión iniciada');    // El mensaje del error, se llama a super, igual que en java llama al constructor de la clase padre (Error)
    this.name = 'NotLoggedInUserException';             // El nombre que se verá cuando salte
  }
}

export class WrongPasswordException extends Error {
  constructor() {
    super('La contraseña no es correcta');
    this.name = 'WrongPasswordException';
  }
}