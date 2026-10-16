// Vamos a crear un componente, este es el primero de tres archiovos que lo definen
// mapa.ts   <-- Este archivo, la lógica que define qué datos tiene y qué hace el componente
// mapa.html <-- Qué se ve, la plantilla
// mapa.scss <-- Los estilos, solo para este componente

// Un componente es un trozo de pantalla con su lógica


//###### BLOQUE 1 ######
// Imports, puntos de ejemplo y la chincheta

import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';    // Herramientas de Angular, explicadas en el BLOQUE 2
import * as L from 'leaflet';                                                                         // Todo leaflet bajo el nombre de L
import type { Coordenada, RutaCalculada } from '../ruta';                                             // Los tipos de la web
import { RutasApi } from '../rutas-api';                                                              // El servicio de rutas

// Punto fijos en el spike, constantes porque en el spike el usuario todavía no elige los lugares, eso será en la HU06 y la HU07
const CASTELLON: Coordenada = { lat: 39.9864, lon: -0.0513 };
const VALENCIA: Coordenada = { lat: 39.4699, lon: -0.3763 };

function chincheta(letra: string, color: string): L.DivIcon {                                         // Es una función fábrica, la llamaremos dos veces, para el inicio y destino, es como un método estático en java
  return L.divIcon({                                                                                  // Crea un icono a partir de html para sustituir el por defecto de leaflet
    className: '',                                                                                    // Quita un estilo por defecto de leaflet que dibuja un recuadro blanco alrrededor de la chincheta
    html: `
      <svg width="32" height="42" viewBox="0 0 32 42">
        <path d="M16 0C7 0 0 7 0 16c0 12 16 26 16 26s16-14 16-26C32 7 25 0 16 0z" fill="${color}"/>
        <circle cx="16" cy="16" r="10" fill="white"/>
        <text x="16" y="21" text-anchor="middle" font-size="13" font-weight="bold" fill="${color}">${letra}</text>
      </svg>`,
    iconSize: [32, 42],                                                                               // Tamaño en píxeles
    iconAnchor: [16, 42],                                                                             // El punto del icono que se clava en la coordenada (en el centro y abajo del todo)
  });
}



//###### BLOQUE 2 ######
// La clase y la creación del mapa

@Component({                                // @Component anota la clase y la enlaza con su .html y su .css
  selector: 'app-mapa',                     // Etiqueta html con la que se usará
  templateUrl: './mapa.html',               // Enlaza con su archivo html
  styleUrl: './mapa.scss',                  // Enlaza con su archivo css
})


export class Mapa {
  private readonly api = inject(RutasApi);                                                                      // El servicio inyectado como atributo
  private readonly contenedor = viewChild.required<ElementRef<HTMLDivElement>>('contenedor');                   // Una referencia al <div> de la plantilla donde irá el mapa. "required" indica que tiene que existir
  private mapa?: L.Map;                                                                                         // El mapa de leaflet con ? porque al principio no existe y se crea después

  private readonly capa = L.layerGroup();                                     // Un "cajón" donde metemos las chinchetas y la línea; así se borra todo de golpe con capa.clearLayers()
  private origenPendiente: Coordenada | null = null;                          // El origen del primer clic, esperando a que llegue el segundo (el destino). null = no hay ninguno pendiente
  protected readonly ayuda = signal('Haz clic en el mapa para elegir el origen (A)'); // Texto de ayuda que se verá en pantalla y cambiará según el paso


  // Las señales son la clave del patrón MVVM
  // En el ejemplo de abajo, se lee con ruta() y se escribe con ruta.set(nuevoValor)
  // Cuando cambia, angular actualiza solo las partes de la plantilla que la usan
  // "protected" quiere decir que la plantilla html las puede leer pero el resto de clases no

  protected readonly ruta = signal<RutaCalculada | null>(null);                                                 // Una señal, un valor que cuando cambia actualiza la pantalla
  protected readonly error = signal<string | null>(null);                                                       // Igual para un mensaje de error

  constructor() {
    afterNextRender(() => this.iniciarMapa());                                                                  // Leaflet necesita que el <div> ya esté pintado en la pantalla
  }                                                                                                             // "afterNextRender()" significa que ejecute el código justo después de que la pantalla se ejecute por primera vez

  private ponerChincheta(punto: Coordenada, letra: 'A' | 'B'): void {                                           // letra solo puede ser 'A' o 'B': el compilador no deja pasar otra cosa (como un enum)
    const color = letra === 'A' ? '#2e7d32' : '#c62828';                                                    // A verde, B roja (el operador ternario es igual que en Java)
    L.marker([punto.lat, punto.lon], { icon: chincheta(letra, color) }).addTo(this.capa);                       // La chincheta va al "cajón", no directamente al mapa
  }

  private iniciarMapa(): void {
    this.mapa = L.map(this.contenedor().nativeElement).setView([CASTELLON.lat, CASTELLON.lon], 9);              // L.map(div).setView([lat, lon], 9) crea el mapa dentro del <div>, centrado en Castellón, con zoom 9 (se ve la provincia entera).

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {                   // L.tileLayer(...) es el fondo del mapa. Cada cuadradito (tesela) es una imagen que se descarga de esa URL según el zoom ({z}) y la posición ({x}, {y}).
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,                                            //
      }).addTo(this.mapa);


      this.capa.addTo(this.mapa);                                                        // Ponemos el "cajón" encima del mapa: todo lo que metamos en él se verá

      this.mapa.on('click', (evento) =>                                                  // Escuchamos los clics en el mapa (como un addActionListener en Swing)
        this.alHacerClic({ lat: evento.latlng.lat, lon: evento.latlng.lng }),            // Leaflet da las coordenadas en latlng (ojo: él usa "lng", nosotros "lon")
      );

      this.ponerChincheta(CASTELLON, 'A');                                               // Ruta de ejemplo al abrir la página, como antes
      this.ponerChincheta(VALENCIA, 'B');

      void this.calcularRuta(CASTELLON, VALENCIA);   // Pide la ruta de ejemplo a la API (bloque 3). El void indica que lanzamos la petición sin esperarla aquí: cuando llegue la respuesta, el propio método la pintará.
  }

  private alHacerClic(punto: Coordenada): void {
    if (this.origenPendiente === null) {                                   // PRIMER CLIC: empieza una ruta nueva
      this.capa.clearLayers();                                             // Vaciamos el cajón: fuera chinchetas y línea anteriores
      this.ruta.set(null);                                                 // Fuera la tarjeta de km y minutos
      this.error.set(null);                                                // Fuera el mensaje de error, si lo había
      this.origenPendiente = punto;                                        // Recordamos el origen hasta el siguiente clic
      this.ponerChincheta(punto, 'A');
      this.ayuda.set('Ahora haz clic para elegir el destino (B)');
    } else {                                                               // SEGUNDO CLIC: destino y cálculo
      const origen = this.origenPendiente;                                 // Copiamos el origen a una variable local…
      this.origenPendiente = null;                                         // …y dejamos el estado listo para el siguiente primer clic
      this.ponerChincheta(punto, 'B');
      this.ayuda.set('Haz clic en el mapa para elegir un nuevo origen (A)');
      void this.calcularRuta(origen, punto);                               // Pedimos la ruta a la API (sin esperarla aquí, como antes)
    }
  }

  //###### BLOQUE 3 ######
  // Pedir la ruta y dibujarla

    private async calcularRuta(origen: Coordenada, destino: Coordenada): Promise<void> { // NUEVO: ahora recibe los dos puntos como parámetros
    this.error.set(null);                                                                // NUEVO: quitamos un error anterior antes de volver a intentarlo
    try {
      const ruta = await this.api.calcular(origen, destino, 'coche');                    // NUEVO: usa los parámetros en vez de CASTELLON y VALENCIA. Llama al servicio, que hace el POST /api/rutas/calcular
      this.ruta.set(ruta);                                                               // guarda la ruta en la señal

      const linea = L.geoJSON(ruta.geometria, {                                          // dibuja la línea de la ruta
        style: { color: '#1565c0', weight: 6, opacity: 0.85 },
      }).addTo(this.capa);                                                               // NUEVO: la línea va al "cajón" (antes this.mapa!), así se borra con el siguiente clic

      // fitBounds(linea.getBounds(), { padding: [40, 40] }) ajusta el zoom y el centro para que la ruta entera quepa en pantalla,
      // con 40 píxeles de margen para que las chinchetas no queden pegadas al borde.
      // this.mapa!: el ! le dice a TypeScript "sé que aquí mapa ya existe". El atributo era opcional (mapa?), pero en este punto ya se ha creado en iniciarMapa
      // La exclamación hay que usarla solo cuando se esté seguro de que ya existe el componente, en este caso el mapa
      this.mapa!.fitBounds(linea.getBounds(), { padding: [40, 40] });
    } catch {
      this.error.set('No se ha podido calcular la ruta. ¿Hay carreteras cerca de los puntos? ¿Está arrancada la API?'); // NUEVO: mensaje más útil (ORS falla si clicas en el mar o en el monte)
    }
  }




}







