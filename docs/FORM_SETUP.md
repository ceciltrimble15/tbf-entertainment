# TBF Entertainment — Form Delivery & Consent Capture

How the contact / lead-capture forms submit, what data they send, how SMS
consent is recorded, and what remains to connect a permanent backend.

> **Status:** The form endpoint is **not yet configured**. Until a secure
> `VITE_FORM_ENDPOINT` is supplied, the site uses the mailto fallback described
> below. This is a working fallback, **not** a completed automated
> lead-capture system.

---

## 1. How submissions flow today

The single submit path lives in `src/App.jsx` (`submitLead()`), driven by one
build-time environment variable:

```js
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
```

- **If `VITE_FORM_ENDPOINT` is set:** the form `POST`s the submission as JSON to
  that endpoint (e.g. a Formspree form) and shows the success state only after
  the request succeeds.
- **If it is empty (current state):** `submitLead()` falls back to opening the
  visitor's email client (`mailto:`) with every submitted field pre-filled,
  addressed to the correct destination inbox. The success state is **not**
  shown until the email action has been triggered, so users are never told
  "success" before anything actually happens.

No secret is hardcoded in the repository. The endpoint is supplied only through
the environment variable.

## 2. Required environment variable

| Variable | Where to set it | Example |
| --- | --- | --- |
| `VITE_FORM_ENDPOINT` | `.env.local` (local dev) and Vercel → Settings → Environment Variables | `https://formspree.io/f/abcdwxyz` |

See `.env.example`. Vite only exposes variables prefixed with `VITE_` to the
client, which is required here because this is a static front-end. Use a form
backend whose endpoint is safe to expose publicly (Formspree, Netlify Forms,
Basin, etc.) — never put a private API key/token in a `VITE_` variable.

After setting it: `npm run build` (and `npm run build:standalone` if you use the
single-file build), then redeploy.

## 3. Fields submitted

Every contact-form submission includes:

| Field | Description |
| --- | --- |
| `type` | Inquiry type (General, Publishing, Artistry, Media, Partnership) |
| `name` | Submitter name |
| `email` | Submitter email |
| `phone` | Mobile phone number (optional) |
| `message` | Free-text message |
| `smsConsent` | `true`/`false` — whether the SMS opt-in box was checked |
| `smsConsentText` | The **exact** disclosure shown, recorded only when consent was granted |
| `consentTimestamp` | ISO 8601 timestamp (`new Date().toISOString()`) recorded only when consent was granted |
| `pageUrl` | The URL the form was submitted from |
| `userAgent` | Browser user agent, when available |

Email consent (the inquiry itself) and SMS consent are recorded **separately** —
`smsConsent` is independent of the inquiry, and SMS consent is never required to
submit.

## 4. How SMS consent is recorded (A2P 10DLC)

- The opt-in checkbox is **unchecked by default** and is **never** a condition of
  submitting an inquiry or of any purchase.
- The exact disclosure is shown inline next to the checkbox (not in a popup) and
  is stored verbatim in `SMS_CONSENT_TEXT` (`src/App.jsx`).
- When (and only when) the user checks the box, the submission records
  `smsConsent: true`, the exact `smsConsentText`, and an ISO `consentTimestamp`.
- The disclosure links to `/privacy`, `/terms`, and `/sms-terms`.

If you edit the disclosure wording, edit **both** the plain-text
`SMS_CONSENT_TEXT` constant and the `SmsConsentDisclosure` JSX so the recorded
text always matches what the user saw.

## 5. Where submissions should be stored

Consent records must be retained (A2P 10DLC compliance) so you can prove what a
user agreed to and when. Recommended: route the endpoint into a durable store —
for example Formspree → Airtable, Google Sheets, or a database — keeping the
`smsConsent`, `smsConsentText`, and `consentTimestamp` columns. See
`docs/AIRTABLE_PUBLISHING_TRACKER.md` for the tracker schema.

## 6. Per-form destination routing

`submitLead(payload, to)` passes a destination address; the mailto fallback
honors it exactly, and a configured backend receives it as `_to`:

| Form | Routes to |
| --- | --- |
| Site contact form + email capture | `info@tbfentertainment.art` |
| "Join the Movement" (Young G's page) | `info@tbfentertainment.art` |
| Street Team (Young G's page) | `submissions@tbfentertainment.art` |

A single free Formspree form delivers to one inbox — to keep Street Team going
to `submissions@`, create a second form/endpoint or use the backend's routing
rules.

## 7. What remains to connect a permanent backend

- [ ] **CEO approval** of a form backend (Airtable, Formspree, Netlify Forms, or
      another approved service). *No third-party service has been chosen or
      purchased.*
- [ ] Create the form/endpoint and set `VITE_FORM_ENDPOINT` in Vercel.
- [ ] Confirm the destination store retains the SMS consent fields
      (`smsConsent`, `smsConsentText`, `consentTimestamp`).
- [ ] Send a test submission (with and without SMS consent) and confirm receipt.
