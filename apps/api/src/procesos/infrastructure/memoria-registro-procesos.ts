// Adaptador del puerto RegistroProcesos: guarda los procesos en marcha en memoria (un Map).
// Los procesos solo existen mientras el servidor está encendido, que es justo lo que se necesita:
// si el servidor se reinicia, ningún cálculo ni navegación sigue en marcha.

// ###### BLOQUE 1 ###### Imports y la ficha de un proceso
import { randomUUID } from 'node:crypto';                                       // Genera ids únicos (como UUID.randomUUID() en Java)
import type { RegistroProcesos } from '../application/ports/registro-procesos.js';

interface Proceso {              // Sin export: solo se usa dentro de este archivo (como una clase privada en Java)
  idUsuario: string;
  idVehiculo: string | null;     // null = proceso sin vehículo (por ejemplo, a pie)
}

// ###### BLOQUE 2 ###### La clase
export class MemoriaRegistroProcesos implements RegistroProcesos {
  private readonly procesos = new Map<string, Proceso>();    // id del proceso → sus datos

    // ###### BLOQUE 3 ###### Apuntar y quitar procesos

  async iniciar(idUsuario: string, idVehiculo?: string): Promise<string> {
    const id = randomUUID();
    this.procesos.set(id, { idUsuario, idVehiculo: idVehiculo ?? null });   // set = put de Java
    return id;
  }

  async terminar(idProceso: string): Promise<void> {
    this.procesos.delete(idProceso);                                         // delete = remove de Java
  }

    // ###### BLOQUE 4 ###### Consultas (HU04 y HU13)

  async hayProcesoActivo(idUsuario: string): Promise<boolean> {
    return [...this.procesos.values()].some((p) => p.idUsuario === idUsuario);  // [...this.procesos.values()] convierte los valores del Map en un array, .some(p => ...) devuelve true si alguno cumple la condición. === compara valores, como .equals() con Strings en Java. En TypeScript se usa siempre === y nunca ==
  }

  async vehiculoEnUso(idVehiculo: string): Promise<boolean> {
    return [...this.procesos.values()].some((p) => p.idVehiculo === idVehiculo);
  }
}
