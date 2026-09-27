'use strict';
/* ═════════════════════════════════════════════════════════════
   N-400 QUARTERLY TRENDS — a single interactive line chart on the
   hub, built as plain inline SVG (no charting library, keeping the
   site's zero-third-party-request policy). Reads data/n400-quarterly.js.
   Chart is decorative/supplementary; a real <table> underneath it
   carries the same numbers for screen readers and anyone who wants
   exact figures.
   ═════════════════════════════════════════════════════════════ */
const N400_METRICS = {
  received: { label: 'Forms Received', quarterField: 'received', fyField: 'fyReceived', unit: 'count', supportsCumulative: true },
  approved: { label: 'Approved', quarterField: 'approved', fyField: 'fyApproved', unit: 'count', supportsCumulative: true },
  denied: { label: 'Denied', quarterField: 'denied', fyField: 'fyDenied', unit: 'count', supportsCumulative: true },
  approvalRate: {
    label: 'Approval Rate', unit: 'percent', supportsCumulative: true,
    // Share of decided cases (approved + denied) that were approved —
    // more meaningful to an applicant than raw approval counts.
    compute: (row, useFY) => {
      const appr = useFY ? row.fyApproved : row.approved;
      const den = useFY ? row.fyDenied : row.denied;
      const total = appr + den;
      return total > 0 ? (appr / total) * 100 : null;
    },
  },
  pending: { label: 'Pending (end of quarter)', quarterField: 'pending', fyField: null, unit: 'count', supportsCumulative: false },
  processingMonths: { label: 'Median Processing Time', quarterField: 'processingMonths', fyField: null, unit: 'months', supportsCumulative: false },
};

let n400State = { metric: 'received', view: 'quarter' };

function n400FormatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
}
function n400FormatValue(n, unit) {
  if (n == null) return '—';
  if (unit === 'months') return n.toFixed(1) + ' mo';
  if (unit === 'percent') return n.toFixed(1) + '%';
  return n.toLocaleString('en-US');
}
function n400FormatAxis(n, unit) {
  if (unit === 'months') return n.toFixed(0);
  if (unit === 'percent') return n.toFixed(0) + '%';
  return n400FormatCount(n);
}

function n400SeriesFor(metricKey, view) {
  const m = N400_METRICS[metricKey];
  const useFY = view === 'fy' && m.supportsCumulative;
  return N400_QUARTERLY.map(row => {
    const value = m.compute ? m.compute(row, useFY) : row[useFY ? m.fyField : m.quarterField];
    return { label: row.label, quarter: row.quarter, value };
  });
}

function n400BuildPath(points, xScale, yScale) {
  let d = '';
  let drawing = false;
  points.forEach((p, i) => {
    if (p.value == null) { drawing = false; return; }
    const cmd = drawing ? 'L' : 'M';
    d += `${cmd}${xScale(i)},${yScale(p.value)} `;
    drawing = true;
  });
  return d.trim();
}

function renderN400Chart() {
  const svgEl = $('n400ChartSvg');
  const tableBody = $('n400TableBody');
  const captionEl = $('n400ChartCaption');
  if (!svgEl) return;

  const m = N400_METRICS[n400State.metric];
  const view = m.supportsCumulative ? n400State.view : 'quarter';
  const series = n400SeriesFor(n400State.metric, view);
  const values = series.map(p => p.value).filter(v => v != null);
  const dataMax = Math.max(...values);
  // Counts and months always start the axis at zero — truncating those
  // would exaggerate the trend. A percentage that naturally clusters near
  // 100 is different: forcing 0-100 flattens real variation into a sliver,
  // and the axis labels stay honest either way, so this one zooms in.
  let minVal = 0, maxVal = dataMax;
  if (m.unit === 'percent') {
    const dataMin = Math.min(...values);
    minVal = Math.max(0, Math.floor(dataMin / 5) * 5);
    maxVal = Math.min(100, Math.ceil(dataMax / 5) * 5);
  }

  const W = 760, H = 300;
  const padL = 54, padR = 16, padT = 16, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = series.length;
  const xScale = i => padL + (i / (n - 1)) * plotW;
  const yScale = v => padT + plotH - ((v - minVal) / (maxVal - minVal || 1)) * plotH;

  const gridCount = 4;
  const gridLines = [];
  for (let g = 0; g <= gridCount; g++) {
    const val = minVal + ((maxVal - minVal) / gridCount) * g;
    const y = yScale(val);
    gridLines.push(`<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" class="n400-grid"/>`
      + `<text x="${padL - 8}" y="${y + 4}" class="n400-axis-label" text-anchor="end">${esc(n400FormatAxis(val, m.unit))}</text>`);
  }

  // Evenly-spaced label picks (always including first/last) rather than a
  // fixed modulo, which can leave two labels crammed together at the end
  // when n isn't a clean multiple of the step.
  const targetLabels = Math.min(9, n);
  const shownIdx = new Set();
  for (let k = 0; k < targetLabels; k++) {
    shownIdx.add(Math.round((k / (targetLabels - 1)) * (n - 1)));
  }
  const xLabels = series.map((p, i) => {
    if (!shownIdx.has(i)) return '';
    const anchor = i === 0 ? 'start' : (i === n - 1 ? 'end' : 'middle');
    return `<text x="${xScale(i)}" y="${H - padB + 18}" class="n400-axis-label" text-anchor="${anchor}">${esc(p.label)}</text>`;
  }).join('');

  const pathD = n400BuildPath(series, xScale, yScale);
  const points = series.map((p, i) => {
    if (p.value == null) return '';
    return `<circle cx="${xScale(i)}" cy="${yScale(p.value)}" r="3.5" class="n400-point" tabindex="0">
      <title>${esc(p.quarter)}: ${esc(n400FormatValue(p.value, m.unit))}</title>
    </circle>`;
  }).join('');

  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.setAttribute('role', 'img');
  svgEl.setAttribute('aria-label', `Line chart: ${m.label}${view === 'fy' ? ', fiscal-year cumulative' : ' per quarter'}, ${series[0].label} to ${series[n - 1].label}. See the table below for exact figures.`);
  svgEl.innerHTML = `
    ${gridLines.join('')}
    <path d="${pathD}" class="n400-line" fill="none"/>
    ${points}
    ${xLabels}`;

  captionEl.textContent = `${m.label}${view === 'fy' ? ' — fiscal-year cumulative' : ' — per quarter'}`;

  tableBody.innerHTML = series.map(p =>
    `<tr><td>${esc(p.quarter)}</td><td>${esc(n400FormatValue(p.value, m.unit))}</td></tr>`).join('');

  document.querySelectorAll('.n400-metric-btn').forEach(btn => {
    const active = btn.dataset.metric === n400State.metric;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.n400-view-btn').forEach(btn => {
    const active = btn.dataset.view === view;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.disabled = !m.supportsCumulative;
  });
  $('n400ViewGroup').classList.toggle('is-disabled', !m.supportsCumulative);
}

// Client-side only — builds the CSV in memory and hands it to the browser
// as a local blob: URL, no network request involved (same as the chart
// itself, this never leaves the device).
function n400ExportCSV() {
  const m = N400_METRICS[n400State.metric];
  const view = m.supportsCumulative ? n400State.view : 'quarter';
  const series = n400SeriesFor(n400State.metric, view);
  const colLabel = m.label + (view === 'fy' ? ' (Fiscal Year Cumulative)' : ' (Per Quarter)');
  const lines = [`Quarter,"${colLabel}"`, ...series.map(p => `"${p.quarter}",${p.value == null ? '' : p.value}`)];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `n400-${n400State.metric}-${view}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

window.addEventListener('DOMContentLoaded', () => {
  if (!$('n400ChartSvg')) return;

  $('n400SourceLink') && ($('n400SourceLink').href = N400_DATA_SOURCE_URL);
  $('n400UpdatedNote') && ($('n400UpdatedNote').textContent = N400_DATA_UPDATED);
  $('n400DownloadBtn') && $('n400DownloadBtn').addEventListener('click', n400ExportCSV);

  document.querySelectorAll('.n400-metric-btn').forEach(btn => {
    btn.addEventListener('click', () => { n400State.metric = btn.dataset.metric; renderN400Chart(); });
  });
  document.querySelectorAll('.n400-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      n400State.view = btn.dataset.view;
      renderN400Chart();
    });
  });

  renderN400Chart();
});
