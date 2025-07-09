import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-webgl', '@tensorflow-models/coco-ssd']
  },
  define: {
    global: 'globalThis',
  }
});
