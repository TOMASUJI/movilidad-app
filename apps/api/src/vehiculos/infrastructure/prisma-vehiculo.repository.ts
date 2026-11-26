import type { PrismaClient } from "../../generated/prisma/client.js";
import { VehiculoRepository } from "../application/ports/vehiculo.repository.js";
import { CarAlreadyAddedException } from "../domain/excepciones.js";
import { Vehiculo } from "../domain/vehiculo.js";

export class PrismaVehiculoRepository implements VehiculoRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async guardar(idUsuario: string, datos: Vehiculo): Promise<Vehiculo> {
    const existe = await this.existeMatriculaDeUsuario(idUsuario, datos.matricula);
    if (!existe ){
       const creado =  await this.prisma.vehiculo.create({
      data: {
        id: datos.id,
        matricula: datos.matricula,
        idUsuario: datos.idUsuario,
        nombre: datos.marca + "," + datos.modelo,
        motor: datos.motor,
        tipoMotor: datos.tipoCombustible,
        consumo: datos.consumo,
        favorito: datos.favorito,
      }
    });
    return new Vehiculo(
      creado.id, creado.matricula, creado.idUsuario, creado.nombre.split(',')[0], creado.nombre.split(',')[1],
      creado.motor, creado.tipoMotor, creado.consumo, creado.favorito,
    );


    } else {
      throw new CarAlreadyAddedException();
    }


  }

   private async existeMatriculaDeUsuario(idUsuario: string, matricula: string): Promise<boolean>{
    const cantidad = await this.prisma.vehiculo.count({where:{idUsuario, matricula} });

    return cantidad > 0;
  }
}
