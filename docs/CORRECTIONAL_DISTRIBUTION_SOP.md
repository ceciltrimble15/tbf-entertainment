# Correctional Distribution SOP

The correctional lane is not one upload button. It is a controlled sales pipeline with policy
intelligence attached, and every facility is a separate institutional account with its own
rules.

**The honest frame.** No system can guarantee placement. Every facility applies its own
security and mail rules, and some TBF street-lit titles will be rejected by some facilities.
That does not kill the strategy — it means eligibility is decided title by title *and*
facility by facility, decisions get tracked, and universal acceptance is never promised to
anyone. Reentry and personal-development titles are the strongest institutional catalog.

---

## The four routes in

| Route | How it works | Where it fits |
| --- | --- | --- |
| **Direct-to-person** | A customer orders from Amazon or TBF Direct and the new book ships to the facility for a named person | Fastest revenue path; needs no institutional relationship |
| **Facility library or program** | Pitch the librarian, education coordinator, chaplain, reentry staff or program director for review and bulk purchase | Best institutional path |
| **Approved vendor** | Qualify with book vendors, commissary suppliers or facility procurement | Scale path; longest lead time |
| **Sponsored placement** | A donor or organisation funds approved copies for a program or library | Community and impact path |

Record the route on every `Institutional Outreach` record. Conversion is tracked by route,
not in aggregate — the four have completely different economics.

---

## Eligibility review

Rated on `Editions → Correctional Rating`. Rate the **edition**, because a correctional
edition may differ materially from the trade edition.

**Green** — personal growth, reentry, entrepreneurship, family, motivation, or clean fiction
with no obviously restricted content. Build the institutional target batch.

**Yellow** — street-lit themes, crime references, violence, sexual content, gang imagery,
weapons, drugs or hand signs. Facility-by-facility review required. Pitch it, but never
promise acceptance, and log every rejection as intelligence.

**Red** — content that instructs criminal activity, escape, weapon or drug production, coded
communication, or other clearly excluded material. No correctional marketing without legal
and content review.

**Never disguise prison-sensitive content.** If TBF creates a correctional edition, it is a
real, disclosed edition with its own files, its own metadata and — when the changes are
material — its own ISBN. Repackaging the same book to slip past screening is not a strategy;
it is how a publisher gets permanently barred from a system.

---

## Facility verification checklist

Every field below goes on the `Facilities` record or its linked `Facility Policies` record.
The policy record is evidence: it holds the source URL and the governing sentences **quoted
verbatim**, not paraphrased.

1. Facility name, system, security level, and the official policy URL.
2. Books allowed: paperback or hardcover, new only, thickness, quantity, image and content
   restrictions.
3. Allowed sender: publisher, bookstore, approved vendor, Amazon, or a specific supplier.
4. Exact address format, the resident or inmate identifier, and package labelling rules.
5. Institutional contacts: librarian, education, chaplaincy, reentry, procurement, mailroom.
6. Review-copy process, vendor registration, W-9 and tax requirements, purchasing method.
7. Rejection notice handling: reason, return status, appeal deadline, next action.

**Read the policy at source.** Set `Checked Date` only on the day you actually read the
official page. Copying a previous note forward is not verification, and the 90-day freshness
clock exists precisely because facility policies change without notice.

---

## Ohio starting rules

These are the starting points for research, **not** substitutes for it. Re-verify before
every campaign.

- **Ohio Administrative Code 5120-9-19** governs Ohio DRC state institutions. Printed material
  is permitted in reasonable quantities subject to institutional inspection and security
  review, and is generally required to come directly from a publisher or distributor. One
  reading covers every Ohio DRC institution, which makes it the highest-leverage research
  task in the queue.
- **Hamilton County Justice Center** (Cincinnati, the P1 target) is a county jail and applies
  its own rules, not the DRC's. The playbook records that it requires books from a book
  vendor, limits residents to three books per month, requires the JMS number, and publishes
  content and physical restrictions. **This has not been verified at source.** The seeded
  Facility Policy record is deliberately marked "Could not verify" with no checked date, so
  the freshness formula reads as never-verified and any correctional order against it is
  held. Clearing that record is the operator's task.
- **28 CFR Part 540, Subpart F** governs federal BOP institutions and specifies when
  publications must come from a publisher, book club or bookstore, subject to security review.

County jails, state prisons and federal institutions are three different regimes. Never copy
a rule from one to another.

---

## Before any correctional shipment

`Orders & Shipments → Ship Clearance` holds the order until all four are true:

1. Recipient ID verified — the actual inmate, JMS or resident number, not a name alone.
2. Address format verified — matching the facility's exact required block.
3. Facility policy confirmed current — a verified policy record inside 90 days.
4. Quantity limit respected — checked against this recipient's period allowance.

The sender type must also match the facility's allowed-sender rule. Shipping publisher-direct
into a facility that only accepts approved book vendors gets the package returned and, worse,
teaches the mailroom that TBF does not follow rules.

---

## When a rejection happens

Log it in `Rejections & Returns` the same day. Quote the stated reason verbatim, attach the
notice, and record the appeal deadline — `Appeal Countdown` runs from it, and a missed
deadline forfeits the title at that facility.

Then answer one question honestly: **was it avoidable?** A rejection caused by shipping from
the wrong sender type, or against a stale policy, is a process failure and the SOP changes.
A rejection on facility discretion over content is intelligence — record it, and let it shape
which titles get pitched where next time.
