// Class 9 · Ch 12 Sound — echo and SONAR: distance = speed × time ÷ 2.
import { S, V, box, sph, floor, mat, THREE, label } from '../scene.js';
const VS = 340, SCALE = .2, SLOW = 5, X0 = -11;                      // 1 m = 0.2 scene units · animation is 5× slower than real
let pulse, wall, lc, le, t, run;
export default {
  title: 'Echo — How Far Is the Wall?', cam: { d: 17, e: .25, a: 0, t: V(0, 1.8, 0), ref: 2 },
  head: 'Echo returns after',
  sliders: [{ k: 'd', l: 'Distance to wall', min: 5, max: 100, step: 5, v: 50, u: 'm' }],
  buttons: [{ l: '👏 Clap', fn: () => { t = 0; run = true; } }],
  setup() {
    floor(34, 8); box(.8, 2.6, .8, 0x38bdf8).position.set(X0, 1.3, 0); sph(.6, 0xfcd34d).position.set(X0, 3.2, 0); wall = box(.8, 5, 6, 0x94a3b8);
    pulse = sph(.5, 0xfde047); pulse.material = mat(0xfde047, { transparent: true, opacity: .8 });
    lc = label('', '#fde047', 1.2); le = label('', '#86efac', 1.2); label('Animation slowed down 5 times', '#cbd5e1', 1.4).position.set(0, -1.4, 0);
  },
  reset() { t = 0; run = true; },
  step(dt, P) {
    const d = P.d, T = 2 * d / VS, xw = X0 + d * SCALE; wall.position.set(xw, 2.5, 0); P.T = T; P.heard = T >= .1;
    if (run) t += dt; const tr = t / SLOW, go = Math.min(tr, d / VS), back = Math.max(0, tr - d / VS);                    // real seconds
    const x = tr <= d / VS ? X0 + VS * tr * SCALE : xw - VS * back * SCALE; pulse.visible = run && tr <= T; pulse.position.set(Math.max(X0, x), 2.2, 0);
    if (tr > T + 1.5) run = false; if (tr > T && tr < T + 1.5) pulse.visible = false;
    lc.position.set(X0, 5, 0); lc.set(run && tr < .25 ? 'Clap!' : ''); le.position.set(X0, 6.2, 0); le.set(tr >= T && tr < T + 1.4 ? (P.heard ? 'Echo!' : 'Too quick!') : '');
  },
  ro: { 'Echo returns after': P => P.T.toFixed(3) + ' s', 'There and back': P => 2 * P.d + ' m' },
  status: P => P.heard ? ['Echo heard', true] : ['Too quick to hear', false, 'warn'],
  note: P => `<b>distance = speed × time ÷ 2</b> = 340 × ${P.T.toFixed(3)} ÷ 2 = <b>${P.d} m</b>. ` + (P.heard ? 'You hear the echo.' : 'Too quick to hear. Stand 17 m or more away.'),
  try: ['Set 10 m and clap. Can you hear the echo? Why not?', 'Find the smallest distance where the status says Echo heard.', 'Set 100 m. Check the time with t = 2d ÷ 340.'],
  key: ['An echo is sound that bounces back from a hard surface.', 'An echo needs 0.1 s to be heard: at least 17 m in air.', 'Reverberation is repeated echoes in a big hall; it makes speech unclear.', 'SONAR uses ultrasound echoes; ultrasound also scans bodies, cleans and finds cracks.'],
  quiz: [{ q: 'A clap echoes back after 0.4 s. The wall is…', o: ['68 m', '136 m', '34 m'], a: 0, why: 'd = 340 × 0.4 ÷ 2 = 68 m.' }, { q: 'Why can we not hear an echo from a wall 5 m away?', o: ['The sound is too quiet', 'The echo returns in under 0.1 s', 'Sound cannot reflect'], a: 1, why: 'The echo merges with the original sound.' }, { q: 'SONAR uses…', o: ['light', 'ultrasound', 'magnets'], a: 1, why: 'Ultrasound echoes show depth and objects.' }]
};
