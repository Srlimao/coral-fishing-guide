import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cotal-fishing-guide/',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: false
  }
});
