#!/usr/bin/env bash
# Sync media-kit assets from the website's canonical /public files so the
# kit always matches the live site (single source of truth).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$here/../.."
mkdir -p "$here/assets"

cp "$root/public/logo.png"       "$here/assets/TBF-logo.png"
cp "$root/public/book-cover.png" "$here/assets/YoungGs-vs-OldGs-cover.png"

# Author photo is optional until supplied.
if [ -f "$root/public/author-tomtom.jpg" ]; then
  cp "$root/public/author-tomtom.jpg" "$here/assets/author-tomtom.jpg"
  echo "✓ author photo exported"
else
  echo "• author photo not present yet (public/author-tomtom.jpg) — skipped"
fi

echo "✓ media kit assets synced from /public"
