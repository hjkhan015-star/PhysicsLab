// Class 9 · Ch 8 Motion — v = u + at, s = ut + ½at², with a live v–t graph in the Monitor.
import { S, V, THREE, mat, box, floor, arrow, label } from '../scene.js';
const K = .06, X0 = -14, T = 10;                      // 1 m = .06 units; run lasts 10 s
let car, arr, s, v, t, done, hist, runP;
export default {
  title: 'Motion — u, a, t', cam: { d: 30, e: .25, a: .12, t: V(0, 1.5, 0) },
  sliders: [{ k: 'u', l: 'Starting speed u', min: 0, max: 20, step: 1, v: 5, u: 'm/s' }, { k: 'a', l: 'Acceleration a', min: -5, max: 5, step: .5, v: 2, u: 'm/s²' }],
  setup() { floor(40, 10); car = new THREE.Group(); S.add(car);
    const m = (g, c, x, y, z) => { const o = new THREE.Mesh(g, mat(c)); o.position.set(x, y, z); car.add(o); return o; };
    m(new THREE.BoxGeometry(2.2, .7, 1.2), 0xef4444, 0, .65, 0); m(new THREE.BoxGeometry(1.1, .5, 1), 0xfca5a5, -.1, 1.15, 0);
    for (const [x, z] of [[-.7, .62], [.7, .62], [-.7, -.62], [.7, -.62]]) { const w = m(new THREE.CylinderGeometry(.3, .3, .2, 16), 0x111827, x, .3, z); w.rotation.x = Math.PI / 2; }
    for (let i = 0; i <= 9; i++) { box(.1, .3, 1.5, 0xffffff).position.set(X0 + i * 50 * K, .15, 2.6); if (i % 2 === 0) label(`${i * 50} m`, '#cbd5e1', .7).position.set(X0 + i * 50 * K, 1, 3.4); }
    arr = arrow(0x22c55e, .16); car.scale.setScalar(1.7); },
  reset(P) { s = 0; v = P.u; t = 0; done = 0; hist = [[0, v]]; runP = { u: P.u, a: P.a }; },
  step(dt, P) {
    if (!done) { let nv = v + P.a * dt; if (nv < 0) nv = 0; s += (v + nv) / 2 * dt; v = nv; t += dt; if (t >= T) done = 1; hist.push([Math.min(t, T), v]); }
    car.position.set(X0 + K * s, 0, 0); arr.set(car.position.x - 1.8, 3.6, Math.max(.01, v * .1), 1); P.s = s; P.v = v; P.t = t; P.done = done;
  },
  graph: () => { const te = runP.a < 0 ? Math.min(T, runP.u / -runP.a) : T, v1 = Math.max(0, runP.u + runP.a * te), ym = Math.max(5, Math.ceil(Math.max(runP.u, v1, runP.u + runP.a * T) / 5) * 5);
    return { pts: hist, xmax: T, ymax: ym, xl: 'time t (s)', yl: 'speed v (m/s)', ref: [[0, runP.u], [te, v1]] }; },
  ro: { 'Velocity v': P => P.v.toFixed(1) + ' m/s', 'Time t': P => P.t.toFixed(1) + ' s', 'Distance s': P => P.s.toFixed(1) + ' m' },
  status: P => P.done ? ['Finished', false, 'warn'] : (P.a < 0 && P.v === 0 && P.t > 0 ? ['Stopped', false, 'warn'] : ['Running', true]),
  note: P => (P.a === 0 ? '<b>Uniform motion</b> — same speed, so the v–t graph is a flat line. ' : P.a > 0 ? '<b>Speeding up</b> — the v–t graph slopes up; slope = a. ' : '<b>Slowing down</b> (retardation) — the v–t graph slopes down. ')
    + `<br>v = u + at = ${P.u} + (${P.a})(${P.t.toFixed(1)}) = <b>${Math.max(0, P.u + P.a * P.t).toFixed(1)} m/s</b> · press ↻ after changing u or a.`,
  try: ['Set u = 0, a = 2. Read s after 5 s, then check it with s = ut + ½at² = ½ × 2 × 25.', 'Set u = 20, a = −4. At what time does the car stop? (use v = u + at = 0)', 'Set a = 0. What shape is the v–t graph, and what does the area under it mean?'],
  key: ['<b>v = u+at</b> · <b>s = ut+½at²</b> · <b>v² = u²+2as</b>', 'Distance is the path length (scalar). Displacement is the straight-line change of position (vector).', 'Slope of a v–t graph = <b>acceleration</b>. Area under a v–t graph = <b>distance</b>.', 'Uniform motion: equal distance in equal time. Non-uniform: unequal distances.', '<b>Speed</b> = distance ÷ time. <b>Velocity</b> = displacement ÷ time. <b>Acceleration</b> = change in velocity ÷ time (m/s²).'],
  quiz: [{ q: 'A car starts from rest with a = 2 m/s². Its speed after 5 s is…', o: ['5 m/s', '10 m/s', '20 m/s'], a: 1, why: 'v = u + at = 0 + 2 × 5 = 10 m/s.' }, { q: 'The slope of a speed–time graph gives…', o: ['distance', 'acceleration', 'mass'], a: 1, why: 'Slope = change in v ÷ change in t = a.' }]
};
