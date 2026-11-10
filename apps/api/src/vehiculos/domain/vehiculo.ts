import { TipoMotor } from "../../generated/prisma/enums.js";

export class Vehiculo {
   // ATRIBUTOS
  public matricula: string;
  private idUsuario: string;
  public marca: string;
  public modelo: string;
  public motor: string;
  public tipoCombustible: TipoMotor;
  public consumo: number;
  public favorito: boolean;
  public predeterminado: boolean

  constructor(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false, predeterminado: boolean = false,){
  }


}
