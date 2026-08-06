# TBF Entertainment — Environment Variable Register

**Variable *names* and purpose only. Never record secret *values* here or anywhere in Git.**
All values live in Vercel → Project `tbf-entertainment` → Settings → Environment Variables, scoped to **Production + Preview**. Store at the **project level** (not team-wide shared) unless the CEO authorizes a shared-secret design.

| Variable | Owning company | System | Purpose | Environment | Who may rotate | Rotation procedure | Last verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `AIRTABLE_TOKEN` | TBF Entertainment | Airtable | Read+write the `Website Submissions` table (read is required for duplicate detection) | Production, Preview | CEO / authorized operator | Airtable → Builder Hub → Personal access tokens → regenerate → update in Vercel → redeploy | ☐ pending |
| `AIRTABLE_BASE_ID` | TBF Entertainment | Airtable | Identifies the **TBF Entertainment Operations** base (`app6TQ7oSVSJADxC4`) | Production, Preview | operator | Non-secret; update only if the base changes | ✅ 2026-07-20 (name-resolved live) |
| `AIRTABLE_SUBMISSIONS_TABLE` | TBF Entertainment | Airtable | Table name — value must be `Website Submissions` | Production, Preview | operator | Non-secret; update only if the table is renamed | ✅ 2026-07-20 (table + 10 fields verified live) |
| `BREVO_API_KEY` | TBF Entertainment | Brevo | Transactional email + contacts API auth | Production, Preview | CEO / authorized operator | Brevo → SMTP & API → API Keys → regenerate → update in Vercel → redeploy | ☐ pending |
| `BREVO_SENDER` | TBF Entertainment | Brevo | Verified sender address — value `info@tbfentertainment.art` | Production, Preview | operator | Change only with CEO approval (sender-identity gate) | ☐ pending |
| `BREVO_LIST_ID` | TBF Entertainment | Brevo | Early Access / Launch list id — value `3` | Production, Preview | operator | Non-secret; update only if the list changes | ☐ pending |

## Token scope requirements
- `AIRTABLE_TOKEN`: scopes **`data.records:read`** + **`data.records:write`**, restricted to the **TBF Entertainment Operations** base only. Read is required because the backend checks for an existing `Submission ID` before inserting.
- `BREVO_API_KEY`: transactional email + contacts access for the **TBF** Brevo account only.

## Rules
- Secrets are marked "Secret" in Vercel and never printed to logs, commits, screenshots, or reports.
- One company's keys never appear in another company's project.
- Set the "Last verified" box each time an operator confirms the value works in a Preview test.
