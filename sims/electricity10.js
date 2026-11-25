// Class 10 · Ch 12 Electricity — Ohm's law, resistors in series / parallel, heating effect. Charge dots flow along every branch (faster through the smaller resistor).
import { S, V, mat, beam, sph, THREE, label } from '../scene.js';
const BC = [0x111111, 0x7c3f00, 0xdc2626, 0xf97316, 0xfacc15, 0x16a34a, 0x2563eb, 0x7c3aed, 0x6b7280, 0xf8fafc];      // resistor colour code 0–9
const FULL = [[-6, -3], [6, -3], [6, 3], [-6, 3], [-6, -3]], MAIN = [[-4, 3], [-6, 3], [-6, -3], [6, -3], [6, 3], [4, 3]], B1 = [[4, 3], [-4, 3]], B2 = [[4, 3], [4, 5], [-4, 5], [-4, 3]];   // parallel: MAIN splits at (4,3), joins again at (-4,3)
const len = p => p.reduce((s, q, i) => i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0, 0);
function along(p, u) { let i = 1; for (; i < p.length - 1; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (u <= d) break; u -= d; } const a = p[i - 1], b = p[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, t = Math.min(1, u / d); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
const wire = pts => pts.slice(1).map((p, i) => beam(0x94a3b8, .05).set(V(...pts[i], 0), V(...p, 0)));
function resistor() { const g = new THREE.Group(), body = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, 1, 20), mat(0xe2c9a0, { emissive: 0xff3300, emissiveIntensity: 0 })); body.rotation.z = Math.PI / 2; g.add(body);
  g.bands = [0, 1, 2, 3].map(() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.435, .435, .12, 20), new THREE.MeshBasicMaterial({ color: 0 })); m.rotation.z = Math.PI / 2; g.add(m); return m; }); g.body = body; S.add(g); return g; }
function setR(g, R, color) { const L = .9 + .05 * R; g.body.scale.y = L; [-.3, -.12, .06, .34].forEach((f, i) => g.bands[i].position.x = f * L);
  const d = R < 10 ? [R, 0, 0xc0c0c0] : [Math.floor(R / 10), R % 10, 0x111111], c = [BC[d[0]], BC[d[1]], d[2], 0xd4a017]; g.bands.forEach((b, i) => b.material.color.set(c[i])); }    // 4-band colour code: digit, digit, ×, tolerance
let r1, r2, br, jn, dots, dp, ph, lb, l1, l2, li, li1, li2;
export default {
  title: "Electricity — Ohm's Law", tabs: [['electricity10', 'Ohm’s law'], ['water10', 'Water analogy']], cam: { d: 19, t: V(0, .5, 0), e: .1, a: 0, ref: 1.3 }, head: 'Current I',
  sliders: [{ k: 'c', l: 'Circuit', min: 1, max: 3, step: 1, v: 1, names: ['Single R₁', 'R₁ + R₂ in series', 'R₁ ‖ R₂ in parallel'] },
    { k: 'V', l: 'Battery voltage V', min: 1, max: 12, step: 1, v: 6, u: 'V' }, { k: 'R1', l: 'Resistance R₁', min: 1, max: 20, step: 1, v: 6, u: 'Ω' }, { k: 'R2', l: 'Resistance R₂', min: 1, max: 20, step: 1, v: 3, u: 'Ω', w: P => P.c > 1 }],
  setup() {
    wire(FULL); br = wire([[-4, 3], [-4, 5], [4, 5], [4, 3]]); jn = [sph(.16, 0xf8fafc), sph(.16, 0xf8fafc)]; jn[0].position.set(4, 3, 0); jn[1].position.set(-4, 3, 0);
    const cell = new THREE.Group(); cell.add(new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 2.2, 24), mat(0x14532d))); const cap = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .3, 16), mat(0xd4a017)); cap.position.y = 1.25; cell.add(cap);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(.64, .64, .5, 24), mat(0xe2e8f0)); st.position.y = -.2; cell.add(st); cell.position.set(-6, 0, 0); S.add(cell);                      // a dry cell: green body, brass + cap
    label('+', '#fde047', 1).position.set(-5.1, 1.3, 0); label('−', '#e2e8f0', 1).position.set(-5.1, -1.3, 0);
    r1 = resistor(); r2 = resistor(); r1.scale.setScalar(1.5); r2.scale.setScalar(1.5); lb = label('', '#86efac', .9); l1 = label('', '#fcd34d', .9); l2 = label('', '#93c5fd', .9); li = label('', '#fde047', 1.1); li.position.set(0, -4.2, 0); li1 = label('', '#fde047', .8); li2 = label('', '#fde047', .8);
    dp = new Float32Array(64 * 3); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dots = g; const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfde047, size: .45 })); pts.frustumCulled = false; S.add(pts);
  },
  reset() { ph = [0, 0, 0]; },
  step(dt, P) {
    const Rq = P.c === 1 ? P.R1 : P.c === 2 ? P.R1 + P.R2 : P.R1 * P.R2 / (P.R1 + P.R2), I = P.V / Rq, ser = P.c === 2, par = P.c === 3, I1 = par ? P.V / P.R1 : I, I2 = par ? P.V / P.R2 : I; Object.assign(P, { Rq, I, I1, I2 });
    const st = par ? [[MAIN, I], [B1, I1], [B2, I2]] : [[FULL, I]]; let n = 0;                                    // each stream = one path with its own current → its own speed
    st.forEach(([p, cur], s) => { const L = len(p), m = Math.round(L / .85); ph[s] += cur * .5 * dt; for (let k = 0; k < m; k++) { const [x, y] = along(p, (((ph[s] + k * L / m) % L) + L) % L); dp[n * 3] = x; dp[n * 3 + 1] = y; dp[n * 3 + 2] = .5; n++; } });
    dots.setDrawRange(0, n); dots.attributes.position.needsUpdate = true;
    r1.position.set(ser ? -2.5 : 0, 3, 0); setR(r1, P.R1); r2.visible = P.c > 1; r2.position.set(ser ? 2.5 : 0, par ? 5 : 3, 0); setR(r2, P.R2); br.forEach(b => b.visible = par); jn.forEach(j => j.visible = par);
    lb.position.set(-6, -2, 0); lb.set(`Battery ${P.V} V`); l1.position.set(0 + r1.position.x, par ? 1.9 : 4.3, 0); l1.set(`R₁ ${P.R1} Ω`); l2.visible = P.c > 1; l2.position.set(r2.position.x, par ? 6.3 : 4.3, 0); l2.set(`R₂ ${P.R2} Ω`); li.set(`I = ${P.I.toFixed(2)} A`);
    li1.visible = li2.visible = par; if (par) { li1.position.set(0, 1.1, 0); li1.set(`I₁ = ${I1.toFixed(2)} A`); li2.position.set(0, 7.1, 0); li2.set(`I₂ = ${I2.toFixed(2)} A`); }
    r1.body.material.emissiveIntensity = Math.min(1, I1 * I1 * P.R1 / 40); r2.body.material.emissiveIntensity = Math.min(1, I2 * I2 * P.R2 / 40);
  },
  ro: { 'Total R': P => P.Rq.toFixed(2) + ' Ω', 'Current I': P => P.I.toFixed(2) + ' A', 'Power P = VI': P => (P.V * P.I).toFixed(1) + ' W', 'I₁ (through R₁)': P => P.c === 3 ? P.I1.toFixed(2) + ' A' : null, 'I₂ (through R₂)': P => P.c === 3 ? P.I2.toFixed(2) + ' A' : null },
  note: P => P.c === 1 ? `<b>Ohm&rsquo;s law:</b> I = V/R = ${P.V}/${P.R1} = <b>${P.I.toFixed(2)} A</b>. Bigger R → smaller current; bigger V → bigger current.`
    : P.c === 2 ? `<b>Series:</b> R = R₁ + R₂ = ${P.R1} + ${P.R2} = <b>${P.Rq.toFixed(1)} Ω</b>. The <b>same current</b> ${P.I.toFixed(2)} A flows through both; voltage divides (V₁ = ${(P.I * P.R1).toFixed(1)} V, V₂ = ${(P.I * P.R2).toFixed(1)} V).`
    : `<b>Parallel:</b> R = <b>${P.Rq.toFixed(2)} Ω</b> (less than either). Same V across both; the current splits: I₁ = ${P.I1.toFixed(2)} A, I₂ = ${P.I2.toFixed(2)} A. Dots move faster through the smaller R.`,
  try: ['Single R₁ = 10 Ω, V = 5 V. Calculate I, then check the readout.', 'Series, R₁ = 4 Ω, R₂ = 6 Ω, V = 10 V: find V across each resistor.', 'Parallel, R₁ = 2 Ω, R₂ = 10 Ω. Which branch carries more current? Watch the dots in both branches.', 'Parallel, R₁ = R₂ = 6 Ω. Why is the total only 3 Ω? Notice which resistor glows hotter (H = I²Rt).', 'Read the colour bands on a resistor. Brown, black, black = 10 Ω.'],
  key: ['<b>V = IR</b> · P = VI = I²R = V²/R · heat H = I²Rt (Joule&rsquo;s law of heating)', 'Series: R = R₁ + R₂. Parallel: 1/R = 1/R₁ + 1/R₂.', 'Series: same I. Parallel: same V and the current splits (I = I₁ + I₂), so homes are wired in parallel.', 'Units: A = C/s, V = J/C, Ω = V/A · R = ρl/A', 'Resistor colour code: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9.', '<b>Electric fuse</b>: a thin wire that melts when the current is too large, so it protects the circuit. Heating effect is used in heaters and irons. 1 kWh = 3.6 × 10⁶ J.'],
  quiz: [{ q: 'Two resistors of 4 Ω and 6 Ω are in series. Total R is…', o: ['2.4 Ω', '10 Ω', '24 Ω'], a: 1, why: 'Series: R = R₁ + R₂.' }, { q: 'In parallel the total resistance is…', o: ['more than the biggest', 'less than the smallest', 'the sum'], a: 1, why: '1/R = 1/R₁ + 1/R₂ gives a value below each resistor.' }, { q: 'In a parallel circuit, the branch with the smaller resistance carries…', o: ['less current', 'more current', 'the same current'], a: 1, why: 'Same voltage, so I = V/R is bigger for the smaller R.' }]
};
