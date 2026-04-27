import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ fastRefresh: false })],
  server: {
    port: 3333,
    host: '127.0.0.1',
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
