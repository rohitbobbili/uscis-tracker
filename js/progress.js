'use strict';
/* ═════════════════════════════════════════════════════════════
   PROGRESS DASHBOARD — reads the same storage the quiz writes to
   ═════════════════════════════════════════════════════════════ */
let progress = loadProgress();

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderStats() {
  const counts = masteryCounts(progress);
  const accuracy = progress.totalAnswered ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;

  $('statRow').innerHTML = `
    <div class="stat-tile"><div class="stat-tile-icon">${ICONS.layers}</div><div class="stat-tile-val">${progress.totalAnswered}</div><div class="stat-tile-lbl">Questions answered</div></div>
    <div class="stat-tile"><div class="stat-tile-icon">${ICONS.target}</div><div class="stat-tile-val">${accuracy}%</div><div class="stat-tile-lbl">Overall accuracy</div></div>
    <div class="stat-tile streak"><div class="stat-tile-icon">${ICONS.flame}</div><div class="stat-tile-val">${progress.streakCurrent}</div><div class="stat-tile-lbl">Day streak</div></div>
    <div class="stat-tile"><div class="stat-tile-icon">${ICONS.trophy}</div><div class="stat-tile-val">${counts.mastered}/${GRADED_QUESTIONS.length}</div><div class="stat-tile-lbl">Mastered</div></div>`;
}

function renderMasteryBar() {
  const counts = masteryCounts(progress);
  const total = GRADED_QUESTIONS.length;
  const pct = n => (n / total * 100).toFixed(2) + '%';
  $('masteryBar').innerHTML = `
    <div class="mastery-seg mastered" style="width:${pct(counts.mastered)}" title="Mastered: ${counts.mastered}"></div>
    <div class="mastery-seg learning" style="width:${pct(counts.learning)}" title="Learning: ${counts.learning}"></div>
    <div class="mastery-seg missed" style="width:${pct(counts.missed)}" title="Needs review: ${counts.missed}"></div>
    <div class="mastery-seg new" style="width:${pct(counts.new)}" title="Not seen: ${counts.new}"></div>`;
  $('masteryLegend').innerHTML = `
    <span><span class="mastery-dot mastered"></span>Mastered (${counts.mastered})</span>
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
  const modeName = { quick: 'Quick Practice', standard: 'Standard Practice', intensive: 'Intensive Practice', full: 'Full Practice', daily: 'Daily Practice', missed: 'Missed Questions', 'missed-review': 'Missed review', selected: 'Selected questions' };
  $('sessionHistory').innerHTML = recent.map(s => {
    const pct = Math.round((s.correct / s.total) * 100);
    return `<div class="session-row">
      <div><div class="session-row-mode">${esc(modeName[s.mode] || s.mode)}</div><div class="session-row-when">${fmtDate(s.finishedAt)}</div></div>
      <div class="session-row-score ${pct >= 80 ? 'pass' : 'fail'}">${s.correct}/${s.total} · ${pct}%</div>
    </div>`;
  }).join('');
}

function renderEmptyOrContent() {
  const hasData = progress.totalAnswered > 0;
  $('emptyPanel').style.display = hasData ? 'none' : '';
  $('dashboardContent').style.display = hasData ? '' : 'none';
}

function renderAll() {
  renderEmptyOrContent();
  if (progress.totalAnswered > 0) {
    renderStats();
    renderMasteryBar();
    renderCategories();
    renderSessions();
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
