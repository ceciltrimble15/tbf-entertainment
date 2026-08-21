# TBF Entertainment — Website Launch and A2P Compliance Patch

Status: Preview only. Do not merge or deploy to Production without CEO approval.

## Public pages

- `/privacy` — TBF Entertainment Privacy Policy
- `/terms` — TBF Entertainment Terms and Conditions, including SMS program terms
- `/sms-updates` — dedicated, affirmative SMS opt-in page

All three pages are public, use the TBF visual system, work independently of the React application, and are linked from the website footer.

## Amazon sales path

The approved destination remains:

`https://www.amazon.com/dp/B0H962BXXC`

Approved button label:

`Buy on Amazon — $14.99`

Amazon handles checkout, payment, printing, fulfillment, shipping, returns, and transaction support.

## SMS opt-in design

The SMS Updates page collects:

- First name
- Last name
- U.S. mobile phone number
- Optional email
- Separate affirmative SMS-consent checkbox
- Consent language
- Consent timestamp
- Source URL
- Policy version
- Stable submission ID

The checkbox is unchecked by default. Signing up for SMS is separate from buying the book or submitting a general inquiry.

The page discloses:

- TBF Entertainment is the sender
- Recurring promotional and informational messages
- Up to 4 messages per month
- Message and data rates may apply
- Consent is not a condition of purchase
- Reply STOP to unsubscribe
- Reply HELP for assistance
- Links to Privacy Policy and Terms and Conditions

## Consent storage

`POST /api/sms-consent` validates the submission and writes affirmative consent evidence to the existing Airtable `Website Submissions` table.

Current mapping:

- `Name` — first and last name
- `Email` — optional email
- `Type` — `SMS Updates`
- `Message` — phone, consent status, timestamp, source, policy version, and exact consent language
- `How To Help` — `SMS opt-in request`
- `Source` — source URL plus consent and policy-version marker
- `Routed To` — `info@tbfentertainment.art`
- `Submitted` — consent timestamp
- `Submission ID` — stable hashed identifier for retry protection

The endpoint does not send any text message. It only records consent.

If Airtable rejects the new `SMS Updates` single-select value, add `SMS Updates` manually as an option in the `Type` field or confirm the Airtable token permits `typecast` behavior.

## SMS operational copy

### Opt-in confirmation

> TBF Entertainment: You are subscribed to recurring book-release, event, and promotional text updates, up to 4 messages per month. Message and data rates may apply. Reply STOP to opt out or HELP for help.

### Opt-out confirmation

> TBF Entertainment: You have been unsubscribed and will receive no further promotional text messages. Reply START to resubscribe.

### HELP response

> TBF Entertainment: For assistance, email info@tbfentertainment.art. Up to 4 messages per month. Message and data rates may apply. Reply STOP to opt out.

Do not activate or send these messages until the TBF Twilio brand/campaign is approved and the verified TBF number is assigned to the approved Messaging Service.

## Proposed A2P campaign packet

Campaign name: `TBF Entertainment Book and Event Updates`

Recommended use case: `Marketing`, subject to confirmation against the actual intended traffic.

Campaign description:

> TBF Entertainment sends recurring promotional and informational SMS messages to customers and supporters who explicitly opt in. Messages may include book-release announcements, author-event information, launch updates, TBF news, and occasional promotions. TBF sends up to four messages per month. Consent is not a condition of purchase, and recipients may reply STOP to unsubscribe or HELP for assistance.

Website opt-in flow:

> Users visit the public TBF Entertainment SMS Updates page, enter a valid mobile number, and affirmatively select a separate SMS-consent checkbox. The checkbox is unchecked by default and is not required to purchase a book, send a general inquiry, or use another website feature. The disclosure identifies TBF Entertainment, states message frequency, explains that message and data rates may apply, states that consent is not a condition of purchase, provides STOP and HELP instructions, and links to the public Privacy Policy and Terms and Conditions.

Sample message 1:

> TBF Entertainment: Young Gs vs Old Gs by O.G. Tom Tom is available now for $14.99. Buy on Amazon: https://www.amazon.com/dp/B0H962BXXC. Reply STOP to opt out or HELP for help.

Sample message 2:

> TBF Entertainment: New author events and book announcements are coming soon. Visit https://tbfentertainment.art for updates. Reply STOP to opt out or HELP for help.

## Preview test checklist

- [ ] Build succeeds
- [ ] `/privacy` loads without login
- [ ] `/terms` loads without login
- [ ] `/sms-updates` loads without login
- [ ] Footer links appear on the React website
- [ ] Buy buttons open the approved Amazon listing
- [ ] SMS checkbox is unchecked by default
- [ ] SMS page cannot submit without affirmative consent
- [ ] Valid test submission creates one Airtable row
- [ ] Duplicate retry does not create a second row
- [ ] Consent language, timestamp, source, and policy version are preserved
- [ ] No SMS is sent during testing
- [ ] Mobile layout passes
- [ ] Desktop layout passes
- [ ] Keyboard navigation and visible focus states pass
- [ ] No internal error, token, routing configuration, or vendor response is exposed

## Twilio operator verification still required

An authorized operator must inspect the company-controlled Twilio account and report:

- Exact TBF number
- SMS capability
- US local 10DLC status
- Messaging Service assignment
- Brand-registration status
- Campaign status
- Number-assignment status
- Advanced Opt-Out/default opt-out configuration
- Any rejection or correction message

No number, Campaign SID, or Messaging Service SID should be guessed or placed in public code.
