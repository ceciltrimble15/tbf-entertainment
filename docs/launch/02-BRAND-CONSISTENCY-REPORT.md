# Brand Consistency Report — TBF Entertainment

**Date:** 2026-06-25

## Source of truth established

| Element | Canonical value |
| --- | --- |
| Publisher | TBF Entertainment / TBF Entertainment Publishing |
| Master logo | `public/logo.png` — silver/blue TBF hat mark |
| Book title | Young G's vs. O.G.'s |
| Subtitle | **Book One: The Prefix** |
| Author | O.G. Tom Tom |
| Cover file | `public/book-cover.png` (one file, referenced everywhere) |
| Domain | tbfentertainment.art |
| Buy links | `AMAZON_PAPERBACK_URL` / `AMAZON_KINDLE_URL` constants in `src/App.jsx` |

## Logo

- ✅ The silver/blue TBF logo is the single logo asset (`/logo.png`) used in the nav, footer, hero watermark, section dividers, final CTA, **and** the favicon / apple-touch-icon. One source, used everywhere via the `<Logo>` component.
- ✅ No gold/placeholder TBF logo remains anywhere in the React app or HTML head.
- ✅ Media kit ships the same file as `assets/TBF-logo.png`.

## Title — "The Takeover" → "The Prefix"

- ✅ Replaced in **all** locations: homepage flagship, publishing page (featured + KDP campaign + synopsis), Young G's book page, Books catalog card, and image alt text.
- ✅ Replaced in docs: `LAUNCH_OPS.md`, `ISBN_TRACKING.md`, `AIRTABLE_PUBLISHING_TRACKER.md`, `KDP_LAUNCH_CHECKLIST.md`.
- ✅ Regenerated `standalone.html` — **0** remaining "Takeover" references in the entire project (verified by grep + headless body-text scan on every route).

## Cover

- ✅ Every cover render on the site references the single file `/book-cover.png` (homepage flagship + publishing anchor, publishing featured title, Young G's hero + spread, Books catalog). Replace that one file and the whole site updates.
- ⚠️ The binary currently on disk is still the old "The Takeover" art. The final approved cover must be dropped in (see Asset Replacement Report). All wiring is done.

## Author identity

- ✅ "O.G. Tom Tom" and "TBF Entertainment Publishing" used consistently as author/publisher across every page and the media kit.
- ✅ Author section rebuilt with bio + publisher bio + coming-soon. Author photo wired (`/author-tomtom.jpg`) with a branded fallback until the file is supplied.

## Contact / domain

- ✅ Consistent address scheme: `info@`, `media@`, `submissions@` `tbfentertainment.art`; domain shown as `tbfentertainment.art` throughout.

## Verdict

**Brand consistency: PASS** for everything controllable in code/text. Remaining items are image binaries only.
