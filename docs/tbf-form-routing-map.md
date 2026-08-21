# TBF Entertainment — Form Routing Map

Authoritative routing lives in `api/submit.js` (`TBF_BRAND.routes`). The server re-validates every type; the client cannot override the destination.

## Inquiry type → inbox
| Submission type | Routed inbox | Source form(s) |
| --- | --- | --- |
| General | info@tbfentertainment.art | Connect page (default) |
| Early Access | info@tbfentertainment.art | Home email-capture (compact) |
| Movement | info@tbfentertainment.art | `/young-gs` Join the Movement |
| Artistry | info@tbfentertainment.art | Connect page select |
| Media | media@tbfentertainment.art | Connect page select |
| Publishing | acquisitions@tbfentertainment.art | Connect page select |
| Partnership | acquisitions@tbfentertainment.art | Connect page select |
| Rights | rights@tbfentertainment.art | Connect page select |
| Street Team | submissions@tbfentertainment.art | `/young-gs` Street Team |

- **Reply-To** on every notification = the submitter's email, so staff can reply directly.
- **Unknown type →** rejected with HTTP 400 (`Unsupported submission type.`), never routed.
- Internal routing addresses are **not** exposed to visitors — the client-side error-recovery mailto always uses the public `info@` address only.

## Mailing-list (Brevo) eligibility
| Type | Added to Brevo list `TBF — Early Access / Launch` (id 3)? |
| --- | --- |
| Early Access | Yes — **only with consent** |
| Movement | Yes — **only with consent** |
| All other types | No |

- Consent is an explicit checkbox on the two eligible forms.
- Consent status (`yes`/`no`) and submission source are preserved in the Airtable `Source` field.

## Airtable record (system of record)
Base **TBF Entertainment Operations** (`app6TQ7oSVSJADxC4`) → table **`Website Submissions`**. Fields written: `Name`, `Email`, `Type`, `City`, `Message`, `How To Help`, `Source`, `Routed To`, `Submitted`, `Submission ID`.
