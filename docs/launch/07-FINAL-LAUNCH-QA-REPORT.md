# Final Launch QA Report — TBF Entertainment

**Date:** 2026-06-25
**Scope:** Production functional QA (no redesign). Verified with headless
Chromium (Playwright) across all 7 routes + live form-submission tests against
a mock endpoint, plus production build verification.
**Build:** `npm run build` ✅ clean · `npm run build:standalone` ✅ clean.

---

## RESULT SUMMARY

| Priority | Area | Result |
| --- | --- | --- |
| 1 | Contact form delivery → `info@` | ✅ **PASS** (flow verified; needs 1 endpoint value to go live) |
| 2 | CTA buttons / links | ✅ **PASS** |
| 3 | Images / cover / social assets | ✅ **PASS** |
| 4 | Responsive (desktop/tablet/mobile) | ✅ **PASS** (1 minor overflow fixed) |
| 5 | This report | ✅ Delivered |

---

## PRIORITY 1 — FORM SUBMISSION FLOW

**Root cause found:** no form backend was configured (`FORM_ENDPOINT` empty) and
the Street Team form routed to `submissions@`, not `info@`. With no backend,
submissions only opened the visitor's mail client (manual), so nothing arrived
automatically at `info@`.

**Fixes applied:**
- Every form now routes to **`info@tbfentertainment.art`** (contact, early-access, Movement, Street Team).
- Endpoint is now configurable via **`VITE_FORM_ENDPOINT`** (Vercel env var) — no code edit needed.
- Added a hidden **honeypot** spam trap (bots dropped silently).
- `submitLead` now **falls back to mailto on any backend error** → no lost lead.

**Live test (endpoint pointed at a mock server, every form submitted):**

| Form | Success UI | POST delivered | Destination |
| --- | --- | --- | --- |
| Contact (Submit Inquiry) | ✅ | ✅ 1 | `info@tbfentertainment.art` |
| Home early-access (Get Early Access) | ✅ | ✅ 1 | `info@tbfentertainment.art` |
| Join the Movement | ✅ | ✅ 1 | `info@tbfentertainment.art` |
| Join the Street Team | ✅ | ✅ 1 | `info@tbfentertainment.art` |
| Honeypot (bot) submission | ✅ (decoy) | ⛔ 0 (dropped) | — |

✅ **Flow PASS** — all forms deliver to `info@` with the correct payload; spam blocked.

> ⚠️ **One value to go live (yours to set):** a static site can't send email itself.
> Add `VITE_FORM_ENDPOINT` = your Formspree/Web3Forms URL (form created with
> `info@`) in Vercel and redeploy. Until then, forms fall back to a pre-filled
> email to `info@` (no lead lost). I verified the wiring works by pointing it at
> a test endpoint and confirming delivery — I can't create the email account on
> your behalf.

---

## PRIORITY 2 — CTA BUTTONS & LINKS

- ✅ **0 broken links** site-wide (no `#`, empty, or `javascript:void(0)` hrefs).
- ✅ All in-page CTAs are real `<button>`/`<a>` (23–30 per page); nav routes verified across all 7 routes.
- ✅ Named CTAs exercised: **Submit Inquiry, Get Early Access, Join the Movement, Join the Street Team** (clicked + submitted successfully); **Get the Book / Buy on Amazon** → central `BUY_URL` (live-listing-ready search fallback); **Get First Access / Connect / Get In Touch / Publishing Inquiry** → route correctly.
- ✅ External links use `target="_blank"` + `rel="noopener noreferrer"`.

---

## PRIORITY 3 — IMAGES & ASSETS

- ✅ **0 broken images** on every page (home, books, publishing, artistry, media, connect, young-gs).
- ✅ **Book cover:** new approved "Young Gs vs Old Gs" art (1200×1800) on all surfaces.
- ✅ **Logo / favicon:** silver/blue TBF master (`/logo.png`).
- ✅ **Open Graph image:** `https://tbfentertainment.art/book-cover.png` (new cover).
- ✅ **Twitter image:** same (new cover). `summary_large_image`.
- ✅ Title, description, **canonical**, JSON-LD present.

---

## PRIORITY 4 — RESPONSIVE

| Page | Desktop (1440) | Tablet (820) | Mobile (390) |
| --- | --- | --- | --- |
| Home | ✅ 0 overflow | ✅ fixed | ✅ 0 overflow, burger menu opens |
| Young G's | ✅ | ✅ fixed | ✅ |
| Connect | ✅ | ✅ fixed | ✅ |
| Publishing | ✅ | ✅ fixed | ✅ |

- **Fixed:** a 4px horizontal overflow at tablet width on every page → added `overflow-x: hidden` to `html` (was only on `body`). Clipped before; now eliminated.
- ✅ Mobile nav collapses to a working burger menu.

---

## ITEMS FIXED (this pass)

1. All forms → `info@tbfentertainment.art` (Street Team was `submissions@`).
2. `VITE_FORM_ENDPOINT` env-var support (deploy-time config, no code edit).
3. Honeypot spam protection on all forms.
4. mailto fallback on backend failure (resilient delivery).
5. Tablet 4px horizontal overflow eliminated.
6. Docs (`LAUNCH_OPS.md`) updated to the new flow.

---

## WARNINGS

- **Console:** one `ERR_CONNECTION_CLOSED` per page = Google Fonts blocked by the QA sandbox network. **Not a site defect** — resolves on the open internet. No JS runtime errors.
- **Live URL:** `tbfentertainment.art` returns 403 to automated fetches, so QA ran against the built app + dev server. Re-verify on the deployed URL after merge.

---

## REMAINING ISSUES (need your input/credentials — not code)

1. **Set `VITE_FORM_ENDPOINT`** (Formspree/Web3Forms with `info@`) to switch forms from mailto-fallback to automatic inbox delivery. *(Required for "emails arrive automatically.")*
2. **Live Amazon URLs** — set `AMAZON_PAPERBACK_URL` / `AMAZON_KINDLE_URL` when KDP listings publish.
3. **Author photo** — drop `public/author-tomtom.jpg` (section auto-detects; branded fallback until then).
4. After deploy, **re-scrape** the homepage in the Facebook / X / LinkedIn debuggers so social previews pick up the new cover.

---

## GO / NO-GO

**GO for launch on functionality.** All buttons, links, images, social assets,
and responsiveness PASS; the form flow is verified and one env value away from
automatic delivery. No blocking code defects remain.
