// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',          // REST
      '/ws': { target: 'ws://localhost:8000', ws: true }, // if you add websockets later
    }
  }
})
