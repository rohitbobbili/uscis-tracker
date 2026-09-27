'use strict';
/* ═════════════════════════════════════════════════════════════
   CURRENT OFFICIALS — the single place that names who currently
   holds an office USCIS civics questions ask about "now". Nothing
   else in this app hardcodes these names; every dynamic question
   (see the `dynamic` flag in data/questions.js) reads its answer
   and its multiple-choice distractors from this file at load time.

   TO UPDATE after an election, resignation, or appointment:
   change the `name` (and `party` on the president, if it changed)
   and bump `lastUpdated`. Nothing else needs to change — the quiz,
   Study Mode, and the distractor engine all read from here.

   Each entry was verified against an authoritative U.S. government
   source on the date below, not carried over from training data.
   ═════════════════════════════════════════════════════════════ */
const CURRENT_OFFICIALS = {
  president: {
    name: 'Donald J. Trump',
    short: 'Trump',
    party: 'Republican',
    lastUpdated: '2026-09-27',
    source: 'https://www.whitehouse.gov/administration/donald-j-trump/',
  },
  vicePresident: {
    name: 'JD Vance',
    short: 'Vance',
    lastUpdated: '2026-09-27',
    source: 'https://www.whitehouse.gov/administration/jd-vance/',
  },
  speakerOfHouse: {
    name: 'Mike Johnson',
    short: 'Johnson',
    lastUpdated: '2026-09-27',
    source: 'https://www.speaker.gov/',
  },
  chiefJustice: {
    name: 'John G. Roberts, Jr.',
    short: 'Roberts',
    lastUpdated: '2026-09-27',
    source: 'https://www.supremecourt.gov/about/biographies.aspx',
  },
};

// Every officeholder above, usable as a single pool of plausible people
// for distractors on ANY current-official question (a President question
// can use the Speaker and Chief Justice as wrong answers, and so on) —
// they're all real, current, nationally-recognizable federal officials,
// which is exactly the "same semantic category" the distractor engine
// needs for this question type.
const CURRENT_OFFICIALS_POOL = Object.values(CURRENT_OFFICIALS).map(o => o.name);
