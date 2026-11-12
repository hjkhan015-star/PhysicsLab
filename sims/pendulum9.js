// Class 9 (bonus) · pendulum — kept from the original lab, with Try/Remember panels.
import { S, D, V, box, sph, beam, THREE } from '../scene.js';
let bob, rod, th, w, tm, lastS, hist, tt;
export default {
  title: 'Simple Pendulum', cam: { d: 16, t: V(0, -3, 0), e: .1, a: .2 },
  graph: P => { const t0 = Math.max(0, tt - 10), ym = Math.ceil((P.A + 5) / 10) * 10; return { pts: hist.filter(h => h[0] >= t0).map(h => [h[0] - t0, h[1]]), xmax: 10, ymax: ym, ymin: -ym, xl: 'time (s)', yl: 'angle (°)' }; },
  sliders: [{ k: 'L', l: 'String length', min: 1, max: 8, step: .5, v: 4, u: 'm' }, { k: 'A', l: 'Starting angle', min: 5, max: 60, step: 5, v: 30, u: '°' }, { k: 'g', l: 'Gravity g', min: 1.6, max: 24, step: .2, v: 9.8, u: 'm/s²' }],
  setup() { box(4, .2, .6, 0x64748b).position.y = .1; bob = sph(.5, 0xef4444); rod = beam(0xe2e8f0, .05); box(30, .1, 10, 0x1b2438).position.y = -9; },
  reset(P) { th = P.A * D; w = 0; tm = 0; tt = 0; hist = []; lastS = 1; P.T0 = 0; },
  step(dt, P) {
    for (let i = 0; i < 8; i++) { const h = dt / 8; w += -(P.g / P.L) * Math.sin(th) * h; th += w * h; }
    const s = Math.sign(th) || 1; if (s !== lastS && s > 0) { P.T0 = tm; tm = 0; } lastS = s; tm += dt; tt += dt;
    const x = P.L * Math.sin(th), y = -P.L * Math.cos(th); bob.position.set(x, y, 0);
    rod.set(V(), V(x, y)); P.th = th; hist.push([tt, th / D]); if (hist.length > 700) hist.shift();
  },
  ro: { 'Formula T': P => (2 * Math.PI * Math.sqrt(P.L / P.g)).toFixed(2) + ' s', 'Measured T': P => P.T0 ? P.T0.toFixed(2) + ' s' : '…wait', Angle: P => (P.th / D).toFixed(0) + '°' },
  note: () => 'T = 2π√(L/g). Longer string → slower swing. Stronger gravity → faster swing. <b>Changing the start angle barely changes T</b> (small angles) and mass does not matter at all!',
  try: ['Make the length 4 times bigger (2 m → 8 m). Does T become 2 times bigger? (T ∝ √L)', 'Set g = 1.6 (Moon). Is the swing faster or slower than on Earth?', 'Change the starting angle (small angles). Does T change?'],
  key: ['<b>T = 2π√(L/g)</b>; T does not depend on mass or (small) amplitude.', 'One oscillation = one full to-and-fro. Frequency f = 1/T.', 'You can measure g: g = 4π²L/T².'],
  quiz: [{ q: 'Which change makes the time period T longer?', o: ['A longer string', 'A heavier bob', 'A smaller start angle'], a: 0, why: 'T = 2π√(L/g) depends on L and g only.' }, { q: 'On the Moon (smaller g) a pendulum swings…', o: ['faster', 'slower', 'the same'], a: 1, why: 'Smaller g gives a longer T.' }]
};
