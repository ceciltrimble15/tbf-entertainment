# TBF Entertainment — Launch Test Report

Branch `claude/tbf-entertainment-launch-ojc062` · PR #3 · Status: **Preview testing pending**

## A. Automated checks (run in CI-equivalent sandbox)
| Command | Result |
| --- | --- |
| `npm run build` | ✅ pass (Vite production build) |
| `npm run build:standalone` | ✅ pass |
| `node --check api/submit.js` / `lib/submission.js` | ✅ pass |
| `npm test` (20-case backend suite) | ✅ **20/20 pass** |
| `npm audit --omit=dev` | ✅ **0 vulnerabilities** |
| Secret scan (`git grep` for keys/tokens) | ✅ none found |
| Env-var validation (only `process.env.*`, no hardcoding) | ✅ pass |

> Note: no ESLint is configured in this repo; syntax is validated via `node --check`. Adding a linter is an optional improvement.

## A.1 Airtable live verification (2026-07-20) ✅
Verified directly against the live base (resolved **by name**, not by trusting a typed ID):
- Base **TBF Entertainment Operations** → `app6TQ7oSVSJADxC4` (name-resolved; matches config).
- Table **Website Submissions** exists (`tblJRfC54ycBgjUKe`).
- All 10 fields present, exact names: `Name`, `Email`, `Type`, `City`, `Message`, `How To Help`, `Source`, `Routed To`, `Submitted`, `Submission ID`.
- `Submitted` = type **dateTime** (date + time). `Submission ID` = `singleLineText` (dedup filter works). `Type` = `singleSelect` (typecast-safe).
- **Not verifiable from here:** the production Airtable *token's* scope/restriction — the MCP read connection is separate from the deployed token. Operator must confirm the token is `data.records:read` + `:write`, restricted to this base only.

### Backend test cases (all pass)
1 General · 2 Early Access **with** consent (→ list 3) · 3 Early Access **without** consent (stored, **not** subscribed) · 4 Movement · 5 Media · 6 Publishing · 7 Partnership · 8 Rights · 9 Artistry · 10 Street Team · 11 Missing required field → 400 · 12 Invalid email → 400 · 13 Honeypot → dropped · 14 Unsupported type → 400 · 15 Duplicate retry → **no second row** · 16 Airtable failure → 502 **and no email sent** · 17 Email failure → still stored (200) · 18 Subscribe failure → still stored+emailed (200) · 19 No secrets/detail in responses · 20 Correct Amazon URL on all 7 buy buttons.

## B. Idempotency & partial-failure findings
- **Duplicate rows:** prevented. Stable `submissionId` per form fill; server checks `{Submission ID}` before inserting (case 15).
- **Duplicate notification emails (reviewed):** the notification email is sent **after** the Airtable store and is **best-effort** — if it fails, the request still returns 200, so the user does not retry and no duplicate email is sent. If the store fails, the request returns 502 **before** any email is sent (case 16), so a retry re-stores idempotently without a duplicate email. **Residual risk:** if the Airtable insert succeeds but the network drops before the response, a retry is deduped (no row) but *would* re-send the notification email. Low likelihood; acceptable for launch. Follow-up option: dedupe notifications with the same `submissionId`.

## C. Abuse / input protection
Confirmed in code + tests: required fields, email validation, allowed-type allowlist, consent enforcement, honeypot, max field lengths (name 200 / email 320 / city 120 / message 5000 / help 300), malformed-JSON handling (safe-parse → 400), unsupported HTTP method → 405, vendor timeouts (8s abort), safe user-facing errors.
- **Honeypot is not full spam protection.** Recommended next step before or shortly after launch: server-side **rate limiting** (per-IP) and/or **CAPTCHA/Turnstile** on the public forms. Documented as post-launch work, not a blocker.

## D. Live functional test matrix — ⏳ PENDING (operator, on Preview)
Cannot be executed from the build sandbox (no network, no browser, no inbox access). Run on the Vercel **Preview** deployment with labeled test data. Record for **each** form:

| Field | General | Early Access | Movement | Media | Publishing | Partnership | Rights | Artistry | Street Team |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Test date/time | | | | | | | | | |
| Preview URL | | | | | | | | | |
| Submitted values | | | | | | | | | |
| Expected Airtable record | row w/ Submission ID + Submitted(datetime) + Routed To | … | … | … | … | … | … | … | … |
| Actual Airtable result | | | | | | | | | |
| Expected inbox | info@ | info@ | info@ | media@ | acquisitions@ | acquisitions@ | rights@ | info@ | submissions@ |
| Actual inbox result | | | | | | | | | |
| Expected Brevo | — | list 3 (consent) | list 3 (consent) | — | — | — | — | — | — |
| Actual Brevo result | | | | | | | | | |
| Success state shown | | | | | | | | | |
| Failure state (forced) | | | | | | | | | |
| Pass / fail | | | | | | | | | |
| Evidence location | | | | | | | | | |

Minimum to verify: Airtable receives the row · `Submission ID` populated · `Submitted` has date+time · `Routed To` correct · notification reaches the right inbox · Reply-To = submitter · consented Early Access/Movement enter list 3 · non-consented do **not** · duplicate retry makes no duplicate row · all Amazon buttons open the approved page in a new tab · no secret/internal error shown to the visitor. Test on **desktop and mobile**. Remove test rows after validation.

## E. Deliverability verification — ⏳ PENDING (operator; do not skip)
Do **not** report email production-ready on an API 200 alone. Verify and record:
- Brevo account verification status + any pending notice
- Sender verification for `info@tbfentertainment.art`
- Domain authentication: **SPF**, **DKIM**, **DMARC**, sending-domain alignment
- Google Workspace inbox availability for all five addresses
- Test delivery to at least one **external** mailbox (e.g. Gmail) — inbox vs spam
- Reply handling (Reply-To reaches the submitter)

Tools: mail-tester.com (aim 10/10), mxtoolbox.com. Record results and screenshots in the evidence location.

## F. Evidence
Automated results above are reproducible via the commands in section A. Live/deliverability evidence to be attached by the operator after Preview testing.
