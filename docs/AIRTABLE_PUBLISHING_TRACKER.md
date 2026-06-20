# Airtable Publishing Tracker

A single Airtable base, **"TBF Publishing"**, to run the launch. Build the four tables below. This is intentionally lean — enough to manage _Young G's vs. Old G's_ and grow into a catalog, nothing more.

> Tip: Airtable's free plan is sufficient. Create the base manually, or import this spec. If you wire Formspree → Airtable, point it at the **Leads** table.

---

## Table 1 — Titles

One row per book. The catalog backbone.

| Field | Type | Notes |
| --- | --- | --- |
| Title | Single line text | e.g. `Young G's vs. Old G's: The Takeover` |
| Series | Single line text | `Young G's vs. Old G's` |
| Book # | Number | `1` |
| Author | Single line text | `O.G. Tom Tom` |
| Status | Single select | `Drafting`, `Editing`, `Cover`, `Formatting`, `Live`, `Paused` |
| Format(s) | Multiple select | `Paperback`, `eBook`, `Hardcover` |
| ISBN (link) | Link to **ISBNs** | One Title → many ISBN rows |
| KDP ASIN | Single line text | Fill once live |
| Amazon URL | URL | Live product page |
| List Price | Currency | |
| Launch Date | Date | |
| Notes | Long text | |

Seed row: `Young G's vs. Old G's: The Takeover` — Book 1 — O.G. Tom Tom — Status `Live` — Formats `Paperback, eBook`.

---

## Table 2 — Launch Tasks

One row per actionable task. Drive the 30-day campaign from here (mirror `KDP_LAUNCH_CHECKLIST.md`).

| Field | Type | Notes |
| --- | --- | --- |
| Task | Single line text | |
| Phase | Single select | `Build (1-7)`, `Ignite (8-14)`, `Strike (15-21)`, `Hold (22-30)` |
| Title | Link to **Titles** | |
| Owner | Single line text / Collaborator | |
| Due | Date | |
| Status | Single select | `Not started`, `In progress`, `Done`, `Blocked` |
| Channel | Single select | `KDP`, `Kindle`, `IngramSpark`, `Social`, `Retail`, `Email`, `PR` |
| Link | URL | Asset / post / listing |

Suggested view: **Group by Phase, sort by Due** → kanban for the launch.

---

## Table 3 — Leads (email + inquiries)

Where website signups and contact-form inquiries land. If using Formspree, connect it here.

| Field | Type | Notes |
| --- | --- | --- |
| Email | Email | |
| Name | Single line text | |
| Type | Single select | `Early Access`, `General`, `Publishing`, `Artistry`, `Media`, `Partnership`, `ARC Request` |
| Message | Long text | |
| Source | Single select | `Website`, `Social`, `Event`, `Referral` |
| Created | Created time | Auto |
| Status | Single select | `New`, `Contacted`, `Customer`, `Archived` |

This is the email list of record. Export to CSV for any email tool (Mailchimp/Beehiiv) at launch.

---

## Table 4 — Retail Outreach

Cincinnati bookstore + consignment pipeline (Phase 2–3).

| Field | Type | Notes |
| --- | --- | --- |
| Store | Single line text | |
| Neighborhood | Single select | `Avondale`, `Bond Hill`, `Madisonville`, `Walnut Hills`, `Other` |
| Contact | Single line text | Name / phone / email |
| Stage | Single select | `Identified`, `Contacted`, `Meeting`, `Consignment`, `Stocked`, `Declined` |
| Copies | Number | Units placed |
| Terms | Single line text | e.g. `60/40 consignment` |
| Next step | Single line text | |
| Follow-up | Date | |
