# TBF Entertainment — Launch Operations

Operational hub for launching **_Young G's vs. Old G's: The Takeover_** by O.G. Tom Tom (TBF Entertainment Publishing). This folder holds the trackers and checklists the website cannot hold on its own.

## Contents

| Doc | Purpose |
| --- | --- |
| [`AIRTABLE_PUBLISHING_TRACKER.md`](./AIRTABLE_PUBLISHING_TRACKER.md) | Base + table schema for tracking titles, tasks, leads, and retail outreach. |
| [`ISBN_TRACKING.md`](./ISBN_TRACKING.md) | ISBN registry — one row per format, who owns it, where it's assigned. |
| [`GOOGLE_WORKSPACE_SETUP.md`](./GOOGLE_WORKSPACE_SETUP.md) | Checklist to stand up `tbfentertainment.art` email + Drive. |
| [`KDP_LAUNCH_CHECKLIST.md`](./KDP_LAUNCH_CHECKLIST.md) | Step-by-step Amazon KDP publish + 30-day launch checklist. |

## Website status (what's wired)

The site is a single-page React/Vite app (`src/App.jsx`). State-based routing — every page lives at `/`.

- **Deploy:** `npm run build` → `dist/` (configured in `vercel.json`, framework `vite`). Images in `public/` resolve to `/logo.png`, `/book-cover.png` after build.
- **Portable single file:** `npm run build:standalone` regenerates `standalone.html` (self-contained, for email/preview). Do **not** hand-edit it — it is generated from `src/`.

## Lead capture — REQUIRED before launch

The email-capture box and the contact form are wired to a real submit path in `src/App.jsx`, but they need **one** config value to deliver to you:

1. Create a free form at **https://formspree.io** using `info@tbfentertainment.art`.
2. Copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `src/App.jsx`, set `const FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';`
4. `npm run build` (and `npm run build:standalone` if you use the single file), then redeploy.

Until `FORM_ENDPOINT` is set, forms **fall back to opening the visitor's email client** — leads are not lost, but capture is manual. Set the endpoint to automate it (and to optionally pipe leads straight into the Airtable tracker via Formspree → Airtable).

### Per-form routing (Young G's landing page)
The forms pass a destination address to `submitLead(payload, to)`:

| Form | Routes to |
| --- | --- |
| Site email capture + contact | `info@tbfentertainment.art` |
| "Join the Movement" email signup | `info@tbfentertainment.art` |
| Street Team signup | `submissions@tbfentertainment.art` |
| Media / General contact cards | `media@` / `info@` (direct mailto links) |

The **mailto fallback honors these destinations exactly**. Note: a single free **Formspree** form delivers to one inbox — to keep Street Team going to `submissions@`, either create a **second Formspree form** for it (and set its endpoint), use Formspree's routing rules, or forward via a Google Workspace filter. The `_to` field is included in the POST for tools that support address routing.

## Pre-launch quick gate

- [ ] `FORM_ENDPOINT` set and a test submission received.
- [ ] Amazon buy links point to the live product (replace search URLs with the ASIN — see KDP checklist).
- [ ] `info@tbfentertainment.art` inbox live (Google Workspace checklist).
- [ ] ISBNs recorded (`ISBN_TRACKING.md`).
- [ ] Airtable base built and seeded (`AIRTABLE_PUBLISHING_TRACKER.md`).
