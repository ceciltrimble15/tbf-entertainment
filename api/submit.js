// TBF Entertainment — form submission backend (Vercel serverless function).
//
// The website forms POST JSON here. This function:
//   1. Rejects non-POST and spam (honeypot).
//   2. Validates required fields.
//   3. Routes the notification to the correct TBF inbox by inquiry type,
//      with Reply-To set to the submitter so replies reach them directly.
//   4. Stores the submission in Airtable (system of record).
//   5. Subscribes Early Access / Movement signups to the Brevo contact list.
//
// Dependency-free (global fetch, Node 18+ on Vercel).
//
// SECURITY: internal error details and env values are NEVER returned to the
// client — failures are logged server-side and the client gets a generic
// message. Nothing here touches DNS or MX records.
//
// Required environment variables (Vercel → Project → Settings → Env):
//   AIRTABLE_TOKEN              PAT with data.records:write on the base
//   AIRTABLE_BASE_ID           e.g. appwnC45fLK2SCgzW
//   AIRTABLE_SUBMISSIONS_TABLE Table name, e.g. "Website Submissions"
//   BREVO_API_KEY              Brevo transactional + contacts API key
//   BREVO_SENDER               Verified sender, e.g. info@tbfentertainment.art
//   BREVO_LIST_ID              Numeric Brevo list id for Early Access subscribers

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
// Types that represent a mailing-list opt-in.
const SUBSCRIBE_TYPES = new Set(['Early Access', 'Movement']);

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
  if (!res.ok) throw new Error(`Airtable ${res.status}`);
  return true;
}

async function sendEmail({ to, replyTo, replyToName, subject, text }) {
  const { BREVO_API_KEY, BREVO_SENDER } = process.env;
  if (!BREVO_API_KEY || !BREVO_SENDER) return false;
  const payload = {
    sender: { email: BREVO_SENDER, name: 'TBF Entertainment Website' },
    to: [{ email: to }],
    subject,
    textContent: text,
  };
  // Replies go straight back to the person who submitted the form.
  if (isEmail(replyTo)) payload.replyTo = { email: replyTo, name: replyToName || replyTo };
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Brevo email ${res.status}`);
  return true;
}

async function subscribeToBrevoList({ email, name, city }) {
  const { BREVO_API_KEY, BREVO_LIST_ID } = process.env;
  if (!BREVO_API_KEY || !BREVO_LIST_ID) return false;
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      listIds: [Number(BREVO_LIST_ID)],
      updateEnabled: true, // idempotent: re-subscribing an existing contact is fine
      attributes: { FIRSTNAME: name || '', CITY: city || '' },
    }),
  });
  // 201 created or 204 updated are both success. Duplicate is not an error.
  if (!res.ok && res.status !== 204) throw new Error(`Brevo contact ${res.status}`);
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
  const email = String(body.email || '').trim();
  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  const name = String(body.name || '').trim();
  const inbox = INBOX_ROUTES[type] || DEFAULT_INBOX;
  const now = new Date().toISOString();

  const record = {
    Name: name,
    Email: email,
    Type: type,
    City: body.city || '',
    Message: body.message || '',
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
      replyTo: email,
      replyToName: name,
      subject: `[TBF ${type}] ${name || email}`,
      text: `New ${type} submission from tbfentertainment.art:\n\n${summary}`,
    });
    let subscribed = false;
    if (SUBSCRIBE_TYPES.has(type)) {
      subscribed = await subscribeToBrevoList({ email, name, city: body.city });
    }

    if (!stored && !emailed && !subscribed) {
      // Backend not configured yet — do not claim success.
      console.error('submit: no backend configured (Airtable/Brevo env missing)');
      return res.status(503).json({ ok: false, error: 'Submissions are temporarily unavailable. Please email us directly.' });
    }
    return res.status(200).json({ ok: true, routedTo: inbox });
  } catch (err) {
    // Log the real cause server-side; return a safe generic message.
    console.error('submit error:', err && err.message ? err.message : err);
    return res.status(502).json({ ok: false, error: 'We could not deliver your message. Please email us directly.' });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
