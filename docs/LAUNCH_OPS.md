# TBF Entertainment — Launch Operations

Operational hub for launching **_Young G's vs. Old G's: The Prefix_** by O.G. Tom Tom (TBF Entertainment Publishing). This folder holds the trackers and checklists the website cannot hold on its own.

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

All forms are wired to a real submit path in `src/App.jsx` and **every form now routes to `info@tbfentertainment.art`** (contact, early-access, "Join the Movement", and Street Team). The flow is QA-verified end-to-end (see `docs/launch/07-FINAL-LAUNCH-QA-REPORT.md`): each form POSTs the lead with `_to: info@tbfentertainment.art`, a hidden honeypot blocks bot spam, and any backend failure falls back to a pre-filled email so **no lead is ever lost**.

It needs **one** config value to deliver to your inbox automatically. Two ways:

**Option A — Vercel env var (no code edit, recommended):**
1. Create a free form at **https://formspree.io** (or https://web3forms.com) using `info@tbfentertainment.art`.
2. In Vercel → Project → Settings → Environment Variables, add `VITE_FORM_ENDPOINT = https://formspree.io/f/xxxxxxxx`.
3. Redeploy. (Vite inlines `VITE_*` vars at build time.)

**Option B — in code:** set `const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';` in `src/App.jsx`, then `npm run build` (+ `build:standalone`) and redeploy.

Until the endpoint is set, forms **fall back to opening the visitor's email client** addressed to `info@` — leads aren't lost, but capture is manual. A single free Formspree/Web3Forms form delivers every submission to `info@`; each lead carries a `type` field (Early Access / Movement / Street Team / inquiry type) so you can filter in the inbox.

## Pre-launch quick gate

- [ ] `FORM_ENDPOINT` set and a test submission received.
- [ ] Amazon buy links point to the live product (replace search URLs with the ASIN — see KDP checklist).
- [ ] `info@tbfentertainment.art` inbox live (Google Workspace checklist).
- [ ] ISBNs recorded (`ISBN_TRACKING.md`).
- [ ] Airtable base built and seeded (`AIRTABLE_PUBLISHING_TRACKER.md`).
