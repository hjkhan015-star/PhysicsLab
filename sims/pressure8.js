// Class 8 · Ch 11 Force and Pressure — PRESSURE ON SOLIDS. Same force on a smaller area = more pressure. A soft base gives way; a hard base does not.
// Pick the base material, the push (force) and the touching area, then watch how deep it sinks. Numbers in the Monitor, words in the caption.
import { S, V, box, mat, THREE, label, arrowTo } from '../scene.js';
const TABS = [['force8', 'Force'], ['pressure8', 'Solids'], ['liquidpressure8', 'Liquids']];
const MAT = ['Foam', 'Sand', 'Clay', 'Wood', 'Concrete'], HARD = [5, 40, 120, 20000, 200000];            // kPa the base can take before it gives way (relative, for the picture)
const FOR = [10, 20, 50, 100, 200, 500], AREA = ['Needle tip', 'Nail head', 'Brick edge', 'Brick flat'], AR = [.1, 1, 20, 200], W3 = [.14, .5, 1.5, 4.6];   // N · cm² · drawing width
const LV = ['Very low', 'Low', 'Medium', 'High', 'Very high'];
let slab, texs, obj, tip, load, arr, lab, lDepth, lMat, d = 0, ridgeL, ridgeR, gauge;
function makeTex(kind) {                                                    // little painted pictures of each material
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); let seed = 7 + kind; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  x.fillStyle = ['#f3d36b', '#d9b26f', '#b5603a', '#9a6a3a', '#9ca3af'][kind]; x.fillRect(0, 0, 128, 128);
  if (kind === 0) for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(160,110,20,${.15 + r() * .25})`; x.beginPath(); x.arc(r() * 128, r() * 128, 2 + r() * 5, 0, 7); x.fill(); }            // foam: holes
  if (kind === 1) for (let i = 0; i < 700; i++) { x.fillStyle = r() > .5 ? 'rgba(120,80,30,.55)' : 'rgba(255,240,200,.6)'; x.fillRect(r() * 128, r() * 128, 2, 2); }                   // sand: grains
  if (kind === 2) for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(90,30,10,${.12 + r() * .15})`; x.lineWidth = 3; x.beginPath(); x.moveTo(r() * 128, r() * 128); x.bezierCurveTo(r() * 128, r() * 128, r() * 128, r() * 128, r() * 128, r() * 128); x.stroke(); }   // clay: smooth smears
  if (kind === 3) for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(60,30,5,${.2 + r() * .3})`; x.lineWidth = 1 + r() * 2; x.beginPath(); x.moveTo(0, i * 5 + r() * 3); x.bezierCurveTo(40, i * 5 + r() * 8, 80, i * 5 - r() * 8, 128, i * 5 + r() * 3); x.stroke(); }   // wood: grain
  if (kind === 4) { for (let i = 0; i < 500; i++) { x.fillStyle = r() > .5 ? 'rgba(60,65,75,.5)' : 'rgba(240,240,245,.5)'; x.fillRect(r() * 128, r() * 128, 2 + r() * 3, 2 + r() * 3); } for (let i = 0; i < 18; i++) { x.fillStyle = 'rgba(110,115,125,.7)'; x.beginPath(); x.arc(r() * 128, r() * 128, 3 + r() * 5, 0, 7); x.fill(); } }   // concrete: stones
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const fmt = pk => pk >= 1000 ? +(pk / 1000).toFixed(pk >= 10000 ? 0 : 1) + ' MPa' : pk >= 10 ? Math.round(pk) + ' kPa' : +pk.toFixed(1) + ' kPa';
export default {
  title: 'Pressure on Solids — Sink or Not?', cam: { d: 15, e: .08, a: 0, t: V(0, .6, 0), ref: 1.3 }, tabs: TABS, head: 'Pressure',
  sliders: [{ k: 'b', l: '🧱 Base', min: 1, max: 5, step: 1, v: 2, names: MAT, axis: true }, { k: 'f', l: '💪 Force', min: 1, max: 6, step: 1, v: 4, names: FOR.map(n => n + ' N'), axis: true }, { k: 'a', l: '📐 Touching area', min: 1, max: 4, step: 1, v: 1, names: AREA, axis: true }],
  setup() {
    texs = MAT.map((_, i) => makeTex(i)); slab = box(15, 4, 5, 0xffffff); slab.position.y = -2; slab.material.map = texs[1]; slab.material.needsUpdate = true; slab.material.transparent = true; slab.material.opacity = .82; slab.material.depthWrite = false;
    obj = box(1, 3, 1, 0x94a3b8); tip = box(1, .5, 1, 0x64748b); load = box(1, 1, 1, 0xef4444); arr = arrowTo(0x22c55e, .13);
    ridgeL = box(.5, .35, 1.2, 0xffffff); ridgeR = box(.5, .35, 1.2, 0xffffff); [ridgeL, ridgeR].forEach(m => { m.material.map = texs[1]; m.material.needsUpdate = true; }); gauge = box(.12, 1, .12, 0xfde047);
    lab = label('', '#fff', 1.1); lab.position.set(0, -5.6, 0); lDepth = label('', '#fde047', .8); lMat = label('', '#e2e8f0', .8); lMat.position.set(0, -3.7, 0);
  },
  reset() { d = 0; },
  step(dt, P) {
    const b = P.b - 1, F = FOR[P.f - 1], A = AR[P.a - 1], pk = F * 10 / A, r = pk / HARD[b], s = Math.max(0, Math.min(1, (Math.log10(Math.max(r, 1e-6)) + 1.3) / 3.3)), target = 3.2 * Math.pow(s, 1.1);
    d += (target - d) * Math.min(1, dt * 2.5); slab.material.map = texs[b]; [ridgeL, ridgeR].forEach(m => m.material.map = texs[b]);
    const w = W3[P.a - 1]; obj.scale.set(w, 1, w); obj.position.y = -d + 1.5; tip.visible = P.a <= 2; tip.scale.set(w * .5, 1, w * .5); tip.position.y = -d - .2; obj.material.color.set(P.a >= 3 ? 0xb45309 : 0x94a3b8);
    const lw = Math.max(w, 1.5), lh = .35 + P.f * .3; load.scale.set(lw, lh, lw); load.position.y = -d + 3 + lh / 2; const top = -d + 3 + lh; arr.to(0, top + 2.2, 0, top + .15, 0);
    const soft = b < 3 && d > .25, rh = Math.min(1.6, d * .5); [ridgeL, ridgeR].forEach((m, i) => { m.visible = soft; m.scale.set(1, rh, 1); m.position.set((i ? 1 : -1) * (w / 2 + .3), rh * .175, 0); });
    gauge.visible = d > .08; gauge.scale.y = Math.max(.01, d); gauge.position.set(w / 2 + 1.3, -d / 2, 1.4);
    P.pk = pk; P.F_ = F; P.A_ = A; P.cm = d * 1.5; P.lv = pk < 5 ? 0 : pk < 50 ? 1 : pk < 500 ? 2 : pk < 5000 ? 3 : 4; P.sink = d < .12 ? 0 : d < .9 ? 1 : d < 2 ? 2 : 3;
    lab.set('Pressure: ' + LV[P.lv], P.lv > 2 ? '#f87171' : '#4ade80'); lMat.set('Base: ' + MAT[b], '#e2e8f0'); lDepth.position.set(w / 2 + 1.3, Math.max(-d - .9, -3.3), 1.4); lDepth.set(d > .12 ? `sinks ${P.cm.toFixed(1)} cm` : 'no dent', '#fde047');
    if (P.sink === 0 && pk > 1000 && P.b >= 4) P.hardOk = true; if (P.sink >= 2 && P.b === 1) P.softSink = true;
  },
  ro: { Pressure: P => fmt(P.pk), Force: P => P.F_ + ' N', 'Touching area': P => P.A_ + ' cm²', 'Sinks in': P => ['Not at all', 'A little', 'Quite deep', 'Very deep'][P.sink] },
  status: P => P.sink >= 2 ? ['Sinks in deep', false, 'warn'] : P.sink === 1 ? ['Sinks a little', true] : ['Hardly sinks', true],
  note: P => P.sink >= 2 ? `<b>High pressure on a soft base!</b> The ${P.F_} N push is squeezed onto only ${P.A_} cm², so ${MAT[P.b - 1].toLowerCase()} gives way.` : P.sink === 1 ? '<b>A small dent.</b> A bigger area or a harder base would stop it.' : P.pk > 1000 ? `<b>Very high pressure — but the base is hard.</b> ${MAT[P.b - 1]} hardly gives way, even under a sharp point.` : '<b>Low pressure.</b> The push is spread over a big area, so the base hardly sinks.',
  try: [{ t: 'Pick <b>Sand</b> and <b>Needle tip</b>. Push with <b>100 N</b>. Does it sink?', check: P => P.b === 2 && P.a === 1 && P.f >= 4 && P.sink >= 2, yes: 'Yes! Tiny area, huge pressure.' },
    { t: 'Keep 100 N. Change the area to <b>Brick flat</b>. What happens?', check: P => P.b === 2 && P.a === 4 && P.f >= 4 && P.sink <= 1, yes: 'Yes! A wide area spreads the force.' },
    { t: 'Set the base to <b>Foam</b> and use <b>Brick flat</b>. Does a soft base still give way?', check: P => P.softSink, yes: 'Yes! A soft base sinks even under a wide block.' },
    { t: 'Choose <b>Concrete</b> with the <b>Needle tip</b>. Does it sink?', check: P => P.hardOk, yes: 'Yes! A hard base resists high pressure.' }],
  key: ['<b>Pressure = force ÷ area.</b> It is the force on each unit of surface.', 'Same force on a <b>smaller area</b> → <b>more pressure</b>.', 'The unit is the <b>pascal (Pa)</b>: 1 Pa = 1 N on every 1 m². Big numbers are written in kPa or MPa.', 'Soft bases give way at low pressure; hard bases need very high pressure.', 'Nails and knives are sharp; tractors and camels have wide feet.'],
  quiz: [{ q: 'Same force, smaller area — the pressure becomes…', o: ['smaller', 'the same', 'bigger'], a: 2, why: 'Pressure = force ÷ area, so a smaller area gives a bigger pressure.' }, { q: 'Why does a camel have wide feet?', o: ['To make pressure small on sand', 'To look nice', 'To make pressure big'], a: 0, why: 'A wide foot spreads the weight, so the pressure is low and it does not sink.' }, { q: 'The same needle pushes on foam and on concrete. Which sinks more?', o: ['Foam', 'Concrete', 'Both the same'], a: 0, why: 'Foam is soft, so it gives way at a much lower pressure.' }]
};
