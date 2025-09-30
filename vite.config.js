import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // Esto hace que todos los assets se busquen relativos al HTML
  build: {
    outDir: '../dist', // Mismo folder que Flask sirve
  }
})
