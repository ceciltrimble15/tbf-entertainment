# Asset Replacement Report — TBF Entertainment

**Date:** 2026-06-25

## Important constraint

The **final cover** and **author photo** were provided as images inside the
chat conversation, not as files. Chat-embedded images cannot be extracted to
disk as binaries, and they were not found in the connected Google Drive
(searched: only unrelated `yaep`/`a1-suppliers` logos exist there). So all
**wiring, text, and metadata** are complete, but **three image binaries must
be dropped in by hand**. Every reference already points at the right path —
replacing the file is all that's left.

## Status by asset

| Asset | Path | Status | Action |
| --- | --- | --- | --- |
| TBF master logo (silver/blue) | `public/logo.png` | ✅ Correct already | none — matches the approved master |
| Favicon / apple-touch-icon | uses `/logo.png` | ✅ Done | none |
| Book cover | `public/book-cover.png` | ⚠️ Old "Takeover" art on disk | **Replace with final cover PNG** (same filename) |
| Author photo | `public/author-tomtom.jpg` | ⛔ Not present | **Add file** (section auto-detects; falls back to branded plate until then) |
| 3D book mockup | `docs/media-kit/assets/YoungGs-3D-mockup.png` | ⛔ Not present | **Add file** for the media kit |
| OG / Twitter share image | `/book-cover.png` (absolute) | ✅ Wired | auto-correct once cover replaced |

## Code/text replacements completed

- ✅ Title "The Takeover" → "The Prefix" everywhere (app + docs + standalone).
- ✅ Cover references consolidated to a single file (`/book-cover.png`).
- ✅ Author section rebuilt (photo slot + bio + publisher bio + coming-soon).
- ✅ Amazon links centralized into `AMAZON_PAPERBACK_URL` / `AMAZON_KINDLE_URL` constants — **no hardcoded temporary product URLs** remain. Empty = safe search fallback; fill in to go live.
- ✅ SEO/OG/Twitter/JSON-LD updated to the cover + new title.
- ✅ Media kit folder created at `docs/media-kit/`.

## Drop-in instructions (for whoever has the final files)

```bash
# 1. Final cover (replaces old art — keep the filename)
cp /path/to/final-cover.png  public/book-cover.png

# 2. Author photo
cp /path/to/tom-tom.jpg      public/author-tomtom.jpg

# 3. 3D mockup (media kit only)
cp /path/to/mockup.png       docs/media-kit/assets/YoungGs-3D-mockup.png

# 4. Sync media kit + rebuild
./docs/media-kit/export-assets.sh
npm run build && npm run build:standalone

# 5. Deploy, then re-scrape social caches (FB/X/LinkedIn debuggers)
```

## Verdict

**Everything that can be done in code is done.** Launch is gated only on
supplying the 3 image binaries above as real files.
