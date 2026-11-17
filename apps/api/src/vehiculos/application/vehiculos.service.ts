import { TipoMotor } from "../../generated/prisma/enums.js";
import { Vehiculo } from "../domain/vehiculo.js";


export class VehiculosService {

  public darAlta(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false,) : Vehiculo| void{
      const vehiculo = new Vehiculo(matricula, idUsuario, marca, modelo, motor, tipoCombustible, consumo, favorito );



      return vehiculo;
    }

}
