# Make Scenario Map — Automations 01–15

Build target: Make.com, connected to Airtable base `appwnC45fLK2SCgzW`.

**Status: specification, not yet built.** The Make connector was not authorised for the
build session, so no scenario has been created in Make. Everything below is the contract a
builder implements against. Scenarios **09** and **13** are already satisfied by formula
guardrails in Airtable (`Policy Freshness`, `Escalation Flag`) — build the Make versions only
if a push notification is wanted on top of the visible flag.

## Rules that apply to every scenario

Every scenario must have all four of these before it is switched on:

1. **An error path.** On failure, write a row to a `Make Error Log` table (or a dedicated
   Airtable field) with the scenario ID, the record ID, the error text and the timestamp.
   Never let a scenario fail silently.
2. **A retry rule.** Three retries with exponential backoff for transient HTTP errors.
   Do not retry a 4xx validation error — that is a data problem, and retrying hides it.
3. **A named human owner.** Listed per scenario below.
4. **An audit trail.** Every write stamps who or what wrote it and when. A record with no
   timestamp is not complete.

Two hard prohibitions: **no platform passwords in Make or Airtable**, and **no browser
automation against publisher accounts**.

Guard every record-triggered scenario against re-firing. Use a checkbox or a "last processed"
timestamp on the record so an edit made *by the scenario* does not retrigger it.

---

## 01 — Title becomes Production Approved

| | |
| --- | --- |
| **Trigger** | `Books` → `Production Approved` changes to checked |
| **Owner** | Operator |

**Actions.** Stamp `Production Approved Date`. Create one `Editions` record per planned
format (paperback at minimum). Create the standard `Production Tasks` set for stages 01–06
from the template in `OPERATOR_SOP.md`, each with an owner, a due date and an evidence
requirement. Create the Drive folder tree from the §10 standard and write its URL to
`Books → Master Folder URL` and the Edition's `Master Folder URL`. Notify the operator with a
direct link to the new Production Board rows.

**Error path.** If the folder cannot be created, still create the records and raise a task
"Master folder creation failed — create manually". Never let a storage failure block the
pipeline.

---

## 02 — Rights Gate = Passed

| | |
| --- | --- |
| **Trigger** | `Books` → `Rights Gate` becomes `Passed` |
| **Owner** | Operator |

Release the Editorial and Design task group with due dates counted forward from the release
target. If `Publishing Agreement Signed` is unchecked, do **not** release them: create a
`Decisions` record instead and set the title to `Cecil Action Required`. A passed rights gate
with no signed agreement on file is a data error, not a green light.

---

## 03 — Manuscript = Locked

| | |
| --- | --- |
| **Trigger** | `Books` → `Manuscript Locked` becomes checked |
| **Owner** | Production |

Stamp the date. Create the cover, interior, metadata and ISBN task group against every
Edition of that title. For any Edition whose `ISBN Ownership` is `Unassigned`, the ISBN task
is priority 2 and blocks the Preflight stage.

---

## 04 — Preflight = Passed

| | |
| --- | --- |
| **Trigger** | `Editions` → `Pipeline Status` becomes `Preflight` and the preflight task set is complete |
| **Owner** | Operator + QA |

Assemble the channel upload package (final interior, final cover, metadata block, price,
ISBN). Move the Edition to `CEO Release Review` and create the CEO release task. **Check
`ISBN Distribution Conflict` first** — if it is anything other than the green result, do not
advance; raise it to the operator instead.

---

## 05 — Release Approved

| | |
| --- | --- |
| **Trigger** | `Editions` → `CEO Release Approved` becomes checked |
| **Owner** | Operator |

Stamp `CEO Release Approved Date`. Create the `Channel Listings` rows for the approved
channel plan and the matching upload tasks. Create the correctional task group **only if**
`Correctional Rating` is Green or Yellow. Refuse to run at all if `Proof Reviewed` is
unchecked — the Release Gate formula will already be showing the hold.

---

## 06 — KDP status = Submitted

| | |
| --- | --- |
| **Trigger** | `Channel Listings` → `Listing Status` becomes `Submitted` where Channel is Amazon KDP |
| **Owner** | Operator |

Schedule status checks at +1, +3 and +7 days. Each check is a task asking the operator to
record the ASIN, the live URL and a screenshot. Do not attempt to scrape KDP.

---

## 07 — Ingram distribution = Enabled

| | |
| --- | --- |
| **Trigger** | `Channel Listings` → `Listing Status` becomes `Live Verified` where Channel is IngramSpark |
| **Owner** | Operator |

Set `Next Check Due` to +7 days and create retailer availability checks at 7, 14 and 30 days
covering bn.com and library wholesale. The check task must state plainly that **retailers
decide whether to list or stock a title** — an absent B&N listing at day 30 is a sales
problem to work, not a system failure to debug.

---

## 08 — Correctional rating = Green or Yellow

| | |
| --- | --- |
| **Trigger** | `Editions` → `Correctional Rating` becomes Green or Yellow |
| **Owner** | Operator |

Create a facility target batch: for each `Facilities` record at priority P1 or P2 whose
policy is current, create an `Institutional Outreach` record with `Action Type` =
`Policy research` or `First pitch` as appropriate. For facilities whose policy is stale or
missing, create the research task instead of the pitch. Yellow ratings get a research task
first in every case.

---

## 09 — Facility policy older than 90 days

| | |
| --- | --- |
| **Trigger** | Scheduled daily |
| **Owner** | Operator |

Set `Policy Status` to `Stale - re-verify` on any `Facility Policies` record whose
`Checked Date` is more than 90 days old, and create a re-verification task. **Already covered
visually** by the `Policy Freshness` formula on both `Facility Policies` and `Facilities`;
this scenario exists to push the task into the queue rather than wait for someone to look.

---

## 10 — Order enters a correctional lane

| | |
| --- | --- |
| **Trigger** | `Orders & Shipments` created or `Lane` changed to a correctional or sponsored lane |
| **Owner** | Operator |

Set `Fulfillment Status` to `Verification In Progress` and create the four verification tasks
(recipient ID, address format, policy check, quantity limit). Block advancement to
`Cleared to Ship` while `Ship Clearance` still reads as a hold. If the linked facility's
policy is stale, escalate: the order cannot ship on an unverified rule.

---

## 11 — Shipment = Sent

| | |
| --- | --- |
| **Trigger** | `Orders & Shipments` → `Fulfillment Status` becomes `Sent` |
| **Owner** | Operations |

Set `Follow-Up Due` to +10 days and create the tracking check task. At follow-up, the
operator records delivery, return or rejection. A shipment with no outcome recorded after
30 days escalates.

---

## 12 — Rejection logged

| | |
| --- | --- |
| **Trigger** | `Rejections & Returns` record created |
| **Owner** | Operator |

Notify the operator. Create the review task. If `Appeal Available` is Yes and
`Appeal Deadline` is set, create the appeal task dated three days before the deadline. If
`Appeal Available` is Yes and no deadline is recorded, create a task to find the deadline —
that gap is itself the risk. Set the linked Edition or Channel Listing to the matching
rejected status.

---

## 13 — Task blocked more than 48 hours

| | |
| --- | --- |
| **Trigger** | Scheduled daily |
| **Owner** | Operator lead |

Escalate any `Production Tasks` record blocked two days or more. Escalate to **Cecil only if**
the blocker needs a decision or an authority he alone holds; otherwise it goes to the operator
lead. Already surfaced by the `Escalation Flag` formula.

---

## 14 — Friday operations report

| | |
| --- | --- |
| **Trigger** | Scheduled weekly, Friday |
| **Owner** | Operations |

Send Cecil: titles that moved a stage, blocks and their age, uploads completed, channels now
live, correctional outreach actions and results, orders shipped, and open decisions with
their needed-by dates. Every claim carries a record link. The report says what *happened*,
not what is planned.

---

## 15 — Monthly close

| | |
| --- | --- |
| **Trigger** | Scheduled monthly, first business day |
| **Owner** | Operations |

Create one `Sales & Royalties` row per active channel × edition for the closing period, and
the tasks to pull each platform report. Flag any row still unreconciled ten days into the
month. Reconciliation is by ISBN and channel — never by title alone, since a title with three
editions has three different revenue profiles.
