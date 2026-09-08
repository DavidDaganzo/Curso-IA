import { useEffect, useRef, type CSSProperties } from 'react'
import { t } from '../../i18n'
import type { Modulo } from '../../data/modulos'
import './index.css'

export interface MenuModulosProps {
  modulos: Modulo[]
  moduloActivo: string
  indiceActivo: number
  /** Contador de saltos por teclado: al cambiar, el foco sigue al módulo activo. */
  saltosTeclado: number
  onCambio: (id: string) => void
}

/** Numeral de capítulo: 1 -> "01". */
function numeral(n: number): string {
  return String(n).padStart(2, '0')
}

export default function MenuModulos({
  modulos,
  moduloActivo,
  indiceActivo,
  saltosTeclado,
  onCambio,
}: MenuModulosProps) {
  const total = modulos.length
  const posicion = indiceActivo >= 0 ? indiceActivo : 0
  const listaRef = useRef<HTMLUListElement>(null)

  /*
    Si el cambio vino del teclado, el foco viaja con la selección: si no, el
    anillo se quedaría marcando un módulo que ya no es el que se está viendo.
  */
  useEffect(() => {
    if (saltosTeclado === 0) return
    listaRef.current
      ?.querySelector<HTMLButtonElement>('[aria-current="true"]')
      ?.focus()
  }, [saltosTeclado])

  return (
    <nav className="menu-modulos" aria-label={t('menu.titulo')}>
      <h2 className="menu-modulos__rotulo">{t('menu.titulo')}</h2>

      <ul
        ref={listaRef}
        className="menu-modulos__lista"
        style={{ '--activo': posicion } as CSSProperties}
      >
        {modulos.map((modulo, i) => (
          <li
            key={modulo.id}
            className="menu-modulos__item"
            style={{ '--indice': i } as CSSProperties}
          >
            <button
              className={`menu-modulos__boton ${modulo.id === moduloActivo ? 'menu-modulos__boton--activo' : ''}`}
              onClick={() => onCambio(modulo.id)}
              aria-current={modulo.id === moduloActivo ? 'true' : 'false'}
            >
              <span className="menu-modulos__id">{numeral(i + 1)}</span>
              <span className="menu-modulos__etiqueta">{modulo.titulo}</span>
            </button>
          </li>
        ))}
      </ul>

      <footer className="menu-modulos__pie">
        <p className="menu-modulos__progreso">
          <span className="menu-modulos__progreso-actual">{numeral(posicion + 1)}</span>
          <span className="menu-modulos__progreso-total">/ {numeral(total)}</span>
        </p>
        <div
          className="menu-modulos__barra"
          aria-hidden="true"
          style={{ '--avance': (posicion + 1) / total } as CSSProperties}
        />
        <p className="menu-modulos__atajo" aria-hidden="true">
          ← → · j k
        </p>
      </footer>
    </nav>
  )
}
