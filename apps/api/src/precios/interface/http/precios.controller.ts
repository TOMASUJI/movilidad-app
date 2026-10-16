// Controlador REST de precios de combustible (S03).
//
// Expone GET /api/precios/combustible?tipo=gasolina95&provincia=12
// Valida los parámetros de la URL y pide el precio medio al puerto PreciosCombustible.
// No sabe que detrás está la API del Ministerio: eso lo decide el módulo (precios.module.ts).
// En Java sería un @RestController con un @GetMapping y dos @RequestParam.


// ###### BLOQUE 1 ######
// Imports
import { PRECIOS_ELECTRICIDAD, type PreciosElectricidad } from '../../application/ports/precios-electricidad.js'; // El puerto nuevo y su llave
import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common';  // Decoradores de Nest (como las anotaciones de Spring) y la excepción que responde 400
import {
  PRECIOS_COMBUSTIBLE,           // La llave para pedir a Nest la implementación (sin "type": se usa al ejecutar)
  type PrecioMedio,              // Lo que devuelve el endpoint
  type PreciosCombustible,       // La interfaz del puerto
  type TipoCombustible,          // 'gasolina95' | 'gasoleoA'
} from '../../application/ports/precios-combustible.js';


// ###### BLOQUE 2 ######
// Combustibles que acepta la URL. Se usa para validar el parámetro "tipo".

const TIPOS_VALIDOS: TipoCombustible[] = ['gasolina95', 'gasoleoA'];   // Como una List<TipoCombustible> constante


// ###### BLOQUE 3 ######
// La clase del controlador

@Controller('precios')                                     // Todas sus URL empiezan por /precios (con el prefijo global: /api/precios)
export class PreciosController {
  constructor(@Inject(PRECIOS_COMBUSTIBLE) private readonly precios: PreciosCombustible,
              @Inject(PRECIOS_ELECTRICIDAD) private readonly electricidad: PreciosElectricidad   // Nest inyecta el adaptador de REE, igual que hace con el del Ministerio
              ) {}   // Nest le entrega lo que haya guardado con la llave PRECIOS_COMBUSTIBLE (como @Autowired + @Qualifier)

  @Get('combustible')                                      // GET /api/precios/combustible
  combustible(
    @Query('tipo') tipo: string,                           // ?tipo=... de la URL (como @RequestParam). Llega como texto cualquiera
    @Query('provincia') provincia: string,                 // ?provincia=... de la URL. Código de dos cifras (12 = Castellón)
  ): Promise<PrecioMedio> {
    if (!TIPOS_VALIDOS.includes(tipo as TipoCombustible)) {         // ¿Es uno de los combustibles válidos? (includes = contains de Java)
      throw new BadRequestException(`Tipo de combustible no válido: "${tipo}". Usa gasolina95 o gasoleoA`);   // Responde 400 con este mensaje
    }
    if (!/^\d{2}$/.test(provincia ?? '')) {                // ¿Son exactamente dos cifras? Expresión regular, como "\\d{2}" en Java. Si no viene, se usa '' y falla
      throw new BadRequestException('La provincia debe ser un código de dos cifras, por ejemplo 12');          // Responde 400
    }
    return this.precios.precioMedio(tipo as TipoCombustible, provincia);   // Ya validado: lo pasamos al puerto. El cast le dice a TypeScript que el tipo es correcto
  }

    // GET /api/precios/electricidad?fecha=2026-10-16   (sin fecha → hoy)
  @Get('electricidad')
  precioElectricidad(@Query('fecha') fecha?: string) {
    const dia = fecha ?? new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' }); // Hoy en España, ya en formato AAAA-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) {
      throw new BadRequestException('La fecha debe tener el formato AAAA-MM-DD');           // → HTTP 400, como con los parámetros del combustible
    }
    return this.electricidad.precioMedio(dia);
  }
}
