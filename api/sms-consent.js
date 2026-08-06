// TBF Entertainment — A2P 10DLC SMS consent endpoint (Vercel serverless function).
//
// Credentials live in Vercel environment variables and are never committed.
// This endpoint records consent evidence only. It never sends SMS — messaging
// stays off until the TBF A2P campaign is approved by the carriers.

import { handleConsentRequest } from '../lib/consent.js';
import { TBF_DISCLOSURE, TBF_DISCLOSURE_VERSION } from '../lib/tbf-disclosure.js';

export const TBF_CONSENT_BRAND = {
  id: 'tbf',
  formType: 'SMS Updates',
  campaignStatus: 'Pending A2P activation',
  disclosure: TBF_DISCLOSURE,
  disclosureVersion: TBF_DISCLOSURE_VERSION,
  defaultSourceUrl: 'https://www.tbfentertainment.art/sms-updates',
  // TBF collects no relationship field — that is an A/1 Suppliers requirement.
  relationships: null,
  storageError:
    'We could not record your consent right now, so you are NOT subscribed. ' +
    'Please try again, or email info@tbfentertainment.art and we will add you manually.',
  env: () => ({
    airtable: {
      token: process.env.AIRTABLE_TOKEN,
      baseId: process.env.AIRTABLE_BASE_ID,
      table: process.env.AIRTABLE_SMS_CONSENT_TABLE,
    },
  }),
};

export default function handler(req, res) {
  return handleConsentRequest(req, res, TBF_CONSENT_BRAND);
}
