import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        //允许s-开头的自定义组件
        isCustomElement: (tag) => tag.startsWith('s-')
      }
    }
  })],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  base: process.env.GITHUB_PAGES ? '/RandomNotify/' : '/',
  define: {
    'process.env': {
      GITHUB_PAGES: process.env.GITHUB_PAGES || false ,
      __APP_BASE_PATH__: process.env.GITHUB_PAGES ? '/RandomNotify/' : '/'
    }
  }
})
