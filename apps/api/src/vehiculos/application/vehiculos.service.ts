import { TipoMotor } from "../../generated/prisma/enums.js";
import { Vehiculo } from "../domain/vehiculo.js";


export class VehiculosService {

  public darAlta(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false,) : Vehiculo| void{
      throw new Error('No implementado (HU11)');
  }

  public listar(idUsuario: string) : Vehiculo[] {
    throw new Error('No implementado (HU12)');
  }

}
