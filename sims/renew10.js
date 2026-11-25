// Class 10 · Ch 14 Sources of Energy — WIND TURBINE · SOLAR · GEOTHERMAL · OCEAN WAVE: four renewable sources, each shown from source to bulb.
import { S, V, box, sph, mat, beam, wire, label, turbine, view, THREE } from '../scene.js';
const TABS = [['sources10', 'Overview'], ['thermal10', 'Power plant'], ['hydro10', 'Hydro'], ['renew10', 'Wind · Sun · more']], LV = ['Very low', 'Low', 'Medium', 'High', 'Very high'], SRC = ['Wind', 'Solar', 'Geothermal', 'Ocean wave'], NE = 18, NG = 30;
const NOTE = ['Wind turns the blades, the blades turn a generator. Free and clean, but it needs steady, strong wind.', 'A solar cell turns sunlight straight into electricity — no turbine. Clean, but no power at night and less on cloudy days.', 'Cold water goes down to hot rocks, comes up as steam and spins a turbine. Clean and steady, but only a few places have hot rocks.', 'Waves lift and drop a float, and the motion drives a generator. Clean, but the machines are costly and the sea can damage them.'];
const RT = [[[-4, .1], [9.5, .1], [9.5, 1]], [[-3, 1.2], [-3, .1], [9.5, .1], [9.5, 1]], [[2.4, 2], [3, 2], [3, .1], [9.5, .1], [9.5, 1]], [[-2.9, 5.8], [3, 5.8], [3, .1], [9.5, .1], [9.5, 1]]];       // wire routes: source → bulb
const GP = [[-6.5, -2.6], [-1.5, -2.6], [-1.5, 2], [-2.6, 2], [-6.5, 2], [-6.5, -2.6]];                                                              // geothermal water loop
const route = pts => { const sg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), T = sg.reduce((a, b) => a + b, 0); return { T, at: u => { u = ((u % T) + T) % T; for (let i = 0; i < sg.length; i++) { if (u < sg[i]) { const f = u / sg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } u -= sg[i]; } return pts[0]; } }; };
const RR = RT.map(route), RG = route(GP), LB = [];
const L = (m, t, x, y, c = '#e2e8f0') => { const l = label(t, c, .9); l.position.set(x, y, 0); LB.push([l, m]); return l; };
const pts = (n, o) => { const p = new Float32Array(n * 3), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial(o)); m.frustumCulled = false; S.add(m); return { p, g, m }; };
let G, ground, bulb, rotor, gtb, wind, rays, rock, cols, fl, rod, el, gd, ph, br, pa;
export default {
  title: 'Wind · Solar · Geothermal · Ocean Wave', tabs: TABS, cam: { d: 20, e: .22, a: 0, t: V(.5, 2.2, 0), ref: 2 }, head: 'Power output',
  sliders: [{ k: 'm', l: 'Source', min: 1, max: 4, step: 1, v: 1, names: SRC }, { k: 'q', l: 'How strong', min: 1, max: 5, step: 1, v: 4, names: LV, axis: true }],
  setup() {
    G = [0, 1, 2, 3].map(() => { const g = new THREE.Group(); S.add(g); return g; }); ground = box(24, .3, 3, 0x3f3f46); ground.position.set(0, -.15, 0);
    box(.5, .8, .5, 0x94a3b8).position.set(9.5, .4, 0); bulb = sph(.7, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(9.5, 1.7, 0); G.forEach((g, k) => g.add(wire(RT[k], 0x94a3b8, .08)));
    // 0 · WIND: tower, box with the generator inside, 3 blades (turbine helper adapted from AutoLab), streaks of wind
    const wt = new THREE.Group(); wt.position.set(-4, 0, 0); wt.rotation.y = -.45; G[0].add(wt); const tw = new THREE.Mesh(new THREE.CylinderGeometry(.18, .35, 6, 14), mat(0xe2e8f0)); tw.position.y = 3; wt.add(tw);
    const nc = box(.9, .8, 1.8, 0xcbd5e1); nc.position.set(0, 6.2, -.1); wt.add(nc); rotor = turbine(2.8, 3, 0xf8fafc, .35); rotor.position.set(0, 6.2, 1); wt.add(rotor);
    wind = Array.from({ length: 10 }, (_, i) => { const s = box(.9, .07, .07, 0xe2e8f0); G[0].add(s); s.position.set(-10 + i * 1.3, 3.2 + (i * 7 % 6) * .95, (i % 3 - 1) * 1.2); return s; });
    // 1 · SOLAR: tilted panel of cells facing the Sun, rays
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d'); cx.fillStyle = '#1e3a8a'; cx.fillRect(0, 0, 128, 128); cx.strokeStyle = '#93c5fd'; cx.lineWidth = 3;
    for (let i = 0; i <= 128; i += 32) { cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i, 128); cx.moveTo(0, i); cx.lineTo(128, i); cx.stroke(); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    const gm = mat(0x475569), pn = new THREE.Mesh(new THREE.BoxGeometry(4.4, .2, 2.6), [gm, gm, mat(0xffffff, { map: tx }), gm, gm, gm]); pn.position.set(-3, 2.5, 0); pn.rotation.z = .7; G[1].add(pn);
    const lg = box(.25, 1.6, .25, 0x94a3b8); lg.position.set(-3, .9, 0); G[1].add(lg); const sun = sph(.9, 0xfde047); sun.material = new THREE.MeshBasicMaterial({ color: 0xfde047 }); sun.position.set(-9, 8, 0); G[1].add(sun);
    rays = [-1.8, -.9, 0, .9, 1.8].map(o => { const b = beam(0xfacc15, .05); G[1].add(b); b.set(V(-8.4, 7.4, 0), V(-3.06 + .76 * o, 2.58 + .64 * o, 0)); return b; });
    // 2 · GEOTHERMAL: hot rocks under the ground, pipe down (cold water), pipe up (steam), turbine + generator on the surface
    const sl = box(24, 3.4, 3, 0x78716c); sl.position.set(0, -1.7, 0); G[2].add(sl); rock = box(7, 1, 3.04, 0xb91c1c); rock.material = mat(0xb91c1c, { emissive: 0xef4444, emissiveIntensity: .4 }); rock.position.set(-4, -2.8, 0); G[2].add(rock);
    G[2].add(wire([[-2.6, 2], [-6.5, 2], [-6.5, -2.6], [-1.5, -2.6]], 0x38bdf8, .16, 1.7), wire([[-1.5, -2.6], [-1.5, 2]], 0xe2e8f0, .16, 1.7));
    const hs = box(2.2, 3, 3.9, 0x64748b); hs.position.set(-1.5, 1.5, 0); G[2].add(hs); gtb = turbine(.8, 10, 0xe2e8f0, .5); gtb.position.set(-1.5, 2, 2.05); G[2].add(gtb);
    const pl = box(1.6, 1.3, 1.2, 0x475569); pl.position.set(1.6, .65, 0); const gn = box(1.6, 1.4, 1.2, 0xf59e0b); gn.position.set(1.6, 2, 0); const sf = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, 1.2, 12), mat(0x94a3b8)); sf.rotation.z = Math.PI / 2; sf.position.set(.2, 2, 0); G[2].add(pl, gn, sf);
    gd = pts(NG, { size: .34, vertexColors: true }); gd.g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(NG * 3), 3)); G[2].add(gd.m);
    // 3 · OCEAN WAVE: a row of water columns, a float on the wave, a rod into a generator on a pillar
    cols = Array.from({ length: 26 }, (_, i) => { const c = box(.44, 1, 3.2, i % 2 ? 0x0ea5e9 : 0x0284c7); G[3].add(c); c.position.x = -9.5 + i * .42; return c; });
    const pi = box(.4, 9.2, .4, 0x94a3b8); pi.position.set(-4, 1.1, -.9); const g3 = box(2.2, 1.2, 1.8, 0xf59e0b); g3.position.set(-4, 5.8, 0); fl = box(1.6, .5, 1.2, 0xef4444); fl.position.z = .4; rod = box(.14, 1, .14, 0xe2e8f0); rod.position.z = .4; G[3].add(pi, g3, fl, rod);
    el = pts(NE, { color: 0xfde047, size: .3 });
    L(0, 'Blades', -5.2, 9.7); L(0, 'Generator', -1.6, 5.9, '#fcd34d'); L(0, 'Tower', -2.2, 2.2); L(0, 'Wind', -9, 9.3, '#bae6fd');
    L(1, 'Sun', -9, 9.5, '#fde047'); L(1, 'Solar cells', -3, 5.1, '#93c5fd'); L(1, 'No turbine needed', 3.2, 3, '#86efac');
    L(2, 'Hot rocks', -4, -2.8, '#fecaca'); L(2, 'Cold water down', -8.4, -.6, '#7dd3fc'); L(2, 'Steam up', .3, -.6, '#e2e8f0'); L(2, 'Turbine', -1.5, 4.1); L(2, 'Generator', 1.6, 3.1, '#fcd34d');
    L(3, 'Waves', -8.4, 3.6, '#7dd3fc'); L(3, 'Float', -2.4, 2.9, '#fca5a5'); L(3, 'Generator', -4, 7.1, '#fcd34d'); L(-1, 'Bulb', 9.5, 3, '#fde047');
  },
  reset() { ph = 0; br = 0; pa = 0; },
  step(dt, P) {
    dt = Math.min(dt, .05); const m = P.m - 1, q = P.q / 5; ph += dt; G.forEach((g, k) => g.visible = k === m); ground.visible = m !== 2; LB.forEach(([l, k]) => l.visible = (k === m || k < 0) && view.labelsOn);
    const A = .25 + P.q * .2, cph = .9 * -4 - 2.2 * ph; let b = q;
    if (m === 0) { b = q * (.8 + .2 * Math.sin(ph * 1.3)); rotor.rotation.z -= dt * (.3 + 7 * b); wind.forEach(s => { s.position.x += dt * (2 + P.q * 2.4); if (s.position.x > 1.5) s.position.x = -10.5; }); }
    if (m === 1) rays.forEach((r, i) => r.visible = i < P.q);
    if (m === 2) { rock.material.emissiveIntensity = .2 + q * .5; gtb.rotation.z -= dt * (.3 + 7 * q); const sp = ph * (.8 + 2 * q); for (let i = 0; i < NG; i++) { const [x, y] = RG.at(sp + i * RG.T / NG), up = x > -1.6 && y > -2.3; gd.p.set([x, y, 1.9], i * 3); gd.g.attributes.color.array.set(up ? [.95, .97, 1] : [.22, .74, .97], i * 3); } gd.g.attributes.position.needsUpdate = gd.g.attributes.color.needsUpdate = true; }
    if (m === 3) { b = A / 1.25 * (.55 + .45 * Math.abs(Math.cos(cph))); cols.forEach(c => { const top = 1.4 + A * Math.sin(.9 * c.position.x - 2.2 * ph); c.scale.y = top + 3.5; c.position.y = (top - 3.5) / 2; });
      const fy = 1.4 + A * Math.sin(cph) + .3; fl.position.set(-4, fy, .4); rod.scale.y = 5.2 - fy - .25; rod.position.y = (5.2 + fy + .25) / 2; }
    br += (b - br) * Math.min(1, dt * 5); P.b = br; bulb.material.emissiveIntensity = br * 1.3; bulb.material.color.set(br > .1 ? 0xfff3b0 : 0x94a3b8);
    pa += dt * br * 4; el.m.visible = br > .08; if (el.m.visible) for (let i = 0; i < NE; i++) { const [x, y] = RR[m].at(pa + i * RR[m].T / NE); el.p.set([x, y, .2], i * 3); } el.g.attributes.position.needsUpdate = true;
  },
  ro: { 'Power output': P => Math.round(P.b * 100) + ' %', 'Source strength': P => LV[P.q - 1] },
  status: () => ['Renewable', true],
  note: P => NOTE[P.m - 1],
  try: ['Wind: set the wind to Very low. What happens to the bulb?', 'Solar: lower the sunlight. Is there any turbine to slow down?', 'Geothermal: does the bulb flicker? Compare with Wind and Ocean wave.', 'Ocean wave: make the waves bigger. Watch the float and the bulb.'],
  key: ['Wind, solar, geothermal and ocean waves are renewable sources: they do not run out.', 'Wind, geothermal and wave energy turn a generator. Solar cells make electricity directly from sunlight.', 'Geothermal energy: heat from hot rocks deep underground makes steam to spin a turbine.', 'Ocean wave energy: the up-and-down motion of waves runs a generator.', 'Wind and solar power change with the weather; geothermal power is steady but only possible in a few places.'],
  quiz: [{ q: 'Which one needs no turbine?', o: ['Wind', 'Solar cell', 'Geothermal'], a: 1, why: 'A solar cell turns light directly into electricity.' }, { q: 'Where does geothermal steam come from?', o: ['Burning coal', 'Hot rocks underground', 'Sunlight'], a: 1, why: 'Water poured down meets hot rocks and turns to steam.' }, { q: 'What gives more power from a wind turbine?', o: ['Stronger wind', 'No wind', 'Night time'], a: 0, why: 'Faster wind spins the blades faster.' }, { q: 'Ocean wave plants use…', o: ['the up-and-down motion of waves', 'burning oil', 'nuclear fission'], a: 0, why: 'The moving float drives a generator.' }]
};
