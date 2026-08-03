# TBF Entertainment — Publishing & Book Launch Command Center

**Airtable base:** TBF Entertainment Publishing Command Center
**Open it here:** https://airtable.com/appwnC45fLK2SCgzW

Airtable is the **source of truth**. Google Drive is for **files only** (the
Assets table just links to them). This system is reusable for **every future
TBF book** — add a new row in **Books** and reuse the same tables.

---

## What's already in it (real data — no fake customers)

| Table | Seeded | Notes |
| --- | --- | --- |
| **Books** | 1 | *Young G's vs. Old G's* — In Review |
| **Assets** | 8 | Cover, wrap, interior, manuscript, QR, logo, media kit, 3D mockup |
| **Launch Tasks** | 18 | Real launch to-dos incl. "Wait on Amazon approval" |
| **Content Calendar** | 30 | Full 30-day plan with captions + CTAs |
| **Buyers / Supporters** | 0 | Empty on purpose — add real people |
| **Street Team** | 0 | Empty on purpose |
| **Reviews** | 0 | Empty on purpose |
| **Outreach** | 0 | Empty on purpose |

---

## The 8 tables & field map

**1. Books** — every title TBF publishes.
Book Title · Subtitle · Author · Publisher · ISBN · Format · Status · Amazon Link · ASIN · Price · Launch Date · Paper · Trim · Notes

**2. Buyers / Supporters** — people who bought / want the book / need the link.
Name · Phone · Email · City · State · Bought Book ☐ · Needs Link ☐ · Will Review ☐ · Review Completed ☐ · Follow-Up Date · Notes

**3. Street Team** — people helping promote.
Name · Phone · Email · Platform · Audience Type · Shared Flyer ☐ · Posted Video ☐ · Bought Book ☐ · Left Review ☐ · Status · Notes

**4. Reviews** — Amazon reviews + screenshots.
Reviewer Name · Bought Book ☐ · Asked for Review ☐ · Review Posted ☐ · Stars ★ · Screenshot Received ☐ · Review Link · Follow-Up Needed ☐ · Notes

**5. Outreach** — people/orgs to contact. Category options: Family, Friends, Cincinnati Contacts, Barbershops, Beauty Salons, Churches, Book Clubs, Podcasts, Local Media, Reentry Organizations, Community Leaders, Youth Mentors, Libraries, Correctional Facility Book Programs.
Contact Name · Organization · Category · Phone · Email · Social Link · Message Sent ☐ · Response · Next Step · Priority · Notes

**6. Content Calendar** — 30-day launch plan.
Date · Platform · Post Type · Caption · Asset Needed · CTA · Posted ☐ · Results · Notes

**7. Assets** — production/marketing files (link to Drive).
Asset Name · Book · Asset Type · File Link · Version · Status · Notes

**8. Launch Tasks** — daily task tracker.
Task · Owner · Priority · Due Date · Status · Blocker · Notes

---

## Views to add (2 minutes — do this once)

Airtable's API can't create views, so add these by hand. In each table click the
view dropdown → **+ Create → Grid**, name it, then set the filter/sort below.

| View | Table | Filter | Sort |
| --- | --- | --- | --- |
| **Active Launch** | Launch Tasks | Status is **not** Done | Priority (High→Low), then Due Date |
| **Today's Tasks** | Launch Tasks | Due Date is **on or before today** AND Status is not Done | Priority |
| **Waiting on Amazon Approval** | Launch Tasks | Status is **Waiting** | Due Date |
| **Buyers Needing Review** | Buyers / Supporters | Bought Book is ☑ AND Review Completed is ☐ | Follow-Up Date |
| **Needs Follow-Up** | Outreach | Response is **Follow-Up** OR (Message Sent ☑ AND Response is No Response) | Priority |
| **High Priority Outreach** | Outreach | Priority is **High** AND Message Sent is ☐ | Category |
| **Street Team Active** | Street Team | Status is **Active** or **Confirmed** | Name |

> Tip: also make a **Calendar view** on Content Calendar (grouped by Date) so you
> can see the 30-day plan on a calendar.

---

## Rules (keep it simple)

- **Airtable = source of truth.** Update statuses/checkboxes as you go.
- **Drive = files only.** Put the file in Drive, paste the link in Assets.
- **No fake data.** Only add real people to Buyers / Street Team / Outreach.
- Reuse for every book: add a row in **Books**, then work the other tables.

---

## The moment Amazon approves

1. **Books** → your book row → set **Status = Live**, paste **Amazon Link** + **ASIN**, set **Launch Date**.
2. Website: set `AMAZON_PAPERBACK_URL` (and Kindle) so the Buy buttons point to the live listing.
3. Fire the **Launch-day blast** task (text + Facebook + Instagram — scripts in `LAUNCH-SCRIPTS.md`).

See `DAILY-WORKFLOW.md` for the daily routine and `LAUNCH-SCRIPTS.md` for copy-paste scripts.
