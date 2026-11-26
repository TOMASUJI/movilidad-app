import { TipoMotor } from "../../generated/prisma/enums.js";

export class Vehiculo {
   // ATRIBUTOS
  public id: string;
  public matricula: string;
  public idUsuario: string;
  public marca: string;
  public modelo: string;
  public motor: string;
  public tipoCombustible: TipoMotor;
  public consumo: number;
  public favorito: boolean;
  public predeterminado: boolean

  constructor(id: string, matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number,  favorito: boolean = false, predeterminado: boolean = false,){
      this.id = id;
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

