// Class 9 · Ch 11 Work and Energy — ENERGY TRANSFORMATIONS: energy is never lost, it changes form. Follow it step by step.
import { S, V, THREE, box, sph, arrowTo, label } from '../scene.js';
const TABS = [['work9', 'Work'], ['forms9', 'PE & KE'], ['energy9', 'Conserve'], ['power9', 'Power'], ['transform9', 'Transform']];
const AM = 0xf59e0b, CY = 0x22d3ee, YE = 0xfacc15, OR = 0xf97316, RD = 0xef4444, GR = 0x22c55e;
const CH = [
  [['Water in the dam', 'Potential energy', AM, 'Water held high up has stored energy.'], ['Water falls', 'Kinetic energy', CY, 'Falling water speeds up: PE becomes KE.'], ['Turbine spins', 'Kinetic energy', CY, 'The moving water turns the turbine.'], ['Generator', 'Electrical energy', YE, 'The generator changes motion into electricity.'], ['Bulb glows', 'Light and heat', OR, 'The bulb changes electricity into light and heat.']],
  [['Bob held up', 'Potential energy', AM, 'At the top the bob has the most PE.'], ['Swinging down', 'Kinetic energy', CY, 'PE changes into KE as it falls.'], ['Lowest point', 'Kinetic energy (most)', CY, 'At the bottom all the PE has become KE.'], ['Swinging up', 'Potential energy', AM, 'KE changes back into PE.'], ['Slowly stops', 'Heat and sound', RD, 'Air and the string take a little each swing as heat.']],
  [['Food you eat', 'Chemical energy', GR, 'Food stores energy in chemical form.'], ['Muscles work', 'Kinetic energy', CY, 'Your muscles turn it into motion (and heat).'], ['Bicycle moves', 'Kinetic energy', CY, 'The cycle and rider have KE.'], ['Brakes pressed', 'Heat', RD, 'Friction changes KE into heat.'], ['Cycle stops', 'Heat and sound', RD, 'All the KE has spread out as heat and sound.']],
  [['Sunlight', 'Light energy', YE, 'The Sun sends energy as light.'], ['Solar panel', 'Electrical energy', YE, 'The panel changes light into electricity.'], ['Battery', 'Chemical energy', GR, 'The battery stores it as chemical energy.'], ['Fan runs', 'Kinetic energy', CY, 'The motor turns electricity into motion.'], ['Room air warms', 'Heat', RD, 'In the end it spreads out as heat.']]];
const Y = i => 5 - i * 2.5;
let G = [], pulse, bx = [], st = 0, tm = 0, cc = -1, py = 5;
function load(c) { cc = c; st = 0; tm = 0; G.forEach((g, i) => g.forEach(o => o.visible = i === c)); }
export default {
  title: 'Energy Transformations', tabs: TABS, cam: { d: 17, e: 0, a: 0, t: V(-.5, 0, 0), ref: 1.3 }, head: 'Energy now',
  sliders: [{ k: 'c', l: '🔗 Example', min: 0, max: 3, step: 1, v: 0, names: ['Dam', 'Swing', 'Cycle', 'Solar'] }],
  toggles: [{ k: 'auto', l: 'Auto-play', v: true }],
  buttons: [{ l: 'Next step ▶', fn: () => { st = (st + 1) % 5; tm = 0; } }],
  setup() {
    CH.forEach((ch, c) => { const g = []; bx.push([]); ch.forEach((s, i) => { const b = box(2.4, 1.6, .6, s[2]); b.position.set(-5.5, Y(i), 0); bx[c].push(b); g.push(b);
      const a = label(s[0], '#f1f5f9', .95), f = label(s[1], '#' + s[2].toString(16).padStart(6, '0'), .8); a.position.set(1.8, Y(i) + .45, 0); f.position.set(1.8, Y(i) - .5, 0); g.push(a, f);
      if (i < 4) { const ar = arrowTo(0xcbd5e1, .06); ar.to(-5.5, Y(i) - .9, -5.5, Y(i + 1) + .9, 0); g.push(ar); } }); G.push(g); });
    pulse = sph(.45, 0xffffff); pulse.position.set(-5.5, 5, .5);
  },
  reset() { cc = -1; },
  step(dt, P) {
    if (P.c !== cc) load(P.c); if (P.auto) { tm += dt; if (tm > 2.4) { tm = 0; st = (st + 1) % 5; } }
    bx[cc].forEach((b, i) => b.scale.setScalar(i === st ? 1.2 : .85)); py += (Y(st) - py) * Math.min(1, dt * 5); pulse.position.y = py; P.st = st; P.ch = cc;
  },
  ro: { 'Energy now': P => CH[P.ch][P.st][1], Step: P => (P.st + 1) + ' of 5', 'Next form': P => P.st < 4 ? CH[P.ch][P.st + 1][1] : 'Spread out as heat' },
  status: () => ['Energy changes form, never lost', true],
  note: P => `<b>${CH[P.ch][P.st][0]}</b>: ${CH[P.ch][P.st][3]}<br>Total energy stays the same: it only changes from one form to another.`,
  try: ['Press <b>Next step</b> through the Dam. Name the form of energy at each step.', 'In the Pendulum, where is the KE greatest? Where is the PE greatest?', 'At the end, where did the energy go? Is it destroyed?'],
  key: ['<b>Law of conservation of energy</b>: energy can neither be created nor destroyed; it only changes from one form to another.', 'The total energy before and after is the same.', 'Useful energy often ends up as <b>heat</b> that spreads into the surroundings, so it cannot be used again easily.', 'Examples: dam → electricity → light; food → motion; Sun → electricity.'],
  quiz: [{ q: 'In a hydroelectric plant, falling water first has…', o: ['kinetic energy changing to electrical', 'light energy', 'chemical energy only'], a: 0, why: 'PE of the dam water → KE → turbine → electricity.' }, { q: 'A swinging pendulum slowly stops. The energy is…', o: ['destroyed', 'changed into heat and sound', 'created'], a: 1, why: 'Energy is conserved; it spreads out as heat.' }, { q: 'A solar panel changes…', o: ['heat to light', 'light to electricity', 'sound to motion'], a: 1, why: 'It converts light energy into electrical energy.' }]
};
