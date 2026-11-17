import { Vehiculo } from "../../domain/vehiculo.js";

interface VehiculoRepository {

  guardar(idUsuario: string , datos: Vehiculo): Vehiculo;
  listarPorUsuario(idUsuario: string): Vehiculo[];
  buscarPorId(id: string): Vehiculo| null;
  buscarPorMatricula(idUsuario: string, matricula: string): Vehiculo| null;
  actualizar(vehiculo: Vehiculo): Vehiculo;
  eliminar(id: string): void;

}
