'use strict';
/* ═════════════════════════════════════════════════════════════
   HUB PAGE — shows real practice stats on the Learning Journey
   card when the learner has any, using the same localStorage
   the quiz writes to (see loadProgress() in civics-shared.js).
   ═════════════════════════════════════════════════════════════ */
(function () {
  const progress = loadProgress();
  if (!progress.totalAnswered) return;

  const accuracy = Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
  $('statAnswered').textContent = progress.totalAnswered;
  $('statAccuracy').textContent = accuracy + '%';
  $('statStreak').textContent = progress.streakBest;
  $('learningStats').style.display = '';
  $('learningDesc').textContent = "You've practiced " + progress.totalAnswered + " question"
    + (progress.totalAnswered === 1 ? '' : 's') + " so far. Keep going toward your interview.";
  $('learningCta').textContent = 'Continue Practicing →';
})();
