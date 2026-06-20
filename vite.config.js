import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// STANDALONE=1 produces a single self-contained HTML file (used to
// regenerate standalone.html, the artifact served by vercel.json).
// Default build produces the normal dist/ bundle.
const standalone = process.env.STANDALONE === '1';

export default defineConfig({
  plugins: [react(), ...(standalone ? [viteSingleFile()] : [])],
  build: standalone ? { outDir: 'dist-standalone', emptyOutDir: true } : {},
  server: {
    port: 5176,
    strictPort: false,
  },
});
