import { PrismaClient } from "@prisma/client/extension";
import { VehiculoRepository } from "../application/ports/vehiculo.repository.js";
import { Vehiculo } from "../domain/vehiculo.js";

 class PrismaVehiculoRepository implements  VehiculoRepository{
  private readonly prisma: PrismaClient;


  async guardar(idUsuario: string, datos: Vehiculo): Promise<Vehiculo> {
        const creado = await this.prisma.datos.create({
      data: {
        matricula: datos.matricula,
        idUsuario: idUsuario,
        marca: datos.marca,
        modelo: datos.modelo,
        motor: datos.motor,
        tipoCombustible: datos.tipoCombustible,
        consumo: datos.consumo,
        favorito: datos.favorito,
      },});

      return creado;
  }
 }
