import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',      // ✅ rutas absolutas (no ./)
  build: {
    outDir: 'dist'  // ✅ Vite genera los assets dentro de dist/
  }
})