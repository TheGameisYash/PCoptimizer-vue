import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()], // Add vueJsx plugin
  server: {
    port: 10000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://pcoptimizer-vue-server.onrender.com',
        changeOrigin: true
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  }
})
