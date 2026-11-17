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

  constructor(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false,){
      this.matricula = matricula;
      this.idUsuario = idUsuario;
      this.marca = marca;
      this.modelo = modelo;
      this.motor = motor;
      this.tipoCombustible = tipoCombustible;
      this.consumo = consumo;
      this.favorito = favorito;
  }


}

