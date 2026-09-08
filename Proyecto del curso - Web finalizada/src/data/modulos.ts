import {
  ejemploAgentes,
  ejemploEquipo,
  ejemploInstructions,
  ejemploMcp,
  ejemploReglas,
  ejemploComando,
  ejemploSkill,
} from './ejemplos';

export interface Fichero {
  ruta: string;
  descripcion: string;
}

export type LenguajeCodigo = 'json' | 'markdown' | 'bash';

export interface BloqueCodigo {
  ruta: string;
  lenguaje: LenguajeCodigo;
  descripcion: string;
  codigo: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  subtitulo: string;
  puntos: string[];
  comandos: string[];
  ficheros: Fichero[];
  /* Vacío en los módulos conceptuales, que no tienen fichero que copiar. */
  codigo: BloqueCodigo[];
}

export interface Temario {
  titulo: string;
  subtitulo: string;
  modulos: Modulo[];
}

export const temario: Temario = {
  titulo: "IA aplicada a la programación",
  subtitulo: "Agentes de código en la terminal con opencode · 84 minutos",
  modulos: [
    {
      id: "agentes",
      titulo: "Agentes",
      subtitulo: "Un agente es modelo + prompt + permisos",
      puntos: [
        "Build tiene acceso sin restricciones: edita ficheros y ejecuta comandos.",
        "Plan es el mismo modelo con edit y bash denegados. No es más tonto: tiene las manos atadas.",
        "Tab no alterna dos modos fijos: cicla entre todos los agentes primarios que tengas configurados.",
        "El campo mode acepta primary, subagent o all. Si lo omites, es all.",
        "Los subagentes se invocan con @, y trabajan en su propio contexto.",
        "permission.task decide a qué subagentes puede llamar cada agente.",
      ],
      comandos: ["Tab", "@subagente", "/help"],
      ficheros: [
        { ruta: "opencode.json", descripcion: "Definir agentes en el bloque agent" },
        { ruta: "~/.config/opencode/agents/<nombre>.md", descripcion: "Definirlos como markdown, alternativa" },
      ],
      codigo: [
        {
          ruta: "opencode.json",
          lenguaje: "json",
          descripcion: "Un primario y un subagente: lo que cambia es mode y permission",
          codigo: ejemploAgentes,
        },
      ],
    },
    {
      id: "equipo",
      titulo: "Equipo",
      subtitulo: "Escribir cómo trabaja tu equipo y dejarlo en el repositorio",
      puntos: [
        "orchestrator: coordina y delega. Tiene edit denegado, así que no puede hacerlo él.",
        "architect: define estructura, componentes y tipos. Tampoco escribe código.",
        "developer: el único con manos. Y el más acotado: no amplía alcance ni añade dependencias.",
        "reviewer: valida y termina con un veredicto, APTO o CAMBIOS NECESARIOS. Quien revisa, no arregla.",
        "Lo que hace que funcione no es el prompt, son los permisos: una instrucción se puede ignorar, un permiso no.",
        "El coste es real: más lento y más caro. Merece la pena en tareas grandes, para separar diseño de ejecución, y para tener una revisión no contaminada.",
      ],
      comandos: ["permission.task", "edit: deny", "@architect", "@developer", "@reviewer"],
      ficheros: [
        { ruta: "opencode.json", descripcion: "Los cuatro agentes y sus permisos" },
      ],
      codigo: [
        {
          ruta: "opencode.json",
          lenguaje: "json",
          descripcion: "Los cuatro agentes del equipo, con sus permisos",
          codigo: ejemploEquipo,
        },
      ],
    },
    {
      id: "revision",
      titulo: "Revision",
      subtitulo: "Tu trabajo pasa de escribir código a revisarlo",
      puntos: [
        "Capa 1, el diff: ¿ha tocado ficheros que no esperabas? ¿ha añadido dependencias? ¿están los casos límite?",
        "Capa 2, pedirle cuentas: que resuma qué ha cambiado y por qué. No lo reconstruyas a mano.",
        "Capa 3, un revisor sin manos: con edit denegado revisa y no puede arreglar, y llega sin los sesgos de la conversación donde se escribió el código.",
        "Sin configurar nada: Tab hasta Plan y preguntar desde ahí. Mismo efecto.",
        "/undo revierte el último cambio del agente. Si se fue por un camino que no te gusta, deshaz y reformula.",
        "Los permisos evitan que lo haga, el diff y el revisor te dejan verlo, /undo te deja quitarlo.",
      ],
      comandos: ["/undo", "/redo", "/share", "@reviewer"],
      ficheros: [],
      codigo: [],
    },
    {
      id: "reglas",
      titulo: "Reglas",
      subtitulo: "El agente no falla por tonto, falla por desinformado",
      puntos: [
        "AGENTS.md es un markdown en la raíz del repositorio que se carga siempre en el contexto.",
        "/init lo genera leyendo el proyecto. Lo que produce es un buen borrador, no la verdad: ábrelo y corrígelo.",
        "Mete las rarezas del proyecto, eso que un nuevo tarda dos semanas en descubrir. No metas la novela: ocupa contexto en cada petición.",
        "Se commitea, así que el equipo entero trabaja con las mismas reglas. Y también los agentes.",
        "Precedencia: el del proyecto subiendo por el árbol, luego el global, y CLAUDE.md como último recurso. Gana el primero que se encuentra.",
        "El del proyecto para las reglas del equipo; el global solo para tus preferencias personales.",
      ],
      comandos: ["/init"],
      ficheros: [
        { ruta: "AGENTS.md", descripcion: "Reglas del proyecto, se commitea" },
        { ruta: "~/.config/opencode/AGENTS.md", descripcion: "Tus preferencias personales" },
      ],
      codigo: [
        {
          ruta: "AGENTS.md",
          lenguaje: "markdown",
          descripcion: "Las reglas de este mismo proyecto, tal cual se commitean",
          codigo: ejemploReglas,
        },
      ],
    },
    {
      id: "documentacion",
      titulo: "Documentacion",
      subtitulo: "El agente escribe la documentación y la documentación mejora al agente",
      puntos: [
        "Documentar es la tarea con mejor relación esfuerzo/resultado: el agente puede leerse el proyecto entero.",
        "La documentación vive en docs/, versionada con el código, y se revisa en la misma MR que el cambio.",
        "Con instructions la enganchas como contexto, y admite rutas, URLs y globs.",
        "Mantenerla al día es algo que debe pasar siempre, así que su sitio es una regla de AGENTS.md, no un comando.",
        "El coste de esa regla: se carga en todas las peticiones y se aplica también a los cambios triviales.",
      ],
      comandos: ['instructions: ["docs/**/*.md"]'],
      ficheros: [
        { ruta: "docs/ARQUITECTURA.md", descripcion: "Estructura y flujo de datos" },
        { ruta: "docs/COMPONENTES.md", descripcion: "Un apartado por componente" },
        { ruta: "opencode.json", descripcion: "El campo instructions" },
      ],
      codigo: [
        {
          ruta: "opencode.json",
          lenguaje: "json",
          descripcion: "El campo instructions engancha docs/ como contexto",
          codigo: ejemploInstructions,
        },
      ],
    },
    {
      id: "comandos",
      titulo: "Comandos",
      subtitulo: "El cuerpo no es un texto fijo: es una plantilla",
      puntos: [
        "Un markdown en .opencode/commands/. El nombre del fichero es el nombre del comando.",
        "El frontmatter lleva description, y opcionalmente agent o model. El cuerpo es el prompt.",
        "Con la sintaxis de shell entre acentos graves, opencode ejecuta el comando y pega su salida en el prompt.",
        "Con @fichero se sustituye por el contenido del fichero.",
        "Con $ARGUMENTS, $1 o $2 entra lo que escribas detrás del comando.",
        "Por eso /commit sabe qué has cambiado: no se lo cuentas tú, lo trae el git diff dentro del prompt.",
        "Commitear es el ejemplo perfecto de comando porque es una decisión tuya: lo lanzas cuando quieres.",
      ],
      comandos: ["/commit", "$ARGUMENTS", "@fichero"],
      ficheros: [
        { ruta: ".opencode/commands/commit.md", descripcion: "El comando /commit" },
      ],
      codigo: [
        {
          ruta: ".opencode/commands/commit.md",
          lenguaje: "markdown",
          descripcion: "Frontmatter, salida de shell y $ARGUMENTS en un solo comando",
          codigo: ejemploComando,
        },
      ],
    },
    {
      id: "skills",
      titulo: "Skills",
      subtitulo: "Procedimientos que el agente carga cuando ve que aplican",
      puntos: [
        "Instrucciones reutilizables que el agente descubre y carga a demanda. Soporte nativo, sin plugins.",
        "De entrada solo ve el nombre y la descripción; si le encaja, llama a la herramienta skill y entonces carga el contenido.",
        "La descripción es lo único que ve antes de decidir: se escribe pensando en cuándo activarlo, no en qué contiene.",
        "El name del frontmatter debe coincidir con el nombre de la carpeta.",
        "La regla: si aplica siempre, AGENTS.md. Si lo lanzas tú, comando. Si aplica a veces y el agente puede reconocer cuándo, skill.",
        "Ejemplos buenos: añadir una cadena traducida, preparar una release, un checklist de accesibilidad. Procedimientos con pasos, que no aplican siempre.",
      ],
      comandos: ["herramienta skill"],
      ficheros: [
        { ruta: ".opencode/skills/<nombre>/SKILL.md", descripcion: "Skill del proyecto" },
        { ruta: "~/.config/opencode/skills/<nombre>/SKILL.md", descripcion: "Skill global" },
      ],
      codigo: [
        {
          ruta: ".opencode/skills/i18n/SKILL.md",
          lenguaje: "markdown",
          descripcion: "La skill de traducciones de este proyecto",
          codigo: ejemploSkill,
        },
      ],
    },
    {
      id: "rag",
      titulo: "RAG",
      subtitulo: "Recuperar solo lo relevante e inyectarlo en el prompt",
      puntos: [
        "En vez de meterle todo al modelo, recuperas lo que hace falta y lo metes en el prompt.",
        "El giro: los agentes de código apenas usan RAG vectorial con embeddings.",
        "Hacen búsqueda agéntica con grep, glob y read: buscan como buscaría un desarrollador.",
        "Para código funciona mejor, porque hay estructura y nombres exactos, no similitud difusa.",
        "Las tres formas reales de recuperación en opencode son instructions, skills y MCP.",
      ],
      comandos: ["grep", "glob", "read"],
      ficheros: [],
      codigo: [],
    },
    {
      id: "mcp",
      titulo: "MCP",
      subtitulo: "Un modelo no tiene manos. MCP se las pone",
      puntos: [
        "Un estándar para darle herramientas nuevas al agente sin que el fabricante las programe.",
        "Se configuran en tres líneas: remotos por URL, o locales por comando.",
        "Con Playwright el agente maneja un navegador de verdad: abre tu aplicación, interactúa y te cuenta qué ha visto.",
        "Eso convierte \"confía en mí, funciona\" en una comprobación real: es una capa más de revisión.",
        "Los que más valen desde el primer día: navegador, documentación actualizada y GitLab.",
      ],
      comandos: ["npx @playwright/mcp@latest"],
      ficheros: [
        { ruta: "opencode.json", descripcion: "El bloque mcp" },
      ],
      codigo: [
        {
          ruta: "opencode.json",
          lenguaje: "json",
          descripcion: "Playwright como servidor MCP local, en tres líneas",
          codigo: ejemploMcp,
        },
      ],
    },
  ],
};

export type {
  TemarioI18nFichero,
  TemarioI18nModulo,
  TemarioI18nCurso,
  TemarioI18n,
  IdiomaTemario,
  ModuloBase,
  TemarioBase,
} from '../i18n/temario';

export { loadTemarioI18n, mergeTemario } from '../i18n/temario';