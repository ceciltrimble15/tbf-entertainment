# TBF Command Center — Relationships + Calendar View

Goal: link every table back to **Books** so each book's launch filters separately
(reusable for future TBF titles), and add a Calendar view for the 30-day plan.

Base: https://airtable.com/appwnC45fLK2SCgzW · Books record = *Young G's vs. Old G's*

---

## A. Add a "Book" link field to these 7 tables

Each becomes a **Link to another record → Books** field (single record):
Buyers / Supporters · Street Team · Reviews · Outreach · Launch Tasks · Content
Calendar · Assets.

> **Assets** already has a plain-text `Book` field. Rename it to **`Book (text)`**
> first, then add the new linked **`Book`** field (so the name stays consistent).

**Do it in the UI (2 min each):** open a table → far-right `+` to add a field →
type **Link to another record** → choose **Books** → turn ON "Limit to single
record" → name it **Book**.

## B. Connect existing records to *Young G's vs. Old G's*

Set the new **Book** field = *Young G's vs. Old G's* on every existing record:

| Table | Records to link |
| --- | --- |
| Assets | 8 (all) |
| Launch Tasks | 18 (all) |
| Content Calendar | 30 (all) |
| Buyers / Supporters | 0 — none yet (field ready for new entries) |
| Street Team | 0 — none yet |
| Reviews | 0 — none yet |
| Outreach | 0 — none yet |

Fastest in the UI: in each table, click the first record's **Book** cell → pick
*Young G's vs. Old G's* → then drag the cell's fill handle down the column to copy
it to all rows.

**Nothing "can't be linked."** The four empty tables simply have no records yet —
their Book field is in place for whatever you add next. Going forward, set **Book**
on each new row so every launch stays separate.

## C. Filter a single book's launch

Once linked, filter any table by **Book is _Young G's vs. Old G's_**. For the next
title, add a new **Books** row and set **Book** on its records — same base, clean
separate launches. (Tip: duplicate your views and change the Book filter per title.)

---

## D. Calendar view — 30-day content plan

In **Content Calendar**: view dropdown → **+ Create → Calendar**.
- **Date field:** `Date`
- **Color by:** `Post Type` (or `Platform`)
- Optional filter (once linked): `Book is Young G's vs. Old G's`

You'll see the whole 30-day plan on a month grid — drag posts to reschedule to
your real launch week, and check **Posted** as you go.

---

## Auto-run option
Claude has every record ID saved and can execute all of section A + B
automatically the moment the Airtable connector is reconnected/re-authorized —
just say "go."
