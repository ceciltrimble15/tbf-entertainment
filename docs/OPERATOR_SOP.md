# Operator SOP — Crea/Krisha

The principle behind all of it: **the operator always has a next move.** The system's job is
to show the next executable action, the evidence required, and the exact decision that
belongs on Cecil's desk. If you are ever waiting for vague instructions, that is a system
bug — raise it.

---

## Daily work order

Work the queue in this order. `Operator Today` in the TBF Book Distribution OS interface is
grouped by exactly these six.

| Priority | Queue | Required behaviour |
| --- | --- | --- |
| 1 | CEO blockers | Package the decisions Cecil must make. **Then keep working** — never stop other work waiting on a decision |
| 2 | Release-critical | Preflight, upload, proof and live-verification tasks |
| 3 | Production queue | Move the next title one stage forward |
| 4 | Correctional growth | Policy research, contact validation, outreach follow-ups |
| 5 | Catalog maintenance | Broken links, metadata, listings, returns, stalled channels |
| 6 | Reporting | Update records, send the end-of-day handoff with evidence |

Priority 1 means *package it and move on*, not *stop and wait*. Packaging a decision takes
fifteen minutes; waiting for it takes days.

---

## Four-hour operator block

| Time | Block | Output |
| --- | --- | --- |
| 45 min | Queue control | Clear overdue items; package CEO decisions |
| 75 min | Title production | Advance the highest-priority book one stage |
| 60 min | Distribution | Uploads, listings, live checks, retailer corrections |
| 45 min | Correctional channel | Policy research, contacts, pitches, follow-ups |
| 15 min | Handoff | Update Airtable and send the evidence-based EOD report |

Target during the Days 31–60 phase: **10 qualified facility or account actions per operator
day.** An action counts as qualified only if it reached a verified contact or produced
verified policy evidence. Sending an email into a generic inbox is not a qualified action.

---

## The standard title task template

Created by Make scenario 01 when Cecil marks a title Production Approved. Each task carries
an owner, a due date and a stated evidence requirement.

| Stage | Tasks | Owner | Evidence |
| --- | --- | --- | --- |
| 01 Intake | Create title and edition records; build the master folder; record rights status and release goal | Operator | Folder URL on the Edition record |
| 02 Rights Gate | Confirm agreement, copyright, permissions, territories, payment terms | CEO + legal | Signed agreement filed in `01_RIGHTS` |
| 03 Editorial | Developmental edit, copyedit, author approval, manuscript lock | Production | Locked manuscript file, version-stamped |
| 04 Design | Interior, cover, spine, barcode area, ebook file, channel exports | Production | Final files in `03_INTERIOR` and `04_COVER` |
| 05 Metadata | Title, subtitle, description, categories, keywords, bio, pricing, ISBN, imprint | Operator | Metadata block in `05_METADATA` |
| 06 Preflight | Validate files, page count, trim, bleed, fonts, images, links, ISBN match | Operator + QA | Preflight report attached |
| 07 CEO Release Gate | Cecil approves final proof, price, channel plan, release date | Cecil | `CEO Release Approved` checked and dated |
| 08 Channel Release | Complete KDP, Ingram, direct and selected digital uploads | Operator | Upload date and exact filename per listing |
| 09 Correctional Channel | Classify content, verify facility policies, open outreach | Operator | Rating set; policy records current |
| 10 Verification | Record live URLs, screenshots, availability, metadata accuracy, proof results | Codex/QA | `Evidence Complete` shows verified |
| 11 Launch | Buy links, email and SMS, social assets, street team, partners | Operations | Live campaign links |
| 12 Reconciliation | Import sales, royalties, returns, direct orders, facility outcomes | Operations | Reconciled rows with statements attached |

---

## Facility research template

For each new facility, in order:

1. Create the `Facilities` record — name, system, state, city, security level, priority.
2. Find the official policy page. Create the `Facility Policies` record and paste the
   governing sentences verbatim into `Source Excerpt` with the URL.
3. Fill allowed formats, allowed sender, quantity limit, content and physical restrictions
   from what the page actually says. Leave blank what it does not say.
4. Record the exact mailing address block and the resident identifier format.
5. Find and record the institutional contacts by role.
6. Set `Checked By` and `Checked Date`, then set `Policy Status` to `Current - verified`.
7. Only now create the `Institutional Outreach` record and pitch.

Steps 1–6 are qualified actions in their own right. Research is progress.

---

## End-of-day handoff

Seven questions, every day, with evidence links:

1. What changed today?
2. Which title and stage moved?
3. Which files, records or listings changed?
4. What evidence proves completion?
5. What is blocked, by whom, and since when?
6. What decision does Cecil need to make?
7. What is the first task tomorrow?

A claim without a link is not a completion.

---

## What goes to Cecil, and what does not

Send it to Cecil **only** when it is one of these:

- a legal, ownership, rights or contract decision;
- a price, budget, paid service, returnability or wholesale-discount decision;
- final manuscript or proof approval, or a material editorial change;
- a tax, banking, identity, two-factor or platform-owner step;
- a brand or reputation exception, a sensitive correctional decision, or a vendor agreement.

Everything else stays with you and continues through the queue.

When you do raise one, it goes in `Decisions` as a complete package: the question, at least
two real options with their trade-offs, your recommendation, and what it costs to wait. A
decision request with no recommendation is unfinished work.

Do the research that informs the decision *before* you send it. Looking up an ISBN in the
Bowker account is your job; deciding whether to buy a new block is his.

---

## File and naming rules

One company-owned master folder per edition:

```
TBF_ENTERTAINMENT / 01_BOOK_PIPELINE / [ISBN]_[SHORT_TITLE] /
  01_RIGHTS   02_MANUSCRIPT   03_INTERIOR   04_COVER   05_METADATA   06_KDP
  07_INGRAM   08_DIRECT_SALES 09_CORRECTIONAL 10_MARKETING 11_SALES_REPORTS 12_ARCHIVE
```

Never name a final file `final-final-2`. Use `Title_Format_Version_YYYY-MM-DD`, preserve the
approved source file, and record the **exact uploaded filename** on the Channel Listing
record. When a platform rejects a file six weeks later, that filename is how you find which
version went up.
