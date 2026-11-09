
export class CarAlreadyAddedException extends Error {
  constructor(){super('Este coche ya está dado de alta.')}
}

export class LicensePlateInvalidException extends Error {
  constructor(){super('Matrícula invalida, el formato de la matrícula española es NNNNLLL (N-número, L-letra).')}
}

export class FuelConsumptionInvalidException extends Error {
  constructor(){super('El consumo no puede ser cero o negativo.')}
}

export class CarModelMissingException extends Error {
  constructor(){super('No se ha insertado el modelo del coche.')}
}

