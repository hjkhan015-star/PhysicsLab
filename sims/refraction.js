import { S, D, V, box, line } from '../kit.js';
let inc, ref, rfl;
export default {
  title: 'Refraction of Light', cam: { d: 14, e: 1.2, a: 0 },
  sliders: [{ k: 'i', l: 'Angle of incidence', min: 0, max: 85, step: 1, v: 40, u: '°' }, { k: 'n', l: 'Glass density (refractive index)', min: 1, max: 2.4, step: .05, v: 1.5, u: '' }],
  setup() { const g = box(14, 4, 3, 0x38bdf8); g.material.transparent = true; g.material.opacity = .35; g.position.y = -2; box(16, .05, 4, 0x1b2438).position.y = -4.1;
    line(V(0, -5), V(0, 5), 0x888888); inc = line(V(), V(0, 1), 0xfde047); ref = line(V(), V(0, 1), 0xf87171); rfl = line(V(), V(0, 1), 0x666666); },
  reset() {},
  step(dt, P) {
    const i = P.i * D, r = Math.asin(Math.min(1, Math.sin(i) / P.n)), L = 6; P.r = r;
    inc.geometry.setFromPoints([V(-L * Math.sin(i), L * Math.cos(i)), V()]);
    ref.geometry.setFromPoints([V(), V(L * Math.sin(r), -L * Math.cos(r))]);
    rfl.geometry.setFromPoints([V(), V(L * Math.sin(i), L * Math.cos(i))]);
  },
  ro: { 'Incident ∠i': P => P.i + '°', 'Refracted ∠r': P => (P.r / D).toFixed(1) + '°', 'sin i / sin r': P => P.r > 0 ? (Math.sin(P.i * D) / Math.sin(P.r)).toFixed(2) : '–' },
  note: P => `Light slows in glass and <b>bends towards the normal</b> (the grey vertical line). sin i / sin r always equals the refractive index n = ${P.n}. Higher n → more bending.`
};
