# Website QA Report — TBF Entertainment

**Date:** 2026-06-25
**Build:** Vite 5 production build — ✅ passes (`npm run build`, 31 modules, ~67 kB gzipped JS)
**Method:** Headless Chromium (Playwright) walked all 7 routes at desktop/tablet/mobile viewports + static review.

## Route check (all client + deep-link routes)

| Route | HTTP | Renders | Broken images | Console errors* | Old title text |
| --- | --- | --- | --- | --- | --- |
| `/` (Home) | 200 | ✅ | 0 | 0 (site) | none |
| `/books` | 200 | ✅ | 0 | 0 (site) | none |
| `/publishing` | 200 | ✅ | 0 | 0 (site) | none |
| `/artistry` | 200 | ✅ | 0 | 0 (site) | none |
| `/media` | 200 | ✅ | 0 | 0 (site) | none |
| `/connect` | 200 | ✅ | 0 | 0 (site) | none |
| `/young-gs` | 200 | ✅ | 0 | 0 (site) | none |

\* Each page logs **one** `ERR_CONNECTION_CLOSED` — that is the external
Google Fonts request blocked by the QA sandbox's network policy, **not** a
site defect. It resolves automatically in production (open internet). No
application/runtime JavaScript errors were thrown on any page.

## Buttons & links

- ✅ Every navigation item routes correctly (Home, Books, Publishing, Artistry, Media, Connect) via client-side routing with real URLs + browser back/forward support.
- ✅ All in-page CTAs are real `<button>`/`<a>` elements (23–30 per page). No dead `href="#"` placeholders found.
- ✅ Only **3** outbound href targets exist site-wide, all valid:
  - `https://www.amazon.com/s?k=Young+Gs+vs+Old+Gs+OG+Tom+Tom` — the buy fallback (auto-upgrades to the real product page when ASIN URLs are set; see Asset Replacement Report)
  - `mailto:info@tbfentertainment.art`
  - `mailto:media@tbfentertainment.art`
- ✅ External links use `target="_blank"` + `rel="noopener noreferrer"`.

## Forms

- ✅ Newsletter / early-access capture, contact form, "Join the Movement", and Street Team forms all submit through `submitLead()`.
- ✅ Graceful fallback: with `FORM_ENDPOINT` unset, forms open a pre-filled email to the correct routing address (info@ / media@ / submissions@) so **no lead is lost**. Set `FORM_ENDPOINT` (Formspree) to automate capture — one-line change documented in `docs/LAUNCH_OPS.md`.

## Responsiveness

- ✅ Desktop (1440), tablet (820), mobile (390) all verified by screenshot. Nav collapses to a burger menu on mobile; hero, cover, grids, and forms reflow correctly (the Young G's page uses mobile-first grids that split at ≥768px).

## Performance / optimization

- ✅ JS 243 kB (66.8 kB gzip), CSS 19.4 kB (4.5 kB gzip) — light single-page bundle.
- ✅ Fonts preconnected + `display=swap`.
- ⚠️ `logo.png` (1.3 MB) and `book-cover.png` (2.6 MB) are large PNGs. Recommend compressing to WebP/optimized PNG before/at launch (see Remaining Issues). Not blocking.

## Verdict

**Functional QA: PASS.** No broken links, no broken images, no runtime errors. The only launch-blocking items are asset binaries (final cover, author photo) covered in the Asset Replacement Report.
