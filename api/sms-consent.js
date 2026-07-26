// TBF Entertainment — website SMS consent capture endpoint.
// Records affirmative consent evidence only. It does not send any SMS message.
// Marketing texts must not begin until the applicable Twilio A2P campaign is approved.

import crypto from 'node:crypto';

const PHONE_RE = /^\+1\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSENT_ROUTE = 'info@tbfentertainment.art';
const TIMEOUT_MS = 8000;

function safeParse(value) {
  try { return JSON.parse(value); } catch { return {}; }
}

function limit(value, max) {
  return String(value || '').trim().slice(0, max);
}

function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function stableSubmissionId(body) {
  return 'sms-' + crypto
    .createHash('sha256')
    .update([body.phone, body.submittedAt, body.policyVersion].join('|'))
    .digest('hex')
    .slice(0, 32);
}

async function findExisting(baseUrl, headers, submissionId) {
  const query = new URLSearchParams({
    filterByFormula: `{Submission ID} = '${submissionId}'`,
    maxRecords: '1',
  });
  const response = await fetchWithTimeout(`${baseUrl}?${query}`, { headers });
  if (!response.ok) throw new Error(`Airtable lookup ${response.status}`);
  const data = await response.json();
  return Boolean(data.records && data.records.length);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  if (body._gotcha) return res.status(200).json({ ok: true });

  const firstName = limit(body.firstName, 100);
  const lastName = limit(body.lastName, 100);
  const phone = limit(body.phone, 20);
  const email = limit(body.email, 320);
  const consentText = limit(body.consentText, 1800);
  const policyVersion = limit(body.policyVersion, 80);
  const source = limit(body.source, 300);
  const submittedAt = limit(body.submittedAt, 60);
  const consent = body.consent === true;

  if (!firstName || !lastName) return res.status(400).json({ ok: false, error: 'First and last name are required.' });
  if (!PHONE_RE.test(phone)) return res.status(400).json({ ok: false, error: 'Enter a valid U.S. mobile number.' });
  if (email && !EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: 'Enter a valid email address.' });
  if (!consent) return res.status(400).json({ ok: false, error: 'Affirmative SMS consent is required for this list.' });
  if (!consentText || !policyVersion || !source || !submittedAt) return res.status(400).json({ ok: false, error: 'Consent evidence is incomplete.' });

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_SUBMISSIONS_TABLE;
  if (!token || !baseId || !table) {
    console.error('[tbf-sms] Airtable environment is not configured');
    return res.status(503).json({ ok: false, error: 'We could not save your request right now.' });
  }

  const submissionId = stableSubmissionId({ phone, submittedAt, policyVersion });
  const baseUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  try {
    if (await findExisting(baseUrl, headers, submissionId)) return res.status(200).json({ ok: true });

    const evidence = [
      `Mobile: ${phone}`,
      `SMS Consent: Yes`,
      `Consent Timestamp: ${submittedAt}`,
      `Consent Source: ${source}`,
      `Policy Version: ${policyVersion}`,
      `Consent Language: ${consentText}`,
      `Status: Pending A2P activation`,
    ].join('\n');

    const record = {
      Name: `${firstName} ${lastName}`.trim(),
      Email: email,
      Type: 'SMS Updates',
      City: '',
      Message: evidence,
      'How To Help': 'SMS opt-in request',
      Source: `${source} | SMS consent yes | ${policyVersion}`,
      'Routed To': CONSENT_ROUTE,
      Submitted: submittedAt,
      'Submission ID': submissionId,
    };

    const response = await fetchWithTimeout(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ typecast: true, records: [{ fields: record }] }),
    });
    if (!response.ok) throw new Error(`Airtable insert ${response.status}`);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[tbf-sms] consent capture failed:', error && error.message);
    return res.status(502).json({ ok: false, error: 'We could not save your request right now.' });
  }
}
