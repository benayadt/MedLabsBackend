import { defineConfig } from 'vite';

// Local dev only: proxies API calls to the gateway so the Vite dev server
// (http://localhost:5173) behaves like production, where Nginx serves the
// built SPA and the same origin also fronts /api. This avoids needing CORS
// during day-to-day frontend development.
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
