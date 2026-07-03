# A1 Colossal Operating System (ACOS) — Setup Guide v1.0

**Base:** `A1 Colossal Operating System (ACOS)` — Airtable base ID `appbJeQpEUFRV1Dim`
**Built:** 2026-07-03 · **Status:** Foundation complete · Architecture **frozen at v1.0**

This guide covers the three things the Airtable API could **not** build automatically:
1. Saved grid **views** (filters/grouping/sort/color)
2. The **Executive Command Center Interface** (Cecil's one-screen cockpit)
3. **Automations** (Morning Brief, End-of-Day, approval routing)

Plus the two manual one-click items: **base rename** and **native Created/Modified fields**.

---

## ACOS GOVERNING PRINCIPLES (the constitution — also stored in 05 – Decision Log)
1. ACOS is the single source of truth for executive operations.
2. Every project belongs to exactly one company lane: A1 Colossal · A1 Creative Agency · A/1 Suppliers · TBF Entertainment.
3. No work begins without an owner.
4. No work finishes without a status.
5. No major decision is made without a Decision Log entry.
6. No deliverable leaves the company without CEO approval when required.
7. Automate the process, never the judgment.
8. The system exists to reduce CEO workload, not increase it.
9. If information exists in multiple places, ACOS becomes the authoritative source.
10. Every future automation, AI agent, SOP, or operator must integrate into ACOS — not bypass it.

---

## STEP 0 — Two manual one-click items
- **Rename the base:** top-left base name → rename to **`A1 Colossal Operating System (ACOS)`** (the API cannot rename bases).
- **Upgrade timestamps (optional but recommended):** in each table, the `Created Date` and `Last Updated` fields are plain dates. To make them automatic, add two fields of type **Created time** and **Last modified time** (the API can't create these types). Keep the plain-date versions for any values you back-fill.

---

## HOW TO CREATE A VIEW (do this once, then repeat)
In any table: click the view sidebar → **+ Grid** → name it → set **Filter**, **Group**, **Sort**, and (optionally) **Color**. Views are per-table and don't move data — they're saved lenses.

### 00 – Executive Command Center
- **CEO Today** — Filter: `Date` is today. Sort: `Date` desc.
- **CEO Decisions Needed** — Filter: `CEO Decisions Needed` is not empty. Color: red.
- **Blocked Items** — Filter: `Blockers` is not empty. Color: red.

### 02 – Projects
- **All Active Projects** — Filter: `Status` is not `Complete`. Group: `Company`. Sort: `Priority` desc.
- **A1 Creative Projects** — Filter: `Company` is `A1 Creative Agency`.
- **A/1 Suppliers Projects** — Filter: `Company` is `A/1 Suppliers`.
- **TBF Entertainment Projects** — Filter: `Company` is `TBF Entertainment`.
- **High Priority Projects** — Filter: `Priority` is `High`. Sort: `Due Date` asc. Color: `Priority`.
- **CEO Review Projects** — Filter: `CEO Approval Required` is checked.

### 03 – Tasks
- **Krisha Tasks** — Filter: `Assigned To` contains `Krisha`.
- **Claude Code Tasks** — Filter: `Assigned To` contains `Claude Code`.
- **Manus Tasks** — Filter: `Assigned To` contains `Manus`.
- **Cecil Tasks** — Filter: `Assigned To` contains `Cecil`.
- **Blocked Tasks** — Filter: `Status` is `Blocked`. Color: red. (Use the `Waiting On`/`Blocking` links to see *what* is blocking.)
- **Due This Week** — Filter: `Due Date` is within the next 7 days. Sort: `Due Date` asc.
- **Needs CEO Approval** — Filter: `Needs CEO Approval` is checked AND `CEO Approval Status` is `Pending`.
- **Completed Tasks** — Filter: `Status` is `Approved` OR `Completed Date` is not empty.
- *(Suggested)* **Waiting On** — Filter: `Waiting On` is not empty. Shows dependency chains.

### 04 – CEO Approval Queue
- **Pending Cecil Approval** — Filter: `CEO Decision` is `Pending`. Color: red. **← Cecil's action list.**
- **Approved** — Filter: `CEO Decision` is `Approved`.
- **Sent Back** — Filter: `CEO Decision` is `Send Back`.
- **Rejected** — Filter: `CEO Decision` is `Rejected`.

### 08 – Reports
- **Daily Reports** — Filter: `Report Type` is `Morning Brief`. Sort: `Report Date` desc.
- **End of Day Reports** — Filter: `Report Type` is `End of Day`. Sort: `Report Date` desc.
- **Weekly Reports** — Filter: `Report Type` is `Weekly`. Sort: `Report Date` desc.

### Supporting views (recommended)
- **11 – Executive Intelligence › Unreviewed** — Filter: `CEO Reviewed` is unchecked. Sort: `Priority` desc.
- **12 – KPI Dashboard › By Lane** — Group: `Company`. Sort: `Metric Type`.
- **15 – Inbox › Needs Triage** — Filter: `Status` is `New` OR `Triaging`.
- **14 – CEO Timeline › This Month** — Filter: `Date` is within this calendar month. Sort: `Date` asc.
- **16 – Authority Matrix › Grid view** — no filter; reference table.

---

## THE EXECUTIVE COMMAND CENTER INTERFACE (Cecil's one screen)
Airtable → **Interfaces** → **+ New interface** → start blank → name it **Executive Command Center**.
Add these elements top-to-bottom so the moment Cecil opens it he sees direction, not a task list:

1. **Header / Text** — "A1 Colossal — Executive Command Center". Add a filtered record element pointing at `00 – Executive Command Center` → **CEO Top 3 Priorities**.
2. **CEO Approval Queue** — List/Grid element on `04` filtered to `CEO Decision = Pending`. Title: "Decisions Waiting on You".
3. **Money Pipeline** — List on `02 – Projects` filtered `Company = A1 Creative Agency`, sorted by Priority.
4. **Mission Pipeline** — List on `02 – Projects` filtered `Company = A/1 Suppliers`.
5. **Publishing Pipeline** — List on `02 – Projects` filtered `Company = TBF Entertainment`.
6. **Blocked Items** — List on `03 – Tasks` filtered `Status = Blocked` (show `Waiting On`).
7. **Tasks Due Today** — List on `03 – Tasks` filtered `Due Date is today`.
8. **Decisions Waiting** — Number/summary element counting `04` where `CEO Decision = Pending`.
9. **Daily Executive Summary** — Record element on the latest `08 – Reports` Morning Brief.
10. *(Optional)* **KPI row** — Number elements from `12 – KPI Dashboard` (Revenue, Books Sold, Youth Enrolled, etc.).

Publish the interface and pin it as Cecil's home screen.

---

## AUTOMATION RECIPES (build in Airtable → Automations, or via the future agent)

### A. Executive Morning Brief (flagship)
- **Trigger:** "At scheduled time" — every day, e.g. 6:00 AM.
- **Steps:** Find records → (1) `03 Tasks` where `Status = Blocked` or `Due Date` today; (2) `04` where `CEO Decision = Pending`; (3) `11 Executive Intelligence` where `CEO Reviewed` unchecked; (4) `12 KPI` grouped by lane; (5) `14 Timeline` next 7 days.
- **Action:** Run script / AI step to compose the brief using the layout in the **08 – Reports → "TEMPLATE – Executive Morning Brief"** record → **Create record** in `08 – Reports` (Report Type = Morning Brief, dated today).
- **Principle:** Automate the process, never the judgment — the brief *recommends*; Cecil *decides*.

### B. End-of-Day Report
- **Trigger:** scheduled ~6:00 PM. **Steps:** pull today's `06 Operations Log` + completed `03 Tasks`. **Action:** create `08 – Reports` record (Report Type = End of Day).

### C. CEO Approval Router (enforces Principle #6)
- **Trigger:** record updated in `02 Projects` or `03 Tasks` where `CEO Approval Required` / `Needs CEO Approval` becomes checked.
- **Action:** create a record in `04 – CEO Approval Queue` (Submitted By = owner, CEO Decision = Pending, Final Status = Awaiting CEO).

### D. Bottleneck Detector → Executive Intelligence
- **Trigger:** scheduled daily. **Steps:** find `03 Tasks`/`02 Projects` with non-empty `Waiting On` or `Status = Blocked`. **Action:** create `11 – Executive Intelligence` entries naming *what is waiting on what, and who owns the blocker*.

See **09 – Agent Build** for the full roadmap (6 components, risk levels, and which need CEO approval before connecting external accounts).

---

## FUTURE (Version 2 — after 60–90 days of real use)
Per the freeze decision, do **not** add tables now. When real usage reveals a genuine gap, evolve to v1.1/v1.2. Likely V2 capabilities: Gmail + Calendar reader feeding `14 Timeline`/`15 Inbox`, live KPI integrations (Stripe/KDP/email), and a full autonomous agent that generates the Morning Brief and End-of-Day report and prepares CEO decisions automatically.
