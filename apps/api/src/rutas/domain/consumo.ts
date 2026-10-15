//###### BLOQUE 1 ######
// El tipo de combustible puede ser gasolina95, gasoleoA o electrico. Sería como un enum en Java
// export es como el modificador publicn en java, permite usarlo desde otros archivos.
// type FuelType crea un nuevo tipo llamado FuelType, que puede ser uno de los tres valores: 'gasolina95' o 'gasoleoA' o 'electrico'.
// La barra "|" significa "o", es decir, el tipo FuelType puede ser 'gasolina95' o 'gasoleoA' o 'electrico'.
// En java escribiríamos FuelType.GASOLINA95, aquí el valor es directamente el texto 'gasolina95'.
// Se separa a propósito ela electricidad.

export type TipoCombustible = 'gasolina95' | 'gasoleoA';

//###### BLOQUE 2 ######
// Interface define la forma de la consumición del combustible.
// Hay dos interfaces diferentes dependiendo si el motor es de combustión o eléctrico.
// En la interface ConsumoCombustible está tipoMotor especificando siempre combustion.

export interface ConsumoCombustible {
  tipoMotor: 'combustion';
  tipoCombustible: TipoCombustible;           // Tipo de combustible utilizado.
  litrosPor100Km: number;                     // Consumo de combustible por cada 100 km.
}

// Segunda interface individual para un motor eléctrico

export interface ConsumoElectrico {
  tipoMotor: 'electrico';                     // Tipo de motor, siempre eléctrico.
  kwhPor100Km: number;                        // Consumo de kilovatios por cada 100km
}

//###### BLOQUE 3 ######
// Es como un enum determinando que tipo de consumo (eléctrico, combustion) utilizando una interfaz diferente

export type Consumo = ConsumoCombustible | ConsumoElectrico;

//###### BLOQUE 4 ######
// TipoMotor es el tipo del campo tipoMotor es decir eléctrico o combustion,
// de esta forma no se desincroniza si cambiamos el tipoMotor de las interfaces

export type TipoMotor = Consumo['tipoMotor'];
