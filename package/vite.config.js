import { defineConfig } from 'vite';
import { replaceCodePlugin } from 'vite-plugin-replace';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    replaceCodePlugin({
      replacements: [{
        from: 'https://kentonishi.com/iframe-translator',
        to: 'http://localhost:8000/iframe-translator/'
      }]
    })
  ],
  base: '/iframe-translator/',
  server: {
    fs:{
      allow: ['../package', '../iframe']
    },
    port: 5000
  }
});
