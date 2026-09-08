import type { CSSProperties } from 'react'
import { t } from '../../i18n'
import type { Modulo, Fichero } from '../../data/modulos'
import type { IdiomaTemario } from '../../i18n/temario'
import BloqueCodigo from '../BloqueCodigo'
import './index.css'

interface PanelModuloProps {
  modulo: Modulo | null
  indice: number
  idioma: IdiomaTemario
}

function ListaPuntos({ puntos, clase }: { puntos: string[]; clase: string }) {
  if (!puntos.length) return null
  return (
    <ul className={clase}>
      {puntos.map((punto, i) => (
        <li key={i}>{punto}</li>
      ))}
    </ul>
  )
}

function ListaComandos({ comandos, clase }: { comandos: string[]; clase: string }) {
  if (!comandos.length) return null
  return (
    <ul className={clase}>
      {comandos.map((cmd, i) => (
        <li key={i}><code>{cmd}</code></li>
      ))}
    </ul>
  )
}

function ListaFicheros({ ficheros, clase }: { ficheros: Fichero[]; clase: string }) {
  if (!ficheros.length) return null
  return (
    <ul className={clase}>
      {ficheros.map((f, i) => (
        <li key={i}>
          <code>{f.ruta}</code>
          <span className="panel-modulo__guia" aria-hidden="true" />
          <span className="panel-modulo__descripcion">{f.descripcion}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PanelModulo({ modulo, indice, idioma }: PanelModuloProps) {
  if (!modulo) {
    return (
      <div className="panel-modulo panel-modulo--vacio">
        <p>{t('panel.seleccionar', idioma)}</p>
      </div>
    )
  }

  const numeral = String(indice + 1).padStart(2, '0')

  /*
    La `key` remonta el artículo en cada cambio de módulo. Es lo que vuelve a
    disparar la animación de entrada escalonada de las secciones.
  */
  return (
    <article className="panel-modulo" key={modulo.id}>
      <header className="panel-modulo__cabecera" style={{ '--i': 0 } as CSSProperties}>
        <span className="panel-modulo__numeral" aria-hidden="true">{numeral}</span>
        <h2 className="panel-modulo__titulo">{modulo.titulo}</h2>
        <p className="panel-modulo__subtitulo">{modulo.subtitulo}</p>
      </header>

      <section className="panel-modulo__seccion" style={{ '--i': 1 } as CSSProperties}>
        <h3 className="panel-modulo__subtitulo-seccion">{t('panel.puntos', idioma)}</h3>
        <ListaPuntos puntos={modulo.puntos} clase="panel-modulo__lista-puntos" />
      </section>

      <section className="panel-modulo__seccion" style={{ '--i': 2 } as CSSProperties}>
        <h3 className="panel-modulo__subtitulo-seccion">{t('panel.comandos', idioma)}</h3>
        <ListaComandos comandos={modulo.comandos} clase="panel-modulo__lista-comandos" />
      </section>

      <section className="panel-modulo__seccion" style={{ '--i': 3 } as CSSProperties}>
        <h3 className="panel-modulo__subtitulo-seccion">{t('panel.ficheros', idioma)}</h3>
        <ListaFicheros ficheros={modulo.ficheros} clase="panel-modulo__lista-ficheros" />
      </section>

      {modulo.codigo.length > 0 && (
        <section
          className="panel-modulo__seccion panel-modulo__seccion--codigo"
          style={{ '--i': 4 } as CSSProperties}
        >
          <h3 className="panel-modulo__subtitulo-seccion">{t('panel.codigo', idioma)}</h3>
          {modulo.codigo.map((bloque, i) => (
            <BloqueCodigo key={i} bloque={bloque} idioma={idioma} />
          ))}
        </section>
      )}
    </article>
  )
}
