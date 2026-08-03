# Remaining Issues — TBF Entertainment Launch

**Date:** 2026-06-25

Ordered by priority. Nothing here is an engineering blocker — these need
content, credentials, or a decision.

## 1. Image binaries (BLOCKING for visual launch) ⚠️
The final cover and author photo arrived as chat images, which can't be saved
to disk as files, and aren't in the connected Drive. Wiring is complete; drop
the files in (see `04-ASSET-REPLACEMENT-REPORT.md`):
- `public/book-cover.png` ← final cover (currently old "Takeover" art)
- `public/author-tomtom.jpg` ← author photo
- `docs/media-kit/assets/YoungGs-3D-mockup.png` ← 3D mockup

## 2. Title naming decision — RESOLVED ✅
Confirmed spelling: **Young G's vs. O.G.'s**, subtitle **Book One: The
Prefix**. Applied to all title displays (headings, hero title, alt text,
catalog cards, metadata, JSON-LD, media kit). In-story faction prose
("Young Gs came up…", "Old Gs built an empire", the VS columns) is left
as-is on purpose, since those read as faction names and match the cover art
("YOUNG GS / OLD GS"). Note for the cover/asset team: the approved cover art
still reads "OLD GS" — confirm whether the printed cover should be updated to
"O.G.'S" to match the title, or whether the cover wording stays.

## 3. Live Amazon URLs ⚠️
Set `AMAZON_PAPERBACK_URL` and `AMAZON_KINDLE_URL` in `src/App.jsx` once the
KDP listing is live. Until then buttons use an Amazon search fallback.

## 4. Form endpoint ⚠️
Set `FORM_ENDPOINT` (Formspree) in `src/App.jsx` to auto-capture leads.
Currently forms fall back to a pre-filled email (no lead lost, but manual).

## 5. Social cache re-scrape ⚠️
After the final cover deploys, re-scrape the homepage URL in the Facebook,
X, and LinkedIn debuggers so the new cover replaces any cached image.

## 6. Image optimization 🟢
`logo.png` (1.3 MB) and `book-cover.png` (2.6 MB) are heavy. Compress to
WebP/optimized PNG for faster loads and better Core Web Vitals. Not blocking.

## 7. Footer social links 🟢
Footer shows IG / X / YT chips without `href`s. Wire real profile URLs when
the accounts exist.

## 8. Optional SEO files 🟢
Add `sitemap.xml` + `robots.txt` and analytics post-launch.

## Environment note (not a bug)
QA logged one `ERR_CONNECTION_CLOSED` per page — that is Google Fonts blocked
by the QA sandbox network, not a site defect. It resolves on the open
internet in production.
