'use strict';
/* ═════════════════════════════════════════════════════════════
   STUDY MODE — browse, search, bookmark, jump into practice
   ═════════════════════════════════════════════════════════════ */
const CAT_BADGE_S = {
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

let progress = loadProgress();
let filters = { text: '', category: 'all', bookmarkedOnly: false };
let openIds = new Set();

function matches(q) {
  if (filters.category !== 'all' && q.category !== filters.category) return false;
  if (filters.bookmarkedOnly && !statFor(progress, q.id).bookmarked) return false;
  if (filters.text) {
    const t = filters.text.toLowerCase();
    const inQuestion = q.question.toLowerCase().includes(t);
    const inAnswers = q.answers.some(a => a.toLowerCase().includes(t));
    if (!inQuestion && !inAnswers) return false;
  }
  return true;
}

function renderItem(q) {
  const stat = statFor(progress, q.id);
  const isOpen = openIds.has(q.id);
  const badge = CAT_BADGE_S[q.category] || 'badge-gray';
  const answersHtml = q.answers.length
    ? q.answers.map((a, i) => `${i === 0 ? '<strong>' : ''}${esc(cleanAnswer(a))}${i === 0 ? '</strong>' : ''}`).join('; ')
    : '<em>See uscis.gov for the current answer.</em>';

  return `
    <div class="study-item ${isOpen ? 'is-open' : ''}" data-id="${q.id}">
      <button type="button" class="study-item-head" data-toggle="${q.id}">
        <span class="study-item-num">${q.id}</span>
        <span class="badge ${badge}" style="flex-shrink:0">${esc(q.category)}</span>
        ${q.timeSensitive ? `<span class="q-current-chip" style="margin:0;flex-shrink:0" title="This answer can change with an election or appointment">CURRENT</span>` : ''}
        <span class="study-item-q">${esc(q.question)}</span>
        ${stat.bookmarked ? `<span style="color:var(--gold);flex-shrink:0">${ICONS.bookmarkFill}</span>` : ''}
        <span class="study-item-chevron">${ICONS.chevron}</span>
      </button>
      <div class="study-item-body">
        <div class="study-answers">${answersHtml}</div>
        ${q.note ? `<div class="study-item-note">${esc(q.note)}</div>` : ''}
        <div class="study-item-actions">
          <button type="button" class="study-bookmark-btn ${stat.bookmarked ? 'is-on' : ''}" data-bookmark="${q.id}">
            ${stat.bookmarked ? ICONS.bookmarkFill : ICONS.bookmark}<span>${stat.bookmarked ? 'Saved' : 'Save'}</span>
          </button>
          ${!q.studyOnly ? `<button type="button" class="study-bookmark-btn" data-practice="${q.id}">${ICONS.target}<span>Practice this one</span></button>` : ''}
        </div>
      </div>
    </div>`;
}

function render() {
  const list = CIVICS_QUESTIONS.filter(matches);
  $('studyCount').textContent = `${list.length} of ${CIVICS_QUESTIONS.length} questions`;

  const bookmarkedTotal = CIVICS_QUESTIONS.filter(q => statFor(progress, q.id).bookmarked).length;
  const practiceBar = $('practiceBookmarkedBtn');
  practiceBar.style.display = bookmarkedTotal ? '' : 'none';
  practiceBar.textContent = `Practice ${bookmarkedTotal} saved question${bookmarkedTotal === 1 ? '' : 's'} →`;

  if (!list.length) {
    $('studyList').innerHTML = '';
    $('studyEmpty').style.display = '';
    return;
  }
  $('studyEmpty').style.display = 'none';
  $('studyList').innerHTML = list.map(renderItem).join('');
}

window.addEventListener('DOMContentLoaded', () => {
  const catSelect = $('studyCategory');
  CIVICS_CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    catSelect.appendChild(opt);
  });

  $('studySearch').addEventListener('input', e => { filters.text = e.target.value.trim(); render(); });
  catSelect.addEventListener('change', e => { filters.category = e.target.value; render(); });
  $('studyBookmarkToggle').addEventListener('change', e => { filters.bookmarkedOnly = e.target.checked; render(); });

  $('studyList').addEventListener('click', e => {
    const toggleId = e.target.closest('[data-toggle]')?.dataset.toggle;
    const bookmarkId = e.target.closest('[data-bookmark]')?.dataset.bookmark;
    const practiceId = e.target.closest('[data-practice]')?.dataset.practice;

    if (bookmarkId) {
      toggleBookmark(progress, Number(bookmarkId));
      render();
      return;
    }
    if (practiceId) { requestPractice([Number(practiceId)]); return; }
    if (toggleId) {
      const id = Number(toggleId);
      if (openIds.has(id)) openIds.delete(id); else openIds.add(id);
      render();
    }
  });

  $('practiceBookmarkedBtn').addEventListener('click', () => {
    const ids = CIVICS_QUESTIONS.filter(q => statFor(progress, q.id).bookmarked).map(q => q.id);
    if (ids.length) requestPractice(ids);
  });

  render();
});
