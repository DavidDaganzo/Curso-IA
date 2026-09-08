import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages sirve el sitio bajo /Curso-IA/, no en la raíz del dominio.
  base: '/Curso-IA/',
  plugins: [react()],
})
