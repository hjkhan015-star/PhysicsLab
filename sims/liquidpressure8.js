// Class 8 · Ch 11 Force and Pressure — PRESSURE IN LIQUIDS. Three vessels:
//   Tank     → holes at different depths: deeper water pushes harder.   (water level is real: a tap holds it steady, or it drains)
//   Cylinder → holes all round at ONE depth: a liquid pushes equally in every direction.
//   Dam      → water pushes the wall harder near the bottom, so the base is built thick.
import { S, V, box, arrow, arrowTo, mat, THREE, label, view } from '../scene.js';
const TABS = [['force8', 'Force'], ['pressure8', 'Solids'], ['liquidpressure8', 'Liquids']];
const LEV = ['Low', 'Half', 'High', 'Full'], H = [1.5, 2.6, 3.4, 3.9], HD = [1.6, 2.8, 4, 4.8];       // water heights: vessels · dam
const HH = [.8, 2, 3.2], HC = 1.3, BASE = 3.5, G = 9.8, N = 22, JN = 8, NL = 8, HDAM = 5, RC = 1.8, PUSH = 0x22c55e, WATER = 0x38bdf8;
const CAMS = [{ d: 15, e: .18, a: 0, t: V(1.5, 4.3, 0), ref: 1.6 }, { d: 14.5, e: .62, a: 0, t: V(0, 3.6, 0), ref: 1.6 }, { d: 17, e: .1, a: 0, t: V(-1.8, 2.7, 0), ref: 1.6 }];
let ground, table, glass, water, cylG, cylW, ped, pipe, pipe2, stream, jets, arT, arC, arD, ab, holesC, plugs, layers, resv, lMain, lA, lB, lC, t, L, lastM, lastH;
const jp = new Float32Array(JN * N * 3);
const wmat = (o = .55) => mat(WATER, { transparent: true, opacity: o });
export default {
  title: 'Pressure in Liquids', cam: CAMS[0], tabs: TABS, head: 'Strongest push',
  sliders: [{ k: 'v', l: '🥛 Vessel', min: 1, max: 3, step: 1, v: 1, names: ['Tank', 'Cylinder', 'Dam'] },
    { k: 'h', l: '💧 Water height', min: 1, max: 4, step: 1, v: 4, names: LEV, axis: true },
    { k: 'o', l: '🕳 Open holes', min: 1, max: 3, step: 1, v: 1, names: ['All', 'Top', 'Bottom'], axis: true, w: P => P.v === 1 },
    { k: 'd', l: '🧱 Dam wall', min: 1, max: 2, step: 1, v: 1, names: ['Same thickness', 'Wide base'], w: P => P.v === 3 }],
  toggles: [{ k: 'sup', l: '🚰 Tap supply', v: true, w: P => P.v < 3 }],
  setup() {
    ground = box(30, .3, 9, 0x3f6b3a); ground.position.set(3, -.15, 0);
    table = box(4.4, BASE, 2.2, 0x8a5a2b); glass = box(4, 4, 2, 0xbfdbfe); glass.material = mat(0xbfdbfe, { transparent: true, opacity: .2, depthWrite: false }); glass.position.y = BASE + 2;
    water = box(3.8, 1, 1.8, WATER); water.material = wmat(); plugs = HH.map(() => box(.16, .34, .34, 0x1e293b));
    ped = box(4.4, BASE, 4.4, 0x8a5a2b); cylG = new THREE.Mesh(new THREE.CylinderGeometry(RC, RC, 4, 32, 1, true), mat(0xbfdbfe, { transparent: true, opacity: .22, side: THREE.DoubleSide, depthWrite: false })); cylG.position.y = BASE + 2; S.add(cylG);
    cylW = new THREE.Mesh(new THREE.CylinderGeometry(RC - .08, RC - .08, 1, 32), wmat()); S.add(cylW);
    holesC = Array.from({ length: JN }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.13, 8, 6), mat(0x0f172a)); const a = i / JN * 6.2832; m.position.set(RC * Math.cos(a), BASE + HC, RC * Math.sin(a)); S.add(m); return m; });
    pipe = box(5, .5, .5, 0x94a3b8); pipe2 = box(.5, 1.2, .5, 0x94a3b8); stream = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, 1, 10), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: .85 })); S.add(stream);
    jets = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(jp, 3)), new THREE.PointsMaterial({ color: 0x7dd3fc, size: .22 })); S.add(jets); jets.frustumCulled = false;
    arT = HH.map(() => arrow(PUSH, .07)); arC = Array.from({ length: JN }, () => arrow(PUSH, .08)); ab = arrowTo(PUSH, .08);
    layers = Array.from({ length: NL }, () => box(1, HDAM / NL - .03, 3.2, 0x94a3b8)); resv = box(8, 1, 4, WATER); resv.material = wmat(.5); arD = Array.from({ length: NL }, () => arrow(PUSH, .07));
    lMain = label('', '#86efac', .85); lA = label('', '#86efac', .8); lB = label('', '#fde047', .8); lC = label('', '#fca5a5', .8);
  },
  reset() { t = 0; lastM = 0; lastH = 0; },
  step(dt, P) {
    t += dt; const m = P.v, T1 = m === 1, T2 = m === 2, T3 = m === 3;
    if (m !== lastM) { lastM = m; view.set(CAMS[m - 1]); lastH = 0; }
    const vis = { tank: [table, glass, water, ...plugs, ...arT, ab, lMain, lA], cyl: [ped, cylG, cylW, ...holesC, ...arC, ab, lMain], vess: [pipe, pipe2, stream], dam: [...layers, resv, ...arD, lMain, lA, lB, lC] };
    [].concat(...Object.values(vis)).forEach(o => o.visible = false); [lMain, lA, lB, lC].forEach(l => l.set(''));
    const on = (...o) => o.forEach(x => x.visible = true); jp.fill(-99);
    if (!T3) {
      const Ht = H[P.h - 1]; if (P.h !== lastH) { lastH = P.h; L = Ht; }                                       // moving the slider = pour water in / take water out
      const holes = T1 ? HH.map((y, i) => ({ y, open: P.o === 1 || (P.o === 2 && i === 2) || (P.o === 3 && i === 0) })) : Array.from({ length: JN }, () => ({ y: HC, open: true }));
      let q = 0; holes.forEach(h => { if (h.open) q += Math.sqrt(Math.max(0, L - h.y)); });
      if (P.sup) L += (Ht - L) * Math.min(1, dt * 3); else L = Math.max(0, L - (T1 ? .082 : .026) * q * dt * 1.4);   // tap on → level held · tap off → it drains
      P.L = L; let best = 0; const y1 = BASE;
      if (T1) { on(...vis.tank); water.scale.y = Math.max(.01, L); water.position.y = BASE + L / 2; glass.position.x = table.position.x = water.position.x = 0; table.position.y = BASE / 2; lMain.position.set(-4.5, 6.3, 0); lMain.set('Pushes sideways', '#86efac'); lA.position.set(-4.5, 5, 0); lA.set('Pushes down', '#86efac'); }
      else { on(...vis.cyl); ped.position.set(0, BASE / 2, 0); cylW.scale.y = Math.max(.01, L); cylW.position.y = BASE + L / 2; lMain.position.set(-5.2, 7.3, 0); lMain.set('Same push every way', '#86efac'); }
      on(...vis.vess); const sx = T1 ? -.9 : -.5, sy = BASE + 5.4; pipe.position.set(sx - 2.3, sy + .7, 0); pipe2.position.set(sx, sy + .1, 0);
      const full = BASE + L, sl = Math.max(.01, sy - full); stream.visible = !!P.sup && sl > .1; stream.scale.set(1, sl, 1); stream.position.set(sx, full + sl / 2, 0); stream.scale.x = stream.scale.z = .9 + Math.sin(t * 30) * .08;
      holes.forEach((h, i) => { const d = L - h.y, live = h.open && d > .05, y0 = BASE + h.y, vx = live ? Math.sqrt(2 * G * d) : 0, tf = Math.sqrt(2 * y0 / G); if (live) best = Math.max(best, d);
        const ang = i / JN * 6.2832, cx = T1 ? 1 : Math.cos(ang), cz = T1 ? 0 : Math.sin(ang), sx0 = T1 ? 2 : RC * cx, sz0 = T1 ? 0 : RC * cz;
        for (let k = 0; k < N; k++) { const u = ((t * .8 + k / N) % 1) * tf, j = (i * N + k) * 3; if (live) { jp[j] = sx0 + cx * vx * u; jp[j + 1] = y0 - .5 * G * u * u; jp[j + 2] = sz0 + cz * vx * u; } }
        if (T1) { const Lw = Math.max(0, d * .5); arT[i].set(2 - Lw, y0, Lw, 1, 0); arT[i].visible = d > .05; plugs[i].visible = !h.open; plugs[i].position.set(2.02, y0, 0); }
        else { const Lw = Math.max(0, d * .5); arC[i].visible = d > .05; if (d > .05) { arC[i].set(sx0 - cx * Lw, y0, Lw, 1, sz0 - cz * Lw); arC[i].rotation.y = -ang; } } });
      ab.to(T1 ? -1.3 : 0, BASE + .5 + L * .45, T1 ? -1.3 : 0, BASE + .2); ab.visible = true; ab.position.z = T1 ? -1.3 : 0; if (!T1) { ab.to(0, BASE + .5 + L * .45, 0, BASE + .2, 0); }
      P.best = best; P.big = L;
    } else {
      on(...vis.dam); const Ld = HD[P.h - 1], wide = P.d === 2; L = Ld; P.L = Ld; let fails = 0, worst = 0;
      resv.scale.y = Ld; resv.position.set(-4, Ld / 2, 0);
      layers.forEach((l, i) => { const hh = HDAM / NL, yc = (i + .5) * hh, th = wide ? .9 + .5 * (HDAM - yc) : .9, dpt = Math.max(0, Ld - yc), bad = dpt > th * 2.6; if (bad) fails++; worst = Math.max(worst, dpt);
        l.scale.set(th, 1, 1); const shake = bad ? .35 + Math.sin(t * 18 + i * 2) * .05 : 0; l.position.set(th / 2 + shake, yc, 0); l.material.color.set(bad ? 0xef4444 : 0x94a3b8);
        const Lw = dpt * .5; arD[i].visible = dpt > .05; arD[i].set(-Lw, yc, Lw, 1, 1.8);
        const vx = bad ? Math.sqrt(2 * G * dpt) * .5 : 0, tf = Math.sqrt(2 * Math.max(yc, .3) / G); for (let k = 0; k < N; k++) { const u = ((t * .8 + k / N) % 1) * tf, j = (i * N + k) * 3; if (bad) { jp[j] = th + .4 + vx * u; jp[j + 1] = yc - .5 * G * u * u; jp[j + 2] = 0; } } });
      P.fails = fails; P.best = worst; lMain.position.set(-4, HDAM + 1.6, 0); lMain.set('Water side', '#7dd3fc'); lA.position.set(2.3, HDAM + .8, 0); lA.set(wide ? 'Wide base' : 'Thin wall', '#e2e8f0');
      lB.position.set(-4, .8, 2.2); lB.set('Push is biggest here', '#fde047'); lC.position.set(4.2, 2.2, 0); lC.set(fails ? 'CRACK!' : '', '#f87171'); P.safe = !fails;
    }
    jets.geometry.attributes.position.needsUpdate = true; ground.position.x = T3 ? 0 : 3; ground.scale.z = T2 ? 2.3 : 1;
  },
  ro: { 'Strongest push': P => P.best < .05 ? 'None' : P.best < 1 ? 'Weak' : P.best < 2.2 ? 'Medium' : 'Strong', 'Water height': P => P.v < 3 ? Math.round(P.L * 10) + ' cm' : null, 'Tap': P => P.v < 3 ? (P.sup ? 'On' : 'Off') : null, 'Dam': P => P.v === 3 ? (P.fails ? 'Cracking!' : 'Safe') : null },
  status: P => P.v === 3 ? (P.fails ? ['Wall cracks', false, 'crit'] : ['Wall safe', true]) : P.best < .05 ? ['No stream', false, 'warn'] : !P.sup && P.L < 3.8 ? ['Level falling', false, 'warn'] : ['Water flowing', true],
  note: P => P.v === 3 ? (P.fails ? `<b>The thin wall cracks near the bottom.</b> Deep water pushes much harder there, and this wall is only as thick at the bottom as at the top.` : P.d === 2 ? '<b>The wide base holds.</b> The wall is thickest where the water pushes hardest.' : 'This thin wall holds, because the water is not deep. Raise the water to see what happens.')
    : P.v === 2 ? '<b>All the streams are alike.</b> The holes are at the same depth, so the water pushes out equally in every direction.'
    : P.best < .05 ? 'No open hole is below the water, so no stream. Add water to see them.' : P.sup ? 'The tap keeps the water level steady, so the streams stay the same. The lowest stream goes farthest.' : P.L < 3.8 ? 'The tap is off. The water level falls and the streams get weaker. Top streams stop first.' : 'Deeper water pushes harder, so the lowest stream goes farthest.',
  try: [{ t: 'In <b>Tank</b>, open only the <b>Bottom</b> hole and the <b>Top</b> hole one by one. Which push is stronger?', check: P => P.v === 1 && P.o === 3 && P.h === 4, yes: 'Yes! The bottom push is strong.' },
    { t: 'Turn the <b>Tap supply</b> off. Watch the water level and the streams.', check: P => P.v < 3 && !P.sup && P.L < 3.2, yes: 'Yes! Less water, weaker streams.' },
    { t: 'Switch to <b>Cylinder</b>. Do all the streams go equally far?', check: P => P.v === 2, yes: 'Yes! A liquid pushes equally in all directions.' },
    { t: 'Switch to <b>Dam</b> with a <b>Thin wall</b> and the water <b>Full</b>. What happens?', check: P => P.v === 3 && P.d === 1 && P.fails > 0, yes: 'Yes! Deep water cracks a thin wall.' },
    { t: 'Now choose the <b>Wide base</b>. Is the dam safe?', check: P => P.v === 3 && P.d === 2 && P.h === 4 && P.safe, yes: 'Yes! The wide base is strongest where the push is biggest.' }],
  key: ['Liquids push on the <b>bottom</b> and on the <b>sides</b> of the vessel.', 'Liquid pressure <b>increases with depth</b>.', 'At the same depth a liquid pushes <b>equally in all directions</b>.', 'When the water level falls, the pressure and the stream strength fall too.', 'Dam walls are <b>thicker at the bottom</b> because the deep water pushes hardest there.'],
  quiz: [{ q: 'Which hole sends the water farthest?', o: ['Top', 'Middle', 'Bottom'], a: 2, why: 'The bottom hole has the deepest water above it.' }, { q: 'Holes at the same depth in a cylinder show that liquid pressure…', o: ['is equal in all directions', 'only pushes down', 'is zero'], a: 0, why: 'All the streams go equally far.' }, { q: 'The tap is switched off. What happens to the streams?', o: ['They get stronger', 'They stay the same', 'They get weaker as the level falls'], a: 2, why: 'The water gets less deep, so the pressure falls.' }, { q: 'Why is the base of a dam wide?', o: ['To look nice', 'Deep water pushes hardest at the bottom', 'To save concrete'], a: 1, why: 'Pressure grows with depth.' }]
};
