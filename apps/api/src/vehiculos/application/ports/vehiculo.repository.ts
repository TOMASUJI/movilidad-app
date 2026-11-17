import { Vehiculo } from "../../domain/vehiculo.js";

export interface VehiculoRepository {

  guardar(idUsuario: string , datos: Vehiculo): Promise<Vehiculo>;

}
