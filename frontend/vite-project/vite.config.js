import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',   // 👈 Allow connections from outside Docker
    port: 5173,        // 👈 Match this with docker-compose.yml
    strictPort: true   // 👈 Prevent Vite from picking another port if 5173 is taken
  }
})
