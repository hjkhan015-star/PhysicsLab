// app.js — the lab "player". Reads sims/<id>.js (the ?sim= in the address) and builds the whole screen:
//   header · control dock (sliders, choices, switches) · monitor (numbers + graph) · info sheet (explain / try / remember / quiz) · menu
// Layout logic is borrowed from AutoLab3: phone = bottom dock + top number strip · tablet = bottom bar · smart board = left rail + right column.
// Students normally write ONLY sims/*.js. See HOW-TO-ADD-A-SIM.md.
import { view, THREE } from './scene.js';
import { findSim } from './syllabus.js';

const $ = s => document.querySelector(s), root = document.documentElement;
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const store = { get: (k, d) => { try { const v = localStorage.getItem('pl.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem('pl.' + k, JSON.stringify(v)); } catch (e) {} } };
const simId = new URLSearchParams(location.search).get('sim');

/* ── 1. layout mode (pure) ─ phone = narrow OR short screen; ≥1024 px wide = smart board / desktop ─────────────── */
const isPhone = (w, h) => w <= 720 || h <= 540;
export const layoutMode = (w, h) => !isPhone(w, h) ? (w >= 1024 ? 'wide' : 'desktop') : (w > h ? 'landscape' : 'portrait');
let mode = 'portrait', dockState = 'default';                       // dockState: portrait slim|default|options · wide default|slim
const NEXT = { up: { slim: 'default', default: 'options', options: 'options' }, down: { options: 'default', default: 'slim', slim: 'slim' } };
function layout() {
  const w = innerWidth, h = innerHeight; mode = layoutMode(w, h);
  root.dataset.mode = mode; root.dataset.board = (store.get('board', null) ?? (mode === 'wide' && w >= 1500)) ? '1' : '';
  const st = mode === 'wide' ? (dockState === 'slim' ? 'slim' : 'default') : mode === 'portrait' ? dockState : 'default';
  $('#dock').dataset.state = st; root.dataset.dock = st;
}
addEventListener('resize', layout);

/* ── 2. turn the sim's declaration into a list of controls ───────────────────────────────────────────────────── */
function normalize(cfg) {
  const out = [];
  for (const s of cfg.sliders || []) out.push(s.names && s.names.length <= 4 && !s.axis
    ? { type: 'choice', id: s.k, label: s.l, options: s.names, base: s.min, value: s.v, w: s.w }
    : { type: 'slider', id: s.k, label: s.l, min: s.min, max: s.max, step: s.step, value: s.v, unit: s.u || '', names: s.names, w: s.w });
  for (const t of cfg.toggles || []) out.push({ type: 'toggle', id: t.k, label: t.l, value: t.v !== false, w: t.w });
  for (const b of cfg.buttons || []) out.push({ type: 'action', label: b.l, run: b.fn, w: b.w });
  return out;
}
function mkAxis(c, P) {                                             // a touch slider (vertical on phones & boards, horizontal on tablets)
  const e = el('div', 'axis', `<span class="nm">${c.label}</span><div class="trk"><i class="fill"></i><b class="thumb"></b></div><span class="vl"></span>`);
  e.tabIndex = 0; e.setAttribute('role', 'slider'); const n = Math.round((c.max - c.min) / c.step), trk = e.querySelector('.trk'); let idx = Math.round((c.value - c.min) / c.step), live = false;
  const show = () => { const v = +(c.min + idx * c.step).toFixed(6); P[c.id] = v; e.style.setProperty('--f', idx / n); e.querySelector('.vl').textContent = c.names ? c.names[idx] : v + (c.unit ? ' ' + c.unit : ''); e.setAttribute('aria-valuenow', v); };
  const set = i => { i = Math.max(0, Math.min(n, i)); if (i !== idx) { idx = i; show(); } };
  const pos = ev => { const r = trk.getBoundingClientRect(), f = mode === 'desktop' ? (ev.clientX - r.left) / r.width : 1 - (ev.clientY - r.top) / r.height; set(Math.round(Math.max(0, Math.min(1, f)) * n)); };
  trk.onpointerdown = ev => { live = true; trk.setPointerCapture(ev.pointerId); pos(ev); e.focus({ preventScroll: true }); };
  trk.onpointermove = ev => live && pos(ev); trk.onpointerup = trk.onpointercancel = () => live = false;
  e.onkeydown = ev => { const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: Math.ceil(n / 10), PageDown: -Math.ceil(n / 10) }[ev.key]; if (d) { set(idx + d); ev.preventDefault(); } else if (ev.key === 'Home') set(0); else if (ev.key === 'End') set(n); };
  show(); return e;
}
function mkChoice(c, P) {                                           // a few named options (segmented buttons)
  const e = el('div', 'choice', `<span class="nm">${c.label}</span><div class="seg">${c.options.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div>`);
  const bs = [...e.querySelectorAll('button')], pick = i => { P[c.id] = c.base + i; bs.forEach((b, j) => { b.classList.toggle('on', i === j); b.setAttribute('aria-pressed', i === j); }); };
  bs.forEach((b, i) => b.onclick = () => pick(i)); pick(Math.max(0, Math.min(bs.length - 1, c.value - c.base))); return e;
}
function mkToggle(c, P) {
  const e = el('button', 'tgl', `<span class="sw"></span><span class="nm">${c.label}</span>`); e.setAttribute('role', 'switch');
  const set = v => { P[c.id] = v; e.classList.toggle('on', v); e.setAttribute('aria-checked', v); }; e.onclick = () => set(!P[c.id]); set(c.value); return e;
}
const mkAction = (c, P) => { const e = el('button', 'chip', c.label); e.onclick = () => c.run(P); return e; };

/* ── 3. the monitor: headline number + status + rows + graph (numbers live here, explanations live in the info sheet) ── */
const splitVal = s => { const m = /^(-?\d[\d.,]*)\s*(.*)$/.exec(String(s)); return m ? [m[1], m[2]] : [String(s), '']; };
const TONES = ['ok', 'warn', 'crit', 'hi'];
function drawGraph(cv, d) {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, cs = getComputedStyle(root), ink = cs.getPropertyValue('--tx').trim(), mu = cs.getPropertyValue('--mu').trim(), ml = 74, mb = 54, mt = 26, mr = 24;
  const y0 = d.ymin || 0, X = v => ml + v / d.xmax * (W - ml - mr), Y = v => H - mb - (v - y0) / (d.ymax - y0) * (H - mb - mt);
  x.clearRect(0, 0, W, H); x.font = '600 24px system-ui,sans-serif'; x.fillStyle = mu; x.strokeStyle = mu + '44'; x.lineWidth = 2;
  for (let i = 0; i <= 4; i++) { const gx = d.xmax * i / 4, gy = y0 + (d.ymax - y0) * i / 4;
    x.beginPath(); x.moveTo(X(gx), Y(y0)); x.lineTo(X(gx), Y(d.ymax)); x.moveTo(X(0), Y(gy)); x.lineTo(X(d.xmax), Y(gy)); x.stroke();
    x.textAlign = 'center'; x.fillText(+gx.toFixed(1), X(gx), H - mb + 28); x.textAlign = 'right'; x.fillText(+gy.toFixed(0), ml - 10, Y(gy) + 8); }
  x.strokeStyle = ink; x.lineWidth = 3; x.beginPath(); x.moveTo(X(0), Y(d.ymax)); x.lineTo(X(0), Y(y0)); x.lineTo(X(d.xmax), Y(y0)); x.stroke();
  if (y0 < 0) { x.strokeStyle = mu; x.lineWidth = 2; x.beginPath(); x.moveTo(X(0), Y(0)); x.lineTo(X(d.xmax), Y(0)); x.stroke(); }
  x.fillStyle = ink; x.textAlign = 'center'; x.fillText(d.xl, (ml + W - mr) / 2, H - 6); x.textAlign = 'left'; x.fillText(d.yl, 8, 20);
  if (d.ref) { x.setLineDash([10, 8]); x.strokeStyle = mu; x.lineWidth = 2.5; x.beginPath(); x.moveTo(X(d.ref[0][0]), Y(d.ref[0][1])); x.lineTo(X(d.ref[1][0]), Y(d.ref[1][1])); x.stroke(); x.setLineDash([]); }
  const p = d.pts; if (p.length) { const col = d.color || '#f59e0b'; x.strokeStyle = col; x.lineWidth = 5; x.lineJoin = 'round'; x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b))); x.stroke();
    const q = p[p.length - 1]; x.fillStyle = col; x.beginPath(); x.arc(X(q[0]), Y(q[1]), 9, 0, 7); x.fill(); }
}

/* ── 4. start ─────────────────────────────────────────────────────────────────────────────────────────────── */
async function start() {
  if (!simId) return fail('No simulation chosen. Go back and pick one.');
  let cfg; try { cfg = (await import(`./sims/${simId}.js`)).default; } catch (e) { console.error(e); return fail('Could not load this simulation (' + simId + ').'); }
  const meta = findSim(simId), P = {}, controls = normalize(cfg), keys = Object.keys(cfg.ro);
  if (meta) root.style.setProperty('--ac', meta.cls.color);
  $('#ttl').textContent = cfg.title; document.title = cfg.title + ' · Physics Lab';
  root.dataset.cls = meta ? meta.cls.n : '';
  $('#chip').innerHTML = meta ? `<i class="cd"></i><span class="cl">Class ${meta.cls.n} · </span>${meta.mod.ch ? 'Ch ' + meta.mod.ch : 'Bonus'}` : '';
  root.dataset.theme = store.get('theme', 'dark'); view.theme(root.dataset.theme === 'light');
  dockState = store.get('dock.' + simId, 'default'); let paused = false;

  // dock: transport (play / restart) · sliders · options
  const dock = $('#dock'); dock.innerHTML = '<div class="grab" role="button" aria-label="Controls"><i></i></div><div class="dk"><div class="tp"><button id="play" aria-label="Pause"><i class=\"gl pz\"></i><span class="tx">Pause</span></button><button id="rst" aria-label="Restart"><span>↻</span><span class="tx">Restart</span></button></div><div class="axes"></div><div class="opts"></div></div>';
  for (const c of controls) { c.el = { slider: mkAxis, choice: mkChoice, toggle: mkToggle, action: mkAction }[c.type](c, P); (c.type === 'slider' ? dock.querySelector('.axes') : dock.querySelector('.opts')).append(c.el); }
  const setDock = s => { dockState = s; store.set('dock.' + simId, s); layout(); };
  const grab = dock.querySelector('.grab'); let y0 = null;
  grab.onpointerdown = e => { y0 = e.clientY; grab.setPointerCapture(e.pointerId); };
  grab.onpointerup = e => { const dy = e.clientY - y0; y0 = null;
    if (mode === 'wide') return setDock(dockState === 'slim' ? 'default' : 'slim');
    if (Math.abs(dy) >= 24) return setDock(NEXT[dy < 0 ? 'up' : 'down'][dockState]);
    setDock(dockState === 'options' ? 'default' : NEXT.up[dockState]); };
  const setPaused = v => { paused = v; $('#play').innerHTML = v ? '<i class=\"gl pl\"></i><span class="tx">Play</span>' : '<i class=\"gl pz\"></i><span class="tx">Pause</span>'; $('#play').setAttribute('aria-label', v ? 'Play' : 'Pause'); $('#dot').className = v ? 'off' : ''; };
  const restart = () => { cfg.reset(P); cfg.step(0, P); lastText = 0; };
  $('#play').onclick = () => setPaused(!paused); $('#rst').onclick = restart;

  // monitor
  const mon = $('#mon'), head = cfg.head && keys.includes(cfg.head) ? cfg.head : keys[0], rows = keys.filter(k => k !== head);
  mon.innerHTML = `<button class="mh" aria-expanded="false"><span class="ml"></span><span class="mv"><b></b><small></small></span><span class="ms" hidden></span><i class="chev">▾</i></button><div class="mb">${rows.length ? '<dl class="rows">' + rows.map((k, i) => `<div><dt>${k}</dt><dd id="d${i}">–</dd></div>`).join('') + '</dl>' : ''}${cfg.graph ? '<canvas class="gr"></canvas>' : ''}</div>`;
  mon.querySelector('.mh').onclick = () => { mon.classList.toggle('open'); mon.querySelector('.mh').setAttribute('aria-expanded', mon.classList.contains('open')); };
  const gr = mon.querySelector('.gr'); if (gr && mode === 'portrait') mon.classList.add('open'); if (gr) new ResizeObserver(() => { gr.width = gr.clientWidth * 2; gr.height = gr.clientHeight * 2; }).observe(gr);
  const setRow = (node, v) => { node.parentNode.hidden = v == null; if (v == null) return; const t = Array.isArray(v) ? v[0] : v, tone = Array.isArray(v) && TONES.includes(v[1]) ? v[1] : ''; if (node.textContent !== String(t)) node.textContent = t; node.className = tone; };

  // info sheet
  const tries = (cfg.try || []).map(x => typeof x === 'string' ? { t: x } : x), done = tries.map(() => false), info = $('#info'), tabs = [['now', 'Now'], tries.length && ['try', 'Try this'], cfg.key && ['key', 'Remember'], cfg.quiz && ['quiz', 'Quiz']].filter(Boolean); let tab = 'now', score = 0, asked = 0;
  const li = a => a.map(x => `<li>${x}</li>`).join('');
  function drawInfo() {
    const body = { now: () => `<p class="note">${cfg.note(P)}</p>`, try: () => `<ol>${tries.map((x, i) => `<li class="${done[i] ? 'done' : ''}">${x.t}</li>`).join('')}</ol>`, key: () => `<ul>${li(cfg.key)}</ul>`,
      quiz: () => cfg.quiz.map((q, i) => `<div class="qz" data-i="${i}"><p><b>${i + 1}.</b> ${q.q}</p>${q.o.map((o, j) => `<button data-j="${j}">${o}</button>`).join('')}<p class="why" hidden>${q.why || ''}</p></div>`).join('') + `<p class="sc">Score: <b>${score}</b> / ${asked}</p>` }[tab]();
    root.dataset.itab = tab;
    info.innerHTML = `<div class="it">${tabs.map(([k, n]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${n}</button>`).join('')}<button class="x" aria-label="Close">✕</button></div><div class="ib">${body}</div>`;
  }
  info.onclick = e => { const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('x')) return openInfo(false);
    if (b.dataset.t) { tab = b.dataset.t; return drawInfo(); }
    const q = b.closest('.qz'); if (q && !q.dataset.done) { q.dataset.done = 1; const Q = cfg.quiz[+q.dataset.i], j = +b.dataset.j; asked++; if (j === Q.a) score++;
      q.querySelectorAll('button').forEach((x, k) => { x.disabled = true; x.classList.toggle('good', k === Q.a); x.classList.toggle('bad', k === j && j !== Q.a); }); q.querySelector('.why').hidden = false; info.querySelector('.sc').innerHTML = `Score: <b>${score}</b> / ${asked}`; } };
  const openInfo = (on, t) => { info.hidden = !on; if (!on) delete root.dataset.itab; $('#bInfo').classList.toggle('on', on); store.set('info', on); if (on) { if (t) tab = t; drawInfo(); } };
  $('#bInfo').onclick = () => openInfo(info.hidden); $('#cap').onclick = () => openInfo(info.hidden, 'now');

  // title too long for two lines on a phone → use the short chapter label from syllabus.js
  const fitTitle = () => { const h = $('#ttl'); h.textContent = cfg.title; if (meta && (mode === 'portrait' || mode === 'landscape') && h.scrollHeight > h.clientHeight + 1) h.textContent = meta.mod.label; };
  fitTitle(); addEventListener('resize', fitTitle);

  // first-visit hint (Class 8) and Try-this cheer share one small overlay on the stage
  const hint = el('div', null); hint.id = 'hint'; hint.hidden = true; document.body.append(hint); let touched = false, cheerT = 0, hinting = false;
  const seen = store.get('hint', []), main = dock.querySelector('.axes .axis') || dock.querySelector('.choice');
  const hideHint = () => { if (!hinting) return; hinting = false; hint.hidden = true; if (main) main.classList.remove('pulse'); };
  if (meta && meta.cls.n === 8 && main && !seen.includes(simId)) { store.set('hint', [...seen, simId]); hinting = true; hint.textContent = dock.querySelector('.axes .axis') ? 'Drag the slider' : 'Tap an option'; hint.hidden = false; main.classList.add('pulse'); }
  const cheer = s => { hideHint(); hint.className = 'cheer'; hint.textContent = '✅ ' + s; hint.hidden = false; clearTimeout(cheerT); cheerT = setTimeout(() => { hint.hidden = true; hint.className = ''; }, 3200); };
  const touch = e => { if (e.target.closest('.axes, .opts')) { touched = true; hideHint(); } };
  dock.addEventListener('pointerdown', touch); dock.addEventListener('keydown', touch);

  // menu ⋯
  const menu = $('#menu'), M = [['Theme', () => (root.dataset.theme === 'light' ? 'Light' : 'Dark'), () => { const l = root.dataset.theme !== 'light'; root.dataset.theme = l ? 'light' : 'dark'; store.set('theme', root.dataset.theme); view.theme(l); }],
    ['3D labels', () => (view.labelsOn ? 'On' : 'Off'), () => { view.labels(!view.labelsOn); store.set('labels', view.labelsOn); }],
    ['Board mode (big text)', () => (root.dataset.board ? 'On' : 'Off'), () => { store.set('board', !root.dataset.board); layout(); }],
    ['Reset 3D view', () => '', () => view.set(cfg.cam)], ['Full screen', () => '', () => (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen && root.requestFullscreen())]];
  const drawMenu = () => { menu.innerHTML = M.map(([n, v], i) => `<button data-i="${i}"><span>${n}</span><b>${v()}</b></button>`).join(''); };
  $('#bMenu').onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; if (!menu.hidden) drawMenu(); };
  menu.onclick = e => { const b = e.target.closest('button'); if (b) { M[+b.dataset.i][2](); drawMenu(); } };
  addEventListener('click', e => { if (!menu.hidden && !e.target.closest('#menu')) menu.hidden = true; });
  addEventListener('keydown', e => { if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return; const k = e.key.toLowerCase();
    if (k === ' ' && !/BUTTON|A/.test(e.target.tagName)) { setPaused(!paused); e.preventDefault(); } else if (k === 'r') restart(); else if (k === 'i') openInfo(info.hidden); else if (k === 'l') { M[1][2](); } else if (k === 't') M[0][2](); else if (k === 'escape') { menu.hidden = true; if (!info.hidden) openInfo(false); } });

  // go
  view.set(cfg.cam); view.labels(store.get('labels', true)); cfg.setup(P); cfg.reset(P); cfg.step(0, P); layout();
  openInfo(store.get('info', mode === 'wide') && mode !== 'portrait');
  const clock = new THREE.Clock(); let lastText = 0, lastG = 0, lastNote = '';
  (function frame(now) {
    requestAnimationFrame(frame); const dt = Math.min(clock.getDelta(), .05); if (!paused) cfg.step(dt, P); view.render();
    if (now - lastText > 110) { lastText = now;
      const [v, u] = splitVal(cfg.ro[head](P)); mon.querySelector('.ml').textContent = head; mon.querySelector('.mv b').textContent = v; mon.querySelector('.mv b').className = v.length > 8 ? 'sm' : ''; mon.querySelector('.mv small').textContent = u;
      const st = cfg.status && cfg.status(P), sn = mon.querySelector('.ms'); sn.hidden = !st; if (st) { sn.textContent = st[0]; sn.className = 'ms ' + (st[2] || (st[1] ? 'on' : '')); }
      controls.forEach(c => { if (c.w) c.el.hidden = !c.w(P); });
      if (touched) tries.forEach((x, i) => { if (x.check && !done[i] && x.check(P)) { done[i] = true; cheer(x.yes || 'Yes!'); if (!info.hidden && tab === 'try') drawInfo(); } });   // Try-this ✅ (stays ticked)                      // a sim can hide a control with  w: P => bool
      rows.forEach((k, i) => setRow(mon.querySelector('#d' + i), cfg.ro[k](P)));
      const n = cfg.note(P); if (n !== lastNote) { lastNote = n; $('#cap').innerHTML = n; if (!info.hidden && tab === 'now') info.querySelector('.note').innerHTML = n; } }
    if (gr && now - lastG > 66 && gr.width) { lastG = now; drawGraph(gr, cfg.graph(P)); }
  })(0);
}
function fail(msg) { $('#ttl').textContent = 'Oops'; $('#cap').textContent = msg; $('#cap').classList.add('err'); }
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
layout(); start();
