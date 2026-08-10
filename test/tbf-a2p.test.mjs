// TBF Entertainment — A2P 10DLC compliance test suite.
//
// Proves the behaviour a carrier / Twilio reviewer will check, now with
// SEPARATED consent categories:
//   * informational/customer-care and promotional/marketing are two
//     independent, unchecked-by-default opt-ins,
//   * a subscriber may select either, both, or neither (neither = rejected),
//   * each category's Yes/No and verbatim disclosure are stored independently,
//   * the two categories are never bundled, merged, or auto-converted,
//   * each disclosure carries every mandated clause,
//   * failed storage is reported honestly and never as success,
//   * no SMS is sent from the consent path,
//   * the public compliance routes resolve to real pages, not the SPA shell,
//   * dedup / honest-failure safeguards remain intact.

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
  isAffirmativeConsent,
} from '../lib/consent.js';
import {
  TBF_INFORMATIONAL_DISCLOSURE,
  TBF_MARKETING_DISCLOSURE,
  TBF_DISCLOSURE_VERSION,
  TBF_INFORMATIONAL_REQUIRED_ELEMENTS,
  TBF_MARKETING_REQUIRED_ELEMENTS,
} from '../lib/tbf-disclosure.js';
import { TBF_CONSENT_BRAND } from '../api/sms-consent.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const smsUpdatesHtml = read('public/sms-updates.html');
const privacyHtml = read('public/privacy.html');
const termsHtml = read('public/terms.html');
const vercelConfig = JSON.parse(read('vercel.json'));

const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const normStr = (s) => s.replace(/\s+/g, ' ').trim();

// --- test doubles -----------------------------------------------------------

function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
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

const FIXED_TIME = '2026-08-10T12:00:00.000Z';
const deps = (store) => ({ store, now: () => FIXED_TIME, newId: () => 'sc_test_fixed' });

const base = {
  name: 'Jordan Reeves',
  phone: '(513) 555-0142',
  email: 'jordan@example.com',
  sourceUrl: 'https://www.tbfentertainment.art/sms-updates',
  userAgent: 'Mozilla/5.0 (test)',
};
const bodyBoth = { ...base, informationalConsent: true, marketingConsent: true };
const bodyInfoOnly = { ...base, informationalConsent: true, marketingConsent: false };
const bodyMktOnly = { ...base, informationalConsent: false, marketingConsent: true };
const bodyNeither = { ...base, informationalConsent: false, marketingConsent: false };

// --- disclosures: both categories carry every mandated clause ----------------

test('informational disclosure contains every carrier-mandated element', () => {
  for (const el of TBF_INFORMATIONAL_REQUIRED_ELEMENTS) {
    assert.ok(TBF_INFORMATIONAL_DISCLOSURE.includes(el), `informational disclosure missing: "${el}"`);
  }
});

test('marketing disclosure contains every carrier-mandated element', () => {
  for (const el of TBF_MARKETING_REQUIRED_ELEMENTS) {
    assert.ok(TBF_MARKETING_DISCLOSURE.includes(el), `marketing disclosure missing: "${el}"`);
  }
});

test('only the marketing disclosure claims consent-not-a-condition-of-purchase', () => {
  assert.match(TBF_MARKETING_DISCLOSURE, /Consent is not a condition of purchase/);
  // Informational/customer-care texts are transactional; they carry no such line.
  assert.doesNotMatch(TBF_INFORMATIONAL_DISCLOSURE, /Consent is not a condition of purchase/);
});

test('disclosure is versioned so consent records stay attributable', () => {
  assert.match(TBF_DISCLOSURE_VERSION, /^TBF-SMS-v\d+-\d{4}-\d{2}-\d{2}$/);
  assert.equal(TBF_CONSENT_BRAND.disclosureVersion, TBF_DISCLOSURE_VERSION);
});

test('the opt-in page renders BOTH disclosures verbatim, matching the stored wording', () => {
  for (const [id, disclosure] of [
    ['informational-disclosure', TBF_INFORMATIONAL_DISCLOSURE],
    ['marketing-disclosure', TBF_MARKETING_DISCLOSURE],
  ]) {
    const start = smsUpdatesHtml.indexOf(`id="${id}"`);
    assert.notEqual(start, -1, `disclosure block ${id} not found on the opt-in page`);
    const end = smsUpdatesHtml.indexOf('</span>', start);
    const pageText = stripTags(smsUpdatesHtml.slice(start, end));
    assert.ok(pageText.includes(normStr(disclosure)), `opt-in page ${id} must match the stored disclosure verbatim`);
  }
});

// --- BOTH checkboxes ship unchecked, and neither is required -----------------

test('both consent checkboxes are present, unchecked, and not required', () => {
  for (const id of ['informationalConsent', 'marketingConsent']) {
    const input = smsUpdatesHtml.match(new RegExp(`<input[^>]*id="${id}"[^>]*>`));
    assert.ok(input, `${id} checkbox not found`);
    assert.match(input[0], /type="checkbox"/);
    assert.doesNotMatch(input[0], /\bchecked\b/, `${id} must not be pre-checked`);
    assert.doesNotMatch(input[0], /\brequired\b/, `${id} must not be HTML-required (either-or is enforced in JS)`);
  }
});

test('consent controls are separate from the submit action', () => {
  assert.match(smsUpdatesHtml, /name="informationalConsent"/);
  assert.match(smsUpdatesHtml, /name="marketingConsent"/);
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

// --- category independence (the core A2P separation) ------------------------

test('INFORMATIONAL ONLY succeeds and stores informational=Yes, marketing=No', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyInfoOnly), res, TBF_CONSENT_BRAND, deps(store));

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.stored, true);
  assert.deepEqual(res.body.categories, ['informational']);

  const r = store.calls[0].record;
  assert.equal(r['Informational Consent'], 'Yes');
  assert.equal(r['Marketing Consent'], 'No');
  assert.equal(r['SMS Consent'], 'Yes');
  assert.equal(r['Consent Categories'], 'Informational');
  // Only the selected category's verbatim disclosure is stored.
  assert.equal(r['Informational Disclosure'], TBF_INFORMATIONAL_DISCLOSURE);
  assert.equal(r['Marketing Disclosure'], '');
  assert.ok(r.Notes.includes(TBF_INFORMATIONAL_DISCLOSURE));
  assert.ok(!r.Notes.includes(TBF_MARKETING_DISCLOSURE), 'marketing disclosure must NOT ride on an informational-only record');
});

test('MARKETING ONLY succeeds and stores marketing=Yes, informational=No', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyMktOnly), res, TBF_CONSENT_BRAND, deps(store));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.categories, ['marketing']);

  const r = store.calls[0].record;
  assert.equal(r['Marketing Consent'], 'Yes');
  assert.equal(r['Informational Consent'], 'No');
  assert.equal(r['SMS Consent'], 'Yes');
  assert.equal(r['Consent Categories'], 'Marketing');
  assert.equal(r['Marketing Disclosure'], TBF_MARKETING_DISCLOSURE);
  assert.equal(r['Informational Disclosure'], '');
  assert.ok(!r.Notes.includes(TBF_INFORMATIONAL_DISCLOSURE), 'informational disclosure must NOT ride on a marketing-only record');
});

test('BOTH selected stores both=Yes', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyBoth), res, TBF_CONSENT_BRAND, deps(store));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.categories, ['informational', 'marketing']);

  const r = store.calls[0].record;
  assert.equal(r['Informational Consent'], 'Yes');
  assert.equal(r['Marketing Consent'], 'Yes');
  assert.equal(r['SMS Consent'], 'Yes');
  assert.equal(r['Consent Categories'], 'Informational, Marketing');
  assert.ok(r.Notes.includes(TBF_INFORMATIONAL_DISCLOSURE));
  assert.ok(r.Notes.includes(TBF_MARKETING_DISCLOSURE));
});

test('NEITHER selected is rejected 400 and NOTHING is stored', async () => {
  for (const body of [
    bodyNeither,
    { ...base }, // categories omitted entirely
    { ...base, informationalConsent: 'false', marketingConsent: 'false' },
    { ...base, informationalConsent: 0, marketingConsent: null },
  ]) {
    const store = recordingStore();
    const res = mockRes();
    await handleConsentRequest(mockReq('POST', body), res, TBF_CONSENT_BRAND, deps(store));
    assert.equal(res.statusCode, 400, `no category selected should reject: ${JSON.stringify(body)}`);
    assert.equal(res.body.ok, false);
    assert.match(res.body.error, /at least one|consent/i);
    assert.equal(store.calls.length, 0, 'no record may be written without at least one consent');
  }
});

test('consent is never auto-converted between categories', () => {
  // Informational only in → marketing stays No out.
  const info = validateConsent(bodyInfoOnly, TBF_CONSENT_BRAND);
  assert.equal(info.value.consent.informational, true);
  assert.equal(info.value.consent.marketing, false);
  // Marketing only in → informational stays No out.
  const mkt = validateConsent(bodyMktOnly, TBF_CONSENT_BRAND);
  assert.equal(mkt.value.consent.marketing, true);
  assert.equal(mkt.value.consent.informational, false);
});

// --- REGRESSION: informational-only must never store marketing (PR #8 defect) --
// Cecil selected only Informational on the live Preview, but Airtable saved
// Marketing Consent checked, both disclosures, and Marketing in Consent
// Categories. Root cause: an unchecked box could emit a truthy value and the
// server accepted the string "true". These lock the fix.

test('affirmative consent requires a STRICT boolean true — nothing else', () => {
  assert.equal(isAffirmativeConsent(true), true);
  for (const v of ['true', 'false', 'on', 'No', 'Yes', 1, 0, '1', '', null, undefined, {}, []]) {
    assert.equal(isAffirmativeConsent(v), false, `${JSON.stringify(v)} must NOT be treated as consent`);
  }
});

test('EXACT informational-only Preview payload stores NO marketing evidence', async () => {
  // Byte-for-byte the payload the opt-in page sends when only Informational is
  // checked (marketingConsent is a real boolean false).
  const exactPayload = {
    name: 'Cecil Trimble',
    phone: '(513) 555-0142',
    email: '',
    informationalConsent: true,
    marketingConsent: false,
    _gotcha: '',
    submissionId: 'sc_preview_info_only',
    sourceUrl: 'https://www.tbfentertainment.art/sms-updates',
    userAgent: 'Mozilla/5.0 (preview)',
  };
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', exactPayload), res, TBF_CONSENT_BRAND, deps(store));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.categories, ['informational']);

  const r = store.calls[0].record;
  assert.equal(r['Informational Consent'], 'Yes');
  assert.equal(r['Marketing Consent'], 'No');
  assert.equal(r['Marketing Disclosure'], '');
  assert.equal(r['Consent Categories'], 'Informational');
  assert.ok(!r.Notes.includes(TBF_MARKETING_DISCLOSURE), 'marketing disclosure must NOT appear');
  assert.ok(!/Marketing/.test(r['Consent Categories']), 'Consent Categories must NOT include Marketing');
});

test('a stray truthy STRING on the unselected category cannot flip it on', async () => {
  // Even if a buggy client emitted the checkbox `value` string "true" for an
  // UNCHECKED marketing box, the server must not store marketing consent.
  for (const stray of ['true', 'on', '1', 1, 'yes', 'Yes']) {
    const store = recordingStore();
    const res = mockRes();
    await handleConsentRequest(
      mockReq('POST', { ...bodyInfoOnly, marketingConsent: stray }),
      res, TBF_CONSENT_BRAND, deps(store),
    );
    assert.equal(res.statusCode, 200, `informational still valid with stray marketing=${JSON.stringify(stray)}`);
    assert.deepEqual(res.body.categories, ['informational']);
    assert.equal(store.calls[0].record['Marketing Consent'], 'No', `marketing must stay No for stray ${JSON.stringify(stray)}`);
  }
});

test('the opt-in page maps each checkbox by its own .checked (no value-attr footgun)', () => {
  // No `value="true"` on the consent checkboxes — that attribute is the source
  // of the always-"true" footgun.
  assert.doesNotMatch(smsUpdatesHtml, /id="informationalConsent"[^>]*value=/, 'informational checkbox must have no value attribute');
  assert.doesNotMatch(smsUpdatesHtml, /id="marketingConsent"[^>]*value=/, 'marketing checkbox must have no value attribute');
  // Each category is read from its own checkbox's .checked, coerced to boolean.
  assert.match(smsUpdatesHtml, /getElementById\('informationalConsent'\)\.checked === true/);
  assert.match(smsUpdatesHtml, /getElementById\('marketingConsent'\)\.checked === true/);
  // The consent flags are never sourced from .value.
  assert.doesNotMatch(smsUpdatesHtml, /getElementById\('(informational|marketing)Consent'\)\.value/);
});

// --- body parsing + evidence completeness -----------------------------------

test('a JSON string body is parsed the same as an object body', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', JSON.stringify(bodyBoth)), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 200);
  assert.equal(store.calls[0].record.Phone, '+15135550142');
});

test('the stored record carries every required consent-evidence field', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(
    mockReq('POST', bodyBoth, { 'x-forwarded-for': '203.0.113.9, 70.41.3.18', 'user-agent': 'HeaderUA/1.0' }),
    res, TBF_CONSENT_BRAND, deps(store),
  );

  const r = store.calls[0].record;
  assert.equal(r['First Name'], 'Jordan');
  assert.equal(r['Last Name'], 'Reeves');
  assert.equal(r.Email, 'jordan@example.com');
  assert.equal(r.Phone, '+15135550142');
  assert.equal(r['Informational Consent'], 'Yes');
  assert.equal(r['Marketing Consent'], 'Yes');
  assert.equal(r['SMS Consent'], 'Yes');
  assert.equal(r['SMS Consent Timestamp'], FIXED_TIME);
  assert.equal(r['SMS Consent Source'], 'https://www.tbfentertainment.art/sms-updates');
  assert.equal(r['Consent Language Version'], TBF_DISCLOSURE_VERSION);
  assert.equal(r['Form Type'], 'SMS Updates');
  assert.equal(r.Status, 'Opted In');
  assert.ok(r['Submission ID'], 'submission id must be present');

  assert.match(r.Notes, /IP Address: 203\.0\.113\.9/);
  assert.match(r.Notes, /User Agent: Mozilla\/5\.0 \(test\)/);
  assert.match(r.Notes, /Campaign Status: Pending A2P activation/);
  assert.match(r.Notes, /Consent Categories: Informational, Marketing/);
});

test('the timestamp stored is UTC ISO-8601', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyBoth), res, TBF_CONSENT_BRAND, { store, newId: () => 'sc_x' });
  assert.match(store.calls[0].record['SMS Consent Timestamp'], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});

test('email is optional and stored empty when omitted', async () => {
  const store = recordingStore();
  const res = mockRes();
  const { email, ...noEmail } = bodyBoth;
  await handleConsentRequest(mockReq('POST', noEmail), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 200);
  assert.equal(store.calls[0].record.Email, '');
});

test('user agent falls back to the request header when the client omits it', async () => {
  const store = recordingStore();
  const res = mockRes();
  const { userAgent, ...noUa } = bodyBoth;
  await handleConsentRequest(mockReq('POST', noUa, { 'user-agent': 'HeaderUA/1.0' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.match(store.calls[0].record.Notes, /User Agent: HeaderUA\/1\.0/);
});

test('a missing IP is recorded as "not available", never faked', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyBoth, {}), res, TBF_CONSENT_BRAND, deps(store));
  assert.match(store.calls[0].record.Notes, /IP Address: not available/);
});

// --- other rejection paths --------------------------------------------------

test('invalid phone numbers are rejected and NOTHING is stored', async () => {
  const bad = ['', '123', '555-1234', '0135550142', '1135550142', '(513) 155-0142', '9999999999', 'not a phone', '+44 20 7946 0958'];
  for (const phone of bad) {
    const store = recordingStore();
    const res = mockRes();
    await handleConsentRequest(mockReq('POST', { ...bodyBoth, phone }), res, TBF_CONSENT_BRAND, deps(store));
    assert.equal(res.statusCode, 400, `phone "${phone}" should be rejected`);
    assert.equal(store.calls.length, 0);
  }
});

test('a missing name is rejected', async () => {
  const res = mockRes();
  const store = recordingStore();
  await handleConsentRequest(mockReq('POST', { ...bodyBoth, name: '   ' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 400);
  assert.equal(store.calls.length, 0);
});

test('a malformed email is rejected rather than silently dropped', async () => {
  const res = mockRes();
  const store = recordingStore();
  await handleConsentRequest(mockReq('POST', { ...bodyBoth, email: 'not-an-email' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 400);
  assert.equal(store.calls.length, 0);
});

test('honeypot submissions are silently accepted but never stored', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', { ...bodyBoth, _gotcha: 'bot' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.stored, false);
  assert.equal(store.calls.length, 0);
});

// --- honest failure (safeguards intact) -------------------------------------

test('a storage exception produces an honest error, not a success', async () => {
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyBoth), res, TBF_CONSENT_BRAND, deps(recordingStore('throw')));
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, false);
  assert.notEqual(res.body.stored, true);
  assert.match(res.body.error, /NOT subscribed/);
});

test('unconfigured storage produces 503 and never claims success', async () => {
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', bodyBoth), res, TBF_CONSENT_BRAND, deps(recordingStore('unconfigured')));
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.ok, false);
  assert.notEqual(res.body.stored, true);
  assert.match(res.body.error, /NOT subscribed/);
});

test('the browser shows success only when the server confirms storage', () => {
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
  await handleConsentRequest(mockReq('POST', bodyBoth), res, TBF_CONSENT_BRAND, deps(recordingStore()));
  assert.equal(res.body.campaignStatus, 'Pending A2P activation');
});

// --- idempotency / dedup intact ---------------------------------------------

test('a client-supplied submission id is passed through for dedup', async () => {
  const store = recordingStore();
  const res = mockRes();
  await handleConsentRequest(mockReq('POST', { ...bodyBoth, submissionId: 'sc_client_123' }), res, TBF_CONSENT_BRAND, deps(store));
  assert.equal(store.calls[0].submissionId, 'sc_client_123');
  assert.equal(store.calls[0].record['Submission ID'], 'sc_client_123');
});

test('the opt-in page mints a stable per-attempt submission id for retry dedup', () => {
  assert.match(smsUpdatesHtml, /submissionId\s*=\s*'sc_'/);
  assert.match(smsUpdatesHtml, /submissionId: submissionId/);
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
  const r = validateConsent({ ...bodyBoth, name: 'x'.repeat(201) }, TBF_CONSENT_BRAND);
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
});

test('buildConsentRecord reflects exactly the categories selected', () => {
  const infoOnly = buildConsentRecord(
    { firstName: 'A', lastName: 'B', email: '', phone: '+15135550142', relationship: '', consent: { informational: true, marketing: false } },
    { submissionId: 'x', timestamp: FIXED_TIME, sourceUrl: 'u', userAgent: '', ip: '' },
    TBF_CONSENT_BRAND,
  );
  assert.equal(infoOnly['Informational Consent'], 'Yes');
  assert.equal(infoOnly['Marketing Consent'], 'No');
  assert.equal(infoOnly['SMS Consent'], 'Yes');

  const none = buildConsentRecord(
    { firstName: 'A', lastName: 'B', email: '', phone: '+15135550142', relationship: '', consent: {} },
    { submissionId: 'x', timestamp: FIXED_TIME, sourceUrl: 'u', userAgent: '', ip: '' },
    TBF_CONSENT_BRAND,
  );
  assert.equal(none['SMS Consent'], 'No');
  assert.equal(none['Informational Consent'], 'No');
  assert.equal(none['Marketing Consent'], 'No');
});

// --- public routes are real pages, not the SPA shell ------------------------

test('the compliance pages are real static files with real content', () => {
  assert.match(privacyHtml, /<title>Privacy Policy \| TBF Entertainment<\/title>/);
  assert.match(termsHtml, /<title>Terms of Service \| TBF Entertainment<\/title>/);
  assert.match(smsUpdatesHtml, /<title>SMS Updates .* TBF Entertainment<\/title>/);
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

test('privacy policy explains the two SEPARATE consent categories', () => {
  assert.match(privacyHtml, /two separate and independent SMS consent categories/i);
  assert.match(privacyHtml, /informational\/customer-care consent and promotional\/marketing consent are separate/i);
  assert.match(privacyHtml, /do not automatically convert informational consent into marketing consent/i);
  assert.match(privacyHtml, /Marketing consent is not a condition of purchase/i);
});

test('terms carry the SMS program terms and STOP/HELP instructions', () => {
  assert.ok(termsHtml.includes('up to 4 messages per month'));
  assert.ok(termsHtml.includes('Consent is not a condition of purchase'));
  assert.ok(termsHtml.includes('Carriers are not liable for delayed or undelivered messages'));
  assert.match(termsHtml, /reply <strong>STOP<\/strong>/);
  assert.match(termsHtml, /reply <strong>HELP<\/strong>/);
});

test('terms explain the two SEPARATE consent categories', () => {
  assert.match(termsHtml, /Two independent consent categories/i);
  assert.match(termsHtml, /are <strong>separate<\/strong>/i);
  assert.match(termsHtml, /one category is never automatically converted into the other/i);
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
  const sources = vercelConfig.rewrites.map((r) => r.source);
  assert.ok(sources.indexOf('/privacy') < sources.indexOf(catchAll.source));
  assert.ok(sources.indexOf('/sms-updates') < sources.indexOf(catchAll.source));
});
