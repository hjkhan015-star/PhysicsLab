// Class 9 · Ch 11 Work and Energy — WORK: W = F × s × cos θ. A crate is moved along the floor while a force pulls at an angle.
import { V, box, floor, arrowTo, label, trail } from '../scene.js';
const TABS = [['work9', 'Work'], ['forms9', 'PE & KE'], ['energy9', 'Conserve'], ['power9', 'Power'], ['transform9', 'Transform']];
const K = 1.3, X0 = -8, SPD = 1.5, COS = [1, .5, 0], SIN = [0, .866, 1];
let crate, aF, aC, aV, tr, s = 0, key = '';
export default {
  title: 'Work — W = F × s × cos θ', tabs: TABS, cam: { d: 11.5, e: .22, a: .08, t: V(0, 1.8, 0) }, head: 'Work done',
  sliders: [{ k: 'F', l: 'Force F', min: 10, max: 50, step: 10, v: 30, u: 'N' }, { k: 'an', l: '📐 Angle of the force', min: 1, max: 3, step: 1, v: 1, names: ['0°', '60°', '90°'] }, { k: 's', l: 'Distance s', min: 2, max: 10, step: 2, v: 6, u: 'm' }],
  setup() {
    floor(40, 10); crate = box(2, 1.4, 1.6, 0xf59e0b); crate.position.y = .7; aF = arrowTo(0xe2e8f0, .07); aC = arrowTo(0x22c55e, .12); aV = arrowTo(0x94a3b8, .09); tr = trail(0x22c55e, 40, .14, true);
    for (let i = 0; i <= 5; i++) label(i * 2 + ' m', '#cbd5e1', .8).position.set(X0 + i * 2 * K, .1, 2.2);
  },
  reset() { key = ''; },
  step(dt, P) {
    const k = [P.F, P.an, P.s].join(); if (k !== key) { key = k; s = 0; tr.clear(); }
    if (s < P.s) s = Math.min(P.s, s + dt * SPD); const x = X0 + K * s, L = 1 + P.F * .07, c = COS[P.an - 1], n = SIN[P.an - 1];
    crate.position.x = x; if (s < P.s) tr.put(x, .15, 1);
    aF.to(x, 1.5, x + c * L, 1.5 + n * L, .5); aC.to(x, 1.5, x + c * L, 1.5, .6); aV.to(x + c * L, 1.5, x + c * L, 1.5 + n * L, .6);
    P.W = P.F * c * s; P.Fc = P.F * c; P.ds = s; P.fin = s >= P.s;
  },
  graph: P => ({ pts: [[0, P.Fc], [P.ds, P.Fc]], xmax: 10, ymax: 60, xl: 'distance s (m)', yl: 'force along motion F cos θ (N)', color: '#22c55e', fill: 1 }),
  ro: { 'Work done': P => P.W.toFixed(0) + ' J', 'F cos θ': P => P.Fc.toFixed(0) + ' N', 'Distance moved': P => P.ds.toFixed(1) + ' m', Angle: P => [0, 60, 90][P.an - 1] + '°' },
  status: P => P.an === 3 ? ['Force ⟂ motion · no work', false, 'warn'] : P.fin ? ['Finished', false, 'warn'] : ['Moving', true],
  note: P => `<b>W = F × s × cos θ</b> = ${P.F} × ${P.ds.toFixed(1)} × ${COS[P.an - 1]} = <b>${P.W.toFixed(0)} J</b>. ` + (P.an === 3 ? 'The force is at 90° to the motion: <b>no work is done</b>, like carrying a bag along a level road.' : P.an === 2 ? 'Only the part of the force along the motion (green) does work. The grey part only lifts.' : 'The force is along the motion, so all of it does work: W = F × s.'),
  try: ['Keep the angle at 0°. Double the distance. What happens to the work?', 'Choose 60°. Compare the work with 0° for the same F and s.', 'Choose 90°. Does the crate move? Is any work done? Why?'],
  key: ['Work is done when a force moves a body <b>in the direction of the force</b>.', '<b>W = F × s</b> (force along the motion). Unit: joule (J). 1 J = 1 N × 1 m.', 'If the force is at an angle θ: <b>W = F s cos θ</b>. At 90°, W = 0.', 'The area under a force–distance graph is the work done.'],
  quiz: [{ q: 'A force of 20 N moves a box 5 m in its own direction. The work done is…', o: ['4 J', '100 J', '25 J'], a: 1, why: 'W = F × s = 20 × 5 = 100 J.' }, { q: 'A porter carries a load along a level road. The work done by the lifting force is…', o: ['maximum', 'zero', 'negative always'], a: 1, why: 'The force (up) is at 90° to the motion (forward), so W = 0.' }, { q: 'The unit of work is…', o: ['watt', 'newton', 'joule'], a: 2, why: '1 joule = 1 newton × 1 metre.' }]
};
