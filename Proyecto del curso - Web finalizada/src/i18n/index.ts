import cadenasEs from './es.json'
import cadenasEn from './en.json'

type Clave = keyof typeof cadenasEs

const cadenas: Record<'es' | 'en', Record<string, string>> = {
  es: cadenasEs,
  en: cadenasEn,
}

/**
 * Devuelve la cadena traducida de una clave.
 *
 * Si la clave no existe, devuelve la propia clave: eso es una señal de error
 * en desarrollo, no un comportamiento deseado en producción.
 */
export function t(clave: string, idioma: 'es' | 'en' = 'es'): string {
  return cadenas[idioma][clave] ?? clave
}

export type { Clave }
