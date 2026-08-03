# TBF Launch System — Build QA Report

**Date:** 2026-07-04
**Base:** TBF Entertainment Publishing Command Center (`appwnC45fLK2SCgzW`)
**Verified via:** Airtable API (`list_tables_for_base`) + record-create confirmations.

## PASS

| Check | Result |
| --- | --- |
| Base created in the correct workspace | ✅ |
| All **8 tables** exist with correct names | ✅ Books, Buyers / Supporters, Street Team, Reviews, Outreach, Content Calendar, Assets, Launch Tasks |
| All requested **fields** present, correct types | ✅ (checkboxes, single-selects, dates, currency, rating, url, email, phone) |
| Outreach has all **14 categories** | ✅ |
| **Books** seeded with the real title | ✅ *Young G's vs. Old G's* — ISBN 979-8-9967275-0-6, Paperback, $13.99, Cream, 6×9, Status = In Review |
| **Assets** seeded (real files) | ✅ 8 rows with Drive/website links |
| **Launch Tasks** seeded | ✅ 18 real tasks incl. "Wait on Amazon approval" |
| **Content Calendar** seeded | ✅ 30 days, captions + CTAs |
| **No fake customer data** | ✅ Buyers / Street Team / Reviews / Outreach left empty |
| Airtable = source of truth; Drive = files only | ✅ Assets link out to Drive |

## WARNINGS / MANUAL STEPS

- ⚠️ **Views** (Active Launch, Today's Tasks, Waiting on Amazon Approval, Buyers
  Needing Review, Needs Follow-Up, High Priority Outreach, Street Team Active) —
  Airtable's API cannot create views, so they are **documented with exact
  filters in `README.md`**. Adding them is a ~2-minute one-time step.
- ⚠️ **Content Calendar dates** are a template starting the week of 2026-07-07 —
  shift them to your real launch week (drag in Calendar view or bulk-edit).
- ⚠️ **3D Book Mockup** asset is marked *Draft* — to be supplied.

## REMAINING (owner actions)
1. Add the 7 views (README).
2. Fill Buyers / Outreach / Street Team with **real** contacts.
3. When Amazon approves: set Books → Live + Amazon Link + ASIN + Launch Date.

**Verdict:** ✅ Command center is live, correct, and ready to use.
