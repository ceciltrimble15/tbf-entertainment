# TBF Entertainment — Rollback Plan

Goal: restore the last known-good production state fast, with no data loss.

## What "current production" is
- Production branch: **`main`**. Vercel auto-deploys `main` for `tbf-entertainment` → `www.tbfentertainment.art`.
- The communications backend ships in PR #3 (branch `claude/tbf-entertainment-launch-ojc062`). Until it is merged, production `main` does **not** contain `/api/submit`.

## Fastest rollback — Vercel Instant Rollback (no Git needed)
1. Vercel → Project `tbf-entertainment` → **Deployments**.
2. Find the last deployment marked **Ready** from before the change.
3. **⋯ → Promote to Production** (Instant Rollback).
4. Confirm `www.tbfentertainment.art` serves the prior build. Time: ~1–2 min.

This is the primary path if a deploy breaks the site.

## Git rollback (if the code itself must be reverted)
- Revert the merge commit on `main`:
  - `git revert -m 1 <merge_commit_sha>` → push to `main` → Vercel redeploys the reverted state.
- Or reset `main` to the prior known-good commit (force-push) **only with CEO approval**, since it rewrites shared history.
- Last known-good `main` before this work: **`59b1deb`** (PR #1 merge). Confirm the current SHA before acting — do not rely on a stale reference.

## Backend / vendor rollback
- **Disable the backend without a deploy:** in Vercel, remove or blank `AIRTABLE_TOKEN` + `BREVO_API_KEY`. `/api/submit` then returns 503 and forms show the safe error + manual-email recovery. No leads are silently lost.
- **Airtable bad data:** submissions are additive rows; delete test/erroneous rows in the `Website Submissions` table (production-record deletion requires CEO approval).
- **Brevo:** wrong subscribers can be removed from list id 3 in Brevo; the list is the consent record.

## Data safety during rollback
- Rolling back code does **not** touch Airtable rows or Brevo contacts already captured.
- Before any destructive step, export the `Website Submissions` table (CSV) and the Brevo list.

## Verify after rollback
- Load `https://www.tbfentertainment.art` and `/young-gs`.
- Confirm buy buttons open `https://www.amazon.com/dp/B0H962BXXC`.
- If the backend is intentionally disabled, confirm forms show the safe error, not a crash.
