# SEO Report — TBF Entertainment

**Date:** 2026-06-25
**Scope:** `index.html` `<head>` (also baked into regenerated `standalone.html`).

## What changed

| Item | Before | After |
| --- | --- | --- |
| `<title>` | "TBF ENTERTAINMENT" | "TBF Entertainment — Young G's vs. Old G's: The Prefix by O.G. Tom Tom" |
| Meta description | Generic company line | Book-forward, keyword-rich description |
| Canonical | — (none) | `https://tbfentertainment.art/` |
| `og:image` | `/logo.png` (relative) | `https://tbfentertainment.art/book-cover.png` (absolute) |
| `og:url` / `og:site_name` | — | added |
| `og:title` / `og:description` | company copy | book + logline ("Two generations. One city…") |
| `twitter:image` | `/logo.png` | absolute cover URL |
| `twitter:image:alt` / `og:image:alt` | — | added |
| Structured data | — | JSON-LD `Organization` + `Book` graph |
| `author` / `publisher` / `keywords` meta | — | added |

## Social sharing

- ✅ **Sharing the homepage now shows the Young G's cover** (`og:image` + `twitter:image` → `book-cover.png`, `summary_large_image` card).
- ✅ Absolute URLs used so Facebook/X/LinkedIn/iMessage crawlers resolve the image (relative paths often fail in scrapers).
- ⚠️ The cover binary must be the final art (see Asset Replacement Report). Once replaced, **re-scrape** the URL in the platform debuggers (cache busts):
  - Facebook: https://developers.facebook.com/tools/debug/
  - X/Twitter: post-preview / card validator
  - LinkedIn: https://www.linkedin.com/post-inspector/

## Structured data

- ✅ `Organization` (TBF Entertainment, logo, email, description).
- ✅ `Book` (title "Young G's vs. Old G's: The Prefix", edition "Book One", author O.G. Tom Tom, publisher → org, genre, image, URL). Validate at https://validator.schema.org/ and Google Rich Results Test after deploy.

## Image metadata

- ✅ Descriptive `alt` text on cover and author images in-app; `og:image:alt` / `twitter:image:alt` in head; `og:image:width/height` hints (1200×1600 — adjust if final cover differs).

## Recommended post-launch

- Add `sitemap.xml` + `robots.txt` (small win; not blocking for a 7-route SPA).
- Set `AMAZON_*_URL` so the `Book` offer can later be enriched with price/availability `Offer` data.
- Compress cover/logo (faster crawl + better Core Web Vitals).

## Verdict

**SEO: launch-ready.** Metadata, canonical, social cards, and structured data are in place. Only action left is dropping in the final cover binary and re-scraping the social caches.
