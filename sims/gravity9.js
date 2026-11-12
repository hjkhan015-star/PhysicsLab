// Class 9 · Gravitation — mass vs weight (W = mg) and free fall on different worlds.
import { S, V, box, sph, floor, label } from '../scene.js';
const NAME = ['Moon', 'Mars', 'Earth', 'Jupiter'], G = [1.6, 3.7, 9.8, 24.8], COL = [0xb8b8c0, 0xc1440e, 0x2b6cb0, 0xc9a26b], H = 20, K = .5;   // 20 m drop, 1 m = .5 units
let ball, bar, fl, tm, lw, lp;
export default {
  title: 'Gravitation — Weight & Free Fall', cam: { d: 26, t: V(0, 5, 0), e: .2, a: .35 },
  sliders: [{ k: 'p', l: 'World', min: 1, max: 4, step: 1, v: 3, names: NAME }, { k: 'm', l: 'Mass m', min: 10, max: 100, step: 10, v: 50, u: 'kg' }],
  setup() { fl = floor(30, 10); ball = sph(.6, 0xf97316); box(.2, H * K + 1, .2, 0x64748b).position.set(-5, (H * K + 1) / 2, -1); bar = box(2, 1, 2, 0x22c55e); bar.position.x = 6; lw = label('', '#86efac'); lp = label('', '#fde68a', 1.2); lp.position.set(0, 12.5, 0); },
  reset() { tm = 0; },
  step(dt, P) {
    const g = G[P.p - 1], tf = Math.sqrt(2 * H / g); tm += dt; if (tm > tf + 1) tm = 0;
    const h = Math.max(0, H - .5 * g * Math.min(tm, tf) ** 2); ball.position.set(-5, h * K + .6, 0);
    const W = P.m * g; bar.scale.y = Math.max(.05, W * .004); bar.position.y = bar.scale.y / 2;
    fl.material.color.set(COL[P.p - 1]); P.g = g; P.W = W; P.tf = tf; lw.position.set(6, bar.scale.y + 1.3, 0); lw.set('W = ' + W.toFixed(0) + ' N'); lp.set(NAME[P.p - 1] + '  ·  g = ' + g);
  },
  ro: { g: P => P.g + ' m/s²', 'Mass m': P => P.m + ' kg', 'Weight W = mg': P => P.W.toFixed(0) + ' N', 'Fall time (20 m)': P => P.tf.toFixed(2) + ' s' },
  note: P => `Mass stays <b>${P.m} kg</b> everywhere. Weight = m × g = ${P.m} × ${P.g} = <b>${P.W.toFixed(0)} N</b> here. Free fall from 20 m takes <b>${P.tf.toFixed(2)} s</b>, whatever the mass.`,
  try: ['Keep m = 50 kg. Compare weight on the Moon, Earth and Jupiter. What is the ratio Earth : Moon?', 'Change the mass on Earth. Does the fall time of the ball change?', 'A 60 kg person goes to the Moon. Find mass and weight there.'],
  key: ['Gravitation: <b>F = G m₁m₂ / r²</b>, G = 6.67×10⁻¹¹ N m²/kg²', '<b>Mass</b> (kg) is constant; <b>weight</b> (N) = mg changes with g.', 'g ≈ 9.8 m/s² on Earth; about one-sixth of that on the Moon.', 'In free fall (no air), all objects fall with the same acceleration g.'],
  quiz: [{ q: 'A 60 kg astronaut goes to the Moon. Her mass there is…', o: ['10 kg', '60 kg', '360 kg'], a: 1, why: 'Mass never changes; only weight does.' }, { q: 'In a vacuum, which falls faster?', o: ['A heavy ball', 'A light ball', 'Both together'], a: 2, why: 'Free fall: every body has the same acceleration g.' }]
};
