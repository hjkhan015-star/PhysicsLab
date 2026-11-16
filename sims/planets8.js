// Class 8 · Ch 17 Stars and the Solar System — the eight planets going round the Sun: inner and outer planets, year lengths, who is faster.
// NOT TO SCALE: planets are drawn far too big, and in the "All" view the orbits are squeezed to fit. Inner / Outer views show the distances in true proportion (planet sizes still not to scale).
import { S, V, THREE, label, view } from '../scene.js';
import { litMat } from '../earth.js';
const PL = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'], ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const PC = [0x9ca3af, 0xfcd34d, 0x3b82f6, 0xef4444, 0xd9a066, 0xf5deb3, 0x67e8f9, 0x4f6bff], PS = [.22, .32, .34, .28, .75, .65, .45, .45];
const AU = [.39, .72, 1, 1.52, 5.2, 9.54, 19.2, 30.1], YR = [.241, .615, 1, 1.88, 11.86, 29.46, 84.0, 164.8], MKM = [58, 108, 150, 228, 779, 1434, 2873, 4495], KMS = [47.4, 35, 29.8, 24.1, 13.1, 9.7, 6.8, 5.4];   // AU · years · million km · km/s
const YL = ['88 days', '225 days', '365 days (1 year)', '687 days (1.9 years)', '11.9 years', '29.5 years', '84 years', '165 years'];
const FACT = ['Smallest planet, closest to the Sun. Hot by day, freezing at night.', 'Hottest planet: thick clouds trap heat. Brightest “star” in the evening.', 'Our home: water, air and life. The only planet known with life.', 'The red planet: its dust is rusty iron. It has two tiny moons.', 'The biggest planet, a ball of gas, with a giant storm, the Great Red Spot.', 'Bright rings of ice and rock. A gas giant lighter than water.', 'Pale blue-green ice giant that spins on its side.', 'Farthest planet: dark blue, cold and very windy.'];
const R_ALL = [1.9, 2.8, 3.7, 4.7, 6.4, 7.8, 9.1, 10.2], R_IN = AU.map(a => a * 5.6), R_OUT = AU.map(a => a * .3), RATE = [[0, .25, 1.2], [0, .12, .5], [0, 1.5, 6]];
const VIEW = [{ r: R_ALL, sun: .75, k: 1 }, { r: R_IN, sun: 1.1, k: 1.35 }, { r: R_OUT, sun: .5, k: .9 }];
const NDOT = 96; let lastLay, sun, halo, pls, nm, orbs, belt, ring, ang, T, lastView, lbl, ns, bl, pointer;
export default {
  title: 'The Planets', cam: { d: 17, e: 1.3, a: 0, t: V(0, 0, 0), ref: 1.55 },
  head: 'Planet', tabs: [['stars8', 'Earth'], ['eclipse8', 'Eclipses'], ['planets8', 'Planets']],
  sliders: [{ k: 'v', l: '🔭 View', min: 1, max: 3, step: 1, v: 1, names: ['All', 'Inner', 'Outer'] },
    { k: 't', l: '⏱ Time', min: 1, max: 3, step: 1, v: 2, names: ['Stop', 'Slow', 'Fast'] },
    { k: 'p', l: '🪐 Planet', min: 1, max: 9, step: 1, v: 1, names: ['None', ...PL], axis: true }],
  setup() {
    sun = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), new THREE.MeshBasicMaterial({ color: 0xfbbf24 })); halo = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 16), new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: .25, depthWrite: false, blending: THREE.AdditiveBlending })); S.add(sun, halo);
    pls = PL.map((n, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 16), litMat({ color: PC[i], ambient: .22, soft: .1 })); S.add(m); return m; });
    ring = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.7, 40), new THREE.MeshBasicMaterial({ color: 0xe9d8a6, side: THREE.DoubleSide, transparent: true, opacity: .5 })); ring.rotation.x = -Math.PI / 2 + .5; pls[5].add(ring);
    orbs = new THREE.InstancedMesh(new THREE.SphereGeometry(.045, 5, 4), new THREE.MeshBasicMaterial({ color: 0x94a3b8 }), 8 * NDOT); orbs.frustumCulled = false; S.add(orbs);
    belt = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 5, 4), new THREE.MeshBasicMaterial({ color: 0x78716c }), 140); belt.frustumCulled = false; S.add(belt); const M = new THREE.Matrix4(); for (let i = 0; i < 140; i++) { const a = i * 2.399, r = 5.45 + ((i * 37) % 11) / 11 * .5; M.setPosition(r * Math.cos(a), 0, r * Math.sin(a)); belt.setMatrixAt(i, M); }
    nm = PL.map(n => label(n, '#cbd5e1', .75)); lbl = label('Sun', '#fde047', .85); ns = label('Sizes not to scale', '#fbbf24', .75); bl = label('Asteroid belt', '#a8a29e', .65); pointer = label('You are on Earth', '#93c5fd', .6);
  },
  reset() { ang = PL.map((_, i) => 4.2 + i * 2.1); T = 0; lastView = 0; lastLay = ''; },
  step(dt, P) {
    const W = VIEW[P.v - 1], lay = document.documentElement.dataset.mode; if (lastView !== P.v || lastLay !== lay) { lastLay = lay; lastView = P.v; const M = new THREE.Matrix4(); for (let i = 0; i < 8; i++) for (let j = 0; j < NDOT; j++) { const a = j / NDOT * 6.2832; M.setPosition(W.r[i] * Math.cos(a), 0, W.r[i] * Math.sin(a)); orbs.setMatrixAt(i * NDOT + j, M); } orbs.instanceMatrix.needsUpdate = true; view.set(lay === 'landscape' ? { d: 24, e: 1.3, a: 0, t: V(0, 0, 1.8), ref: 1.1 } : { d: 17, e: 1.3, a: 0, t: V(0, 0, 0), ref: [1.55, 1.3, 1.4][P.v - 1] }); }
    const rate = RATE[P.v - 1][P.t - 1]; T += dt * rate; P.T = T; sun.scale.setScalar(W.sun); halo.scale.setScalar(W.sun); belt.visible = P.v === 1; bl.visible = P.v === 1; bl.position.set(-5.8, 0, -1.4);
    const sel = P.p - 2; P.sel = sel;
    pls.forEach((m, i) => { const out = P.v === 2 && i > 3 || P.v === 3 && i < 4; m.visible = nm[i].visible = !out;
      ang[i] += dt * rate * 6.2832 / YR[i]; const r = W.r[i]; m.position.set(r * Math.cos(ang[i]), 0, r * Math.sin(ang[i])); const on = i === sel, sc = PS[i] * W.k * (on ? 1.45 : 1); m.scale.setScalar(sc); m.material.uniforms.sun.value.set(-m.position.x, 0, -m.position.z).normalize();
      nm[i].position.set(m.position.x, .35 + sc * 1.3, m.position.z - .3); nm[i].set(PL[i], on ? '#fde047' : '#cbd5e1'); });
    ring.scale.setScalar(1);
    P.orb = ang; lbl.position.set(0, W.sun + .5, 1.3); ns.visible = true; ns.set(P.v === 1 ? 'Sizes and distances not to scale' : P.v === 2 ? 'Planet sizes not to scale' : 'Planet sizes not to scale'); ns.position.set(0, 0, [8.9, 7.4, 8.6][P.v - 1]);
    pointer.visible = false; pls.forEach(m => m.visible && null);
  },
  ro: { Planet: P => P.sel >= 0 ? PL[P.sel] : 'All eight', 'Order': P => P.sel >= 0 ? ORD[P.sel] + ' from the Sun' : null, 'Kind': P => P.sel >= 0 ? (P.sel < 4 ? 'Inner planet' : 'Outer planet') : null,
    'From the Sun': P => P.sel >= 0 ? MKM[P.sel].toLocaleString() + ' million km' : null, 'One year': P => P.sel >= 0 ? YL[P.sel] : null, 'Speed in orbit': P => P.sel >= 0 ? KMS[P.sel] + ' km/s' : null, 'Time passed': P => (P.T < 10 ? P.T.toFixed(1) : Math.round(P.T)) + ' Earth years' },
  status: P => P.t === 1 ? ['Stopped', false, 'warn'] : ['Moving', true],
  note: P => P.sel >= 0 ? `<b>${PL[P.sel]}</b> (${P.sel < 4 ? 'inner' : 'outer'} planet): ${FACT[P.sel]}` : 'Eight planets go round the Sun. <b>Inner</b> planets are small and rocky; <b>outer</b> planets are giants.',
  try: [{ t: 'Pick <b>Earth</b>. Which two planets are closer to the Sun?', check: P => P.p === 4, yes: 'Yes! Mercury and Venus.' },
    { t: 'Set <b>Time</b> to <b>Fast</b>. Which planet goes round the Sun fastest?', check: P => P.t === 3, yes: 'Mercury, the closest planet, is the fastest!' },
    { t: 'Switch <b>View</b> to <b>Outer</b>. Pick <b>Neptune</b>. How long is its year?', check: P => P.v === 3 && P.p === 9, yes: 'Yes! 165 Earth years for one trip round the Sun.' },
    { t: 'Switch <b>View</b> to <b>Inner</b>. Which planet is the farthest of the four?', check: P => P.v === 2 && P.p === 5, yes: 'Yes! Mars is the 4th planet.' }],
  key: ['Planets in order from the Sun: <b>Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</b>.', 'The <b>inner</b> planets (Mercury to Mars) are small and rocky. The <b>outer</b> planets (Jupiter to Neptune) are huge and made mostly of gas and ice.', 'The nearer a planet is to the Sun, the faster it goes and the shorter its year.', 'Between Mars and Jupiter is a belt of rocks called the <b>asteroid belt</b>.', 'The picture is <b>not to scale</b>: real planets are tiny compared with their distances.'],
  quiz: [{ q: 'Which planet is closest to the Sun?', o: ['Earth', 'Mercury', 'Jupiter'], a: 1, why: 'Mercury is the 1st planet.' }, { q: 'Which is an outer planet?', o: ['Mars', 'Venus', 'Saturn'], a: 2, why: 'Jupiter, Saturn, Uranus and Neptune are the outer planets.' },
    { q: 'Which planet takes the longest to go round the Sun?', o: ['Mercury', 'Earth', 'Neptune'], a: 2, why: 'Neptune is farthest and slowest: about 165 years.' }]
};
