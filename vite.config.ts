import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from the root of barboragustafsson.com on Hostinger.
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
})
