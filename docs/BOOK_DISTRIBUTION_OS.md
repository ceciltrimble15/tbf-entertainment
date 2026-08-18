# TBF Entertainment — Book Distribution Operating System

**As-built reference.** This is the implementation record for the CEO Operating Playbook
("TBF Entertainment Book Distribution Operating System", v1.0, 18 Aug 2026, §14 Claude Code
Build Handoff). It describes what exists in Airtable today, what the automations must do,
and where the human boundary sits.

Owner: Cecil Trimble (CEO / publisher) · Operations: Crea/Krisha · Built: 2026-08-18

---

## 1. Where the system lives

| | |
| --- | --- |
| **Base** | TBF Entertainment Publishing Command Center |
| **Base ID** | `appwnC45fLK2SCgzW` |
| **Interface** | TBF Book Distribution OS — `pbdRRJr5bbOtyr7Rw` |

The playbook called for twelve tables. Nine of the twelve are new; three roles were already
served by existing tables holding live catalog data, so those were **extended rather than
duplicated**. Building a second base would have created exactly the second source of truth
the playbook forbids.

| Playbook table | Implemented as | Table ID |
| --- | --- | --- |
| Titles | `Books` *(existing, extended)* | `tblFYqOnsQwInIYT1` |
| Editions | `Editions` *(new)* | `tblDszccDY0CuvJtj` |
| Production Tasks | `Production Tasks` *(new)* | `tblK6VxsjzllRXFzC` |
| Channel Listings | `Channel Listings` *(new)* | `tblWqKZ5iBQDf3sIE` |
| Assets | `Assets` *(existing)* | `tblxEtncPzdTWQPcU` |
| Facilities | `Facilities` *(new)* | `tblKVupnxkixcmKQg` |
| Facility Policies | `Facility Policies` *(new)* | `tblyEPPAYTe9yduY3` |
| Outreach | `Institutional Outreach` *(new)* | `tbl91Z15xI5zyw42i` |
| Orders & Shipments | `Orders & Shipments` *(new)* | `tbl95oARAQu5147k3` |
| Rejections & Returns | `Rejections & Returns` *(new)* | `tblpm8FuggDtefDaH` |
| Sales & Royalties | `Sales & Royalties` *(new)* | `tblkW2WS5LQE7TR8Y` |
| Decisions | `Decisions` *(new)* | `tblAxNft9pITwL3is` |

`Institutional Outreach` is deliberately separate from the existing `Outreach` table. That
one holds media, community and street-team contacts for launches; this one holds facility
accounts and is governed by policy evidence and shipping rules. Merging them would have
mixed two different compliance regimes in one table.

---

## 2. The spine: Title → Edition → Channel Listing

Everything hangs off one relationship.

- A **Title** (`Books`) is the intellectual work. It carries rights, the author, the
  publishing agreement, and the CEO's *Production Approved* flag.
- An **Edition** is one format of that work. **The Edition carries the ISBN, the price and
  the pipeline status** — not the title. Paperback, hardcover and a materially changed
  correctional edition are three Editions with three ISBNs.
- A **Channel Listing** is one Edition on one channel. It carries the upload, the proof, the
  live URL and the verification evidence.

This is the structural fix for the old `Books` table, which conflated title and edition by
holding a single ISBN, trim and format. The old fields are left in place and still hold the
original data; the Edition record is now authoritative.

---

## 3. The status ladder

Set on **Editions → Pipeline Status**. These exact strings are the contract between people
and automations. Renaming one breaks the Make scenarios that filter on it.

```
Idea Bank → Intake Ready → Rights Review → Editorial → Author Approval → Design →
Metadata → Preflight → CEO Release Review → Release Approved → Uploading →
Proof Review → Live Pending Verification → Live Verified → Launching → Evergreen Sales
```

Exception statuses, which sit outside the ladder: `Blocked - Operator`,
`Cecil Action Required`, `Platform Rejected`, `Facility Rejected`, `Revision Required`,
`Hold`, `Retired`.

---

## 4. Guardrails that are already live

These are formula fields, not automations. They need no Make connection, no credentials and
no scheduled run — they recompute the moment a record changes, and they are the reason the
system can be trusted before the automation layer exists.

### `Editions → ISBN Distribution Conflict`

Enforces the three published platform rules simultaneously:

1. An ISBN enrolled in **KDP Expanded Distribution** must not also be submitted through
   another distribution service. If Expanded Distribution is ON *and* an IngramSpark channel
   listing exists, the field returns a blocking conflict.
2. A **KDP-assigned ISBN is Amazon-locked** and cannot go to IngramSpark.
3. **B&N Press** will not accept an ISBN submitted elsewhere, so a B&N Press direct listing
   alongside a KDP or Ingram listing on the same ISBN is a conflict.

It also flags an undecided Expanded Distribution setting and an unassigned ISBN. Anything
other than the green result should block the Channel Release stage.

### `Editions → Release Gate`

Returns "Cleared to release" only when **CEO Release Approved** and **Proof Reviewed** are
both true, and names which one is missing otherwise. This is §2's non-negotiable rule made
visible: no title moves live without Cecil's approval *and* a documented proof review.

### `Editions → Correctional Lane Instruction`

Turns the Green / Yellow / Red rating into the operator's next action, and says plainly that
an unrated edition gets no correctional outreach at all.

### `Facility Policies → Policy Freshness` and `Facilities → Policy Freshness`

Counts days since the policy was **read at source**. Over 90 days is stale and blocks
shipment and outreach; over 75 days warns. A policy with no checked date reads as never
verified — which is the correct default, not a gap.

### `Orders & Shipments → Ship Clearance`

For any correctional or sponsored lane, holds the order until recipient ID, address format,
current facility policy and quantity limit are all confirmed, and lists by name which check
is still missing.

### `Channel Listings → Evidence Complete`

If a listing is marked Live Verified without a live URL, a verified date, a named verifier
and a metadata match, this field says so. It is the enforcement of the build rule that no
record is complete without evidence and a timestamp.

### `Production Tasks → Escalation Flag`

Flags a task blocked two days or more for escalation, and marks overdue and due-today work.
This covers Make scenario 13 without an automation.

### `Rejections & Returns → Appeal Countdown`

Days remaining to appeal, or a loud marker once the deadline has passed. Missing an appeal
deadline forfeits the title at that facility.

---

## 5. Dashboards

Interface `pbdRRJr5bbOtyr7Rw`, published.

| Page | Table | What it answers |
| --- | --- | --- |
| CEO Dashboard | Decisions | What is waiting on Cecil, what it costs to wait, what is recommended |
| Operator Today | Production Tasks | What do I do next, grouped by the §8 priority queue |
| Production Board | Editions | Where is every edition on the ladder, and what is blocking it |
| Distribution Board | Channel Listings | Every edition across every channel, with evidence state |
| Correctional Sales Board | Facilities | Facility targets, policy freshness, contacts, stage |
| Correctional Outreach Queue | Institutional Outreach | Who to follow up with, and what is overdue |
| Finance Board | Sales & Royalties | Units, gross, net and reconciliation state by channel |
| Rejection Intelligence | Rejections & Returns | Why we lost, whether it was avoidable, appeal clock |

---

## 6. The human boundary

The automation layer may create records, tasks, reminders, folders, emails, reports and
verification checks. It may **not**:

- store platform passwords or API credentials for KDP, IngramSpark or B&N;
- click through publisher accounts with browser automation;
- approve a proof, publish a title, change a price, buy an ISBN, or touch tax or banking data.

Account uploads, proof approval and final publication stay authenticated human actions. This
is a design constraint, not a limitation to be engineered around: no legitimate system can
guarantee that one upload places a book in Amazon, Barnes & Noble, libraries and every jail.
Retailers decide whether to list or stock. Every facility applies its own rules. The
automation controls the workflow — it does not fake platform approvals or bypass facility
policy.

---

## 7. What the operator does without waiting

Anything that is not on the §9 list below belongs to the operator and continues immediately.
A decision goes to Cecil only when it is:

- a legal, ownership, rights or contract decision;
- a price, budget, paid service, returnability or wholesale-discount decision;
- final manuscript or proof approval, or a material editorial change;
- a tax, banking, identity, two-factor or platform-owner step;
- a brand or reputation exception, a sensitive correctional decision, or a vendor agreement.

Research that *informs* one of those decisions is operator work, not a blocker. Looking up
an ISBN in the Bowker account is research; deciding whether to buy a new block is Cecil's.

---

## 8. Related documents

- `MAKE_SCENARIOS.md` — automations 01–15, with error paths and owners
- `CORRECTIONAL_DISTRIBUTION_SOP.md` — the four routes, eligibility review, facility checklist
- `OPERATOR_SOP.md` — daily work order, four-hour block, end-of-day handoff
- `QA_REPORT_OS_BUILD_01.md` — what was built, what was tested, what is still open
- `ISBN_TRACKING.md` — ISBN registry of record
- `KDP_LAUNCH_CHECKLIST.md` — launch-specific checklist for the pilot title
