import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const app = read('src/App.jsx');
const privacy = read('public/privacy.html');
const terms = read('public/terms.html');
const sms = read('public/sms-updates.html');
const endpoint = read('api/sms-consent.js');
const vercel = JSON.parse(read('vercel.json'));
const index = read('index.html');

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('approved Amazon URL is centralized and Buy buttons are gated until verified', () => {
  // Verified target is retained in the single-source config for later activation…
  assert.match(app, /https:\/\/www\.amazon\.com\/dp\/B0H962BXXC/);
  // …but the sales gate is OFF, so no live purchase link fires yet.
  assert.match(app, /const AMAZON_VERIFIED = false/);
  // Disabled label is rendered; the price is NOT displayed while gated.
  assert.match(app, /Buy on Amazon — Coming Soon/);
  assert.doesNotMatch(app, /Buy on Amazon — \$14\.99/);
});

test('SMS page keeps the Buy button gated (no live link, no price) until verified', () => {
  assert.match(sms, /Buy on Amazon — Coming Soon/);
  assert.doesNotMatch(sms, /Buy on Amazon — \$14\.99/);
  assert.doesNotMatch(sms, /amazon\.com\/dp\/B0H962BXXC/);
});

test('public privacy policy includes mobile non-sharing and STOP HELP disclosures', () => {
  assert.match(privacy, /does not sell mobile telephone information/i);
  assert.match(privacy, /will not be shared with third parties or affiliates for their own marketing or promotional purposes/i);
  assert.match(privacy, /Reply STOP/i);
  assert.match(privacy, /Reply HELP/i);
  assert.match(privacy, /up to 4 messages per month/i);
});

test('terms identify the TBF SMS program and required disclosures', () => {
  assert.match(terms, /TBF Entertainment SMS Program/);
  assert.match(terms, /Consent is not a condition of purchase/i);
  assert.match(terms, /Reply STOP/i);
  assert.match(terms, /Reply HELP/i);
});

test('SMS consent checkbox is separate, affirmative, and not prechecked', () => {
  assert.match(sms, /id="smsConsent"[^>]*type="checkbox"[^>]*required/);
  assert.doesNotMatch(sms, /id="smsConsent"[^>]*checked/);
  assert.match(sms, /Consent is not a condition of purchase/i);
  assert.match(sms, /Message and data rates may apply/i);
});

test('SMS page links directly to privacy and terms', () => {
  assert.match(sms, /href="\/privacy"/);
  assert.match(sms, /href="\/terms"/);
});

test('SMS endpoint validates affirmative consent and US mobile format', () => {
  assert.match(endpoint, /PHONE_RE = \/\^\\\+1\\d\{10\}\$\//);
  assert.match(endpoint, /if \(!consent\)/);
  assert.match(endpoint, /Consent evidence is incomplete/);
});

test('SMS endpoint captures consent evidence and stable submission ID', () => {
  assert.match(endpoint, /createHash\('sha256'\)/);
  assert.match(endpoint, /Consent Timestamp/);
  assert.match(endpoint, /Consent Source/);
  assert.match(endpoint, /Policy Version/);
  assert.match(endpoint, /Consent Language/);
  assert.match(endpoint, /'Submission ID'/);
});

test('SMS endpoint does not send text messages', () => {
  assert.doesNotMatch(endpoint, /api\.twilio\.com/i);
  assert.doesNotMatch(endpoint, /Messages\.create/i);
});

test('clean compliance routes are configured before SPA fallback', () => {
  const rewrites = vercel.rewrites;
  assert.deepEqual(rewrites.slice(0, 3), [
    { source: '/privacy', destination: '/privacy.html' },
    { source: '/terms', destination: '/terms.html' },
    { source: '/sms-updates', destination: '/sms-updates.html' },
  ]);
  assert.deepEqual(rewrites.at(-1), { source: '/(.*)', destination: '/index.html' });
});

test('main site loads the footer compliance-link script', () => {
  assert.match(index, /\/compliance-links\.js/);
});

let passed = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

console.log(`\n${passed}/${tests.length} compliance tests passed.`);
