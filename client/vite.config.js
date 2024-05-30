import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/house': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/user': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/role': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/church': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },

  plugins: [react()],
});