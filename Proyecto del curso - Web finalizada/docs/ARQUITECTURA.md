# Arquitectura

## De dónde sale el contenido

El flujo es de una sola dirección:

```
TEMARIO.md  →  src/data/modulos.ts  →  componentes  →  interfaz
 (markdown)      (datos tipados)        (React)
```

- **`TEMARIO.md`** (raíz) es la fuente legible por personas. Nueve módulos, cada uno con un
  encabezado de nivel 2, su subtítulo en una cita, una lista de puntos, una línea de comandos y una
  lista de ficheros.
- **`src/data/modulos.ts`** es ese contenido volcado a datos tipados. Es la **única** fuente que
  consumen los componentes: nunca se duplica texto en el JSX.
- Los **componentes** solo leen y presentan. No transforman contenido.

Los bloques de código que muestra cada módulo tienen su propia entrada, porque no son texto sino
código que el alumno se lleva:

```
opencode.json            ┐
AGENTS.md                ├→  src/data/ejemplos.ts  →  src/data/modulos.ts  →  componentes
.opencode/commands/      │        (?raw + JSON)
.opencode/skills/        ┘
```

- **`src/data/ejemplos.ts`** lee el código del propio repositorio: los ficheros completos con el
  sufijo `?raw` de Vite, y los fragmentos de `opencode.json` re-serializando el sub-objeto que
  toque. Así lo que ve el alumno en pantalla no puede desviarse de lo que hay en disco: no hay
  copia que mantener al día.
- Nadie más importa `ejemplos.ts`. Los componentes siguen leyendo solo de `modulos.ts`.
- Del bloque solo se traduce el pie; el código es el mismo en los dos idiomas.

## Estructura de carpetas

```
src/
  main.tsx            Punto de entrada de React
  App.tsx             Mantiene el módulo seleccionado y monta la interfaz
  index.css           Tokens de diseño y estilos base
  data/modulos.ts     El contenido del curso, tipado
  data/ejemplos.ts    El código real del repositorio, leído con ?raw
  components/         Un directorio por componente, con su CSS al lado
  i18n/               Cadenas de la interfaz y el helper t(clave)
docs/                 Esta documentación
.opencode/            Comandos y skills del proyecto
```

## Decisiones de diseño

- **Una dependencia para el resaltado.** `prismjs` es la única excepción a la regla de no añadir
  dependencias: escribir un resaltador de JSON y de markdown a mano habría sido más código y peor.
  No se importa ningún tema de Prism; los colores de los tokens se escriben en
  `BloqueCodigo/index.css` con las variables del proyecto.
- **Sin librerías de estilos.** CSS plano y variables en `:root`. El proyecto es pequeño y una
  dependencia de estilos no se paga sola.
- **La medida de lectura es de la prosa, no del panel.** Los textos van topados a `68ch`, que es
  lo que los hace legibles. El código no: es una figura y rompe la caja de texto para ocupar la
  columna entera, como los listados de un manual impreso. Por eso el tope vive en
  `.panel-modulo__cabecera` y `.panel-modulo__seccion`, y la sección de código lo anula con el
  modificador `--codigo`. Ponerlo en `.panel-modulo` dejaba casi 300 px del contenedor sin usar
  y descentraba ópticamente la página.
- **Una sola capa de tokens.** Color, tipografías, escala tipográfica y espaciado viven en
  `:root` dentro de `src/index.css`. Los CSS de componente solo consumen esas variables, nunca
  escriben un color o un tamaño a pelo. Cambiar la paleta es editar un bloque.
- **Dirección visual: manual técnico impreso.** Papel hueso, tinta, un rojo de señal que aparece
  solo donde importa, reglas de un pelo en lugar de tarjetas y radio 0 en todo el proyecto. Las
  tipografías (Bricolage Grotesque, Newsreader e IBM Plex Mono) se cargan por `<link>` desde
  Google Fonts en `index.html`, así que no añaden dependencias de npm.
- **El movimiento es funcional, no decorativo.** Entradas escalonadas al cambiar de módulo y el
  filete del índice que se desliza; todo anulado bajo `prefers-reduced-motion: reduce`.
- **La página se imprime.** `@media print` en `src/App.css` quita el cromo y el grano para que el
  temario salga en papel como el manual que aparenta ser.
- **Sin gestor de estado global.** El único estado es el id del módulo seleccionado, vive en `App`
  y baja por props. Introducir un store sería complejidad sin beneficio.
- **Un fichero por componente**, en `src/components/<Nombre>/index.tsx`, con su CSS en la misma
  carpeta. Así todo lo de un componente se mueve o se borra de una pieza.
- **Textos fuera del JSX.** Las cadenas visibles viven en `src/i18n/es.json` y se leen con
  `t(clave)`. El procedimiento exacto para añadirlas está en el skill `i18n`.
- **TypeScript estricto.** `strict`, `noUnusedLocals` y `noUnusedParameters` activados: el agente
  recibe los errores reales del compilador cuando edita, y eso es lo que le permite corregirse.
