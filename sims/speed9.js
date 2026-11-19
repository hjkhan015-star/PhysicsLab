// Class 9 · Ch 8 Motion — SPEED vs VELOCITY: speed is only "how fast"; velocity is "how fast and which way". Three scenes.
import { S, V, THREE, box, sph, arrow, arrowTo, label, trail, wire } from '../scene.js';
const TABS = [['dist9', 'Distance'], ['speed9', 'Speed'], ['accel9', 'Accel.'], ['graphs9', 'Graphs'], ['motion9', 'Equations'], ['circular9', 'Circular']];
const K = .15, HL = 5, R = 3, PER = 4 * HL + 2 * Math.PI * R, OUT = 80;           // 1 m = .15 units · stadium track (straights 2·HL, bends radius R) · round trip length (m)
const compass = a => ['East', 'North-east', 'North', 'North-west', 'West', 'South-west', 'South', 'South-east'][Math.round(((a % 360) + 360) % 360 / 45) % 8];
function oval(d) {                                   // position + heading (radians) after distance d along the stadium, starting bottom-left going east
  d = ((d % PER) + PER) % PER; const SL = 2 * HL, AL = Math.PI * R;
  if (d < SL) return [-HL + d, -R, 0]; d -= SL; if (d < AL) { const a = -Math.PI / 2 + d / R; return [HL + R * Math.cos(a), R * Math.sin(a), a + Math.PI / 2]; } d -= AL;
  if (d < SL) return [HL - d, R, Math.PI]; d -= SL; const a = Math.PI / 2 + d / R; return [-HL + R * Math.cos(a), R * Math.sin(a), a + Math.PI / 2];
}
let g = [[], [], []], carA, carB, vA, vB, ball, vArr, tr, run, runner, mm = -1, s, t, done, ang;
const car = (c, y) => { const o = box(2.4, .9, 1, c); o.position.y = y; const t = box(1.2, .55, .9, 0xe2e8f0); t.position.set(-.1, .65, 0); o.add(t); S.remove(t); return o; };
function load(m) { mm = m; s = 0; t = 0; done = false; tr.clear(); g.forEach((a, i) => a.forEach(o => o.visible = i === m - 1)); }
export default {
  title: 'Speed and Velocity', tabs: TABS, cam: { d: 19, e: 0, a: 0, t: V(0, 0, 0), ref: 1.3 }, head: 'Speed',
  sliders: [{ k: 'm', l: '🎬 Scene', min: 1, max: 3, step: 1, v: 1, names: ['Two cars', 'Round the bend', 'Round trip'] }, { k: 'v', l: '🚀 Speed', min: 5, max: 30, step: 5, v: 20, u: 'm/s' }],
  setup() {
    const gr = new THREE.GridHelper(30, 15, 0x3a4a70, 0x24304d); gr.rotation.x = Math.PI / 2; gr.position.z = -.1; S.add(gr);
    carA = car(0xef4444, 2); carB = car(0x3b82f6, -2); vA = arrow(0xfacc15, .12); vB = arrow(0xfacc15, .12); g[0].push(carA, carB, vA, vB);
    const lA = label('Car A', '#fca5a5', 1), lB = label('Car B', '#93c5fd', 1); lA.position.set(-7, 3.9, 0); lB.position.set(-7, -.1, 0); g[0].push(lA, lB);
    const pts = []; for (let i = 0; i <= 80; i++) { const o = oval(i / 80 * PER); pts.push([o[0], o[1]]); } g[1].push(wire(pts, 0x475569, .35, -.05));
    ball = sph(.45, 0xf97316); vArr = arrowTo(0xfacc15, .11); g[1].push(ball, vArr);
    for (let i = 0; i <= 4; i++) { const m = box(.12, .5, .2, 0x64748b); m.position.set(-6 + i * 3, -2.2, 0); g[2].push(m); } runner = sph(.45, 0xf97316); g[2].push(runner);
    run = arrow(0xfacc15, .12); g[2].push(run); const a = label('start', '#86efac', 1), b = label('turn', '#fca5a5', 1); a.position.set(-6, -3.4, 0); b.position.set(6, -3.4, 0); g[2].push(a, b);
    tr = trail(0xf97316, 40, .2, true);
  },
  reset(P) { load(P.m || 1); },
  step(dt, P) {
    if (P.m !== mm) load(P.m); const v = P.v, u = v * K;
    if (mm === 1) { const x = ((t * u + 9) % 18) - 9; t += dt; carA.position.x = x; carB.position.x = -x; vA.set(x - 1.3, 3.1, 1.2 + v * .08, 1); vB.set(-x + 1.3, -.9, 1.2 + v * .08, -1); }
    else if (mm === 2) { s += dt * u; const o = oval(s), h = o[2]; ball.position.set(o[0], o[1], .2); tr.put(o[0], o[1], .1); vArr.to(o[0], o[1], o[0] + Math.cos(h) * (1 + v * .09), o[1] + Math.sin(h) * (1 + v * .09), .5); ang = h * 180 / Math.PI; }
    else { if (!done) { t += dt; s += dt * u; } const tot = 2 * OUT * K; if (s >= tot) { s = tot; done = true; } const x = s <= OUT * K ? s : tot - s; runner.position.set(-6 + x * 12 / (OUT * K) * 1, 0, .2); tr.put(runner.position.x, 0, .1); const dir = s < OUT * K && !done ? 1 : -1; run.set(runner.position.x, 1.5, done ? 0 : 1.4 + v * .08, dir, .3); }
    P.t = t; P.d = s / K; P.fin = done;
  },
  ro: { Speed: P => P.v + ' m/s', Velocity: P => P.m === 1 ? 'A +' + P.v + ' · B −' + P.v + ' m/s' : P.m === 2 ? compass(ang) + ' (' + ((ang % 360 + 360) % 360).toFixed(0) + '°)' : (P.fin ? '0' : (P.d <= OUT ? '+' : '−') + P.v) + ' m/s',
    'Average speed': P => P.m === 3 && P.t > .1 ? (P.d / (P.t || 1)).toFixed(1) + ' m/s' : null, 'Average velocity': P => { if (P.m !== 3 || P.t < .1) return null; const disp = P.d <= OUT ? P.d : 2 * OUT - P.d; return (disp / P.t).toFixed(1) + ' m/s'; } },
  status: P => P.m === 1 ? ['Same speed · opposite velocities', true] : P.m === 2 ? ['Speed constant · velocity changing', true] : P.fin ? ['Back at start', false, 'warn'] : ['Running', true],
  note: P => P.m === 1 ? `Both cars do <b>${P.v} m/s</b>, so their <b>speed</b> is the same. But A moves right (+) and B moves left (−): their <b>velocities</b> are +${P.v} and −${P.v} m/s — different.`
    : P.m === 2 ? `The ball keeps the same speed, <b>${P.v} m/s</b>, all the way round. The yellow arrow (velocity) keeps turning on the bends, so the <b>velocity changes</b> even though the speed does not.`
    : `Out and back, ${OUT} m each way. <b>Average speed</b> = total distance ÷ time. <b>Average velocity</b> = displacement ÷ time. When he is back at the start the displacement is 0, so the average velocity is <b>0</b>, but the average speed is ${P.v} m/s.`,
  try: ['In <b>Two cars</b>, raise the speed. Does the difference between the two velocities change?', 'In <b>Round the bend</b>, watch the Monitor: the speed stays the same. What does the direction do?', 'In <b>Round trip</b>, wait until he is back. Compare average speed and average velocity.'],
  key: ['<b>Speed</b> = distance ÷ time. Scalar: only magnitude.', '<b>Velocity</b> = displacement ÷ time. Vector: magnitude and direction.', 'A body moving in a circle at constant speed has a changing velocity.', 'Average velocity can be zero while average speed is not. Speed is never negative; velocity can be + or −.'],
  quiz: [{ q: 'Two cars each go at 20 m/s, one east and one west. Which is true?', o: ['same speed, same velocity', 'same speed, different velocity', 'different speed'], a: 1, why: 'Speed is 20 m/s for both, but the directions are opposite.' }, { q: 'A runner goes 100 m out and 100 m back in 40 s. His average velocity is…', o: ['5 m/s', '2.5 m/s', '0'], a: 2, why: 'Displacement is zero, so average velocity = 0 ÷ 40 = 0. (His average speed is 200 ÷ 40 = 5 m/s.)' }, { q: 'Speed is a scalar because it has…', o: ['no direction', 'no unit', 'no size'], a: 0, why: 'A scalar has magnitude only.' }]
};
