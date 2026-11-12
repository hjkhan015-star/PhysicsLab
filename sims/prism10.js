// Class 10 · Ch 10–11 Light — refraction through a glass prism: deviation, minimum deviation and dispersion (HSLC practical).
import { S, V, beam, mat, THREE, label } from '../scene.js';
import { prism, minDeviation, minDevAngle } from '../optics.js';
const A = 60, D = Math.PI / 180, SIDE = 6, H = SIDE * Math.sqrt(3) / 2;
const COLS = ['Violet', 'Indigo', 'Blue', 'Green', 'Yellow', 'Orange', 'Red'], CC = [0x8b5cf6, 0x6366f1, 0x3b82f6, 0x22c55e, 0xfacc15, 0xfb923c, 0xef4444], NI = [1.532, 1.529, 1.526, 1.520, 1.517, 1.515, 1.513], N1 = 1.52;
const M1 = [-SIDE / 4, H / 2], P0 = [0, H], P1 = [SIDE / 2, 0], Y0 = -H / 2;                              // prism: base on y = Y0 · entrance point = middle of the left face
let pr, bI, bIn, bO, gI, gIn, gO, lR, lV, lG, lM;
const hit = (m, th) => { const dx = Math.cos(th * D), dy = Math.sin(th * D), ex = P1[0] - P0[0], ey = P1[1] - P0[1], den = dx * ey - dy * ex, t = ((P0[0] - m[0]) * ey - (P0[1] - m[1]) * ex) / den; return [m[0] + dx * t, m[1] + dy * t]; };
const path = (i, n) => { const r = prism(i, A, n); if (!r) return null; const th1 = -30 + i, thIn = -30 + r.r1, m2 = hit(M1, thIn), thOut = 30 - r.e; return { r, th1, thIn, m2, thOut }; };   // ray angles in degrees
const P2 = a => V(a[0], a[1] + Y0, 0), dir = (m, th, L) => [m[0] + L * Math.cos(th * D), m[1] + L * Math.sin(th * D)];
export default {
  title: 'Glass Prism — Deviation and Dispersion', cam: { d: 17, e: 0, a: 0, t: V(0, 0, 0), ref: 2 },
  head: 'Angle of deviation δ',
  sliders: [{ k: 'i', l: 'Angle of incidence i', min: 35, max: 80, step: 1, v: 45, u: '°' }, { k: 'w', l: 'Light', min: 1, max: 2, step: 1, v: 2, names: ['Single colour', 'White'] }],
  toggles: [{ k: 'min', l: 'Show minimum deviation', v: false }],
  setup() {
    const sh = new THREE.Shape(); sh.moveTo(-SIDE / 2, 0); sh.lineTo(SIDE / 2, 0); sh.lineTo(0, H); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 2.4, bevelEnabled: false }); g.translate(0, Y0, -1.2); pr = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: .45, roughness: .15 })); S.add(pr);
    bI = beam(0xffffff, .06); bIn = beam(0xfef9c3, .05); bO = COLS.map((c, k) => beam(CC[k], .05)); gI = beam(0x94a3b8, .03); gIn = beam(0x94a3b8, .03); gO = beam(0x94a3b8, .03);
    lR = label('Red', '#fca5a5', .9); lV = label('Violet', '#c4b5fd', .9); lG = label('Minimum deviation', '#94a3b8', .9); lM = label('Prism', '#bfdbfe', .9); lM.position.set(0, Y0 - .8, 0);
  },
  reset() {},
  step(dt, P) {
    const white = P.w === 2, base = path(P.i, N1); P.base = base; const L = 8;
    if (!base) { P.ok = false; return; } P.ok = true; const a = dir(M1, base.th1 + 180, L);
    bI.set(P2(a), P2(M1)); bIn.set(P2(M1), P2(base.m2)); bI.material.color.set(white ? 0xffffff : 0x22c55e); bIn.material.color.set(white ? 0xfef9c3 : 0x22c55e);
    COLS.forEach((c, k) => { const p = path(P.i, NI[k]), on = p && (white || k === 3); bO[k].visible = !!on; if (on) { bO[k].set(P2(p.m2), P2(dir(p.m2, p.thOut, 14))); } P['d' + k] = p ? p.r.d : null; P['e' + k] = p ? p.r.e : null; });
    const pr_ = P.base.r; P.dev = white ? P.d3 : pr_.d; P.em = white ? P.e3 : pr_.e; const n = white ? NI[3] : N1; P.n = n; P.dm = minDeviation(A, n); P.im = minDevAngle(A, n);
    const gm = P.min, g = path(P.im, n); [gI, gIn, gO].forEach(b => b.visible = !!(gm && g));
    if (gm && g) { gI.set(P2(dir(M1, g.th1 + 180, L)), P2(M1)); gIn.set(P2(M1), P2(g.m2)); gO.set(P2(g.m2), P2(dir(g.m2, g.thOut, 9))); lG.position.set(g.m2[0] + 5, g.m2[1] + Y0 + 2.4 - 6 * Math.tan(-g.thOut * D) * 0 , 0); lG.set('Minimum deviation'); } else lG.set('');
    const p0 = path(P.i, NI[0]), p6 = path(P.i, NI[6]); if (white && p0 && p6) { lR.position.set(...[p6.m2[0] + 9 * Math.cos(p6.thOut * D) + 1, p6.m2[1] + Y0 + 9 * Math.sin(p6.thOut * D) + .6], 0); lR.set('Red'); lV.position.set(p0.m2[0] + 9 * Math.cos(p0.thOut * D) + 1, p0.m2[1] + Y0 + 9 * Math.sin(p0.thOut * D) - .6, 0); lV.set('Violet'); } else { lR.set(''); lV.set(''); }
  },
  ro: { 'Angle of deviation δ': P => P.dev.toFixed(1) + ' °', 'Angle of emergence e': P => P.em.toFixed(1) + ' °', 'Minimum deviation δm': P => P.dm.toFixed(1) + ' °', 'Red deviates': P => P.w === 2 ? P.d6.toFixed(1) + ' °' : null, 'Violet deviates': P => P.w === 2 ? P.d0.toFixed(1) + ' °' : null },
  status: P => Math.abs(P.i - P.im) < 1.5 ? ['At minimum deviation', true] : [P.i < P.im ? 'Before the minimum' : 'After the minimum', false, 'warn'],
  graph: P => { const pts = [], n = P.n; for (let i = 35; i <= P.i; i++) { const r = prism(i, A, n); if (r) pts.push([i, r.d]); } return { pts, xmax: 90, ymin: 30, ymax: 60, xl: 'angle of incidence i (°)', yl: 'deviation δ (°)', ref: P.min ? [[35, P.dm], [80, P.dm]] : undefined, color: '#f97316' }; },
  note: P => `<b>δ = i + e − A</b> = ${P.i}° + ${P.em.toFixed(1)}° − ${A}° = <b>${P.dev.toFixed(1)}°</b>. ` + (P.w === 2 ? 'White light splits into VIBGYOR: violet bends most, red least.' : 'The deviation is least when i = e.'),
  try: ['Move i slowly from 35° to 80°. Where is δ smallest?', 'Switch on Show minimum deviation. Is i equal to e there?', 'Choose White light. Which colour bends the most?'],
  key: ['Deviation δ = i + e − A, with prism angle A = 60°.', 'At minimum deviation the ray passes symmetrically: i = e.', 'Dispersion: white light splits into VIBGYOR because each colour bends differently.', 'Violet bends the most and red the least.'],
  quiz: [{ q: 'At minimum deviation, the angle of incidence i is…', o: ['equal to e', 'twice e', 'zero'], a: 0, why: 'The path through the prism is symmetric.' }, { q: 'In the spectrum from a prism, the colour bent least is…', o: ['Violet', 'Green', 'Red'], a: 2, why: 'Red has the smallest refractive index in glass.' }, { q: 'i = 49°, e = 49°, A = 60°. The deviation is…', o: ['38°', '49°', '98°'], a: 0, why: 'δ = 49 + 49 − 60 = 38°.' }]
};
