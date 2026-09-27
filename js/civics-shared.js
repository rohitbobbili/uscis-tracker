'use strict';
/* ═════════════════════════════════════════════════════════════
   CIVICS PRACTICE — shared engine
   Used by quiz.html, study.html and progress.html. Owns the
   localStorage schema, mastery/spaced-repetition scoring, and
   multiple-choice generation. Question content itself lives in
   data/questions.js, kept separate so USCIS updates only touch
   one file.
   ═════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// "(U.S.) Constitution" -> "U.S. Constitution" (optional-word notation).
// Numeric parens like "Twenty-seven (27)" are left alone; the count is
// part of the official answer, not an optional word.
function cleanAnswer(raw) {
  return String(raw).replace(/\(([A-Za-z][^)]*)\)/g, '$1').replace(/\s+/g, ' ').trim();
}

function announce(pageId, msg) {
  const el = $(pageId);
  if (el) el.textContent = msg;
}

/* ═════════════════════════════════════════════════════════════
   QUESTION POOL — filtering and the distractor engine
   ═════════════════════════════════════════════════════════════ */
/* ═════════════════════════════════════════════════════════════
   Fill in the "who holds this office right now" questions from
   CURRENT_OFFICIALS (data/current-officials.js) before anything
   else reads CIVICS_QUESTIONS. This is the only place that reads
   that file, so updating one office there is enough — nothing
   else needs to change.
   ═════════════════════════════════════════════════════════════ */
(function hydrateDynamicQuestions() {
  CIVICS_QUESTIONS.forEach(q => {
    if (!q.dynamic || !q.officialKey) return;
    const official = CURRENT_OFFICIALS[q.officialKey];
    if (!official) return;
    q.answers = q.dynamicField === 'party'
      ? [official.party]
      : [official.name, official.short].filter(Boolean);
  });
})();

const GRADED_QUESTIONS = CIVICS_QUESTIONS.filter(q => !q.studyOnly);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(arr, n) {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

// Flat pool of every official answer, tagged with its source question and
// category. Used only as a last-resort top-up when a curated distractor set
// (data/distractors.js) runs short for a multi-select question — the primary
// source of wrong choices is always the hand-written, question-specific set.
const ANSWER_POOL = (() => {
  const pool = [];
  const seen = new Set();
  GRADED_QUESTIONS.forEach(q => {
    if (q.variesByState) return; // "Answers will vary." isn't a usable distractor
    q.answers.forEach(raw => {
      const clean = cleanAnswer(raw);
      const key = clean.toLowerCase();
      if (seen.has(key + '|' + q.id)) return;
      seen.add(key + '|' + q.id);
      pool.push({ text: clean, category: q.category, qid: q.id });
    });
  });
  return pool;
})();

function topUpFromAnswerPool(q, picked, excludeSet, count) {
  const sameCategory = shuffle(ANSWER_POOL.filter(a => a.qid !== q.id && a.category === q.category));
  const rest = shuffle(ANSWER_POOL.filter(a => a.qid !== q.id));
  for (const list of [sameCategory, rest]) {
    for (const a of list) {
      if (picked.length >= count) return picked;
      const key = a.text.toLowerCase();
      if (excludeSet.has(key)) continue;
      excludeSet.add(key);
      picked.push(a.text);
    }
  }
  return picked;
}

// Curated, question-specific wrong answers from data/distractors.js — every
// set was hand-written for that exact question (see the file header there).
function curatedDistractorsFor(q, count, excludeTexts) {
  const excl = new Set(excludeTexts.map(t => t.toLowerCase()));
  const pool = (QUESTION_DISTRACTORS[q.id] || []).map(cleanAnswer);
  const picked = [];
  shuffle(pool).forEach(text => {
    if (picked.length >= count) return;
    const key = text.toLowerCase();
    if (excl.has(key)) return;
    excl.add(key);
    picked.push(text);
  });
  if (picked.length < count) topUpFromAnswerPool(q, picked, excl, count);
  return picked;
}

// Dynamic officeholder questions (28/29/40/47, plus their study-only
// duplicates 98/99) draw wrong choices from the other current officials in
// CURRENT_OFFICIALS — exactly the "real recognizable federal officials, one
// of them right" bar the quiz aims for, with no hardcoding per question.
function dynamicDistractorsFor(q) {
  if (q.dynamicField === 'party') {
    const otherMajor = CURRENT_OFFICIALS[q.officialKey].party === 'Republican' ? 'Democratic' : 'Republican';
    return [otherMajor, 'Independent', 'Libertarian'];
  }
  return Object.entries(CURRENT_OFFICIALS)
    .filter(([key]) => key !== q.officialKey)
    .map(([, official]) => official.name);
}

// The three "where you live" questions (Senator/Governor/state capital) have
// no single correct answer, so a real example is rotated in as the "correct"
// choice each time (see the on-question `note` for the caveat shown to the
// learner) with other real examples from the same pool as wrong choices.
function variesByStateChoices(q) {
  const pool = shuffle((VARIES_BY_STATE_EXAMPLES[q.id] || []).slice());
  const correct = pool[0];
  const wrong = pool.slice(1, 4);
  return { correct, wrong };
}

// Build the on-screen choice set for one question. Single-answer questions
// ("Name one...") become 4-way multiple choice. Questions that officially
// require more than one example ("Name two...", "Name three...") become a
// checkbox set: the required number of correct answers mixed with curated
// wrong ones written specifically for that question.
function buildChoices(q) {
  if (q.variesByState) {
    const { correct, wrong } = variesByStateChoices(q);
    return { type: 'single', options: shuffle([correct, ...wrong]), correct: [correct] };
  }
  if (q.needCount > 1) {
    const correct = sample(q.answers.map(cleanAnswer), q.needCount);
    const wrongCount = Math.max(6 - correct.length, 2);
    const wrong = curatedDistractorsFor(q, wrongCount, q.answers.map(cleanAnswer));
    return { type: 'multi', options: shuffle([...correct, ...wrong]), correct };
  }
  const correct = cleanAnswer(q.answers[0]);
  const wrong = q.dynamic
    ? dynamicDistractorsFor(q)
    : curatedDistractorsFor(q, 3, q.answers.map(cleanAnswer));
  return { type: 'single', options: shuffle([correct, ...wrong.slice(0, 3)]), correct: [correct] };
}

/* ═════════════════════════════════════════════════════════════
   PROGRESS STORAGE — one schema, read/written by all three pages
   ═════════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'uscis-civics-progress-v1';
const MAX_SESSIONS_KEPT = 60;

function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function defaultProgress() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalAnswered: 0,
    totalCorrect: 0,
    streakCurrent: 0,
    streakBest: 0,
    lastPracticeDate: null,
    sessions: [],
    questionStats: {}, // id -> {seen, correct, incorrect, streak, lastResult, lastSeenAt, bookmarked}
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) return defaultProgress();
    return { ...defaultProgress(), ...parsed, questionStats: parsed.questionStats || {} };
  } catch {
    return defaultProgress();
  }
}

function saveProgress(p) {
  p.updatedAt = new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
  catch { /* storage unavailable (private mode, full quota) — practice still works, just isn't saved */ }
  return p;
}

// A day with at least one practice session extends the streak; a skipped
// day resets it. Call once per finished session.
function touchStreak(p) {
  const today = todayStr();
  if (p.lastPracticeDate === today) return; // already counted today
  const yesterday = todayStr(new Date(Date.now() - 86400000));
  p.streakCurrent = (p.lastPracticeDate === yesterday) ? p.streakCurrent + 1 : 1;
  p.streakBest = Math.max(p.streakBest, p.streakCurrent);
  p.lastPracticeDate = today;
}

function statFor(p, qid) {
  return p.questionStats[qid] || { seen: 0, correct: 0, incorrect: 0, streak: 0, lastResult: null, lastSeenAt: null, bookmarked: false };
}

function recordAnswer(p, qid, wasCorrect) {
  const s = statFor(p, qid);
  s.seen += 1;
  s.lastSeenAt = new Date().toISOString();
  s.lastResult = wasCorrect ? 'correct' : 'incorrect';
  if (wasCorrect) { s.correct += 1; s.streak += 1; }
  else { s.incorrect += 1; s.streak = 0; }
  p.questionStats[qid] = s;
  p.totalAnswered += 1;
  if (wasCorrect) p.totalCorrect += 1;
}

function toggleBookmark(p, qid) {
  const s = statFor(p, qid);
  s.bookmarked = !s.bookmarked;
  p.questionStats[qid] = s;
  saveProgress(p);
  return s.bookmarked;
}

function recordSession(p, session) {
  p.sessions.push(session);
  if (p.sessions.length > MAX_SESSIONS_KEPT) p.sessions = p.sessions.slice(-MAX_SESSIONS_KEPT);
  touchStreak(p);
  saveProgress(p);
}

// 'new' — never attempted. 'learning' — attempted, not yet a clean streak.
// 'mastered' — answered correctly at least twice in a row after being seen
// at least twice. 'missed' — the most recent attempt was wrong.
function masteryOf(stat) {
  if (!stat || stat.seen === 0) return 'new';
  if (stat.lastResult === 'incorrect') return 'missed';
  if (stat.seen >= 2 && stat.streak >= 2) return 'mastered';
  return 'learning';
}

function masteryCounts(p) {
  const counts = { new: 0, learning: 0, mastered: 0, missed: 0 };
  GRADED_QUESTIONS.forEach(q => { counts[masteryOf(p.questionStats[q.id])]++; });
  return counts;
}

/* ═════════════════════════════════════════════════════════════
   SMART SELECTION — light spaced repetition, no external deps.
   Weight: never-seen and recently-missed questions come up more
   often; mastered questions still appear, just less often, so
   nothing already learned is dropped from rotation entirely.
   ═════════════════════════════════════════════════════════════ */
function weightFor(stat) {
  const m = masteryOf(stat);
  if (m === 'new') return 10;
  if (m === 'missed') return 12;
  if (m === 'learning') return 6;
  return 2; // mastered
}

function weightedSample(pool, count, progress) {
  const bag = pool.map(q => ({ q, w: weightFor(progress.questionStats[q.id]) }));
  const picked = [];
  const n = Math.min(count, bag.length);
  for (let i = 0; i < n; i++) {
    const total = bag.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < bag.length; idx++) { r -= bag[idx].w; if (r <= 0) break; }
    idx = Math.min(idx, bag.length - 1);
    picked.push(bag[idx].q);
    bag.splice(idx, 1);
  }
  return picked;
}

function pickPracticeSet(mode, progress) {
  switch (mode) {
    case 'quick':     return weightedSample(GRADED_QUESTIONS, 10, progress);
    case 'standard':  return weightedSample(GRADED_QUESTIONS, 20, progress);
    case 'intensive': return weightedSample(GRADED_QUESTIONS, 50, progress);
    case 'full':      return shuffle(GRADED_QUESTIONS);
    case 'daily':     return weightedSample(GRADED_QUESTIONS, 10, progress);
    case 'missed': {
      const missed = GRADED_QUESTIONS.filter(q => masteryOf(progress.questionStats[q.id]) === 'missed');
      return shuffle(missed);
    }
    default: return weightedSample(GRADED_QUESTIONS, 10, progress);
  }
}

/* ═════════════════════════════════════════════════════════════
   CONFETTI — reserved for real milestones, not every answer.
   Plain DOM + CSS, no canvas/library. No-op under reduced motion.
   ═════════════════════════════════════════════════════════════ */
function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#b22234', '#ffffff', '#3c3b6e', '#d4a843'];
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.4) + 's';
    p.style.animationDuration = (2.2 + Math.random() * 1.1) + 's';
    p.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    p.style.setProperty('--spin', (Math.random() * 540 - 270) + 'deg');
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 3600);
}

/* ═════════════════════════════════════════════════════════════
   ICONS — small hand-drawn line icons, matching the site's
   existing stroke-based artwork (flag banner, statue). Kept as
   plain strings rather than a dependency, per the page's zero-
   third-party-request policy.
   ═════════════════════════════════════════════════════════════ */
const ICONS = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1Z"/></svg>',
  bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1Z"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4.4 0 7-2.7 7-6.7 0-3-1.8-4.9-3-6.6.2 2-1 3-1.8 3-1 0-1.7-1-1.5-2.5.3-2.2-.7-4.2-2.7-5.4.4 2 -.5 3.7-2 5.3C6.3 11 5 12.9 5 15.3 5 19.3 7.6 22 12 22Z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7Z"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7Z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5"/><path d="M12 14v4M9 21h6M9.5 18h5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.5 15a8 8 0 0 0 13.9 2.9M18.5 9A8 8 0 0 0 4.6 6.1"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l5-5 3 3 6-7"/><path d="M14 7h4v4"/></svg>',
  empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>',
};

/* ═════════════════════════════════════════════════════════════
   CROSS-PAGE HANDOFF — Study Mode can send a specific set of
   question ids to quiz.html without a server: sessionStorage,
   consumed once on load.
   ═════════════════════════════════════════════════════════════ */
const PRACTICE_REQUEST_KEY = 'civics-practice-request';

function requestPractice(ids) {
  try { sessionStorage.setItem(PRACTICE_REQUEST_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
  location.href = 'quiz.html';
}

function consumePracticeRequest() {
  try {
    const raw = sessionStorage.getItem(PRACTICE_REQUEST_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PRACTICE_REQUEST_KEY);
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids) || !ids.length) return null;
    return CIVICS_QUESTIONS.filter(q => ids.includes(q.id));
  } catch { return null; }
}

/* ═════════════════════════════════════════════════════════════
   2025 CIVICS TEST — official parameters. Change these three
   lines if USCIS revises the test format; nothing else in the
   app hardcodes these numbers.
   ═════════════════════════════════════════════════════════════ */
const TEST_FILED_ON_OR_AFTER = 'October 20, 2025';
const TEST_MAX_QUESTIONS = 20;
const TEST_PASSING_THRESHOLD = 12;
const USCIS_TEST_UPDATES_URL = 'https://www.uscis.gov/citizenship/testupdates';
const USCIS_2025_TEST_PDF_URL = 'https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf';

/* ═════════════════════════════════════════════════════════════
   TEST SIMULATION — mirrors the real interview format: up to 20
   questions, stop as soon as 12 correct is reached (or as soon as
   12 is mathematically out of reach), no per-question grading UI.
   ═════════════════════════════════════════════════════════════ */

// Can the applicant still reach the passing threshold given what's left?
function simulationStillWinnable(correct, asked) {
  const remaining = TEST_MAX_QUESTIONS - asked;
  return correct + remaining >= TEST_PASSING_THRESHOLD;
}

function simulationOutcome(correct, asked) {
  if (correct >= TEST_PASSING_THRESHOLD) return 'reached';
  if (asked >= TEST_MAX_QUESTIONS) return 'ended';
  if (!simulationStillWinnable(correct, asked)) return 'unreachable';
  return 'continue';
}

function pickSimulationSet() {
  return shuffle(GRADED_QUESTIONS).slice(0, TEST_MAX_QUESTIONS);
}
