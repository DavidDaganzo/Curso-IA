/*
  El código que se enseña en el temario no se copia a mano: se lee del propio
  repositorio. Así lo que ve el alumno en pantalla no puede desviarse de lo que
  hay en disco.

  - Los ficheros completos entran con el sufijo `?raw` de Vite.
  - Los fragmentos de `opencode.json` se re-serializan desde el JSON importado.
    Los prompts ya viven en el fichero en una sola línea con `\n` escapados, así
    que `JSON.stringify(valor, null, 2)` devuelve el original.
*/

import config from '../../opencode.json';
import agentsMd from '../../AGENTS.md?raw';
import commitMd from '../../.opencode/commands/commit.md?raw';
import skillI18nMd from '../../.opencode/skills/i18n/SKILL.md?raw';

const json = (valor: unknown): string => JSON.stringify(valor, null, 2);

/* El salto final del fichero saldría como una línea vacía numerada. */
const recortar = (texto: string): string => texto.trimEnd();

export const ejemploAgentes = json({
  agent: {
    orchestrator: config.agent.orchestrator,
    architect: config.agent.architect,
  },
});

export const ejemploEquipo = json({ agent: config.agent });

export const ejemploInstructions = json({ instructions: config.instructions });

export const ejemploMcp = json({ mcp: config.mcp });

export const ejemploReglas = recortar(agentsMd);
export const ejemploComando = recortar(commitMd);
export const ejemploSkill = recortar(skillI18nMd);
