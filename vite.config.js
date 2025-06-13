import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // server: {
  //   host: 'test-dev.local',
  //   port: 5173,
  //   https: false, // ou true se você gerar certificado local
  // }
  server: {
    host: 'frontend.api-dev.local',
    port: 5173,
    https: false,
    cors: true
  }
})
