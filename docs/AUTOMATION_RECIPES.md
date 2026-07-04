# TBF Entertainment Publishing — Automation Recipes

Build-ready specs for the first three automations on the Publishing Command Center base.
**This is a design document only.** Nothing here is live yet.

> **Guardrails (per Cecil):** Do **not** build these automations yet · Do **not** change the Airtable schema yet ·
> Do **not** connect Make yet. This doc is the blueprint to implement later.

**Base:** TBF Entertainment Publishing Command Center — `appwnC45fLK2SCgzW`
**First title:** _Young G's vs. Old G's_ — Book record `recAZF0xCAFcJEBhJ`

Each recipe lists a **trigger → conditions → actions** flow, an exact **field map**, and two build paths:
**A) Airtable Automations** (native, no external connector — buildable without Make) and
**B) Make** (once authorized — better for SMS, multi-step, and cross-app steps).

---

## Reference — tables & fields used

| Table | Table ID | Fields referenced (field ID) |
| --- | --- | --- |
| Books | `tblFYqOnsQwInIYT1` | Status `fldFFDjAPL2QF3vMF` (Live = `selHAV7IYRze2kfOE`) · Launch Date `fldbvkC29ZHgcX4wI` · Amazon Link `fldBF4N6Jg96SVGfj` · ASIN `fldsjMfOxXOas2Nur` |
| Retail Links | `tblklatflL0JGa1Lk` | Status `fldwWYyjSqHS4gFeU` (Live = `selw61pUy9SiMdnLL`) · URL `fldeB8Z6eLRoTahC7` · ASIN / SKU `fldWrme7lNShCf6P6` · Book `fldtdVFTSg93VEpoP` · Platform `fldJICVU4Urc17dUy` · Format `fldpgigvIm6kZQmiy` |
| Wide Distribution Tracker | `tblgz8SzqgscBnfHm` | Upload Status `fldKIITdDtu8En8kM` (Live = `selRsJrQ3n8KmwWPQ`) · Approval Status `fldktTvgmfQjz4dcG` (Approved = `selEALc8kU30T9JEg`) · Retail Link `fldKhVE3LhtnqSLuY` · Book `fld8ltdXESQUAj3E3` · Platform `fldAn1BioYqpRzsvn` (Amazon KDP row = `recOA9P9KWUyojb4R`) |
| Buyers | `tblZPmtqy8SbNzboN` | Name `fldr2LsTMeMeyp2wN` · Email `fldGhryMZ0Tsi9jvi` · Phone `fldxyOgg6G1H5QKYV` · Bought Book `flddv0mranvVVONKL` · Will Review `fldP3y3HPKYzcq39o` · Review Completed `fld8dQrZsHJMdtXJT` · Follow-Up Date `fldYdll3zY9NOj6H3` · Book `fld6IXOaDoUpGh08u` |
| Reviews | `tblKWUi1cliCsMUar` | Reviewer Name `fldaKObujo2zANjUE` · Asked for Review `fldI7SIBdjPVnvDhc` · Review Posted `fldo3UHbYT6Iul6Vm` · Screenshot Received `fldtuEcHRjeuhlEtB` · Follow-Up Needed `fldAugiVVeHRrdTkK` · Book `fldyNMJKFPIWzKiVp` |
| Launch Tasks | `tbl8ghzvg0rjJtBEK` | Task `fldFFEqeU2sSdWX6o` · Owner `fld9waOWUl4oZh8YF` (Cecil = `selRdYBdGT3Fft9ix`) · Due Date `fldurIdWf7iSJaqyA` · Status `fldHjbnN22lPdBNgx` (To Do `selT2xf13YwkBmiFO` · In Progress `seltfIMw3BYeDTuwW` · Waiting `selQQuozLrlvOKvVQ` · Done `selPnYJSWKcaIMg2z`) · Blocker `fldGcNkYe9C0clULC` · Priority `fldkRk8lBwJq56MQl` |

**Notify Cecil — channel placeholders** (set once, reuse in all three): `EMAIL = cecil.trimble15@gmail.com` · `SMS = <Cecil's mobile>` (via Twilio, Make only). Confirm the preferred channel before building.

---

## Recipe 1 — Amazon Goes Live

**Goal:** The moment a real buy link exists, flip the whole system to "Live" from one edit, so the launch can fire.

**Trigger:** A **Retail Links** record's `Status` changes to **Live** (`selw61pUy9SiMdnLL`).
*(Cecil's one manual action stays: paste the Amazon product URL into `URL`, the ASIN into `ASIN / SKU`, then set `Status = Live`.)*

**Conditions (guard):** `URL` is not empty **and** `Book` link is not empty. If either is blank, stop and notify "Retail Link marked Live but URL/Book missing."

**Actions:**
1. **Update the linked Book** (`fldtdVFTSg93VEpoP` → Books):
   - `Status` → **Live** (`selHAV7IYRze2kfOE`)
   - `Launch Date` → today (only if currently empty — don't overwrite a real launch date)
   - `Amazon Link` → the Retail Link `URL`
   - `ASIN` → the Retail Link `ASIN / SKU`
2. **Update the Amazon platform row** in Wide Distribution Tracker — the record where `Platform = "Amazon KDP"` (`recOA9P9KWUyojb4R`), matched via the same `Book`:
   - `Upload Status` → **Live** (`selRsJrQ3n8KmwWPQ`)
   - `Approval Status` → **Approved** (`selEALc8kU30T9JEg`)
   - `Retail Link` → the `URL`
3. **Notify Cecil:** "🚀 _{Book Title}_ is LIVE on Amazon: {URL}. Book status, launch date, and Amazon distribution updated. Launch-day campaigns are cleared to send." Include the link to the Launch Command Center.

**Field map**

| From (Retail Links) | To | Set to |
| --- | --- | --- |
| `Status = Live` | — | *(trigger)* |
| `URL` | Books `Amazon Link`; WDT Amazon `Retail Link` | copy |
| `ASIN / SKU` | Books `ASIN` | copy |
| `Book` | — | resolves which Book + which Amazon WDT row |
| — | Books `Status` | Live |
| — | Books `Launch Date` | today (if empty) |
| — | WDT Amazon `Upload Status` / `Approval Status` | Live / Approved |

**Build path A — Airtable Automations:** Trigger *"When record matches conditions"* on Retail Links (`Status` is Live). Step 1: *Update record* → Books (use the trigger's `Book` linked record). Step 2: *Find records* in WDT where `Book` = trigger Book **and** `Platform` = Amazon KDP → *Update record*. Step 3: *Send email* to Cecil. (Native automations can update linked records directly; the "Launch Date only if empty" rule needs a *Conditional* group.)

**Build path B — Make:** Watch Records (Retail Links, Status = Live) → Router: (a) Airtable Update a Record (Books), (b) Search + Update (WDT Amazon row), (c) Email + Twilio SMS to Cecil. Make handles the "only if empty" and SMS more cleanly.

**Edge cases:** ignore non-Amazon platforms for the WDT step (match on Amazon KDP only, or generalize to "update the WDT row whose Platform matches this Retail Link's Platform"). Guard against re-firing if `Status` is edited while already Live (Airtable's "matches conditions" only fires on entering the state).

---

## Recipe 2 — Review Request Reminder

**Goal:** Turn every sale into a review ask, and chase the ones that don't land — without manual tracking.

**Trigger:** A **Buyers** record's `Bought Book` (`flddv0mranvVVONKL`) becomes **checked**.

**Conditions:** `Bought Book` = true. (Optionally also require `Will Review` = true to only chase willing buyers — recommended off at first so no one is missed.)

**Actions (on purchase):**
1. **Create a Reviews record:**
   - `Reviewer Name` (`fldaKObujo2zANjUE`) → Buyer `Name`
   - `Book` (`fldyNMJKFPIWzKiVp`) → Buyer's `Book`
   - `Asked for Review` (`fldI7SIBdjPVnvDhc`) → unchecked (set true when the ask is actually sent)
   - `Follow-Up Needed` (`fldAugiVVeHRrdTkK`) → checked
2. **Set the follow-up date on the Buyer:** `Follow-Up Date` (`fldYdll3zY9NOj6H3`) → **today + 5 days**.
3. *(Optional)* Notify the operator "Review ask due in 5 days for {Name}" — or rely on the digest (Recipe 3) / the Buyers & Reviews dashboard's Follow-up Reminders.

**Actions (the chase — separate scheduled automation):** Once daily, **find Reviews** where `Review Posted` (`fldo3UHbYT6Iul6Vm`) = false **and** `Follow-Up Needed` = true **and** the linked Buyer's `Follow-Up Date` ≤ today → notify: "⏰ Still no review from {Reviewer Name} for _{Book}_. Send the review-request script (see LAUNCH_PROMOTION_PLAYBOOK.md § Review request)." Keep nudging until `Review Posted` flips true, then clear `Follow-Up Needed`.

**Field map**

| Trigger (Buyers) | Creates / sets | Value |
| --- | --- | --- |
| `Bought Book` = true | Reviews `Reviewer Name` | Buyer `Name` |
| | Reviews `Book` | Buyer `Book` |
| | Reviews `Follow-Up Needed` | true |
| | Buyers `Follow-Up Date` | today + 5 |
| *(daily)* Review Posted = false past follow-up | notify Cecil/operator | reminder text |

**Build path A — Airtable Automations:** Automation 1 — *"When record matches conditions"* (Buyers, `Bought Book` is checked) → *Create record* (Reviews) → *Update record* (Buyers `Follow-Up Date`; use a formula field or Make for "+5 days", since native automations can't do date math inline — simplest native workaround: a hidden formula field `DATEADD(TODAY(),5,'days')` referenced by the automation, **which is a schema change to defer**). Automation 2 — *scheduled daily* → *Find records* (Reviews, not posted, follow-up due) → *Send email*.
**Note:** the "+5 days" step is the one spot that wants either a small formula field (schema change — deferred) or Make. Until then, set `Follow-Up Date` = today and adjust the digest to chase after 5 days.

**Build path B — Make:** Watch Records (Buyers, Bought Book = true) → Create Record (Reviews) → Update Record (Buyers, Follow-Up Date = `addDays(now; 5)` — clean, no schema change). Second scenario on a daily schedule: Search Records (Reviews unposted + due) → Email/SMS.

**Edge cases:** don't create a duplicate Reviews row if one already exists for that Buyer+Book (Make: search first; Airtable: guard with a condition). Stop chasing once `Review Posted` = true. Respect buyers with `Will Review` = false if you enable that guard.

---

## Recipe 3 — Launch Task Daily Digest

**Goal:** One morning message so Cecil always knows what's on fire — no opening the base required.

**Trigger:** **Scheduled** — every day at a set time (suggest 7:00 AM America/New_York).

**What it gathers (Launch Tasks, `tbl8ghzvg0rjJtBEK`):**
- **Due today** — `Due Date` = today **and** `Status` ≠ Done (`selPnYJSWKcaIMg2z`)
- **Overdue** — `Due Date` < today **and** `Status` ≠ Done
- **Waiting on CEO** — `Status` = **Waiting** (`selQQuozLrlvOKvVQ`) *(the base's "waiting/blocked-on-decision" state; also surface Owner = Cecil `selRdYBdGT3Fft9ix`)*
- **Blocked** — `Blocker` (`fldGcNkYe9C0clULC`) is not empty

**Action:** Send Cecil one digest (email, and/or SMS via Make). Suggested format:

```
📋 TBF Launch — {date}

🔴 Overdue ({n})
  • {Task} — was due {Due Date} [{Priority}]
🟡 Due today ({n})
  • {Task} [{Priority}]
⏳ Waiting on CEO ({n})
  • {Task}
⛔ Blocked ({n})
  • {Task} — {Blocker}

Open Launch Command Center → {link}
```
If all four buckets are empty, send "✅ Nothing due, overdue, waiting, or blocked today." (or skip sending — Cecil's preference).

**Build path A — Airtable Automations:** *Scheduled* trigger (daily) → *Find records* ×4 (one per bucket, using the conditions above) → *Send email* with the four record lists grouped. Native email steps can loop over found records.
**Build path B — Make:** Daily schedule → 4× Search Records (or one search + code to bucket) → Text aggregator to build the digest → Email + Twilio SMS. Make gives nicer formatting and SMS.

**Edge cases:** "today/overdue" must use the base's timezone (America/New_York). A task both overdue **and** waiting appears once — pick precedence (Overdue > Waiting). Exclude Done everywhere. Consider a weekday-only schedule.

---

## Build order & dependencies (when green-lit)

1. **Recipe 3 (Daily Digest)** first — pure read, zero schema/connector needs, buildable natively today. Immediate value.
2. **Recipe 1 (Amazon Goes Live)** next — highest launch impact; native-buildable. Test with a dummy Retail Link before go-live.
3. **Recipe 2 (Review Reminder)** last — the only one that wants either a small formula field *(deferred schema change)* or Make for clean date math. Build once Make is authorized, or approve the one-field addition.

**Nothing in this document has been built.** On your go-ahead — and after you lift the schema/Make holds where a recipe needs them — these can be implemented in the order above.
