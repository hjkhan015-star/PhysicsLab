// Class 9 · Ch 8 Motion — uniform circular motion: constant speed, but the direction (so the velocity) keeps changing.
import { V, sph, wire, arrowTo, label, box } from '../scene.js';
const K = .85;                                     // 1 m on the slider = K scene units
let ball, vA, cA, lv, lc, ang, str, ring, lastR;
export default {
  title: 'Uniform Circular Motion', cam: { d: 19, e: 0, a: 0, t: V(0, 0, 0), ref: 1.3 },
  head: 'Speed v',
  sliders: [{ k: 'r', l: 'Radius', min: 2, max: 8, step: 1, v: 5, u: 'm' }, { k: 'T', l: 'Time period', min: 2, max: 10, step: 1, v: 4, u: 's' }],
  toggles: [{ k: 'sv', l: 'Show velocity', v: true }, { k: 'sc', l: 'Show pull to centre', v: true }],
  setup() {
    sph(.25, 0x94a3b8).position.set(0, 0, 0); ball = sph(.65, 0xef4444); str = box(1, .06, .06, 0x94a3b8);
    vA = arrowTo(0xfacc15, .12); cA = arrowTo(0x38bdf8, .12);
    lv = label('velocity', '#fde047', 1.1); lc = label('pull to centre', '#7dd3fc', 1.1); 
    ring = null; lastR = 0;
  },
  reset() { ang = 0; },
  step(dt, P) {
    ang += dt * 2 * Math.PI / P.T; const R = P.r * K, c = Math.cos(ang), s = Math.sin(ang), x = R * c, y = R * s;
    ball.position.set(x, y, 0); str.scale.x = R; str.position.set(x / 2, y / 2, 0); str.rotation.z = ang;
    if (R !== lastR) { lastR = R; if (ring) ring.parent.remove(ring); const pts = []; for (let i = 0; i <= 72; i++) pts.push([R * Math.cos(i / 72 * 6.2832), R * Math.sin(i / 72 * 6.2832)]); ring = wire(pts, 0x475569, .05); }
    const vl = 1.2 + 3.2 * (2 * Math.PI * P.r / P.T) / (2 * Math.PI * 8 / 2);       // arrow length grows with speed
    vA.visible = P.sv; if (P.sv) { vA.to(x, y, x - s * vl, y + c * vl, .5); lv.position.set(x - s * (vl + 1.7), y + c * (vl + 1.7), 0); } lv.visible = P.sv;
    cA.visible = P.sc; if (P.sc) { cA.to(x, y, x - c * 2.6, y - s * 2.6, .5); lc.position.set(x - c * 5, y - s * 5, 0); } lc.visible = P.sc;
    P.v = 2 * Math.PI * P.r / P.T;
  },
  ro: { 'Speed v': P => P.v.toFixed(2) + ' m/s', 'Time period T': P => P.T + ' s', 'Frequency f': P => (1 / P.T).toFixed(2) + ' Hz', 'Circumference 2πr': P => (2 * Math.PI * P.r).toFixed(1) + ' m' },
  status: () => ['Speed constant · direction changing', true],
  note: P => `<b>v = 2πr ÷ T</b> = 2 × 3.14 × ${P.r} ÷ ${P.T} = <b>${P.v.toFixed(2)} m/s</b>. The speed never changes, but the velocity arrow keeps turning, so this is <b>accelerated motion</b>.`,
  try: ['Make the radius bigger with the same T. What happens to the speed?', 'Make T smaller. Does the ball go faster or slower? Watch the yellow arrow.', 'Switch on the blue arrow. Does it always point to the centre, even as the ball moves?'],
  key: ['<b>Uniform circular motion</b>: a body moves in a circle with constant speed.', 'Speed = circumference ÷ time period: <b>v = 2πr ÷ T</b>.', 'Velocity has a direction, and the direction changes all the time. So the motion is accelerated even though the speed is constant.', 'The velocity is always along the tangent. Examples: a stone on a string, the Moon around the Earth, a satellite.'],
  quiz: [{ q: 'A body moves in a circle at constant speed. Its velocity is…', o: ['constant', 'changing, because its direction changes', 'zero'], a: 1, why: 'Velocity includes direction, and the direction keeps changing.' }, { q: 'r = 7 m and T = 11 s. Take π = 22/7. The speed is…', o: ['4 m/s', '2 m/s', '7 m/s'], a: 0, why: 'v = 2πr ÷ T = 2 × 22/7 × 7 ÷ 11 = 4 m/s.' }, { q: 'The velocity of the ball points…', o: ['to the centre', 'along the tangent', 'away from the centre'], a: 1, why: 'If the string breaks the ball flies off along the tangent.' }]
};
