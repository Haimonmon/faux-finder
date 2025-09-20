import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './my-app',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/scrappy': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: true
      }
    },
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, 'data')
      ]
    }
  }
});
