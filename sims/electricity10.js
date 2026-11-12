// Class 10 · Electricity — Ohm's law, resistors in series / parallel, heating effect.
import { S, V, box, mat, THREE, label } from '../scene.js';
const PER = 36, N = 36;                                   // loop is 12 × 6 units → perimeter 36
const at = u => { u = ((u % PER) + PER) % PER; if (u < 12) return [-6 + u, -3]; u -= 12; if (u < 6) return [6, -3 + u]; u -= 6; if (u < 12) return [6 - u, 3]; u -= 12; return [-6, 3 - u]; };
let r1, r2, br, dots, dp, ph, lb, l1, l2, li;
const wire = pts => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p => V(...p))), new THREE.LineBasicMaterial({ color: 0x94a3b8 })); S.add(l); return l; };
export default {
  title: "Electricity — Ohm's Law", cam: { d: 19, t: V(0, .5, 0), e: .1, a: 0, ref: 1.3 }, head: 'Current I',
  sliders: [{ k: 'c', l: 'Circuit', min: 1, max: 3, step: 1, v: 1, names: ['Single R₁', 'R₁ + R₂ in series', 'R₁ ‖ R₂ in parallel'] },
    { k: 'V', l: 'Battery voltage V', min: 1, max: 12, step: 1, v: 6, u: 'V' }, { k: 'R1', l: 'Resistance R₁', min: 1, max: 20, step: 1, v: 6, u: 'Ω' }, { k: 'R2', l: 'Resistance R₂', min: 1, max: 20, step: 1, v: 3, u: 'Ω' }],
  setup() {
    wire([[-6, -3, 0], [6, -3, 0], [6, 3, 0], [-6, 3, 0], [-6, -3, 0]]); br = wire([[-4, 3, 0], [-4, 5, 0], [4, 5, 0], [4, 3, 0]]);
    box(1.2, 2.2, 1, 0x22c55e).position.set(-6, 0, 0);                          // battery
    r1 = box(1, .8, 1, 0xf59e0b); r2 = box(1, .8, 1, 0x3b82f6);
    r1.material = mat(0xf59e0b, { emissive: 0xff3300, emissiveIntensity: 0 }); r2.material = mat(0x3b82f6, { emissive: 0xff3300, emissiveIntensity: 0 });
    lb = label('', '#86efac', .9); l1 = label('', '#fcd34d', .9); l2 = label('', '#93c5fd', .9); li = label('', '#fde047', 1.1); li.position.set(0, -4.2, 0);
    dp = new Float32Array(N * 3); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dots = g;
    S.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfde047, size: .45 })));
  },
  reset() { ph = 0; },
  step(dt, P) {
    const Rq = P.c === 1 ? P.R1 : P.c === 2 ? P.R1 + P.R2 : P.R1 * P.R2 / (P.R1 + P.R2), I = P.V / Rq;
    P.Rq = Rq; P.I = I; ph += I * .5 * dt;
    for (let i = 0; i < N; i++) { const [x, y] = at(ph + i * PER / N); dp[i * 3] = x; dp[i * 3 + 1] = y; dp[i * 3 + 2] = 0; } dots.attributes.position.needsUpdate = true;
    const ser = P.c === 2, par = P.c === 3, I1 = par ? P.V / P.R1 : I, I2 = par ? P.V / P.R2 : I; P.I1 = I1; P.I2 = I2;
    r1.scale.x = .15 * P.R1 + .4; r1.position.set(ser ? -2.5 : par ? 0 : 0, 3, 0);
    r2.visible = P.c > 1; r2.scale.x = .15 * P.R2 + .4; r2.position.set(ser ? 2.5 : 0, par ? 5 : 3, 0); br.visible = par;
    lb.position.set(-6, -2, 0); lb.set(`Battery ${P.V} V`); l1.position.set(r1.position.x, r1.position.y + 1.3, 0); l1.set(`R₁ ${P.R1} Ω`); l2.visible = P.c > 1; l2.position.set(r2.position.x, r2.position.y + 1.3, 0); l2.set(`R₂ ${P.R2} Ω`); li.set(`I = ${P.I.toFixed(2)} A`);
    r1.material.emissiveIntensity = Math.min(1, I1 * I1 * P.R1 / 40); r2.material.emissiveIntensity = Math.min(1, I2 * I2 * P.R2 / 40);
  },
  ro: { 'Total R': P => P.Rq.toFixed(2) + ' Ω', 'Current I': P => P.I.toFixed(2) + ' A', 'Power P = VI': P => (P.V * P.I).toFixed(1) + ' W' },
  note: P => P.c === 1 ? `<b>Ohm&rsquo;s law:</b> I = V/R = ${P.V}/${P.R1} = <b>${P.I.toFixed(2)} A</b>. Bigger R → smaller current; bigger V → bigger current.`
    : P.c === 2 ? `<b>Series:</b> R = R₁ + R₂ = ${P.R1} + ${P.R2} = <b>${P.Rq.toFixed(1)} Ω</b>. The <b>same current</b> ${P.I.toFixed(2)} A flows through both; voltage divides (V₁ = ${(P.I * P.R1).toFixed(1)} V, V₂ = ${(P.I * P.R2).toFixed(1)} V).`
    : `<b>Parallel:</b> 1/R = 1/R₁ + 1/R₂, so R = <b>${P.Rq.toFixed(2)} Ω</b> (less than either). Same voltage ${P.V} V across both; current splits: I₁ = ${P.I1.toFixed(2)} A, I₂ = ${P.I2.toFixed(2)} A. (Yellow dots show the total current.)`,
  try: ['Single R₁ = 10 Ω, V = 5 V. Calculate I, then check the readout.', 'Series, R₁ = 4 Ω, R₂ = 6 Ω, V = 10 V: find V across each resistor.', 'Parallel, R₁ = R₂ = 6 Ω. Why is the total only 3 Ω? Notice which resistor glows hotter (H = I²Rt).'],
  key: ['<b>V = IR</b> · P = VI = I²R = V²/R · heat H = I²Rt (Joule&rsquo;s law of heating)', 'Series: R = R₁ + R₂. Parallel: 1/R = 1/R₁ + 1/R₂.', 'Series: same I. Parallel: same V, so homes are wired in parallel.', 'Units: A = C/s, V = J/C, Ω = V/A · R = ρl/A', '<b>Electric fuse</b>: a thin wire that melts when the current is too large, so it protects the circuit. Heating effect is used in heaters and irons. 1 kWh = 3.6 × 10⁶ J.'],
  quiz: [{ q: 'Two resistors of 4 Ω and 6 Ω are in series. Total R is…', o: ['2.4 Ω', '10 Ω', '24 Ω'], a: 1, why: 'Series: R = R₁ + R₂.' }, { q: 'In parallel the total resistance is…', o: ['more than the biggest', 'less than the smallest', 'the sum'], a: 1, why: '1/R = 1/R₁ + 1/R₂ gives a value below each resistor.' }]
};
