import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@components': new URL('./src/components', import.meta.url).pathname,
      '@pages': new URL('./src/pages', import.meta.url).pathname,
      '@hooks': new URL('./src/hooks', import.meta.url).pathname,
      '@context': new URL('./src/context', import.meta.url).pathname,
      '@services': new URL('./src/services', import.meta.url).pathname,
      '@utils': new URL('./src/utils', import.meta.url).pathname,
      '@assets': new URL('./src/assets', import.meta.url).pathname,
    },
  },
  server: {
    port: 5173,
    // Proxy API calls to Express server during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Code-split vendors for better caching (function form for Vite 8 / rolldown)
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
            return 'router';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'motion';
          }
        },
      },
    },
  },
});
