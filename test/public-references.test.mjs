// Guards against retired book information ever returning to the public site.
// Run with `npm test` (node --test). Fails the build if any forbidden term or
// filename reappears, and verifies the approved cover asset ships.

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function readIfExists(p) {
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
}

// Concatenate every public-facing source file into one string to scan.
const publicFiles = [
  'src/App.jsx',
  'src/main.jsx',
  'src/index.css',
  'index.html',
  'standalone.html',
];
const publicSource = publicFiles.map((f) => readIfExists(join(root, f))).join('\n');

const APPROVED_COVER = 'young-gs-vs-old-gs-approved-2026.jpg';

// Exact retired references that must never appear in public source.
const forbiddenBookReferences = [
  'The Takeover',
  '/book-cover.png',
  'cover-fix.css',
  "Young G's",
  "O.G.'s",
  'amazon.com/s?',
  'Print & eBook',
  'Print &amp; eBook',
];

test('no retired public book references remain', () => {
  for (const forbidden of forbiddenBookReferences) {
    assert.equal(
      publicSource.includes(forbidden),
      false,
      `Retired book reference remains: ${forbidden}`
    );
  }
});

test('approved cover asset exists in public/', () => {
  assert.equal(
    existsSync(join(root, 'public', APPROVED_COVER)),
    true,
    `Missing approved cover asset: public/${APPROVED_COVER}`
  );
});

test('retired book-cover.png is not committed in public/', () => {
  assert.equal(
    existsSync(join(root, 'public', 'book-cover.png')),
    false,
    'Retired public/book-cover.png must be removed'
  );
});

test('all Buy links point to the approved Amazon product page (no search URLs)', () => {
  const app = readIfExists(join(root, 'src', 'App.jsx'));
  assert.ok(app.includes('https://www.amazon.com/dp/B0H962BXXC'), 'Approved Amazon /dp/ URL missing');
  assert.equal(
    /amazon\.com\/s\?/.test(app),
    false,
    'An Amazon search URL is still present in a Buy link'
  );
});

// Post-build check: when dist/ exists, the built bundle must reference the new
// cover filename and must NOT reference the retired one.
test('built output references the approved cover (skipped if dist/ absent)', (t) => {
  const dist = join(root, 'dist');
  if (!existsSync(dist)) {
    t.skip('dist/ not built yet');
    return;
  }
  const walk = (d) =>
    readdirSync(d).flatMap((name) => {
      const p = join(d, name);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  const files = walk(dist);
  const textBlob = files
    .filter((f) => /\.(html|js|css)$/.test(f))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');

  assert.ok(
    textBlob.includes(APPROVED_COVER),
    `Built output does not reference ${APPROVED_COVER}`
  );
  assert.equal(
    textBlob.includes('book-cover.png'),
    false,
    'Built output still references retired book-cover.png'
  );
  assert.ok(
    files.some((f) => f.endsWith(APPROVED_COVER)),
    `Approved cover asset not emitted into dist/`
  );
});
