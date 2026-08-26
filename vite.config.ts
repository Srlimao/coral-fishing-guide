import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { liveBridgePlugin } from './src/server/liveBridgePlugin';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cotal-fishing-guide/',
  plugins: [
    react(),
    tailwindcss(),
    liveBridgePlugin()
  ],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: [
        '**/live_game_state.json',
        '**/playwright-report/**',
        '**/test-results/**',
        '**/.git/**'
      ]
    }
  }
});
