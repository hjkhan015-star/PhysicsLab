// Class 10 · Ch 14 Sources of Energy — from source to bulb: conventional and renewable sources, with one advantage and one problem each.
import { S, V, box, sph, mat, arrow, THREE, label } from '../scene.js';
const SRC = ['Coal', 'Solar', 'Wind', 'Water (hydro)', 'Nuclear', 'Biogas', 'Geothermal', 'Tidal / wave', 'Ocean heat'], LV = ['Very low', 'Low', 'Medium', 'High', 'Very high'], REN = [0, 1, 1, 1, 0, 1, 1, 1, 1];
const CONV = ['Boiler + turbine', 'Solar panel', 'Wind turbine', 'Water turbine', 'Reactor + turbine', 'Gas burner + turbine', 'Hot-rock steam + turbine', 'Sea turbine', 'Warm/cold sea + turbine'], SC = [0x1f2937, 0xfacc15, 0xbae6fd, 0x38bdf8, 0x22c55e, 0xa16207, 0xb45309, 0x0ea5e9, 0x0369a1], CC = [0x94a3b8, 0x1d4ed8, 0xe2e8f0, 0x64748b, 0x94a3b8, 0x94a3b8, 0x94a3b8, 0x64748b, 0x94a3b8];
const NOTE = ['Coal gives steady power, but burning it makes smoke and carbon dioxide.', 'Sunlight is free and clean, but it works only when the Sun shines.', 'Wind is free and clean, but it needs steady, strong wind.', 'Falling water gives clean power, but dams flood land and move people.', 'A little nuclear fuel gives huge power, but the waste is dangerous.', 'Biogas turns dung and plant waste into fuel and manure, but needs regular feeding.', 'Hot rocks deep underground make steam that turns a turbine. It is clean, but only a few places have such hot spots.', 'Tides and waves push a turbine. It is clean, but it needs a coast with a big tide and the machines are costly.', 'Warm surface water and cold deep water of the tropical sea can run a turbine (OTEC). It is clean, but needs a big temperature difference.'];
let src, cv, gen, bulb, blades, a1, a2, a3, wr, lS, lC, lG, lT, ph, br;
export default {
  title: 'Sources of Energy', cam: { d: 17, e: .15, a: 0, t: V(0, 1.5, 0), ref: 2 },
  head: 'Bulb brightness',
  sliders: [{ k: 's', l: 'Source', min: 1, max: 9, step: 1, v: 2, names: SRC, axis: true }, { k: 'q', l: 'How strong', min: 1, max: 5, step: 1, v: 4, names: LV, axis: true }],
  setup() {
    src = box(3.2, 3.2, 3, 0x1f2937); cv = box(3.4, 3.2, 3, 0x94a3b8); gen = box(2.6, 2.6, 2.6, 0xf59e0b); src.position.set(-9, 1.6, 0); cv.position.set(-2.5, 1.6, 0); gen.position.set(3.2, 1.3, 0);
    blades = new THREE.Group(); for (let k = 0; k < 3; k++) { const b = box(.25, 2.4, .15, 0xf8fafc); S.remove(b); b.position.y = 1.2; const g = new THREE.Group(); g.add(b); g.rotation.z = k * 2.0944; blades.add(g); } blades.position.set(-2.5, 1.6, 1.7); S.add(blades);
    bulb = sph(1, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(9, 2.4, 0); box(.2, 1.5, .2, 0x94a3b8).position.set(9, .8, 0);
    a1 = arrow(0xf97316, .12); a2 = arrow(0xf97316, .12); a3 = arrow(0xf97316, .12); a1.set(-7, 1.6, 2.5, 1, 1.6); a2.set(-.6, 1.6, 2.4, 1, 1.6); a3.set(5.2, 1.6, 2.4, 1, 1.6);
    lS = label('', '#e2e8f0', 1.1); lS.position.set(-9, 4, 0); lC = label('', '#e2e8f0', 1); lC.position.set(-2.5, 4, 0); lG = label('Generator', '#fcd34d', 1.1); lG.position.set(3.2, 3.7, 0); lT = label('', '#86efac', 1.3); lT.position.set(-9, 5.6, 0); label('Bulb', '#fde047', 1.1).position.set(9, 4.2, 0);
  },
  reset() { ph = 0; br = 0; },
  step(dt, P) {
    ph += dt; const i = P.s - 1, lv = P.q / 5;
    const gust = i === 1 ? ((ph % 8) > 6 ? .4 : 1) : i === 2 ? .75 + .25 * Math.sin(ph * 1.3) : 1, b = lv * gust;                                // sun hides behind clouds · wind comes in gusts
    br += (b - br) * Math.min(1, dt * 4); P.b = br; src.material.color.set(SC[i]); cv.material.color.set(CC[i]);
    blades.visible = i !== 1; if (blades.visible) blades.rotation.z -= dt * (1 + 7 * br); cv.scale.y = i === 1 ? .35 : 1; cv.position.y = i === 1 ? .55 : 1.6;
    bulb.material.emissiveIntensity = br * 1.3; bulb.material.color.set(br > .1 ? 0xfff3b0 : 0x94a3b8);
    [a1, a2, a3].forEach(a => a.visible = br > .08);
    lS.set(SRC[i]); lC.set(CONV[i]); lT.set(REN[i] ? 'Renewable' : 'Non-renewable', REN[i] ? '#86efac' : '#fca5a5');
  },
  ro: { 'Bulb brightness': P => P.b < .15 ? 'Off' : P.b < .35 ? 'Dim' : P.b < .6 ? 'Medium' : P.b < .85 ? 'Bright' : 'Very bright' },
  status: P => REN[P.s - 1] ? ['Renewable', true] : ['Non-renewable', false, 'warn'],
  note: P => NOTE[P.s - 1],
  try: ['Pick Solar. Does the bulb stay steady? Why not?', 'Pick Wind. Watch the bulb as the wind gusts.', 'Compare Coal and Biogas. Which is renewable?'],
  key: ['Renewable sources do not run out: Sun, wind, water, biogas.', 'Non-renewable sources run out: coal, petroleum, natural gas, nuclear fuel.', 'Good sources give lots of energy, cost little and are safe.', 'Every source has a problem: pollution, cost, waste or limited supply.', 'Fossil fuels (coal, petroleum, natural gas) formed from dead plants and animals over millions of years. Thermal power plants burn them to make steam; burning adds CO₂ and causes acid rain.', 'Non-conventional sources: solar, wind, tidal, wave, ocean thermal (OTEC), geothermal, biogas and nuclear.'],
  quiz: [{ q: 'Which source is renewable?', o: ['Coal', 'Wind', 'Nuclear fuel'], a: 1, why: 'Wind is replaced naturally.' }, { q: 'A problem with solar energy is that it…', o: ['makes smoke', 'works only when the Sun shines', 'makes dangerous waste'], a: 1, why: 'Sunlight is not available at night or on cloudy days.' }, { q: 'A problem with burning coal is…', o: ['carbon dioxide and smoke', 'floods', 'no fuel needed'], a: 0, why: 'Burning coal pollutes the air.' }]
};
