import { S, D, V, box, sph, line, THREE } from '../kit.js';
let bob, rod, th, w, tm, lastS;
export default {
  title: 'Simple Pendulum', cam: { d: 14, t: V(0, -3, 0), e: .15 },
  sliders: [{ k: 'L', l: 'String length', min: 1, max: 8, step: .5, v: 4, u: 'm' }, { k: 'A', l: 'Starting angle', min: 5, max: 60, step: 5, v: 30, u: '°' }, { k: 'g', l: 'Gravity (Earth 9.8 · Moon 1.6)', min: 1.6, max: 24, step: .2, v: 9.8, u: 'm/s²' }],
  setup() { box(4, .2, .6, 0x64748b).position.y = .1; bob = sph(.5, 0xef4444); rod = line(V(), V(0, -1), 0xffffff); box(30, .1, 10, 0x1b2438).position.y = -9; },
  reset(P) { th = P.A * D; w = 0; tm = 0; lastS = 1; P.T0 = 0; },
  step(dt, P) {
    for (let i = 0; i < 8; i++) { const h = dt / 8; w += -(P.g / P.L) * Math.sin(th) * h; th += w * h; }
    const s = Math.sign(th) || 1; if (s !== lastS && s > 0) { P.T0 = tm; tm = 0; } lastS = s; tm += dt;
    const x = P.L * Math.sin(th), y = -P.L * Math.cos(th); bob.position.set(x, y, 0);
    rod.geometry.setFromPoints([V(), V(x, y)]); P.th = th;
  },
  ro: { 'Formula T': P => (2 * Math.PI * Math.sqrt(P.L / P.g)).toFixed(2) + ' s', 'Measured T': P => P.T0 ? P.T0.toFixed(2) + ' s' : '…wait', Angle: P => (P.th / D).toFixed(0) + '°' },
  note: () => 'T = 2π√(L/g). Longer string → slower swing. Stronger gravity → faster swing. <b>Changing the start angle barely changes T</b> (small angles) and mass does not matter at all!'
};
