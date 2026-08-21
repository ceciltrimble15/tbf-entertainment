import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// STANDALONE=1 produces a single self-contained HTML file (used to
// regenerate standalone.html, the artifact served by vercel.json).
// Default build produces the normal dist/ bundle.
const standalone = process.env.STANDALONE === '1';

// FINAL RELEASE GATE — August 21, 2026
//
// The approved Amazon product page has been verified for launch. The current
// release branch intentionally preserves the already-tested App.jsx from the
// correct-cover + Airtable-forms build. This pre-transform flips that build's
// single Amazon safety gate from false -> true without touching the working
// form backend, approved cover asset, SMS consent stack, or page layout.
//
// Guardrail: fail the build if the exact gate is missing or appears more than
// once. That prevents a future code change from silently producing a mixed
// purchase state.
const activateVerifiedAmazonListing = {
  name: 'tbf-activate-verified-amazon-listing',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/App.jsx') && !id.endsWith('\\src\\App.jsx')) return null;

    const gate = 'const AMAZON_VERIFIED = false;';
    const matches = code.split(gate).length - 1;
    if (matches !== 1) {
      throw new Error(`Expected exactly one Amazon release gate in src/App.jsx; found ${matches}.`);
    }

    return {
      code: code.replace(gate, 'const AMAZON_VERIFIED = true;'),
      map: null,
    };
  },
};

export default defineConfig({
  plugins: [activateVerifiedAmazonListing, react(), ...(standalone ? [viteSingleFile()] : [])],
  build: standalone ? { outDir: 'dist-standalone', emptyOutDir: true } : {},
  server: {
    port: 5176,
    strictPort: false,
  },
});
