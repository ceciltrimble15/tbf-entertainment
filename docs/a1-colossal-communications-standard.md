# A1 Colossal Holdings — Digital Communications Standard

Version 1.0 · Owner: A1 Colossal Holdings Inc. · First implementation: TBF Entertainment

A1 Colossal Holdings sets the architecture, security, and documentation standards. Each operating company **owns its own data, credentials, sender identity, and records**. This document is the reusable standard; the first production instance is the TBF Entertainment website communications backend.

## 1. Governance role
A1 Colossal Holdings defines and audits:
- shared architecture + reusable code patterns (this repo's `lib/submission.js`),
- security and documentation standards,
- vendor-management standards,
- executive reporting and approval gates.

A1 Colossal does **not** own operating-company customer data. It governs *how* systems are built, not *what* contacts a company holds.

## 2. Company-separation rules (hard rules)
```
A1 Colossal Holdings
├── Shared: architecture, security, code patterns, vendor standards, reporting
├── TBF Entertainment    → own site · own Airtable base · own Brevo lists · own senders · own env
├── A1 Creative Agency   → own data & communications lane (separate)
└── A/1 Suppliers        → own nonprofit data & communications lane (separate)
```
- **Never** combine companies' contacts, credentials, mailing lists, or consent records.
- Reusable **code** is allowed; shared **customer data** is not, absent documented legal authority + explicit consent.
- **A/1 Suppliers** youth, family, donor, and participant data must **never** enter TBF or A1 Creative marketing lists.
- Each company runs in its **own** Vercel project, Airtable base, Brevo account, and environment-variable set. No cross-company shared secrets unless the CEO explicitly authorizes a shared-secret design.

## 3. Reusable architecture
```
Website form → Vercel serverless (/api/submit) → Airtable (record) → routed inbox → Brevo list (consent only)
```
The pattern separates:
- **shared submission logic** — `lib/submission.js` (brand-agnostic: validation, spam, idempotency, timeouts, safe errors),
- **brand-specific config** — `api/submit.js` per company (routes, sender identity, mailing-list rules, env-var names, data store).

A new company reuses `lib/submission.js` and writes its own `api/submit.js` + env — **without copying another company's customer data or credentials**.

## 4. Data ownership
- The operating company owns its contacts, messages, subscriber consent, sender identity, and operational records.
- System of record for website submissions = that company's Airtable base.
- Marketing consent record = membership in that company's Brevo list.

## 5. Consent rules
- A contact enters a marketing list **only** when they submit an eligible form **and** provide explicit consent (checkbox).
- Consent status and submission source are preserved with the stored record.
- Transactional/notification email (routing an inquiry to staff) is **not** marketing and does not require list consent, but still uses the company's verified sender.
- Consent language changes require CEO approval.

## 6. Credential ownership
- All credentials belong to the operating company and live only in that company's Vercel project environment variables.
- **No secrets** in source code, test fixtures, commit history, client-side JS, logs, screenshots, or documentation.
- Tokens are least-privilege and scoped to the single correct base/account.
- Rotation ownership and procedure are tracked in each company's environment-variable register.

## 7. Vendor-replacement strategy
- Vendors are boundaries, not lock-in. Current: **Vercel** (compute), **Airtable** (records), **Brevo** (email + lists).
- Each is replaceable: Airtable → any DB/records API behind the same `storeInAirtable` seam; Brevo → any transactional-email/contacts provider behind `sendEmail`/`subscribe`. The shared pipeline isolates each vendor to one function.
- No proprietary framework lock-in: plain Vite + React + a dependency-free serverless function.

## 8. Backup / export requirements
- Airtable base: scheduled CSV/JSON export retained by the operating company (recommend monthly + pre-migration).
- Brevo contacts: periodic export as the portable consent + subscriber record.
- Code + infra config: Git history (this repo) is the source of truth; every change is a reviewable commit.

## 9. Approval gates (all companies)
CEO approval is required before: merging to production, deploying, changing domain, changing public pricing, changing the commerce destination, changing sender addresses, sharing data across lanes, buying a paid vendor plan, adding a vendor, deleting production records, changing consent language, or moving infrastructure between accounts.
