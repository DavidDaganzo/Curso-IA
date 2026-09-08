# IA aplicada a la programación

Curso práctico sobre **agentes de código en la terminal** con [opencode](https://opencode.ai).
84 minutos, nueve módulos, y una web construida en directo por un equipo de agentes.

Este repositorio contiene los tres materiales del curso: la presentación, el proyecto
terminado y los prompts que se lanzan en clase.

---

## Contenido del repositorio

| Ruta | Qué es |
|---|---|
| `Presentacion.html` | La presentación completa. Un único fichero HTML, sin dependencias ni build: se abre haciendo doble clic. |
| `Promts.txt` | Los dos prompts que se lanzan en la demo en vivo: el del equipo de agentes y el de las skills. |
| `Proyecto del curso - Web finalizada/` | El proyecto terminado: la web del temario que el equipo de agentes construye durante la clase, con toda la configuración de opencode que se explica en los módulos. |

---

## Temario

Nueve módulos. Cada uno se explica en la presentación y tiene su fichero real
correspondiente en el proyecto, para que el alumno se lo lleve.

### 1. Agentes — *un agente es modelo + prompt + permisos*

- `build` tiene acceso sin restricciones: edita ficheros y ejecuta comandos.
- `plan` es el mismo modelo con `edit` y `bash` denegados. No es más tonto: tiene las manos atadas.
- `Tab` no alterna dos modos fijos: cicla entre todos los agentes primarios configurados.
- El campo `mode` acepta `primary`, `subagent` o `all`.
- Los subagentes se invocan con `@` y trabajan en su propio contexto.
- `permission.task` decide a qué subagentes puede llamar cada agente.

**Comandos:** `Tab`, `@subagente`, `/help`
**Ficheros:** `opencode.json`, `~/.config/opencode/agents/<nombre>.md`

### 2. Equipo — *escribir cómo trabaja tu equipo y dejarlo en el repositorio*

- `orchestrator`: coordina y delega. Tiene `edit` denegado, así que no puede hacerlo él.
- `architect`: define estructura, componentes y tipos. Tampoco escribe código.
- `developer`: el único con manos, y el más acotado: no amplía alcance ni añade dependencias.
- `reviewer`: valida y termina con un veredicto, APTO o CAMBIOS NECESARIOS. Quien revisa, no arregla.
- Lo que hace que funcione no es el prompt, son los permisos: una instrucción se puede ignorar, un permiso no.
- El coste es real: más lento y más caro. Merece la pena en tareas grandes.

**Comandos:** `permission.task`, `edit: deny`, `@architect`, `@developer`, `@reviewer`
**Ficheros:** `opencode.json`

### 3. Revisión — *tu trabajo pasa de escribir código a revisarlo*

- Capa 1, el diff: ¿ha tocado ficheros que no esperabas? ¿ha añadido dependencias? ¿están los casos límite?
- Capa 2, pedirle cuentas: que resuma qué ha cambiado y por qué.
- Capa 3, un revisor sin manos: con `edit` denegado revisa sin poder arreglar, y llega sin los sesgos de la conversación donde se escribió el código.
- Sin configurar nada: `Tab` hasta Plan y preguntar desde ahí.
- `/undo` revierte el último cambio del agente.

**Comandos:** `/undo`, `/redo`, `/share`, `@reviewer`

### 4. Reglas — *el agente no falla por tonto, falla por desinformado*

- `AGENTS.md` es un markdown en la raíz que se carga siempre en el contexto.
- `/init` lo genera leyendo el proyecto: es un buen borrador, no la verdad.
- Mete las rarezas del proyecto, no la novela: ocupa contexto en cada petición.
- Se commitea, así que el equipo entero —y sus agentes— trabaja con las mismas reglas.
- Precedencia: el del proyecto subiendo por el árbol, luego el global, y `CLAUDE.md` como último recurso.

**Comandos:** `/init`
**Ficheros:** `AGENTS.md`, `~/.config/opencode/AGENTS.md`

### 5. Documentación — *el agente escribe la documentación y la documentación mejora al agente*

- Documentar es la tarea con mejor relación esfuerzo/resultado: el agente puede leerse el proyecto entero.
- La documentación vive en `docs/`, versionada con el código.
- Con `instructions` la enganchas como contexto: admite rutas, URLs y globs.
- Mantenerla al día es una regla de `AGENTS.md`, no un comando.
- El coste: se carga en todas las peticiones, también en cambios triviales.

**Comandos:** `instructions: ["docs/**/*.md"]`
**Ficheros:** `docs/ARQUITECTURA.md`, `docs/COMPONENTES.md`, `opencode.json`

### 6. Comandos — *el cuerpo no es un texto fijo: es una plantilla*

- Un markdown en `.opencode/commands/`. El nombre del fichero es el nombre del comando.
- El frontmatter lleva `description`, y opcionalmente `agent` o `model`. El cuerpo es el prompt.
- Con sintaxis de shell entre acentos graves, opencode ejecuta el comando y pega su salida en el prompt.
- Con `@fichero` se sustituye por el contenido del fichero.
- Con `$ARGUMENTS`, `$1` o `$2` entra lo que escribas detrás del comando.
- Por eso `/commit` sabe qué has cambiado: lo trae el `git diff` dentro del prompt.

**Comandos:** `/commit`, `$ARGUMENTS`, `@fichero`
**Ficheros:** `.opencode/commands/commit.md`

### 7. Skills — *procedimientos que el agente carga cuando ve que aplican*

- Instrucciones reutilizables que el agente descubre y carga a demanda. Soporte nativo, sin plugins.
- De entrada solo ve el nombre y la descripción; si le encaja, llama a la herramienta `skill`.
- La descripción se escribe pensando en **cuándo** activarlo, no en qué contiene.
- El `name` del frontmatter debe coincidir con el nombre de la carpeta.
- La regla: si aplica siempre, `AGENTS.md`. Si lo lanzas tú, comando. Si aplica a veces y el agente puede reconocer cuándo, skill.

**Comandos:** herramienta `skill`
**Ficheros:** `.opencode/skills/<nombre>/SKILL.md`, `~/.config/opencode/skills/<nombre>/SKILL.md`

### 8. RAG — *recuperar solo lo relevante e inyectarlo en el prompt*

- En vez de meterle todo al modelo, recuperas lo que hace falta.
- El giro: los agentes de código apenas usan RAG vectorial con embeddings.
- Hacen búsqueda agéntica con `grep`, `glob` y `read`: buscan como buscaría un desarrollador.
- Para código funciona mejor, porque hay estructura y nombres exactos, no similitud difusa.
- Las tres formas reales de recuperación en opencode son `instructions`, skills y MCP.

**Comandos:** `grep`, `glob`, `read`

### 9. MCP — *un modelo no tiene manos, MCP se las pone*

- Un estándar para darle herramientas nuevas al agente sin que el fabricante las programe.
- Se configuran en tres líneas: remotos por URL, o locales por comando.
- Con Playwright el agente maneja un navegador de verdad: abre tu aplicación, interactúa y te cuenta qué ha visto.
- Eso convierte "confía en mí, funciona" en una comprobación real: una capa más de revisión.
- Los que más valen desde el primer día: navegador, documentación actualizada y GitLab.

**Comandos:** `npx @playwright/mcp@latest`
**Ficheros:** `opencode.json` (bloque `mcp`)

---

## La presentación

`Presentacion.html` es un deck autocontenido de 58 diapositivas. No necesita servidor:
ábrelo directamente en el navegador.

| Tecla | Acción |
|---|---|
| `→` `↓` `Espacio` `PageDown` | Siguiente diapositiva |
| `←` `↑` `PageUp` | Diapositiva anterior |
| `Home` / `End` | Primera / última |
| `G` | Vista general (rejilla); clic en una diapositiva para ir a ella |
| `N` | Mostrar u ocultar las notas del ponente |
| `F` | Pantalla completa |
| `?` | Ayuda de atajos |
| `Esc` | Cerrar ayuda o vista general |

Las tipografías se cargan desde Google Fonts, así que con conexión se ve tal cual;
sin ella cae a las tipografías de respaldo del sistema.

---

## Arrancar la web en local

La web del temario está en `Proyecto del curso - Web finalizada/`. Es Vite + React 19 +
TypeScript, sin librerías de estilos.

**Requisitos:** Node.js 20 o superior y npm.

```bash
cd "Proyecto del curso - Web finalizada"
npm install
npm run dev
```

Abre <http://localhost:5173>.

Otros scripts:

```bash
npm run build     # comprobación de tipos (tsc --noEmit) y compilación de producción
npm run preview   # sirve la compilación de producción
```

### Qué hace la web

Una sola página con un índice lateral de los nueve módulos y un panel de detalle.
Cada módulo muestra sus claves, comandos, ficheros y un bloque de código copiable.

- **El código que se ve en pantalla se lee del propio repositorio** con el sufijo `?raw` de Vite,
  así que no puede desviarse de lo que hay en disco.
- **Selector de idioma** español / inglés, con las traducciones en `src/i18n/`. Se conserva en
  `localStorage`.
- **Descarga del temario en PDF** en el idioma activo (`jspdf`).
- **Navegación por teclado:** `→` / `j` avanzan de módulo, `←` / `k` retroceden, de forma cíclica.
- **Se imprime bien:** hay un `@media print` que quita el cromo de la interfaz.

### Estructura del proyecto

```
Proyecto del curso - Web finalizada/
├─ TEMARIO.md              Fuente legible del contenido: un bloque por módulo
├─ AGENTS.md               Reglas del proyecto — módulo 4
├─ opencode.json           Agentes, permisos, instructions y MCP — módulos 1, 2, 5, 9
├─ docs/
│  ├─ ARQUITECTURA.md      Estructura y flujo de datos — módulo 5
│  └─ COMPONENTES.md       Un apartado por componente — módulo 5
├─ .opencode/
│  ├─ commands/commit.md   El comando /commit — módulo 6
│  └─ skills/i18n/SKILL.md La skill de traducciones — módulo 7
├─ index.html
├─ public/fonts/           Noto Sans, embebida en el PDF
└─ src/
   ├─ main.tsx             Punto de entrada de React
   ├─ App.tsx              Estado (módulo activo, idioma) y montaje de la interfaz
   ├─ index.css            Tokens de diseño y estilos base
   ├─ data/
   │  ├─ modulos.ts        El temario volcado a datos tipados
   │  └─ ejemplos.ts       El código real del repo, leído con ?raw
   ├─ components/
   │  ├─ MenuModulos/      Índice lateral, con el módulo activo resaltado
   │  ├─ PanelModulo/      Detalle del módulo
   │  ├─ BloqueCodigo/     Código resaltado con Prism, con botón de copiar
   │  ├─ SelectorIdioma/   Desplegable ES / EN
   │  └─ BotonDescargarPDF/
   ├─ i18n/                Cadenas de la interfaz y el temario traducido
   └─ utils/generarPDF.ts  Generación del PDF
```

---

## Los prompts de la demo

`Promts.txt` recoge los dos prompts que se lanzan en clase.

**1. Prompt del orquestador** — se le da al agente `orchestrator` (módulo 2) para que el equipo
construya la web desde `TEMARIO.md`. Pide tres piezas: `src/data/modulos.ts`, `MenuModulos` y
`PanelModulo`, insiste en copiar el texto tal cual, remite a las convenciones de `AGENTS.md`,
deja el reparto del trabajo en manos del agente y —esto es la gracia— no acepta la tarea por
terminada hasta que alguien la haya abierto en el navegador y confirmado que se ve bien, que es
lo que fuerza el uso del MCP de Playwright (módulo 9).

**2. Prompt de la demo de skills** — pide un selector de idioma con traducciones i18n en español
e inglés. Es una petición corta que no menciona ninguna skill: el agente reconoce que aplica la
skill `i18n` de `.opencode/skills/i18n/SKILL.md` y la carga por su cuenta (módulo 7).

---

## Reproducir la clase desde cero

1. Instala opencode y arranca con su capa gratuita.
2. Copia `TEMARIO.md`, `AGENTS.md` y `opencode.json` a un proyecto vacío de Vite + React + TypeScript.
3. Lanza el prompt del orquestador y deja trabajar al equipo.
4. Cuando la web esté en pie, lanza el prompt de las skills.
5. Compara el resultado con `Proyecto del curso - Web finalizada/`.
