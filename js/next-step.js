'use strict';
/* ═════════════════════════════════════════════════════════════
   YOUR NEXT STEP — a single reusable recommendation, shown on the
   hub and the Progress page. Reads only signals this device
   already has (practice history, missed-question count, and the
   case-status snapshot from case-history.js if present) — never
   invents information the app doesn't actually have, never scores
   or predicts an interview outcome, and never states a
   recommendation as an instruction rather than a suggestion.
   ═════════════════════════════════════════════════════════════ */

// Returns { eyebrow, headline, body, ctaText, ctaHref, onClick } — exactly
// one recommendation, picked in priority order. `onClick` is used instead
// of ctaHref for the "review missed questions" case, which needs to hand
// off a specific question list via requestPractice() rather than a plain link.
function computeNextStep(progress, caseSnapshot) {
  const missedIds = typeof GRADED_QUESTIONS !== 'undefined'
    ? GRADED_QUESTIONS.filter(q => masteryOf(progress.questionStats[q.id]) === 'missed').map(q => q.id)
    : [];

  // A case snapshot whose status or milestones mention an interview is the
  // most time-sensitive signal available — but only ever framed as "here's
  // a helpful thing to do," never as if the app knows the interview date
  // or outcome.
  const caseSuggestsInterview = caseSnapshot && (
    /interview/i.test(caseSnapshot.statusLabel || '') || !!(caseSnapshot.milestones && caseSnapshot.milestones.interview)
  );

  if (caseSuggestsInterview) {
    return {
      eyebrow: 'YOUR NEXT STEP',
      headline: 'Prepare for your interview',
      body: 'Your case information shows an interview-related event. Practicing the 2025 civics test can help you feel ready.',
      ctaText: 'Prepare Now →',
      ctaHref: 'quiz.html',
    };
  }

  if (!progress.totalAnswered) {
    return {
      eyebrow: 'YOUR NEXT STEP',
      headline: 'Start preparing',
      body: "You haven't started your civics practice yet. A short round is a good place to begin.",
      ctaText: 'Practice 10 Questions →',
      ctaHref: 'quiz.html',
    };
  }

  if (missedIds.length > 0) {
    return {
      eyebrow: 'YOUR NEXT STEP',
      headline: 'Review your missed questions',
      body: `You have ${missedIds.length} question${missedIds.length === 1 ? '' : 's'} to review.`,
      ctaText: 'Review Questions →',
      onClick: () => requestPractice(missedIds),
    };
  }

  const accuracy = progress.totalAnswered ? (progress.totalCorrect / progress.totalAnswered) * 100 : 0;
  if (progress.totalAnswered >= 10 && (progress.streakCurrent >= 3 || accuracy >= 85)) {
    return {
      eyebrow: 'YOUR NEXT STEP',
      headline: 'Keep your momentum',
      body: "You've been consistently answering civics questions correctly. A Test Simulation is a good next challenge.",
      ctaText: 'Continue Practice →',
      ctaHref: 'quiz.html',
    };
  }

  return {
    eyebrow: 'YOUR NEXT STEP',
    headline: 'Keep practicing',
    body: 'A little more practice will help these stick. Every session picks up where you left off.',
    ctaText: 'Continue Practice →',
    ctaHref: 'quiz.html',
  };
}

// Renders computeNextStep()'s result into a container element that already
// has the .next-step-card markup (see index.html / progress.html).
function renderNextStep(container, progress, caseSnapshot) {
  if (!container) return;
  const step = computeNextStep(progress, caseSnapshot);
  container.innerHTML = `
    <div class="next-step-eyebrow">${esc(step.eyebrow)}</div>
    <div class="next-step-headline">${esc(step.headline)}</div>
    <p class="next-step-body">${esc(step.body)}</p>
    <button type="button" class="btn btn-analyze next-step-cta" id="nextStepCta">${esc(step.ctaText)}</button>`;
  const btn = container.querySelector('#nextStepCta');
  if (step.onClick) btn.addEventListener('click', step.onClick);
  else btn.addEventListener('click', () => { location.href = step.ctaHref; });
}
