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

  // The journey strip only marks the two stages this device can honestly
  // know about (Study/Practice, from local quiz progress) — Case Journey
  // status is never persisted, so Submit/Track/Interview/Decision stay
  // neutral rather than faking a status this app doesn't actually track.
  const hasPracticed = progress.totalAnswered > 0;
  const hasSimulated = progress.sessions.some(s => s.mode === 'simulation');
  const path = $('journeyPath');
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
    $('journeyNote').textContent = hasPracticed
      ? 'Reflects your Learning Journey activity on this device.'
      : 'Your Learning Journey starts at Study — Case Journey status isn’t tracked here.';
  }
})();
