'use strict';
/* ═════════════════════════════════════════════════════════════
   QUIZ PAGE — mode selection, live session, results, missed review
   ═════════════════════════════════════════════════════════════ */

const CAT_BADGE = {
  'Principles of Democracy': 'badge-blue',
  'System of Government': 'badge-purple',
  'Rights & Responsibilities': 'badge-gold',
  'Colonial Period & Independence': 'badge-orange',
  'The 1800s': 'badge-red',
  'Recent History': 'badge-green',
  'Geography': 'badge-blue',
  'Symbols': 'badge-gray',
  'Holidays': 'badge-gray',
};

const CORRECT_MSGS = [
  'Correct, nice work.',
  "That's right.",
  'Correct. Keep going.',
  'Right answer.',
];
const INCORRECT_MSGS = [
  "Not quite. Now you've learned this one.",
  'Not this one, here is the answer to remember.',
  'Close, but not the official answer.',
  "Almost. Remember this one for next round.",
];

let progress = loadProgress();
let state = null; // { mode, questions, idx, correct, incorrect, startedAt, results }

const MODE_LABEL = { quick: 'Quick Practice', standard: 'Standard Practice', intensive: 'Intensive Practice', full: 'Full Practice', daily: 'Daily Practice', missed: 'Missed Questions', simulation: 'Test Simulation' };

function showView(name) {
  ['modes', 'session', 'results'].forEach(v => {
    $('view-' + v).style.display = v === name ? '' : 'none';
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Mode selection ─────────────────────────────────────────── */
function daysAgoLabel(dateStr) {
  if (!dateStr) return null;
  const diff = Math.round((Date.now() - new Date(dateStr + 'T00:00:00')) / 86400000);
  if (diff <= 0) return 'Practiced today';
  if (diff === 1) return 'Practiced yesterday';
  return `Practiced ${diff} days ago`;
}

function renderModes() {
  $('simBankCount').textContent = CIVICS_QUESTIONS.length;

  const counts = masteryCounts(progress);
  const missedCard = $('mode-missed');
  const missedDisabled = counts.missed === 0;
  missedCard.disabled = missedDisabled;
  missedCard.setAttribute('aria-disabled', String(missedDisabled));
  $('mode-missed-desc').textContent = missedDisabled
    ? 'Nothing missed yet, keep practicing.'
    : `${counts.missed} question${counts.missed === 1 ? '' : 's'} to review.`;

  const dailyNote = daysAgoLabel(progress.lastPracticeDate);
  $('mode-daily-desc').textContent = dailyNote
    ? `${dailyNote}. A fresh 10, focused on what needs review.`
    : 'A fresh 10, focused on what needs review.';
}

/* ── Session ────────────────────────────────────────────────── */
function startQuiz(mode) {
  const questions = pickPracticeSet(mode, progress);
  if (!questions.length) return;
  state = { mode, questions, idx: 0, correct: 0, incorrect: 0, startedAt: Date.now(), results: [] };
  showView('session');
  renderQuestion();
}

function startSimulation() {
  const questions = pickSimulationSet();
  if (!questions.length) return;
  state = { mode: 'simulation', questions, idx: 0, correct: 0, incorrect: 0, startedAt: Date.now(), results: [] };
  showView('session');
  renderQuestion();
}

function startCustomSet(questions, label) {
  if (!questions.length) return;
  state = { mode: label, questions: shuffle(questions), idx: 0, correct: 0, incorrect: 0, startedAt: Date.now(), results: [] };
  showView('session');
  renderQuestion();
}

function updateSessionHead() {
  $('qNum').textContent = state.idx + 1;
  if (state.mode === 'simulation') {
    $('qTotal').textContent = TEST_MAX_QUESTIONS;
    $('scoreLabel').innerHTML = `<span class="n-correct" id="scoreCorrect">${state.correct}</span> / ${TEST_PASSING_THRESHOLD} correct`;
    const pct = Math.round((state.idx / TEST_MAX_QUESTIONS) * 100);
    $('progressFill').style.width = pct + '%';
  } else {
    $('qTotal').textContent = state.questions.length;
    $('scoreLabel').innerHTML = `<span class="n-correct" id="scoreCorrect">${state.correct}</span> correct ·
      <span class="n-incorrect" id="scoreIncorrect">${state.incorrect}</span> incorrect`;
    const pct = Math.round((state.idx / state.questions.length) * 100);
    $('progressFill').style.width = pct + '%';
  }
}

let currentChoiceSet = null;

function renderQuestion() {
  const q = state.questions[state.idx];
  currentChoiceSet = buildChoices(q);
  $('simBadge').style.display = state.mode === 'simulation' ? '' : 'none';
  updateSessionHead();

  const badgeClass = CAT_BADGE[q.category] || 'badge-gray';
  $('qCategory').className = 'q-category ' + badgeClass;
  $('qCategory').textContent = q.category;
  $('qText').textContent = q.question;

  let hint = '';
  if (q.needCount > 1) hint = `Select the ${q.needCount} correct answers.`;
  if (q.variesByState) hint = (hint ? hint + ' ' : '') + 'This example is one possible answer; yours depends on where you live.';
  $('qHint').textContent = hint;
  $('qHint').style.display = hint ? '' : 'none';

  $('qCurrentChip').style.display = q.timeSensitive ? '' : 'none';

  const flagEl = $('qFlag');
  if (q.timeSensitive) {
    flagEl.style.display = '';
    flagEl.textContent = 'Current answer — verify before your interview';
  } else {
    flagEl.style.display = 'none';
  }

  const isMulti = currentChoiceSet.type === 'multi';
  const box = $('choices');
  // Marks start empty; gradeAnswer() fills in a check or a cross once the
  // answer is known, so correct/incorrect is never colour-only.
  box.innerHTML = currentChoiceSet.options.map((opt, i) => `
    <button type="button" class="choice" ${isMulti ? 'data-multi' : ''} data-i="${i}">
      <span class="choice-mark"></span>
      <span>${esc(opt)}</span>
    </button>`).join('');

  $('qFeedback').className = 'q-feedback';
  $('qFeedback').innerHTML = '';
  $('nextBtn').style.display = 'none';
  $('checkBtn').style.display = isMulti ? '' : 'none';
  $('checkBtn').disabled = true;

  const bookmarkBtn = $('bookmarkBtn');
  const bStat = statFor(progress, q.id);
  bookmarkBtn.classList.toggle('is-on', !!bStat.bookmarked);
  bookmarkBtn.innerHTML = (bStat.bookmarked ? ICONS.bookmarkFill : ICONS.bookmark) + '<span>' + (bStat.bookmarked ? 'Saved' : 'Save') + '</span>';

  const selected = new Set();
  box.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      if (isMulti) {
        const i = btn.dataset.i;
        if (selected.has(i)) { selected.delete(i); btn.classList.remove('is-selected'); }
        else { selected.add(i); btn.classList.add('is-selected'); }
        $('checkBtn').disabled = selected.size !== q.needCount;
      } else {
        gradeAnswer(q, [btn.textContent.trim()], box);
      }
    });
  });

  $('checkBtn').onclick = () => {
    const chosen = [...selected].map(i => currentChoiceSet.options[i]);
    gradeAnswer(q, chosen, box);
  };

  announce('quizStatus', `Question ${state.idx + 1} of ${state.questions.length}. ${q.category}.`);
}

function gradeAnswer(q, chosenTexts, box) {
  const correctSet = new Set(currentChoiceSet.correct.map(s => s.toLowerCase()));
  const chosenSet = new Set(chosenTexts.map(s => s.toLowerCase()));
  const wasCorrect = chosenSet.size === correctSet.size && [...chosenSet].every(c => correctSet.has(c));

  box.querySelectorAll('.choice').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    btn.disabled = true;
    const mark = btn.querySelector('.choice-mark');
    if (correctSet.has(text)) { btn.classList.add('is-correct'); mark.innerHTML = ICONS.check; }
    else if (chosenSet.has(text)) { btn.classList.add('is-incorrect'); mark.innerHTML = ICONS.cross; }
  });
  $('checkBtn').style.display = 'none';

  if (wasCorrect) state.correct++; else state.incorrect++;
  recordAnswer(progress, q.id, wasCorrect);
  saveProgress(progress);
  state.results.push({ q, chosen: chosenTexts, correct: currentChoiceSet.correct, wasCorrect });

  const fb = $('qFeedback');
  fb.className = 'q-feedback show ' + (wasCorrect ? 'ok' : 'no');
  const lead = wasCorrect
    ? CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)]
    : INCORRECT_MSGS[Math.floor(Math.random() * INCORRECT_MSGS.length)];
  let html = `<div class="q-feedback-lead ${wasCorrect ? 'ok-text' : 'no-text'}">${esc(lead)}</div>`;
  if (!wasCorrect) {
    html += `<div>The correct answer${currentChoiceSet.correct.length > 1 ? 's are' : ' is'}: <strong>${currentChoiceSet.correct.map(esc).join(', ')}</strong></div>`;
  }
  if (q.note && !q.timeSensitive) html += `<div class="q-feedback-note">${esc(q.note)}</div>`;
  fb.innerHTML = html;

  $('nextBtn').style.display = '';
  $('nextBtn').textContent = sessionEndsAfter(state.idx + 1) ? 'See results' : 'Next question';
  $('nextBtn').focus();
  updateSessionHead();
}

// True once `asked` questions means there's nothing left to ask: either the
// set is exhausted, or (Test Simulation only) 12 correct has been reached
// or is no longer reachable within 20 questions.
function sessionEndsAfter(asked) {
  if (state.mode === 'simulation') return simulationOutcome(state.correct, asked) !== 'continue';
  return asked >= state.questions.length;
}

function nextQuestion() {
  state.idx++;
  if (sessionEndsAfter(state.idx)) finishQuiz();
  else renderQuestion();
}

function finishQuiz() {
  // state.idx has already been advanced past the last question answered,
  // so it equals the count actually asked — the full set length for every
  // ordinary mode, and possibly fewer than 20 for an early-stopped
  // Test Simulation.
  const total = state.idx;
  const pct = total ? Math.round((state.correct / total) * 100) : 0;
  const durationSec = Math.round((Date.now() - state.startedAt) / 1000);
  const prevStreak = progress.streakCurrent;
  const simOutcome = state.mode === 'simulation' ? simulationOutcome(state.correct, total) : null;

  recordSession(progress, {
    id: 'sess-' + Date.now(),
    mode: state.mode,
    startedAt: new Date(state.startedAt).toISOString(),
    finishedAt: new Date().toISOString(),
    total, correct: state.correct, durationSec,
  });

  const streakMilestone = [3, 7, 14, 30, 60, 100].includes(progress.streakCurrent) && progress.streakCurrent !== prevStreak;
  const worthCelebrating = simOutcome === 'reached' || (!simOutcome && pct >= 90) || total >= 128 || streakMilestone;
  if (worthCelebrating) celebrate();

  showView('results');
  renderResults(pct, total, durationSec, streakMilestone, simOutcome);
}

function scoreMessage(pct) {
  if (pct === 100) return "Perfect round. Every one of these is locked in for today.";
  if (pct >= 90) return "Strong round. You're close to knowing this set cold.";
  if (pct >= 70) return "Solid progress. A couple more passes and these will stick.";
  if (pct >= 50) return "You're building it up. Review the missed ones below and try again.";
  return "Early days. Everyone starts here, review the answers below and go again.";
}

function renderResults(pct, total, durationSec, streakMilestone, simOutcome) {
  const kicker = $('resultsKicker');
  if (simOutcome) {
    const reached = simOutcome === 'reached';
    kicker.style.display = '';
    kicker.className = 'results-kicker' + (reached ? '' : ' short-of-goal');
    kicker.textContent = reached ? 'Practice threshold reached 🎉' : 'Keep practicing';
    $('resultsScore').innerHTML = state.correct + '<span class="pct-sign">/' + total + '</span>';
    $('resultsLabel').textContent = 'correct, Test Simulation';
    const away = TEST_PASSING_THRESHOLD - state.correct;
    $('resultsMessage').textContent = reached
      ? `You reached the ${TEST_PASSING_THRESHOLD}-correct practice threshold.`
      : `You're ${away} correct answer${away === 1 ? '' : 's'} away from the practice threshold.`;
  } else {
    kicker.style.display = 'none';
    $('resultsScore').innerHTML = pct + '<span class="pct-sign">%</span>';
    $('resultsLabel').textContent = `${state.correct} of ${total} correct, ${MODE_LABEL[state.mode] || 'Practice'}`;
    $('resultsMessage').textContent = scoreMessage(pct);
  }

  const mins = Math.floor(durationSec / 60), secs = durationSec % 60;
  $('resultsStats').innerHTML = `
    <div class="result-stat"><div class="result-stat-val">${state.correct}</div><div class="result-stat-lbl">Correct</div></div>
    <div class="result-stat"><div class="result-stat-val">${state.incorrect}</div><div class="result-stat-lbl">Incorrect</div></div>
    <div class="result-stat"><div class="result-stat-val">${mins}:${String(secs).padStart(2, '0')}</div><div class="result-stat-lbl">Time</div></div>`;

  $('streakNote').style.display = streakMilestone ? '' : 'none';
  if (streakMilestone) $('streakNote').textContent = `${progress.streakCurrent}-day practice streak. Keep it going.`;

  const missed = state.results.filter(r => !r.wasCorrect);
  const practiceMissedBtn = $('practiceMissedBtn');
  practiceMissedBtn.style.display = missed.length ? '' : 'none';
  const simFellShort = simOutcome && simOutcome !== 'reached';
  practiceMissedBtn.className = simFellShort ? 'btn btn-analyze' : 'btn-ghost-panel';
  practiceMissedBtn.textContent = simOutcome
    ? 'Review Missed Questions'
    : `Practice ${missed.length} missed question${missed.length === 1 ? '' : 's'}`;
  practiceMissedBtn.onclick = () => startCustomSet(missed.map(m => m.q), 'missed-review');

  $('tryAgainBtn').textContent = simOutcome
    ? (simOutcome === 'reached' ? 'Try Another Simulation' : 'Try Again')
    : 'Try again';

  const reviewSection = $('reviewSection');
  if (!missed.length) {
    reviewSection.style.display = 'none';
  } else {
    reviewSection.style.display = '';
    $('reviewList').innerHTML = missed.map(r => `
      <div class="review-item">
        <div class="review-q">${esc(r.q.question)}</div>
        <div class="review-row wrong"><span class="lbl">You chose</span><span class="val">${r.chosen.map(esc).join(', ') || '(no answer)'}</span></div>
        <div class="review-row right"><span class="lbl">Correct</span><span class="val">${r.correct.map(esc).join(', ')}</span></div>
        ${r.q.note ? `<div class="review-note">${esc(r.q.note)}</div>` : ''}
      </div>`).join('');
  }
}

/* ── Share ──────────────────────────────────────────────────── */
async function shareResults(pct, total) {
  const text = `I scored ${pct}% (${state.correct}/${total}) practicing the USCIS civics questions.`;
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch { /* user cancelled */ }
  }
  try {
    await navigator.clipboard.writeText(text);
    announce('quizStatus', 'Score copied to clipboard.');
  } catch { /* clipboard unavailable */ }
}

/* ── Wiring ─────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const requested = consumePracticeRequest();
  if (requested && requested.length) {
    startCustomSet(requested, 'selected');
  } else {
    renderModes();
  }

  document.querySelectorAll('.mode-card[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      startQuiz(btn.dataset.mode);
    });
  });
  $('mode-simulation').addEventListener('click', startSimulation);

  $('nextBtn').addEventListener('click', nextQuestion);
  $('exitSessionBtn').addEventListener('click', () => { state = null; renderModes(); showView('modes'); });
  $('bookmarkBtn').addEventListener('click', () => {
    const q = state.questions[state.idx];
    const on = toggleBookmark(progress, q.id);
    const btn = $('bookmarkBtn');
    btn.classList.toggle('is-on', on);
    btn.innerHTML = (on ? ICONS.bookmarkFill : ICONS.bookmark) + '<span>' + (on ? 'Saved' : 'Save') + '</span>';
  });

  $('tryAgainBtn').addEventListener('click', () => {
    if (state.mode === 'simulation') startSimulation();
    else startQuiz(state.mode in MODE_LABEL ? state.mode : 'quick');
  });
  $('backToModesBtn').addEventListener('click', () => { renderModes(); showView('modes'); });
  $('shareBtn').addEventListener('click', () => {
    const total = state.idx;
    shareResults(total ? Math.round((state.correct / total) * 100) : 0, total);
  });
});
