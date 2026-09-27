'use strict';
/* ═════════════════════════════════════════════════════════════
   HUB PAGE — shows real practice stats on the Learning Journey
   card when the learner has any, using the same localStorage
   the quiz writes to (see loadProgress() in civics-shared.js).
   ═════════════════════════════════════════════════════════════ */
(function () {
  const progress = loadProgress();

  if (progress.totalAnswered) {
    const accuracy = Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
    $('statAnswered').textContent = progress.totalAnswered;
    $('statAccuracy').textContent = accuracy + '%';
    $('statStreak').textContent = progress.streakBest;
    $('learningTitle').textContent = 'Continue your Learning Journey';
    $('learningDesc').textContent = "You've practiced " + progress.totalAnswered + " question"
      + (progress.totalAnswered === 1 ? '' : 's') + " so far. Keep going toward your interview.";
    $('learningStatline').style.display = 'none';
    $('learningStats').style.display = '';
    $('learningCta').textContent = 'Continue Practicing →';
  }

  // Case Journey: show the last known status + what's new, right on the
  // pillar card, using only the minimal snapshot from case-history.js —
  // never the full case record.
  function renderHubCaseStatus() {
    const strip = $('hubCaseStatus');
    const snap = loadCaseSnapshot();
    if (!snap) { strip.style.display = 'none'; return; }
    strip.style.display = '';
    strip.innerHTML = caseStatusStripHTML(snap);
    wireCaseStatusStrip(strip, {
      onReviewed: updateJourneyPath,
      onCleared: () => { renderHubCaseStatus(); updateJourneyPath(); },
    });
  }
  renderHubCaseStatus();

  // The journey strip marks only what this device can honestly know:
  // Submit/Track from a saved case snapshot (having one at all implies the
  // form was filed), Study/Practice from local quiz progress. Interview
  // and Decision stay neutral — nothing on this device tracks them.
  const hasPracticed = progress.totalAnswered > 0;
  const hasSimulated = progress.sessions.some(s => s.mode === 'simulation');
  const path = $('journeyPath');

  function updateJourneyPath() {
    if (!path) return;
    const step = name => path.querySelector(`[data-step="${name}"]`);
    ['submit', 'track'].forEach(name => step(name).classList.remove('done', 'active'));

    const caseSnap = loadCaseSnapshot();
    const notes = [];
    const trackDot = step('track').querySelector('.ms-dot');
    trackDot?.querySelector('.journey-badge-dot')?.remove();
    if (caseSnap) {
      step('submit').classList.add('done');
      const unreviewed = hasUnreviewedCaseChange();
      step('track').classList.toggle('active', unreviewed);
      step('track').classList.toggle('done', !unreviewed);
      if (unreviewed && trackDot) {
        const dot = document.createElement('span');
        dot.className = 'journey-badge-dot';
        dot.setAttribute('aria-hidden', 'true');
        trackDot.appendChild(dot);
      }
      notes.push('your Case Journey status');
    }
    if (hasPracticed) notes.push('your Learning Journey activity');

    $('journeyNote').textContent = notes.length
      ? `Reflects ${notes.join(' and ')} on this device.`
      : 'Check your case or start practicing to fill this in.';
  }

  if (path) {
    const step = name => path.querySelector(`[data-step="${name}"]`);
    if (hasPracticed) {
      step('study').classList.add('done');
      $('lineStudy').classList.add('done');
    } else {
      step('study').classList.add('active');
    }
    if (hasSimulated) step('practice').classList.add('done');
    else if (hasPracticed) step('practice').classList.add('active');
    updateJourneyPath();
  }
})();
