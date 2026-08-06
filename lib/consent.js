// A2P 10DLC SMS consent capture — brand-agnostic pipeline.
//
// Each brand supplies its OWN config (disclosure text, version, Airtable base
// and table, env-var names, support contacts) and runs in its OWN Vercel
// project with its OWN environment variables. This module shares only the CODE
// PATTERN — never consent records, mailing lists, or credentials.
//
// Design rules this file enforces, in order:
//   1. Only POST is accepted. Everything else gets JSON + 405 and an Allow header.
//   2. The consent checkbox must be actively true. Unchecked is a 400, never a
//      silent "no" row — carriers require proof of affirmative opt-in.
//   3. The mobile number must normalize to a valid US/CA E.164 number.
//   4. The record is stored BEFORE success is returned. If storage fails or is
//      unconfigured the caller gets an honest 5xx — we never claim success for
//      a consent record that does not exist.
//   5. No SMS is ever sent from this path. Sending is gated on A2P approval.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepted lengths — anything longer is rejected rather than silently truncated.
const LIMITS = { name: 200, firstName: 100, lastName: 100, email: 320, phone: 40, submissionId: 64, sourceUrl: 500, userAgent: 500 };

const DEFAULT_TIMEOUT_MS = 8000;

export const isEmail = (v) => typeof v === 'string' && EMAIL_RE.test(v);

/**
 * Normalize a North American mobile number to E.164.
 * Returns { ok: true, e164 } or { ok: false, reason }.
 *
 * Rejects the shapes carriers reject: wrong length, N11 / invalid NPA-NXX
 * (area code or exchange starting with 0 or 1), and obvious placeholders.
 */
export function normalizePhone(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return { ok: false, reason: 'Enter your mobile number.' };

  const digits = raw.replace(/[^\d]/g, '');
  let national = digits;
  if (national.length === 11 && national.startsWith('1')) national = national.slice(1);
  if (national.length !== 10) return { ok: false, reason: 'Enter a valid 10-digit US mobile number.' };

  const npa = national.slice(0, 3);
  const nxx = national.slice(3, 6);
  if (npa[0] === '0' || npa[0] === '1') return { ok: false, reason: 'Enter a valid 10-digit US mobile number.' };
  if (nxx[0] === '0' || nxx[0] === '1') return { ok: false, reason: 'Enter a valid 10-digit US mobile number.' };
  if (npa[1] === '9' && npa[2] === '9') return { ok: false, reason: 'Enter a valid 10-digit US mobile number.' };
  if (/^(\d)\1{9}$/.test(national)) return { ok: false, reason: 'Enter a valid 10-digit US mobile number.' };

  return { ok: true, e164: `+1${national}` };
}

/** Split a single "full name" field into first / last for storage. */
export function splitName(full) {
  const parts = String(full || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

/**
 * Validate a consent submission body against a brand config.
 * Returns { ok: true, value } or { ok: false, status, error }.
 */
export function validateConsent(body, brand) {
  for (const [key, max] of Object.entries(LIMITS)) {
    if (typeof body[key] === 'string' && body[key].length > max) {
      return { ok: false, status: 400, error: 'One of the fields is too long.' };
    }
  }

  const name = String(body.name || '').trim();
  if (!name) return { ok: false, status: 400, error: 'Enter your full name.' };

  // Affirmative opt-in only. `true` or the string "true" from a form post.
  const consent = body.smsConsent === true || body.smsConsent === 'true';
  if (!consent) {
    return { ok: false, status: 400, error: 'You must check the consent box to receive text messages. Consent is required to subscribe and is never assumed.' };
  }

  const phone = normalizePhone(body.phone);
  if (!phone.ok) return { ok: false, status: 400, error: phone.reason };

  // Email is optional, but if supplied it must be well-formed.
  const email = String(body.email || '').trim();
  if (email && !isEmail(email)) return { ok: false, status: 400, error: 'Enter a valid email address, or leave it blank.' };

  const relationship = String(body.relationship || '').trim();
  if (brand.relationships && brand.relationships.length > 0) {
    if (!relationship) return { ok: false, status: 400, error: 'Select your relationship to the organization.' };
    if (!brand.relationships.includes(relationship)) {
      return { ok: false, status: 400, error: 'Select your relationship to the organization.' };
    }
  }

  return { ok: true, value: { name, ...splitName(name), phone: phone.e164, email, relationship, consent: true } };
}

/** Client IP, best-effort, from the proxy headers Vercel sets. */
export function clientIp(req) {
  const h = (req && req.headers) || {};
  const fwd = h['x-forwarded-for'] || h['X-Forwarded-For'];
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim();
  if (Array.isArray(fwd) && fwd.length) return String(fwd[0]).split(',')[0].trim();
  return h['x-real-ip'] || h['x-vercel-forwarded-for'] || '';
}

/**
 * Build the consent-evidence record. Every field a carrier or Twilio reviewer
 * can ask for is captured here, including the verbatim disclosure text.
 */
export function buildConsentRecord(value, meta, brand) {
  const notes = [
    `Campaign Status: ${brand.campaignStatus}`,
    `IP Address: ${meta.ip || 'not available'}`,
    `User Agent: ${meta.userAgent || 'not available'}`,
    value.relationship ? `Relationship: ${value.relationship}` : null,
    '',
    'Disclosure agreed to (verbatim):',
    brand.disclosure,
  ].filter((l) => l !== null).join('\n');

  return {
    'Submission ID': meta.submissionId,
    'First Name': value.firstName,
    'Last Name': value.lastName,
    Email: value.email,
    Phone: value.phone,
    'SMS Consent': 'Yes',
    'SMS Consent Timestamp': meta.timestamp,
    'SMS Consent Source': meta.sourceUrl,
    'Consent Language Version': brand.disclosureVersion,
    Submitted: meta.timestamp,
    'Form Type': brand.formType,
    Status: 'Opted In',
    Notes: notes,
  };
}

function fetchWithTimeout(url, opts = {}, ms = DEFAULT_TIMEOUT_MS, fetchImpl = fetch) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetchImpl(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

/**
 * Persist the consent record to Airtable.
 * Returns { stored: true } | { stored: false, configured: false } | throws.
 * Idempotent on Submission ID so a client retry never duplicates a row.
 */
export async function storeConsent(env, record, submissionId, fetchImpl = fetch) {
  const { token, baseId, table } = env.airtable;
  if (!token || !baseId || !table) return { stored: false, configured: false };

  const base = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const auth = { Authorization: `Bearer ${token}` };

  if (submissionId) {
    try {
      const q = new URLSearchParams({
        filterByFormula: `{Submission ID} = '${String(submissionId).replace(/'/g, "\\'")}'`,
        maxRecords: '1',
      });
      const found = await fetchWithTimeout(`${base}?${q}`, { headers: auth }, DEFAULT_TIMEOUT_MS, fetchImpl);
      if (found.ok) {
        const data = await found.json();
        if (data.records && data.records.length > 0) return { stored: true, configured: true, deduped: true };
      }
    } catch (e) {
      // Fail open on the lookup only — a dedup outage must not block a consent record.
      console.error('consent dedup lookup failed, proceeding to insert:', e && e.message);
    }
  }

  const res = await fetchWithTimeout(base, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ typecast: true, records: [{ fields: record }] }),
  }, DEFAULT_TIMEOUT_MS, fetchImpl);

  if (!res.ok) throw new Error(`Airtable ${res.status}`);
  return { stored: true, configured: true };
}

function parseBody(req) {
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body || {};
}

/**
 * Full request handler. `deps` is injectable so tests run with no network.
 */
export async function handleConsentRequest(req, res, brand, deps = {}) {
  const now = deps.now || (() => new Date().toISOString());
  const newId = deps.newId || (() => `sc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`);
  const store = deps.store || storeConsent;

  if (req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed. This endpoint accepts POST only.' });
  }

  const body = parseBody(req);

  // Honeypot — bots get a plain 200 with no record written.
  if (body._gotcha) return res.status(200).json({ ok: true, stored: false });

  const checked = validateConsent(body, brand);
  if (!checked.ok) return res.status(checked.status).json({ ok: false, error: checked.error });

  const meta = {
    submissionId: String(body.submissionId || '').slice(0, LIMITS.submissionId) || newId(),
    timestamp: now(),
    sourceUrl: String(body.sourceUrl || body.pageUrl || brand.defaultSourceUrl).slice(0, LIMITS.sourceUrl),
    userAgent: String(body.userAgent || (req.headers && req.headers['user-agent']) || '').slice(0, LIMITS.userAgent),
    ip: clientIp(req),
  };

  const record = buildConsentRecord(checked.value, meta, brand);

  let result;
  try {
    result = await store(brand.env(), record, meta.submissionId);
  } catch (e) {
    console.error(`[${brand.id}] consent store failed:`, e && e.message);
    return res.status(502).json({ ok: false, error: brand.storageError });
  }

  // Nothing configured → say so honestly. Never report a stored consent record
  // that was not actually written.
  if (!result.configured) {
    console.error(`[${brand.id}] consent storage not configured (Airtable env vars missing)`);
    return res.status(503).json({ ok: false, error: brand.storageError });
  }

  // Success only after the record is durably stored. No SMS is sent here —
  // messaging stays off until the A2P campaign is approved.
  return res.status(200).json({
    ok: true,
    stored: true,
    submissionId: meta.submissionId,
    consentRecordedAt: meta.timestamp,
    campaignStatus: brand.campaignStatus,
  });
}
