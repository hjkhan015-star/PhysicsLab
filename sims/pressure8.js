// Class 8 · Ch 11 Force and Pressure — same push on a smaller area = more pressure. Easy words, no formulas.
import { V, box, label } from '../scene.js';
const LOAD = ['Light', 'Medium', 'Heavy', 'Very heavy'], AREA = ['Needle tip', 'Nail head', 'Brick edge', 'Brick flat'], F = [1, 2, 4, 8], AR = [.25, 1, 4, 16], LV = ['Very low', 'Low', 'Medium', 'High', 'Very high'];
let blk, top, lab, d;
export default {
  title: 'Force & Pressure — Sink or Not?', cam: { d: 20, e: .08, a: 0, t: V(0, 1.8, 0), ref: 1.3 },
  sliders: [{ k: 'f', l: '⚖️ How heavy', min: 1, max: 4, step: 1, v: 3, names: LOAD, axis: true }, { k: 'a', l: '📐 Touching area', min: 1, max: 4, step: 1, v: 1, names: AREA, axis: true }],
  setup() { const sand = box(16, 3, 5, 0xd9b26f); sand.position.y = -1.5; sand.material.transparent = true; sand.material.opacity = .62; blk = box(1, 2.6, 1, 0x94a3b8); top = box(1, 1, 1, 0xef4444); lab = label('', '#fff', 1.2); lab.position.set(0, 6.6, 0); },
  reset() { d = 0; },
  step(dt, P) {
    const pr = F[P.f - 1] / AR[P.a - 1], target = Math.min(2.8, .45 * Math.sqrt(pr)), w = Math.sqrt(AR[P.a - 1]) * .9; d += (target - d) * Math.min(1, dt * 3);
    blk.scale.set(w, 1, w); blk.position.y = -d + 1.3; const tw = Math.max(w, 1.4), th = .5 + .25 * P.f; top.scale.set(tw, th, tw); top.position.y = -d + 2.6 + th / 2;
    P.pr = pr; P.lv = pr < .5 ? 0 : pr < 2 ? 1 : pr < 6 ? 2 : pr < 14 ? 3 : 4; P.d = d; lab.set('Pressure: ' + LV[P.lv], P.lv > 2 ? '#f87171' : '#4ade80');
  },
  ro: { Pressure: P => LV[P.lv] },
  status: P => P.lv > 2 ? ['Sinks in deep', false, 'warn'] : ['Hardly sinks', true],
  note: P => P.lv > 2 ? '<b>High pressure!</b> The weight pushes on a tiny area, so it sinks.' : '<b>Low pressure.</b> The weight spreads over a big area, so it hardly sinks.',
  try: [{ t: 'Set the area to <b>Brick flat</b>. Does it still sink?', check: P => P.a === 4 && P.lv < 3, yes: 'Yes! A big area spreads the weight.' },
    { t: 'Keep <b>Brick flat</b>. Make the weight <b>Very heavy</b>. Does it sink a lot?', check: P => P.a === 4 && P.f === 4, yes: 'Yes! A wide area keeps pressure low.' },
    { t: 'Pick <b>Needle tip</b> and <b>Very heavy</b>. How is the pressure?', check: P => P.a === 1 && P.f === 4, yes: 'Yes! A sharp tip gives very high pressure.' }],
  key: ['Pressure is the force pushing on each bit of surface. Air also presses on us from all sides: <b>atmospheric pressure</b>.', 'The same weight on a smaller area gives more pressure.', 'Pressure is measured in <b>pascal (Pa)</b>.', 'Sharp nails and wide tractor tyres use this idea.'],
  quiz: [{ q: 'Same weight, smaller area — the pressure becomes…', o: ['smaller', 'the same', 'bigger'], a: 2, why: 'A smaller area makes the pressure bigger.' }, { q: 'Why is the tip of a nail sharp?', o: ['To look nice', 'Small area gives big pressure', 'To make it lighter'], a: 1, why: 'A small area makes a large pressure from a small push.' }]
};
