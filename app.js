(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- tooltip ---------- */
  var tip = $('#tip');
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.hidden = false;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(Math.max(8, x + 14), window.innerWidth - w - 8);
    var top = y - h - 12; if (top < 8) top = y + 18;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hideTip() { tip.hidden = true; }
  function bindTip(el, html) {
    el.addEventListener('pointermove', function (e) { showTip(html(), e.clientX, e.clientY); });
    el.addEventListener('pointerleave', hideTip);
    el.addEventListener('focus', function () { var r = el.getBoundingClientRect(); showTip(html(), r.left + r.width / 2, r.top); });
    el.addEventListener('blur', hideTip);
  }
  window.addEventListener('scroll', hideTip, { passive: true });

  function segmented(root, attr, onChange) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', root).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      onChange(b.dataset[attr]);
    });
  }

  /* ---------- theme ---------- */
  $('#themeBtn').addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next; store.set('theme', next);
    drawLab();
  });

  /* ---------- role fit ---------- */
  var EV = {
    hub: ['OLG', 'Put data quality into the critical path of the Customer Hub (Siebel) master data project: automated corrections, grey-area records isolated for steward review, and ongoing monitoring.'],
    golden: ['OLG', 'Brought Informatica Data Quality into operation for address validation and golden-record processing, spanning reference and master data management.'],
    tier1: ['OLG', 'Curated Tier 1 rules on customer tombstone data, the top layer of a three-layer control model.'],
    okr: ['OLG', 'Built the data quality coverage report for the customer insights OKR, showing coverage of priority applications across business branches.'],
    watsonx: ['OLG', 'Led the migration of governance content and data quality rules from on-premises IBM InfoSphere to SaaS IBM watsonx.data intelligence, with a parallel test environment of synthetic data.'],
    framework: ['OLG', 'Designed and built a config-driven (YAML) Python framework on Cloudera AI that kept critical data element checks running while the primary data quality tool was unavailable.'],
    infosphere: ['OLG', 'Retired Informatica Data Quality and moved data quality and metadata to IBM InfoSphere as OLG consolidated its warehouses into a Cloudera data lake, resolving HDFS, Parquet and Hive integration problems.'],
    envs: ['OLG', 'Led a development, test and staging environment model for the Customer Hub project and kept testing moving through two major vendor transitions.'],
    strategy: ['OLG', 'Authored the enterprise data quality strategy: a 14-section framework covering standards, controls, monitoring, issue management, tooling, regulatory alignment and a maturity roadmap.'],
    model: ['OLG', 'Architected a three-layer control model: curated Tier 1 rules, automated completeness for all critical data elements, and data observability across all of them.'],
    roadmap: ['OLG', 'Led the strategy for data observability, AI-assisted governance and the governance technology roadmap.'],
    defect: ['OLG', 'On my own initiative, led an upgrade of the defect management platform for all testing teams, which let OLG retire a second vendor\'s tool and its costs.'],
    budget: ['Community', 'Led development of the Local Services Board budget for fire protection, recreation and emergency telecommunications, and managed a $70,000–$90,000 fire department operating budget.'],
    govern: ['OLG', 'Helped build OLG\'s Data Governance function from the ground up, aligned to DAMA-DMBOK and COBIT: data owner and steward roles, a governance council and data domains.'],
    consult: ['OLG', 'Consulted groups across the corporation to define how data governance would work with them.'],
    comply: ['Community', 'Kept equipment and stations OHSA-compliant and training aligned to NFPA standards as Fire Chief.'],
    portal: ['OLG', 'Architected a central results database and a results portal with drill-down to failed records, trends and alerts, giving data owners one view of data health across tools.'],
    learn: ['OLG', 'Designed and wrote a 3-module, 17-lesson learning portal to train data stewards and owners, with guides, scenario quizzes, practice games and progress tracking.'],
    observe: ['OLG', 'Built a data observability layer in Python with z-score drift detection against a 30-day rolling baseline.'],
    ml: ['OLG', 'Set up a machine learning model that learned weekend and holiday patterns in data volumes and spend where z-scores raised false alerts.'],
    aidev: ['OLG', 'AI-assisted development with GitHub Copilot, Copilot Studio agents and MCP.'],
    chief: ['Community', 'Fire Chief for 11 years: led a 21-person volunteer department including four captains, setting priorities and expectations and coaching and developing members.'],
    instruct: ['Community', 'Planned and delivered training and drills as an NFPA-qualified instructor, and helped coordinate pooled courses for 26 fire departments in the Algoma District.'],
    debrief: ['Community', 'Held weekly debriefs on every call, focused on what went well and what to improve. These were the main driver of change in the department.'],
    skate: ['Community', 'As President of the Superior Community Skatepark Association, led the team that raised over $400,000 from the community and two levels of government.'],
    tools: ['OLG', 'Hands-on with IBM watsonx.data intelligence, IBM InfoSphere, Informatica Data Quality, Power BI, Alteryx and Cognos, on Cloudera Data Platform.'],
    geo: ['Projects', 'GIS and LiDAR analysis in Python (Leaflet, GeoJSON, Shapely, pyproj), with network routing and spatial clustering on Ontario provincial data.'],
    lidar: ['Projects', 'FireSmart LiDAR risk map: a config-driven scoring pipeline over 111 LiDAR tiles and 603 houses, with every threshold in one file so it can be tuned without touching code.'],
    atlas: ['Projects', 'Water Source Evaluation Atlas: turned "where should new water supply go?" into five checkable steps, written in plain language for residents and decision-makers.'],
    lsb: ['Community', 'Reported to the Local Services Board at each monthly public meeting on the month\'s calls, training status and project updates.']
  };
  var FIT = {
    tech: [
      ['Customer data platform and trusted customer data', 'Oversee the operation, support and adoption of the Customer Data Platform so trusted customer data is available for analytics, marketing and decisions.', ['hub', 'golden', 'tier1', 'okr']],
      ['Platform strategy, operations and lifecycle', 'Lead the strategy, operations, support and lifecycle of enterprise analytics and customer data technologies, keeping them secure, reliable and available.', ['watsonx', 'framework', 'infosphere', 'envs']],
      ['Roadmaps and continuous improvement', 'Develop and deliver technology roadmaps and enhancements that modernize capabilities, increase adoption and maximize value.', ['roadmap', 'strategy', 'model']],
      ['Vendors, licensing and cost', 'Manage vendor relationships, licensing, renewals, escalations, budgets and technology investments.', ['defect', 'watsonx', 'envs', 'budget']],
      ['Security, privacy, governance and records', 'Ensure technologies meet security, privacy, information governance, records management and regulatory requirements.', ['govern', 'consult', 'comply']],
      ['Service KPIs, adoption and usage reporting', 'Establish, monitor and share service performance indicators, adoption measures and platform usage reports.', ['portal', 'okr', 'learn', 'observe']],
      ['Analytics, geospatial and AI platform knowledge', 'Advanced knowledge of enterprise analytics, BI, customer data and AI-enabled platforms across reporting, geospatial, advanced analytics and AI.', ['tools', 'ml', 'aidev', 'geo']],
      ['Leading, coaching and developing a team', 'Lead, coach, mentor and develop a team of specialists, with clear priorities and an inclusive, service-oriented culture.', ['chief', 'instruct', 'debrief', 'skate']]
    ],
    analytics: [
      ['Analytics delivery from intake to value', 'Lead business-aligned analytics initiatives from intake through delivery, adoption and value realization.', ['okr', 'portal', 'atlas']],
      ['Translating stakeholder priorities', 'Partner with business stakeholders to translate priorities into roadmaps, reporting solutions and measurement capabilities.', ['consult', 'atlas', 'lsb', 'hub']],
      ['KPI frameworks and trusted measures', 'Establish and maintain trusted KPI frameworks, performance measures, reporting standards and value realization approaches.', ['model', 'strategy', 'okr', 'observe']],
      ['Dashboards, scorecards and BI', 'Develop, maintain and promote trusted reporting, dashboards, performance scorecards and portfolio-level data products.', ['portal', 'okr', 'lidar', 'tools']],
      ['Reusable assets, self-service and automation', 'Convert recurring analytical demand into reusable assets, standardized reporting, self-service capabilities and automation.', ['framework', 'portal', 'lidar']],
      ['Analytics literacy and capability building', 'Develop analytics capability through coaching, literacy initiatives, learning delivery and knowledge sharing.', ['learn', 'govern', 'instruct']],
      ['Adopting advanced analytics and AI', 'Guide the team in adopting and embedding advanced analytics, experimentation and AI-enabled capabilities.', ['ml', 'roadmap', 'aidev']],
      ['Enterprise standards and governance partners', 'Partner with Data Governance, Data Platforms and AI teams, promoting responsible usage and alignment to enterprise standards.', ['govern', 'watsonx', 'tier1']],
      ['Coaching and leading people', 'Coach colleagues, allocate work to capabilities, monitor quality and help people navigate uncertainty.', ['chief', 'debrief', 'instruct', 'skate']]
    ]
  };
  var role = store.get('role') === 'analytics' ? 'analytics' : 'tech';
  var fitList = $('#fitList'), fitDetail = $('#fitDetail');
  function renderFit(sel) {
    var rows = FIT[role];
    fitList.innerHTML = rows.map(function (r, i) {
      return '<button type="button" role="tab" aria-selected="' + (i === sel) + '" data-i="' + i + '"><span>' + esc(r[0]) + '</span><span class="n">' + r[2].length + ' proof' + (r[2].length > 1 ? 's' : '') + '</span></button>';
    }).join('');
    var r = rows[sel];
    fitDetail.innerHTML = '<h3>' + esc(r[0]) + '</h3><p class="ask">The posting asks: ' + esc(r[1]) + '</p><ul class="ev">' +
      r[2].map(function (k) { return '<li><span class="where">' + EV[k][0] + '</span><p>' + esc(EV[k][1]) + '</p></li>'; }).join('') + '</ul>';
  }
  fitList.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (b) renderFit(+b.dataset.i);
  });
  fitList.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var bs = $$('button', fitList), i = bs.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault();
    var n = (i + (e.key === 'ArrowDown' ? 1 : -1) + bs.length) % bs.length;
    renderFit(n); $$('button', fitList)[n].focus();
  });
  function setRole(r) {
    role = r; store.set('role', r); document.body.dataset.role = r;
    $$('#roleSeg button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.role === r ? 'true' : 'false'); });
    $$('[data-lens-text]').forEach(function (el) { el.hidden = el.dataset.lensText !== r; });
    renderFit(0);
  }
  segmented($('#roleSeg'), 'role', setRole);
  setRole(role);

  /* ---------- control model ---------- */
  var LAYERS = [
    'Hand-written rules on the customer records that matter most, such as tombstone data, reviewed with data stewards. The most judgment, on the smallest footprint.',
    'Completeness checks generated automatically for every critical data element, so coverage does not depend on someone finding time to write a rule.',
    'Volume and drift monitoring across all critical data elements: z-score detection against a 30-day rolling baseline, plus a model for weekend and holiday patterns.'
  ];
  function setLayer(i) {
    $$('#layers .layer').forEach(function (b) { b.classList.toggle('is-on', +b.dataset.layer === i); b.setAttribute('aria-pressed', +b.dataset.layer === i); });
    $('#layerNote').textContent = LAYERS[i];
  }
  $('#layers').addEventListener('click', function (e) { var b = e.target.closest('.layer'); if (b) setLayer(+b.dataset.layer); });
  setLayer(0);

  /* ---------- observability lab (simulated) ---------- */
  var N = 119, WARM = 35, START = Date.UTC(2026, 4, 4); // Monday 4 May 2026
  var HOL = { 14: 'Victoria Day', 58: 'Canada Day', 91: 'Civic Holiday' };
  var ANOM = { 51: 'Partial load', 78: 'Duplicate batch', 103: 'Saturday feed short' };
  var series = (function () {
    var s = 20261110;
    function rnd() { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    var out = [];
    for (var i = 0; i < N; i++) {
      var d = i % 7, base = HOL[i] ? 150 : d === 5 ? 175 : d === 6 ? 120 : 100;
      var v = base + (rnd() * 10 - 5);
      if (i === 51) v = 58; if (i === 78) v = 150; if (i === 103) v = 105;
      out.push(v);
    }
    return out;
  })();
  function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
  function detect(method) {
    var res = [], resid = [];
    for (var i = 0; i < N; i++) {
      var x = series[i], exp = x, sd = 1;
      if (method === 'z') {
        var w = series.slice(Math.max(0, i - 30), i);
        if (w.length >= 14) {
          exp = w.reduce(function (a, b) { return a + b; }, 0) / w.length;
          sd = Math.sqrt(w.reduce(function (a, b) { return a + (b - exp) * (b - exp); }, 0) / w.length);
        }
      } else {
        var type = HOL[i] ? 'H' : i % 7, prior = [];
        for (var j = i - 1; j >= 0 && prior.length < 6; j--) if ((HOL[j] ? 'H' : j % 7) === type) prior.push(series[j]);
        if (prior.length) exp = median(prior);
        var rr = resid.slice(-30).map(Math.abs);
        sd = Math.max(rr.length ? 1.4826 * median(rr) : 0, 0.04 * exp);
        resid.push(x - exp);
      }
      res.push({ i: i, x: x, exp: exp, score: (x - exp) / sd });
    }
    return res;
  }
  var lab = { method: 'z', k: 2 };
  var fmtDate = function (i) { return new Date(START + i * 864e5).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }); };
  function drawLab() {
    var box = $('#labChart'); if (!box) return;
    var res = detect(lab.method).slice(WARM);
    var W = box.clientWidth, H = box.clientHeight, m = { l: 34, r: 12, t: 12, b: 24 };
    var X = function (n) { return m.l + n * (W - m.l - m.r) / (res.length - 1); };
    var Y = function (v) { return m.t + (1 - v / 200) * (H - m.t - m.b); };
    var css = getComputedStyle(document.documentElement), c = function (n) { return css.getPropertyValue(n).trim(); };
    var g = '';
    [0, 50, 100, 150, 200].forEach(function (v) {
      g += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + c(v ? '--grid' : '--axis') + '"/>' +
        '<text x="' + (m.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + v + '</text>';
    });
    res.forEach(function (r, n) {
      var d = new Date(START + r.i * 864e5);
      if (d.getUTCDate() === 1 || n === 0) g += '<text x="' + X(n) + '" y="' + (H - 6) + '" text-anchor="' + (n ? 'middle' : 'start') + '">' + d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' }) + '</text>';
    });
    var path = function (key) { return res.map(function (r, n) { return (n ? 'L' : 'M') + X(n).toFixed(1) + ' ' + Y(r[key]).toFixed(1); }).join(''); };
    g += '<path d="' + path('exp') + '" fill="none" stroke="' + c('--muted') + '" stroke-width="1.5" stroke-dasharray="4 4"/>';
    g += '<path class="ln" d="' + path('x') + '" fill="none" stroke="' + c('--s1') + '" stroke-width="2" stroke-linejoin="round"/>';
    var alerts = 0, falses = 0, caught = 0, total = 0;
    res.forEach(function (r, n) {
      var flag = Math.abs(r.score) > lab.k, real = !!ANOM[r.i], x = X(n), y = Y(r.x);
      r.flag = flag; if (real) total++;
      if (flag) { alerts++; if (real) caught++; else falses++; }
      if (flag && real) g += '<circle class="mk" cx="' + x + '" cy="' + y + '" r="6" fill="' + c('--good') + '" stroke="' + c('--surface') + '" stroke-width="2"/>';
      else if (flag) g += '<circle class="mk" cx="' + x + '" cy="' + y + '" r="5.5" fill="' + c('--surface') + '" stroke="' + c('--warning') + '" stroke-width="2"/>';
      else if (real) g += '<rect class="mkd" x="' + (x - 5) + '" y="' + (y - 5) + '" width="10" height="10" transform="rotate(45 ' + x + ' ' + y + ')" fill="' + c('--critical') + '" stroke="' + c('--surface') + '" stroke-width="2"/>';
    });
    g += '<line id="xh" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="' + c('--axis') + '" visibility="hidden"/>';
    g += '<rect id="hit" x="' + m.l + '" y="0" width="' + (W - m.l - m.r) + '" height="' + H + '" fill="transparent"/>';
    box.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '">' + g + '</svg>';
    var ln = $('.ln', box);
    if (ln && box.classList.contains('draw')) { var len = ln.getTotalLength(); ln.style.strokeDasharray = len; ln.style.strokeDashoffset = len; }
    var hit = $('#hit', box), xh = $('#xh', box);
    hit.addEventListener('pointermove', function (e) {
      var b = box.getBoundingClientRect();
      var n = Math.round((e.clientX - b.left - m.l) / ((W - m.l - m.r) / (res.length - 1)));
      n = Math.max(0, Math.min(res.length - 1, n)); var r = res[n];
      xh.setAttribute('x1', X(n)); xh.setAttribute('x2', X(n)); xh.setAttribute('visibility', 'visible');
      var state = r.flag ? (ANOM[r.i] ? 'Alert: real anomaly caught' : 'Alert: false alarm') : (ANOM[r.i] ? 'No alert: real anomaly missed' : 'No alert');
      showTip('<b>' + fmtDate(r.i) + (HOL[r.i] ? ' · ' + HOL[r.i] : '') + '</b><span>Volume ' + r.x.toFixed(0) + ' · expected ' + r.exp.toFixed(0) + '<br>Score ' + r.score.toFixed(1) + 'σ · ' + state + (ANOM[r.i] ? ' (' + ANOM[r.i].toLowerCase() + ')' : '') + '</span>', e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', function () { xh.setAttribute('visibility', 'hidden'); hideTip(); });

    $('#labStats').innerHTML =
      '<div class="stat"><b>' + alerts + '</b><span>alerts raised in 12 weeks</span></div>' +
      '<div class="stat"><b>' + falses + '</b><span>false alerts</span></div>' +
      '<div class="stat"><b>' + caught + ' of ' + total + '</b><span>real anomalies caught</span></div>';
    var note;
    if (lab.method === 'z') {
      note = falses ? 'The rolling baseline treats ordinary Saturday peaks and holidays as unusual: ' + falses + ' of ' + alerts + ' alerts are false.' : 'At this threshold the Saturday alerts go quiet.';
      if (caught < total) note += ' It also misses ' + (total - caught) + ' real ' + (total - caught > 1 ? 'anomalies' : 'anomaly') + ', because weekend spikes inflate the spread it measures against.';
    } else {
      note = 'The model compares each day with what that kind of day normally looks like. Weekends and holidays stop raising alerts' + (caught === total ? ', and all ' + total + ' real anomalies are caught, including a Saturday that came in at weekday volume.' : '.');
      if (falses) note += ' ' + falses + ' false alert' + (falses > 1 ? 's remain' : ' remains') + ' at this threshold.';
    }
    $('#labNote').textContent = note;
  }
  segmented($('#methodSeg'), 'method', function (v) { lab.method = v; drawLab(); });
  $('#kRange').addEventListener('input', function (e) { lab.k = +e.target.value; $('#kOut').textContent = lab.k.toFixed(1); drawLab(); });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(drawLab, 120); });
  drawLab();

  /* ---------- LiDAR dashboard (real aggregates, 2024 corridor run) ---------- */
  var RATINGS = ['Low', 'Moderate', 'High', 'Extreme'], ICON = { Low: '●', Moderate: '▲', High: '◆', Extreme: '■' };
  var L = {
    n: 603,
    counts: { overall: [155, 168, 183, 97], z1: [172, 133, 182, 116], z2: [274, 199, 117, 13] },
    label: { overall: 'Overall rating', z1: 'Zone 1 rating, 1.5–10 m from the wall', z2: 'Zone 2 rating, 10–30 m from the wall' },
    hist: [72, 55, 54, 68, 66, 76, 75, 57, 44, 36],
    drivers: { z1: { c: [10.2, 29.2, 48.3, 63.3], l: [7.7, 15.2, 21.0, 31.2] }, z2: { c: [27.5, 44.6, 53.0, 65.1], l: [13.7, 20.5, 22.8, 29.8] } },
    flags: [['Branches over the roof', 220], ['Outbuilding within 10 m', 155], ['Steep slope, over 15°', 25]]
  };
  var pct = function (v) { return Math.round(v / L.n * 100); };
  function buildLidar() {
    $('#ratingBars').innerHTML = RATINGS.map(function (r) {
      return '<div class="hbar" tabindex="0" data-r="' + r + '"><span class="lab-t"><span class="ico" aria-hidden="true">' + ICON[r] + '</span>' + r + '</span><div class="track"><div class="fill r-' + r + '"></div></div><span class="val"></span></div>';
    }).join('');
    var max = Math.max.apply(null, L.hist);
    $('#hist').innerHTML = L.hist.map(function (v, i) {
      return '<div class="col" tabindex="0" data-i="' + i + '"><span>' + v + '</span><i data-h="' + (v / max * 82) + '"></i></div>';
    }).join('');
    $$('#hist .col').forEach(function (el) {
      var i = +el.dataset.i;
      bindTip(el, function () { return '<b>Score ' + i * 10 + ' to ' + (i * 10 + 10) + '</b><span>' + L.hist[i] + ' houses · ' + pct(L.hist[i]) + '% of 603</span>'; });
    });
    $('#driverBars').innerHTML = RATINGS.map(function (r) {
      return '<div class="grow" tabindex="0"><span class="lab-t">' + r + '</span><div class="pair">' +
        '<div class="line"><div class="track"><div class="fill c"></div></div><span class="v vc"></span></div>' +
        '<div class="line"><div class="track"><div class="fill l"></div></div><span class="v vl"></span></div></div></div>';
    }).join('');
    $('#flagMeters').innerHTML = L.flags.map(function (f) {
      return '<div class="meter"><div class="top"><span>' + f[0] + '</span><b>' + f[1] + ' · ' + pct(f[1]) + '%</b></div><div class="track"><div class="fill" data-w="' + (f[1] / L.n * 100) + '"></div></div></div>';
    }).join('');
    $('#lidarTable').innerHTML = '<table><thead><tr><th>Rating</th><th>Overall</th><th>Zone 1</th><th>Zone 2</th><th>Z1 canopy %</th><th>Z1 ladder %</th><th>Z2 canopy %</th><th>Z2 ladder %</th></tr></thead><tbody>' +
      RATINGS.map(function (r, i) {
        return '<tr><td>' + r + '</td><td>' + L.counts.overall[i] + '</td><td>' + L.counts.z1[i] + '</td><td>' + L.counts.z2[i] + '</td><td>' + L.drivers.z1.c[i] + '</td><td>' + L.drivers.z1.l[i] + '</td><td>' + L.drivers.z2.c[i] + '</td><td>' + L.drivers.z2.l[i] + '</td></tr>';
      }).join('') + '</tbody></table>';
  }
  var zone = 'overall', lidarShown = false;
  function updateLidar() {
    var cs = L.counts[zone], max = Math.max.apply(null, L.counts.z2);
    $('#ratingSub').textContent = L.label[zone] + ', 603 houses';
    $$('#ratingBars .hbar').forEach(function (el, i) {
      $('.fill', el).style.width = (lidarShown ? cs[i] / max * 100 : 0) + '%';
      $('.val', el).innerHTML = cs[i] + '<small>' + pct(cs[i]) + '%</small>';
      el.onpointermove = function (e) { showTip('<b>' + RATINGS[i] + '</b><span>' + cs[i] + ' houses · ' + pct(cs[i]) + '% · ' + L.label[zone] + '</span>', e.clientX, e.clientY); };
      el.onpointerleave = hideTip;
    });
    var hi = pct(cs[2] + cs[3]);
    $('#ratingNote').textContent = zone === 'overall'
      ? hi + '% of houses rate High or Extreme overall. Compare Zone 1 and Zone 2 to see where that comes from.'
      : zone === 'z1' ? hi + '% rate High or Extreme within 10 m of the wall. This is the ring an owner can change in a weekend.'
        : 'Only ' + hi + '% rate High or Extreme at 10 to 30 m. The hazard sits close to the house, not out in the bush.';
    var dz = zone === 'z2' ? 'z2' : 'z1', d = L.drivers[dz];
    $('#driverSub').textContent = 'Mean cover in ' + (dz === 'z1' ? 'Zone 1 (1.5–10 m)' : 'Zone 2 (10–30 m)') + ', by overall rating';
    $$('#driverBars .grow').forEach(function (el, i) {
      $('.fill.c', el).style.width = (lidarShown ? d.c[i] : 0) + '%'; $('.fill.l', el).style.width = (lidarShown ? d.l[i] : 0) + '%';
      $('.vc', el).textContent = d.c[i].toFixed(1) + '%'; $('.vl', el).textContent = d.l[i].toFixed(1) + '%';
      el.onpointermove = function (e) { showTip('<b>' + RATINGS[i] + ' houses</b><span>Canopy cover ' + d.c[i] + '%<br>Ladder fuel ' + d.l[i] + '%</span>', e.clientX, e.clientY); };
      el.onpointerleave = hideTip;
    });
    $$('#hist .col i').forEach(function (el) { el.style.height = (lidarShown ? el.dataset.h : 0) + '%'; });
    $$('#flagMeters .fill').forEach(function (el) { el.style.width = (lidarShown ? el.dataset.w : 0) + '%'; });
  }
  buildLidar(); updateLidar();
  segmented($('#zoneSeg'), 'zone', function (v) { zone = v; updateLidar(); });

  /* ---------- atlas steps ---------- */
  var STEPS = [
    ['Inventory what exists', 'Mapped 20 water locations and the fire hall, keeping the one existing hydrant separate from drafting sites.'],
    ['Map real access', 'Combined Ontario Road Network data with hand-traced access routes that the official data misses.'],
    ['Estimate travel time', 'Modelled drive times with paved and gravel speeds plus turnout delay, colour-coded by minutes to arrival.'],
    ['Plan future supply', 'Explored sites for roughly 2,000-gallon underground cisterns with tanker drafting connections.'],
    ['Find the gaps', 'Routed every building footprint to the nearest hydrant to find clusters of homes far from water, with results exported to CSV and JSON.']
  ];
  function setStep(i) {
    $$('#steps button').forEach(function (b) { var on = +b.dataset.step === i; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    $('#stepPanel').innerHTML = '<h4>' + STEPS[i][0] + '</h4><p>' + STEPS[i][1] + '</p>';
  }
  $('#steps').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setStep(+b.dataset.step); });
  setStep(0);

  /* ---------- timeline ---------- */
  var T0 = 1995, T1 = 2027;
  var TL = [
    ['OLG', 1, [[2007.33, 2009.25, 'Voice Network Analyst', 'May 2007 – Apr 2009'], [2009.25, 2011.33, 'Quality Assurance Analyst', 'Apr 2009 – May 2011'], [2011.33, 2013.75, 'Environment Provisioning Analyst', 'May 2011 – Oct 2013'], [2013.75, 2026.8, 'Senior Data Quality Analyst', 'Oct 2013 – Oct 2026']]],
    ['Searchmont Volunteer Fire Dept', 2, [[1995, 2012, 'Firefighter', '1995 – 2012'], [2012, 2023, 'Fire Chief', '2012 – 2023 · 21 volunteers']]],
    ['Local Services Board', 2, [[2013, 2023, 'Secretary', '2013 – 2023 · annual budget development']]],
    ['Algoma Mutual Aid Association', 2, [[2016, 2023, 'Secretary', '2016 – 2023 · 26 fire departments']]],
    ['Superior Community Skatepark Assoc.', 2, [[2002, 2020, 'President', '2002 – 2020 · over $400,000 raised']]],
    ['Education', 3, [[2004, 2006, 'Sault College', 'General Arts and Science Diploma, 2004 – 2006'], [2006, 2009, 'Algoma University', 'B.Sc. Mathematics and Computer Science, 2006 – 2009']]]
  ];
  var P = function (y) { return (y - T0) / (T1 - T0) * 100; };
  var grid = 'background-size:' + (5 / (T1 - T0) * 100) + '% 100%';
  $('#timeline').innerHTML = TL.map(function (row, ri) {
    return '<div class="tl-row"><span class="name">' + row[0] + '</span><div class="tl-track" style="' + grid + '">' +
      row[2].map(function (s, si) {
        return '<button type="button" class="tl-seg k' + row[1] + '" data-r="' + ri + '" data-s="' + si + '" style="left:' + P(s[0]) + '%;width:calc(' + (P(s[1]) - P(s[0])) + '% - 2px)" aria-label="' + esc(s[2] + ', ' + s[3]) + '"></button>';
      }).join('') + '</div></div>';
  }).join('') + '<div class="tl-row tl-axis-row"><span class="name"></span><div class="tl-axis">' +
    [1995, 2000, 2005, 2010, 2015, 2020, 2025].map(function (y) { return '<span style="left:' + P(y) + '%">' + y + '</span>'; }).join('') + '</div></div>';
  $$('.tl-seg').forEach(function (el) {
    var s = TL[+el.dataset.r][2][+el.dataset.s];
    bindTip(el, function () { return '<b>' + s[2] + '</b><span>' + TL[+el.dataset.r][0] + '<br>' + s[3] + '</span>'; });
  });

  /* ---------- skills ---------- */
  var SK = {
    'Analytics platforms': ['IBM watsonx.data intelligence', 'IBM InfoSphere Information Governance Console', 'Information Analyzer', 'DataStage', 'Informatica Data Quality', 'Power BI', 'Alteryx', 'Cognos'],
    'Data engineering': ['Cloudera Data Platform', 'Cloudera AI Workbench', 'Hadoop (HDFS)', 'Parquet', 'Hive', 'Impala', 'ETL to ELT', 'Python data pipelines', 'Data contracts'],
    'AI': ['Machine learning for seasonal anomaly detection', 'GitHub Copilot', 'Copilot Studio agents', 'MCP'],
    'Governance': ['DAMA-DMBOK', 'COBIT', 'Data owner and steward roles', 'Metadata and information lifecycle', 'Reference and master data management', 'Critical data elements'],
    'Operations': ['Dev, test, staging and production environments', 'SIT and UAT', 'Incident and defect triage', 'Release support', 'Agile/Scrum'],
    'Geospatial': ['LiDAR analysis', 'Leaflet', 'GeoJSON', 'Shapely', 'pyproj', 'Network routing', 'Spatial clustering'],
    'Languages': ['Python', 'SQL (MS SQL Server, Impala, Hive, DB2, Sybase)', 'JavaScript', 'HTML/CSS', 'Flask']
  };
  var cats = Object.keys(SK);
  $('#skillSeg').innerHTML = '<button type="button" data-cat="all" aria-pressed="true">All</button>' + cats.map(function (c) { return '<button type="button" data-cat="' + c + '" aria-pressed="false">' + c + '</button>'; }).join('');
  $('#skillTags').innerHTML = cats.map(function (c) { return SK[c].map(function (t) { return '<span class="tag" data-cat="' + c + '">' + esc(t) + '</span>'; }).join(''); }).join('');
  segmented($('#skillSeg'), 'cat', function (c) { $$('#skillTags .tag').forEach(function (t) { t.classList.toggle('dim', c !== 'all' && t.dataset.cat !== c); }); });

  /* ---------- contact (mailto only; nothing is sent from the page) ---------- */
  $('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, wants = $$('input[name=want]:checked', f).map(function (i) { return i.value; });
    var body = 'Name: ' + f.name.value + '\nOrganization: ' + f.org.value + '\nRequesting: ' + (wants.join(', ') || 'n/a') + '\n\n' + f.msg.value;
    window.location.href = 'mailto:carrie.aiden.travis@gmail.com?subject=' + encodeURIComponent('Portfolio request from ' + f.name.value) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- scroll: nav spy, count-up, chart reveal ---------- */
  var links = $$('.nav a');
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + en.target.id; a.classList.toggle('is-active', on);
        if (on && window.innerWidth <= 900) a.parentNode.scrollTo({ left: a.offsetLeft - a.parentNode.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  $$('main section').forEach(function (s) { spy.observe(s); });

  var once = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; once.unobserve(en.target);
      if (en.target.id === 'labChart') {
        var box = en.target; box.classList.add('seen');
        if (!reduced) { box.classList.add('draw'); drawLab(); setTimeout(function () { box.classList.remove('draw'); drawLab(); }, 2700); }
        return;
      }
      if (en.target.id === 'timeline') { en.target.classList.add('in'); return; }
      if (en.target.id === 'ratingBars') { lidarShown = true; updateLidar(); return; }
      var el = en.target, end = +el.dataset.count; if (reduced) return;
      var t0 = performance.now(); setTimeout(function () { el.textContent = end; }, 1300);
      (function tick(t) { var p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1 && t - t0 < 1250) requestAnimationFrame(tick); })(t0);
    });
  }, { threshold: 0.3 });
  $$('[data-count]').forEach(function (el) { once.observe(el); });
  once.observe($('#ratingBars')); once.observe($('#labChart')); once.observe($('#timeline'));
  $$('.tl-seg').forEach(function (el) { el.style.setProperty('--r', el.dataset.r); el.style.setProperty('--s', el.dataset.s); });

  /* ---------- motion: scroll reveal and cursor glow ---------- */
  if (!reduced) {
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    $$('main section:not(.hero) .sec-head, main section:not(.hero) .card, .panel, .more, #skills .filters').forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches('.card, .panel'); });
      el.style.setProperty('--d', (Math.max(0, sibs.indexOf(el)) % 6) * 0.07 + 's');
      el.classList.add('rv'); rv.observe(el);
    });
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.tile, .work, .panel, .stat'); if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }
})();
