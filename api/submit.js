// TBF Entertainment — form submission backend (Vercel serverless function).
//
// The website forms POST JSON here. This function:
//   1. Rejects non-POST and spam (honeypot).
//   2. Validates required fields.
//   3. Routes the notification to the correct TBF inbox by inquiry type.
//   4. Stores the submission in Airtable (system of record).
//   5. Sends an email notification via Brevo (transactional email).
//
// It is intentionally dependency-free (uses global fetch, Node 18+ on Vercel).
//
// Required environment variables (set in Vercel → Project → Settings → Env):
//   AIRTABLE_TOKEN            Personal access token (data.records:write on the base)
//   AIRTABLE_BASE_ID         e.g. appwnC45fLK2SCgzW (Publishing Command Center)
//   AIRTABLE_SUBMISSIONS_TABLE   Table name, e.g. "Website Submissions"
//   BREVO_API_KEY            Brevo (Sendinblue) transactional API key
//   BREVO_SENDER             Verified sender, e.g. info@tbfentertainment.art
//
// If the storage/email env vars are absent the function returns 503 so the
// front end shows an error (and its manual-email recovery link) instead of
// silently dropping a lead. Nothing here touches DNS or MX records.

const INBOX_ROUTES = {
  'General':      'info@tbfentertainment.art',
  'Early Access': 'info@tbfentertainment.art',
  'Movement':     'info@tbfentertainment.art',
  'Media':        'media@tbfentertainment.art',
  'Publishing':   'acquisitions@tbfentertainment.art',
  'Partnership':  'acquisitions@tbfentertainment.art',
  'Rights':       'rights@tbfentertainment.art',
  'Artistry':     'info@tbfentertainment.art',
  'Street Team':  'submissions@tbfentertainment.art',
};
const DEFAULT_INBOX = 'info@tbfentertainment.art';

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function storeInAirtable(record) {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_SUBMISSIONS_TABLE } = process.env;
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_SUBMISSIONS_TABLE) return false;
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_SUBMISSIONS_TABLE)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ typecast: true, records: [{ fields: record }] }),
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  return true;
}

async function sendEmail({ to, subject, text }) {
  const { BREVO_API_KEY, BREVO_SENDER } = process.env;
  if (!BREVO_API_KEY || !BREVO_SENDER) return false;
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: BREVO_SENDER, name: 'TBF Entertainment Website' },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});

  // 1. Spam: honeypot must be empty. Pretend success so bots don't retry.
  if (body._gotcha) return res.status(200).json({ ok: true });

  // 2. Validation.
  const type = String(body.type || 'General');
  if (!isEmail(body.email)) {
    return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  }

  const inbox = INBOX_ROUTES[type] || DEFAULT_INBOX;
  const now = new Date().toISOString();

  const record = {
    Name: body.name || '',
    Email: body.email,
    Type: type,
    City: body.city || '',
    Message: body.message || body.help || '',
    'How To Help': body.help || '',
    Source: body.source || 'tbfentertainment.art',
    'Routed To': inbox,
    Submitted: now,
  };

  const summary = Object.entries(record)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  try {
    const stored = await storeInAirtable(record);
    const emailed = await sendEmail({
      to: inbox,
      subject: `[TBF ${type}] ${body.name || body.email}`,
      text: `New ${type} submission from tbfentertainment.art:\n\n${summary}`,
    });

    if (!stored && !emailed) {
      // Backend not yet configured — do not claim success.
      return res.status(503).json({ ok: false, error: 'Submission backend not configured.' });
    }
    return res.status(200).json({ ok: true, stored, emailed, routedTo: inbox });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'Delivery failed', detail: String(err.message || err) });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
