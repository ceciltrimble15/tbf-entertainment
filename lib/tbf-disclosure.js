// TBF Entertainment — the single source of truth for the SMS opt-in disclosures.
//
// A2P consent separation: informational/customer-care consent and
// promotional/marketing consent are TWO independent opt-ins. Each has its own
// exact disclosure string, shown on its own checkbox and stored verbatim on the
// consent record. If either string changes, bump TBF_DISCLOSURE_VERSION so older
// consent records stay attributable to the wording that was actually agreed to.

export const TBF_DISCLOSURE_VERSION = 'TBF-SMS-v2-2026-08-10';

// CHECKBOX 1 — Informational / customer care.
export const TBF_INFORMATIONAL_DISCLOSURE =
  'I agree to receive recurring informational and customer-care text messages from TBF Entertainment ' +
  'related to information I request, event logistics, reader support, and service updates. ' +
  'Message frequency varies, up to 4 messages per month total across the TBF SMS programs I select. ' +
  'Message and data rates may apply. Reply STOP to unsubscribe or HELP for assistance. ' +
  'See our Privacy Policy and Terms of Service.';

// CHECKBOX 2 — Marketing / promotional.
export const TBF_MARKETING_DISCLOSURE =
  'I separately agree to receive recurring promotional and marketing text messages from TBF Entertainment, ' +
  'including new book releases, pre-orders, appearances, events, special offers, and promotions. ' +
  'Message frequency varies, up to 4 messages per month total across the TBF SMS programs I select. ' +
  'Message and data rates may apply. Consent is not a condition of purchase. ' +
  'Reply STOP to unsubscribe or HELP for assistance. See our Privacy Policy and Terms of Service.';

// Required clauses per category, asserted by the test suite so a future edit
// cannot silently drop a carrier-mandated element.
export const TBF_INFORMATIONAL_REQUIRED_ELEMENTS = [
  'TBF Entertainment',
  'informational and customer-care',
  'up to 4 messages per month',
  'Message and data rates may apply',
  'Reply STOP to unsubscribe or HELP for assistance',
  'Privacy Policy',
  'Terms of Service',
];

export const TBF_MARKETING_REQUIRED_ELEMENTS = [
  'TBF Entertainment',
  'promotional and marketing',
  'new book releases',
  'up to 4 messages per month',
  'Message and data rates may apply',
  'Consent is not a condition of purchase',
  'Reply STOP to unsubscribe or HELP for assistance',
  'Privacy Policy',
  'Terms of Service',
];

// Legacy combined string kept for reference/back-compat. The two category
// disclosures above are the authoritative, separately-consented wording.
export const TBF_DISCLOSURE = `${TBF_INFORMATIONAL_DISCLOSURE}\n\n${TBF_MARKETING_DISCLOSURE}`;
