// Esta clase es la que recibe las peticiones http
// Aquí podemos ver que según la petición que se haga a la api esta usa los métodos de RutaRepository

// ###### BLOQUE 1 ######
// imports

import { Body, Controller, Get, Inject, NotFoundException, Param, ParseUUIDPipe, Post } from '@nestjs/common';  // Son las anotaciones de nest, funcionan igual que en java con el @ (ej. @RestController, @GetMapping, @PostMapping, ...)
import { RUTA_REPOSITORY, type RutaRepository } from '../../application/ports/ruta.repository.js';              // Es la llave
import type { NuevaRuta, Ruta } from '../../domain/ruta.js';                                                    // Es la interfaz

// ###### BLOQUE  ######
// La clase y su constructor

@Controller('rutas')                                                                        // Marca la clase como controlador y hace que todas sus URL empiezen por "/rutas"
export class RutasController {
  constructor(@Inject(RUTA_REPOSITORY) private readonly rutas: RutaRepository) {}           // Recibe el repositorio con el atajo de private readonly (private final)

  //###### BLOQUE 3 ######
  // Los tres endpoints

  @Post()
  guardar(@Body() ruta: NuevaRuta): Promise<Ruta> {         // Coge el JSON del cuerpo (@Body())
    return this.rutas.guardar(ruta);                        // Devuelve la ruta con su id y su fecha
  }

  @Get()
  listar(): Promise<Ruta[]> {                               // Devuelve todas las rutas
    return this.rutas.listar();
  }

  @Get(':id')                                                                     // Los dos puntos marcan una parte variable de la URL
  async buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<Ruta> {      // @Param(...) coge ese trozo de la URL y antes lo valida
    const ruta = await this.rutas.buscarPorId(id);
    if (!ruta) {
      throw new NotFoundException(`No existe la ruta ${id}`);
    }
    return ruta;
  }
}


