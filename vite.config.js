import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',  // Vercel 用根路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
