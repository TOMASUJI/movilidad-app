import { VehiculoRepository } from "../application/ports/vehiculo.repository.js";
import { Vehiculo } from "../domain/vehiculo.js";

export class PrismaVehiculoRepository implements VehiculoRepository{
  guardar(idUsuario: string, vehiculo: Vehiculo): Promise<Vehiculo> {
    throw new Error("Method not implemented.");
  }
  listar(idUsuario: string): Promise<Vehiculo[]> {
    throw new Error("Method not implemented.");
  }
  eliminarVehiculo(idVehiculo: string, idUsuario: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  modificarVehiculo(idVehiculo: string, usuarioId: string, cambios: Partial<{ modelo: string; motor: string; combustible: string; consumo: number; matricula: string; }>): Promise<Vehiculo> {
    throw new Error("Method not implemented.");
  }
  marcarFavorito(token: string, idVehiculo: string): Promise<Vehiculo> {
    throw new Error("Method not implemented.");
  }


}
