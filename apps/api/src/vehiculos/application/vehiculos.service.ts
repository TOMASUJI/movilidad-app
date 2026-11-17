import { TipoMotor } from "../../generated/prisma/enums.js";
import { Vehiculo } from "../domain/vehiculo.js";
import { VehiculoRepository } from "./ports/vehiculo.repository.js";


export class VehiculosService {
  private repositorio: VehiculoRepository;


  public darAlta(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false,) : Promise<Vehiculo>{
      const vehiculo = new Vehiculo(matricula, idUsuario, marca, modelo, motor, tipoCombustible, consumo, favorito );
      return this.repositorio.guardar(idUsuario, vehiculo);
    }

}
