// TBF Entertainment — form submission endpoint (Vercel serverless function).
//
// Thin brand-config layer over the shared A1 Colossal pipeline
// (../lib/submission.js). Everything TBF-specific lives here; the reusable
// logic is in the shared module. A1 Creative Agency and A/1 Suppliers would
// each ship their OWN copy of this file (own routes, sender, list, env, base,
// Vercel project) — no customer data, credentials, or lists are shared.
//
// Environment variables (Vercel → Project → Settings → Environment Variables,
// Production + Preview; values never live in code):
//   AIRTABLE_TOKEN              PAT, scope data.records:read + data.records:write,
//                               restricted to the TBF Entertainment Operations base
//   AIRTABLE_BASE_ID            app6TQ7oSVSJADxC4  (TBF Entertainment Operations)
//   AIRTABLE_SUBMISSIONS_TABLE  Website Submissions
//   BREVO_API_KEY               TBF Brevo transactional + contacts key
//   BREVO_SENDER                info@tbfentertainment.art  (verified sender)
//   BREVO_LIST_ID               3  (TBF — Early Access / Launch)

import { handleSubmission } from '../lib/submission.js';

const TBF_BRAND = {
  id: 'tbf',
  tag: 'TBF',
  domain: 'tbfentertainment.art',
  senderName: 'TBF Entertainment Website',
  defaultSource: 'tbfentertainment.art',
  safeError: 'We could not process your message right now. Please email info@tbfentertainment.art directly.',

  // Inquiry type → destination inbox (authoritative, server-side).
  routes: {
    'General':      'info@tbfentertainment.art',
    'Early Access': 'info@tbfentertainment.art',
    'Movement':     'info@tbfentertainment.art',
    'Artistry':     'info@tbfentertainment.art',
    'Media':        'media@tbfentertainment.art',
    'Publishing':   'acquisitions@tbfentertainment.art',
    'Partnership':  'acquisitions@tbfentertainment.art',
    'Rights':       'rights@tbfentertainment.art',
    'Street Team':  'submissions@tbfentertainment.art',
  },

  // Only these types may join the mailing list, and only WITH consent.
  subscribeTypes: new Set(['Early Access', 'Movement']),

  // Read env at request time (never captured at module load).
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

export default function handler(req, res) {
  return handleSubmission(req, res, TBF_BRAND);
}
