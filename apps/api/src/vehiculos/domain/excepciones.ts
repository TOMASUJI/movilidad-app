
export class CarAlreadyAddedException extends Error {
  constructor(){
    super('Este coche ya está dado de alta.');
    this.name = "CarAlreadyAddedException";
  }
}

export class LicensePlateInvalidException extends Error {
  constructor(){
    super('Matrícula invalida, el formato de la matrícula española es NNNNLLL (N-número, L-letra).');
    this.name = "LicensePlateInvalidException";

  }
}

export class FuelConsumptionInvalidException extends Error {
  constructor(){
    super('El consumo no puede ser cero o negativo.');
    this.name = "FuelConsumptionInvalidException";
  }
}

export class CarModelMissingException extends Error {
  constructor(){
    super('No se ha insertado el modelo del coche.');
    this.name = "CarModelMissingException";
  }
}

