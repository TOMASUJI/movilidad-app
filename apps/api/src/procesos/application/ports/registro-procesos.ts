// Puerto (interfaz) para saber qué procesos (cálculo de ruta, navegación) hay en marcha.
// Lo usan HU04 (no cerrar sesión con un proceso activo) y HU13 (no borrar un vehículo en uso).

export interface RegistroProcesos {
  iniciar(idUsuario: string, idVehiculo?: string): Promise<string>;   // Apunta un proceso y devuelve su id. idVehiculo lleva ? porque puede ser una navegación a pie que no usa vehículo
  terminar(idProceso: string): Promise<void>;                          // Lo quita de la lista
  hayProcesoActivo(idUsuario: string): Promise<boolean>;               // HU04: ¿este usuario tiene algo en marcha?
  vehiculoEnUso(idVehiculo: string): Promise<boolean>;                 // HU13: ¿algún proceso usa este vehículo?
}

export const REGISTRO_PROCESOS = Symbol('REGISTRO_PROCESOS');          // La "llave" para que NestJS lo inyecte

