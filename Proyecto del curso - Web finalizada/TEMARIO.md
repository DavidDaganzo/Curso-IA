<!--
  CONTENIDO DEL CURSO — se copia a la RAÍZ del proyecto y se referencia con @TEMARIO.md

  Estructura fija, un bloque por módulo, siempre en este orden:
    ## Título del módulo
    > Subtítulo
    - Punto (uno o varios)
    **Comandos:** lista separada por comas
    **Ficheros:** `ruta` — para qué sirve (una línea por fichero, o "ninguno")
    **Código:** `ruta` — qué enseña el fragmento (o se omite si el módulo no tiene fichero)

  El código NO se escribe aquí: se lee del propio repositorio desde src/data/ejemplos.ts.
  Esta línea solo dice qué fragmento le toca a cada módulo.

  El id de cada módulo es la primera palabra del título en minúsculas y sin acentos.
-->

# IA aplicada a la programación

Agentes de código en la terminal con opencode · 84 minutos

---

## Agentes

> Un agente es modelo + prompt + permisos

- Build tiene acceso sin restricciones: edita ficheros y ejecuta comandos.
- Plan es el mismo modelo con edit y bash denegados. No es más tonto: tiene las manos atadas.
- Tab no alterna dos modos fijos: cicla entre todos los agentes primarios que tengas configurados.
- El campo mode acepta primary, subagent o all. Si lo omites, es all.
- Los subagentes se invocan con @, y trabajan en su propio contexto.
- permission.task decide a qué subagentes puede llamar cada agente.

**Comandos:** `Tab`, `@subagente`, `/help`

**Ficheros:**
- `opencode.json` — Definir agentes en el bloque agent
- `~/.config/opencode/agents/<nombre>.md` — Definirlos como markdown, alternativa

**Código:** `opencode.json` — Un primario y un subagente: lo que cambia es mode y permission

---

## Equipo

> Escribir cómo trabaja tu equipo y dejarlo en el repositorio

- orchestrator: coordina y delega. Tiene edit denegado, así que no puede hacerlo él.
- architect: define estructura, componentes y tipos. Tampoco escribe código.
- developer: el único con manos. Y el más acotado: no amplía alcance ni añade dependencias.
- reviewer: valida y termina con un veredicto, APTO o CAMBIOS NECESARIOS. Quien revisa, no arregla.
- Lo que hace que funcione no es el prompt, son los permisos: una instrucción se puede ignorar, un permiso no.
- El coste es real: más lento y más caro. Merece la pena en tareas grandes, para separar diseño de ejecución, y para tener una revisión no contaminada.

**Comandos:** `permission.task`, `edit: deny`, `@architect`, `@developer`, `@reviewer`

**Ficheros:**
- `opencode.json` — Los cuatro agentes y sus permisos

**Código:** `opencode.json` — Los cuatro agentes del equipo, con sus permisos

---

## Revision

> Tu trabajo pasa de escribir código a revisarlo

- Capa 1, el diff: ¿ha tocado ficheros que no esperabas? ¿ha añadido dependencias? ¿están los casos límite?
- Capa 2, pedirle cuentas: que resuma qué ha cambiado y por qué. No lo reconstruyas a mano.
- Capa 3, un revisor sin manos: con edit denegado revisa y no puede arreglar, y llega sin los sesgos de la conversación donde se escribió el código.
- Sin configurar nada: Tab hasta Plan y preguntar desde ahí. Mismo efecto.
- /undo revierte el último cambio del agente. Si se fue por un camino que no te gusta, deshaz y reformula.
- Los permisos evitan que lo haga, el diff y el revisor te dejan verlo, /undo te deja quitarlo.

**Comandos:** `/undo`, `/redo`, `/share`, `@reviewer`

**Ficheros:** ninguno

---

## Reglas

> El agente no falla por tonto, falla por desinformado

- AGENTS.md es un markdown en la raíz del repositorio que se carga siempre en el contexto.
- /init lo genera leyendo el proyecto. Lo que produce es un buen borrador, no la verdad: ábrelo y corrígelo.
- Mete las rarezas del proyecto, eso que un nuevo tarda dos semanas en descubrir. No metas la novela: ocupa contexto en cada petición.
- Se commitea, así que el equipo entero trabaja con las mismas reglas. Y también los agentes.
- Precedencia: el del proyecto subiendo por el árbol, luego el global, y CLAUDE.md como último recurso. Gana el primero que se encuentra.
- El del proyecto para las reglas del equipo; el global solo para tus preferencias personales.

**Comandos:** `/init`

**Ficheros:**
- `AGENTS.md` — Reglas del proyecto, se commitea
- `~/.config/opencode/AGENTS.md` — Tus preferencias personales

**Código:** `AGENTS.md` — Las reglas de este mismo proyecto, tal cual se commitean

---

## Documentacion

> El agente escribe la documentación y la documentación mejora al agente

- Documentar es la tarea con mejor relación esfuerzo/resultado: el agente puede leerse el proyecto entero.
- La documentación vive en docs/, versionada con el código, y se revisa en la misma MR que el cambio.
- Con instructions la enganchas como contexto, y admite rutas, URLs y globs.
- Mantenerla al día es algo que debe pasar siempre, así que su sitio es una regla de AGENTS.md, no un comando.
- El coste de esa regla: se carga en todas las peticiones y se aplica también a los cambios triviales.

**Comandos:** `instructions: ["docs/**/*.md"]`

**Ficheros:**
- `docs/ARQUITECTURA.md` — Estructura y flujo de datos
- `docs/COMPONENTES.md` — Un apartado por componente
- `opencode.json` — El campo instructions

**Código:** `opencode.json` — El campo instructions engancha docs/ como contexto

---

## Comandos

> El cuerpo no es un texto fijo: es una plantilla

- Un markdown en .opencode/commands/. El nombre del fichero es el nombre del comando.
- El frontmatter lleva description, y opcionalmente agent o model. El cuerpo es el prompt.
- Con la sintaxis de shell entre acentos graves, opencode ejecuta el comando y pega su salida en el prompt.
- Con @fichero se sustituye por el contenido del fichero.
- Con $ARGUMENTS, $1 o $2 entra lo que escribas detrás del comando.
- Por eso /commit sabe qué has cambiado: no se lo cuentas tú, lo trae el git diff dentro del prompt.
- Commitear es el ejemplo perfecto de comando porque es una decisión tuya: lo lanzas cuando quieres.

**Comandos:** `/commit`, `$ARGUMENTS`, `@fichero`

**Ficheros:**
- `.opencode/commands/commit.md` — El comando /commit

**Código:** `.opencode/commands/commit.md` — Frontmatter, salida de shell y $ARGUMENTS en un solo comando

---

## Skills

> Procedimientos que el agente carga cuando ve que aplican

- Instrucciones reutilizables que el agente descubre y carga a demanda. Soporte nativo, sin plugins.
- De entrada solo ve el nombre y la descripción; si le encaja, llama a la herramienta skill y entonces carga el contenido.
- La descripción es lo único que ve antes de decidir: se escribe pensando en cuándo activarlo, no en qué contiene.
- El name del frontmatter debe coincidir con el nombre de la carpeta.
- La regla: si aplica siempre, AGENTS.md. Si lo lanzas tú, comando. Si aplica a veces y el agente puede reconocer cuándo, skill.
- Ejemplos buenos: añadir una cadena traducida, preparar una release, un checklist de accesibilidad. Procedimientos con pasos, que no aplican siempre.

**Comandos:** `herramienta skill`

**Ficheros:**
- `.opencode/skills/<nombre>/SKILL.md` — Skill del proyecto
- `~/.config/opencode/skills/<nombre>/SKILL.md` — Skill global

**Código:** `.opencode/skills/i18n/SKILL.md` — La skill de traducciones de este proyecto

---

## RAG

> Recuperar solo lo relevante e inyectarlo en el prompt

- En vez de meterle todo al modelo, recuperas lo que hace falta y lo metes en el prompt.
- El giro: los agentes de código apenas usan RAG vectorial con embeddings.
- Hacen búsqueda agéntica con grep, glob y read: buscan como buscaría un desarrollador.
- Para código funciona mejor, porque hay estructura y nombres exactos, no similitud difusa.
- Las tres formas reales de recuperación en opencode son instructions, skills y MCP.

**Comandos:** `grep`, `glob`, `read`

**Ficheros:** ninguno

---

## MCP

> Un modelo no tiene manos. MCP se las pone

- Un estándar para darle herramientas nuevas al agente sin que el fabricante las programe.
- Se configuran en tres líneas: remotos por URL, o locales por comando.
- Con Playwright el agente maneja un navegador de verdad: abre tu aplicación, interactúa y te cuenta qué ha visto.
- Eso convierte "confía en mí, funciona" en una comprobación real: es una capa más de revisión.
- Los que más valen desde el primer día: navegador, documentación actualizada y GitLab.

**Comandos:** `npx @playwright/mcp@latest`

**Ficheros:**
- `opencode.json` — El bloque mcp

**Código:** `opencode.json` — Playwright como servidor MCP local, en tres líneas
