# Componentes

Un apartado por componente, con su propósito y sus props.

## App

Punto de entrada de la interfaz. Mantiene el estado y monta la cabecera, el menú y el panel.

**Estado:**

- `moduloActivo` — id del módulo que se está mostrando.
- `idioma` — `'es'` o `'en'`, se conserva en `localStorage` bajo `curso-ia-idioma`.
- `temarioTraducido` — el temario base fusionado con las traducciones del idioma activo.
- `saltosTeclado` — contador que se incrementa en cada salto con teclado. `MenuModulos` lo usa
  para mover el foco al módulo activo, y así el anillo de foco no se queda señalando un módulo
  que ya no es el que se ve.

**Navegación por teclado:** `→` y `j` avanzan de módulo, `←` y `k` retroceden, de forma cíclica.
El listener vive en `window` y se ignora si el foco está en un `input`, `select` o `textarea`,
para no robarle las flechas al selector de idioma.

**Props:** ninguna.

## MenuModulos

Índice lateral de los nueve módulos, numerados `01`–`09`. Marca el activo con un filete rojo que
se desliza entre posiciones, y cierra con el progreso (`03 / 09`), una barra y el recordatorio de
atajos de teclado.

| Prop | Tipo | Para qué |
|---|---|---|
| `modulos` | `Modulo[]` | Los módulos ya traducidos. Es lo que se pinta. |
| `moduloActivo` | `string` | Id del módulo seleccionado. |
| `indiceActivo` | `number` | Posición del activo: numeral, progreso y desplazamiento del filete. |
| `saltosTeclado` | `number` | Al cambiar, el foco viaja al botón del módulo activo. |
| `onCambio` | `(id: string) => void` | Se llama al pulsar un módulo. |

Recibe los módulos por props en lugar de importar `temario` directamente: así el índice se
traduce igual que el panel.

## PanelModulo

Muestra un módulo: numeral de capítulo en contorno, título, subtítulo y las cuatro secciones
(`Claves`, `Comandos`, `Ficheros`, `Código`). La de código solo aparece si el módulo tiene
bloques: `Revision` y `RAG` son conceptuales y no tienen fichero que copiar. Si `modulo` es
`null`, pinta el estado vacío.

| Prop | Tipo | Para qué |
|---|---|---|
| `modulo` | `Modulo \| null` | El módulo a mostrar. |
| `indice` | `number` | Posición, para el numeral de capítulo. |
| `idioma` | `IdiomaTemario` | Rótulos de sección y textos del bloque de código. |

El `<article>` lleva `key={modulo.id}`: React lo remonta en cada cambio de módulo y eso vuelve a
disparar la animación de entrada escalonada de las secciones.

Lleva `min-width: 0`: es la celda `1fr` de la retícula, y sin eso el ancho intrínseco de un bloque
de código ensancharía el layout entero en pantallas estrechas.

El tope de `68ch` **no** está en `.panel-modulo` sino en `.panel-modulo__cabecera` y
`.panel-modulo__seccion`: es la medida de la prosa. La sección de código lleva además
`panel-modulo__seccion--codigo`, que lo anula para que el bloque ocupe la columna entera.

## BloqueCodigo

Un fragmento de código real del repositorio, con aspecto de editor: barra con la ruta del fichero,
el pie de qué enseña y un botón de copiar; debajo, el canalón de números de línea y el código
resaltado con Prism.

| Prop | Tipo | Para qué |
|---|---|---|
| `bloque` | `BloqueCodigo` | Ruta, lenguaje, pie y código. |
| `idioma` | `IdiomaTemario` | Textos del botón y de la etiqueta accesible. |

Detalles que importan:

- **Los números de línea no se copian.** Van en un `<pre>` aparte del código, con `aria-hidden`.
  Ese canalón es `position: sticky` para no perderse al desplazar el código en horizontal.
- **Sin ajuste de línea** (`white-space: pre`): si el código se ajustara, la numeración dejaría de
  cuadrar. El desbordamiento horizontal se resuelve con scroll dentro del bloque.
- **Sin scroll vertical propio.** El cuerpo solo desplaza en horizontal
  (`overflow-x: auto; overflow-y: hidden`); del alto se encarga el scroll de la página. Un bloque
  de 44 líneas se ve entero en vez de asomar por una ventanita. `overflow-y` tiene que ser
  `hidden` y no `visible`: el CSS convierte `visible` en `auto` cuando el otro eje es
  desplazable, y volvería la barra vertical.
- **El resaltado se calcula una vez** con `useMemo` y se inyecta con `dangerouslySetInnerHTML`. El
  HTML lo genera Prism a partir de ficheros del propio repositorio, no de entrada de usuario.
- **Copiar avisa.** El botón pasa a `Copiado` durante dos segundos y el cambio se anuncia por un
  `role="status"`. Sin contexto seguro no hay `navigator.clipboard`: entonces se muestra el aviso
  de copiar a mano en vez de fallar en silencio.

## SelectorIdioma

Desplegable nativo con `Español` / `English`.

| Prop | Tipo | Para qué |
|---|---|---|
| `idioma` | `IdiomaTemario` | Idioma actual. |
| `onCambio` | `(lang: IdiomaTemario) => void` | Se llama al cambiar la selección. |

## BotonDescargarPDF

Genera y descarga el temario en PDF con `generarPDF()`. Se deshabilita mientras genera y muestra
un indicador de carga.

| Prop | Tipo | Para qué |
|---|---|---|
| `temario` | `Temario` | El temario a volcar al PDF, bloques de código incluidos. |
| `idioma` | `IdiomaTemario` | Determina el nombre del fichero: `temario-es.pdf` o `temario-en.pdf`. |
