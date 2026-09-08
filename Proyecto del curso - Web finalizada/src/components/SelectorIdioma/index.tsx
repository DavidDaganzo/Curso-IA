import { t } from '../../i18n'
import './index.css'

export interface SelectorIdiomaProps {
  idioma: 'es' | 'en'
  onCambio: (lang: 'es' | 'en') => void
}

const IDIOMAS = [
  { codigo: 'es' as const, nombre: 'Español' },
  { codigo: 'en' as const, nombre: 'English' },
] as const

const LOCALSTORAGE_KEY = 'curso-ia-idioma'

export default function SelectorIdioma({ idioma, onCambio }: SelectorIdiomaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoIdioma = event.target.value as 'es' | 'en'
    localStorage.setItem(LOCALSTORAGE_KEY, nuevoIdioma)
    onCambio(nuevoIdioma)
  }

  return (
    <div className="selector-idioma">
      <label htmlFor="selector-idioma" className="selector-idioma__label">
        {t('selector.idioma')}
      </label>
      <select
        id="selector-idioma"
        className="selector-idioma__select"
        value={idioma}
        onChange={handleChange}
        aria-label={t('selector.idioma')}
      >
        {IDIOMAS.map(({ codigo, nombre }) => (
          <option key={codigo} value={codigo}>
            {nombre}
          </option>
        ))}
      </select>
    </div>
  )
}