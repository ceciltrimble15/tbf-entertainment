// TBF Entertainment — the single source of truth for the SMS opt-in disclosure.
//
// This exact string is what the checkbox shows, what the consent record stores,
// and what the Twilio registration packet quotes. If it changes, bump the
// version so older consent records stay attributable to the wording that was
// actually agreed to.

export const TBF_DISCLOSURE_VERSION = 'TBF-SMS-v1-2026-08-06';

export const TBF_DISCLOSURE =
  'I agree to receive recurring book-release, event, informational, and promotional text messages ' +
  'from TBF Entertainment at the mobile number provided. Up to 4 messages per month. ' +
  'Message and data rates may apply. Consent is not a condition of purchase. ' +
  'Reply STOP to unsubscribe. Reply HELP for assistance. ' +
  'See our Privacy Policy and Terms of Service.';

// Required disclosure elements, asserted by the test suite so a future edit
// cannot silently drop a carrier-mandated clause.
export const TBF_REQUIRED_DISCLOSURE_ELEMENTS = [
  'TBF Entertainment',
  'book-release',
  'event',
  'informational',
  'promotional',
  'Up to 4 messages per month',
  'Message and data rates may apply',
  'Consent is not a condition of purchase',
  'Reply STOP to unsubscribe',
  'Reply HELP for assistance',
  'Privacy Policy',
  'Terms of Service',
];
