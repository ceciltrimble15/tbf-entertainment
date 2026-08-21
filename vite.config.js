import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// STANDALONE=1 produces a single self-contained HTML file (used to
// regenerate standalone.html, the artifact served by vercel.json).
// Default build produces the normal dist/ bundle.
const standalone = process.env.STANDALONE === '1';

// Production release gate for Young Gs vs Old Gs.
// The source component keeps its fail-safe default (AMAZON_VERIFIED=false),
// while this build transform activates the already verified direct Amazon
// product page without disturbing the approved cover or /api/submit backend.
// This is intentionally scoped to src/App.jsx and fails loudly if the expected
// safety marker ever changes, so we never silently ship a stale purchase path.
function activateVerifiedAmazon() {
  const expected = 'const AMAZON_VERIFIED = false;';
  const replacement = 'const AMAZON_VERIFIED = true;';

  return {
    name: 'tbf-activate-verified-amazon',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/App.jsx')) return null;
      if (!code.includes(expected)) {
        throw new Error('TBF Amazon release gate marker not found in src/App.jsx');
      }
      return {
        code: code.replace(expected, replacement),
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [activateVerifiedAmazon(), react(), ...(standalone ? [viteSingleFile()] : [])],
  build: standalone ? { outDir: 'dist-standalone', emptyOutDir: true } : {},
  server: {
    port: 5176,
    strictPort: false,
  },
});
