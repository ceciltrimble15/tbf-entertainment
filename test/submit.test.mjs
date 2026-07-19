// TBF form backend — offline test suite (no network; fetch is stubbed).
// Run: npm test
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const handler = (await import(join(ROOT, 'api/submit.js'))).default;

// Env mirrors the intended TBF configuration (dummy secrets — never real).
Object.assign(process.env, {
  AIRTABLE_TOKEN: 'test-token', AIRTABLE_BASE_ID: 'app6TQ7oSVSJADxC4', AIRTABLE_SUBMISSIONS_TABLE: 'Website Submissions',
  BREVO_API_KEY: 'test-key', BREVO_SENDER: 'info@tbfentertainment.art', BREVO_LIST_ID: '3',
});

let calls = [];
let cfg = {}; // per-test failure injection
function installFetch() {
  globalThis.fetch = async (url, opts = {}) => {
    const method = opts.method || 'GET';
    calls.push({ url, method, body: opts.body ? JSON.parse(opts.body) : null });
    if (url.includes('api.airtable.com') && method === 'GET') {
      return { ok: true, status: 200, json: async () => ({ records: cfg.airtableExisting ? [{ id: 'rec1' }] : [] }) };
    }
    if (url.includes('api.airtable.com') && method === 'POST') {
      if (cfg.airtableInsertFail) return { ok: false, status: 500, text: async () => 'err' };
      return { ok: true, status: 200, json: async () => ({}) };
    }
    if (url.includes('smtp/email')) {
      if (cfg.emailFail) return { ok: false, status: 500, text: async () => 'err' };
      return { ok: true, status: 201, json: async () => ({}) };
    }
    if (url.includes('/v3/contacts')) {
      if (cfg.contactFail) return { ok: false, status: 500, text: async () => 'err' };
      return { ok: true, status: 201, json: async () => ({}) };
    }
    return { ok: true, status: 200, json: async () => ({}), text: async () => '' };
  };
}
installFetch();

const mockRes = () => ({ _s: 0, _j: null, status(s) { this._s = s; return this; }, json(j) { this._j = j; return this; } });
async function post(body, config = {}) {
  calls = []; cfg = config;
  const res = mockRes();
  await handler({ method: 'POST', body }, res);
  return { status: res._s, json: res._j, calls: [...calls] };
}
const emailCall = (r) => r.calls.find(c => c.url.includes('smtp/email'));
const insertCall = (r) => r.calls.find(c => c.url.includes('api.airtable.com') && c.method === 'POST');
const contactCall = (r) => r.calls.find(c => c.url.includes('/v3/contacts'));

let pass = 0, fail = 0;
async function test(name, fn) {
  try { await fn(); console.log('PASS | ' + name); pass++; }
  catch (e) { console.log('FAIL | ' + name + ' | ' + e.message); fail++; }
}

// 1. General inquiry
await test('1 General → info@, stored, emailed, no subscribe', async () => {
  const r = await post({ type: 'General', name: 'Jane', email: 'jane@x.com', message: 'hi', submissionId: 's1' });
  assert.equal(r.status, 200);
  assert.equal(emailCall(r).body.to[0].email, 'info@tbfentertainment.art');
  assert.ok(insertCall(r));
  assert.ok(!contactCall(r));
});
// 2. Early Access WITH consent
await test('2 Early Access + consent → subscribed to list 3, consent yes stored', async () => {
  const r = await post({ type: 'Early Access', email: 'ea@x.com', consent: true, submissionId: 's2' });
  assert.equal(r.status, 200);
  assert.deepEqual(contactCall(r).body.listIds, [3]);
  assert.match(insertCall(r).body.records[0].fields.Source, /consent: yes/);
});
// 3. Early Access WITHOUT consent
await test('3 Early Access no consent → stored, NOT subscribed, consent no', async () => {
  const r = await post({ type: 'Early Access', email: 'ea2@x.com', consent: false, submissionId: 's3' });
  assert.equal(r.status, 200);
  assert.ok(!contactCall(r), 'must not subscribe without consent');
  assert.match(insertCall(r).body.records[0].fields.Source, /consent: no/);
});
// 4. Movement
await test('4 Movement + consent → subscribed', async () => {
  const r = await post({ type: 'Movement', email: 'mv@x.com', consent: true, submissionId: 's4' });
  assert.equal(r.status, 200);
  assert.deepEqual(contactCall(r).body.listIds, [3]);
});
// 5-9 routing
for (const [type, inbox] of [['Media','media@tbfentertainment.art'],['Publishing','acquisitions@tbfentertainment.art'],['Partnership','acquisitions@tbfentertainment.art'],['Rights','rights@tbfentertainment.art'],['Artistry','info@tbfentertainment.art']]) {
  await test(`route ${type} → ${inbox}`, async () => {
    const r = await post({ type, email: 't@x.com', submissionId: 'r-' + type });
    assert.equal(r.status, 200);
    assert.equal(emailCall(r).body.to[0].email, inbox);
    assert.ok(!contactCall(r), 'contact form not subscribed');
  });
}
// 10. Street Team
await test('10 Street Team → submissions@, not subscribed', async () => {
  const r = await post({ type: 'Street Team', name: 'A', email: 'st@x.com', help: 'BookTok', submissionId: 's10' });
  assert.equal(emailCall(r).body.to[0].email, 'submissions@tbfentertainment.art');
  assert.ok(!contactCall(r));
});
// 11. Missing required fields (email)
await test('11 Missing email → 400', async () => {
  const r = await post({ type: 'General', name: 'NoEmail' });
  assert.equal(r.status, 400);
});
// 12. Invalid email
await test('12 Invalid email → 400', async () => {
  const r = await post({ type: 'General', email: 'not-an-email' });
  assert.equal(r.status, 400);
});
// 13. Honeypot
await test('13 Honeypot → 200, no outbound calls', async () => {
  const r = await post({ type: 'General', email: 'bot@x.com', _gotcha: 'x' });
  assert.equal(r.status, 200);
  assert.equal(r.calls.length, 0);
});
// 14. Unsupported type
await test('14 Unsupported type → 400', async () => {
  const r = await post({ type: 'Hacking', email: 'h@x.com' });
  assert.equal(r.status, 400);
});
// 15. Airtable duplicate retry
await test('15 Duplicate retry → no second insert', async () => {
  const r = await post({ type: 'General', email: 'dup@x.com', submissionId: 'dup1' }, { airtableExisting: true });
  assert.equal(r.status, 200);
  assert.ok(!insertCall(r), 'must not insert when row exists');
});
// 16. Airtable failure → 502 AND no email sent (dup-email protection)
await test('16 Airtable failure → 502, notification email NOT sent', async () => {
  const r = await post({ type: 'General', email: 'f@x.com', submissionId: 's16' }, { airtableInsertFail: true });
  assert.equal(r.status, 502);
  assert.ok(!emailCall(r), 'email must not send if store failed (prevents duplicate emails on retry)');
});
// 17. Brevo email failure → still 200 (best-effort), stored
await test('17 Email failure → 200, record still stored', async () => {
  const r = await post({ type: 'General', email: 'e17@x.com', submissionId: 's17' }, { emailFail: true });
  assert.equal(r.status, 200);
  assert.ok(insertCall(r));
});
// 18. Brevo subscription failure → still 200, stored+emailed
await test('18 Subscribe failure → 200, still stored and emailed', async () => {
  const r = await post({ type: 'Early Access', email: 'e18@x.com', consent: true, submissionId: 's18' }, { contactFail: true });
  assert.equal(r.status, 200);
  assert.ok(insertCall(r) && emailCall(r));
});
// 19. No internal secrets/detail exposed in responses
await test('19 No secrets/detail in any response body', async () => {
  const bodies = [];
  bodies.push((await post({ type: 'General', email: 'ok@x.com', submissionId: 'a' })).json);
  bodies.push((await post({ type: 'General', email: 'bad' })).json);
  bodies.push((await post({ type: 'General', email: 'f@x.com', submissionId: 'b' }, { airtableInsertFail: true })).json);
  for (const b of bodies) {
    const s = JSON.stringify(b);
    assert.ok(!/detail|stack|token|api-key|Bearer|AIRTABLE|BREVO|app6TQ7|routedTo/i.test(s), 'leak in: ' + s);
  }
  // success body is exactly {ok:true}
  assert.deepEqual(bodies[0], { ok: true });
});
// 20. Correct Amazon URL on every Buy button (source scan)
await test('20 Amazon URL + label centralized on all buy buttons', async () => {
  const src = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
  assert.match(src, /const AMAZON_BOOK_URL = 'https:\/\/www\.amazon\.com\/dp\/B0H962BXXC';/);
  assert.match(src, /const BUY_LABEL = 'Buy on Amazon — \$14\.99';/);
  assert.ok(!/amazon\.com\/s\?k=/.test(src), 'no amazon search URLs may remain');
  const hrefs = (src.match(/href=\{AMAZON_BOOK_URL\}/g) || []).length;
  assert.equal(hrefs, 7, 'expected 7 buy buttons, found ' + hrefs);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
