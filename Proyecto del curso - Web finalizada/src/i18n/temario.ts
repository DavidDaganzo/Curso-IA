export interface TemarioI18nFichero {
  ruta: string;
  descripcion: string;
}

/* Del bloque de código solo se traduce el pie: el código en sí es el mismo. */
export interface TemarioI18nBloqueCodigo {
  descripcion: string;
}

export interface TemarioI18nModulo {
  titulo: string;
  subtitulo: string;
  puntos: string[];
  comandos: string[];
  ficheros: TemarioI18nFichero[];
  codigo?: TemarioI18nBloqueCodigo[];
}

export interface TemarioI18nCurso {
  titulo: string;
  subtitulo: string;
}

export interface TemarioI18n {
  curso: TemarioI18nCurso;
  modulos: Record<string, TemarioI18nModulo>;
}

export type IdiomaTemario = 'es' | 'en';

export async function loadTemarioI18n(lang: IdiomaTemario): Promise<TemarioI18n> {
  const module = await import(`./temario.${lang}.json`);
  return module.default as TemarioI18n;
}

export interface ModuloBaseBloqueCodigo {
  ruta: string;
  lenguaje: 'json' | 'markdown' | 'bash';
  descripcion: string;
  codigo: string;
}

export interface ModuloBase {
  id: string;
  titulo: string;
  subtitulo: string;
  puntos: string[];
  comandos: string[];
  ficheros: TemarioI18nFichero[];
  codigo: ModuloBaseBloqueCodigo[];
}

export interface TemarioBase {
  titulo: string;
  subtitulo: string;
  modulos: ModuloBase[];
}

export function mergeTemario(base: TemarioBase, i18n: TemarioI18n): TemarioBase {
  const modulosFusionados: ModuloBase[] = base.modulos.map((moduloBase) => {
    const moduloI18n = i18n.modulos[moduloBase.id];
    if (!moduloI18n) {
      return moduloBase;
    }
    return {
      ...moduloBase,
      titulo: moduloI18n.titulo,
      subtitulo: moduloI18n.subtitulo,
      puntos: moduloI18n.puntos,
      comandos: moduloI18n.comandos,
      ficheros: moduloI18n.ficheros,
      /*
        El código no se traduce, solo su pie. La fusión va por índice porque los
        dos arrays se mantienen a la vez; si falta el pie en un idioma, se queda
        el del fichero base.
      */
      codigo: moduloBase.codigo.map((bloque, i) => ({
        ...bloque,
        descripcion: moduloI18n.codigo?.[i]?.descripcion ?? bloque.descripcion,
      })),
    };
  });

  return {
    titulo: i18n.curso.titulo,
    subtitulo: i18n.curso.subtitulo,
    modulos: modulosFusionados,
  };
}