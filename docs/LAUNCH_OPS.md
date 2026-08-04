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

The email-capture box and the contact form are wired to a real submit path in `src/App.jsx`, but they need **one** config value to deliver to you. The endpoint is now supplied through a **secure environment variable** (no secret in the repo):

1. Create a free form at **https://formspree.io** using `info@tbfentertainment.art` (pending CEO approval of the backend).
2. Copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. Set `VITE_FORM_ENDPOINT=https://formspree.io/f/abcdwxyz` in Vercel → Settings → Environment Variables (and in `.env.local` for local dev — see `.env.example`).
4. `npm run build` (and `npm run build:standalone` if you use the single file), then redeploy.

Until `VITE_FORM_ENDPOINT` is set, forms **fall back to opening the visitor's email client** — leads are not lost, but capture is manual. Full details, submitted fields, and how SMS consent is recorded are in [`FORM_SETUP.md`](./FORM_SETUP.md).

## Book buy links — centralized

Every Young G's vs. Old G's purchase button reads from two constants near the top of `src/App.jsx`:

```js
const YOUNG_GS_AMAZON_URL = '';
const YOUNG_GS_IS_AVAILABLE = false;
```

While unverified, all buy buttons render a clearly-disabled **"Amazon Listing Coming Soon"** state, and availability/price/format/retailer claims are replaced with accurate "coming soon / to be announced" wording. To activate the entire site at once, set the **verified direct product-page URL** (never a search URL) and flip availability to `true`:

```js
const YOUNG_GS_AMAZON_URL = 'https://www.amazon.com/dp/XXXXXXXXXX';
const YOUNG_GS_IS_AVAILABLE = true;
```

Nothing else needs to change. Then `npm run build` and redeploy.

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

- [ ] `VITE_FORM_ENDPOINT` set (env var) and a test submission received.
- [ ] `YOUNG_GS_AMAZON_URL` set to the verified direct product page and `YOUNG_GS_IS_AVAILABLE = true` (see KDP checklist). No search URLs.
- [ ] `info@tbfentertainment.art` inbox live (Google Workspace checklist).
- [ ] ISBNs recorded (`ISBN_TRACKING.md`).
- [ ] Airtable base built and seeded (`AIRTABLE_PUBLISHING_TRACKER.md`).
