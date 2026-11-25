// Class 10 · Ch 14 Sources of Energy — HYDEL (HYDRO) POWER PLANT, an OPEN system: water comes in from the river/rain and leaves downstream.
// Water stored behind the dam (PE) → falls through the pipe (KE) → turbine → generator → electricity.
import { S, V, box, sph, mat, arrowTo, wire, label, turbine, THREE } from '../scene.js';
const TABS = [['sources10', 'Overview'], ['thermal10', 'Power plant'], ['hydro10', 'Hydro'], ['renew10', 'Wind · Sun · more']], LV = ['Very low', 'Low', 'Medium', 'High', 'Very high'], N = 34, HM = 6.55;
const PATH = [[-2.4, 1.4], [4.6, 1.4], [5.4, .65], [12.4, .65]], SEG = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1])), TOT = SEG.reduce((a, b) => a + b, 0);
const at = u => { u = ((u % TOT) + TOT) % TOT; for (let i = 0; i < SEG.length; i++) { if (u < SEG[i]) { const f = u / SEG[i], a = PATH[i], b = PATH[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; } u -= SEG[i]; } return PATH[0]; };
const L = (t, x, y, c = '#e2e8f0', s = .95) => { const l = label(t, c, s); l.position.set(x, y, 0); return l; };
let lake, tb, dp, dots, bulb, ri, lL, lv, ph, br;
export default {
  title: 'Hydro (Hydel) Power Plant', tabs: TABS, cam: { d: 17.5, e: .14, a: 0, t: V(2.2, 3.4, 0), ref: 2 }, head: 'Electricity out',
  sliders: [{ k: 'H', l: 'Water height behind dam', min: 1, max: 5, step: 1, v: 4, names: LV, axis: true }, { k: 'g', l: 'Gate opening', min: 1, max: 5, step: 1, v: 3, names: LV, axis: true }],
  toggles: [{ k: 'rf', l: 'River refills the lake', v: true }],
  setup() {
    const gr = box(26, .4, 3.2, 0x3f3f46); gr.position.set(2, -.2, 0);
    const sh = new THREE.Shape([[-1, 0], [3, 0], [1.4, 7], [.2, 7]].map(p => new THREE.Vector2(p[0], p[1]))), dam = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: false }), mat(0x94a3b8)); dam.position.z = -1.5; S.add(dam);   // dam wall
    lake = box(8, 1, 2.8, 0x38bdf8); lake.material = mat(0x38bdf8, { transparent: true, opacity: .8 }); lake.position.x = -4;
    const st = box(7, .3, 1.2, 0x38bdf8); st.material = mat(0x38bdf8, { transparent: true, opacity: .8 }); st.position.set(9.3, .15, 1.3);                  // downstream river
    box(6.6, .6, .1, 0x1d4ed8).position.set(.9, 1.4, 1.55);                                                                                             // pipe (penstock) in front of the dam
    box(2.4, 2.4, 1.2, 0x64748b).position.set(4.6, 1.3, 0); tb = turbine(1, 12, 0xcbd5e1, .6); tb.position.set(4.6, 1.4, .65);                           // turbine in its house (blades adapted from AutoLab)
    box(2, .7, 1.2, 0x475569).position.set(7.2, .35, 0); box(2, 1.2, 1.2, 0xf59e0b).position.set(7.2, 1.3, 0);
    const sf = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .8, 12), mat(0x94a3b8, { metalness: .7 })); sf.rotation.z = Math.PI / 2; sf.position.set(6.2, 1.3, 0); S.add(sf);
    wire([[8.2, .35], [10.6, .35], [10.6, .8]], 0xfcd34d, .1); box(.5, .8, .5, 0x94a3b8).position.set(10.6, .4, 0); bulb = sph(.7, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(10.6, 1.5, 0);
    dp = new Float32Array(N * 3); dots = new THREE.BufferGeometry(); dots.setAttribute('position', new THREE.BufferAttribute(dp, 3)); const pts = new THREE.Points(dots, new THREE.PointsMaterial({ color: 0xe0f2fe, size: .34 })); pts.frustumCulled = false; S.add(pts);
    ri = arrowTo(0x38bdf8, .09); ri.to(-9.6, 6.6, -8.2, 6.6);
    lL = L('Water body (lake)', -3, 6, '#7dd3fc'); L('Dam', .8, 7.8, '#e2e8f0'); L('Turbine', 4.6, 3.3, '#e2e8f0'); L('Generator', 7.3, 3.9, '#fcd34d'); L('Bulb', 10.6, 3, '#fde047'); L('Down stream', 9.3, -.7, '#7dd3fc'); L('River / rain', -9, 7.5, '#7dd3fc', .8);
    L('Open system', 2.2, 9, '#86efac', .95);
  },
  reset(P) { lv = 1.8 + P.H * .95; ph = 0; br = 0; },
  step(dt, P) {
    dt = Math.min(dt, .05); const tgt = 1.8 + P.H * .95; if (P.rf) lv += (tgt - lv) * Math.min(1, dt * 2); else lv = Math.min(lv, tgt);
    const flow = P.g / 5 * Math.sqrt(lv / HM) * Math.max(0, Math.min(1, lv - 1.4)), pw = flow * lv / HM; if (!P.rf) lv = Math.max(1.2, lv - flow * dt * .35);
    P.fl = flow; P.pw = pw; P.lv = lv; ph += dt * flow * 5; br += (pw - br) * Math.min(1, dt * 4);
    lake.scale.y = lv; lake.position.y = lv / 2; lL.position.y = lv + .9; ri.visible = !!P.rf;
    for (let i = 0; i < N; i++) { const [x, y] = at(ph + i * TOT / N); dp.set([x, y, 1.75], i * 3); } dots.attributes.position.needsUpdate = true; dots.visible = flow > .02;
    tb.rotation.z -= dt * (.3 + 9 * flow); bulb.material.emissiveIntensity = br * 1.3; bulb.material.color.set(br > .1 ? 0xfff3b0 : 0x94a3b8);
  },
  ro: { 'Electricity out': P => Math.round(P.pw * 100) + ' %', 'Lake height': P => Math.round(P.lv / HM * 100) + ' %', 'Water flow': P => Math.round(P.fl * 100) + ' %' },
  status: P => P.fl < .02 ? ['No flow', false, 'warn'] : ['Open system', true],
  note: P => !P.rf ? 'The river is not refilling the lake. Watch the lake sink and the bulb fade.' : P.fl < .02 ? 'The gate is shut or the lake is too low, so no water reaches the turbine.' : 'Water high up has stored energy. It rushes down the pipe, spins the turbine, and flows away downstream.',
  try: ['Raise the water height. Is the bulb brighter?', 'Close the gate (Very low). What happens to the turbine?', 'Switch off “River refills the lake” and wait. Why does the power fall?'],
  key: ['Hydro power plant: water stored behind a dam falls through a pipe and spins a turbine; the generator makes electricity.', 'Energy chain: stored (potential) energy of water → kinetic energy → turbine → electrical energy.', 'It is an open system: water enters from the river or rain and leaves downstream.', 'More height or more flow gives more power. Problem: dams flood land and move people.'],
  quiz: [{ q: 'Water high behind the dam has…', o: ['kinetic energy', 'potential energy', 'sound energy'], a: 1, why: 'Height stores potential energy.' }, { q: 'Why is a hydro plant an open system?', o: ['Water comes in and goes out', 'The gate is open at night', 'It uses steam'], a: 0, why: 'River water enters; used water flows downstream.' }, { q: 'The water level behind the dam is higher. The power is…', o: ['more', 'less', 'the same'], a: 0, why: 'Water falling from a greater height pushes harder.' }, { q: 'A problem with big dams is…', o: ['smoke', 'they flood land', 'they need coal'], a: 1, why: 'Land goes under water and people must move.' }]
};
