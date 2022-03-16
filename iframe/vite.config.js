import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
  ],
  base: '/iframe-translator/',
  server: {
    fs:{
      allow: ['../package', '../iframe']
    },
    port: 8000
  }
});
