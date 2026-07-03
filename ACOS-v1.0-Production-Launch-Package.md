# 🚀 ACOS v1.0 — PRODUCTION LAUNCH PACKAGE

**A1 Colossal Operating System (ACOS)** · Airtable base `appbJeQpEUFRV1Dim`
**Status:** Production foundation complete · Architecture **frozen at v1.0** · Prepared 2026-07-03

This is the official handoff package for putting ACOS into daily operations. It is the single
place operators and Cecil go to understand how ACOS runs. Companion file: `ACOS-Setup-Guide.md`
(exact view filters, interface build, automation recipes). The operating instructions below are
also stored **inside ACOS** in table **13 – SOP Library**.

---

## 1. ACOS GOVERNING PRINCIPLES (the constitution)
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

## 2. WHAT CECIL OPENS FIRST EVERY MORNING
**`00 – Executive Command Center`** → today's record (once the interface is built, open the
**Executive Command Center** interface instead). In ~15 minutes:
1. Read **CEO Top 3 Priorities** + Money / Mission / Publishing Moves.
2. Clear **`04 – CEO Approval Queue` → Pending Cecil Approval** (Approve / Reject / Send Back).
3. Scan **Blocked** items and **CEO Decisions Needed**.
4. Give direction — set priorities, reassign. **Direct the work; don't do it.**

---

## 3. OPERATOR ROLES (from 07 – Operators & 16 – Authority Matrix)
| Operator | Role | Authority |
|---|---|---|
| **Cecil** | CEO / Director | CEO Final Approval — final say on everything |
| **ChatGPT / Shuri** | Chief Strategy & Systems Architect | Strategy / Planning |
| **Claude Code** | Chief Systems Engineer | Code / Build |
| **Krisha** | Chief Operations Coordinator | Operations Execution |
| **Manus** | Research & Intelligence | QA / Research |
| **Claude Chat** | Executive Advisor / Assistant | Review Only |

Decision rights per area (Strategy, Operations, Spending, Grant Submission, Client Delivery,
Publishing) are defined in **16 – Authority Matrix**. Cecil is **Final** on every area.

---

## 4. KRISHA — DAILY OPERATING INSTRUCTIONS
1. Open **`03 – Tasks` → "Krisha Tasks"** and **"Due This Week"**. Work highest priority first.
2. Update each task's **Status** as it moves (In Progress → QA → CEO Review).
3. Anything needing Cecil: check **Needs CEO Approval** → it routes to `04 – Approval Queue`.
4. Triage **`15 – Inbox / Work Queue`**: promote new ideas to Project / Task / Decision, or Archive.
5. Log completed work in **`06 – Operations Log`**.
6. **Never mark a deliverable final — that is Cecil's decision.**
> **Krisha can start immediately:** build the saved views + the Executive Command Center interface
> from the Setup Guide (both tasks now assigned to her), and begin triaging the Inbox.

## 5. MANUS — RESEARCH & INTELLIGENCE INSTRUCTIONS
1. Research **only** what ties to active projects and current priorities (no busywork).
2. Write findings into **`11 – Executive Intelligence`**: Observation, Risk Level, Opportunity,
   Recommended Action, Priority.
3. Leave **CEO Reviewed** unchecked — Cecil reviews.
4. Feed relevant deadlines into **`14 – CEO Timeline`**.
5. **Recommend; never act. Cecil decides.**
> **Manus can start immediately:** intelligence on the two live priorities — A1 Creative revenue
> engine and the Young G's vs Old G's KDP launch — logged into Executive Intelligence.

## 6. CLAUDE CODE — MAINTENANCE INSTRUCTIONS
1. Maintain schema integrity — **do not add tables** (frozen at v1.0).
2. Build/maintain automations in **`09 – Agent Build`** (Morning Brief, End-of-Day, Approval Router).
3. Keep links and **Waiting On / Blocking** dependencies accurate.
4. Log every system change in **`06 – Operations Log`**; flag anything needing approval to `04`.
5. Support Krisha and Manus with technical execution.

---

## 7. EXECUTIVE COMMAND CENTER — SETUP INSTRUCTIONS
Airtable → **Interfaces → + New interface** → name **Executive Command Center** → add, top to bottom:
1. **CEO Top 3 Priorities** (record element on `00`).
2. **Decisions Waiting on You** — list on `04` filtered `CEO Decision = Pending`.
3. **Money Pipeline** — list on `02 – Projects` filtered `Company = A1 Creative Agency`.
4. **Mission Pipeline** — `02` filtered `Company = A/1 Suppliers`.
5. **Publishing Pipeline** — `02` filtered `Company = TBF Entertainment`.
6. **Blocked Items** — `03 – Tasks` filtered `Status = Blocked` (show `Waiting On`).
7. **Tasks Due Today** — `03` filtered `Due Date is today`.
8. **Daily Executive Summary** — latest `08 – Reports` Morning Brief.
9. *(Optional)* KPI number tiles from `12`.

Publish, then pin as Cecil's home screen. Full element detail in `ACOS-Setup-Guide.md`.

## 8. EXECUTIVE MORNING BRIEF — INSTRUCTIONS
- **Manual (today):** each morning, create a `08 – Reports` record (Report Type = Morning Brief)
  using the layout in the **"TEMPLATE – Executive Morning Brief"** record.
- **Automated (after approval):** Automations → scheduled ~6 AM → pull Blocked/Due tasks (03),
  Pending approvals (04), Unreviewed intelligence (11), KPI by lane (12), next 7 days (14) →
  compose the brief → create the record. *(See `09 – Agent Build` → Executive Morning Brief Generator.)*

## 9. END-OF-DAY REPORT — INSTRUCTIONS
- **Manual (today):** end of day, create a `08 – Reports` record (Report Type = End of Day)
  summarizing completed work, remaining blockers, and tomorrow's recommended moves.
- **Automated (after approval):** scheduled ~6 PM → pull today's `06 – Operations Log` + completed
  `03 – Tasks` → compose → create the record. *(See `09 – Agent Build` → End-of-Day Report Generator.)*

## 10. CEO APPROVAL WORKFLOW
1. Owner checks **Needs CEO Approval / CEO Approval Required** on a Task/Project/File.
2. Item appears in **`04 – CEO Approval Queue`** (CEO Decision = Pending, Final Status = Awaiting CEO).
3. Cecil sets **CEO Decision**: Approved / Rejected / Send Back / Needs More Info.
4. Send Back → owner reads Send Back Notes and revises.
5. Approved items proceed; log major decisions in **`05 – Decision Log`**. *(Governing Principle #6.)*

---

## 11. LAUNCH READINESS CHECKLIST
| Item | State |
|---|---|
| 17 tables (00–16) built, lanes separated | ✅ Done |
| Companies (4), Operators (6), Command Center record, KPIs (12), Authority Matrix (6) seeded | ✅ Done |
| 7 starter projects (each with a company lane + owner) | ✅ Done |
| Waiting On / Blocking dependencies live | ✅ Done |
| Operating SOPs loaded into 13 – SOP Library | ✅ Done |
| Morning Brief template + Agent Build roadmap | ✅ Done |
| Legacy data preserved in ZZ – Archive tables | ✅ Done (nothing deleted) |
| Rename base to "A1 Colossal Operating System (ACOS)" | ⛔ Manual — API can't rename bases |
| Create saved views (Setup Guide) | ⛔ Manual — assigned to Krisha |
| Build Executive Command Center interface | ⛔ Manual — assigned to Krisha |
| Build Morning Brief + End-of-Day automations | ⏳ Waiting on CEO approval (Claude Code) |
| Migrate legacy records into 03 Tasks / 15 Inbox | ⏳ Needs record-read approval (data safe in archive) |
