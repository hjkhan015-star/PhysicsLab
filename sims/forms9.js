// Class 9 · Ch 11 Work and Energy — PE = mgh and KE = ½mv². Bars show how the energy grows when h or v doubles.
import { V, box, sph, floor, label, mat, beam } from '../scene.js';
const TABS = [['work9', 'Work'], ['forms9', 'PE & KE'], ['energy9', 'Conserve'], ['power9', 'Power'], ['transform9', 'Transform']];
const G = 9.8, K = .75, AMB = 0xf59e0b, CY = 0x22d3ee;
let wt, rope, ball, bar, ghost, lG, ya = 0, xb = -9, tm = 0;
const grow = (b, e, mx) => { b.scale.y = Math.max(.02, Math.min(7.5, 7 * e / mx)); b.position.y = b.scale.y / 2; };
export default {
  title: 'Energy — PE = mgh, KE = ½mv²', tabs: TABS, cam: { d: 18.5, e: .12, a: 0, t: V(0, 4.4, 0), ref: 1.3 }, head: 'Energy',
  sliders: [{ k: 'ty', l: '⚡ Energy', min: 1, max: 2, step: 1, v: 1, names: ['PE', 'KE'] }, { k: 'm', l: 'Mass m', min: 1, max: 10, step: 1, v: 5, u: 'kg' }, { k: 'h', l: 'Height h', min: 0, max: 10, step: 1, v: 6, u: 'm', w: P => P.ty === 1 }, { k: 'v', l: 'Speed v', min: 0, max: 20, step: 2, v: 10, u: 'm/s', w: P => P.ty === 2 }],
  setup() {
    floor(30, 10); const pole = box(.25, 8.6, .25, 0x64748b); pole.position.set(-7, 4.3, 0); wt = box(1.6, 1.6, 1.6, AMB); rope = beam(0xcbd5e1, .05);
    for (let i = 0; i <= 5; i++) { label(i * 2 + ' m', '#cbd5e1', .8).position.set(-8.6, .1 + i * 2 * K * 1.1, 0); }
    ball = sph(.9, CY); ball.position.set(-9, .9, 0);
    bar = box(1.8, 1, 1.8, AMB); bar.position.x = 3.6; ghost = box(1.8, 1, 1.8, AMB); ghost.material = mat(AMB, { transparent: true, opacity: .35 }); ghost.position.x = 7.2; label('now', '#e2e8f0', 1).position.set(3.6, 8.4, 0); lG = label('2h', '#e2e8f0', 1); lG.position.set(7.2, 8.4, 0);
  },
  reset() { ya = 0; xb = -9; },
  step(dt, P) {
    const pe = P.ty === 1; wt.visible = rope.visible = pe; ball.visible = !pe; const col = pe ? AMB : CY; bar.material.color.setHex(col); ghost.material.color.setHex(col); lG.set(pe ? 'h × 2' : 'v × 2', '#e2e8f0');
    if (pe) { ya += (P.h * K * 1.1 - ya) * Math.min(1, dt * 4); wt.position.set(-7, ya + .9, 0); rope.set(V(-7, 8.6, 0), V(-7, ya + 1.7, 0)); P.E = P.m * G * P.h; P.E2 = 2 * P.E; grow(bar, P.E, 980); grow(ghost, P.E2, 980); }
    else { xb += dt * P.v * .12; if (xb > 1) xb = -9; ball.position.x = xb; ball.scale.setScalar(.7 + P.m * .06); P.E = .5 * P.m * P.v * P.v; P.E2 = 4 * P.E; grow(bar, P.E, 2000); grow(ghost, P.E2, 2000); }
  },
  ro: { Energy: P => P.E.toFixed(0) + ' J', Mass: P => P.m + ' kg', 'Height h': P => P.ty === 1 ? P.h + ' m' : null, 'Speed v': P => P.ty === 2 ? P.v + ' m/s' : null, 'If doubled': P => P.E2.toFixed(0) + ' J' },
  status: P => P.ty === 1 ? ['Stored (potential) energy', true] : ['Energy of motion', true],
  note: P => P.ty === 1 ? `<b>PE = mgh</b> = ${P.m} × 9.8 × ${P.h} = <b>${P.E.toFixed(0)} J</b>. Double the height and the PE doubles (faded bar).` : `<b>KE = ½mv²</b> = ½ × ${P.m} × ${P.v}² = <b>${P.E.toFixed(0)} J</b>. Double the speed and the KE becomes <b>4 times</b> bigger (faded bar).`,
  try: ['Potential: set h = 4 m, then h = 8 m. What happens to the PE?', 'Kinetic: set v = 5 m/s, then 10 m/s. By what factor does the KE grow?', 'Double the mass in either mode. Does the energy double?'],
  key: ['<b>Potential energy</b> PE = mgh (g = 9.8 m/s²). It depends on mass and height.', '<b>Kinetic energy</b> KE = ½mv². It depends on mass and speed, and grows with the <b>square</b> of the speed.', 'Both are measured in joule (J).', 'A body at rest at ground level has zero PE and zero KE.'],
  quiz: [{ q: 'A 2 kg stone is 10 m high. Its PE is about… (g = 10 m/s²)', o: ['20 J', '200 J', '100 J'], a: 1, why: 'PE = mgh = 2 × 10 × 10 = 200 J.' }, { q: 'A car doubles its speed. Its KE becomes…', o: ['2 times', '4 times', '8 times'], a: 1, why: 'KE = ½mv², so it depends on v².' }, { q: 'A body at rest on the ground has…', o: ['zero PE and zero KE', 'maximum KE', 'maximum PE'], a: 0, why: 'h = 0 and v = 0.' }]
};
