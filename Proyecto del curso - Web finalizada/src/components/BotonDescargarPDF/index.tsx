import { useState } from 'react'
import { t } from '../../i18n'
import type { Temario } from '../../data/modulos'
import { generarPDF } from '../../utils/generarPDF'
import './index.css'

export interface BotonDescargarPDFProps {
  temario: Temario
  idioma: 'es' | 'en'
  deshabilitado?: boolean
}

export default function BotonDescargarPDF({ temario, idioma, deshabilitado = false }: BotonDescargarPDFProps) {
  const [cargando, setCargando] = useState(false)

  const handleClick = async () => {
    if (cargando || deshabilitado) return

    setCargando(true)
    try {
      const doc = await generarPDF(temario, idioma)
      doc.save(`temario-${idioma}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert(t('boton.errorGenerandoPdf', idioma))
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      className={`boton-descargar-pdf ${cargando ? 'boton-descargar-pdf--cargando' : ''}`}
      onClick={handleClick}
      disabled={cargando || deshabilitado}
      aria-busy={cargando}
    >
      <span className="boton-descargar-pdf__texto">
        {cargando ? t('boton.generando') : t('boton.descargarPdf')}
      </span>
      {cargando && <span className="boton-descargar-pdf__spinner" aria-hidden="true" />}
    </button>
  )
}