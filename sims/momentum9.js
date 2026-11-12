// Class 9 · Ch 9 Force and Laws of Motion — Newton's third law and conservation of momentum (trolley 2 starts at rest).
import { V, box, floor, arrow, label } from '../scene.js';
const K = .9, X1 = -14;
let a, b, fA, fB, l1, l2, lA, lB, x1, x2, v1, v2, ph, tc, pa;
const len = m => 1.5 + .12 * m;
export default {
  title: 'Collision — Momentum', cam: { d: 15, e: .2, a: 0, t: V(0, 1.2, 0), ref: 2 },
  head: 'Total momentum before',
  sliders: [{ k: 'm1', l: 'Mass 1', min: 1, max: 10, step: 1, v: 4, u: 'kg' }, { k: 'm2', l: 'Mass 2', min: 1, max: 10, step: 1, v: 2, u: 'kg' }, { k: 'u', l: 'Speed 1', min: 1, max: 8, step: 1, v: 4, u: 'm/s' },
    { k: 'c', l: 'After the bump', min: 1, max: 2, step: 1, v: 1, names: ['Bounce', 'Stick together'] }],
  setup() {
    floor(40, 8); a = box(1, 1, 1.8, 0xf59e0b); b = box(1, 1, 1.8, 0x38bdf8); fA = arrow(0xef4444, .12); fB = arrow(0x22c55e, .12);
    l1 = label('', '#fcd34d', .9); l2 = label('', '#7dd3fc', .9); lA = label('', '#fca5a5', .9); lB = label('', '#86efac', .9);
  },
  reset(P) { x1 = X1; x2 = 0; v1 = P.u; v2 = 0; ph = 0; tc = -1; pa = null; },
  step(dt, P) {
    const L1 = len(P.m1), L2 = len(P.m2); a.scale.x = L1; b.scale.x = L2; a.position.y = b.position.y = .75; a.scale.y = b.scale.y = 1;
    const gap = L1 / 2 + L2 / 2;
    if (ph === 0 && v1 === P.u && x2 - x1 - gap <= 0) {                                              // the bump: real collision formulas
      const u = P.u, M = P.m1 + P.m2; if (P.c === 2) v1 = v2 = P.m1 * u / M; else { v1 = (P.m1 - P.m2) / M * u; v2 = 2 * P.m1 / M * u; } ph = 1; tc = 0; pa = P.m1 * v1 + P.m2 * v2; P.v1 = v1; P.v2 = v2;
    }
    if (ph === 0 && !(x2 - x1 - gap <= 0)) { x1 += v1 * K * dt; }
    else if (ph === 1) { tc += dt; x1 += v1 * K * dt; x2 += v2 * K * dt; if (x2 - x1 < gap && P.c === 1) x1 = x2 - gap; if (P.c === 2) x2 = x1 + gap; if (tc > 7 || ((x2 > 17 || x1 > 17 || x1 < -17) && tc > 3)) { x1 = X1; x2 = 0; v1 = P.u; v2 = 0; ph = 0; pa = null; } }
    if (ph === 0) { v1 = P.u; if (x2 - x1 - gap < 0) x1 = x2 - gap; }
    a.position.x = x1; b.position.x = x2; P.pb = P.m1 * P.u; P.pa = pa; P.ph = ph; P.sp1 = ph ? v1 : null; P.sp2 = ph ? v2 : null;
    const hit = ph === 1 && tc < .7, F = 3; fA.visible = fB.visible = hit; if (hit) { fA.set(x1 + L1 / 2 + F, 1.9, F, -1, 0); fB.set(x2 - L2 / 2, 1.9, F, 1, 0); }
    lA.position.set(x1 + L1 / 2 + F / 2, 2.8, 0); lA.set(hit ? 'Force on 1' : ''); lB.position.set(x2 - L2 / 2 + F / 2, 2.8, 0); lB.set(hit ? 'Force on 2' : '');
    l1.position.set(x1, 2.2, 0); l1.set(`Trolley 1 · ${P.m1} kg`); l2.position.set(x2, 3.4, 0); l2.set(`Trolley 2 · ${P.m2} kg`);
  },
  ro: { 'Total momentum before': P => P.pb.toFixed(1) + ' kg m/s', 'Total momentum after': P => P.pa == null ? '…' : P.pa.toFixed(1) + ' kg m/s', 'Speeds after': P => P.ph ? `${P.sp1.toFixed(1)} and ${P.sp2.toFixed(1)} m/s` : '…' },
  status: P => P.ph ? ['Momentum is conserved ✓', true] : ['Waiting for the bump', false, 'warn'],
  note: P => P.ph ? `<b>Before = after</b>: ${P.pb.toFixed(1)} = ${P.m1} × ${P.sp1.toFixed(1)} + ${P.m2} × ${P.sp2.toFixed(1)}. The two forces are equal and opposite.` : `<b>p = m × v</b>: before the bump p = ${P.m1} × ${P.u} = ${P.pb.toFixed(1)} kg m/s.`,
  try: ['Make both masses equal and choose Bounce. What happens to trolley 1?', 'Make Mass 1 much bigger than Mass 2. Which trolley moves faster after?', 'Choose Stick together and check the speed with v = m₁u ÷ (m₁ + m₂).'],
  key: ['Third law: action and reaction are equal and opposite, on different bodies.', 'Momentum p = m × v, measured in kg m/s.', 'With no outside force, total momentum before = total momentum after.', 'Stuck together: v = m₁u ÷ (m₁ + m₂).'],
  quiz: [{ q: 'A 2 kg trolley at 3 m/s hits a 2 kg trolley at rest and they stick. Final speed?', o: ['1.5 m/s', '3 m/s', '6 m/s'], a: 0, why: 'v = 2 × 3 ÷ 4 = 1.5 m/s.' }, { q: 'In a collision the forces on the two trolleys are…', o: ['equal and opposite', 'equal and in the same direction', 'different sizes'], a: 0, why: 'Newton\'s third law.' }, { q: 'Which quantity is conserved in a collision with no outside force?', o: ['Speed', 'Momentum', 'Force'], a: 1, why: 'Total momentum stays the same.' }]
};
