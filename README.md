# USCIS Case Tracker (Unofficial)

A single-page, browser-only viewer for USCIS case data. Paste the JSON from
your own USCIS online account and get:

- an event timeline with plain-language explanations of NIEM v5.0 event codes
- a case overview with days-since-filing, flags, and official notices
- a journey-style progress tracker (Filed → Receipt → Checks → Interview → Decision)
- warnings for backdated event entries
- all timestamps converted from UTC to your local timezone

**Everything runs locally in your browser.** The page makes no network
requests with your data; nothing is uploaded, logged, or stored. This is
enforced by the page's Content-Security-Policy (`connect-src 'none'`,
`form-action 'none'`), so the browser itself refuses any attempt to
transmit data.

Fonts are self-hosted, so the page contacts **no third party at all** —
no CDN, no analytics, no font service. The CSP permits only this origin.
Pasted input is HTML-escaped before it reaches the DOM.

## Usage

Open `index.html` (or serve the folder with any static file server). Sign in
to your USCIS account, open
`https://my.uscis.gov/account/case-service/api/cases/<your-receipt-number>`
in another tab, copy the JSON, paste it into the tracker, and click
**Analyze Case**. A fake but realistic example lives in `sample-case.json`.

## Disclaimer

This is an unofficial, independent tool with no affiliation to USCIS, DHS, or
any government agency. Event-code explanations are informal interpretations of
the public [NIEM v5.0 schema](https://niem.github.io/model/5.0/scr/BenefitDocumentStatusCategoryCodeSimpleType/)
and are not legal advice. See the disclaimer on the page itself.

## License

Code: MIT — see [LICENSE](LICENSE).

Fonts: DM Sans, DM Serif Display and DM Mono are redistributed in `fonts/`
under the SIL Open Font License 1.1 — see [fonts/OFL.txt](fonts/OFL.txt).
