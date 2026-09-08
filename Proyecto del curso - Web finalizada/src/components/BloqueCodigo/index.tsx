import { useEffect, useMemo, useRef, useState } from 'react'
import Prism from 'prismjs'
/*
  El orden importa: markdown depende de markup, así que markup va antes.
  bash es para el bloque de shell que vive dentro de AGENTS.md.
*/
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import { t } from '../../i18n'
import type { BloqueCodigo as Bloque } from '../../data/modulos'
import type { IdiomaTemario } from '../../i18n/temario'
import './index.css'

interface BloqueCodigoProps {
  bloque: Bloque
  idioma: IdiomaTemario
}

const MS_CONFIRMACION = 2000

export default function BloqueCodigo({ bloque, idioma }: BloqueCodigoProps) {
  const [copiado, setCopiado] = useState(false)
  const [error, setError] = useState(false)
  const temporizador = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (temporizador.current !== null) window.clearTimeout(temporizador.current)
    }
  }, [])

  /*
    El HTML lo genera Prism a partir de código del propio repositorio, no de
    entrada del usuario: no hay nada que sanear aquí.
  */
  const resaltado = useMemo(() => {
    const gramatica = Prism.languages[bloque.lenguaje]
    if (!gramatica) return escapar(bloque.codigo)
    return Prism.highlight(bloque.codigo, gramatica, bloque.lenguaje)
  }, [bloque.codigo, bloque.lenguaje])

  const numeros = useMemo(
    () => bloque.codigo.split('\n').map((_, i) => i + 1).join('\n'),
    [bloque.codigo]
  )

  async function copiar() {
    if (temporizador.current !== null) window.clearTimeout(temporizador.current)

    try {
      /* Sin contexto seguro no hay portapapeles: se avisa en vez de fallar en silencio. */
      if (!navigator.clipboard) throw new Error('sin portapapeles')
      await navigator.clipboard.writeText(bloque.codigo)
      setError(false)
      setCopiado(true)
    } catch {
      setCopiado(false)
      setError(true)
    }

    temporizador.current = window.setTimeout(() => {
      setCopiado(false)
      setError(false)
    }, MS_CONFIRMACION)
  }

  const etiquetaAria = t('codigo.copiarAria', idioma).replace('{ruta}', bloque.ruta)

  return (
    <figure className="bloque-codigo">
      <figcaption className="bloque-codigo__barra">
        <span className="bloque-codigo__ruta">{bloque.ruta}</span>
        <span className="bloque-codigo__nota">{bloque.descripcion}</span>
        <button
          type="button"
          className="bloque-codigo__copiar"
          onClick={copiar}
          aria-label={etiquetaAria}
          data-estado={copiado ? 'copiado' : error ? 'error' : 'listo'}
        >
          {copiado ? t('codigo.copiado', idioma) : t('codigo.copiar', idioma)}
        </button>
      </figcaption>

      <div className="bloque-codigo__cuerpo">
        <pre className="bloque-codigo__canalon" aria-hidden="true">{numeros}</pre>
        <pre className="bloque-codigo__pre">
          <code
            className={`language-${bloque.lenguaje}`}
            dangerouslySetInnerHTML={{ __html: resaltado }}
          />
        </pre>
      </div>

      <p className="solo-lectores" role="status" aria-live="polite">
        {copiado ? t('codigo.copiado', idioma) : ''}
        {error ? t('codigo.errorCopiar', idioma) : ''}
      </p>
    </figure>
  )
}

/* Respaldo si el lenguaje no está cargado: se muestra sin resaltar, pero seguro. */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
