'use strict';

/* ═════════════════════════════════════════════════════════════
   EVENT CODE DICTIONARY
   Code-to-meaning mappings follow the public NIEM v5.0 schema
   (scr:BenefitDocumentStatusCategoryCodeSimpleType). The
   plain-language explanations are original to this project.
   ═════════════════════════════════════════════════════════════ */
const EVENT_CODES = {
  // Receipt
  IAF:  { name: 'Receipt Letter Emailed', desc: 'The case was accepted into the ELIS system, a receipt number was assigned, and the receipt notice went out by email.', cat: 'receipt' },
  IAA:  { name: 'Receipt Notice Sent (Mail)', desc: 'A receipt notice was sent by postal mail.', cat: 'receipt' },
  IAAA: { name: 'Receipt Notice with I-89 Request', desc: 'A receipt notice was issued together with an I-89 processing request.', cat: 'receipt' },
  IAB:  { name: 'Modified Receipt Notice 1 Sent', desc: 'USCIS issued a corrected or modified receipt notice (first type).', cat: 'receipt' },
  IAC:  { name: 'Modified Receipt Notice 2 Sent', desc: 'USCIS issued a corrected or modified receipt notice (second type).', cat: 'receipt' },
  IAD:  { name: 'Fee Collected Elsewhere Receipt', desc: 'A receipt notice was issued noting the filing fee was collected at another location.', cat: 'receipt' },
  AALB: { name: 'Received at Lockbox Facility', desc: 'The paper filing arrived at a USCIS lockbox and was logged in.', cat: 'receipt' },
  // Background checks
  FTA0: { name: 'Database Checks Received', desc: 'Routine background-check results (databases, biometrics, name checks) came back to USCIS — an ordinary step in every case.', cat: 'checks' },
  FTA1: { name: 'Database Checks Received', desc: 'A refresh of the background checks came back. This is often seen while a supervisor performs the final review of a case that is otherwise complete, with nothing needed from the applicant.', cat: 'checks' },
  FSA0: { name: 'Database Checks Requested', desc: 'USCIS asked its partner federal agencies to run background checks.', cat: 'checks' },
  FN:   { name: 'Fingerprint / Agency Checks Ordered', desc: 'Fingerprint and agency background checks were ordered.', cat: 'checks' },
  FNA:  { name: 'Fingerprint Appointment Notice Ordered', desc: 'A biometrics appointment notice was generated for mailing.', cat: 'checks' },
  FNB:  { name: 'Fingerprints Taken at ASC', desc: 'Fingerprints, photo, and signature were captured at an Application Support Center.', cat: 'checks' },
  FNC:  { name: 'FD-258 Sent to FBI', desc: 'The FD-258 fingerprint card went to the FBI for processing.', cat: 'checks' },
  FNG:  { name: 'Fingerprint Processing Complete — Match', desc: 'FBI fingerprint results returned with a matching record on file.', cat: 'checks' },
  FNH:  { name: 'Fingerprint Processing Complete — No Match', desc: 'FBI fingerprint results returned clean — no matching record.', cat: 'checks' },
  QAA:  { name: 'FBI Name Check — No Record', desc: 'The FBI name check came back "No Record" — a clear result.', cat: 'checks' },
  QAB:  { name: 'FBI Name Check — Pending', desc: 'The FBI name check is still in process.', cat: 'checks' },
  QAE:  { name: 'FBI Name Check — Positive Response', desc: 'The FBI name check returned a hit; extra review can happen before the case moves on.', cat: 'checks' },
  HC:   { name: 'Investigative Report Received', desc: 'An investigative or agency report reached the case file.', cat: 'checks' },
  // Interview
  FH:   { name: 'Placed in Interview Queue', desc: 'The case joined the queue to be scheduled for an interview.', cat: 'interview' },
  FHB:  { name: 'Ready for Interview Scheduling', desc: 'The case is cleared and waiting for an interview slot.', cat: 'interview' },
  FI:   { name: 'Interview Force-Scheduled', desc: 'An interview was scheduled outside the normal queue.', cat: 'interview' },
  FJ:   { name: 'Interview Scheduled / Notice Ordered', desc: 'An interview was put on the calendar and the appointment notice ordered — a significant step forward.', cat: 'interview' },
  FM:   { name: 'Interview Rescheduled', desc: 'The interview was moved to a new date.', cat: 'interview' },
  FL:   { name: 'Failed to Appear for Interview', desc: 'The applicant missed the scheduled interview or ADIT appointment.', cat: 'interview' },
  HG:   { name: 'Interview Conducted', desc: 'The interview took place; the officer now completes post-interview adjudication.', cat: 'interview' },
  IM:   { name: 'Interview Notice Sent', desc: 'The interview appointment notice went out.', cat: 'interview' },
  FKA:  { name: 'Interview Descheduled', desc: 'The interview was taken off the calendar.', cat: 'interview' },
  FKB:  { name: 'Interview Cancelled (per Request)', desc: 'The interview was cancelled following a request.', cat: 'interview' },
  // Processing
  FT0:  { name: 'Officer Processing Begun', desc: 'An officer picked up the case and is actively working it.', cat: 'processing' },
  TA:   { name: 'Pre-Adjudicated — Under Review', desc: 'The case was pre-adjudicated and awaits secondary or supervisory review.', cat: 'processing' },
  FR:   { name: 'Adjudication Hold Lifted', desc: 'An adjudication hold came off; work resumes.', cat: 'processing' },
  FT:   { name: 'Processing Hold Lifted', desc: 'A processing hold came off.', cat: 'processing' },
  // Holds
  FS:   { name: 'Adjudication Hold Placed', desc: 'An adjudication hold was placed; decisions pause until it clears.', cat: 'hold' },
  KA:   { name: 'Supervisory Hold Placed', desc: 'A supervisor placed a hold that must be cleared before anything else happens.', cat: 'hold' },
  KBA:  { name: 'Supervisory Hold Cleared — Confirmed', desc: 'The supervisory hold cleared and the pending action was confirmed.', cat: 'hold' },
  KBB:  { name: 'Supervisory Hold Cleared — Cancelled', desc: 'The supervisory hold cleared, but the pending action was cancelled.', cat: 'hold' },
  KC:   { name: 'Quality Review Hold Placed', desc: 'The case entered a quality-review hold.', cat: 'hold' },
  KDA:  { name: 'Quality Review Hold Cleared — Confirmed', desc: 'Quality review finished and confirmed the action.', cat: 'hold' },
  FLS:  { name: 'Sent to Law Enforcement Support Center', desc: 'The case went to the Law Enforcement Support Center (LESC) for checks.', cat: 'hold' },
  FLR:  { name: 'Returned from Law Enforcement Support Center', desc: 'The case came back from LESC; processing can continue.', cat: 'hold' },
  // Approved
  DA:   { name: 'Application APPROVED / Notice Ordered', desc: 'USCIS approved the application and ordered the approval notice.', cat: 'approved' },
  DH:   { name: 'Approved on Service Motion', desc: 'USCIS approved the case on its own (service) motion.', cat: 'approved' },
  IEA:  { name: 'Approval Notice Sent', desc: 'The approval notice went out by mail.', cat: 'approved' },
  IEE:  { name: 'Approval Letter Emailed', desc: 'The approval letter went out by email.', cat: 'approved' },
  IEC:  { name: 'Welcome Notice Sent', desc: 'A welcome notice was issued — usually the sign that Lawful Permanent Resident (LPR / Green Card) status has been granted.', cat: 'approved' },
  H008: { name: 'Case Approved', desc: 'The application is approved and the Green Card moves to production.', cat: 'approved' },
  // Card production
  LAA:  { name: 'Card Request Sent to Production', desc: 'The Green Card order was sent to the card production facility.', cat: 'card' },
  LDA:  { name: 'Green Card Produced', desc: 'The Green Card has been printed.', cat: 'card' },
  LEA:  { name: 'Green Card Mailed to Applicant', desc: 'The Green Card is in the mail — typically arriving within about 7–10 business days.', cat: 'card' },
  MO:   { name: 'EAD Not Produced — Adjustment Granted', desc: 'No EAD card was printed because the Green Card approval supersedes it.', cat: 'card' },
  // RFE
  IKA:  { name: 'Initial Evidence Request Ordered', desc: 'USCIS is requesting more evidence; the case waits until you respond, then processing resumes.', cat: 'rfe' },
  FBA:  { name: 'Initial Evidence Request Ordered', desc: 'A Request for Evidence was ordered — more documentation is needed before a decision.', cat: 'rfe' },
  FBB:  { name: 'Additional Evidence Request Ordered', desc: 'A further Request for Evidence was ordered.', cat: 'rfe' },
  IK:   { name: 'Request for Additional Evidence Sent', desc: 'The Request for Evidence is in the mail; respond by the deadline it states.', cat: 'rfe' },
  HA:   { name: 'RFE Response Received by USCIS', desc: 'Your evidence response arrived and the case is moving again.', cat: 'rfe' },
  // Denied / adverse
  EA:   { name: 'Denial Notice Ordered', desc: 'A denial notice was ordered.', cat: 'denied' },
  IFA:  { name: 'Denial Notice Sent', desc: 'The denial notice was mailed.', cat: 'denied' },
  FE:   { name: 'Intent to Deny Ordered (NOID)', desc: 'A Notice of Intent to Deny was ordered; there is an opportunity to respond before a final decision.', cat: 'denied' },
  II:   { name: 'Notice of Intent to Deny Sent (NOID)', desc: 'A Notice of Intent to Deny was mailed; respond within the stated window.', cat: 'denied' },
  // Closed
  EX:   { name: 'System Closure', desc: 'The case record was closed in the system.', cat: 'closed' },
  EN:   { name: 'Case Terminated', desc: 'The case was terminated — status may have been obtained another way.', cat: 'closed' },
  EZ:   { name: 'Administrative Close', desc: 'USCIS closed the case administratively.', cat: 'closed' },
};

const CAT_STYLE = {
  receipt:    { cls: 'badge-blue',   dot: '#22518f', label: 'Receipt' },
  checks:     { cls: 'badge-purple', dot: '#5c3d94', label: 'Background' },
  interview:  { cls: 'badge-gold',   dot: '#d4a843', label: 'Interview' },
  approved:   { cls: 'badge-green',  dot: '#1a6b37', label: 'Approved' },
  denied:     { cls: 'badge-red',    dot: '#b3222e', label: 'Denied' },
  hold:       { cls: 'badge-orange', dot: '#8f4a00', label: 'Hold' },
  processing: { cls: 'badge-blue',   dot: '#22518f', label: 'Processing' },
  card:       { cls: 'badge-green',  dot: '#1a6b37', label: 'Green Card' },
  rfe:        { cls: 'badge-red',    dot: '#b3222e', label: 'RFE' },
  closed:     { cls: 'badge-gray',   dot: '#8fa0bd', label: 'Closed' },
  default:    { cls: 'badge-gray',   dot: '#8fa0bd', label: 'Event' },
};

const FLAG_SVG = `<svg class="flag" viewBox="0 0 64 60" aria-hidden="true">
  <line x1="4" y1="2" x2="4" y2="58" stroke="var(--text-dim)" stroke-width="2.5" stroke-linecap="round" />
  <rect x="6" y="4" width="52" height="30" fill="var(--stripe-white)" />
  <rect x="6" y="4" width="52" height="4.3" fill="var(--stripe-red)" />
  <rect x="6" y="12.6" width="52" height="4.3" fill="var(--stripe-red)" />
  <rect x="6" y="21.2" width="52" height="4.3" fill="var(--stripe-red)" />
  <rect x="6" y="29.7" width="52" height="4.3" fill="var(--stripe-red)" />
  <rect x="6" y="4" width="22" height="17" fill="var(--canton)" />
  <circle cx="11" cy="8.5" r="1.3" fill="#fff" /> <circle cx="17" cy="8.5" r="1.3" fill="#fff" />
  <circle cx="23" cy="8.5" r="1.3" fill="#fff" /> <circle cx="14" cy="13" r="1.3" fill="#fff" />
  <circle cx="20" cy="13" r="1.3" fill="#fff" /> <circle cx="11" cy="17.5" r="1.3" fill="#fff" />
  <circle cx="17" cy="17.5" r="1.3" fill="#fff" /> <circle cx="23" cy="17.5" r="1.3" fill="#fff" />
</svg>`;

/* ═════════════════════════════════════════════════════════════
   STATE — timestamps in the JSON are UTC (Zulu) and are shown
   in the visitor's own timezone, detected from the browser.
   ═════════════════════════════════════════════════════════════ */
const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
let currentData = null;

const $ = id => document.getElementById(id);

/* ═════════════════════════════════════════════════════════════
   TIME FORMATTING (Intl API — DST-aware)
   ═════════════════════════════════════════════════════════════ */
function tzAbbr(date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: LOCAL_TZ, timeZoneName: 'short' })
      .formatToParts(date instanceof Date ? date : new Date(date));
    return parts.find(p => p.type === 'timeZoneName')?.value || '';
  } catch { return ''; }
}

function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return '—';
  try {
    return d.toLocaleDateString('en-US', { timeZone: LOCAL_TZ, year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return '—'; }
}

function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d)) return '';
  try {
    return d.toLocaleTimeString('en-US', { timeZone: LOCAL_TZ, hour: '2-digit', minute: '2-digit', hour12: true })
      + ' ' + tzAbbr(d);
  } catch { return ''; }
}

function fmtFull(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return '—';
  return fmtDate(ts) + ' · ' + fmtTime(ts);
}

function daysBetween(a, b) {
  return Math.round(Math.abs(new Date(b) - new Date(a)) / 86400000);
}

/* ═════════════════════════════════════════════════════════════
   FORM-AWARE LABELS (I-485 / I-765 / I-131)
   ═════════════════════════════════════════════════════════════ */
function cardInfo(formType) {
  switch ((formType || '').toUpperCase()) {
    case 'I-485': return { short: 'Green Card', full: 'Permanent Resident Card (Green Card)' };
    case 'I-765': return { short: 'EAD Card', full: 'Employment Authorization Document (EAD Card)' };
    case 'I-131': return { short: 'Travel Document', full: 'Travel Document (Advance Parole)' };
    default:      return { short: 'Document/Card', full: 'Document or Card' };
  }
}

function eventInfo(code, formType, formName) {
  if (code === 'SA') {
    return {
      name: formName ? `Approval of ${formName}` : (formType ? `Approval of ${formType}` : 'Application Approved'),
      desc: 'USCIS approved the application and ordered the approval notice.',
      cat: 'approved',
    };
  }
  const raw = EVENT_CODES[code];
  if (!raw) {
    return {
      name: `Event: ${code}`,
      desc: `Internal USCIS event code "${code}" — see the NIEM v5.0 schema (scr:BenefitDocumentStatusCategoryCodeSimpleType) for its formal definition.`,
      cat: 'default',
    };
  }
  if (!formType) return raw;

  // Adapt Green Card wording to the actual form type (EAD, travel doc, etc.)
  const ci = cardInfo(formType);
  let { name, desc } = raw;
  name = name.replace(/Green Card/g, ci.short);
  desc = desc
    .replace(/Permanent Resident Card \(Green Card\)/gi, ci.full)
    .replace(/Green Card/gi, ci.short);
  return { name, desc, cat: raw.cat };
}

function catStyle(cat, formType) {
  const s = CAT_STYLE[cat] || CAT_STYLE.default;
  if (cat === 'card' && formType) return { ...s, label: cardInfo(formType).short };
  return s;
}

/* ═════════════════════════════════════════════════════════════
   INPUT HANDLING
   ═════════════════════════════════════════════════════════════ */
function clearAll() {
  $('jsonInput').value = '';
  $('output').style.display = 'none';
  $('errorBar').classList.remove('show');
  currentData = null;
}

function showErr(msg) {
  const bar = $('errorBar');
  bar.innerHTML = '<strong>⚠ Error:</strong> ' + msg;
  bar.classList.add('show');
}

function parseAndRender() {
  const raw = $('jsonInput').value.trim();
  $('errorBar').classList.remove('show');
  if (!raw) { showErr('Please paste your USCIS API JSON first.'); return; }

  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { showErr('Invalid JSON — ' + e.message); return; }

  let d = parsed.data || parsed;
  // Accept a bare array of event objects too
  if (Array.isArray(d)) d = { events: d, receiptNumber: d[0]?.receiptNumber };
  if (!d.receiptNumber && !d.formType && !d.events) {
    showErr('This does not appear to be a USCIS API JSON. Expected fields like "receiptNumber", "formType", or "events".');
    return;
  }

  currentData = d;
  $('output').style.display = 'block';
  renderAll(d);
  window.scrollTo({ top: $('caseDetailsGrid').offsetTop - 20, behavior: 'smooth' });
}

/* ═════════════════════════════════════════════════════════════
   RENDER
   ═════════════════════════════════════════════════════════════ */
const APPROVAL_CODES = ['DA', 'DH', 'IEA', 'IEE', 'IEC', 'H008'];
const DENIAL_CODES = ['EA', 'IFA'];
const BACKDATE_TOLERANCE_MS = 86400000; // flag events recorded >1 day after their effective date

function renderAll(d) {
  const events = d.events || [];
  const notices = d.notices || [];
  const subTs = d.submissionTimestamp || d.submissionDate;
  const updTs = d.updatedAtTimestamp || d.updatedAt;
  const codes = events.map(e => e.eventCode);
  const f = ts => fmtFull(ts);

  const isApproved = codes.some(c => APPROVAL_CODES.includes(c));
  const isDenied = codes.some(c => DENIAL_CODES.includes(c));
  const caseEnded = d.closed === true || isApproved || isDenied;

  let daysSub = '—', daysLabel = 'Days in Process', daysTitle = '';
  if (subTs) {
    if (caseEnded && updTs) {
      daysSub = daysBetween(subTs, updTs);
      daysLabel = 'Days, Filing to Close';
      daysTitle = `From the filing date to the last case update (${fmtDate(updTs)}) — the case is decided/closed.`;
    } else {
      daysSub = daysBetween(subTs, new Date());
      daysTitle = `From the filing date to today (${fmtDate(new Date())}) — the case is still in progress.`;
    }
  }

  const latestEv = [...events].sort((a, b) =>
    new Date(b.createdAtTimestamp || b.eventTimestamp) - new Date(a.createdAtTimestamp || a.eventTimestamp))[0];
  const latestRow = latestEv
    ? `${eventInfo(latestEv.eventCode, d.formType, d.formName).name} · ${fmtDate(latestEv.createdAtTimestamp || latestEv.eventTimestamp)}`
    : '—';

  $('caseDetailsGrid').innerHTML = `
    <div class="card">
      <div class="card-title">📋 Case Details</div>
      <div class="detail-row"><span class="detail-key">Receipt Number</span><span class="detail-val mono receipt-no">${d.receiptNumber || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Form Type</span><span class="detail-val">${d.formType || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Form Name</span><span class="detail-val small">${d.formName || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Applicant Name</span><span class="detail-val">${d.applicantName || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Filed</span><span class="detail-val mono small">${f(subTs)}</span></div>
      <div class="detail-row"><span class="detail-key">Last Updated</span><span class="detail-val mono small">${f(updTs)}</span></div>
      <div class="detail-row"><span class="detail-key">Most Recent Update</span><span class="detail-val small">${latestRow}</span></div>
      <div class="detail-row" title="${daysTitle}"><span class="detail-key">${daysLabel}</span><span class="detail-val" style="color:var(--navy);font-weight:700">${daysSub}${daysSub === '—' ? '' : ' days'}</span></div>
    </div>
    <div class="tz-note">* All times shown in your local timezone — ${LOCAL_TZ.replace('_', ' ')} (${tzAbbr(new Date())}), converted from the UTC timestamps in the record.</div>`;


  // ── Timeline: destination flag + events + submission + silent update ──
  const items = events.map(ev => ({
    type: 'event',
    ts: ev.createdAtTimestamp || ev.eventTimestamp,
    code: ev.eventCode,
    eventId: ev.eventId,
    rawDT: ev.eventDateTime || '',
    rawTS: ev.eventTimestamp || '',
  }));

  if (subTs) items.push({ type: 'submission', ts: subTs });

  if (updTs) {
    const latestEventTime = events.reduce((m, ev) => {
      const t = new Date(ev.eventTimestamp || ev.createdAtTimestamp);
      return t > m ? t : m;
    }, new Date(0));
    if (new Date(updTs) > latestEventTime) items.push({ type: 'silent-update', ts: updTs });
  }

  items.sort((a, b) => new Date(b.ts) - new Date(a.ts));

  const terminus = `
    <div class="tl-terminus">
      <div></div>
      <div class="flag-wrap">${FLAG_SVG}</div>
      <div class="label">${caseEnded ? 'Destination reached — decision issued' : 'The road ahead — decision pending'}</div>
    </div>`;

  $('timeline').innerHTML = terminus + items.map((item, i) => {
    const line = i === items.length - 1 ? '' : '<div class="tl-line"></div>';
    const dateCol = `<div class="tl-date"><div class="tl-date-main">${fmtDate(item.ts)}</div><div class="tl-date-time">${fmtTime(item.ts)}</div></div>`;

    if (item.type === 'submission') {
      return `
      <div class="timeline-item">
        ${dateCol}
        <div class="tl-spine"><div class="tl-star" style="background:var(--blue)"></div>${line}</div>
        <div class="tl-content">
          <div class="tl-content-top"><div class="tl-event-name">Application Filed &amp; Submitted</div><span class="tl-event-code">FILED</span></div>
          <div class="tl-badges"><span class="badge badge-blue">Filing — journey begins 🧳</span></div>
          <div class="tl-event-desc">
            The <strong>${d.formType || 'I-485'}</strong> was filed with USCIS through <strong>${d.elisChannelType || 'Lockbox'}</strong>
            and entered the ELIS system as receipt <strong>${d.receiptNumber || '—'}</strong>.
          </div>
          <div class="tl-event-id">Source: submissionTimestamp field in case record</div>
        </div>
      </div>`;
    }

    if (item.type === 'silent-update') {
      return `
      <div class="timeline-item">
        ${dateCol}
        <div class="tl-spine"><div class="tl-star" style="background:var(--purple)"></div>${line}</div>
        <div class="tl-content">
          <div class="tl-content-top">
            <div>
              <div class="tl-event-name">Quiet Record Update</div>
              <div class="tl-badges"><span class="badge badge-purple">No Event Code</span></div>
            </div>
            <span class="tl-silent-code">NO-CODE</span>
          </div>
          <div class="tl-event-desc">
            USCIS touched the case record without logging a formal event code — often an internal note, a
            reassignment, or a supervisor opening the file. No action is implied either way.
          </div>
          <div class="tl-event-id">Source: updatedAtTimestamp field in case record</div>
        </div>
      </div>`;
    }

    const info = eventInfo(item.code, d.formType, d.formName);
    const style = catStyle(info.cat, d.formType);
    const rawNote = item.rawDT ? ` · Effective: ${fmtFull(item.rawTS || item.rawDT)}` : '';

    // Backdating check: recorded (createdAt) well after the event's own effective date
    let warnHTML = '';
    if (item.rawTS && item.ts && item.rawTS !== item.ts) {
      const lagMs = new Date(item.ts) - new Date(item.rawTS);
      if (lagMs > BACKDATE_TOLERANCE_MS) {
        const lagDays = Math.round(lagMs / 86400000);
        warnHTML = `<div class="tl-warn">⚠️ <strong>Backdated entry:</strong> this event was recorded on
          <strong>${fmtDate(item.ts)}</strong>, but its effective event date is
          <strong>${fmtDate(item.rawTS)}</strong> — ${lagDays} day${lagDays === 1 ? '' : 's'} earlier.
          USCIS logged this event after the date it applies to; the timeline position reflects when it was recorded.</div>`;
      }
    }

    return `
      <div class="timeline-item">
        ${dateCol}
        <div class="tl-spine"><div class="tl-star" style="background:${style.dot}"></div>${line}</div>
        <div class="tl-content">
          <div class="tl-content-top">
            <div class="tl-event-name">${info.name}${warnHTML ? ' <span class="warn-flag" title="Backdated entry">⚠️</span>' : ''}</div>
            <span class="tl-event-code">${item.code}</span>
          </div>
          <div class="tl-badges"><span class="badge ${style.cls}">${style.label}</span></div>
          <div class="tl-event-desc">${info.desc}</div>
          ${warnHTML}
          <div class="tl-event-id">${item.eventId ? `ID ${item.eventId} · ` : ''}Recorded: createdAtTimestamp${rawNote}</div>
        </div>
      </div>`;
  }).join('');

  renderSummary(d, events, notices, codes);
}

/* ═════════════════════════════════════════════════════════════
   SUMMARY — journey tracker + narrative
   ═════════════════════════════════════════════════════════════ */
function renderSummary(d, events, notices, codes) {
  const f = ts => fmtFull(ts);
  const applicant = d.applicantName || 'the applicant';
  const form = d.formType || 'I-485';
  const ci = cardInfo(form);

  const isApproved = codes.some(c => APPROVAL_CODES.includes(c));
  const isDenied = codes.some(c => DENIAL_CODES.includes(c));
  const hasInterview = codes.some(c => ['FJ', 'HG'].includes(c));
  const hasPostIvChk = codes.includes('FTA1');
  const hasBgChecks = codes.some(c => ['FTA0', 'FTA1'].includes(c));
  const hasRFE = codes.some(c => ['FBA', 'FBB', 'IK', 'IKA'].includes(c));
  const hasCardProduced = codes.includes('LDA');
  const hasCardMailed = codes.includes('LEA');
  const hasCardRequested = codes.includes('LAA');
  const hasDecision = isApproved || isDenied || hasCardProduced;
  const isAdjAcked = d.ackedByAdjudicatorAndCms;
  const isClosed = d.closed === true;
  const interviewWaived = hasDecision && !hasInterview;

  // ── Stage index ──
  let stageIdx = 0;
  if (codes.some(c => ['IAF', 'IAA', 'AALB'].includes(c))) stageIdx = 1;
  if (hasBgChecks) stageIdx = 2;
  if (hasInterview) stageIdx = 3;
  if (hasInterview && hasPostIvChk) stageIdx = 4;
  if (hasDecision) stageIdx = 5;

  const stages = interviewWaived
    ? [
        { name: 'Filed', done: stageIdx >= 1 },
        { name: 'Receipt', done: stageIdx >= 1 },
        { name: 'Background Checks', done: stageIdx >= 2 },
        { name: 'Interview Waived', done: true },
        { name: 'Decision', done: stageIdx >= 5 },
      ]
    : [
        { name: 'Filed', done: stageIdx >= 1 },
        { name: 'Receipt', done: stageIdx >= 1 },
        { name: 'Background Checks', done: stageIdx >= 2 },
        { name: 'Interview', done: stageIdx >= 3 },
        { name: 'Final Review', done: stageIdx >= 4, active: stageIdx === 4 },
        { name: 'Decision', done: stageIdx >= 5, active: stageIdx === 4 },
      ];

  // Last stage renders as the destination flag; the rest are stars
  const stepsHTML = stages.map((s, i) => {
    const isLast = i === stages.length - 1;
    let node;
    if (isLast) {
      node = `<div class="progress-step-inner">${FLAG_SVG.replace('class="flag"', 'class="flag" style="height:30px"')}<div class="progress-step-name">${s.name}</div></div>`;
    } else {
      let cls = 'pending';
      if (s.done && !s.active) cls = 'done';
      else if (s.active) cls = 'active';
      node = `<div class="progress-step-inner"><div class="pstar ${cls}"><div class="shape"></div></div><div class="progress-step-name">${s.name}</div></div>`;
    }
    const connCls = !isLast
      ? (stages[i + 1].done && !stages[i + 1].active ? 'filled' : (s.done && !s.active ? 'filled' : ''))
      : '';
    return node + (!isLast ? `<div class="progress-connector ${connCls}"></div>` : '');
  }).join('');

  // ── Key timestamps ──
  const evTs = code => {
    const ev = events.find(e => e.eventCode === code);
    return ev ? f(ev.createdAtTimestamp || ev.eventTimestamp) : null;
  };
  const ivNotice = notices.find(n => n.actionType === 'Interview Scheduled');
  const ivDateStr = ivNotice ? f(ivNotice.appointmentDateTime) : null;
  const h008ts = evTs('H008');
  const ldaTs = evTs('LDA');
  const leaTs = evTs('LEA');
  const fta1ts = evTs('FTA1');

  // ── Narrative ──
  const codeChip = c => `<span class="mono code-chip">${c}</span>`;
  let narrative = '';

  if (isApproved && isClosed) {
    narrative = `<p><strong>🎉 Congratulations!</strong> USCIS has <span class="hl-g">APPROVED</span> the <strong>${form}</strong> for <strong>${applicant}</strong> and the case is closed.`;
    if (interviewWaived) narrative += ` The record shows no interview events — USCIS decided the case on the strength of the file alone.`;
    narrative += `</p>`;
    if (h008ts) narrative += `<p>The approval (event code ${codeChip('H008')}) hit the system on <span class="hl">${h008ts}</span>.</p>`;
    if (hasCardProduced) {
      narrative += `<p>The ${ci.full} has been <span class="hl-g">printed</span>${ldaTs ? ` as of <span class="hl">${ldaTs}</span>` : ''}.`;
      if (hasCardMailed) {
        narrative += ` It went <span class="hl-g">into the mail</span>${leaTs ? ` on <span class="hl">${leaTs}</span>` : ''} and typically arrives within about 7–10 business days.`;
      } else if (hasCardRequested) {
        narrative += ` The mailing step should follow shortly.`;
      }
      narrative += `</p>`;
    } else {
      narrative += `<p>Watch the mail for the approval notice; if nothing arrives within a couple of weeks, verify the mailing address in your USCIS online account.</p>`;
    }

  } else if (isApproved && !isClosed) {
    narrative = `<p><strong>🎉 Great news!</strong> The <strong>${form}</strong> for <strong>${applicant}</strong> shows an <span class="hl-g">APPROVAL</span>.`;
    if (interviewWaived) narrative += ` No interview events appear — the case was decided on the record.`;
    narrative += ` The record is still open, which usually just means the ${ci.short} hasn't finished production or mailing yet.</p>`;
    if (h008ts) narrative += `<p>Approval (event code ${codeChip('H008')}) recorded on <span class="hl">${h008ts}</span>.</p>`;
    if (hasCardProduced && ldaTs) {
      narrative += `<p>${ci.short} printed on <span class="hl">${ldaTs}</span>.${hasCardMailed && leaTs ? ` Mailed on <span class="hl">${leaTs}</span> — allow about 7–10 business days for delivery.` : ''}</p>`;
    }
    if (isAdjAcked) narrative += `<p>The adjudicating officer and CMS have both signed off, so the decision is final at the supervisory level.</p>`;

  } else if (isDenied) {
    narrative = `
      <p><span class="hl-r">⚠ The record shows a denial notice</span> for the <strong>${form}</strong> of <strong>${applicant}</strong>. Depending on the circumstances, options can include a Motion to Reopen/Reconsider (Form I-290B) or an appeal — all with strict deadlines.</p>
      <p>Speak with a licensed immigration attorney promptly to understand what applies to this case.</p>`;

  } else if (hasPostIvChk && hasInterview) {
    narrative = `<p><strong>The case is in final review after the interview.</strong>`;
    if (ivDateStr) narrative += ` The interview took place on or around <span class="hl">${ivDateStr}</span>.`;
    if (fta1ts) narrative += ` Refreshed background checks (event code ${codeChip('FTA1')}) came back on <span class="hl">${fta1ts}</span> — a step that usually accompanies the closing review.`;
    narrative += `</p>`;
    if (isAdjAcked) narrative += `<p>Both the adjudicating officer and CMS have acknowledged the case — a good sign that a supervisor is finishing the file.</p>`;
    narrative += `<p><span class="hl-g">Nothing is needed from you right now.</span> A decision would be the natural next entry on this timeline.</p>`;

  } else if (hasPostIvChk && !hasInterview) {
    narrative = `<p><strong>The case for ${applicant} is in final review.</strong> Background checks are complete${fta1ts ? ` as of <span class="hl">${fta1ts}</span>` : ''}, and no interview events appear — consistent with an interview being waived.</p>`;
    if (isAdjAcked) narrative += `<p>Officer and CMS acknowledgment is on file, which usually accompanies the closing supervisory review.</p>`;
    narrative += `<p><span class="hl-g">Nothing is needed from you right now.</span> A decision would be the natural next entry on this timeline.</p>`;

  } else if (hasInterview) {
    narrative = `<p><strong>An interview has been scheduled or completed for ${applicant}.</strong>`;
    if (ivDateStr) narrative += ` Appointment: <span class="hl">${ivDateStr}</span>.`;
    narrative += ` After the interview, the officer weighs the testimony, evidence, and background checks together.</p>`;
    narrative += `<p>Post-interview review commonly runs from weeks to a few months depending on the field office. Unless USCIS reaches out, there is nothing to do but wait.</p>`;

  } else if (hasRFE) {
    narrative = `<p><span class="hl">⚠ USCIS has asked for more evidence</span> on the case of <strong>${applicant}</strong>. Watch your mail and your USCIS online account for the request, and respond before its deadline — missing it can sink the application.</p>`;

  } else if (hasBgChecks) {
    narrative = `<p><strong>Background checks are underway or complete</strong> for the <strong>${form}</strong> of <strong>${applicant}</strong>, and the case is moving through the normal pipeline. No interview is on the calendar yet; timing from here varies widely by field office.</p>`;

  } else {
    narrative = `<p><strong>The case for ${applicant} is in its early stages.</strong> USCIS has the <strong>${form}</strong> and is working through intake and initial verification.</p>`;
  }

  $('summaryCard').innerHTML = `
    <div class="progress-track">
      <div class="progress-label">★ The Journey to Decision</div>
      <div class="progress-steps">${stepsHTML}</div>
    </div>
    <div class="sum-body">
      ${narrative}
      ${d.actionRequired
        ? `<p><span class="hl-r">⚠ The record flags this case as needing action from you — log in to your USCIS online account right away.</span></p>`
        : `<p class="ok-line">✓ Nothing is currently required from you. Keep an eye on your USCIS online account for changes.</p>`}
    </div>`;
}

/* ═════════════════════════════════════════════════════════════
   INIT
   ═════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  $('clearBtn').addEventListener('click', clearAll);
  $('analyzeBtn').addEventListener('click', parseAndRender);
});
