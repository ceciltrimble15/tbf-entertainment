# Google Workspace Setup — tbfentertainment.art

Goal: a professional `@tbfentertainment.art` inbox + shared Drive so the brand sends/receives mail from its own domain (the site already links `info@tbfentertainment.art`).

> Workspace **Business Starter** (~$6/user/mo) is enough. A cheaper alternative is email-only hosting (e.g. domain registrar's mailbox), but Workspace also gives you Drive/Docs for manuscripts and assets.

## 1. Account + domain

- [ ] Sign up at **workspace.google.com** → "Get started".
- [ ] Business name: **TBF Entertainment**.
- [ ] Use existing domain: **tbfentertainment.art** (already owned — it's in the site footer).
- [ ] Create admin user: `info@tbfentertainment.art` (or `cecil@tbfentertainment.art` as admin, `info@` as alias/group).

## 2. Verify domain + turn on mail (DNS)

In your domain registrar's DNS panel:

- [ ] Add the **TXT verification** record Google gives you → verify.
- [ ] Add Google **MX records** (Workspace shows the current set — typically a single `smtp.google.com` MX now). Remove any old/registrar default MX records.
- [ ] Add **SPF** (TXT): `v=spf1 include:_spf.google.com ~all`
- [ ] Turn on **DKIM** (Admin console → Apps → Google Workspace → Gmail → Authenticate email) → add the generated TXT record.
- [ ] Add **DMARC** (TXT, host `_dmarc`): `v=DMARC1; p=none; rua=mailto:info@tbfentertainment.art` (start at `p=none`, tighten to `quarantine` later).

> SPF + DKIM + DMARC = your launch emails (and Formspree notifications) don't land in spam. Don't skip these.

## 3. Addresses to create

- [ ] `info@tbfentertainment.art` — primary / catch-all for the website.
- [ ] `publishing@tbfentertainment.art` — submissions & distribution (alias or group).
- [ ] `press@tbfentertainment.art` — media/PR (alias).
- [ ] Optional group/alias forwarding so all land in one inbox at launch.

## 4. Drive structure (assets the launch needs)

Create a shared Drive **"TBF Publishing"**:

- [ ] `/Manuscripts/Young Gs vs Old Gs/` — final manuscript + interior files.
- [ ] `/Covers/` — `book-cover.png` master, print-res PDF, ebook JPG.
- [ ] `/KDP/` — interior PDF, cover PDF, metadata sheet.
- [ ] `/Marketing/` — quotes, excerpts, social graphics, ARC PDF.
- [ ] `/Admin/` — ISBN receipts, Bowker login notes, royalty reports.

## 5. Connect the website + tools

- [ ] Point Formspree notifications to `info@tbfentertainment.art` (see `LAUNCH_OPS.md`).
- [ ] Add `info@` as the sender identity in any email tool (Mailchimp/Beehiiv) for the launch list.
- [ ] Send a test email in/out to confirm delivery before announcing.

## Done when
- [ ] You can email **from** and **to** `info@tbfentertainment.art`.
- [ ] A test message to the address is **not** flagged as spam (SPF/DKIM/DMARC pass — check via mail-tester.com).
