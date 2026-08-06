// TBF Entertainment — A2P 10DLC compliance test suite.
//
// Proves the behaviour a carrier / Twilio reviewer will check:
//   * the disclosure carries every mandated clause,
//   * the consent checkbox ships unchecked,
//   * unchecked consent and bad numbers are rejected,
//   * consent evidence is complete,
//   * failed storage is reported honestly and never as success,
//   * no SMS is sent from the consent path,
//   * the public compliance routes resolve to real pages, not the SPA shell.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  handleConsentRequest,
  validateConsent,
  normalizePhone,
  splitName,
  buildConsentRecord,
  clientIp,
} from '../lib/consent.js';
import { TBF_DISCLOSURE, TBF_DISCLOSURE_VERSION, TBF_REQUIRED_DISCLOSURE_ELEMENTS } from '../lib/tbf-disclosure.js';
import { TBF_CONSENT_BRAND } from '../api/sms-consent.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const smsUpdatesHtml = read('public/sms-updates.html');
const privacyHtml = read('public/privacy.html');
const termsHtml = read('public/terms.html');
const vercelConfig = JSON.parse(read('vercel.json'));

// --- test doubles -----------------------------------------------------------

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  return res;
}

const mockReq = (method, body, headers = {}) => ({ method, body, headers });

/** Records every call so tests can assert exactly what was persisted. */
function recordingStore(behaviour = 'ok') {
  const calls = [];
  const fn = async (env, record, submissionId) => {
    calls.push({ env, record, submissionId });
    if (behaviour === 'throw') throw new Error('Airtable 500');
    if (behaviour === 'unconfigured') return { stored: false, configured: false };
    return { stored: true, configured: true };
  };
  fn.calls = calls;
  return fn;
}

const FIXED_TIME = '2026-08-06T12:00:00.000Z';
const deps = (store) => ({ store, now: () => FIXED_TIME, newId: () => 'sc_test_fixed' });

const validBody = {
  name: 'Jordan Reeves',
  phone: '(513) 555-0142',
  email: 'jordan@example.com',
  smsConsent: true,
  sourceUrl: 'https://www.tbfentertainment.art/sms-updates',
  userAgent: 'Mozilla/5.0 (test)',
};

// --- disclosure -------------------------------------------------------------

test('disclosure contains every carrier-mandated element', () => {
  for (const element of TBF_REQUIRED_DISCLOSURE_ELEMENTS) {
    assert.ok(TBF_DISCLOSURE.includes(element), `disclosure is missing: "${element}"`);
  }
});

test('disclosure states TBF Entertainment as the sender and 4 messages per month', () => {
  assert.match(TBF_DISCLOSURE, /from TBF Entertainment/);
  assert.match(TBF_DISCLOSURE, /Up to 4 messages per month/);
});

test('disclosure is versioned so consent records stay attributable', () => {
  assert.match(TBF_DISCLOSURE_VERSION, /^TBF-SMS-v\d+-\d{4}-\d{2}-\d{2}$/);
  assert.equal(TBF_CONSENT_BRAND.disclosureVersion, TBF_DISCLOSURE_VERSION);
});

test('the opt-in page renders the same disclosure wording as the stored record', () => {
  // Compare word-by-word: the HTML wraps lines, so whitespace is normalised.
  const start = smsUpdatesHtml.indexOf('id="disclosure-text"');
  assert.notEqual(start, -1, 'disclosure block not found on the opt-in page');
  const end = smsUpdatesHtml.indexOf('</span>', start);
  const pageText = smsUpdatesHtml
    .slice(start, end)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  for (const element of TBF_REQUIRED_DISCLOSURE_ELEMENTS) {
    assert.ok(pageText.includes(element), `opt-in page disclosure is missing: "${element}"`);
  }
});

// --- the checkbox ships unchecked -------------------------------------------

test('the SMS consent checkbox is NOT preselected on the opt-in page', () => {
  const input = smsUpdatesHtml.match(/<input[^>]*id="smsConsent"[^>]*>/);
  assert.ok(input, 'consent checkbox not found');
  assert.doesNotMatch(input[0], /\bchecked\b/, 'consent checkbox must not be pre-checked');
  assert.match(input[0], /type="checkbox"/);
});

test('consent is a separate control, not bundled into the submit action', () => {
  assert.match(smsUpdatesHtml, /name="smsConsent"/);
  assert.ok(smsUpdatesHtml.includes('Consent is not a condition of purchase'));
});

// --- method handling --------------------------------------------------------

for (const method of ['GET', 'PUT', 'DELETE', 'PATCH', 'HEAD']) {
  test(`${method} is rejected with JSON 405 and an Allow header`, async () => {
    const res = mockRes();
    await handleConsentRequest(mockReq(method, {}), res, TBF_CONSENT_BRAND, deps(recordingStore()));
    assert.equal(res.statusCode, 405);
    assert.equal(res.body.ok, false);
    assert.match(res.body.error, /POST/);
    assert.equal(res.headers.allow, 'POST');
  });
}

test('OPTIONS does not create a consent record', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('OPTIONS', {}), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 405);
  assert.equal(store.calls.length, 0);
});

// --- happy path -------------------------------------------------------------

test('a valid POST is accepted and reports the stored record', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', validBody), res, TBF_CONSENT_BRAND, deps(store));

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.stored, true);
  assert.equal(res.body.consentRecordedAt, FIXED_TIME);
  assert.equal(res.body.campaignStatus, 'Pending A2P activation');
  assert.equal(store.calls.length, 1);
});

test('a JSON string body is parsed the same as an object body', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', JSON.stringify(validBody)), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 200);
  assert.equal(store.calls[0].record.Phone, '+15135550142');
});

// --- consent evidence completeness -----------------------------------------

test('the stored record carries every required consent-evidence field', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(
    mockReq('POST', validBody, { 'x-forwarded-for': '203.0.113.9, 70.41.3.18', 'user-agent': 'HeaderUA/1.0' }),
    res, TBF_CONSENT_BRAND, deps(store),
  );

  const r = store.calls[0].record;
  assert.equal(r['First Name'], 'Jordan');
  assert.equal(r['Last Name'], 'Reeves');
  assert.equal(r.Email, 'jordan@example.com');
  assert.equal(r.Phone, '+15135550142');
  assert.equal(r['SMS Consent'], 'Yes');
  assert.equal(r['SMS Consent Timestamp'], FIXED_TIME);
  assert.equal(r['SMS Consent Source'], 'https://www.tbfentertainment.art/sms-updates');
  assert.equal(r['Consent Language Version'], TBF_DISCLOSURE_VERSION);
  assert.equal(r['Form Type'], 'SMS Updates');
  assert.equal(r.Status, 'Opted In');
  assert.ok(r['Submission ID'], 'submission id must be present');

  // IP, user agent, campaign status and the verbatim disclosure ride in Notes.
  assert.match(r.Notes, /IP Address: 203\.0\.113\.9/);
  assert.match(r.Notes, /User Agent: Mozilla\/5\.0 \(test\)/);
  assert.match(r.Notes, /Campaign Status: Pending A2P activation/);
  assert.ok(r.Notes.includes(TBF_DISCLOSURE), 'verbatim disclosure must be stored');
});

test('the timestamp stored is UTC ISO-8601', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', validBody), res, TBF_CONSENT_BRAND, {
    store, newId: () => 'sc_x',
  });
  const ts = store.calls[0].record['SMS Consent Timestamp'];
  assert.match(ts, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});

test('email is optional and stored empty when omitted', async () => {
  const store = recordingStore();
  const res = mockRes();
  const { email, ...noEmail } = validBody;
  await handleConsentRequest(mockReq('POST', noEmail), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 200);
  assert.equal(store.calls[0].record.Email, '');
});

test('user agent falls back to the request header when the client omits it', async () => {
  const store = recordingStore();
  const res = mockRes();
  const { userAgent, ...noUa } = validBody;
  await handleConsentRequest(mockReq('POST', noUa, { 'user-agent': 'HeaderUA/1.0' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.match(store.calls[0].record.Notes, /User Agent: HeaderUA\/1\.0/);
});

test('a missing IP is recorded as "not available", never faked', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', validBody, {}), res, TBF_CONSENT_BRAND, deps(store));
  assert.match(store.calls[0].record.Notes, /IP Address: not available/);
});

// --- rejection paths --------------------------------------------------------

test('unchecked consent is rejected and NOTHING is stored', async () => {
  for (const value of [false, undefined, null, 'false', 0, '']) {
    const store = recordingStore();
    const res = mockRes();
    await handleConsentRequest(mockReq('POST', { ...validBody, smsConsent: value }), res, TBF_CONSENT_BRAND, deps(store));
    assert.equal(res.statusCode, 400, `smsConsent=${JSON.stringify(value)} should be rejected`);
    assert.equal(res.body.ok, false);
    assert.match(res.body.error, /consent/i);
    assert.equal(store.calls.length, 0, 'no record may be written without consent');
  }
});

test('invalid phone numbers are rejected and NOTHING is stored', async () => {
  const bad = ['', '123', '555-1234', '0135550142', '1135550142', '(513) 155-0142', '9999999999', 'not a phone', '+44 20 7946 0958'];
  for (const phone of bad) {
    const store = recordingStore();
    const res = mockRes();
    await handleConsentRequest(mockReq('POST', { ...validBody, phone }), res, TBF_CONSENT_BRAND, deps(store));
    assert.equal(res.statusCode, 400, `phone "${phone}" should be rejected`);
    assert.equal(store.calls.length, 0);
  }
});

test('a missing name is rejected', async () => {
  const res = mockRes();
  const store = recordingStore();
  await handleConsentRequest(mockReq('POST', { ...validBody, name: '   ' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 400);
  assert.equal(store.calls.length, 0);
});

test('a malformed email is rejected rather than silently dropped', async () => {
  const res = mockRes();
  const store = recordingStore();
  await handleConsentRequest(mockReq('POST', { ...validBody, email: 'not-an-email' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 400);
  assert.equal(store.calls.length, 0);
});

test('honeypot submissions are silently accepted but never stored', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', { ...validBody, _gotcha: 'bot' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.stored, false);
  assert.equal(store.calls.length, 0);
});

// --- honest failure ---------------------------------------------------------

test('a storage exception produces an honest error, not a success', async () => {
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', validBody), res, TBF_CONSENT_BRAND, deps(recordingStore('throw')));
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, false);
  assert.notEqual(res.body.stored, true);
  assert.match(res.body.error, /NOT subscribed/);
});

test('unconfigured storage produces 503 and never claims success', async () => {
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', validBody), res, TBF_CONSENT_BRAND, deps(recordingStore('unconfigured')));
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.ok, false);
  assert.notEqual(res.body.stored, true);
  assert.match(res.body.error, /NOT subscribed/);
});

test('the browser shows success only when the server confirms storage', () => {
  // The success branch is gated on all three of: 200, ok===true, stored===true.
  assert.match(smsUpdatesHtml, /r\.status === 200 && r\.data && r\.data\.ok === true && r\.data\.stored === true/);
});

// --- no SMS is sent ---------------------------------------------------------

test('the consent path contains no message-sending code', () => {
  const sources = [read('lib/consent.js'), read('api/sms-consent.js'), read('lib/tbf-disclosure.js')];
  for (const src of sources) {
    assert.doesNotMatch(src, /api\.twilio\.com/, 'consent path must not call Twilio');
    assert.doesNotMatch(src, /require\(['"]twilio['"]\)|from ['"]twilio['"]/, 'consent path must not import the Twilio SDK');
    assert.doesNotMatch(src, /Messages\.create|messages\.create/, 'consent path must not send messages');
  }
});

test('the successful response advertises the campaign as not yet active', async () => {
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', validBody), res, TBF_CONSENT_BRAND, deps(recordingStore()));
  assert.equal(res.body.campaignStatus, 'Pending A2P activation');
});

// --- idempotency ------------------------------------------------------------

test('a client-supplied submission id is passed through for dedup', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', { ...validBody, submissionId: 'sc_client_123' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(store.calls[0].submissionId, 'sc_client_123');
  assert.equal(store.calls[0].record['Submission ID'], 'sc_client_123');
});

// --- pure helpers -----------------------------------------------------------

test('normalizePhone accepts common US formats and returns E.164', () => {
  for (const input of ['5135550142', '(513) 555-0142', '513-555-0142', '+1 513 555 0142', '1 (513) 555.0142']) {
    assert.deepEqual(normalizePhone(input), { ok: true, e164: '+15135550142' });
  }
});

test('splitName handles single and multi-part names', () => {
  assert.deepEqual(splitName('Cher'), { firstName: 'Cher', lastName: '' });
  assert.deepEqual(splitName('Ada Byron Lovelace'), { firstName: 'Ada', lastName: 'Byron Lovelace' });
  assert.deepEqual(splitName('   '), { firstName: '', lastName: '' });
});

test('clientIp takes the first hop of x-forwarded-for', () => {
  assert.equal(clientIp({ headers: { 'x-forwarded-for': '198.51.100.7, 10.0.0.1' } }), '198.51.100.7');
  assert.equal(clientIp({ headers: {} }), '');
});

test('validateConsent rejects over-length input', () => {
  const r = validateConsent({ ...validBody, name: 'x'.repeat(201) }, TBF_CONSENT_BRAND);
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
});

test('buildConsentRecord never records consent as anything but an explicit Yes', () => {
  const rec = buildConsentRecord(
    { firstName: 'A', lastName: 'B', email: '', phone: '+15135550142', relationship: '' },
    { submissionId: 'x', timestamp: FIXED_TIME, sourceUrl: 'u', userAgent: '', ip: '' },
    TBF_CONSENT_BRAND,
  );
  assert.equal(rec['SMS Consent'], 'Yes');
});

// --- public routes are real pages, not the SPA shell ------------------------

test('the compliance pages are real static files with real content', () => {
  assert.match(privacyHtml, /<title>Privacy Policy \| TBF Entertainment<\/title>/);
  assert.match(termsHtml, /<title>Terms of Service \| TBF Entertainment<\/title>/);
  assert.match(smsUpdatesHtml, /<title>SMS Updates .* TBF Entertainment<\/title>/);
  // The SPA shell's marker must NOT be what these pages render.
  for (const html of [privacyHtml, termsHtml, smsUpdatesHtml]) {
    assert.doesNotMatch(html, /<div id="root"><\/div>/, 'compliance page must not be the React shell');
  }
});

test('privacy policy carries the mandated mobile-data language', () => {
  assert.ok(privacyHtml.includes('Mobile information and SMS consent data are not sold'));
  assert.ok(privacyHtml.includes('not shared with third parties or affiliates for their marketing or promotional purposes'));
  assert.ok(privacyHtml.includes('Carriers are not liable for delayed or undelivered messages'));
  assert.ok(privacyHtml.includes('up to 4 messages per month'));
});

test('terms carry the SMS program terms and STOP/HELP instructions', () => {
  assert.ok(termsHtml.includes('up to 4 messages per month'));
  assert.ok(termsHtml.includes('Consent is not a condition of purchase'));
  assert.ok(termsHtml.includes('Carriers are not liable for delayed or undelivered messages'));
  assert.match(termsHtml, /reply <strong>STOP<\/strong>/);
  assert.match(termsHtml, /reply <strong>HELP<\/strong>/);
});

test('every compliance page cross-links privacy, terms and the opt-in page', () => {
  for (const [name, html] of [['privacy', privacyHtml], ['terms', termsHtml], ['sms-updates', smsUpdatesHtml]]) {
    assert.ok(html.includes('href="/privacy"'), `${name} must link to /privacy`);
    assert.ok(html.includes('href="/terms"'), `${name} must link to /terms`);
    assert.ok(html.includes('href="/sms-updates"'), `${name} must link to /sms-updates`);
  }
});

test('support contact and sending number appear on the opt-in page', () => {
  assert.ok(smsUpdatesHtml.includes('info@tbfentertainment.art'));
  assert.ok(smsUpdatesHtml.includes('(513) 866-3832'));
});

// --- routing config ---------------------------------------------------------

test('vercel.json routes the clean compliance URLs to the static pages', () => {
  const map = Object.fromEntries(vercelConfig.rewrites.map((r) => [r.source, r.destination]));
  assert.equal(map['/privacy'], '/privacy.html');
  assert.equal(map['/terms'], '/terms.html');
  assert.equal(map['/sms-updates'], '/sms-updates.html');
});

test('the SPA catch-all does not swallow /api requests', () => {
  const catchAll = vercelConfig.rewrites.find((r) => r.destination === '/index.html' && r.source.includes('.*'));
  assert.ok(catchAll, 'a SPA catch-all rewrite must exist');
  assert.match(catchAll.source, /\?!/, 'catch-all must use a negative lookahead');
  assert.ok(catchAll.source.includes('api/'), 'catch-all must exclude /api/');

  // The compliance rewrites must be declared before the catch-all.
  const sources = vercelConfig.rewrites.map((r) => r.source);
  assert.ok(sources.indexOf('/privacy') < sources.indexOf(catchAll.source));
  assert.ok(sources.indexOf('/sms-updates') < sources.indexOf(catchAll.source));
});
