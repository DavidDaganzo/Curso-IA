import { useState, useEffect } from 'react'
import { temario, type Temario } from './data/modulos'
import { loadTemarioI18n, mergeTemario, type IdiomaTemario } from './i18n/temario'
import MenuModulos from './components/MenuModulos'
import PanelModulo from './components/PanelModulo'
import SelectorIdioma from './components/SelectorIdioma'
import BotonDescargarPDF from './components/BotonDescargarPDF'
import './App.css'

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<string>(temario.modulos[0].id)
  const [idioma, setIdioma] = useState<IdiomaTemario>(() => {
    const guardado = localStorage.getItem('curso-ia-idioma')
    return (guardado === 'es' || guardado === 'en') ? guardado : 'es'
  })
  const [temarioTraducido, setTemarioTraducido] = useState<Temario>(temario)
  /* Se incrementa en cada salto por teclado, para que el menú mueva el foco. */
  const [saltosTeclado, setSaltosTeclado] = useState(0)

  useEffect(() => {
    async function cargarTraduccion() {
      const i18n = await loadTemarioI18n(idioma)
      const fusionado = mergeTemario(temario, i18n)
      setTemarioTraducido(fusionado)
      localStorage.setItem('curso-ia-idioma', idioma)
    }
    cargarTraduccion()
  }, [idioma])

  const modulos = temarioTraducido.modulos
  const indiceActivo = modulos.findIndex((m) => m.id === moduloActivo)
  const modulo = indiceActivo >= 0 ? modulos[indiceActivo] : null

  /**
   * Navegación por teclado entre módulos: flechas o j/k, como en la terminal.
   * Se ignora cuando el foco está en un control de formulario, para no robarle
   * las flechas al selector de idioma.
   */
  useEffect(() => {
    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return

      const destino = evento.target as HTMLElement | null
      if (destino?.closest('input, select, textarea')) return

      let paso = 0
      if (evento.key === 'ArrowRight' || evento.key === 'j') paso = 1
      if (evento.key === 'ArrowLeft' || evento.key === 'k') paso = -1
      if (paso === 0) return

      evento.preventDefault()
      const actual = modulos.findIndex((m) => m.id === moduloActivo)
      const siguiente = (actual + paso + modulos.length) % modulos.length
      setModuloActivo(modulos[siguiente].id)
      setSaltosTeclado((n) => n + 1)
    }

    window.addEventListener('keydown', alPulsarTecla)
    return () => window.removeEventListener('keydown', alPulsarTecla)
  }, [moduloActivo, modulos])

  const onCambioModulo = (id: string) => {
    setModuloActivo(id)
  }

  const onCambioIdioma = (lang: IdiomaTemario) => {
    setIdioma(lang)
  }

  return (
    <main className="app">
      <header className="app__cabecera">
        <div className="app__cabecera--izquierda">
          <h1>{temarioTraducido.titulo}</h1>
          <p className="app__meta">
            {temarioTraducido.subtitulo} · 01–{String(modulos.length).padStart(2, '0')}
          </p>
        </div>
        <div className="app__cabecera--derecha">
          <SelectorIdioma idioma={idioma} onCambio={onCambioIdioma} />
          <BotonDescargarPDF
            temario={temarioTraducido}
            idioma={idioma}
          />
        </div>
      </header>

      <div className="app__regla" aria-hidden="true" />

      <div className="app__layout">
        <MenuModulos
          modulos={modulos}
          moduloActivo={moduloActivo}
          indiceActivo={indiceActivo}
          saltosTeclado={saltosTeclado}
          onCambio={onCambioModulo}
        />
        <PanelModulo modulo={modulo} indice={indiceActivo} idioma={idioma} />
      </div>

      <p className="solo-lectores" aria-live="polite">
        {modulo ? `${indiceActivo + 1} / ${modulos.length} — ${modulo.titulo}` : ''}
      </p>
    </main>
  )
}
