import { Vehiculo } from "../../domain/vehiculo.js";

export interface VehiculoRepository {
   // HU11 · alta
  guardar(idUsuario: string, vehiculo: Vehiculo): Promise<Vehiculo>;

  // HU12 · listar
  listar(idUsuario: string): Promise<Vehiculo[]>;

  // HU13 · eliminar
  eliminarVehiculo(idVehiculo: string, idUsuario: string ): Promise<boolean>;

  // HU14 · modificar
  modificarVehiculo(idVehiculo: string, usuarioId: string,
    cambios: Partial<{
    modelo: string;
    motor: string;
    combustible: string;
    consumo: number;
    matricula: string;}>): Promise<Vehiculo>;

  //HU26 - marcar favorito
  marcarFavorito(token: string, idVehiculo: string): Promise<Vehiculo>;

}

export const VEHICULO_REPOSITORY = Symbol('VEHICULO_REPOSITORY');
