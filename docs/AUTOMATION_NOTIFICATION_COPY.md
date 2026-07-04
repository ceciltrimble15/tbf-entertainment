# TBF Entertainment — Automation Notification Copy

Exact, ready-to-send message copy for the base automations. **Documentation only — nothing is built or sent.**
Pair this with `AUTOMATION_RECIPES.md` (which defines the triggers/actions); this file supplies the words each step sends.

> **Guardrails:** No automations built · No schema changes · Copy only.
> **Voice:** professional, direct, TBF-branded. Grounded — no manufactured hype, no exclamation spam.
> **Privacy:** SMS carries **no private customer data** (no names beyond first name, no phone/email/address, no purchase details). Internal alerts to Cecil use counts and first names only.

**Merge fields** (filled by the automation at send time):
`{BookTitle}` · `{Author}` · `{URL}` · `{ASIN}` · `{Price}` · `{FirstName}` · `{ReviewLink}` · `{n}` · `{Date}` · `{Platform}` · `{DashboardLink}` · `{TaskList}`
Brand constants: **TBF Entertainment Publishing** · site **tbfentertainment.art**.

---

## 1. Amazon Goes Live

### Email to Cecil
**Subject:** {BookTitle} is live on Amazon
```
Cecil,

{BookTitle} by {Author} is now live on Amazon.

Buy link: {URL}
ASIN: {ASIN}   ·   Paperback: {Price}

The base has been updated automatically:
• Book status set to Live
• Launch date recorded
• Amazon link + ASIN saved to the Book
• Amazon distribution row marked Live / Approved

Launch-day campaigns are staged and ready to send. Open the Launch Command Center to fire them:
{DashboardLink}

— TBF Entertainment Publishing
```

### SMS to Cecil
```
TBF: {BookTitle} is LIVE on Amazon. Link saved, book + distribution updated. Launch campaigns ready to send. {URL}
```

### Internal Airtable note (comment on the Book record)
```
✅ Went live on Amazon {Date}. Status→Live, Launch Date set, Amazon link + ASIN saved, Amazon distribution row marked Live/Approved. Source: Retail Links. Next: send launch-day text/social + update website buy link.
```

---

## 2. Review Request Reminder

*Sent to the buyer. Keep it personal and low-pressure; an honest review only.*

### Message to buyer (first ask)
```
Hi {FirstName} — thanks for picking up {BookTitle}. Hope you're enjoying it.

When you have a minute, an honest review on Amazon would mean a lot and helps other readers find the book:
{ReviewLink}

Appreciate your support.
— TBF Entertainment Publishing
```

### Follow-up reminder (second nudge, ~5 days later)
```
Hi {FirstName} — just circling back on {BookTitle}. If you finished it, a quick, honest review on Amazon really helps:
{ReviewLink}

No rush, and thank you either way.
— TBF Entertainment Publishing
```

### Final polite reminder (last touch)
```
Hi {FirstName} — last note from us on this. If you get a chance to leave an honest review of {BookTitle}, here's the link:
{ReviewLink}

Either way, thank you for supporting the work.
— TBF Entertainment Publishing
```

---

## 3. Daily Launch Task Digest

### Morning CEO email
**Subject:** TBF launch — {Date}: {n} due, {n} overdue
```
Good morning, Cecil.

Here's where the launch stands today.

🔴 Overdue ({n})
{TaskList — Task — was due {Date} [Priority]}

🟡 Due today ({n})
{TaskList — Task [Priority]}

⏳ Waiting on CEO ({n})
{TaskList — Task}

⛔ Blocked ({n})
{TaskList — Task — {Blocker}}

Full board: {DashboardLink}

— TBF Ops
```
*All-clear variant:* `No tasks due, overdue, waiting, or blocked today. — TBF Ops`

### Short SMS version
```
TBF {Date}: {n} overdue, {n} due today, {n} waiting on you, {n} blocked. Details in your inbox / dashboard.
```

---

## 4. CEO Approval Request

*Fires when a Wide Distribution platform (or other flagged item) needs Cecil's decision before proceeding.*

### Email format
**Subject:** Approval needed — {Platform} for {BookTitle}
```
Cecil,

{Platform} is ready for your decision before we proceed with {BookTitle}.

What's pending: {Platform} distribution — files and metadata are prepared; it needs your go-ahead to submit/publish.
Why it's gated: going wide (or enrolling exclusivity) is a CEO call, not an automatic step.

To approve: set Approval Status to "Approved" on the {Platform} row (or reply "approved").
To hold: leave it, or reply with questions.

Row: {DashboardLink}

— TBF Ops
```

### SMS format
```
TBF: {Platform} for {BookTitle} needs your approval before we proceed. Approve in the Distribution dashboard or reply "approved".
```

### Airtable comment format (on the distribution record)
```
⏳ Awaiting CEO approval to proceed with {Platform}. Files + metadata ready. Set Approval Status → Approved to release, or add a comment with any hold reason.
```

---

## 5. First 100 Sales Milestones

*Internal alerts to Cecil/team use counts only. The social prompts are drafts for a public post — review before posting.*

### 25 sales — alert
```
TBF: {BookTitle} just passed 25 copies sold. Momentum's real — good moment to post a milestone + thank supporters and push for reviews.
```
**Social post prompt (25):**
```
25 copies of {BookTitle} out in the world. 🙏 Thank you to everyone who grabbed one.
If you've read it, drop an honest review — it helps more than you know.
Not yet? {Price} on Amazon: {URL}
```

### 50 sales — alert
```
TBF: {BookTitle} hit 50 copies sold. Halfway to the first-100 goal. Post the milestone and lean into reviews + street team shares.
```
**Social post prompt (50):**
```
50 copies of {BookTitle}. We're halfway to 100 and just getting started.
Every copy and every review pushes this further. Get yours: {URL}
Already read it? Leave a review and tag us.
```

### 100 sales — alert
```
TBF: {BookTitle} crossed 100 copies sold. First-100 goal reached. Post the milestone, thank the movement by name where you can, and set the next target.
```
**Social post prompt (100):**
```
100 copies of {BookTitle}. 💯 That's the movement — thank you.
This is a real independent launch built by real readers. Next stop: the next hundred.
Haven't grabbed it yet? {URL}
```

---

## 6. Weekly TBF Launch Report

*One weekly rollup for Cecil. Three formats — use the one that fits the channel.*

### Email format
**Subject:** TBF weekly launch report — week of {Date}
```
Cecil,

Weekly launch report for {BookTitle} — week of {Date}.

SALES & REVIEWS
• Copies sold: {n} (this week: +{n})
• Reviews posted: {n} (target: 25)
• Review requests outstanding: {n}

DISTRIBUTION
• Platforms live: {n} of 8
• Awaiting your approval: {n}

MARKETING
• Posts published this week: {n}
• Campaigns active: {n}
• Street team active: {n}   ·   Outreach in progress: {n}

Full detail: {DashboardLink}

— TBF Ops
```

### Summary format (chat / Slack / one-glance)
```
TBF weekly — {BookTitle} ({Date})
Sold {n} (+{n}) · Reviews {n}/25 · Live on {n}/8 platforms · {n} awaiting approval · {n} posts this week · {n} campaigns active
```

### Action-items format
```
TBF — this week's actions ({Date})
1. Approve: {n} distribution platform(s) waiting on you
2. Reviews: chase {n} outstanding requests (goal 25, at {n})
3. Sales: {n} to next milestone
4. Content: {n} posts scheduled — confirm assets ready
5. Follow-ups: {n} buyers/outreach due this week
Open dashboard: {DashboardLink}
```

---

**Nothing in this document has been built or sent.** It is the copy library the automations in `AUTOMATION_RECIPES.md` will draw from once — and only once — you green-light building them.
