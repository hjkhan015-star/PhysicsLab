// Class 8 · Ch 14 Chemical Effects of Electric Current — does the liquid carry current? Then: copper plating.
import { S, V, box, sph, mat, THREE, wire, label } from '../scene.js';
const NAME = ['Distilled water', 'Tap water', 'Salt water', 'Lemon juice', 'Sugar water'], LVL = [0, 1, 2, 2, 0];   // 0 poor · 1 weak · 2 good
const COL = [0xbfe3f5, 0xa9d6ea, 0x8fc1e3, 0xf2e26a, 0xe9e2c8], BULB = ['Off', 'Dim', 'Bright'], LAYER = ['None', 'Thin', 'Thick'];
const STEEL = new THREE.Color(0x94a3b8), COPPER = new THREE.Color(0xd9822b);
let liq, r1, r2, bulb, bub, cu, lq, lb, lp, lk, ph;
const bp = new Float32Array(36 * 3), cp = new Float32Array(24 * 3);
export default {
  title: 'Electric Current in Liquids', cam: { d: 17.5, e: .1, a: 0, t: V(0, 4.4, 0), ref: 1 },
  head: 'Bulb',
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Test', 'Plating'] },
    { k: 'q', l: '💧 Liquid', min: 1, max: 5, step: 1, v: 3, names: NAME, axis: true, w: P => P.m === 1 },
    { k: 'T', l: '⏱ Time', min: 1, max: 5, step: 1, v: 1, names: ['Start', 'Short', 'Medium', 'Long', 'Very long'], axis: true, w: P => P.m === 2 }],
  setup() {
    liq = box(8, 4, 3.2, 0x8fc1e3); liq.material = mat(0x8fc1e3, { transparent: true, opacity: .7 }); liq.position.y = 2;
    r1 = box(.5, 5.5, .5, 0x94a3b8); r2 = box(.5, 5.5, .5, 0x94a3b8); r1.position.set(-2.6, 3.75, 0); r2.position.set(2.6, 3.75, 0);
    box(1.6, 1.2, 1, 0x22c55e).position.set(1.3, 9, 0); wire([[-2.6, 6.5], [-2.6, 9], [2.6, 9], [2.6, 6.5]]);
    bulb = sph(.7, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(-1.1, 9, 0);
    const pt = (a, c, s) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); const o = new THREE.Points(g, new THREE.PointsMaterial({ color: c, size: s })); S.add(o); return [o, g]; };
    [bub] = pt(bp, 0xffffff, .3); [cu] = pt(cp, 0xd9822b, .35);
    label('Bulb', '#fde047', .7).position.set(-1.1, 10.3, 0); label('Battery', '#86efac', .7).position.set(1.3, 10.3, 0);
    lq = label('', '#e2e8f0', .9); lq.position.set(0, -1, 0); lp = label('Copper plate', '#fdba74', .7); lk = label('Key', '#e2e8f0', .7); lb = lp;
  },
  reset() { ph = 0; },
  step(dt, P) {
    const plate = P.m === 2, lv = plate ? 2 : LVL[P.q - 1], layer = plate ? (P.T < 2 ? 0 : P.T < 4 ? 1 : 2) : -1; P.lv = lv; P.layer = layer; ph += dt; if (!plate && P.q === 1) P.seenD = true;
    liq.material.color.set(plate ? 0x2f6fdc : COL[P.q - 1]); bulb.material.emissiveIntensity = lv * .5; bulb.material.color.set(lv ? 0xfff3b0 : 0x94a3b8);
    r1.scale.set(plate ? 3 - (P.T - 1) * .3 : 1, 1, 1); r1.material.color.set(plate ? 0xb45309 : 0x94a3b8); r2.scale.x = plate ? 2 : 1;
    r2.material.color.copy(STEEL).lerp(COPPER, plate ? layer / 2 * .5 + (P.T - 1) / 8 : 0);
    for (let i = 0; i < 36; i++) { const on = !plate && i < lv * 12, side = i % 2 ? 2.6 : -2.6, u = (ph * .6 + i * .137) % 1;       // bubbles rise from both rods
      bp[i * 3] = side + Math.sin(i * 7 + ph * 3) * .35; bp[i * 3 + 1] = on ? 1.2 + u * 2.6 : -99; bp[i * 3 + 2] = 0; }
    for (let i = 0; i < 24; i++) { const u = (ph * .35 + i / 24) % 1, on = plate && P.T > 1;                                    // copper travels plate → key
      cp[i * 3] = -1.6 + u * 3.6; cp[i * 3 + 1] = on ? 2.4 + Math.sin(u * Math.PI) * 1.2 + Math.sin(i * 5) * .3 : -99; cp[i * 3 + 2] = Math.sin(i * 3) * .8; }
    bub.geometry.attributes.position.needsUpdate = cu.geometry.attributes.position.needsUpdate = true;
    lq.set(plate ? 'Blue copper liquid' : NAME[P.q - 1]); lp.position.set(-2.6, 7.3, 0); lp.set(plate ? 'Copper plate' : ''); lk.position.set(2.6, 7.3, 0); lk.set(plate ? 'Key' : '');
  },
  ro: { Bulb: P => BULB[P.lv], 'Copper layer': P => P.m === 2 ? LAYER[P.layer] : null },
  status: P => P.m === 2 ? (P.layer ? ['Plating', true] : ['Ready', false, 'warn']) : P.lv === 2 ? ['Good conductor', true] : P.lv ? ['Weak conductor', false, 'warn'] : ['Poor conductor', false, 'warn'],
  note: P => P.m === 2 ? (P.T < 2 ? 'The key is bare steel. Raise Time to coat it with copper.' : 'Copper leaves the plate and sticks to the key. The coat gets thicker with time.')
    : P.lv === 2 ? `${NAME[P.q - 1]} is a good conductor. The bulb glows bright and many bubbles rise.` : P.lv ? `${NAME[P.q - 1]} conducts a little. The bulb glows dim and a few bubbles rise.` : `${NAME[P.q - 1]} is a poor conductor. The bulb stays off and no bubbles form.`,
  try: [{ t: 'Try <b>Distilled water</b>, then <b>Salt water</b>. Which one lights the bulb?', check: P => P.seenD && P.m === 1 && P.q === 3, yes: 'Yes! Salt water carries current.' },
    { t: 'Pick <b>Sugar water</b>. Does it carry current?', check: P => P.m === 1 && P.q === 5, yes: 'Yes! The bulb stays off.' },
    { t: 'Switch to <b>Plating</b> and raise <b>Time</b>. Watch the key change.', check: P => P.m === 2 && P.layer === 2, yes: 'Yes! The key gets a thick copper coat.' }],
  key: ['A conductor lets current pass. Salt water and lemon juice are good ones.', 'Distilled water and sugar water are poor conductors.', 'Electroplating coats an object with a thin layer of metal.', 'It is used on taps, jewellery and car parts to stop rust.'],
  quiz: [{ q: 'Which liquid is a poor conductor?', o: ['Salt water', 'Distilled water', 'Lemon juice'], a: 1, why: 'Distilled water is very pure, so it cannot carry current well.' }, { q: 'What does electroplating do?', o: ['Puts a thin metal coat on an object', 'Makes water hot', 'Makes a magnet'], a: 0, why: 'Metal from the plate sticks to the object.' }]
};
