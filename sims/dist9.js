// Class 9 · Ch 8 Motion — DISTANCE vs DISPLACEMENT: the blue trail is the path (distance), the green arrow is the straight line from the start (displacement).
import { S, V, THREE, sph, arrowTo, label, trail, wire } from '../scene.js';
const TABS = [['dist9', 'Distance'], ['speed9', 'Speed'], ['accel9', 'Accel.'], ['graphs9', 'Graphs'], ['motion9', 'Equations'], ['circular9', 'Circular']];
const K = .2, SP = 5, RATE = [.6, 1.2, 2.4], PATHS = [[[0, 0], [60, 0], [20, 0]], [[0, 0], [40, 0], [40, 30], [0, 30], [0, 0]], [[0, 0], [40, 0], [40, 30]]], NM = ['A', 'B', 'C', 'D'];
const PL = p => p.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
const CT = p => [(Math.min(...p.map(q => q[0])) + Math.max(...p.map(q => q[0]))) / 2, (Math.min(...p.map(q => q[1])) + Math.max(...p.map(q => q[1]))) / 2];
function at(p, d) { for (let i = 1; i < p.length; i++) { const L = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (d <= L || i === p.length - 1) { const f = Math.min(1, d / L); return [p[i - 1][0] + f * (p[i][0] - p[i - 1][0]), p[i - 1][1] + f * (p[i][1] - p[i - 1][1])]; } d -= L; } }
const dirW = (dx, dy) => Math.hypot(dx, dy) < .5 ? '–' : ['East', 'North-east', 'North', 'North-west', 'West', 'South-west', 'South', 'South-east'][Math.round(Math.atan2(dy, dx) / (Math.PI / 4) + 8) % 8];
let me, tr, ar, pins = [], routes = [], pi = -1, s = 0, L = 1, lastS = 0, q = [0, 0];
const W = (p, c) => [(p[0] - c[0]) * K, (p[1] - c[1]) * K];
function load(m) { pi = m; const i = m - 1; s = 0; lastS = -9; L = PL(PATHS[i]); tr.clear(); pins.forEach((g, j) => g.forEach(o => o.visible = j === i)); routes.forEach((r, j) => r.visible = j === i); q = PATHS[i][0]; }
export default {
  title: 'Distance and Displacement', tabs: TABS, cam: { d: 17, e: 0, a: 0, t: V(0, 0, 0), ref: 1.3 }, head: 'Displacement',
  sliders: [{ k: 'pa', l: '🛣 Walk', min: 1, max: 3, step: 1, v: 1, names: ['There and back', 'Round the field', 'Corner'] }, { k: 'sp', l: '⏩ Playback', min: 1, max: 3, step: 1, v: 2, names: ['Slow', 'Normal', 'Fast'] }],
  setup() {
    const g = new THREE.GridHelper(20, 10, 0x3a4a70, 0x24304d); g.rotation.x = Math.PI / 2; g.position.z = -.1; S.add(g); label('each square = 10 m', '#94a3b8', .9).position.set(-5.2, -5.4, 0);
    PATHS.forEach((p, i) => { const c = CT(p), w = p.map(a => W(a, c)); routes.push(wire(w, 0x475569, .04, 0));
      pins.push(p.slice(0, i === 1 ? 4 : 3).flatMap((_, j) => { const o = sph(.3, j === 0 ? 0x22c55e : 0xe2e8f0), l = label(j === 0 ? 'A start' : NM[j], '#e2e8f0', 1); o.position.set(w[j][0], w[j][1], .1); l.position.set(w[j][0], w[j][1] + (j === 2 && i === 0 ? -1.1 : 1.1), .2); return [o, l]; })); });
    tr = trail(0x38bdf8, 240, .16, false); ar = arrowTo(0x22c55e, .1); me = sph(.42, 0xf97316);
  },
  reset(P) { load(P.pa || 1); },
  step(dt, P) {
    if (P.pa !== pi) load(P.pa); const p = PATHS[pi - 1], c = CT(p), a0 = W(p[0], c);
    if (s < L) { s = Math.min(L, s + dt * SP * RATE[P.sp - 1]); q = at(p, s); }
    const w = W(q, c); me.position.set(w[0], w[1], .3); if (s - lastS >= .8 || s === L) { lastS = s; tr.put(w[0], w[1], .15); }
    const ao = pi === 1 ? .6 : 0; ar.to(a0[0], a0[1] + ao, w[0], w[1] + ao, .4); P.s = s; P.d = Math.hypot(q[0] - p[0][0], q[1] - p[0][1]); P.t = s / SP; P.dx = q[0] - p[0][0]; P.dy = q[1] - p[0][1]; P.fin = s >= L;
  },
  ro: { Displacement: P => P.d.toFixed(0) + ' m', 'Distance': P => P.s.toFixed(0) + ' m', Direction: P => dirW(P.dx, P.dy), Time: P => P.t.toFixed(0) + ' s' },
  status: P => P.fin ? (P.d < .5 ? ['Back at A · displacement = 0', false, 'warn'] : ['Finished', false, 'warn']) : ['Walking', true],
  note: P => `<span style="color:#38bdf8"><b>Distance</b></span> (blue path) = ${P.s.toFixed(0)} m — how much ground was covered, no direction. <span style="color:#22c55e"><b>Displacement</b></span> (green arrow) = ${P.d.toFixed(0)} m${P.d < .5 ? '' : ' towards ' + dirW(P.dx, P.dy)} — only the straight line from A to here.` + (P.fin && P.d < .5 ? '<br><b>Distance 140 m, displacement 0.</b> He is back where he started.' : ''),
  try: ['Choose <b>Round the field</b> and wait. What is the displacement when he is back at A? And the distance?', 'Choose <b>Corner</b>: walk 40 m east, then 30 m north. Is the displacement 70 m? Check with Pythagoras.', 'Choose <b>There and back</b>: he walks 60 m east, then 40 m west. Find the distance and the displacement.'],
  key: ['<b>Distance</b> is the length of the path travelled. It is a scalar: only a number and a unit.', '<b>Displacement</b> is the shortest straight line from the starting point to the end point, with direction. It is a vector.', 'Distance is never less than the size of the displacement. They are equal only for straight-line motion in one direction.', 'Distance can never be zero for a moving body. Displacement can be zero after a round trip.'],
  quiz: [{ q: 'A runner goes once round a 400 m track and stops where he started. His displacement is…', o: ['400 m', '200 m', 'zero'], a: 2, why: 'Start and end are the same point, so the straight-line change of position is zero. The distance is 400 m.' }, { q: 'Walk 40 m east, then 30 m north. The displacement is…', o: ['70 m', '50 m', '10 m'], a: 1, why: '√(40² + 30²) = 50 m, in the north-east direction.' }, { q: 'Which of these has a direction?', o: ['distance', 'displacement', 'both'], a: 1, why: 'Displacement is a vector. Distance is a scalar.' }]
};
