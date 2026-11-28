import { PrismaClient, TipoMotor } from "../../generated/prisma/client.js";
import { Vehiculo } from "../domain/vehiculo.js";
import { VehiculoRepository } from "./ports/vehiculo.repository.js";

export class VehiculosService{

  public async darAlta(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false,) : Promise<Vehiculo>{
    throw new Error('No implementado (HU11)');
  }

  public listar(idUsuario: string): Vehiculo[] {
    throw new Error('No implementado (HU12)');
  }

  public eliminarVehiculo(idVehiculo: string, idUsuario: string): boolean {
    throw new Error('No implementado (HU13)');
  }

  public modificarVehiculo(idVehiculo: string, usuarioId: string,
    cambios: Partial<{
    modelo: string;
    motor: string;
    combustible: string;
    consumo: number;
    matricula: string;}>): Promise<Vehiculo> {
    throw new Error('No implementado (HU14)');
  }

  public marcarFavorito(token: string, idVehiculo: string): Vehiculo {
    throw new Error('No implementado (HU26)');
  }

}
