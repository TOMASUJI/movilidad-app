# Guía de trabajo del equipo

Esta guía resume la metodología de la asignatura (documento de metodología, secciones 2 y 3) aplicada a nuestro repositorio. Si tienes dudas, pregunta antes de improvisar.

## 1. Ramas

| Rama | Para qué | Quién la crea |
|---|---|---|
| `main` | Solo versiones estables. **Nunca se trabaja directamente en ella.** | — |
| `it-NN` | Una por iteración (`it-01`, `it-02`…). Punto de partida y de llegada de sus historias. | Tomás, al empezar la iteración |
| `h-XX` | Una por historia de usuario (`h-05` = HU05). Todo el trabajo de la historia va aquí. | El responsable de la historia |

Los push directos a `main` y a `it-NN` están bloqueados en tu ordenador (hook `pre-push`) y el CI los marca en rojo si llegan a GitHub.

## 2. Empezar una historia

1. Asígnate la issue de la historia en GitHub y muévela a **In progress** en el tablero.
2. Crea la rama:

   ```bash
   npm run historia -- 05
   ```

   Esto descarga lo último de GitHub, crea `h-05` desde la iteración actual y la sube.

## 3. Ciclo ATDD dentro de la historia

Para cada prueba de aceptación de la historia:

1. **Escribe la prueba de aceptación** (Given-When-Then) contra el servicio de la capa de aplicación, con la implementación vacía para que falle.
   → `test(it01h05): create acceptance tests for valid scenario`
2. **Ejecuta todas las pruebas** (`npm test`): la nueva debe fallar y las anteriores seguir en verde.
3. **Si hay una dependencia externa** (API, base de datos), escribe primero la prueba de integración sustituyendo esa dependencia por un mock.
   → `test(it01h05): add integration test with routing mock`
4. **Implementa solo lo necesario** para que la prueba pase.
   → `feat(it01h05): calculate route between two places`
5. **Ejecuta otra vez todas las pruebas**: todo en verde.
6. **Refactoriza** en pasos pequeños, aplicando los patrones de diseño, y comprueba las pruebas tras cada paso.
   → `refactor(it01h05): extract cost strategy`
7. Vuelve al paso 1 con la siguiente prueba de aceptación.

> Es normal y correcto hacer commit de pruebas que fallan: es el primer paso de ATDD. Por eso el proyecto no ejecuta las pruebas al hacer commit.

## 4. Commits

Formato: `tipo(scope): descripción en inglés`

| Tipo | Uso |
|---|---|
| `test` | Pruebas |
| `feat` | Funcionalidad nueva |
| `refactor` | Mejora del diseño sin cambiar el comportamiento |
| `fix` | Corrección de errores |
| `chore` | Configuración, dependencias |
| `docs` / `ci` | Documentación / integración continua |

El **scope** es `itNNhXX` (iteración y historia), por ejemplo `it01h05`. Para trabajo de la iteración que no es de ninguna historia, `itNN` (por ejemplo `chore(it00): set up monorepo`).

Un commit que no siga el formato **se rechaza automáticamente**. Descripciones cortas y concretas: nada de `fix bug` o `changes`.

## 5. Abrir la pull request de la historia

1. Sube tus commits: `git push`.
2. En GitHub, abre una PR de `h-05` hacia **`it-01`** (¡no hacia `main`!).
3. Título: `IT01-H05`. Rellena la plantilla y enlaza la issue.
4. Pide revisión a otro miembro del equipo y mueve la issue a **In review**.

**Quien revisa:** comprueba que las pruebas pasan en el CI, que se siguió el orden ATDD (los commits `test` van antes que los `feat`) y que el código respeta la arquitectura. Si todo está bien, aprueba y fusiona con **Create a merge commit**.

## 6. Mantener tu rama al día

Si otra historia se ha fusionado en la iteración mientras trabajabas, trae esos cambios a tu rama antes de abrir la PR:

```bash
git fetch origin
git merge origin/it-01
```

Si aparecen conflictos, resuélvelos en VS Code, ejecuta `npm test` y haz commit. Si no lo tienes claro, pide ayuda: mejor resolverlo entre dos.

## 7. Cerrar la iteración

Cuando todas las historias de la iteración están fusionadas y estables, se abre la PR `IT01` de `it-01` hacia `main`, la revisa el equipo en una reunión y se fusiona.

## 8. Lo que nunca se hace

- Trabajar o hacer push directamente en `main` o en `it-NN`.
- Subir secretos (API keys, contraseñas, archivos `.env`).
- Fusionar una PR con pruebas en rojo.
- Fusionar tu propia PR sin revisión.
