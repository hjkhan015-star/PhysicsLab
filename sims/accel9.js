// Class 9 · Ch 8 Motion — ACCELERATION: a snapshot every second shows uniform and non-uniform motion. Equal gaps = constant velocity.
import { S, V, THREE, mat, box, floor, arrow, label } from '../scene.js';
const TABS = [['dist9', 'Distance'], ['speed9', 'Speed'], ['accel9', 'Accel.'], ['graphs9', 'Graphs'], ['motion9', 'Equations'], ['circular9', 'Circular']];
const T = 10, X0 = -12, TYPES = ['Steady', 'Faster', 'Slower', 'Uneven'];
let car, ghosts = [], vA, aA, key = '', x, v, a, t, nG, hist, prof, K, lastGap, kk, trk;
function acc(P, tt) { return P.ty === 1 ? 0 : P.ty === 2 ? P.a : P.ty === 3 ? -P.a : P.a * Math.sin(2.2 * tt); }
function sim(P) {                                         // pre-run the 10 s so the track can be scaled to fit
  let s = 0, vv = P.ty === 4 ? Math.max(P.u, P.a * .6) : P.u, mx = 0; const out = [[0, vv, 0]];
  for (let i = 1; i <= 100; i++) { const tt = i * .1; vv = Math.max(0, vv + acc(P, tt - .05) * .1); s += vv * .1; mx = Math.max(mx, vv); out.push([tt, vv, s]); }
  return { out, vmax: mx, smax: s };
}
function begin(P) { prof = sim(P); K = 22 / Math.max(prof.smax, 30); x = 0; v = prof.out[0][1]; t = 0; nG = 0; hist = [[0, v]]; lastGap = 0; kk = [P.ty, P.u, P.a].join(); ghosts.forEach(g => g.visible = false); }
export default {
  title: 'Acceleration — uniform or not', tabs: TABS, cam: { d: 19, e: .3, a: .1, t: V(0, 1.2, 0) }, head: 'Velocity v',
  sliders: [{ k: 'ty', l: '🏎 Motion', min: 1, max: 4, step: 1, v: 2, names: TYPES }, { k: 'u', l: 'Starting speed u', min: 0, max: 20, step: 2, v: 4, u: 'm/s' }, { k: 'a', l: 'Acceleration a', min: 1, max: 5, step: 1, v: 2, u: 'm/s²', w: P => P.ty > 1 }],
  setup() {
    floor(40, 10); car = new THREE.Group(); S.add(car);
    const m = (g, c, px, py, pz) => { const o = new THREE.Mesh(g, mat(c)); o.position.set(px, py, pz); car.add(o); return o; };
    m(new THREE.BoxGeometry(2.2, .7, 1.2), 0xef4444, 0, .65, 0); m(new THREE.BoxGeometry(1.1, .5, 1), 0xfca5a5, -.1, 1.15, 0);
    for (const [px, pz] of [[-.7, .62], [.7, .62], [-.7, -.62], [.7, -.62]]) { const w = m(new THREE.CylinderGeometry(.3, .3, .2, 16), 0x111827, px, .3, pz); w.rotation.x = Math.PI / 2; }
    car.scale.setScalar(1.3);
    for (let i = 0; i <= T; i++) { const g = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.2, 1.3), mat(0x22d3ee, { transparent: true, opacity: .6 })); g.position.y = .65; g.visible = false; S.add(g); ghosts.push(g); }
    vA = arrow(0xfacc15, .14); aA = arrow(0xf87171, .14); label('snapshot every 1 s', '#67e8f9', 1).position.set(0, 4.4, 0);
  },
  reset(P) { begin(P); },
  step(dt, P) {
    if ([P.ty, P.u, P.a].join() !== kk) begin(P);
    if (t < T) { let r = Math.min(T, t + dt) - t;
      while (r > 1e-9) { const h = Math.min(.02, r, nG - t > 1e-9 ? nG - t : .02); a = acc(P, t + h / 2); v = Math.max(0, v + a * h); x += v * h; t += h; r -= h;
        if (nG <= T && t >= nG - 1e-6) { const g = ghosts[nG]; g.position.x = X0 + K * x; g.visible = true; lastGap = nG ? x - ghosts[nG - 1].mx : 0; g.mx = x; nG++; } }
      hist.push([t, v]); }
    a = acc(P, Math.min(t, T)); car.position.set(X0 + K * x, 0, 0); vA.set(car.position.x - 1.2, 3, Math.max(.01, v * .13), 1); aA.set(car.position.x - 1.2, 2.2, Math.abs(a) * .45, a < 0 ? -1 : 1);
    P.v = v; P.a2 = a; P.t = t; P.gap = lastGap; P.x = x; P.done = t >= T;
  },
  graph: () => ({ pts: hist, xmax: T, ymax: Math.max(4, Math.ceil(prof.vmax / 4) * 4), xl: 'time t (s)', yl: 'velocity v (m/s)', color: '#facc15', fill: 1 }),
  ro: { 'Velocity v': P => P.v.toFixed(1) + ' m/s', 'Acceleration a': P => P.a2.toFixed(1) + ' m/s²', 'Time t': P => P.t.toFixed(1) + ' s', 'Gap in last 1 s': P => P.gap.toFixed(1) + ' m' },
  status: P => P.done ? ['Finished', false, 'warn'] : P.v === 0 && P.t > 0 ? ['Stopped', false, 'warn'] : ['Running', true],
  note: P => [`<b>Constant speed</b>: equal gaps in equal times, <b>a = 0</b>. The v–t graph is flat.`, `<b>Uniform acceleration</b>: the gaps grow by the same amount each second. v rises by ${P.a} m/s every second.`, `<b>Uniform retardation</b>: the gaps shrink by the same amount each second until the car stops.`, `<b>Non-uniform acceleration</b>: the acceleration keeps changing, so the gaps and the v–t graph are uneven.`][P.ty - 1] + `<br>a = (v − u) ÷ t. Yellow arrow = velocity, red arrow = acceleration.`,
  try: ['Choose <b>Speeding up</b> and read the gap in the Monitor each second. Does it grow by the same amount?', 'Choose <b>Slowing down</b> with a large a. When does the car stop?', 'Compare <b>Speeding up</b> with <b>Uneven</b>. Which v–t graph is a straight line?'],
  key: ['<b>Acceleration</b> = change in velocity ÷ time taken. Unit: m/s².', 'Uniform acceleration: equal changes of velocity in equal times. Non-uniform: unequal changes.', 'Negative acceleration (slowing down) is called <b>retardation</b> or deceleration.', 'Uniform motion has zero acceleration: equal distances in equal times.'],
  quiz: [{ q: 'A car goes from 10 m/s to 30 m/s in 5 s. Its acceleration is…', o: ['4 m/s²', '6 m/s²', '20 m/s²'], a: 0, why: 'a = (v − u) ÷ t = (30 − 10) ÷ 5 = 4 m/s².' }, { q: 'The snapshots get closer and closer together. The car is…', o: ['speeding up', 'slowing down', 'at constant speed'], a: 1, why: 'Shorter gaps in the same time mean a lower speed.' }, { q: 'Uniform acceleration means…', o: ['the velocity is constant', 'equal change of velocity in equal time', 'the car stops'], a: 1, why: 'That is the definition. The v–t graph is a straight sloping line.' }]
};
