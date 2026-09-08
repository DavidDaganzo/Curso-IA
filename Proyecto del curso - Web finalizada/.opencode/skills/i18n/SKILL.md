---
name: i18n
description: Procedimiento obligatorio para añadir, cambiar o eliminar cualquier texto visible de la interfaz de este proyecto. Úsalo siempre que una tarea implique mostrar texto al usuario, incluidos botones, títulos, etiquetas, mensajes de error y textos de ayuda.
---

## Cómo se añade texto a la interfaz

En este proyecto no se admite texto literal dentro del JSX. Todo texto visible pasa por el
sistema de traducciones de `src/i18n`.

### Pasos

1. Añade la clave y su valor en `src/i18n/es.json`. Usa notación por secciones separadas por
   puntos, según la zona de la interfaz: `cabecera.titulo`, `buscador.placeholder`,
   `bloque.duracion`, `acciones.descargarPdf`.
2. En el componente, importa `t` desde `src/i18n` y usa `t('clave')`. Nunca escribas la
   cadena directamente en el JSX.
3. Si el texto lleva valores variables, define la clave con marcadores entre llaves
   (`{numero}`) y sustitúyelos en el punto de uso.
4. Antes de terminar, revisa el fichero que has tocado y comprueba que no queda ningún texto
   visible sin pasar por `t()`.

### Qué no hacer

- No crees ficheros de idioma nuevos si no se te ha pedido.
- No renombres claves existentes: si una cadena cambia de significado, crea una clave nueva.
- No metas HTML dentro de los valores del JSON.
- No uses la clave como texto de respaldo visible en producción: el helper ya devuelve la
  clave si falta la traducción, y eso es una señal de error, no un comportamiento deseado.
