import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
const vite = readFileSync(join(ROOT, 'vite.config.js'), 'utf8');

test('correct approved Young Gs cover remains the single cover source', () => {
  assert.match(app, /coverSrc: '\/young-gs-vs-old-gs-approved-2026\.jpg'/);
  assert.doesNotMatch(app, /\/book-cover\.png/);
});

test('working Airtable submission backend path is preserved', () => {
  assert.match(app, /const FORM_ENDPOINT = '\/api\/submit';/);
});

test('verified Amazon product page is the purchase destination', () => {
  assert.match(app, /asin: 'B0H962BXXC'/);
  assert.match(app, /amazonUrl: 'https:\/\/www\.amazon\.com\/dp\/B0H962BXXC'/);
  assert.doesNotMatch(app, /amazon\.com\/s\?/);
});

test('release build explicitly activates the guarded Amazon purchase path', () => {
  assert.match(app, /const AMAZON_VERIFIED = false;/);
  assert.match(vite, /const expected = 'const AMAZON_VERIFIED = false;';/);
  assert.match(vite, /const replacement = 'const AMAZON_VERIFIED = true;';/);
  assert.match(vite, /tbf-activate-verified-amazon/);
});
