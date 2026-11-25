// Class 10 · Ch 14 Sources of Energy — THERMAL / NUCLEAR POWER PLANT, a CLOSED system: the same water goes round and round.
// Heat (fuel or reactor) → boiler → steam → superheater → turbine → generator → electricity. Used steam is cooled in the condenser, a pump sends the water back.
import { S, V, box, sph, mat, arrowTo, wire, label, turbine, THREE } from '../scene.js';
const TABS = [['sources10', 'Overview'], ['thermal10', 'Power plant'], ['hydro10', 'Hydro'], ['renew10', 'Wind · Sun · more']], LV = ['Very low', 'Low', 'Medium', 'High', 'Very high'], N = 40;
const PATH = [[-8, 4], [-8, 6], [.8, 6], [.8, 1.9], [-6.5, 1.9], [-8, 1.9], [-8, 4]], SEG = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1])), TOT = SEG.reduce((a, b) => a + b, 0);
const at = u => { u = ((u % TOT) + TOT) % TOT; for (let i = 0; i < SEG.length; i++) { if (u < SEG[i]) { const f = u / SEG[i], a = PATH[i], b = PATH[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; } u -= SEG[i]; } return PATH[0]; };
const L = (t, x, y, c = '#e2e8f0', s = .95) => { const l = label(t, c, s); l.position.set(x, y, 0); return l; };
let fuelC, fuelN, tb, pr, dp, dc, dots, coil, bulb, lF, ph, br;
export default {
  title: 'Thermal / Nuclear Power Plant', tabs: TABS, cam: { d: 21, e: .12, a: 0, t: V(.5, 3.4, 0), ref: 2 }, head: 'Electricity out',
  sliders: [{ k: 's', l: 'Heat comes from', min: 1, max: 2, step: 1, v: 1, names: ['Fuel (coal, gas)', 'Nuclear reactor'] }, { k: 'h', l: 'How much heat', min: 1, max: 5, step: 1, v: 3, names: LV, axis: true }],
  setup() {
    const b = box(3, 2.8, 1.4, 0x475569); b.position.set(-8, 2.6, 0); wire(PATH, 0x64748b, .14);                                              // boiler + the pipe loop (the part inside the boiler is hidden)
    fuelC = box(3, .8, 1.4, 0x1f2937); fuelC.material = mat(0x1f2937, { emissive: 0xea580c, emissiveIntensity: 0 }); fuelC.position.set(-8, -.5, 0);
    fuelN = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, 1.2, 24), mat(0x16a34a, { emissive: 0x22c55e, emissiveIntensity: 0 })); fuelN.position.set(-8, -.5, 0); S.add(fuelN);
    [-9, -8, -7].forEach(x => arrowTo(0xf97316, .07).to(x, .1, x, 1.1));                                                                       // heat arrows ↑↑↑
    const hp = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 10; hp.push(V(-5.6 + 2.2 * i / 80, 6 + .55 * Math.cos(a), .55 * Math.sin(a))); }
    coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), 160, .1, 8), mat(0xf97316, { emissive: 0xea580c, emissiveIntensity: .2 })); S.add(coil);   // superheater coil
    box(2.2, 2.4, 1.2, 0x94a3b8).position.set(0, 6, 0); tb = turbine(1, 10, 0xe2e8f0, .5); tb.position.set(0, 6, .65);                              // turbine wheel (blades adapted from AutoLab makeImpeller)
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, 3, 12), mat(0x94a3b8, { metalness: .7 })); sh.rotation.z = Math.PI / 2; sh.position.set(2.6, 6, 0); S.add(sh);
    box(2.2, 2.2, 1.4, 0xf59e0b).position.set(5, 6, 0); wire([[6.1, 6], [8.7, 6]], 0xfcd34d, .1);                                                // generator + wire to the bulb
    bulb = sph(.75, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(9.5, 6, 0);
    box(2.6, 1.4, 1.2, 0x0e7490).position.set(-2, 1.9, 0); const pm = new THREE.Mesh(new THREE.CylinderGeometry(.65, .65, 1.2, 20), mat(0x7c3aed)); pm.rotation.x = Math.PI / 2; pm.position.set(-5.5, 1.9, 0); S.add(pm);   // condenser + pump
    pr = turbine(.5, 4, 0xe9d5ff, .4); pr.position.set(-5.5, 1.9, .65);
    dp = new Float32Array(N * 3); dc = new Float32Array(N * 3); dots = new THREE.BufferGeometry(); dots.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dots.setAttribute('color', new THREE.BufferAttribute(dc, 3));
    const pts = new THREE.Points(dots, new THREE.PointsMaterial({ size: .34, vertexColors: true })); pts.frustumCulled = false; S.add(pts);
    L('Boiler', -8, 2.6); lF = L('', -8, -1.7, '#fdba74'); L('Superheater', -4.5, 7.2, '#fdba74'); L('Turbine', 0, 8.2, '#e2e8f0'); L('Generator', 5, 7.4, '#fcd34d'); L('Bulb', 9.5, 7.3, '#fde047');
    L('Condenser', -2, -.1, '#7dd3fc'); L('Pump', -5.5, .8, '#c4b5fd'); L('Steam', 2.2, 3.9, '#e2e8f0', .8); L('Water', -3.9, 3, '#7dd3fc', .8); L('Closed system', -2, 9.2, '#86efac', .95);
  },
  reset() { ph = 0; br = 0; },
  step(dt, P) {
    dt = Math.min(dt, .05); const n = P.s === 2, lv = P.h / 5, hq = P.h * 20, el = hq * (n ? .33 : .35); ph += dt * (1 + 1.1 * P.h); br += (el / 35 - br) * Math.min(1, dt * 4);
    P.hq = hq; P.el = el; P.b = br; fuelC.visible = !n; fuelN.visible = n; fuelC.material.emissiveIntensity = fuelN.material.emissiveIntensity = .25 + lv; lF.set(n ? 'Nuclear reactor' : 'Fuel: coal, oil or gas');
    for (let i = 0; i < N; i++) { const [x, y] = at(ph + i * TOT / N), w = y < 2.3 && x < -.6; dp.set([x, y, .25], i * 3); dc.set(w ? [.22, .74, .97] : [.95, .97, 1], i * 3); }   // steam = white, water = blue
    dots.attributes.position.needsUpdate = dots.attributes.color.needsUpdate = true;
    tb.rotation.z -= dt * (1 + 8 * lv); pr.rotation.z -= dt * (1 + 5 * lv); coil.material.emissiveIntensity = .2 + lv; bulb.material.emissiveIntensity = br * 1.3; bulb.material.color.set(br > .1 ? 0xfff3b0 : 0x94a3b8);
  },
  ro: { 'Electricity out': P => Math.round(P.el) + ' units', 'Heat in': P => P.hq + ' units', 'Heat lost': P => Math.round(P.hq - P.el) + ' units' },
  status: () => ['Closed system', true],
  note: P => P.s === 2 ? 'Fission in the reactor makes the heat. After the boiler, a nuclear plant works like a coal plant.' : 'Fuel burns → the boiler makes steam → the turbine spins → the generator makes electricity. The condenser and pump bring the water back.',
  try: ['Follow the white dots (steam) and the blue dots (water). Where does the water turn into steam?', 'Switch to Nuclear reactor. What changes? What stays the same?', 'Raise the heat. Does the turbine spin faster?'],
  key: ['Thermal power plant: fuel burns, the heat makes steam, the steam spins a turbine, the turbine spins a generator.', 'Nuclear power plant: the reactor (fission) gives the heat instead of burning fuel. The rest is the same.', 'The condenser turns used steam back into water; the pump sends it to the boiler again. Water is not lost: a closed system.', 'Not all the heat becomes electricity — a big part is lost as waste heat.'],
  quiz: [{ q: 'Which part spins because of the steam?', o: ['Condenser', 'Turbine', 'Pump'], a: 1, why: 'Steam hits the turbine blades and spins them.' }, { q: 'Why is this a closed system?', o: ['The same water is used again and again', 'It is shut at night', 'No heat is lost'], a: 0, why: 'The condenser and pump return the water to the boiler.' }, { q: 'What makes the heat in a nuclear plant?', o: ['Burning coal', 'Fission in the reactor', 'Sunlight'], a: 1, why: 'Splitting heavy nuclei gives a lot of heat.' }, { q: 'What does the condenser do?', o: ['Makes electricity', 'Turns used steam into water', 'Heats the water'], a: 1, why: 'Cooling changes steam back to water.' }]
};
