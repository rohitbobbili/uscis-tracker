# USCIS Case Tracker (Unofficial)

A browser-only site for people navigating USCIS on their own. It has two
independent tools:

**Case Tracker** (`index.html`) — paste the JSON from your own USCIS online
account and get:

- an event timeline with plain-language explanations of NIEM v5.0 event codes
- a case overview with days-since-filing, flags, and official notices
- a journey-style progress tracker (Filed → Receipt → Checks → Interview → Decision)
- warnings for backdated event entries
- all timestamps converted from UTC to your local timezone

**Civics Practice** (`quiz.html`, `study.html`, `progress.html`) — practice
the 128 official USCIS naturalization civics questions:

- Quick (10), Standard (20), Intensive (50) and Full (128) practice modes,
  plus a Daily Practice session and a Missed Questions round
- immediate feedback per question, with the official answer shown on a miss
- **Study Mode**: browse, search and bookmark all 128 questions and answers
  as a plain reference, no grading
- **My Progress**: accuracy, a practice streak, and per-category mastery,
  computed from local history — there is no server to compute it on

Question content lives in `data/questions.js`, kept separate from the UI so a
future USCIS update only touches one file. Four questions whose answer
changes over time (current President, Vice President, party, Speaker of the
House) are flagged in the quiz; two more that USCIS gives no fixed answer for
at all (numbers 98 and 99 in the official list) appear in Study Mode only.
Three questions are answered differently depending on where you live (your
state's senator, governor, and capital) and are labeled as such rather than
graded as a single fact.

**Everything runs locally in your browser.** The page makes no network
requests with your data; nothing is uploaded, logged, or stored. This is
enforced by the page's Content-Security-Policy (`connect-src 'none'`,
`form-action 'none'`), so the browser itself refuses any attempt to
transmit data.

Fonts are self-hosted, so the page contacts **no third party at all** —
no CDN, no analytics, no font service. The CSP permits only this origin.
Pasted input is HTML-escaped before it reaches the DOM.

Both tools share this privacy model. Quiz progress lives in `localStorage`
on your device only, and the same policy above covers every page.

## Usage

Open `index.html` (or serve the folder with any static file server) for the
case tracker. Sign in to your USCIS account, open
`https://my.uscis.gov/account/case-service/api/cases/<your-receipt-number>`
in another tab, copy the JSON, paste it into the tracker, and click
**Analyze Case**. A fake but realistic example lives in `sample-case.json`.

Open `quiz.html` for civics practice — no setup, no data of yours required.

## Development

Every page loads its CSS/JS with a `?v=N` cache-busting query. Run
`./bump-assets.sh` after changing **any** CSS, JS or data file — it scans
every `*.html` file, bumps every asset reference to one new shared version
number, and fails loudly if the counts don't match (a silent version
mismatch across pages caused a live bug once; see git history).

## Disclaimer

This is an unofficial, independent tool with no affiliation to USCIS, DHS, or
any government agency. Event-code explanations are informal interpretations of
the public [NIEM v5.0 schema](https://niem.github.io/model/5.0/scr/BenefitDocumentStatusCategoryCodeSimpleType/)
and are not legal advice. See the disclaimer on the page itself.

## License

Code: MIT — see [LICENSE](LICENSE).

Fonts: DM Sans, DM Serif Display and DM Mono are redistributed in `fonts/`
under the SIL Open Font License 1.1 — see [fonts/OFL.txt](fonts/OFL.txt).
