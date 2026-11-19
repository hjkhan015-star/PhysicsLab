// Class 9 · Ch 8 Motion — GRAPHS of motion: distance–time, velocity–time and acceleration–time drawn live while the ball moves.
import { S, V, THREE, mat, sph, floor, label, trail } from '../scene.js';
const TABS = [['dist9', 'Distance'], ['speed9', 'Speed'], ['accel9', 'Accel.'], ['graphs9', 'Graphs'], ['motion9', 'Equations'], ['circular9', 'Circular']];
const T = 10, K = .24, X0 = -12, GN = ['Distance–time', 'Velocity–time', 'Acceleration–time'], COL = ['#38bdf8', '#facc15', '#f87171'];
const F = [t => [20, 0, 0], t => [8 * t, 8, 0], t => [.75 * t * t, 1.5 * t, 1.5], t => [8 * t + 4 / .81 * (1 - Math.cos(.9 * t)), 8 + 4 / .9 * Math.sin(.9 * t), 4 * Math.cos(.9 * t)]];   // [s, v, a] for: rest · uniform · uniform acceleration · non-uniform
let ball, tr, t, hist, key = '', lab = [];
function begin(P) { t = 0; hist = [[0, F[P.mo - 1](0)[P.g - 1]]]; key = P.mo + '/' + P.g; tr.clear(); }
export default {
  title: 'Graphs of Motion', tabs: TABS, cam: { d: 19, e: .3, a: .1, t: V(0, 1.2, 0) }, head: 'Time t',
  sliders: [{ k: 'mo', l: '🎯 Motion', min: 1, max: 4, step: 1, v: 3, names: ['At rest', 'Steady', 'Faster', 'Uneven'] }, { k: 'g', l: '📈 Graph', min: 1, max: 3, step: 1, v: 2, names: ['s – t', 'v – t', 'a – t'] }],
  setup() {
    floor(40, 10); ball = sph(.7, 0xf97316); ball.position.y = .7; tr = trail(0xf97316, 80, .22, true);
    for (let i = 0; i <= 5; i++) { const l = label(i * 20 + ' m', '#cbd5e1', .8); l.position.set(X0 + i * 20 * K, .2, 2.6); }
  },
  reset(P) { begin(P); },
  step(dt, P) {
    if (P.mo + '/' + P.g !== key) begin(P);
    if (t < T) { t = Math.min(T, t + dt); hist.push([t, F[P.mo - 1](t)[P.g - 1]]); }
    const [s, v, a] = F[P.mo - 1](t); ball.position.x = X0 + K * s; if (t < T) tr.put(ball.position.x, .7, 0); P.t = t; P.s = s; P.v = v; P.a = a; P.done = t >= T;
  },
  graph: P => ({ pts: hist, xmax: T, ymin: P.g === 3 ? -4 : 0, ymax: P.g === 1 ? 100 : P.g === 2 ? 16 : 4, xl: 'time t (s)', yl: ['distance s (m)', 'velocity v (m/s)', 'acceleration a (m/s²)'][P.g - 1], color: COL[P.g - 1], fill: P.g === 2 }),
  ro: { 'Time t': P => P.t.toFixed(1) + ' s', 'Distance s': P => P.s.toFixed(0) + ' m', 'Velocity v': P => P.v.toFixed(1) + ' m/s', 'Acceleration a': P => P.a.toFixed(1) + ' m/s²' },
  status: P => P.done ? ['Finished · press ↻ to replay', false, 'warn'] : ['Running', true],
  note: P => [['<b>At rest</b>: the s–t graph is a flat line, the ball stays at 20 m.', '<b>At rest</b>: v = 0, so the v–t graph lies on the time axis.', '<b>At rest</b>: a = 0.'], ['<b>Uniform speed</b>: s–t is a straight sloping line. The <b>slope = speed</b> (8 m/s).', '<b>Uniform speed</b>: v–t is a flat line. The <b>shaded area = distance</b> (8 × t).', '<b>Uniform speed</b>: a = 0 all the time.'], ['<b>Uniform acceleration</b>: s–t is a curve that gets steeper. The slope (speed) keeps growing.', '<b>Uniform acceleration</b>: v–t is a straight line sloping up. <b>Slope = a</b> = 1.5 m/s². Shaded area = distance.', '<b>Uniform acceleration</b>: a–t is a flat line at 1.5 m/s².'], ['<b>Non-uniform motion</b>: the s–t curve changes steepness unevenly.', '<b>Non-uniform</b>: v–t is a wavy curve, not a straight line.', '<b>Non-uniform acceleration</b>: a keeps changing, so a–t is not flat.']][P.mo - 1][P.g - 1],
  try: ['Choose <b>Uniform speed</b> and <b>Distance–time</b>. Is the graph a straight line? What is its slope?', 'Choose <b>Speeding up</b> and <b>Velocity–time</b>. The shaded area is the distance. Does it match the Monitor?', 'Compare <b>Speeding up</b> on the three graphs. Which one is flat?'],
  key: ['<b>Distance–time graph</b>: slope = speed. Straight line = uniform speed. Curve = non-uniform speed. Flat line = at rest.', '<b>Velocity–time graph</b>: slope = acceleration. <b>Area under it = distance</b>.', 'A flat v–t line means constant velocity (a = 0). A sloping straight v–t line means uniform acceleration.', 'On an acceleration–time graph, a flat line means uniform acceleration.'],
  quiz: [{ q: 'A straight sloping line on a distance–time graph means…', o: ['uniform speed', 'uniform acceleration', 'at rest'], a: 0, why: 'Equal distance in equal time gives a constant slope, which is the speed.' }, { q: 'The area under a velocity–time graph gives…', o: ['acceleration', 'distance', 'time'], a: 1, why: 'Area = v × t = distance (for constant v; the same idea works for any shape).' }, { q: 'A horizontal line on a velocity–time graph shows…', o: ['at rest', 'uniform velocity', 'uniform acceleration'], a: 1, why: 'The velocity does not change, so a = 0.' }]
};
