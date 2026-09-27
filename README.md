# N-400 Journey (Unofficial)

A browser-only companion for people navigating their N-400 naturalization
case on their own: *"Check your case status. Prepare for your interview."*
The core journey is Submit → Track → Study → Practice → Interview →
Decision. It has two independent tools, joined by a hub page (`index.html`)
whose nav also includes an explicit Home link back to itself on every page.
The hub also carries an **N-400 Processing Trends** section — a single
filterable line chart (`data/n400-quarterly.js`, `js/n400-chart.js`) over
22 quarters of official USCIS N-400 data: Received, Approved, Denied,
Approval Rate (approved ÷ decided, computed client-side — more meaningful
than raw counts), Pending, and median Processing Time, switchable between
per-quarter and fiscal-year-cumulative views (Pending and Processing Time
have no cumulative form, so that toggle disables itself for them), and a
1/2/5-year or all-time range filter. X-axis labels land on a constant
calendar step (every quarter/half-year/year/two years, chosen from however
many quarters are in view) rather than an "evenly spaced by index" split,
which for 22 quarters actually produced irregular gaps and read as
confusing. Hovering, focusing, or tapping a point (a generously-sized
invisible hit target over a small visible dot, so it's a real touch target
on mobile) updates a live readout above the chart with the exact quarter
and value. Hand-built as inline SVG (no charting library, keeping the
zero-third-party-request policy), with a real `<table>` fallback for
screen readers and a client-side "Download data (CSV)" export of
whatever's currently plotted (metric, view, and range all included).
`case.html` carries a one-line teaser of the latest backlog/processing-time
figures linking back to the full chart. To refresh when USCIS publishes a
new quarter: re-pull the report from `N400_DATA_SOURCE_URL` in the data
file, append a row, and bump `N400_DATA_UPDATED`.

**Case Journey** (`case.html`) — paste the JSON from your own USCIS online
account and get:

- an event timeline with plain-language explanations of NIEM v5.0 event codes
- a case overview with days-since-filing, flags, and official notices
- a journey-style progress tracker (Filed → Receipt → Checks → Interview → Decision)
- warnings for backdated event entries
- all timestamps converted from UTC to your local timezone
- **"What's new since my last case update?"** — each analysis is compared
  against a small normalized snapshot saved from the previous one (see
  `js/case-history.js`), surfacing status changes, new milestones,
  rescheduled dates, and new event codes with a from → to view. The raw
  JSON is never stored, only the minimal fields needed to compare: receipt
  number, form type, a derived status label, key milestone dates, and the
  set of event codes seen. A small red dot marks an unreviewed change on
  the hub's Case Journey card and its "Track" journey-strip icon until you
  open "What's new," and "Clear saved status" removes it entirely.

**Learning Journey** (`quiz.html`, `study.html`, `progress.html`) — practice
the 128 official 2025 USCIS civics test questions (the question set that
applies to Form N-400 applications filed on or after October 20, 2025):

- **2025 Civics Test Simulation** (the primary mode): mirrors the real
  interview format — up to 20 questions drawn from the 128-question bank,
  stopping as soon as 12 correct is reached or is no longer reachable. Never
  claims to be the actual USCIS test or that the applicant "passed" it —
  results read "Practice threshold reached" or "Keep practicing," with the
  gap to 12 stated plainly and a direct path into the missed questions.
- Quick (10), Standard (20), Intensive (50) and Full (128) practice modes,
  plus a Daily Practice session and a Missed Questions round, as secondary
  ways to practice
- immediate feedback per question, with the official answer shown on a miss
- multiple-choice wrong answers are hand-curated per question (see
  `data/distractors.js`) rather than sampled randomly, so they stay
  genuinely plausible instead of guessable by elimination
- questions whose accepted answer depends on current officeholders show a
  small "CURRENT" indicator and a "verify before your interview" note
  rather than presenting the name as a fixed fact
- **Study Mode**: browse, search and bookmark all 128 questions and answers
  as a plain reference, no grading
- **My Progress**: questions practiced, accuracy, a practice streak,
  per-category mastery, the last Test Simulation result, and a "Needs
  review" count that opens those exact questions — all computed from local
  history, there is no server to compute it on. Mastery means answered
  correctly at least twice in a row after being seen at least twice, not
  just answered right once.

Question content lives in `data/questions.js`, kept separate from the UI so a
future USCIS update only touches one file. Five questions whose answer
changes over time (current President, Vice President, Chief Justice, party,
Speaker of the House) are flagged `dynamic: true` and hydrated at load time
from `data/current-officials.js` — the one file to edit when an office
changes hands — rather than hardcoded per question. Two more that USCIS
gives no fixed answer for at all (numbers 98 and 99 in the official list)
appear in Study Mode only. Three questions are answered differently
depending on where you live (your state's senator, governor, and capital)
and are labeled as such, with a rotating real example rather than a single
graded fact.

**Everything runs locally in your browser.** The page makes no network
requests with your data; nothing is uploaded, logged, or stored. This is
enforced by the page's Content-Security-Policy (`connect-src 'none'`,
`form-action 'none'`), so the browser itself refuses any attempt to
transmit data.

Fonts are self-hosted, so the page contacts **no third party at all** —
no CDN, no analytics, no font service. The CSP permits only this origin.
Pasted input is HTML-escaped before it reaches the DOM.

Both tools share this privacy model. Quiz progress and the minimal case
snapshot both live in `localStorage` on your device only, and the same
policy above covers every page.

## Usage

Open `index.html` (or serve the folder with any static file server) for the
hub page, which links to both journeys. For the case tracker, open
`case.html`, sign in to your USCIS account, open
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

## Hosting

Deployed on Cloudflare Workers (Static Assets), connected to this repo
for auto-deploy on push — [app.n400journey.workers.dev](https://app.n400journey.workers.dev/)
is the canonical URL. `_headers` sets response headers Cloudflare can't
infer on its own: `frame-ancestors 'none'` (a `<meta>` CSP can't express
that directive, so without this the site could otherwise be framed by
another origin), the usual `X-Content-Type-Options` / `X-Frame-Options` /
`Referrer-Policy` / `Permissions-Policy` baseline, and an explicit
`charset=utf-8` on HTML/CSS/JS/XML/robots.txt (Cloudflare's default
Content-Type for static assets omits it). See
[Cloudflare's `_headers` docs](https://developers.cloudflare.com/workers/static-assets/headers/).
The page's own Content-Security-Policy — the meta tag that blocks all
outbound connections — is unaffected either way; it's part of each HTML
file, not a server header, so it's identical on any static host.

## Disclaimer

This is an unofficial, independent tool with no affiliation to USCIS, DHS, or
any government agency. Event-code explanations are informal interpretations of
the public [NIEM v5.0 schema](https://niem.github.io/model/5.0/scr/BenefitDocumentStatusCategoryCodeSimpleType/)
and are not legal advice. See the "About N-400 Journey" section on
`case.html` for the full disclaimer — it's one section with a clearly
separated "Important" box, not a second redundant page.

## License

Code: MIT — see [LICENSE](LICENSE).

Fonts: DM Sans, DM Serif Display and DM Mono are redistributed in `fonts/`
under the SIL Open Font License 1.1 — see [fonts/OFL.txt](fonts/OFL.txt).
