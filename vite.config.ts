import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/nasa-apod/',
  plugins: [
    vue(),

    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ]
})