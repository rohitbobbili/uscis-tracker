'use strict';
/* ═════════════════════════════════════════════════════════════
   PROGRESS DASHBOARD — reads the same storage the quiz writes to
   ═════════════════════════════════════════════════════════════ */
let progress = loadProgress();

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function lastSimulationLabel() {
  const last = [...progress.sessions].reverse().find(s => s.mode === 'simulation');
  return last ? `${last.correct}/${TEST_PASSING_THRESHOLD}` : '—';
}

function missedQuestionIds() {
  return GRADED_QUESTIONS.filter(q => masteryOf(progress.questionStats[q.id]) === 'missed').map(q => q.id);
}

function renderStats() {
  const counts = masteryCounts(progress);
  const accuracy = progress.totalAnswered ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;
  const hasLastSim = [...progress.sessions].some(s => s.mode === 'simulation');

  $('statRow').innerHTML = `
    <div class="stat-tile"><div class="stat-tile-icon">${ICONS.layers}</div><div class="stat-tile-val">${progress.totalAnswered}</div><div class="stat-tile-lbl">Questions practiced</div></div>
    <div class="stat-tile"><div class="stat-tile-icon">${ICONS.trophy}</div><div class="stat-tile-val">${counts.mastered}/${GRADED_QUESTIONS.length}</div><div class="stat-tile-lbl">Consistently answered</div></div>
    <div class="stat-tile"><div class="stat-tile-icon">${ICONS.target}</div><div class="stat-tile-val">${accuracy}%</div><div class="stat-tile-lbl">Overall accuracy</div></div>
    <div class="stat-tile streak"><div class="stat-tile-icon">${ICONS.flame}</div><div class="stat-tile-val">${progress.streakCurrent}</div><div class="stat-tile-lbl">Day streak</div></div>
    <button type="button" class="stat-tile${hasLastSim ? ' stat-tile-action' : ''}" id="lastSimTile" ${hasLastSim ? '' : 'disabled'}>
      <div class="stat-tile-icon">${ICONS.chart}</div><div class="stat-tile-val">${lastSimulationLabel()}</div>
      <div class="stat-tile-lbl">Last Test Simulation${hasLastSim ? ' →' : ''}</div>
    </button>
    <button type="button" class="stat-tile${counts.missed ? ' stat-tile-action' : ''}" id="needsReviewTile" ${counts.missed ? '' : 'disabled'}>
      <div class="stat-tile-icon">${ICONS.refresh}</div><div class="stat-tile-val">${counts.missed}</div>
      <div class="stat-tile-lbl">Needs review${counts.missed ? ' →' : ''}</div>
    </button>`;

  if (counts.missed) {
    $('needsReviewTile').addEventListener('click', () => requestPractice(missedQuestionIds()));
  }
  if (hasLastSim) {
    $('lastSimTile').addEventListener('click', () => { location.href = 'quiz.html'; });
  }
}

function renderMasteryBar() {
  const counts = masteryCounts(progress);
  const total = GRADED_QUESTIONS.length;
  const pct = n => (n / total * 100).toFixed(2) + '%';
  $('masteryBar').innerHTML = `
    <div class="mastery-seg mastered" style="width:${pct(counts.mastered)}" title="Consistently answered: ${counts.mastered}"></div>
    <div class="mastery-seg learning" style="width:${pct(counts.learning)}" title="Learning: ${counts.learning}"></div>
    <div class="mastery-seg missed" style="width:${pct(counts.missed)}" title="Needs review: ${counts.missed}"></div>
    <div class="mastery-seg new" style="width:${pct(counts.new)}" title="Not seen: ${counts.new}"></div>`;
  $('masteryLegend').innerHTML = `
    <span><span class="mastery-dot mastered"></span>Consistently answered (${counts.mastered})</span>
    <span><span class="mastery-dot learning"></span>Learning (${counts.learning})</span>
    <span><span class="mastery-dot missed"></span>Needs review (${counts.missed})</span>
    <span><span class="mastery-dot new"></span>Not seen yet (${counts.new})</span>`;
}

function renderCategories() {
  const byCat = {};
  CIVICS_CATEGORIES.forEach(c => byCat[c] = { total: 0, mastered: 0 });
  GRADED_QUESTIONS.forEach(q => {
    byCat[q.category].total++;
    if (masteryOf(progress.questionStats[q.id]) === 'mastered') byCat[q.category].mastered++;
  });
  $('catList').innerHTML = CIVICS_CATEGORIES.map(c => {
    const { total, mastered } = byCat[c];
    const pct = total ? Math.round((mastered / total) * 100) : 0;
    return `<div class="cat-row">
      <div class="cat-row-top"><span class="cat-row-name">${esc(c)}</span><span class="cat-row-frac">${mastered}/${total}</span></div>
      <div class="cat-row-track"><div class="cat-row-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

function renderSessions() {
  const recent = [...progress.sessions].reverse().slice(0, 12);
  if (!recent.length) {
    $('sessionHistory').innerHTML = '';
    $('sessionHistorySection').style.display = 'none';
    return;
  }
  $('sessionHistorySection').style.display = '';
  const modeName = { quick: 'Quick Practice', standard: 'Standard Practice', intensive: 'Intensive Practice', full: 'Full Practice', daily: 'Daily Practice', missed: 'Missed Questions', 'missed-review': 'Missed review', selected: 'Selected questions', simulation: 'Test Simulation' };
  $('sessionHistory').innerHTML = recent.map(s => {
    const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    const isSim = s.mode === 'simulation';
    const passed = isSim ? s.correct >= TEST_PASSING_THRESHOLD : pct >= 80;
    const scoreText = isSim ? `${s.correct}/${TEST_PASSING_THRESHOLD} · ${s.total} asked` : `${s.correct}/${s.total} · ${pct}%`;
    return `<div class="session-row">
      <div><div class="session-row-mode">${esc(modeName[s.mode] || s.mode)}</div><div class="session-row-when">${fmtDate(s.finishedAt)}</div></div>
      <div class="session-row-score ${passed ? 'pass' : 'fail'}">${scoreText}</div>
    </div>`;
  }).join('');
}

function renderEmptyOrContent() {
  const hasData = progress.totalAnswered > 0;
  $('emptyPanel').style.display = hasData ? 'none' : '';
  $('dashboardContent').style.display = hasData ? '' : 'none';
}

function renderMissedCta() {
  const missedIds = missedQuestionIds();
  const missedBtn = $('practiceMissedBtn');
  const continueLink = $('continuePracticingLink');
  if (missedIds.length) {
    missedBtn.style.display = 'inline-flex';
    continueLink.style.display = 'none';
    missedBtn.onclick = () => requestPractice(missedIds);
  } else {
    missedBtn.style.display = 'none';
    continueLink.style.display = 'inline-flex';
  }
}

function renderAll() {
  renderEmptyOrContent();
  renderNextStep($('progressNextStep'), progress, loadCaseSnapshot());
  if (progress.totalAnswered > 0) {
    renderStats();
    renderMasteryBar();
    renderCategories();
    renderSessions();
    renderMissedCta();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  $('resetProgressBtn').addEventListener('click', () => {
    if (!confirm('Clear all civics practice history on this device? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    progress = loadProgress();
    renderAll();
    announce('progressStatus', 'Practice history cleared.');
  });
});
