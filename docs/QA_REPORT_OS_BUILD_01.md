# QA Report — Book Distribution OS, Build 01

Build date: 2026-08-18 · Built by: Claude Code · For QA review by: Codex
Base: `appwnC45fLK2SCgzW` (TBF Entertainment Publishing Command Center)

---

## 1. What was built

**Ten new Airtable tables**, plus extensions to two existing tables.

| Table | ID | Records seeded |
| --- | --- | --- |
| Editions | `tblDszccDY0CuvJtj` | 2 |
| Production Tasks | `tblK6VxsjzllRXFzC` | 12 |
| Channel Listings | `tblWqKZ5iBQDf3sIE` | 5 |
| Facilities | `tblKVupnxkixcmKQg` | 1 |
| Facility Policies | `tblyEPPAYTe9yduY3` | 1 |
| Institutional Outreach | `tbl91Z15xI5zyw42i` | 0 |
| Orders & Shipments | `tbl95oARAQu5147k3` | 0 |
| Rejections & Returns | `tblpm8FuggDtefDaH` | 0 |
| Sales & Royalties | `tblkW2WS5LQE7TR8Y` | 0 |
| Decisions | `tblAxNft9pITwL3is` | 4 |

**`Books` extended** with: Rights Gate, Copyright Owner, Publishing Agreement Signed, Rights
Evidence URL, Territories, Payment Terms, Production Approved, Production Approved Date,
Manuscript Locked, Manuscript Locked Date, Target Audience, Master Folder URL, Edition Count.

**Eight guardrail formula fields** across Editions, Facilities, Facility Policies, Channel
Listings, Production Tasks, Orders & Shipments and Rejections & Returns. These are listed in
`BOOK_DISTRIBUTION_OS.md` §4.

**One published interface** — `TBF Book Distribution OS` (`pbdRRJr5bbOtyr7Rw`) with eight
pages: CEO Dashboard, Operator Today, Production Board, Distribution Board, Correctional
Sales Board, Correctional Outreach Queue, Finance Board, Rejection Intelligence.

**Five documents** in `docs/`: this report, `BOOK_DISTRIBUTION_OS.md`, `MAKE_SCENARIOS.md`,
`CORRECTIONAL_DISTRIBUTION_SOP.md`, `OPERATOR_SOP.md`.

---

## 2. Tests run, with evidence

Three guardrails were tested by deliberately creating the failure condition, observing the
result, and reverting. All three passed.

**Test 1 — ISBN distribution conflict.** Set `YGOG-PB-1E → KDP Expanded Distribution` to
`ON - KDP is sole distributor` while an IngramSpark channel listing existed on the same
edition. Result:

> ⛔ CONFLICT — KDP Expanded Distribution is ON while this ISBN is also distributed through
> IngramSpark. Turn ED OFF or remove the Ingram listing.

Reverted to `UNSET - decide before release`. **Pass.**

**Test 2 — evidence enforcement on a live listing.** Set the KDP channel listing to
`Live Verified` with no URL, no verifier and no verified date. Result:

> ⛔ Marked Live Verified WITHOUT complete evidence — no live URL; no verified date;
> no verifier; metadata not confirmed;

Reverted to `Not Started`. **Pass.**

**Test 3 — correctional ship clearance.** Created a test order (`QA-TEST-001`) in the
Correctional Individual lane against Hamilton County Justice Center with no verifications.
Result:

> ⛔ HOLD — recipient ID unverified; address format unverified; facility policy not confirmed
> current; quantity limit not checked;

Test record deleted after the check. **Pass.**

**Test 4 — policy freshness default.** The seeded Hamilton County policy record has no
checked date. Both the policy record and the parent facility read:

> ⛔ Never verified — do not ship or pitch
> ⛔ No verified policy on file — research before any pitch or shipment

**Pass** — never-verified is the correct default, and it correctly propagates to the facility.

**Not tested:** the 90-day staleness transition and the appeal countdown, both of which need
date arithmetic across a real interval. The formulas are straightforward
`DATETIME_DIFF` comparisons and can be checked by setting a past date on any record.

---

## 3. Failures and defects found during the build

**Two table names were created HTML-escaped** (`Orders &amp; Shipments`,
`Rejections &amp; Returns`) because the ampersand was over-escaped in the create call. Both
were corrected in place with `update_table`. No data was affected.

**One link field was created pointing at the wrong table.** `Rejections & Returns → Order`
was initially linked to `Editions` because `Orders & Shipments` did not exist yet at creation
time. A correct `Order` field linking to `Orders & Shipments` was created afterwards. The
Airtable API cannot delete fields, so the incorrect one was renamed
**`ZZ · unused link (delete in UI)`** and documented in its field description.

> **Action for Cecil or the operator:** delete that field, and its auto-created inverse field
> on `Editions`, from the Airtable UI. It is inert but it is clutter.

---

## 4. What was deliberately NOT done

No platform account was touched. Nothing was published, no price was changed, no ISBN was
bought, no proof was approved, and no banking or tax data was altered — per the §14 build
rules.

**No facility policy was verified.** The Hamilton County record carries the playbook's summary
clearly marked as a secondary source, with no checked date, so it blocks rather than
authorises. Verifying a facility's rules means reading the official page and recording the
governing sentences, and that is operator work with a named human behind it — not something
to stamp from a build script.

**No Make scenario was created.** The Make connector was not authorised for this session.
`MAKE_SCENARIOS.md` is the full specification for all fifteen, with triggers, actions, error
paths, retry rules and owners. Scenarios 09 and 13 are already covered visually by formula
guardrails, so the pipeline is safe to operate before Make exists.

**`Pipeline Status` on the pilot edition is a placeholder.** It was set to `Intake Ready`
because the system genuinely does not know where the title stands — the `Books` record says
"In Review", the ISBN registry says "Assigned", and there is no ASIN or Amazon URL anywhere.
Guessing a stage would have been worse than admitting the gap. Production task
`Set the TRUE current pipeline stage for YGOG-PB-1E` covers it.

---

## 5. Credentials and access still needed

Nothing here should be stored in Airtable or Make.

| Need | For | Held by |
| --- | --- | --- |
| Make.com workspace connection | Building scenarios 01–15 | Cecil |
| Bowker / MyIdentifiers login | Answering Decision D-001 | Cecil |
| KDP account access | Confirming the real state of the Young G's listing | Cecil |
| IngramSpark account | Wide distribution setup, once D-001 and D-002 are settled | Not yet created |
| Google Drive folder root | Master folder tree per §10 | Operator |

---

## 6. Decisions waiting on Cecil

Four decision packages are on the CEO Dashboard, each with options, a recommendation and the
cost of delay. They are genuine blockers, not formalities.

**D-001 — Confirm the ownership source of ISBN 979-8-9967275-0-6.** Nothing on record says
whether this ISBN came from Bowker or from Amazon's free KDP pool, and the 979-8 prefix is
used by both. If it is KDP-assigned it is Amazon-locked and IngramSpark is impossible on this
edition. This one question gates the entire wide-distribution plan. The operator's Bowker
lookup should land on Cecil's desk before he reads it.

**D-002 — KDP Expanded Distribution ON or OFF for the paperback.** Currently UNSET, which the
guardrail flags. Recommendation is OFF with IngramSpark as wholesaler, conditional on D-001.

**D-003 — Correctional eligibility rating for Young G's.** Currently Not Rated, which blocks
all four correctional routes including the direct-to-person route that needs no institutional
relationship. The subtitle reads as Yellow on the playbook's own scale, but the rating must
come from someone who has read the final manuscript.

**D-004 — Wholesale discount and returnability for IngramSpark.** Both empty and neither is
the operator's to set. Cannot be answered properly until the final page count is recorded,
since Ingram print cost drives the margin math at a $13.99 list price.

---

## 7. One finding worth Cecil's attention beyond the four decisions

**Rights Gate is `Not Started` on both titles, and no publishing agreement is on file for
either.** Young G's has an assigned ISBN, a set price and a launch checklist — it is treated
throughout the repo as a title going to market. If there is no signed agreement between TBF
Entertainment and O.G. Tom Tom, that is a legal gap on a title that may already be selling,
and it sits upstream of every other decision here. Production task *"Locate or open the
publishing agreement for Young G's"* is in the queue at priority 1. If the agreement exists,
file its URL and close it in five minutes. If it does not, it should become D-005 today.
