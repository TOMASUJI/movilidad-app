import { randomUUID } from "node:crypto";
import { TipoMotor } from "../../generated/prisma/enums.js";
import { Vehiculo } from "../domain/vehiculo.js";
import { VehiculoRepository } from "./ports/vehiculo.repository.js";
import { CarModelMissingException, FuelConsumptionInvalidException, LicensePlateInvalidException } from "../domain/excepciones.js";


export class VehiculosService {
  private repositorio: VehiculoRepository;

  constructor(repositorio: VehiculoRepository){
    this.repositorio = repositorio
  }

  public async darAlta(matricula: string, idUsuario: string, marca: string, modelo: string,
    motor: string, tipoCombustible: TipoMotor, consumo: number, favorito: boolean = false,) : Promise<Vehiculo>{
      if (! this.esMatriculaValida(matricula) ){
        throw new LicensePlateInvalidException();
      }

      if (! this.esConsumoValido(consumo)){
          throw new FuelConsumptionInvalidException();
      }

      if (! this.esMarcaOModeloValido(marca, modelo) ){
        throw new CarModelMissingException();
      }

      const vehiculo = new Vehiculo(randomUUID() ,matricula, idUsuario, marca, modelo, motor, tipoCombustible, consumo, favorito );
      return this.repositorio.guardar(idUsuario, vehiculo);
    }

    private esMatriculaValida(matricula: string) : boolean {
      return /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(matricula);
    }

    private esConsumoValido(consumo: number) : boolean{
      return consumo > 0;
    }

    private esMarcaOModeloValido(marca: string, modelo: string) : boolean {
      return (this.tieneTexto(marca) && this.tieneTexto(modelo));
    }

    private tieneTexto(valor: string | null | undefined): boolean {
      return valor != null && valor.trim() !== '';
    }
}
