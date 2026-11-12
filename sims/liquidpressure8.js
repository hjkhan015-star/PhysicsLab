// Class 8 · Ch 11 Force and Pressure — liquids: water pushes sideways, and deeper water pushes harder.
import { S, V, box, arrow, arrowTo, mat, THREE, label } from '../scene.js';
const LEV = ['Low', 'Half', 'High', 'Full'], H = [1.5, 2.6, 3.4, 3.9], HH = [.8, 2, 3.2], BASE = 3.5, G = 9.8, N = 22, PUSH = 0x22c55e, WATER = 0x38bdf8;
let water, jets, ar, ab, t;
const jp = new Float32Array(3 * N * 3);
export default {
  title: 'Water Pushes Sideways', cam: { d: 17, e: .2, a: 0, t: V(3.5, 3.6, 0), ref: 1.6 },
  head: 'Strongest push',
  sliders: [{ k: 'h', l: '💧 Water height', min: 1, max: 4, step: 1, v: 4, names: LEV }, { k: 'o', l: '🕳 Open holes', min: 1, max: 3, step: 1, v: 1, names: ['All', 'Top', 'Bottom'] }],
  setup() {
    const g = box(26, .3, 6, 0x3f6b3a); g.position.set(4, -.15, 0); box(4.4, BASE, 2.2, 0x8a5a2b).position.set(0, BASE / 2, 0);
    const gl = box(4, 4, 2, 0xbfdbfe); gl.material = mat(0xbfdbfe, { transparent: true, opacity: .22 }); gl.position.y = BASE + 2;
    water = box(3.8, 1, 1.8, WATER); water.material = mat(WATER, { transparent: true, opacity: .6 });
    jets = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(jp, 3)), new THREE.PointsMaterial({ color: 0x7dd3fc, size: .22 })); S.add(jets);
    ar = HH.map(() => arrow(PUSH, .07)); ab = arrowTo(PUSH, .07);
    label('Pushes sideways', '#86efac', .8).position.set(-4.4, 5.5, 0); label('Pushes down', '#86efac', .8).position.set(-4.4, 4.1, 0);
  },
  reset() { t = 0; },
  step(dt, P) {
    t += dt; const h = H[P.h - 1]; water.scale.y = h; water.position.y = BASE + h / 2; let best = 0;
    HH.forEach((hh, i) => { const open = P.o === 1 || (P.o === 2 && i === 2) || (P.o === 3 && i === 0), d = open ? h - hh : 0, y0 = BASE + hh, on = d > .05; if (on) best = Math.max(best, d);
      const vx = on ? Math.sqrt(2 * G * d) : 0, tf = Math.sqrt(2 * y0 / G);
      for (let k = 0; k < N; k++) { const u = ((t * .8 + k / N) % 1) * tf, j = (i * N + k) * 3; jp[j] = 2 + vx * u; jp[j + 1] = on ? y0 - .5 * G * u * u : -99; jp[j + 2] = 0; }
      const L = Math.max(0, (h - hh) * .5); ar[i].set(2 - L, y0, L, 1, 0); ar[i].visible = h > hh && L > .05; });
    jets.geometry.attributes.position.needsUpdate = true; ab.to(-1.3, BASE + .35 + h * .45, -1.3, BASE + .18); P.best = best;
  },
  ro: { 'Strongest push': P => P.best < .05 ? 'None' : P.best < 1 ? 'Weak' : P.best < 2.2 ? 'Medium' : 'Strong' },
  status: P => P.best < .05 ? ['No stream', false, 'warn'] : ['Water flowing', true],
  note: P => P.best < .05 ? 'The open holes are above the water. Add more water to see streams.' : P.o === 1 && P.h > 2 ? 'Deeper water pushes harder, so the lowest stream goes farthest. Water also pushes on the sides and base.' : 'Water pushes out of the hole. Deeper holes get a harder push.',
  try: [{ t: 'Open only the <b>Top</b> hole. Is the push weak or strong?', check: P => P.o === 2 && P.h === 4, yes: 'Yes! The top push is weak.' },
    { t: 'Open only the <b>Bottom</b> hole. Is the push weak or strong?', check: P => P.o === 3 && P.h === 4, yes: 'Yes! The bottom push is strong.' },
    { t: 'Lower the water to <b>Low</b>. What happens to the top streams?', check: P => P.h === 1, yes: 'Yes! The top streams stop.' }],
  key: ['Liquids push on the bottom and on the sides of a container.', 'Deeper water pushes harder.', 'Pressure is the force on each unit of area.', 'Dam walls are thicker at the bottom because deep water pushes hard.'],
  quiz: [{ q: 'Which hole pushes water out the hardest?', o: ['Top', 'Middle', 'Bottom'], a: 2, why: 'The bottom hole has the deepest water above it.' }, { q: 'Why are dam walls thicker at the bottom?', o: ['Deep water pushes harder', 'To look nice', 'Water is lighter there'], a: 0, why: 'Pressure grows with depth.' }]
};
