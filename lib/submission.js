// A1 Colossal Holdings — shared, brand-agnostic form-submission pipeline.
//
// Reusable across A1 Colossal companies (TBF Entertainment, A1 Creative Agency,
// A/1 Suppliers). Each brand supplies its OWN config (routes, sender, list,
// env-var names) and runs in its OWN Vercel project / Airtable base / Brevo
// account with its OWN environment variables. This module shares only the CODE
// PATTERN — never customer data, credentials, mailing lists, or consent records.
//
// Pipeline per request:
//   1. Reject non-POST (405) and honeypot spam (silent 200).
//   2. Enforce max lengths, valid email, and an allowed submission type.
//   3. Store the record in Airtable (system of record) — REQUIRED, idempotent
//      via "Submission ID" so a retry never creates a duplicate row.
//   4. Notify the routed inbox (best-effort) with Reply-To = submitter.
//   5. Subscribe to the brand mailing list ONLY when the type is eligible AND
//      the submitter gave consent (best-effort).
//
// Internal errors, routing, and secrets are never returned to the caller.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = (v) => typeof v === 'string' && EMAIL_RE.test(v);

// Abuse guard — maximum accepted lengths per field.
const LIMITS = { name: 200, email: 320, city: 120, message: 5000, help: 300, source: 200, submissionId: 64 };

const DEFAULT_TIMEOUT_MS = 8000;
function fetchWithTimeout(url, opts = {}, ms = DEFAULT_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

async function storeInAirtable(env, record, submissionId) {
  const { token, baseId, table } = env.airtable;
  if (!token || !baseId || !table) return { ok: false, configured: false };
  const base = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const auth = { Authorization: `Bearer ${token}` };

  // Idempotency: skip insert if a row already exists for this submissionId.
  // Fail-open if the lookup itself errors so a lead is never blocked.
  if (submissionId) {
    try {
      const q = new URLSearchParams({
        filterByFormula: `{Submission ID} = '${String(submissionId).replace(/'/g, "\\'")}'`,
        maxRecords: '1',
      });
      const found = await fetchWithTimeout(`${base}?${q}`, { headers: auth });
      if (found.ok) {
        const data = await found.json();
        if (data.records && data.records.length > 0) return { ok: true, configured: true, deduped: true };
      }
    } catch (e) {
      console.error('airtable dedup lookup failed, proceeding to insert:', e && e.message);
    }
  }

  const fields = submissionId ? { ...record, 'Submission ID': submissionId } : record;
  const res = await fetchWithTimeout(base, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ typecast: true, records: [{ fields }] }),
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}`);
  return { ok: true, configured: true };
}

async function sendEmail(env, { to, replyTo, replyToName, subject, text, senderName }) {
  const { apiKey, sender } = env.brevo;
  if (!apiKey || !sender) return { ok: false, configured: false };
  const payload = { sender: { email: sender, name: senderName }, to: [{ email: to }], subject, textContent: text };
  if (isEmail(replyTo)) payload.replyTo = { email: replyTo, name: replyToName || replyTo };
  const res = await fetchWithTimeout('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Brevo email ${res.status}`);
  return { ok: true, configured: true };
}

async function subscribe(env, email) {
  const { apiKey, listId } = env.brevo;
  if (!apiKey || !listId) return { ok: false, configured: false };
  // email + list id only — Brevo does not auto-create contact attributes.
  const res = await fetchWithTimeout('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, listIds: [Number(listId)], updateEnabled: true }),
  });
  if (!res.ok && res.status !== 204) throw new Error(`Brevo contact ${res.status}`);
  return { ok: true, configured: true };
}

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }

export async function handleSubmission(req, res, brand) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});

  // Honeypot — pretend success so bots don't retry.
  if (body._gotcha) return res.status(200).json({ ok: true });

  // Abuse guard — reject over-length input with a safe message.
  for (const [key, max] of Object.entries(LIMITS)) {
    if (typeof body[key] === 'string' && body[key].length > max) {
      return res.status(400).json({ ok: false, error: 'One of the fields is too long.' });
    }
  }

  // Allowed submission type only.
  const type = String(body.type || 'General');
  if (!brand.routes[type]) return res.status(400).json({ ok: false, error: 'Unsupported submission type.' });

  const email = String(body.email || '').trim();
  if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });

  const name = String(body.name || '').trim();
  const submissionId = body.submissionId ? String(body.submissionId).slice(0, LIMITS.submissionId) : '';
  const inbox = brand.routes[type];
  const eligible = brand.subscribeTypes.has(type);
  const consent = body.consent === true;
  const source = String(body.source || brand.defaultSource);
  const env = brand.env();

  // Consent status is preserved for eligible (mailing-list) types in the Source
  // field, since the fixed Website Submissions schema has no dedicated column.
  const record = {
    Name: name,
    Email: email,
    Type: type,
    City: String(body.city || ''),
    Message: String(body.message || ''),
    'How To Help': String(body.help || ''),
    Source: eligible ? `${source} (consent: ${consent ? 'yes' : 'no'})` : source,
    'Routed To': inbox,
    Submitted: new Date().toISOString(),
  };

  const summary = Object.entries(record).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');

  // REQUIRED: store the record. Fatal on failure so the client can retry —
  // retries are idempotent via Submission ID (no duplicate row).
  let store;
  try {
    store = await storeInAirtable(env, record, submissionId);
  } catch (e) {
    console.error(`[${brand.id}] airtable store failed:`, e && e.message);
    return res.status(502).json({ ok: false, error: brand.safeError });
  }

  // BEST-EFFORT: notification email + list subscription. Failures are logged,
  // NOT surfaced as request failures — this prevents a retry from re-sending a
  // duplicate notification email once the record is safely stored.
  let emailed = { ok: false, configured: true };
  try {
    emailed = await sendEmail(env, {
      to: inbox, replyTo: email, replyToName: name, senderName: brand.senderName,
      subject: `[${brand.tag} ${type}] ${name || email}`,
      text: `New ${type} submission from ${brand.domain}:\n\n${summary}`,
    });
  } catch (e) { console.error(`[${brand.id}] notification email failed:`, e && e.message); }

  let subscribed = { ok: false };
  if (eligible && consent) {
    try { subscribed = await subscribe(env, email); }
    catch (e) { console.error(`[${brand.id}] list subscribe failed:`, e && e.message); }
  }

  // Nothing configured at all → don't claim success.
  if (!store.configured && !emailed.configured) {
    console.error(`[${brand.id}] backend not configured (Airtable/Brevo env missing)`);
    return res.status(503).json({ ok: false, error: brand.safeError });
  }

  // Public response carries no routing, vendor, or secret detail.
  return res.status(200).json({ ok: true });
}
