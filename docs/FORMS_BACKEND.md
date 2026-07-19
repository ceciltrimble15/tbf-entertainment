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
| `AIRTABLE_BASE_ID` | `appwnC45fLK2SCgzW` (TBF Entertainment Publishing Command Center) |
| `AIRTABLE_SUBMISSIONS_TABLE` | Table name, e.g. `Website Submissions` |
| `BREVO_API_KEY` | Brevo (Sendinblue) transactional email API key |
| `BREVO_SENDER` | Verified sender, e.g. `info@tbfentertainment.art` |

Until these are set, `/api/submit` returns **503** and the form shows an error with a manual-email recovery link (no lead is silently lost, but automatic capture is off).

## Data capture — current state & recommended setup

**Audit finding:** the Airtable base **"TBF Entertainment Publishing Command Center"** (`appwnC45fLK2SCgzW`) already exists with rich tables (`Books`, `Buyers`, `Street Team`, `Reviews`, `Outreach`, `Launch Tasks`, `ISBN Registry`, `Retail Links`, …). There is **no website form currently connected to it**, and **no single "website submissions / leads" inbox table**.

**Recommended before launch:**
1. Add a table **`Website Submissions`** to that base with fields: `Name` (text), `Email` (email), `Type` (single select), `City` (text), `Message` (long text), `How To Help` (text), `Source` (text), `Routed To` (text), `Submitted` (date/created time). `typecast: true` is used, so single-select options are created on the fly.
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
