import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/assets/',        // Rutas absolutas en producción
  build: {
    outDir: 'dist',        // Genera dist/assets/
    emptyOutDir: true
  }
})
