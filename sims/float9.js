// Class 9 · Ch 10 Gravitation — thrust, Archimedes' principle and floatation.  Loss of weight = weight of liquid displaced.
import { S, V, box, mat, beam, label } from '../scene.js';
const OB = ['Cork', 'Wood', 'Ice', 'Aluminium', 'Iron'], RO = [.24, .6, .92, 2.7, 7.9], OC = [0xd6a76a, 0xa16207, 0xbae6fd, 0xcbd5e1, 0x64748b];
const LQ = ['Water', 'Salt water', 'Oil'], RL = [1, 1.03, .8], LC = [0x38bdf8, 0x67e8f9, 0xfacc15], VOL = 1e-4, G = 9.8, SURF = 4, H = 1.8, TOP = 12;       // object volume 100 cm³
let tank, liq, ob, sp, str, cup, cupL, lr, lw, ll;
export default {
  title: "Archimedes' Principle — Float or Sink", cam: { d: 19, e: .08, a: 0, t: V(2, 5.2, 0), ref: 1.4 },
  head: 'Weight in liquid',
  sliders: [{ k: 'o', l: 'Object', min: 1, max: 5, step: 1, v: 5, names: OB, axis: true }, { k: 'q', l: 'Liquid', min: 1, max: 3, step: 1, v: 1, names: LQ },
    { k: 's', l: 'Lower the object', min: 0, max: 100, step: 5, v: 0, u: '%' }],
  setup() {
    tank = box(5, 5, 3, 0xbfdbfe); tank.material = mat(0xbfdbfe, { transparent: true, opacity: .15 }); tank.position.set(0, 2, 0);
    liq = box(4.8, SURF, 2.8, 0x38bdf8); liq.material = mat(0x38bdf8, { transparent: true, opacity: .55 }); liq.position.y = SURF / 2 - .5;
    ob = box(1.6, H, 1.6, 0x64748b); sp = box(.9, 1, .6, 0xf59e0b); str = beam(0xe2e8f0, .04);
    box(1.4, .15, 1.4, 0x1e293b).position.set(0, TOP + .6, 0);
    cup = box(2.4, 2.4, 2.2, 0xbfdbfe); cup.material = mat(0xbfdbfe, { transparent: true, opacity: .15 }); cup.position.set(5.4, .5, 0);
    cupL = box(2.2, 1, 2, 0x38bdf8); cupL.material = mat(0x38bdf8, { transparent: true, opacity: .7 });
    lr = label('', '#fde047', 1.1); lr.position.set(0, TOP + 1.8, 0); lw = label('Displaced liquid', '#7dd3fc', .9); lw.position.set(5.4, 2.4, 0); ll = label('', '#e2e8f0', .9); ll.position.set(0, -1.6, 0);
  },
  reset() {},
  step(dt, P) {
    const rho = RO[P.o - 1], rl = RL[P.q - 1], W = rho * 1000 * VOL * G, up = rho < rl, ff = up ? rho / rl : 1, f = Math.min(P.s / 100, ff), B = rl * 1000 * VOL * G * f;
    const R = up && P.s / 100 >= ff ? 0 : Math.max(0, W - B); P.W = W; P.B = B; P.R = R; P.up = up; P.f = f; P.float = up && P.s / 100 >= ff;
    liq.material.color.set(LC[P.q - 1]); ob.material.color.set(OC[P.o - 1]); cupL.material.color.set(LC[P.q - 1]);
    ob.position.set(0, SURF - .5 + H / 2 - f * H + (P.s / 100 - f) * 0, 0);                                                              // sinks into the liquid as f grows
    const stretch = 1 + R * .3; sp.scale.y = stretch; sp.position.set(0, TOP - stretch / 2, 0); str.set(V(0, TOP - stretch, 0), V(0, ob.position.y + H / 2, 0));
    cupL.scale.y = Math.max(.01, f * 1.8); cupL.position.set(5.4, -.7 + f * .9, 0); lr.set(`Reading ${R.toFixed(2)} N`); ll.set(LQ[P.q - 1]);
  },
  ro: { 'Weight in liquid': P => P.R.toFixed(2) + ' N', 'Weight in air': P => P.W.toFixed(2) + ' N', 'Loss of weight': P => (P.W - P.R).toFixed(2) + ' N', 'Weight of liquid displaced': P => P.B.toFixed(2) + ' N' },
  status: P => P.up ? ['Floats', true] : ['Sinks', false, 'warn'],
  note: P => `<b>Loss of weight = weight of liquid displaced</b>: ${P.W.toFixed(2)} − ${P.R.toFixed(2)} = ${P.B.toFixed(2)} N. ` + (P.up ? 'It is less dense than the liquid, so it floats.' : 'It is denser than the liquid, so it sinks.'),
  try: ['Choose Iron and lower it slowly. How does the reading change?', 'Choose Cork. Why does the reading become zero?', 'Lower Iron in Water, then in Oil. Where is the loss of weight bigger?'],
  key: ['Thrust is force on a surface; pressure = thrust ÷ area.', 'Archimedes principle: loss of weight = weight of liquid displaced.', 'Buoyant force pushes an object up in a liquid.', 'An object floats if its density is less than the liquid\'s.', '<b>Relative density</b> = density of the substance ÷ density of water (no unit).'],
  quiz: [{ q: 'An iron nail sinks in water because…', o: ['its density is more than water', 'it is hot', 'water is dry'], a: 0, why: 'Denser objects sink.' }, { q: 'An object weighs 5 N in air and 3 N in water. The liquid displaced weighs…', o: ['2 N', '3 N', '8 N'], a: 0, why: '5 − 3 = 2 N.' }, { q: 'Which object floats in water?', o: ['Iron', 'Cork', 'Aluminium'], a: 1, why: 'Cork is less dense than water.' }]
};
