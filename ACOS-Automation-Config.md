# ⚙️ ACOS v1.0 — Automation Configuration (DRAFT — do not go live until Cecil confirms)

**Base:** `A1 Colossal Operating System (ACOS)` — `appbJeQpEUFRV1Dim`
**Status:** CEO-greenlit 2026-07-03 · **Not implemented live.** Awaiting Cecil's final trigger/settings.
Build these in **Airtable → Automations**. Governing Principle #7: automate the process, never the judgment — both automations *recommend*; Cecil decides.

> **Cecil must confirm before go-live (open settings):**
> 1. **Morning Brief trigger time** (proposed **6:00 AM**) and **time zone** (proposed America/New_York).
> 2. **End-of-Day trigger time** (proposed **6:00 PM**), same time zone.
> 3. **Delivery:** create the Report record only, or **also email** Cecil a copy? If email, to `cecil.trimble15@gmail.com`?
> 4. Weekend runs — every day, or weekdays only?

---

## AUTOMATION 1 — Executive Morning Brief

**Name:** `ACOS · Executive Morning Brief`
**Trigger:** *At a scheduled time* → Daily → **6:00 AM** (pending confirmation), time zone as above.

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
**Trigger:** *At a scheduled time* → Daily → **6:00 PM** (pending confirmation), same time zone.

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

## OPTIONAL — CEO Approval Router (already scoped in 09 – Agent Build; not part of this greenlight)
Trigger: *When a record matches conditions* on `03 – Tasks` where `Needs CEO Approval` = checked → Action: *Create record* in `04 – CEO Approval Queue` (CEO Decision = Pending, Final Status = Awaiting CEO). Enforces Governing Principle #6. Build after Cecil confirms.

---

## IMPLEMENTATION NOTE
Table/field **names** are used in the scripts for readability. If any table is later renamed, switch to IDs (e.g. `base.getTable('tblPMgrRptalQaMFJ')`). Nothing here runs until Cecil confirms the trigger times, time zone, delivery method, and weekday/weekend setting above.
