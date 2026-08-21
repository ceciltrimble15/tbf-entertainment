# Forms Backend & Data Capture

How every website form is submitted, routed, and stored. Replaces the old
`mailto:`-only behavior.

## Architecture

```
Browser form  ──POST /api/submit──▶  Vercel serverless function (api/submit.js)
                                       ├─ honeypot spam check
                                       ├─ required-field validation
                                       ├─ route by inquiry type → correct inbox
                                       ├─ store record → Airtable (system of record)
                                       └─ notify → Brevo transactional email
```

- **Primary path:** `POST /api/submit`. `mailto:` is **not** the primary method — it appears only as a manual-recovery link if the backend call fails.
- **Spam protection:** every form has a hidden honeypot field (`_gotcha`); the server silently drops any submission that fills it.
- **Validation:** required fields on the client (`required`) plus server-side email validation.
- **Consent:** each form shows consent/permission language before submit.
- **Reply-To:** notification emails set `Reply-To` to the submitter, so hitting *Reply* in the inbox writes straight back to the person.
- **Mailing list (consent-gated):** `Early Access` and `Movement` signups are added to the Brevo contact list (`BREVO_LIST_ID`) **only when the submitter checks the consent box**. Idempotent (re-subscribing is safe). Consent status is preserved in the Airtable `Source` field.
- **Architecture:** shared brand-agnostic pipeline in `lib/submission.js`; TBF-specific config in `api/submit.js`. See `docs/a1-colossal-communications-standard.md` for the reuse pattern and `docs/tbf-form-routing-map.md` for routing.
- **Error hygiene:** internal errors and env/secret values are never returned to the browser; failures are logged server-side and the client gets a generic, safe message.
- **Idempotency:** each form fill carries a stable `submissionId`; the server skips the Airtable insert if a row with that id already exists, so retrying after a partial failure (e.g. Airtable saved but email failed) never creates a duplicate row.

## Forms on the site

| Form | Location | Inquiry type | Routes to |
| --- | --- | --- | --- |
| Email capture (compact) | Home CTA | `Early Access` | `info@` |
| Contact / inquiry (full) | Connect page | select: General / Publishing / Rights / Artistry / Media / Partnership | see routing table |
| Join the Movement | `/young-gs` | `Movement` | `info@` |
| Street Team | `/young-gs` | `Street Team` | `submissions@` |

### Inquiry type → inbox (authoritative, in `api/submit.js`)

| Type | Inbox |
| --- | --- |
| General / Early Access / Movement / Artistry | `info@tbfentertainment.art` |
| Media | `media@tbfentertainment.art` |
| Publishing / Partnership | `acquisitions@tbfentertainment.art` |
| Rights | `rights@tbfentertainment.art` |
| Street Team | `submissions@tbfentertainment.art` |

## Required environment variables (Vercel → Settings → Environment Variables)

| Var | Purpose |
| --- | --- |
| `AIRTABLE_TOKEN` | Airtable personal access token, scope `data.records:write` on the base |
| `AIRTABLE_BASE_ID` | `app6TQ7oSVSJADxC4` (**TBF Entertainment Operations** — the base the CEO created the `Website Submissions` table in) |
| `AIRTABLE_SUBMISSIONS_TABLE` | Table name, e.g. `Website Submissions` |
| `BREVO_API_KEY` | Brevo (Sendinblue) transactional **+ contacts** API key |
| `BREVO_SENDER` | Verified sender, e.g. `info@tbfentertainment.art` |
| `BREVO_LIST_ID` | Numeric Brevo list id that Early Access / Movement signups join |

Until these are set, `/api/submit` returns **503** and the form shows an error with a manual-email recovery link (no lead is silently lost, but automatic capture is off).

## Brevo list setup (mailing list)
1. Brevo → **Contacts → Lists → Create a list**, e.g. `TBF — Early Access / Launch`.
2. Copy its **numeric list id** → set `BREVO_LIST_ID`.
3. Brevo → **SMTP & API → API Keys** → create a key with contacts + transactional access → set `BREVO_API_KEY`.
4. Brevo → **Senders** → verify `info@tbfentertainment.art` → set `BREVO_SENDER`.
5. **Contact attributes:** the function subscribes with **email + list id only**. Brevo does **not** auto-create attributes — passing `FIRSTNAME`/`CITY` before they exist in the account makes the contacts call fail. The submitter's name/city are still captured in Airtable. To personalize campaigns later, create those attributes in Brevo (**Contacts → Settings → Contact attributes**) and add them back to `subscribeToBrevoList` in `api/submit.js`.

## Data capture — current state & recommended setup

**Base of record:** the `Website Submissions` table lives in the **TBF Entertainment Operations** base (`app6TQ7oSVSJADxC4`). (A separate, richer base — *TBF Entertainment Publishing Command Center*, `appwnC45fLK2SCgzW` — also exists for catalog/launch ops; the website backend writes to **Operations**, not that one.)

**Recommended before launch:**
1. Add a table **`Website Submissions`** to that base with fields: `Name` (text), `Email` (email), `Type` (single select), `City` (text), `Message` (long text), `How To Help` (text), `Source` (text), `Routed To` (text), `Submitted` (date/created time), **`Submission ID` (single line text)**. `typecast: true` is used, so single-select options are created on the fly. **`Submission ID` is required for retry de-duplication** — the server looks up this field before inserting, so a retried submission never creates a duplicate row. (If the field is missing the lookup fails open and inserts anyway, so add it.)
2. Create an Airtable personal access token scoped to that base and set the env vars above.
3. Optionally add automations in Airtable to fan a `Street Team` row into the existing `Street Team` table and buyers/subscribers into `Buyers`.
4. For the mailing list specifically, connect **Brevo** (already the email provider here) as the list-of-record so subscribers flow into a Brevo contact list for campaigns.

Alternative all-in-one: point `FORM_ENDPOINT` at a **Formspree** form instead of `/api/submit` — simpler, but a single free Formspree form delivers to one inbox and does not do per-type routing. The `/api/submit` function is the recommended path because it routes to five inboxes and stores structured records.

## Testing checklist (run on the deployed site — not possible from the build sandbox)
- [ ] Submit each form; confirm success state renders.
- [ ] Confirm a row appears in `Website Submissions`.
- [ ] Confirm the notification email arrives in the correct inbox per the routing table.
- [ ] Submit with the honeypot filled (via devtools) → confirm it's dropped.
- [ ] Repeat on a phone (iOS Safari + Android Chrome).
