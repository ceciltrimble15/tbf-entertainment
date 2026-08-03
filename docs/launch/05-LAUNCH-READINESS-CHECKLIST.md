# Launch Readiness Checklist — Young G's vs. Old G's: The Prefix

**Date:** 2026-06-25 · **Publisher:** TBF Entertainment · **Author:** O.G. Tom Tom

Legend: ✅ done · ⚠️ needs a human input/file · ⬜ post-launch nice-to-have

## Code & site
- ✅ Production build passes (`npm run build`)
- ✅ Single-file build regenerated (`standalone.html`)
- ✅ All 7 routes return 200 and render (QA verified)
- ✅ No broken links / images / runtime errors
- ✅ Mobile / tablet / desktop responsive
- ✅ Title corrected to "The Prefix" everywhere
- ✅ Silver/blue master logo used everywhere incl. favicon

## Branding & content
- ✅ One source of truth for title/author/publisher/cover/logo
- ✅ Author section: bio + publisher bio + coming-soon
- ✅ Media kit folder (`docs/media-kit/`) with text + asset export script

## SEO
- ✅ Title, description, canonical, OG, Twitter cards, JSON-LD
- ✅ Homepage share image = the cover
- ⚠️ Re-scrape social caches **after** final cover is deployed

## Commerce
- ✅ Buy buttons wired to central `AMAZON_PAPERBACK_URL` / `AMAZON_KINDLE_URL`
- ✅ No hardcoded temporary product URLs; safe search fallback until live
- ⚠️ Paste live Amazon paperback + Kindle URLs when KDP listing is live

## Lead capture
- ✅ All forms submit (email fallback guarantees no lost lead)
- ⚠️ Set `FORM_ENDPOINT` (Formspree) to automate capture — `docs/LAUNCH_OPS.md`

## Assets (image binaries — human supplied)
- ⚠️ Replace `public/book-cover.png` with the final approved cover
- ⚠️ Add `public/author-tomtom.jpg` (author photo)
- ⚠️ Add `docs/media-kit/assets/YoungGs-3D-mockup.png`

## Post-launch (optional)
- ⬜ Compress logo/cover PNGs (WebP) for speed
- ⬜ `sitemap.xml` + `robots.txt`
- ⬜ Wire social profile links (IG / X / YT placeholders in footer)
- ⬜ Analytics (e.g. Plausible/GA)

## Go / No-Go

**GO for code deploy now.** The site is functionally launch-ready. Flip to
full public launch once the ⚠️ items (final cover, author photo, live Amazon
URLs, Formspree endpoint) are filled in — none require further engineering,
only content/credentials.
