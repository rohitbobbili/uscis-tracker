'use strict';
/* ═════════════════════════════════════════════════════════════
   CASE UPDATE TRACKING — a minimal, normalized snapshot of case
   status, kept in localStorage so "what changed since I last
   checked" can be answered without a server. The RAW USCIS JSON
   is never stored — only the small set of fields below, which is
   everything the comparison actually needs. Shared by case.html
   (which writes it) and index.html (which reads it for the hub
   card). Loaded after main.js's $()/esc() helpers are defined.
   ═════════════════════════════════════════════════════════════ */
const CASE_SNAPSHOT_KEY = 'uscis-case-snapshot-v1';

const CASE_APPROVAL_CODES = ['DA', 'DH', 'IEA', 'IEE', 'IEC', 'H008'];
const CASE_DENIAL_CODES = ['EA', 'IFA'];

const MILESTONE_LABELS = {
  filed: 'Filed',
  biometrics: 'Biometrics appointment',
  interview: 'Interview',
  decision: 'Decision',
  cardMailed: 'Card mailed',
};

function deriveCaseStatus(d) {
  const events = d.events || [];
  const codes = events.map(e => e.eventCode);
  const isApproved = codes.some(c => CASE_APPROVAL_CODES.includes(c));
  const isDenied = codes.some(c => CASE_DENIAL_CODES.includes(c));
  const hasInterview = codes.some(c => ['FJ', 'HG'].includes(c));
  const hasPostIvChk = codes.includes('FTA1');
  const hasBgChecks = codes.some(c => ['FTA0', 'FTA1'].includes(c));
  const hasRFE = codes.some(c => ['FBA', 'FBB', 'IK', 'IKA'].includes(c));
  const hasCardProduced = codes.includes('LDA');
  const hasDecision = isApproved || isDenied || hasCardProduced;

  let stageIndex = 0;
  if (codes.some(c => ['IAF', 'IAA', 'AALB'].includes(c))) stageIndex = 1;
  if (hasBgChecks) stageIndex = 2;
  if (hasInterview) stageIndex = 3;
  if (hasInterview && hasPostIvChk) stageIndex = 4;
  if (hasDecision) stageIndex = 5;

  let statusLabel;
  if (isDenied) statusLabel = 'Denied';
  else if (isApproved || hasCardProduced) statusLabel = 'Approved';
  else if (hasRFE) statusLabel = 'Evidence Requested';
  else if (hasInterview && hasPostIvChk) statusLabel = 'Final Review';
  else if (hasInterview) statusLabel = 'Interview Scheduled or Completed';
  else if (hasBgChecks) statusLabel = 'Background Checks';
  else if (stageIndex >= 1) statusLabel = 'Received';
  else statusLabel = 'Filed';

  return { stageIndex, statusLabel };
}

function findEventDate(events, matchCodes) {
  const ev = events.find(e => matchCodes.includes(e.eventCode));
  if (!ev) return null;
  const ts = ev.createdAtTimestamp || ev.eventTimestamp;
  return ts ? String(ts).slice(0, 10) : null; // day precision only — no need for exact timestamps
}

// The only place raw case JSON is read for storage purposes. Everything
// that isn't one of these fields (applicant name, addresses, notice IDs,
// raw event timestamps, the JSON itself, ...) never makes it into
// localStorage.
function normalizeCaseSnapshot(d) {
  const events = d.events || [];
  const notices = d.notices || [];
  const status = deriveCaseStatus(d);
  const interviewNotice = notices.find(n => /interview/i.test(n.actionType || ''));

  return {
    version: 1,
    receiptNumber: d.receiptNumber || null,
    formType: d.formType || null,
    statusLabel: status.statusLabel,
    stageIndex: status.stageIndex,
    actionRequired: !!d.actionRequired,
    closed: d.closed === true,
    recordUpdatedAt: String(d.updatedAtTimestamp || d.updatedAt || '').slice(0, 10) || null,
    milestones: {
      filed: String(d.submissionTimestamp || d.submissionDate || '').slice(0, 10) || null,
      biometrics: findEventDate(events, ['FNB']),
      interview: interviewNotice ? String(interviewNotice.appointmentDateTime).slice(0, 10) : findEventDate(events, ['FJ', 'HG']),
      decision: findEventDate(events, [...CASE_APPROVAL_CODES, ...CASE_DENIAL_CODES]),
      cardMailed: findEventDate(events, ['LEA']),
    },
    eventCodes: [...new Set(events.map(e => e.eventCode))].sort(),
    eventCount: events.length,
    snapshotAt: new Date().toISOString(),
  };
}

function loadCaseSnapshot() {
  try {
    const raw = localStorage.getItem(CASE_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return null;
    return parsed;
  } catch { return null; }
}

function saveCaseSnapshot(snap) {
  try { localStorage.setItem(CASE_SNAPSHOT_KEY, JSON.stringify(snap)); }
  catch { /* storage unavailable (private mode, full quota) — analysis still works, just isn't remembered */ }
}

function clearCaseSnapshot() {
  try { localStorage.removeItem(CASE_SNAPSHOT_KEY); } catch { /* ignore */ }
}

// Compares two normalized snapshots of the SAME case and returns a list of
// { label, from, to } change descriptors. `from`/`to` are omitted (null)
// for boolean-flip changes that read fine as a label alone.
function diffCaseSnapshots(prev, next) {
  const changes = [];
  if (!prev) return changes;

  if (prev.statusLabel !== next.statusLabel) {
    changes.push({ label: 'Case status', from: prev.statusLabel, to: next.statusLabel });
  }
  if (prev.actionRequired !== next.actionRequired) {
    changes.push({
      label: next.actionRequired ? 'Action is now required on your case' : 'Action requirement cleared',
      from: null, to: null,
    });
  }
  Object.keys(MILESTONE_LABELS).forEach(key => {
    const a = prev.milestones && prev.milestones[key];
    const b = next.milestones && next.milestones[key];
    if (a === b) return;
    if (!a && b) changes.push({ label: `New milestone: ${MILESTONE_LABELS[key]}`, from: null, to: b });
    else if (a && b) changes.push({ label: `${MILESTONE_LABELS[key]} date changed`, from: a, to: b });
    else if (a && !b) changes.push({ label: `${MILESTONE_LABELS[key]} milestone no longer listed`, from: a, to: null });
  });

  const prevCodes = new Set(prev.eventCodes || []);
  const nextCodes = new Set(next.eventCodes || []);
  nextCodes.forEach(c => { if (!prevCodes.has(c)) changes.push({ label: `New case event logged: ${c}`, from: null, to: null }); });
  prevCodes.forEach(c => { if (!nextCodes.has(c)) changes.push({ label: `Case event no longer listed: ${c}`, from: null, to: null }); });

  // Nothing tracked above moved, but USCIS still touched the record —
  // worth a line rather than silently calling it "no changes."
  if (!changes.length && prev.recordUpdatedAt && next.recordUpdatedAt && prev.recordUpdatedAt !== next.recordUpdatedAt) {
    changes.push({ label: 'Case record updated by USCIS', from: prev.recordUpdatedAt, to: next.recordUpdatedAt });
  }
  return changes;
}

// Call once per successful case analysis. Normalizes, diffs against
// whatever was previously saved for the SAME receipt number, saves the
// new snapshot (with the diff attached so it can be redisplayed later
// without re-pasting), and reports what happened.
function recordCaseSnapshot(d) {
  const next = normalizeCaseSnapshot(d);
  const prevRaw = loadCaseSnapshot();
  const sameCase = !!(prevRaw && prevRaw.receiptNumber && next.receiptNumber && prevRaw.receiptNumber === next.receiptNumber);
  const isFirstTime = !prevRaw;
  const changedCase = !!prevRaw && !sameCase;
  const changes = sameCase ? diffCaseSnapshots(prevRaw, next) : [];

  const stored = {
    ...next,
    compareNote: isFirstTime ? 'first' : (changedCase ? 'new-case' : null),
    changesSinceLast: changes,
    reviewed: changes.length === 0,
    lastCheckedAt: next.snapshotAt,
  };
  saveCaseSnapshot(stored);
  return { snapshot: stored, changes, isFirstTime, changedCase };
}

function markCaseReviewed() {
  const snap = loadCaseSnapshot();
  if (!snap || snap.reviewed) return;
  snap.reviewed = true;
  saveCaseSnapshot(snap);
}

function hasUnreviewedCaseChange() {
  const snap = loadCaseSnapshot();
  return !!(snap && !snap.reviewed && snap.changesSinceLast && snap.changesSinceLast.length);
}

/* ═════════════════════════════════════════════════════════════
   SHARED RENDERING — the "last known status" strip is identical
   in behavior on case.html (dark page background) and index.html
   (light card background, via the .on-light modifier class).
   Relies on esc()/$() already being defined by the page's own
   script (civics-shared.js or main.js), which load before this
   is ever called (after DOMContentLoaded).
   ═════════════════════════════════════════════════════════════ */
function relativeDay(iso) {
  if (!iso) return '';
  const diff = Math.round((Date.now() - new Date(iso)) / 86400000);
  if (diff <= 0) return 'today';
  if (diff === 1) return 'yesterday';
  return `${diff} days ago`;
}

function renderChangesList(changes) {
  if (!changes || !changes.length) return '<p class="whats-new-empty">No changes since your last update.</p>';
  return '<ul class="whats-new-list">' + changes.map(c => {
    if (c.from && c.to) return `<li>${esc(c.label)}: <span class="wn-from">${esc(c.from)}</span> → <span class="wn-to">${esc(c.to)}</span></li>`;
    if (c.to) return `<li>${esc(c.label)}: <span class="wn-to">${esc(c.to)}</span></li>`;
    return `<li>${esc(c.label)}</li>`;
  }).join('') + '</ul>';
}

function caseStatusStripHTML(snap) {
  const when = relativeDay(snap.lastCheckedAt || snap.snapshotAt);
  const unreviewed = !snap.reviewed && snap.changesSinceLast && snap.changesSinceLast.length > 0;

  let body;
  if (snap.compareNote === 'first') {
    body = '<p class="whats-new-empty">First saved snapshot — future imports will be compared against it.</p>';
  } else if (snap.compareNote === 'new-case') {
    body = '<p class="whats-new-empty">This receipt number is different from the one saved before, so comparison starts fresh here.</p>';
  } else {
    body = renderChangesList(snap.changesSinceLast);
  }

  return `
    <div class="case-status-line">
      <span>Last known status: <strong>${esc(snap.statusLabel)}</strong> · Checked ${when}</span>
      <button type="button" class="link-btn" id="forgetCaseStatusBtn">Clear saved status</button>
    </div>
    <details class="whats-new-toggle" id="whatsNewDetails">
      <summary>${unreviewed ? '<span class="whats-new-dot" aria-hidden="true"></span>' : ''}What's new since my last case update?</summary>
      <div class="whats-new-body">${body}</div>
    </details>`;
}

// Wires the toggle-to-mark-reviewed and clear-status behavior onto a strip
// already filled with caseStatusStripHTML(). Callbacks are optional: pass
// onReviewed to update a badge living elsewhere on the page, onCleared to
// re-render (the strip's own content depends on the snapshot that was just
// removed).
function wireCaseStatusStrip(strip, { onReviewed, onCleared } = {}) {
  const details = strip.querySelector('#whatsNewDetails');
  if (details) {
    details.addEventListener('toggle', function () {
      if (!this.open) return;
      markCaseReviewed();
      this.querySelector('.whats-new-dot')?.remove();
      if (onReviewed) onReviewed();
    });
  }
  const btn = strip.querySelector('#forgetCaseStatusBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (!confirm('Clear the saved case status from this device? This cannot be undone.')) return;
      clearCaseSnapshot();
      if (onCleared) onCleared();
    });
  }
}
