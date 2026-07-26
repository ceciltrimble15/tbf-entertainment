// TBF Entertainment — form submission endpoint (Vercel serverless function).
// Environment variables are configured in Vercel and never committed.

import { handleSubmission } from '../lib/submission.js';

const TBF_BRAND = {
  id: 'tbf',
  tag: 'TBF',
  domain: 'tbfentertainment.art',
  senderName: 'TBF Entertainment Website',
  defaultSource: 'tbfentertainment.art',
  safeError: 'We could not process your message right now. Please email info@tbfentertainment.art directly.',
  routes: {
    General: 'info@tbfentertainment.art',
    'Early Access': 'info@tbfentertainment.art',
    Movement: 'info@tbfentertainment.art',
    Artistry: 'info@tbfentertainment.art',
    Media: 'media@tbfentertainment.art',
    Publishing: 'acquisitions@tbfentertainment.art',
    Partnership: 'acquisitions@tbfentertainment.art',
    Rights: 'rights@tbfentertainment.art',
    'Street Team': 'submissions@tbfentertainment.art',
  },
  subscribeTypes: new Set(['Early Access', 'Movement']),
  env: () => ({
    airtable: {
      token: process.env.AIRTABLE_TOKEN,
      baseId: process.env.AIRTABLE_BASE_ID,
      table: process.env.AIRTABLE_SUBMISSIONS_TABLE,
    },
    brevo: {
      apiKey: process.env.BREVO_API_KEY,
      sender: process.env.BREVO_SENDER,
      listId: process.env.BREVO_LIST_ID,
    },
  }),
};

function parseBody(req) {
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body || {};
}

export default function handler(req, res) {
  const body = parseBody(req);
  if (body.phone || body.smsConsent) {
    const smsRecord = [
      '',
      '--- SMS CONSENT RECORD ---',
      `Mobile Phone: ${String(body.phone || '')}`,
      `SMS Consent: ${body.smsConsent === true ? 'YES' : 'NO'}`,
      `Consent Timestamp: ${String(body.consentTimestamp || '')}`,
      `Consent Language: ${String(body.smsConsentText || '')}`,
      `Page URL: ${String(body.pageUrl || '')}`,
      `User Agent: ${String(body.userAgent || '')}`,
    ].join('\n');
    body.message = `${String(body.message || '')}${smsRecord}`.slice(0, 5000);
    body.source = `${String(body.source || TBF_BRAND.defaultSource)} | SMS consent: ${body.smsConsent === true ? 'yes' : 'no'}`.slice(0, 200);
    req.body = body;
  }
  return handleSubmission(req, res, TBF_BRAND);
}
