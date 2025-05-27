import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 使用 bun 打包一个ts为js放到public目录下
// bun build src/service-worker/timerWorker.ts --outfile public/sw.js --target=browser

// import { build } from 'bun'

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
})
