// Class 10 · Ch 13 Magnetic Effects of Electric Current — domestic electric circuit: live, neutral and earth wires, fuse, overloading, short circuit.
import { V, box, sph, wire, arrow, label, mat } from '../scene.js';
const AP = [['Bulb', 100], ['Fan', 75], ['TV', 150], ['Iron', 1000], ['Geyser', 2000]], X = [-5, -1.5, 2, 5.5, 9], RATE = [5, 10, 15], YL = 4, YN = -1.2, YE = -3.4, VOLT = 230;
let app = [], fuseW, fuseB, tmr, blown, arr, lf, st, iron;
export default {
  title: 'Domestic Electric Circuit', cam: { d: 19, e: .02, a: 0, t: V(-.5, 1.6, 0), ref: 1.9 },
  head: 'Total current',
  sliders: [{ k: 'n', l: 'Appliances on', min: 1, max: 5, step: 1, v: 3 }, { k: 'fu', l: 'Fuse rating', min: 1, max: 3, step: 1, v: 2, names: ['5 A', '10 A', '15 A'], axis: true }, { k: 'fl', l: 'Fault', min: 1, max: 3, step: 1, v: 1, names: ['None', 'Short circuit', 'Iron live'], axis: true }],
  toggles: [{ k: 'ea', l: 'Earth wire', v: true }],
  buttons: [{ l: '🔧 Replace fuse', fn: () => { blown = false; tmr = 0; } }],
  setup() {
    box(2.8, 3.4, 1.4, 0x475569).position.set(-12.5, 1.4, 0); label('Mains 230 V', '#e2e8f0', 1.1).position.set(-11.5, 7.6, 0);
    wire([[-12.5, YL], [-9.6, YL]], 0xef4444, .12); wire([[-8.4, YL], [10.5, YL]], 0xef4444, .12); wire([[-12.5, YN], [10.5, YN]], 0x64748b, .12); wire([[-12.5, YE], [10.5, YE]], 0x22c55e, .1, -.7);
    lf = label('Fuse', '#fca5a5', 1.1); lf.position.set(-9, YL + 1.5, 0); label('Live (red)', '#fca5a5', 1).position.set(3, YL + 1.3, 0); label('Neutral (black)', '#cbd5e1', 1).position.set(-5, YN - .9, 0); label('Earth (green)', '#86efac', 1).position.set(-5, YE - .9, 0);
    fuseB = box(1.4, .8, .7, 0xe2e8f0); fuseB.material = mat(0xe2e8f0, { transparent: true, opacity: .45 }); fuseB.position.set(-9, YL, 0); fuseW = box(1.2, .1, .1, 0xfbbf24); fuseW.position.set(-9, YL, 0);
    X.forEach((x, i) => { const b = box(2.4, 2.4, 1.2, [0xfde047, 0x38bdf8, 0x64748b, 0xf97316, 0xe2e8f0][i]); b.position.set(x, 1.4, 0); app.push(b);
      wire([[x, YL], [x, 2.6]], 0xef4444, .08); wire([[x, .2], [x, YN]], 0x64748b, .08); wire([[x, .2], [x, YE]], 0x22c55e, .06, -.7);
      label(AP[i][0], '#e2e8f0', .85).position.set(x, 3.1, 0); });
    arr = arrow(0xfacc15, .1); st = label('', '#fff', 1.2); st.position.set(-0.5, 7.3, 0);
  },
  reset(P) { blown = false; tmr = 0; },
  step(dt, P) {
    const sh = P.fl === 2, ft = P.fl === 3, w = AP.slice(0, P.n).reduce((s, a) => s + a[1], 0); let I = w / VOLT, kind = '';
    if (sh) { I = 120; kind = 'short'; } else if (ft && P.ea) { I = 60; kind = 'earth'; } else if (ft) kind = 'shock';
    const rate = RATE[P.fu - 1];
    if (!blown) { if (I > rate) { tmr += dt * (I / rate - .8) * 1.6; if (tmr >= 1) blown = true; } else tmr = Math.max(0, tmr - dt * .6); }
    const on = !blown; P.I = on ? I : 0; P.kind = kind; P.rate = rate; P.blown = blown; P.hot = tmr;
    app.forEach((b, i) => { const lit = on && i < P.n && !sh; b.material.color.setHex([0xfde047, 0x38bdf8, 0x64748b, 0xf97316, 0xe2e8f0][i]); if (!lit) b.material.color.multiplyScalar(.35); });
    if (ft && !P.ea && on) app[3].material.color.setHex(0xef4444);                       // body of the iron is live
    fuseW.visible = !blown; fuseW.material.color.setRGB(1, 1 - Math.min(1, tmr) * .7, .15 * (1 - tmr)); fuseW.scale.y = 1 + tmr * 1.5;
    arr.set(-12, YL + .6, Math.min(5, .5 + P.I / 5), 1, 0); arr.visible = on;
    st.set(blown ? 'Fuse blown: the circuit is off' : kind === 'shock' ? 'DANGER: the iron body is live!' : '', blown ? '#fca5a5' : '#ef4444');
  },
  ro: { 'Total current': P => P.I.toFixed(1) + ' A', 'Fuse rating': P => P.rate + ' A', 'Power drawn': P => Math.round(P.I * VOLT / 100) / 10 + ' kW' },
  status: P => P.blown ? ['Fuse blown', false, 'warn'] : P.kind === 'shock' ? ['DANGER: live body, no earth', false, 'crit'] : P.I > P.rate ? ['Overloaded: fuse heating', false, 'warn'] : ['Safe', true],
  note: P => P.blown ? (P.kind === 'short' ? 'Short circuit: live and neutral touch, the current is huge, and the fuse wire melts at once.' : P.kind === 'earth' ? 'The fault current flows safely down the <b>earth wire</b>. The big current melts the fuse and the iron is cut off: you are safe.' : 'Too many appliances on one circuit means <b>overloading</b>. The current passes the fuse rating, the thin wire melts and the circuit breaks. Press <b>Replace fuse</b> after switching some appliances off.') : P.kind === 'shock' ? 'With no earth wire the metal body of the iron stays at 230 V. A person touching it gets a <b>severe shock</b>. Connect the earth wire!' : `Appliances are in <b>parallel</b>, so each gets 230 V. Total current I = P ÷ V = ${Math.round(AP.slice(0, P.n).reduce((s, a) => s + a[1], 0))} ÷ 230 = <b>${(AP.slice(0, P.n).reduce((s, a) => s + a[1], 0) / VOLT).toFixed(1)} A</b>. The fuse is rated ${P.rate} A.`,
  try: ['Switch on all 5 appliances with a 10 A fuse. What happens? (overloading)', 'Press Replace fuse, then set Fault to Short circuit. How fast does the fuse blow?', 'Set Fault to Iron live with the Earth wire on, then off. What is the difference for a person touching the iron?'],
  key: ['<b>Live wire</b> (red) brings current at 230 V; <b>neutral wire</b> (black) completes the circuit at 0 V; <b>earth wire</b> (green) joins metal bodies to the ground.', 'Appliances are connected in <b>parallel</b>, so each works on 230 V and can be switched on or off alone. (Bulb 100 W, Fan 75 W, TV 150 W, Iron 1000 W, Geyser 2000 W.)', '<b>Short circuit</b>: live and neutral touch directly, resistance is very low, current is huge. <b>Overloading</b>: too many appliances draw more than the rated current.', 'The <b>fuse</b> (on the live wire) melts and breaks the circuit. The <b>earth wire</b> sends leaking current to the ground, so the body of an appliance never stays live.'],
  quiz: [{ q: 'In a house wiring the fuse is placed in the…', o: ['live wire', 'neutral wire', 'earth wire'], a: 0, why: 'The live wire carries the current, so the fuse must cut it.' }, { q: 'The earth wire is connected to the…', o: ['metal body of the appliance', 'bulb filament', 'switch only'], a: 0, why: 'It stops the body from becoming live.' }, { q: 'Too many appliances on one socket cause…', o: ['overloading', 'a short circuit only', 'less current'], a: 0, why: 'The total current goes above the safe value.' }]
};
