# curso-ia-opencode

Web de una sola página que muestra el temario del curso "IA aplicada a la programación",
organizado en módulos navegables desde un menú lateral.

## Cómo se arranca

```bash
npm install
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # comprobación de tipos y compilación de producción
```

## Arquitectura

- **Vite + React + TypeScript.** Sin librerías de estilos: CSS plano, un fichero por componente.
- **`TEMARIO.md`** es la fuente de contenido legible: nueve módulos, cada uno con subtítulo, puntos,
  comandos y ficheros.
- **`src/data/modulos.ts`** es ese mismo contenido volcado a datos tipados, y la única fuente que
  consumen los componentes.
- **`src/i18n/`** contiene las cadenas visibles de la interfaz y el helper `t(clave)`.
- El estado del módulo seleccionado se mantiene en `App` y baja por props. No hay gestor de estado
  global: el proyecto no lo necesita.

## Convenciones de este proyecto

- Cada componente vive en `src/components/<Nombre>/index.tsx`, con su CSS en la misma carpeta.
- Los nombres de componentes, props y ficheros van en español, como el resto del proyecto.
- El contenido de los módulos solo se lee de `src/data/modulos.ts`. No se duplica en los componentes.
- No se añaden dependencias sin preguntar antes.
- Después de cada cambio funcional, actualiza la documentación de `docs/` que se vea afectada.
  No hace falta que te lo pida.
