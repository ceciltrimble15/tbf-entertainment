# ISBN Tracking

One ISBN per **format** per **edition**. An eBook and a paperback of the same book need **different** ISBNs. This is the registry of record — mirror it in the Airtable **ISBNs** table.

## How TBF gets ISBNs

Two paths — pick one and be consistent:

1. **Free KDP-assigned ISBN** — Amazon gives a free ISBN at publish time, but it lists **"Independently published"** as the publisher and is **locked to Amazon/KDP**. Fine for eBook-only or Amazon-only.
2. **Owned ISBN (recommended for the brand)** — buy from **Bowker / MyIdentifiers.com** (US) so the imprint reads **"TBF Entertainment Publishing"** and the ISBN works across KDP, IngramSpark, and bookstores. Buy a 10-pack (~$295) — cheaper per unit and you'll need them for the series.

> For a professional, multi-channel launch (KDP **+** IngramSpark **+** indie bookstores), use **owned Bowker ISBNs**. KDP-free ISBNs cannot be used on IngramSpark.

## Registry — _Young G's vs. Old G's: The Takeover_

| Format | ISBN-13 | Imprint | Source | Distributor | Status | Assigned date |
| --- | --- | --- | --- | --- | --- | --- |
| Paperback (6×9) | `___-_-_____-___-_` | TBF Entertainment Publishing | Bowker | KDP + IngramSpark | ☐ Not yet assigned | |
| eBook (Kindle) | (Kindle uses ASIN — ISBN optional) | TBF Entertainment Publishing | Bowker / none | Kindle + Draft2Digital | ☐ Optional | |
| Hardcover (future) | — | — | — | — | ☐ Not planned for Book 1 | |

### Notes
- **Kindle does not require an ISBN** — Amazon assigns an **ASIN**. Record the ASIN in `Titles` → `KDP ASIN`. Only assign an eBook ISBN if distributing the eBook through Draft2Digital/Apple/Kobo and they require one.
- Record the **ASIN** here once live for cross-reference:

| Format | ASIN | Amazon URL |
| --- | --- | --- |
| Kindle eBook | `__________` | |
| Paperback | `__________` | |

### Series ISBN ledger (track the 10-pack)

| ISBN-13 | Assigned to | Format | Date |
| --- | --- | --- | --- |
| `_____` | Young G's vs. Old G's Bk1 | Paperback | |
| `_____` | (unassigned) | | |
| `_____` | (unassigned) | | |

Fill these as you buy/assign. Never reuse an ISBN across titles or formats.
