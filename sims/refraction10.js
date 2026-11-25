// Class 10 · Ch 10 Light — refraction at one boundary or through three layers: Snell's law, refractive index, total internal reflection.
// Every ray has an arrow. A dotted line shows where the ray would go if it did NOT bend. The reflected ray appears only for total internal reflection.
import { S, V, D, box, beam, label, THREE } from '../scene.js';
const XM = 9, YM = 5.2, MED = [['WATER', 1.33, 0x22d3ee, '#67e8f9'], ['GLASS', 1.5, 0x60a5fa, '#93c5fd'], ['DIAMOND', 2.42, 0xc4b5fd, '#ddd6fe'], ['MEDIUM', 0, 0x60a5fa, '#93c5fd']];
const CI = 0xfde047, CR = 0xf87171, CR2 = 0xf0abfc;
let bx, bd, nr, bm, hd, dt, la, lm, ln;
const dotted = col => { const bs = Array.from({ length: 24 }, () => beam(col, .045));            // a dotted line made of short dashes
  return { set(a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, n = Math.min(24, Math.floor(len / .5));
    bs.forEach((s, k) => { s.visible = k < n; if (k < n) { const t0 = k * .5 / len, t1 = Math.min(1, (k * .5 + .28) / len); s.set(V(a[0] + dx * t0, a[1] + dy * t0), V(a[0] + dx * t1, a[1] + dy * t1)); } }); }, hide() { bs.forEach(s => s.visible = false); } }; };
const clip = (a, b) => b[0] > XM ? [XM, a[1] + (b[1] - a[1]) * (XM - a[0]) / (b[0] - a[0])] : b;     // keep rays inside the picture
function layers(P) {
  const m = MED[P.mp - 1], mn = P.mp === 4 ? P.n : m[1], air = { n: 1, nm: 'AIR', c: 0, t: '#cbd5e1' };
  if (!P.m3) return { Ls: [air, { n: mn, nm: m[0], c: m[2], t: m[3] }], Hs: [0] };
  const b = P.mp === 1 ? MED[1] : m, bn = P.mp === 1 ? 1.5 : mn;                                        // three layers: air | water | chosen medium (glass if water was chosen)
  return { Ls: [air, { n: 1.33, nm: 'WATER', c: MED[0][2], t: MED[0][3] }, { n: bn, nm: b[0], c: b[2], t: b[3] }], Hs: [1.5, -1.5] };
}
function trace(P) {                                                                                       // follows the ray boundary by boundary (Snell's law at each)
  const { Ls, Hs } = layers(P), up = !!P.up, T = up ? Ls.slice().reverse() : Ls, HT = up ? Hs.slice().reverse() : Hs, sg = up ? 1 : -1, i0 = P.i * D;
  const segs = [], dots = [], hits = [], ths = [i0]; let x = 0, tir = -1;
  const Lc = Math.min(7, (up ? HT[0] + YM : YM - HT[0]) / Math.cos(i0));
  segs.push({ a: [-Lc * Math.sin(i0), HT[0] - sg * Lc * Math.cos(i0)], b: [0, HT[0]], c: CI });
  for (let k = 0; k < HT.length; k++) {
    const y = HT[k], th = ths[k], s2 = T[k].n * Math.sin(th) / T[k + 1].n; hits.push([x, y]);
    if (s2 > 1) { tir = k; const room = k ? Math.abs(HT[k - 1] - y) : (up ? y + YM : YM - y), L = Math.min(7, room / Math.cos(th));
      segs.push({ a: [x, y], b: clip([x, y], [x + L * Math.sin(th), y - sg * L * Math.cos(th)]), c: 0xffffff, thick: true }); break; }
    const t2 = Math.asin(s2); ths.push(t2);
    if (k + 1 < HT.length) { const dy = Math.abs(HT[k + 1] - y), x2 = x + dy * Math.tan(t2), c = k ? CR2 : CR;
      segs.push({ a: [x, y], b: clip([x, y], [x2, HT[k + 1]]), c }); dots.push({ a: [x, y], b: clip([x, y], [x + dy * Math.tan(th), HT[k + 1]]) }); x = x2; }
    else { const room = up ? YM - y : y + YM, L = Math.min(7, room / Math.cos(t2)), L0 = Math.min(7, room / Math.cos(th)), c = k ? CR2 : CR;
      segs.push({ a: [x, y], b: clip([x, y], [x + L * Math.sin(t2), y + sg * L * Math.cos(t2)]), c }); dots.push({ a: [x, y], b: clip([x, y], [x + L0 * Math.sin(th), y + sg * L0 * Math.cos(th)]) }); }
  }
  return { segs, dots, hits, ths, tir, T, Hs, Ls };
}
export default {
  title: "Refraction — Snell's Law & TIR", cam: { d: 17, e: .04, a: 0, t: V(0, 0, 0), ref: 1.3 },
  sliders: [{ k: 'mp', l: 'Medium', min: 1, max: 4, step: 1, v: 2, names: ['Water', 'Glass', 'Diamond', 'Own n'] },
    { k: 'i', l: 'Angle of incidence i', min: 0, max: 85, step: 1, v: 40, u: '°' }, { k: 'n', l: 'Refractive index n', min: 1, max: 2.4, step: .05, v: 1.5, u: '', w: P => P.mp === 4 }],
  toggles: [{ k: 'm3', l: 'Three layers (air | water | medium)', v: false }, { k: 'up', l: 'Ray goes up (denser → rarer)', v: false }],
  setup() {
    bx = [0, 1].map(() => { const b = box(1, 1, 3, 0x38bdf8); b.material.transparent = true; b.material.opacity = .3; return b; });
    bd = [0, 1].map(() => beam(0xe2e8f0, .03)); nr = [0, 1].map(() => beam(0x94a3b8, .035));
    bm = Array.from({ length: 4 }, () => beam(CI, .1)); dt = [dotted(0xcbd5e1), dotted(0xcbd5e1)];
    hd = bm.map(() => { const h = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 12), new THREE.MeshBasicMaterial({ color: CI })); h.renderOrder = 5; S.add(h); return h; });          // arrowheads
    la = [0, 1, 2].map(() => label('', '#fde047', .9)); lm = [0, 1, 2].map(() => label('', '#cbd5e1', .8)); ln = label('normal', '#cbd5e1', .7);
  },
  reset() {},
  step(dt_, P) {
    const R = trace(P); P.R = R; const { Ls, Hs, segs } = R, three = P.m3, last = R.ths.length - 1;
    P.tir = R.tir >= 0; P.r = P.tir ? 0 : R.ths[last]; P.nb = Ls[Ls.length - 1].n; P.crit = P.tir ? Math.asin(R.T[R.tir + 1].n / R.T[R.tir].n) / D : 0;
    // layers (translucent blocks), boundaries and names
    const blocks = three ? [[0, 3, Ls[1].c], [-3.35, 3.7, Ls[2].c]] : [[-YM / 2, YM, Ls[1].c]];
    bx.forEach((b, k) => { b.visible = k < blocks.length; if (b.visible) { b.position.set(0, blocks[k][0], 0); b.scale.set(2 * XM, blocks[k][1], 1); b.material.color.set(blocks[k][2]); } });
    bd.forEach((b, k) => { b.visible = k < Hs.length; if (b.visible) b.set(V(-XM, Hs[k]), V(XM, Hs[k])); });
    const ly = three ? [3.9, 0, -3.4] : [3.9, -2.6, 0]; lm.forEach((l, k) => { l.visible = k < Ls.length; if (l.visible) { l.position.set(-7.1, ly[k], 0); l.set(`${Ls[k].nm}  n = ${Ls[k].n.toFixed(2)}`, Ls[k].t); } });
    // rays, arrowheads, dotted extensions, normals
    bm.forEach((b, k) => { const s = segs[k]; b.visible = hd[k].visible = !!s; if (!s) return; b.set(V(...s.a), V(...s.b)); b.material.color.set(s.c); b.scale.x = b.scale.z = s.thick ? 1.6 : 1;
      const dx = s.b[0] - s.a[0], dy = s.b[1] - s.a[1], f = k ? .5 : .62; hd[k].position.set(s.a[0] + dx * f, s.a[1] + dy * f, .1); hd[k].rotation.z = Math.atan2(dy, dx) - Math.PI / 2; hd[k].material.color.set(s.c); });
    dt.forEach((d, k) => R.dots[k] ? d.set(R.dots[k].a, R.dots[k].b) : d.hide());
    nr.forEach((n, k) => { const h = R.hits[k]; n.visible = !!h; if (h) n.set(V(h[0], Math.max(-YM, h[1] - 2.6)), V(h[0], Math.min(YM, h[1] + 2.6))); });
    ln.position.set(R.hits[0][0] + 1.1, Math.min(YM - .2, R.hits[0][1] + 2.8), 0);
    // angle labels
    const names = three ? ['i', 'r₁', 'r₂'] : ['i', 'r'];
    la.forEach((l, k) => { const s = segs[k]; l.visible = !!s && (k <= last); if (!l.visible) { if (k === 1 && P.tir && s) { l.visible = true; l.set('reflected', '#ffffff'); l.position.set((s.a[0] + s.b[0]) / 2 + 1.3, (s.a[1] + s.b[1]) / 2, 0); } return; }
      l.position.set((s.a[0] + s.b[0]) / 2 + (k ? 2 : -2.2), (s.a[1] + s.b[1]) / 2 + .1, 0); l.set(`${names[k]} = ${(R.ths[k] / D).toFixed(1)}°`, k === 0 ? '#fde047' : k === 1 ? '#fca5a5' : '#f5d0fe'); });
  },
  ro: { 'Incident ∠i': P => P.i + '°', 'Refracted ∠r': P => P.tir ? 'none (TIR)' : (P.r / D).toFixed(1) + '°', 'n × sin θ': P => (P.R.T[0].n * Math.sin(P.i * D)).toFixed(3), 'Speed in medium': P => (3 / P.nb).toFixed(2) + '×10⁸ m/s', 'Speed in water': P => P.m3 ? (3 / 1.33).toFixed(2) + '×10⁸ m/s' : null },
  head: 'Refracted ∠r', status: P => P.tir ? ['Total internal reflection', true, 'crit'] : P.m3 ? ['Bends at every boundary', true] : [P.up ? 'Away from normal' : 'Towards normal', true],
  note: P => { const R = P.R, dg = a => (a / D).toFixed(1) + '°';
    if (P.tir) { const a = R.T[R.tir], b = R.T[R.tir + 1]; return `<b>Total internal reflection!</b> From ${a.nm.toLowerCase()} (n = ${a.n.toFixed(2)}) to ${b.nm.toLowerCase()} (n = ${b.n.toFixed(2)}): the angle ${dg(R.ths[R.tir])} is more than the critical angle <b>C = sin⁻¹(n₂/n₁) = ${P.crit.toFixed(1)}°</b>, so all the light reflects back (optical fibres, diamonds, mirages).`; }
    if (P.m3) return `<b>Three layers:</b> at each boundary n₁ sin θ₁ = n₂ sin θ₂, so <b>n × sin θ is the same in every layer</b> = ${(R.T[0].n * Math.sin(R.ths[0])).toFixed(3)}. Angles: ${R.ths.map(dg).join(' → ')}.`;
    return P.up ? `Glass → air: light speeds up and <b>bends away from the normal</b> (r &gt; i). Critical angle here = <b>${(Math.asin(1 / P.nb) / D).toFixed(1)}°</b>; go beyond it for TIR. The dotted line is the path without bending.`
      : `Air → medium: light slows down and <b>bends towards the normal</b> (r &lt; i). <b>n = sin i / sin r = ${P.r > 0 ? (Math.sin(P.i * D) / Math.sin(P.r)).toFixed(2) : P.nb.toFixed(2)}</b> (= c / v). The dotted line is the path without bending.`; },
  try: [{ t: 'Water, i = 40°. Find r. Then pick Glass and Diamond. Which bends the ray most?' }, { t: 'Switch to <b>Three layers</b>. Does the ray bend at both boundaries? What stays the same in every layer?', check: P => P.m3, yes: 'n × sin θ stays the same.' },
    { t: 'Glass, switch on <b>Ray goes up</b>. Raise i until the ray stays inside. Note the critical angle (≈ 41.8°).', check: P => P.tir && P.mp === 2 && !P.m3, yes: 'Total internal reflection!' }, { t: 'Look at the <b>dotted line</b>. How far does the ray bend away from it?' }],
  key: ['<b>Snell&rsquo;s law:</b> sin i/sin r = n = c/v (refractive index). With layers: n₁ sin θ₁ = n₂ sin θ₂ = n₃ sin θ₃.', 'Rarer → denser: bends <b>towards</b> the normal. Denser → rarer: bends <b>away</b>.', 'The <b>dotted line</b> is the path the ray would take without bending.', 'TIR: denser → rarer and i &gt; critical angle C; sin C = 1/n.', 'Applications: apparent depth, twinkling, optical fibres, prism, rainbow.', 'Laws of refraction: (1) the incident ray, the refracted ray and the normal lie in one plane; (2) sin i / sin r is constant for a pair of media (Snell&rsquo;s law).'],
  quiz: [{ q: 'Light goes from air into glass. It bends…', o: ['away from the normal', 'towards the normal', 'not at all'], a: 1, why: 'Entering a denser medium it slows down and bends towards the normal.' }, { q: 'Total internal reflection needs light going…', o: ['rarer → denser', 'denser → rarer with i > critical angle', 'along the normal'], a: 1, why: 'Both conditions must be true.' }, { q: 'n = 1.5 for glass. Speed of light in it is…', o: ['3 × 10⁸ m/s', '2 × 10⁸ m/s', '4.5 × 10⁸ m/s'], a: 1, why: 'v = c / n = 3 × 10⁸ / 1.5.' },
    { q: 'A ray goes air → water → glass. The value of n × sin θ is…', o: ['the same in all three layers', 'largest in the glass', 'zero in the air'], a: 0, why: 'Snell’s law at each boundary keeps n × sin θ unchanged.' }]
};
