# ⚙️ ACOS v1.0 — Automation Configuration (DRAFT — do not go live until Cecil confirms)

**Base:** `A1 Colossal Operating System (ACOS)` — `appbJeQpEUFRV1Dim`
**Status:** CEO-greenlit · **Settings CONFIRMED 2026-07-03.** Still **not implemented live** — Cecil confirms the final trigger inside Airtable before go-live.
Build these in **Airtable → Automations**. Governing Principle #7: automate the process, never the judgment — every automation *recommends*; Cecil decides.

> **✅ CONFIRMED SETTINGS (Cecil, 2026-07-03):**
> 1. **Morning Brief:** **6:00 AM America/New_York.**
> 2. **End-of-Day Report:** **6:00 PM America/New_York.**
> 3. **Delivery:** **Create the Report record in ACOS only. No email yet.**
> 4. **Weekends:** **Run every day.**
> 5. Live implementation is a manual Airtable step; do not enable until Cecil clicks confirm inside Airtable.

---

## AUTOMATION 1 — Executive Morning Brief

**Name:** `ACOS · Executive Morning Brief`
**Trigger:** *At a scheduled time* → Daily, **every day** → **6:00 AM America/New_York** (confirmed).

**Action — Run a script** (Airtable scripting action). Paste this script; it reads the live tables and creates one Morning Brief record in `08 – Reports`.

```javascript
// ACOS · Executive Morning Brief generator
const tasks   = base.getTable('03 – Tasks');
const approvals = base.getTable('04 – CEO Approval Queue');
const intel   = base.getTable('11 – Executive Intelligence');
const kpis    = base.getTable('12 – KPI Dashboard');
const timeline = base.getTable('14 – CEO Timeline');
const reports = base.getTable('08 – Reports');

const today = new Date();
const isToday = d => d && new Date(d).toDateString() === today.toDateString();
const soon   = d => d && (new Date(d) - today) / 86400000 <= 7 && new Date(d) >= today;

// 1. Blocked + due-today tasks
const t = await tasks.selectRecordsAsync({fields:['Task Name','Status','Due Date','Company','Assigned To','Waiting On']});
const blocked = t.records.filter(r => r.getCellValueAsString('Status') === 'Blocked');
const dueToday = t.records.filter(r => isToday(r.getCellValue('Due Date')));

// 2. Pending approvals
const a = await approvals.selectRecordsAsync({fields:['Approval Item','CEO Decision','Submitted By']});
const pending = a.records.filter(r => r.getCellValueAsString('CEO Decision') === 'Pending');

// 3. Unreviewed intelligence
const i = await intel.selectRecordsAsync({fields:['Briefing','CEO Reviewed','Risk Level','Opportunity','Recommended Action','Priority']});
const newIntel = i.records.filter(r => !r.getCellValue('CEO Reviewed'));

// 4. KPI by lane  5. Timeline next 7 days
const k = await kpis.selectRecordsAsync({fields:['KPI Name','Current Value','Target','Company']});
const tl = await timeline.selectRecordsAsync({fields:['Event','Date','Type','Company']});
const upcoming = tl.records.filter(r => soon(r.getCellValue('Date')));

const laneLine = (lane) => {
  const kp = k.records.filter(r => r.getCellValueAsString('Company') === lane)
    .map(r => `${r.getCellValueAsString('KPI Name')}: ${r.getCellValue('Current Value') ?? 0}`).join(' · ');
  const due = upcoming.filter(r => r.getCellValueAsString('Company') === lane)
    .map(r => `${r.getCellValueAsString('Event')} (${r.getCellValueAsString('Date')})`).join('; ');
  return `${kp || 'no KPIs yet'}${due ? ' | Upcoming: ' + due : ''}`;
};

const list = (recs, f) => recs.length ? recs.map(r => '• ' + r.getCellValueAsString(f)).join('\n') : '• none';

await reports.createRecordAsync({
  'Report Title': `Morning Brief – ${today.toISOString().slice(0,10)}`,
  'Report Date': today.toISOString().slice(0,10),
  'Report Type': {name: 'Morning Brief'},
  'Submitted By': 'ACOS Agent',
  'A1 Creative Update': laneLine('A1 Creative Agency'),
  'A/1 Suppliers Update': laneLine('A/1 Suppliers'),
  'TBF Update': laneLine('TBF Entertainment'),
  'Blockers': list(blocked, 'Task Name'),
  'CEO Decisions Needed': list(pending, 'Approval Item'),
  'Tomorrow’s Recommended Moves': list(dueToday, 'Task Name'),
  'Notes': `NEW RISKS/OPPORTUNITIES:\n${list(newIntel,'Briefing')}\n\nEstimated review: 15 min. This brief recommends; Cecil decides.`
});
```

**Result:** one `Morning Brief` record per day in `08 – Reports`, surfaced on the Executive Command Center interface as "Daily Executive Summary."

---

## AUTOMATION 2 — End-of-Day Report

**Name:** `ACOS · End-of-Day Report`
**Trigger:** *At a scheduled time* → Daily, **every day** → **6:00 PM America/New_York** (confirmed).

**Action — Run a script:**

```javascript
// ACOS · End-of-Day Report generator
const ops = base.getTable('06 – Operations Log');
const tasks = base.getTable('03 – Tasks');
const reports = base.getTable('08 – Reports');
const today = new Date();
const isToday = d => d && new Date(d).toDateString() === today.toDateString();

const o = await ops.selectRecordsAsync({fields:['Log Entry','Date','Owner','Work Completed','What Is Still Missing']});
const todayOps = o.records.filter(r => isToday(r.getCellValue('Date')));

const t = await tasks.selectRecordsAsync({fields:['Task Name','Status','Completed Date','Due Date']});
const doneToday = t.records.filter(r => isToday(r.getCellValue('Completed Date')) || r.getCellValueAsString('Status') === 'Approved');
const stillBlocked = t.records.filter(r => r.getCellValueAsString('Status') === 'Blocked');
const dueTomorrow = t.records.filter(r => {
  const d = r.getCellValue('Due Date'); if(!d) return false;
  const diff = (new Date(d) - today)/86400000; return diff > 0 && diff <= 1;
});
const list = (recs,f) => recs.length ? recs.map(r=>'• '+r.getCellValueAsString(f)).join('\n') : '• none';

await reports.createRecordAsync({
  'Report Title': `End of Day – ${today.toISOString().slice(0,10)}`,
  'Report Date': today.toISOString().slice(0,10),
  'Report Type': {name: 'End of Day'},
  'Submitted By': 'ACOS Agent',
  'Completed Work': [list(todayOps,'Log Entry'), list(doneToday,'Task Name')].join('\n'),
  'Blockers': list(stillBlocked,'Task Name'),
  'Tomorrow’s Recommended Moves': list(dueTomorrow,'Task Name'),
  'Notes': 'Auto-generated end-of-day summary. Recommends tomorrow’s moves; Cecil sets final priorities.'
});
```

**Result:** one `End of Day` record per day in `08 – Reports`.

---

## AUTOMATION 3 — CEO Approval Router (config drafted 2026-07-03)

**Name:** `ACOS · CEO Approval Router`
**Governing rule (hard constraint):** the router **NEVER approves anything automatically.** It may only **route, notify, escalate, and log.** Every item it creates lands as **CEO Decision = Pending** for Cecil to decide by hand. Enforces Governing Principle #6.

**Trigger:** *When a record matches conditions* → Table **`03 – Tasks`** → condition **`Needs CEO Approval` is checked** AND **`CEO Approval Status` is `Pending`**.
*(Add a second identical automation on `02 – Projects` for `CEO Approval Required` checked, and a third on `10 – File Index` for `CEO Approval Needed` checked — same script, different source table.)*

**Action — Run a script** (route + log; no approval, ever):

```javascript
// ACOS · CEO Approval Router — routes, notifies, escalates, logs. NEVER approves.
const src = base.getTable('03 – Tasks');          // change per source table
const queue = base.getTable('04 – CEO Approval Queue');
const ops = base.getTable('06 – Operations Log');

// The record that triggered the automation (from the trigger's output):
const recId = input.config().recordId;            // map the trigger record id in the UI
const r = await src.selectRecordAsync(recId, {fields:[
  'Task Name','Company','Project','Owner','Task Details','Priority']});
if (!r) return;

// 1. Guard against duplicates: only route if not already queued for this item.
const q = await queue.selectRecordsAsync({fields:['Approval Item','Final Status']});
const already = q.records.some(x =>
  x.getCellValueAsString('Approval Item') === r.getCellValueAsString('Task Name') &&
  x.getCellValueAsString('Final Status') !== 'Closed');

if (!already) {
  // 2. ROUTE — create a Pending item. CEO decides; router never sets Approved.
  await queue.createRecordAsync({
    'Approval Item': r.getCellValueAsString('Task Name'),
    'Submitted By': r.getCellValueAsString('Owner') || 'ACOS Router',
    'Company': r.getCellValue('Company') ? {name: r.getCellValueAsString('Company')} : null,
    'Project': r.getCellValueAsString('Project'),
    'Decision Needed': r.getCellValueAsString('Task Details') || 'Review and decide.',
    'Recommendation': 'Routed by ACOS. Awaiting CEO decision — router does not approve.',
    'CEO Decision': {name: 'Pending'},
    'Final Status': {name: 'Awaiting CEO'}
  });
  // 3. LOG — audit trail of the routing action.
  await ops.createRecordAsync({
    'Log Entry': `Routed for CEO approval: ${r.getCellValueAsString('Task Name')}`,
    'Owner': 'ACOS Router',
    'What Changed': 'Item flagged for approval was routed to 04 – CEO Approval Queue as Pending.',
    'Notes': 'Router action only. No approval granted.'
  });
}
```

**NOTIFY / ESCALATE (optional add-on steps, no auto-approval):**
- **Notify:** add a *Send email* action to Cecil (`cecil.trimble15@gmail.com`) — *"New item awaiting your approval in ACOS."* (Off for now, matching the reports' no-email setting; enable when Cecil wants.)
- **Escalate:** add a second scheduled automation — daily, if any `04` item has `CEO Decision = Pending` older than **48 hours**, write an `11 – Executive Intelligence` entry (Risk Level = High) so stale approvals surface in the Morning Brief. Escalation = visibility only; still never approves.

**What the router must never do:** set `CEO Decision` to Approved/Rejected/Send Back, change `Final Status` to Closed, or mark any deliverable final. Those are Cecil's alone.

---

## IMPLEMENTATION NOTE
Table/field **names** are used in the scripts for readability. If any table is later renamed, switch to IDs (e.g. `base.getTable('tblPMgrRptalQaMFJ')`). Nothing here runs until Cecil confirms the trigger times, time zone, delivery method, and weekday/weekend setting above.
