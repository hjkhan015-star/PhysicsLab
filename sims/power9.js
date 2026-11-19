// Class 9 · Ch 11 Work and Energy — POWER: P = W ÷ t. Two motors lift the same load 5 m; the stronger one does the same work in less time.
import { V, box, floor, label, beam } from '../scene.js';
const TABS = [['work9', 'Work'], ['forms9', 'PE & KE'], ['energy9', 'Conserve'], ['power9', 'Power'], ['transform9', 'Transform']];
const G = 9.8, H = 5, K = 1.2, PV = 0xa78bfa, XS = [-4.5, 4.5], PRICE = 6;
let ld = [], rp = [], tl = [], t = 0, key = '';
export default {
  title: 'Power — P = W ÷ t', tabs: TABS, cam: { d: 13, e: .12, a: 0, t: V(0, 4.6, 0), ref: 1.3 }, head: 'Work done',
  sliders: [{ k: 'm', l: 'Load m', min: 10, max: 50, step: 10, v: 20, u: 'kg' }, { k: 'pa', l: 'Motor A power', min: 100, max: 500, step: 100, v: 100, u: 'W' }, { k: 'pb', l: 'Motor B power', min: 100, max: 500, step: 100, v: 200, u: 'W' }],
  setup() {
    floor(24, 10);
    XS.forEach((x, i) => { const p = box(.2, 7.6, .2, 0x64748b); p.position.set(x, 3.8, 0); const mo = box(2.2, 1, 1.4, PV); mo.position.set(x, 8.1, 0); const l = box(1.5, 1.2, 1.2, i ? 0x38bdf8 : 0xf59e0b); ld.push(l); rp.push(beam(0xcbd5e1, .05));
      label(i ? 'Motor B' : 'Motor A', '#c4b5fd', 1).position.set(x, 9.6, 0); const t0 = label('', '#fde047', 1.1); t0.position.set(x + (i ? -2.6 : 2.6), 4, 0); tl.push(t0); });
    label('5 m', '#cbd5e1', .9).position.set(0, 6.4, 0);
  },
  reset() { key = ''; },
  step(dt, P) {
    const k = [P.m, P.pa, P.pb].join(); if (k !== key) { key = k; t = 0; } t += dt;
    P.W = P.m * G * H; P.ta = P.W / P.pa; P.tb = P.W / P.pb; const tt = [P.ta, P.tb];
    XS.forEach((x, i) => { const f = Math.min(1, t / tt[i]), y = .7 + f * H * K; ld[i].position.set(x, y, 0); rp[i].set(V(x, 7.6, 0), V(x, y + .6, 0)); tl[i].set(Math.min(t, tt[i]).toFixed(1) + ' s', f >= 1 ? '#86efac' : '#fde047'); });
    P.fin = t >= Math.max(P.ta, P.tb);
  },
  ro: { 'Work done (each)': P => P.W.toFixed(0) + ' J', 'Time, motor A': P => P.ta.toFixed(1) + ' s', 'Time, motor B': P => P.tb.toFixed(1) + ' s', 'Power A · B': P => P.pa + ' W · ' + P.pb + ' W', 'B on 10 h': P => (P.pb * 10 / 1000).toFixed(1) + ' kWh ≈ ₹' + (P.pb * 10 / 1000 * PRICE).toFixed(0) },
  status: P => P.fin ? ['Both done · press ↻ to replay', false, 'warn'] : ['Lifting', true],
  note: P => `Both motors do the <b>same work</b>, W = mgh = ${P.m} × 9.8 × 5 = <b>${P.W.toFixed(0)} J</b>. <b>P = W ÷ t</b>: A = ${P.W.toFixed(0)} ÷ ${P.ta.toFixed(1)} = ${P.pa} W, B = ${P.W.toFixed(0)} ÷ ${P.tb.toFixed(1)} = ${P.pb} W. ${P.pa === P.pb ? 'Same power, same time.' : (P.pb > P.pa ? 'B' : 'A') + ' has more power, so it finishes first.'}`,
  try: ['Make both motors 200 W. Do they finish together?', 'Double motor B\'s power. What happens to its time?', 'Double the load with the same motors. What happens to the work and the time?'],
  key: ['<b>Power</b> = work done ÷ time taken: <b>P = W ÷ t</b>. Unit: watt (W). 1 W = 1 J/s. 1 kW = 1000 W.', 'More power means the same work in less time (or more work in the same time).', 'Commercial unit of energy: <b>1 kWh</b> = 1 kW for 1 hour = 3.6 × 10⁶ J, one &ldquo;unit&rdquo; on the electricity bill.', 'Energy used (kWh) = power (kW) × time (h).'],
  quiz: [{ q: 'A motor does 600 J of work in 10 s. Its power is…', o: ['60 W', '6000 W', '10 W'], a: 0, why: 'P = W ÷ t = 600 ÷ 10 = 60 W.' }, { q: 'A 100 W bulb burns for 10 hours. Energy used is…', o: ['1 kWh', '10 kWh', '100 kWh'], a: 0, why: '0.1 kW × 10 h = 1 kWh = 1 unit.' }, { q: '1 watt is…', o: ['1 J × 1 s', '1 J per second', '1 N per metre'], a: 1, why: 'Power is the rate of doing work: 1 W = 1 J/s.' }]
};
