// Class 8 · Ch 14 Chemical Effects of Electric Current — does the liquid carry current? Then: copper plating with a key (switch) and a battery you can change.
import { S, V, box, sph, mat, THREE, wire, label } from '../scene.js';
const NAME = ['Distilled water', 'Tap water', 'Salt water', 'Lemon juice', 'Sugar water'], LVL = [0, 1, 2, 2, 0], COND = [0, 2, 12, 9, 0], CU = 15;   // LVL 0 poor · 1 weak · 2 good · COND = mA per volt · CU = copper sulphate liquid
const COL = [0xbfe3f5, 0xa9d6ea, 0x8fc1e3, 0xf2e26a, 0xe9e2c8], BULB = ['Off', 'Dim', 'Bright'], STEEL = 0x94a3b8, COPPER = 0xd9822b;
const XL = -3.8, XR = 3.8, PW = 1.8, RW = 8, CL = 3, RH = 3.5 / RW, CW = PW / CL, MFULL = 60, TS = 180, NK = RW * CL;    // electrode x · plate width · cell grid · cell size · mg for a thick coat · fast clock (1 s = 3 min) · cells
const fr = i => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, NZ = Array.from({ length: NK }, (_, i) => .55 + .8 * fr(i + 1)), NB = Array.from({ length: NK }, (_, i) => fr(i + 50));
const SEG = [[3.8, 6.6, 3.8, 9], [3.8, 9, -1.1, 9], [-1.1, 9, -3.3, 9], [-3.3, 9, -3.8, 9], [-3.8, 9, -3.8, 6.6]], SL = SEG.map(([a, b, c, d]) => Math.hypot(c - a, d - b)), TL = SL.reduce((x, y) => x + y, 0);   // the wire loop the current dots follow
const at = s => { s = (s % TL + TL) % TL; for (let i = 0; i < 5; i++) { if (s <= SL[i]) { const [a, b, c, d] = SEG[i], f = s / SL[i]; return [a + (c - a) * f, b + (d - b) * f]; } s -= SL[i]; } return [0, 0]; };
let liq, liqB, rA, rB, pTop, pCells, tiles, bits, dots, bub, bulb, halo, blade, tm_, lq, lP, lO, lBat, lKs, mg, tm, ph, fp, ang, done;
const tmp = new THREE.Object3D(), px = new Float32Array(NK), bp = new Float32Array(36 * 3), dp = new Float32Array(28 * 3);
const inst = (geo, c, n, bas) => { const m = new THREE.InstancedMesh(geo, bas ? new THREE.MeshBasicMaterial({ color: c }) : mat(c, { emissive: c, emissiveIntensity: .5 }), n); m.frustumCulled = false; S.add(m); return m; };
const pts = (a, c, s) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); const o = new THREE.Points(g, new THREE.PointsMaterial({ color: c, size: s })); o.frustumCulled = false; S.add(o); return o; };
const put = (m, k, x, y, z, a, b, c) => { tmp.position.set(x, y, z); tmp.scale.set(a, b, c); tmp.updateMatrix(); m.setMatrixAt(k, tmp.matrix); };
export default {
  title: 'Electric Current in Liquids', cam: { d: 17, e: .12, a: .18, t: V(0, 4.1, 0), ref: 1 },
  head: 'Current',
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Test', 'Plating'] },
    { k: 'q', l: '💧 Liquid', min: 1, max: 5, step: 1, v: 3, names: NAME, axis: true, w: P => P.m === 1 },
    { k: 'V', l: '🔋 Battery', min: 1.5, max: 9, step: 1.5, v: 4.5, u: 'V', axis: true }],
  toggles: [{ k: 'sw', l: '🔑 Close the key', v: true }],
  setup() {
    liq = box(10.8, 4, 2.2, 0x8fc1e3); liq.material = mat(0x8fc1e3, { transparent: true, opacity: .2, depthWrite: false }); liq.position.y = 2; liq.renderOrder = 3;     // glass tank: a faint front layer + a deeper back layer, so the plates stay bright
    liqB = box(10.8, 4, 2.2, 0x8fc1e3); liqB.material = mat(0x8fc1e3, { transparent: true, opacity: .45, side: THREE.BackSide, depthWrite: false }); liqB.position.y = 2; liqB.renderOrder = 1;
    const ed = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(10.8, 4, 2.2)), new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: .7 })); ed.position.y = 2; S.add(ed);
    rA = box(.5, 6.1, .5, STEEL); rB = box(.5, 6.1, .5, STEEL); rA.position.set(XL, 3.55, 0); rB.position.set(XR, 3.55, 0);                                         // test rods · in Plating the object (rB) widens to a flat steel plate
    pTop = box(PW, 2.6, .5, COPPER); pTop.position.set(XL, 5.3, 0); pCells = inst(new THREE.BoxGeometry(1, 1, 1), COPPER, NK);                                          // copper plate: solid top + tiles that shrink and fall away
    tiles = inst(new THREE.BoxGeometry(1, 1, 1), 0xe38a30, NK); bits = inst(new THREE.SphereGeometry(1, 8, 6), 0xff8a1f, 60, 1);                                          // copper tiles that grow on the object · copper bits on the move
    for (let k = 0; k < NK; k++) { pCells.setColorAt(k, new THREE.Color(COPPER).multiplyScalar(.8 + .35 * fr(k + 9))); tiles.setColorAt(k, new THREE.Color(0xe38a30).multiplyScalar(.85 + .3 * fr(k + 20))); }
    bub = pts(bp, 0xffffff, .3); dots = pts(dp, 0xfde047, .38);
    [[[-3.3, 9], [-3.8, 9], [-3.8, 6.6]], [[3.5, 9], [3.8, 9], [3.8, 6.6]], [[-1.1, 9], [-.5, 9]], [[1.7, 9], [2.3, 9]]].forEach(p => wire(p));
    box(1.8, .95, 1, 0x15803d).position.set(-2.2, 9, 0); box(.3, .96, 1.02, 0x4ade80).position.set(-2.2, 9, 0); box(.22, .42, .42, 0xef4444).position.set(-3.2, 9, 0); box(.22, .42, .42, 0x1e293b).position.set(-1.2, 9, 0);   // battery: + red cap, − dark cap
    box(2.8, .3, 1.1, 0x6b4423).position.set(.6, 8.45, 0); [-.5, 1.7].forEach(x => { sph(.26, 0xfacc15).position.set(x, 9, 0); box(.2, .5, .2, 0xfacc15).position.set(x, 8.75, 0); });   // key: wooden base, two posts, hinged lever
    blade = new THREE.Group(); blade.position.set(-.5, 9.05, 0); S.add(blade); const bl = box(2.2, .22, .5, 0xe2e8f0); bl.position.x = 1.1; blade.add(bl); const hd = box(.24, .75, .3, 0x1e293b); hd.position.set(1.8, .45, 0); blade.add(hd); const kn = sph(.3, 0xef4444); kn.position.set(1.8, .95, 0); blade.add(kn);
    bulb = sph(.6, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(2.9, 9, 0); box(.5, .3, .5, 0x64748b).position.set(2.9, 8.3, 0);
    halo = sph(1.1, 0xfff3b0); halo.material = new THREE.MeshBasicMaterial({ color: 0xffb300, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); halo.position.copy(bulb.position);
    lBat = label('Battery', '#86efac', .7); lBat.position.set(-2.2, 10.4, 0); label('Key', '#e2e8f0', .7).position.set(.6, 10.4, 0); label('Bulb', '#fde047', .7).position.set(2.9, 10.4, 0);
    lKs = label('', '#86efac', .7); lKs.position.set(.6, 7.7, 0); label('+', '#fca5a5', 1).position.set(-3.2, 8.2, 0); label('−', '#93c5fd', 1).position.set(-1.1, 8.2, 0);
    lq = label('', '#e2e8f0', .8); lq.position.set(0, -1.8, 0); lP = label('', '#fdba74', .7); lP.position.set(XL, -.9, 0); lO = label('', '#cbd5e1', .7); lO.position.set(XR, -.9, 0);
  },
  reset() { mg = 0; tm = 0; ph = 0; fp = 0; ang = 0; done = false; },
  step(dt, P) {
    const pl = P.m === 2, on = P.sw && P.V > 0, I = on ? (pl ? CU : COND[P.q - 1]) * P.V : 0, b = Math.min(1, I / 80), lv = pl ? 2 : LVL[P.q - 1];     // I in mA = battery volts × how well the liquid conducts
    P.I = I; P.lv = lv; P.on = on; P.bl = I < 1 ? 0 : b < .45 ? 1 : 2; if (!pl && P.q === 1) P.seenD = true;
    if (pl && on && !done) { mg = Math.min(MFULL, mg + .329 * I / 1000 * TS * dt); tm += TS / 60 * dt; if (mg >= MFULL) done = true; }                    // copper moved = 0.329 mg per coulomb
    P.mg = mg; P.tm = tm; P.f = mg / MFULL; P.done = done; const f = P.f; ph += dt * (.18 + .5 * I / 135); fp += dt * (1.5 + I / 25);
    liq.material.color.set(pl ? 0x2f6fdc : COL[P.q - 1]); liqB.material.color.copy(liq.material.color); rA.visible = !pl; pTop.visible = pCells.visible = pl; rB.scale.set(pl ? 1.1 : 1, 1, pl ? 4 : 1);
    tiles.visible = pl; rB.scale.set(pl ? PW / .5 : 1, 1, 1);
    for (let k = 0; k < NK; k++) { const r = k / CL | 0, c = k % CL, y = .5 + (r + .5) * RH, w = NZ[k] * (1 + .35 * (1 - r / (RW - 1))), sc = Math.max(.12, 1 - .62 * f * w);          // plate tiles shrink away (the bottom and edges go first)
      put(pCells, k, XL + (c - 1) * CW, y, 0, CW * .96 * sc, RH * .96 * sc, .5 * (1 - .45 * f * w)); px[k] = XL + (c - 1) * CW;
      const g = Math.max(0, Math.min(1, (f - .02 - .5 * NB[k]) / .35)), th = .05 + .1 * f * NB[k];                                                                       // copper tiles grow on the object, one after another
      put(tiles, k, XR + (c - 1) * CW, y, .25 + th / 2, CW * .98 * g, RH * .98 * g, th); }
    pCells.instanceMatrix.needsUpdate = tiles.instanceMatrix.needsUpdate = true;
    const nb = pl && on && !done ? 6 + Math.round(30 * I / 135) : 0;
    for (let i = 0; i < 60; i++) { if (i >= nb) { put(bits, i, 0, -99, 0, 1e-4, 1e-4, 1e-4); continue; }
      const k = i * 7 % NK, u = (ph + fr(i + 9)) % 1, y = .5 + ((k / CL | 0) + .5) * RH, s = .15 * (1 + 1 * (1 - u) ** 3) * (u > .9 ? (1 - u) / .1 : 1);   // a bit breaks off the plate, drifts across, sticks to the object
      put(bits, i, px[k] + (XR - PW / 2 + .3 - px[k]) * u, y + Math.sin(u * Math.PI) * (fr(i + 3) - .5) * .8 + Math.sin(ph * 5 + i) * .06, .5, s, s, s); }
    bits.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < 36; i++) { const bon = !pl && i < Math.round(36 * Math.min(1, I / 60)), side = i % 2 ? XR : XL, u = (ph * 2 + i * .137) % 1;                         // bubbles rise from both rods
      bp[i * 3] = side + Math.sin(i * 7 + ph * 9) * .35; bp[i * 3 + 1] = bon ? 1 + u * 2.8 : -99; bp[i * 3 + 2] = 0; }
    for (let i = 0; i < 28; i++) { const [x, y] = at(i / 28 * TL + fp); dp[i * 3] = x; dp[i * 3 + 1] = on ? y : -99; dp[i * 3 + 2] = 0; }                              // current dots run round the wires
    bub.geometry.attributes.position.needsUpdate = dots.geometry.attributes.position.needsUpdate = true;
    ang += ((P.sw ? 0 : .65) - ang) * Math.min(1, dt * 12); blade.rotation.z = ang;
    bulb.material.emissiveIntensity = b * 1.2; bulb.material.color.set(b > .02 ? 0xfff3b0 : 0x94a3b8); halo.material.opacity = b * .32;
    lBat.set(`Battery ${P.V} V`); lKs.set(P.sw ? 'closed' : 'open', P.sw ? '#86efac' : '#fca5a5'); lq.set(pl ? 'Copper sulphate solution' : NAME[P.q - 1]); lP.set(pl ? 'Copper plate (+)' : ''); lO.set(pl ? 'Object (−)' : '');
  },
  ro: { Current: P => P.I.toFixed(0) + ' mA', Bulb: P => BULB[P.bl], Time: P => P.m === 2 ? Math.round(P.tm) + ' min' : null, 'Plate loses': P => P.m === 2 ? P.mg.toFixed(1) + ' mg' : null, 'Object gains': P => P.m === 2 ? P.mg.toFixed(1) + ' mg' : null },
  status: P => !P.sw ? ['Key is open', false, 'warn'] : P.m === 2 ? (P.done ? ['Thick coat ✓', true] : ['Plating', true]) : P.lv === 2 ? ['Good conductor', true] : P.lv ? ['Weak conductor', false, 'warn'] : ['Poor conductor', false, 'warn'],
  note: P => !P.sw ? 'The key (switch) is open: the circuit is broken. No current. Close the key.'
    : P.m === 2 ? (P.done ? 'Thick coat! The plate lost as much copper as the object gained. Press Restart.' : `Copper leaves the plate and sticks to the object. At ${P.V} V plating is ${P.V < 4 ? 'slow' : P.V < 7 ? 'steady' : 'fast'}.`)
    : P.lv === 2 ? `${NAME[P.q - 1]} is a good conductor. The bulb glows and bubbles rise.` : P.lv ? `${NAME[P.q - 1]} conducts a little. A small current flows. The bulb glows dim.` : `${NAME[P.q - 1]} is a poor conductor. No current flows. The bulb stays off.`,
  try: [{ t: 'Try <b>Distilled water</b>, then <b>Salt water</b>. Which one lights the bulb?', check: P => P.seenD && P.m === 1 && P.q === 3 && P.on, yes: 'Yes! Salt water carries current.' },
    { t: 'Pick <b>Sugar water</b>. Does it carry current?', check: P => P.m === 1 && P.q === 5, yes: 'Yes! The bulb stays off.' },
    { t: 'Switch to <b>Plating</b>. Watch the plate wear away and the object get a copper coat.', check: P => P.m === 2 && P.f > .8, yes: 'Yes! Copper moved from the plate to the object.' },
    { t: 'Turn the key off (open it). What happens to the bulb and the copper?', check: P => !P.sw, yes: 'Yes! An open key breaks the circuit.' },
    { t: 'In <b>Plating</b>, press Restart and set the battery to <b>9 V</b>. Is the plating faster?', check: P => P.m === 2 && P.V === 9 && P.sw && P.f > .05, yes: 'Yes! More volts, faster plating.' }],
  key: ['A conductor lets current pass. Salt water and lemon juice are good ones.', 'Distilled water and sugar water are poor conductors.', 'Current flows only when the key (switch) is closed.', 'Electroplating coats an object with a thin layer of metal.', 'Copper plate to the + terminal, the object to the − terminal.', 'The plate loses as much copper as the object gains. More volts means faster plating.', 'It is used on taps, jewellery and car parts to stop rust.'],
  quiz: [{ q: 'Which liquid is a poor conductor?', o: ['Salt water', 'Distilled water', 'Lemon juice'], a: 1, why: 'Distilled water is very pure, so it cannot carry current well.' }, { q: 'What does electroplating do?', o: ['Puts a thin metal coat on an object', 'Makes water hot', 'Makes a magnet'], a: 0, why: 'Metal from the plate sticks to the object.' },
    { q: 'The key (switch) is open. What happens?', o: ['Plating goes faster', 'No current flows', 'The bulb glows brighter'], a: 1, why: 'An open key breaks the circuit.' }, { q: 'Battery voltage goes up. Plating becomes…', o: ['faster', 'slower', 'the same'], a: 0, why: 'More voltage drives more current, so more copper moves each minute.' }]
};
