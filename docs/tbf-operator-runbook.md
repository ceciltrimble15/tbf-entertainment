# TBF Entertainment — Operator Runbook

For an authorized operator (e.g. Krisha) to run and maintain the communications system **without rebuilding it**. Do not change code or deploy without following the approval gates.

## 1. Where each system lives
| System | Location |
| --- | --- |
| Website code | GitHub `ceciltrimble15/tbf-entertainment` |
| Hosting / deploy | Vercel project `tbf-entertainment` |
| Live site | `https://www.tbfentertainment.art` |
| Form backend | Vercel serverless function `/api/submit` (code: `api/submit.js` + `lib/submission.js`) |
| Records | Airtable base **TBF Entertainment Operations** (`app6TQ7oSVSJADxC4`) → table `Website Submissions` |
| Email + list | Brevo account (TBF) — list `TBF — Early Access / Launch` (id 3), sender `info@tbfentertainment.art` |
| Inboxes | Google Workspace: info@, media@, acquisitions@, rights@, submissions@ |
| Secrets | Vercel → Settings → Environment Variables (Production + Preview) |

## 2. How to test a form (use the Preview URL, labeled test data)
1. Open the Preview deployment (Vercel → Deployments → the Preview build → Visit).
2. Submit a form using clearly labeled test values (e.g. name `TEST — Krisha`, a mailbox you control).
3. Confirm the success message appears.
4. Verify the record, inbox, and (if eligible) Brevo — steps 3–5 below.
5. Delete the test row afterward if appropriate.
> Never test with real customer data.

## 3. How to verify Airtable
- Open the `Website Submissions` table in the **TBF Entertainment Operations** base.
- Confirm a new row with your test values; check `Submission ID` is filled, `Submitted` has date **and** time, `Routed To` matches the routing map, and `Source` shows consent status for Early Access/Movement.
- Retry the same submission (same browser session) → confirm **no duplicate row** appears.

## 4. How to verify Brevo
- Only Early Access / Movement **with consent** should appear.
- Brevo → Contacts → list `TBF — Early Access / Launch` (id 3) → confirm the test email is present.
- A submission **without** consent must **not** appear in the list.

## 5. How to verify inbox routing
- Check the routed inbox (see `tbf-form-routing-map.md`) for the notification email.
- Confirm hitting **Reply** addresses the submitter (Reply-To), not the internal inbox.

## 6. How to rotate credentials
- See `tbf-environment-variable-register.md` for the per-variable procedure.
- General flow: regenerate the key in the vendor → update the value in Vercel (Production + Preview) → trigger a redeploy → run a Preview test → tick "Last verified".
- Never paste a secret into chat, a ticket, a commit, or a screenshot.

## 7. How to respond to a failed deployment
- Follow `tbf-rollback-plan.md`: Vercel → Deployments → promote the last **Ready** build (Instant Rollback).
- If forms error but the site is up, check the env vars are present in the active environment; a missing `AIRTABLE_TOKEN`/`BREVO_API_KEY` makes `/api/submit` return 503 by design.
- Check Vercel function logs for `[tbf] …` error lines (they name the failing step without exposing secrets).

## 8. When CEO approval is required
Before: merging to production, deploying, changing the domain, changing public pricing, changing the Amazon destination, changing sender addresses, sharing data across company lanes, buying a paid Brevo plan, adding a vendor, deleting production records, changing consent language, or moving infrastructure to another account.

## 9. Escalation
- Backend errors you can't resolve from logs → capture the `[tbf] …` log line (no secrets) and escalate.
- Suspected spam flood → see the honeypot note in the launch test report; rate limiting / CAPTCHA is the documented next step.
