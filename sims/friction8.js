// Class 8 · Ch 12 Friction — easy words, no formulas. Pick a surface, push the block.
import { V, box, floor, arrow, label } from '../scene.js';
const NAME = ['Ice', 'Smooth floor', 'Wooden floor', 'Rough carpet'], MU = [.05, .2, .4, .7], COL = [0x9bd5f0, 0x4a5a7d, 0x8a5a2b, 0x8e3b46];
let b, fl, aF, aR, lF, lR, lS, x, v;
export default {
  title: 'Friction — Rough or Smooth?', cam: { d: 17, e: .3, a: .2, t: V(1, 1, 0) },
  sliders: [{ k: 'F', l: '💪 Your push', min: 0, max: 40, step: 2, v: 10, u: 'N' }, { k: 's', l: '🧱 Surface', min: 1, max: 4, step: 1, v: 3, names: NAME }],
  setup() { fl = floor(30, 10); b = box(2, 1.2, 2, 0xf59e0b); b.position.y = .6;
    aF = arrow(0x22c55e, .13); aR = arrow(0xef4444, .13); lF = label('', '#4ade80'); lR = label('', '#f87171'); lS = label('', '#e2e8f0', 1.1); },
  reset() { x = -10; v = 0; },
  step(dt, P) {
    const fmax = MU[P.s - 1] * 4 * 10;                     // block = 4 kg, g = 10
    fl.material.color.set(COL[P.s - 1]);
    P.go = P.F > fmax;
    if (P.go) v += (P.F - fmax) / 4 * dt; else v = Math.max(0, v - fmax / 4 * dt);
    x += v * dt; if (x > 12) { x = -10; v = 0; } b.position.x = x;
    P.v = v; P.fmax = fmax; P.fr = (P.go || v > .05) ? fmax : Math.min(P.F, fmax);
    const lp = P.F / 6, lf = P.fr / 6;
    aF.set(x - 1 - lp, 1.8, lp, 1); lF.position.set(x - 1 - lp / 2, 3, 0); lF.set(`Push ${P.F} N`);
    aR.set(x + 1, .4, lf, -1, 1.7); lR.position.set(x + 1 - lf / 2, 1.3, 1.7); lR.set(`Friction ${P.fr.toFixed(0)} N`);
    lS.position.set(1, 5.2, 0); lS.set(`${NAME[P.s - 1]} — grips up to ${fmax.toFixed(0)} N`);
  },
  head: 'Friction',
  ro: { Friction: P => P.fr.toFixed(0) + ' N', 'Your push': P => P.F + ' N' },
  status: P => P.go ? ['Moving', true] : P.v > .05 ? ['Slowing', false, 'warn'] : ['Stuck', false, 'warn'],
  note: P => P.go
    ? '<b>It moves!</b> Your push is bigger than the friction.'
    : `<b>Not moving.</b> Friction holds the block until your push passes ${P.fmax.toFixed(0)} N.`,
  try: [{ t: 'Put the surface on <b>Ice</b> and push with 4 N or more. What happens?', check: P => P.s === 1 && P.F >= 4 && P.go, yes: 'Yes! Ice has very little grip.' },
    { t: 'Switch to <b>Rough carpet</b>. Is the same push enough now?', check: P => P.s === 4 && P.F >= 4 && !P.go, yes: 'Yes! Rough carpet grips hard.' },
    { t: 'Find the smallest push that moves the block on <b>Wooden floor</b>.', check: P => P.s === 3 && P.go && P.F - P.fmax <= 2, yes: 'Yes! Just above 16 N is enough.' }],
  key: ['Friction is a force that slows things sliding on each other.', 'Rough surfaces give <b>more</b> friction. Smooth ones give <b>less</b>.', 'Friction is a <b>necessary evil</b>. We need it to walk, but it wears machines.', 'Oil, grease, wheels and ball bearings reduce friction.'],
  quiz: [{ q: 'Which surface gives the MOST friction?', o: ['Ice', 'Wooden floor', 'Rough carpet'], a: 2, why: 'Rougher surfaces grip more.' }, { q: 'Why do we oil the parts of a machine?', o: ['To make them heavier', 'To reduce friction', 'To increase friction'], a: 1, why: 'Oil makes surfaces slippery. That means less friction and less wear.' }]
};
