import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');

test('the approved Amazon ASIN is verified and is the only purchase destination', () => {
  assert.match(app, /asin: 'B0H962BXXC'/);
  assert.match(app, /amazonUrl: 'https:\/\/www\.amazon\.com\/dp\/B0H962BXXC'/);
  assert.match(app, /const AMAZON_VERIFIED = true/);
  assert.doesNotMatch(app, /amazon\.com\/s\?/);
});

test('SMS updates are visible in navigation, beside the featured buy button, and in the footer', () => {
  const smsLinks = app.match(/href="\/sms-updates"/g) || [];
  assert.ok(smsLinks.length >= 4, 'expected desktop nav, mobile nav, featured book, and footer SMS links');
  assert.match(app, />\s*Text Updates\s*</);
  assert.match(app, />\s*Get Text Updates\s*</);
  assert.match(app, />\s*SMS Updates\s*</);
});

test('all website SMS frequency language matches the compliance pages', () => {
  assert.doesNotMatch(app, /Message frequency varies/i);
  assert.match(app, /Up to 4 messages per month/);
});
