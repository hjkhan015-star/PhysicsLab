// Class 9 · Ch 9 Force and Laws of Motion — F = ma, friction, momentum p = mv.
import { V, box, floor, arrow, label } from '../scene.js';
let b, aF, aR, lF, lR, x, v;
export default {
  title: 'Laws of Motion — F = ma', cam: { d: 17, e: .3, a: .2, t: V(1, 1, 0) },
  sliders: [{ k: 'F', l: 'Applied force F', min: 0, max: 60, step: 1, v: 20, u: 'N' }, { k: 'mu', l: 'Roughness μ', min: 0, max: .8, step: .05, v: .3, u: '' }, { k: 'm', l: 'Mass m', min: 1, max: 10, step: 1, v: 4, u: 'kg' }],
  setup() { floor(30, 10); b = box(2, 1.2, 2, 0xf59e0b); b.position.y = .6; aF = arrow(0x22c55e, .13); aR = arrow(0xef4444, .13); lF = label('', '#4ade80'); lR = label('', '#f87171'); },
  reset() { x = -10; v = 0; },
  step(dt, P) {
    const fmax = P.mu * P.m * 9.8, go = P.F > fmax; let a = 0;
    if (go) { a = (P.F - fmax) / P.m; v += a * dt; } else v = Math.max(0, v - fmax / P.m * dt);
    x += v * dt; if (x > 12) { x = -10; v = 0; } b.position.x = x; b.scale.set(1, 1, 1);
    P.a = a; P.fmax = fmax; P.fr = go || v > .05 ? fmax : Math.min(P.F, fmax); P.v = v; P.p = P.m * v; P.go = go;
    const lp = P.F / 10, lf = P.fr / 10;
    aF.set(x - 1 - lp, 1.8, lp, 1); lF.position.set(x - 1 - lp / 2, 3, 0); lF.set(`F = ${P.F} N`);
    aR.set(x + 1, .4, lf, -1, 1.7); lR.position.set(x + 1 - lf / 2, 1.3, 1.7); lR.set(`f = ${P.fr.toFixed(1)} N`);
  },
  ro: { 'Net force': P => (P.go ? P.F - P.fr : 0).toFixed(1) + ' N', 'a = F/m': P => P.a.toFixed(2) + ' m/s²', Speed: P => P.v.toFixed(1) + ' m/s', 'Momentum p': P => P.p.toFixed(1) + ' kg m/s' },
  head: 'a = F/m', status: P => P.go ? ['Accelerating', true] : ['Balanced', false, 'warn'],
  note: P => P.go ? `<b>Net force = F − f = ${P.F} − ${P.fr.toFixed(1)} = ${(P.F - P.fr).toFixed(1)} N</b>, so a = F<sub>net</sub>/m = <b>${P.a.toFixed(2)} m/s²</b>. Double the mass and a halves (2nd law).`
    : `<b>Balanced forces:</b> friction can be up to μmg = ${P.fmax.toFixed(1)} N, which is ≥ your push, so net force = 0 and the block stays still (1st law: inertia).`,
  try: ['Keep F = 30 N, μ = 0.2. Compare a for m = 2 kg and m = 4 kg.', 'Find the smallest F that starts the block when m = 5 kg, μ = 0.4 (it equals μmg).', 'Let it speed up, then drop F to 0. Why does it slow gradually and not stop at once?'],
  key: ['1st law: a body keeps its state unless an <b>unbalanced force</b> acts (inertia).', '2nd law: <b>F = ma</b> = rate of change of momentum (p = mv).', '3rd law: every action has an <b>equal and opposite reaction</b> (on different bodies).', 'Conservation of momentum: total momentum before = after a collision (no external force).', 'Mass is the measure of inertia: a heavier body is harder to start, stop or turn. Balanced forces cancel; unbalanced forces change motion.'],
  quiz: [{ q: 'The force on a trolley is doubled (same mass). Its acceleration…', o: ['halves', 'doubles', 'stays the same'], a: 1, why: 'a = F/m, so a ∝ F.' }, { q: 'Which law says a body keeps its state of rest or motion unless a force acts?', o: ['1st law', '2nd law', '3rd law'], a: 0, why: 'This is the law of inertia.' }]
};
