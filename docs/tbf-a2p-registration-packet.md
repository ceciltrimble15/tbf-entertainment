# TBF Entertainment — Twilio A2P 10DLC Registration Packet

**Packet version:** 1.0
**Prepared:** 2026-08-06
**Disclosure version referenced throughout:** `TBF-SMS-v1-2026-08-06`

> This packet covers **TBF Entertainment only**. It shares no brand, Messaging
> Service, campaign, consent record, phone number, or registration with
> A/1 Suppliers or A1 Creative Agency. Anything marked **`CECIL REQUIRED`** is
> legal-entity or Twilio-account information that must not be guessed — fill it
> in from the official record before submitting.

---

## 1. Legal entity information

| Field | Value |
| --- | --- |
| Legal company name | **`CECIL REQUIRED`** — exact name on the state registration / IRS record |
| Doing-business-as (DBA) / brand name | TBF Entertainment |
| Business type | **`CECIL REQUIRED`** — LLC, Corporation, Sole Proprietorship, or Partnership |
| Company type (Twilio) | Private Profit *(confirm — depends on the entity type above)* |
| Business industry | ENTERTAINMENT |
| Business registration ID type | EIN (US Tax ID) |
| EIN / Tax ID | **`CECIL REQUIRED`** — 9 digits, must match the IRS record exactly |
| Registered legal address | **`CECIL REQUIRED`** — must match the state/IRS registration |
| Country | United States |
| Business regions of operation | USA and Canada |
| Website | https://www.tbfentertainment.art |
| Stock symbol / exchange | Not applicable (privately held) |

### Authorized representative

| Field | Value |
| --- | --- |
| First / last name | **`CECIL REQUIRED`** |
| Title / job position | **`CECIL REQUIRED`** |
| Business email | **`CECIL REQUIRED`** — should be on the tbfentertainment.art domain |
| Business phone | (513) 866-3832 |

> ⚠️ **Sole Proprietor is a different registration path** with lower throughput
> and an OTP verification step. If TBF Entertainment is not a registered LLC or
> corporation, say so explicitly rather than registering as one — a mismatch
> between the declared business type and the EIN record is a hard rejection.

> ⚠️ **Domain discrepancy to resolve before submitting.** The published book
> cover for *Young Gs vs Old Gs* prints **TBFENTERTAINMENT.COM**, but the live
> site, the support email, and every registered URL in this packet are
> **tbfentertainment.art**. Register the `.art` domain (it is what actually
> serves the opt-in, privacy, and terms pages). Decide separately whether to
> point the `.com` at the same site so readers arriving from the book cover are
> not dead-ended — but do **not** submit `.com` as the opt-in URL unless and
> until it serves the real pages.

---

## 2. Brand

| Field | Value |
| --- | --- |
| Brand / display name (what recipients see) | TBF Entertainment |
| Customer type | **Direct Customer** |
| Brand relationship | Basic Account (self-registered) |
| Vertical | ENTERTAINMENT |
| Support email | info@tbfentertainment.art |
| Support phone | (513) 866-3832 |

**Twilio Brand SID (`BN…`):** `_____________________`
**Brand registration status:** ☐ Not Submitted ☐ Submitted ☐ In Review ☐ Approved ☐ Rejected
**Brand identity status returned by TCR:** `_____________________`
**Brand score:** `_____`

---

## 3. Public URLs (all live and publicly reachable — no login, no JS gate)

| Purpose | URL |
| --- | --- |
| Website | https://www.tbfentertainment.art |
| **Public opt-in URL (submit this as the campaign opt-in link)** | **https://www.tbfentertainment.art/sms-updates** |
| Privacy Policy | https://www.tbfentertainment.art/privacy |
| Terms of Service | https://www.tbfentertainment.art/terms |

These are served as real static HTML, not client-rendered app state — a reviewer
(or `curl`) sees the actual policy text at the URL. `/privacy-policy` and
`/sms-terms` permanently redirect to the canonical URLs so only one version of
each document exists.

The opt-in page is linked from the site footer on every page, and from both
policy pages.

---

## 4. Campaign

### 4.1 Use-case recommendation

**Recommended:** **Low-Volume Mixed**
**Sub-use-cases:** Marketing + Customer Care

**Reasoning against the actual message types**, as instructed. TBF's registered
traffic spans four kinds of message:

| Actual message type | Fits |
| --- | --- |
| Book-release announcements | Marketing |
| Event / signing announcements | Marketing |
| Customer care replies (order and purchase questions) | Customer Care |
| Promotional offers | Marketing |

Because the traffic is genuinely **more than one** use case, a single-use-case
campaign (e.g. Marketing alone) would under-declare it, and carriers filter
traffic that does not match its declared use case. **Mixed** is the correct
declaration.

**Low-Volume** Mixed rather than Standard Mixed because TBF is launching with a
**single** long code and a list built from a book-cover CTA and website
sign-ups — well inside the low-volume daily ceiling. Low-Volume Mixed carries a
materially lower monthly campaign fee and no third-party vetting requirement,
at the cost of lower throughput and a lower daily message cap.

> **Upgrade trigger:** if the list grows past roughly a few thousand subscribers,
> or a release-day blast starts hitting the daily cap, migrate to **Standard
> Mixed** (and consider a short code or a number pool). That is a new campaign
> registration, not an edit.

Charity / 501(c)(3) and all other Special use cases are **not** applicable —
TBF Entertainment is a commercial entertainment company.

| Field | Value |
| --- | --- |
| Campaign use case | Low-Volume Mixed |
| Sub-use-cases | Marketing, Customer Care |
| Subscriber opt-in | Yes |
| Subscriber opt-out | Yes |
| Subscriber help | Yes |
| Embedded link | Yes (links to tbfentertainment.art and named retailers — never a public URL shortener) |
| Embedded phone number | Yes ((513) 866-3832, the brand's own support line) |
| Age-gated content | No — the books are adult fiction, but the messages themselves are not age-gated content under Twilio's definition. **`CECIL REQUIRED`**: confirm no message will promote age-restricted goods. |
| Direct lending / loan arrangement | No |
| Affiliate marketing | No |
| Number pooling | No (single number) |

### 4.2 Campaign description (paste into Twilio)

> TBF Entertainment is a culture-driven entertainment company working in
> publishing, artistry, and media. This campaign sends recurring book-release,
> event, informational, and promotional text messages to readers and customers
> who have explicitly opted in on our website: new title announcements, release
> and pre-order dates, book signings and appearances, company news, promotional
> offers, and replies to purchase or order questions. Consent is collected only
> through a separate, unchecked checkbox at
> https://www.tbfentertainment.art/sms-updates and is never a condition of
> purchase. Message frequency is up to 4 messages per month.

### 4.3 Message flow (paste into Twilio)

> A reader reaches https://www.tbfentertainment.art/sms-updates from the site
> footer (present on every page), from the Privacy Policy or Terms of Service, or
> from the "Join the TBF VIP list" call to action printed on the back cover of
> *Young Gs vs Old Gs* by O.G. Tom Tom (ISBN 979-8-9888776-0-1).
>
> The page states the program name, the sender, the message types, the frequency
> ("Up to 4 messages per month"), that message and data rates may apply, that
> consent is not a condition of purchase, the STOP and HELP instructions, that
> carriers are not liable for delayed or undelivered messages, and that mobile
> and opt-in data are not sold or shared for third-party marketing. It links the
> Privacy Policy and the Terms of Service.
>
> The visitor enters their full name, mobile number, and an optional email. Below
> those fields is a **separate checkbox, unchecked by default**, carrying the full
> consent disclosure. The form cannot be submitted as an opt-in unless the visitor
> actively checks it; submitting without it returns an error stating that consent
> is required to subscribe and is never assumed.
>
> On submit, the server validates the number, records the consent evidence, and
> only then confirms success. If the record cannot be stored, the visitor is told
> plainly that they are NOT subscribed. No message is sent to a number that has
> not completed this flow.

### 4.4 Exact opt-in wording (verbatim — this is what users agree to)

```
I agree to receive recurring book-release, event, informational, and promotional
text messages from TBF Entertainment at the mobile number provided. Up to 4
messages per month. Message and data rates may apply. Consent is not a condition
of purchase. Reply STOP to unsubscribe. Reply HELP for assistance. See our
Privacy Policy and Terms of Service.
```

Source of truth: `lib/tbf-disclosure.js`. The opt-in page and the site's Connect
form render this same wording, and the test suite asserts every mandated clause
is present, so the registered wording and the displayed wording cannot drift.

### 4.5 Message frequency

**Up to 4 messages per month.** Stated identically on the opt-in page, in the
Privacy Policy, in the Terms of Service, and in the consent disclosure.

### 4.6 Opt-out and HELP process

| Keyword | Behaviour |
| --- | --- |
| **STOP** (also STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT) | Twilio Advanced Opt-Out blocks the number immediately. One final confirmation is sent, then nothing further. |
| **START** (also UNSTOP, YES) | Re-subscribes a previously opted-out number and confirms. |
| **HELP** (also INFO) | Returns the brand name, support email, support phone, and how to opt out. |

Additional opt-out routes: email info@tbfentertainment.art or call
(513) 866-3832. Opt-out history is preserved in the consent log so an
unsubscribed number is never silently re-added.

**Recommended keyword responses to configure on the Messaging Service:**

- **STOP reply:** `TBF Entertainment: You are unsubscribed and will get no more messages. Reply START to rejoin or email info@tbfentertainment.art.`
- **START reply:** `TBF Entertainment: You are re-subscribed. Up to 4 msgs/month. Msg&data rates may apply. Reply STOP to unsubscribe, HELP for help.`
- **HELP reply:** `TBF Entertainment updates. Up to 4 msgs/month. Msg&data rates may apply. Help: info@tbfentertainment.art or (513) 866-3832. Reply STOP to unsubscribe.`

### 4.7 Three representative sample messages

1. `TBF Entertainment: Young Gs vs Old Gs by O.G. Tom Tom is out now in paperback and eBook. Get your copy at tbfentertainment.art. Reply STOP to unsubscribe, HELP for help.`
2. `TBF Entertainment: Book signing this Saturday at 2pm in Cincinnati. Details and location at tbfentertainment.art. Reply STOP to unsubscribe, HELP for help.`
3. `TBF Entertainment: Pre-orders for our next release open Friday. Msg&data rates may apply. Reply STOP to unsubscribe, HELP for help.`

Each sample names the brand and carries STOP/HELP, matching what is actually sent.

---

## 5. Consent-recording method

Consent is captured server-side by `POST /api/sms-consent` and written to the
TBF Entertainment Airtable base, table **SMS Consent Log**
(`tblNWlL1d9BheAGUD`, base `app6TQ7oSVSJADxC4`). Writes are idempotent on
`Submission ID`, so a client retry never creates a duplicate row.

| Evidence field | Stored as |
| --- | --- |
| Name | `First Name` + `Last Name` |
| Mobile number (E.164) | `Phone` |
| Email (if supplied) | `Email` |
| Consent status | `SMS Consent` = "Yes" (only on an affirmative check) |
| Exact disclosure text | `Notes` (verbatim, under "Disclosure agreed to") |
| Disclosure version | `Consent Language Version` |
| Source URL | `SMS Consent Source` |
| UTC timestamp | `SMS Consent Timestamp` (ISO-8601 Z) + `Submitted` |
| IP address (where available) | `Notes` |
| User agent (where available) | `Notes` |
| Campaign status | `Notes` — "Campaign Status: Pending A2P activation" |
| Subscription state | `Status` = "Opted In"; `Opt-Out Date` preserves suppression history |
| Dedup key | `Submission ID` |

Guarantees enforced in code and covered by tests:

- An unchecked box is rejected — never stored as a "No" row.
- Invalid or non-US mobile numbers are rejected and store nothing.
- Success is reported **only after** the record is durably stored. Storage
  failure returns 502/503 and tells the user they are NOT subscribed.
- No SMS is sent from the consent path — messaging stays off until approval.

---

## 6. Messaging Service checklist

- [ ] Create a Messaging Service named **"TBF Entertainment — Reader Updates"** (do **not** reuse A1 Creative's or A/1 Suppliers')
- [ ] Use case: Mixed
- [ ] Add **(513) 866-3832** to this Messaging Service's sender pool — and no other number
- [ ] Confirm (513) 866-7141 is **NOT** in this pool (that number belongs to A/1 Suppliers)
- [ ] Enable **Advanced Opt-Out** and set the STOP / START / HELP replies from §4.6
- [ ] Enable **Sticky Sender**
- [ ] Leave **Smart Encoding** on
- [ ] Set the inbound request URL / status callback for customer-care replies (Mixed declares inbound Customer Care — it must actually be handled)
- [ ] Do **not** enable Shorten Links with a public shortener
- [ ] Link the approved Campaign to this Messaging Service
- [ ] Record the Messaging Service SID below

**Messaging Service SID (`MG…`):** `_____________________`

---

## 7. Phone-number association checklist

- [ ] **(513) 866-3832** is owned in the correct Twilio account/subaccount
- [ ] It is assigned to the TBF Entertainment Messaging Service **only**
- [ ] It is **not** assigned to any A/1 Suppliers or A1 Creative Agency service
- [ ] Its voice configuration still routes correctly (registration does not change voice)
- [ ] After campaign approval, confirm the number shows the campaign in the console
- [ ] Send a live end-to-end test to a consented internal number **only after approval**
- [ ] Verify STOP, START, and HELP replies on the live number

**Phone Number SID (`PN…`):** `_____________________`
**Phone number:** +1 (513) 866-3832

---

## 8. Twilio identifiers

| Item | SID | Status |
| --- | --- | --- |
| Brand | `BN…` `_____________________` | ☐ Not Submitted ☐ Submitted ☐ In Review ☐ Approved ☐ Rejected |
| Campaign | `CM…` `_____________________` | ☐ Not Submitted ☐ Submitted ☐ In Review ☐ Approved ☐ Rejected |
| Messaging Service | `MG…` `_____________________` | ☐ Not Created ☐ Created ☐ Linked to Campaign |
| Phone Number | `PN…` `_____________________` | ☐ Not Assigned ☐ Assigned ☐ Verified after approval |

**Overall registration status:** ☐ Not Submitted ☐ Submitted ☐ In Review ☐ Approved ☐ Rejected

**Submitted on:** `__________`   **Decision on:** `__________`

---

## 9. Rejection-repair log

Record every rejection and what was changed. Never resubmit unchanged.

| # | Date | Stage (Brand/Campaign) | Rejection reason given | Root cause | Fix applied | Resubmitted | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |

### Common rejection causes, pre-checked for this campaign

| Cause | Status here |
| --- | --- |
| Opt-in URL returns the homepage / app shell | ✅ Fixed — `/sms-updates` now serves real static HTML (this was the original defect) |
| Opt-in URL not publicly reachable | ✅ Public, no login, verified by `curl` |
| Consent checkbox pre-checked | ✅ Ships unchecked; asserted by test |
| Consent bundled with a purchase | ✅ Separate checkbox; "Consent is not a condition of purchase" stated |
| Disclosure missing frequency | ✅ "Up to 4 messages per month" |
| Disclosure missing rates notice | ✅ "Message and data rates may apply" |
| Disclosure missing STOP/HELP | ✅ Both present |
| Privacy Policy not linked at point of consent | ✅ Linked inside the checkbox label |
| Privacy Policy missing the mobile-data clause | ✅ "not sold" + "not shared … for their marketing or promotional purposes" |
| Campaign description doesn't match the opt-in wording | ✅ Both derived from the same disclosure constant |
| Sample messages missing brand name or STOP | ✅ All three carry both |
| Use case under-declares the traffic | ✅ Mixed declared because traffic is marketing **and** customer care |
| Legal name / EIN / business-type mismatch | ⚠️ **`CECIL REQUIRED`** — verify against the state and IRS records |

---

## 10. Outstanding actions before submission

1. **`CECIL REQUIRED`** — legal name, business type, EIN, registered address, authorized representative.
2. **Resolve the `.com` vs `.art` domain discrepancy** on the book cover (§1).
3. **Set the three Vercel environment variables** on the TBF Entertainment
   project so consent records persist. This is currently **unset in production**:
   a valid opt-in returns an honest `503` and stores nothing (verified live).
   - `AIRTABLE_TOKEN` — a token scoped to the TBF Entertainment Operations base only
   - `AIRTABLE_BASE_ID` — `app6TQ7oSVSJADxC4`
   - `AIRTABLE_SMS_CONSENT_TABLE` — `SMS Consent Log`
   Then redeploy and re-run the live check in §11 — a valid POST must return
   `200 {"ok":true,"stored":true}`.
4. Create the Messaging Service and attach (513) 866-3832 (§6, §7).
5. Submit Brand, then Campaign. Record SIDs in §8.
6. Do not send any marketing message until the campaign status is **Approved**.

---

## 11. Live verification commands

```bash
# Compliance pages must return 200 with real content (not the app shell)
curl -sS https://www.tbfentertainment.art/privacy     | grep -o '<title>.*</title>'
curl -sS https://www.tbfentertainment.art/terms       | grep -o '<title>.*</title>'
curl -sS https://www.tbfentertainment.art/sms-updates | grep -o '<title>.*</title>'

# API must reject non-POST with JSON 405 + Allow: POST
curl -sS -i https://www.tbfentertainment.art/api/sms-consent | head -1

# API must reject unchecked consent with 400
curl -sS -X POST https://www.tbfentertainment.art/api/sms-consent \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","phone":"5135550142","smsConsent":false}'

# API must reject an invalid number with 400
curl -sS -X POST https://www.tbfentertainment.art/api/sms-consent \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","phone":"555","smsConsent":true}'

# A valid opt-in: 503 until the Airtable env vars are set, then 200 + stored:true
curl -sS -X POST https://www.tbfentertainment.art/api/sms-consent \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","phone":"5135550199","smsConsent":true}'
```
