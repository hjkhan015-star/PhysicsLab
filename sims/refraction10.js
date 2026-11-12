// Class 10 · Ch 10 Light — refraction, Snell's law, refractive index, total internal reflection.
import { V, D, box, beam, label } from '../scene.js';
const L = 8; let inc, ref, rfl, li, lr;
export default {
  title: "Refraction — Snell's Law & TIR", cam: { d: 17, e: .04, a: 0, t: V(0, 0, 0), ref: 1.3 },
  sliders: [{ k: 'd', l: 'Ray travels', min: 1, max: 2, step: 1, v: 1, names: ['Air → Glass', 'Glass → Air'] }, { k: 'i', l: 'Angle of incidence i', min: 0, max: 85, step: 1, v: 40, u: '°' }, { k: 'n', l: 'Refractive index n', min: 1, max: 2.4, step: .05, v: 1.5, u: '' }],
  setup() { const g = box(18, 5, 3, 0x38bdf8); g.material.transparent = true; g.material.opacity = .32; g.position.y = -2.5;
    label('AIR', '#cbd5e1', .8).position.set(-7, 4, 0); label('GLASS', '#7dd3fc', .8).position.set(-7, -4, 0); beam(0x94a3b8, .035).set(V(0, -5), V(0, 5)); label('normal', '#cbd5e1', .7).position.set(1.6, 5.2, 0);
    inc = beam(0xfde047, .1); ref = beam(0xf87171, .1); rfl = beam(0x64748b, .07); li = label('', '#fde047'); lr = label('', '#f87171'); },
  reset() {},
  step(dt, P) {
    const air = P.d === 1, n1 = air ? 1 : P.n, n2 = air ? P.n : 1, s = air ? 1 : -1, i = P.i * D, sr = n1 * Math.sin(i) / n2;
    P.tir = sr > 1; P.r = P.tir ? 0 : Math.asin(sr); P.crit = n1 > n2 ? Math.asin(n2 / n1) / D : 0;
    inc.set(V(-L * Math.sin(i), s * L * Math.cos(i)), V()); rfl.set(V(), V(L * Math.sin(i), s * L * Math.cos(i))); rfl.material.color.set(P.tir ? 0xffffff : 0x64748b); rfl.scale.x = rfl.scale.z = P.tir ? 1.6 : 1;
    ref.visible = !P.tir; lr.visible = !P.tir; if (!P.tir) ref.set(V(), V(L * Math.sin(P.r), -s * L * Math.cos(P.r)));
    li.position.set(-L * Math.sin(i) / 2 - 1.4, s * L * Math.cos(i) / 2 + .2 * s, 0); li.set(`i = ${P.i}°`);
    if (!P.tir) { lr.position.set(L * Math.sin(P.r) / 2 + 1.4, -s * L * Math.cos(P.r) / 2 - .2 * s, 0); lr.set(`r = ${(P.r / D).toFixed(1)}°`); }
  },
  ro: { 'Incident ∠i': P => P.i + '°', 'Refracted ∠r': P => P.tir ? 'none (TIR)' : (P.r / D).toFixed(1) + '°', 'Speed in glass': P => (3 / P.n).toFixed(2) + '×10⁸ m/s' },
  head: 'Refracted ∠r', status: P => P.tir ? ['Total internal reflection', true, 'crit'] : [P.d === 1 ? 'Towards normal' : 'Away from normal', true],
  note: P => P.tir ? `<b>Total internal reflection!</b> i = ${P.i}° is more than the critical angle <b>C = sin⁻¹(1/n) = ${P.crit.toFixed(1)}°</b>, so all the light reflects back into the glass (optical fibres, diamonds, mirages).`
    : (P.d === 1 ? `Air → glass: light slows down and <b>bends towards the normal</b> (r &lt; i). <b>n = sin i / sin r = ${P.r > 0 ? (Math.sin(P.i * D) / Math.sin(P.r)).toFixed(2) : P.n}</b> (= c / v).`
      : `Glass → air: light speeds up and <b>bends away from the normal</b> (r &gt; i). Critical angle here = <b>${P.crit.toFixed(1)}°</b>; go beyond it for TIR.`),
  try: ['Air → glass, i = 40°, n = 1.5. Find r and verify n = sin i / sin r.', 'Compare n = 1.33 (water) and n = 2.4 (diamond) at i = 60°. Which bends more?', 'Glass → air, n = 1.5: increase i until the red ray vanishes. Note the critical angle (≈ 41.8°).'],
  key: ['<b>Snell&rsquo;s law:</b> sin i/sin r = n = c/v (refractive index).', 'Rarer → denser: bends <b>towards</b> the normal. Denser → rarer: bends <b>away</b>.', 'TIR: denser → rarer and i &gt; critical angle C; sin C = 1/n.', 'Applications: apparent depth, twinkling, optical fibres, prism, rainbow.', 'Laws of refraction: (1) the incident ray, the refracted ray and the normal lie in one plane; (2) sin i / sin r is constant for a pair of media (Snell&rsquo;s law).'],
  quiz: [{ q: 'Light goes from air into glass. It bends…', o: ['away from the normal', 'towards the normal', 'not at all'], a: 1, why: 'Entering a denser medium it slows down and bends towards the normal.' }, { q: 'Total internal reflection needs light going…', o: ['rarer → denser', 'denser → rarer with i > critical angle', 'along the normal'], a: 1, why: 'Both conditions must be true.' }, { q: 'n = 1.5 for glass. Speed of light in it is…', o: ['3 × 10⁸ m/s', '2 × 10⁸ m/s', '4.5 × 10⁸ m/s'], a: 1, why: 'v = c / n = 3 × 10⁸ / 1.5.' }]
};
