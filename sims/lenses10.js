// Class 10 · Ch 10 Light — lenses. New Cartesian sign convention; three principal rays; power in dioptre.
import { S, V, beam, arrowTo, THREE, label } from '../scene.js';
import { image, rays, farRays, power } from '../optics.js';
const SX = .28, SY = .7, H0 = 4, YL = 10, RL = 7;
const g = (x, y) => V(x * SX, y * SY, 0), N = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(1), Q = x => x < 0 ? `(−${Math.abs(x)})` : String(x);
const lathe = t => { const pts = [], n = 10; for (let k = 0; k <= n; k++) pts.push(new THREE.Vector2(RL * k / n, t(k / n) / 2)); for (let k = n; k >= 0; k--) pts.push(new THREE.Vector2(RL * k / n, -t(k / n) / 2));
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: .55, roughness: .2 })); m.rotation.z = Math.PI / 2; S.add(m); return m; };
let cx, cv, ob, im, inc, out, vir, lb;
export default {
  title: 'Lenses — Image Formation', cam: { d: 24, e: 0, a: 0, t: V(0, 0, 0), ref: 2 },
  head: 'Image distance v',
  sliders: [{ k: 't', l: 'Lens', min: 1, max: 2, step: 1, v: 1, names: ['Convex', 'Concave'] }, { k: 'u', l: 'Object distance |u|', min: 2, max: 60, step: 1, v: 30, u: 'cm', w: P => !P.far }, { k: 'f', l: 'Focal length |f|', min: 5, max: 20, step: 1, v: 10, u: 'cm' }],
  toggles: [{ k: 'far', l: 'Distant object', v: false }],
  setup() {
    beam(0x64748b, .04).set(g(-72, 0), g(72, 0)); cx = lathe(r => 1.1 * (1 - r * r) + .1); cv = lathe(r => .15 + .9 * r * r);
    ob = arrowTo(0xe2e8f0, .1); im = arrowTo(0xf97316, .1); inc = [0, 1, 2].map(() => beam(0xfde047, .05)); out = [0, 1, 2].map(() => beam(0xfde047, .05)); vir = [0, 1, 2].map(() => beam(0x94a3b8, .03));
    lb = ['2F₁', 'F₁', 'O', 'F₂', '2F₂'].map(t => label(t, '#e2e8f0', .8));
  },
  reset() {},
  step(dt, P) {
    const f = (P.t === 1 ? 1 : -1) * P.f, u = P.far ? -1e6 : -P.u, I = image('lens', u, f); Object.assign(P, { fs: f, us: u, I }); cx.visible = P.t === 1; cv.visible = P.t === 2;
    const R = P.far ? farRays(f, 3) : rays('lens', u, f, H0), show = !I.inf && Math.abs(I.v) <= 70 && (P.far || Math.abs(I.m * H0) <= 14);
    ob.visible = !P.far; if (!P.far) ob.to(u * SX, 0, u * SX, H0 * SY);
    im.visible = show && !P.far; if (im.visible) { im.to(I.v * SX, 0, I.v * SX, I.m * H0 * SY); im.children.forEach(c => c.material.color.set(I.real ? 0xf97316 : 0xfdba74)); }
    for (let k = 0; k < 3; k++) { const r = R[k], ok = r && Math.abs(r.p1[1]) <= YL; inc[k].visible = out[k].visible = !!ok; vir[k].visible = !!(ok && r.v);
      if (ok) { inc[k].set(g(...r.p0), g(...r.p1)); out[k].set(g(...r.p1), g(...r.p2)); if (r.v) vir[k].set(g(...r.p1), g(...r.v)); } }
    [-2 * P.f, -P.f, 0, P.f, 2 * P.f].forEach((x, i) => lb[i].position.set(x * SX, -1.4, 0));
  },
  ro: { 'Image distance v': P => P.I.inf ? 'At infinity' : N(P.I.v) + ' cm', 'Magnification m': P => P.far ? '≈ 0' : P.I.inf ? 'Very large' : N(P.I.m), Image: P => P.far ? 'Real, at F' : P.I.text, 'Power P': P => (P.fs > 0 ? '+' : '−') + Math.abs(power(P.fs)).toFixed(1) + ' D' },
  status: P => P.I.inf ? ['Image at infinity', false, 'warn'] : P.I.real ? ['Real image', true] : ['Virtual image', false, 'warn'],
  note: P => P.far ? (P.fs > 0 ? 'Parallel rays from a distant object meet at F. This gives the focal length of a convex lens.' : 'Parallel rays spread out as if from F. A concave lens never forms a real image.')
    : P.I.inf ? 'The object is at F₁, so the rays leave parallel and the image forms at infinity.'
    : `<b>1/v − 1/u = 1/f</b>: 1/v = 1/${Q(P.fs)} + 1/${Q(P.us)}, so v = <b>${N(P.I.v)} cm</b>. <b>m = v/u</b> = ${N(P.I.m)}. <b>P = 1/f</b> = ${N(power(P.fs))} D. ${P.I.text}.`,
  try: ['Convex, f = 10 cm: move the object from 60 cm to 5 cm. Note each image.', 'Switch on Distant object. Where do the rays meet?', 'Switch to Concave. Does the image type ever change?'],
  key: ['Sign convention: measure from the centre O; +x is the direction of the light.', 'Convex lens f is positive; concave lens f is negative.', 'Lens formula: 1/v − 1/u = 1/f. Magnification: m = v/u.', 'Power P = 1/f (f in metres) is in dioptre (D).'],
  quiz: [{ q: 'A convex lens gives a virtual, erect, enlarged image when the object is…', o: ['beyond 2F₁', 'between F₁ and O', 'at F₁'], a: 1, why: 'Inside the focal length it works as a magnifying glass.' }, { q: 'Power of a convex lens with f = +25 cm is…', o: ['+4 D', '+0.25 D', '−4 D'], a: 0, why: 'P = 1 ÷ 0.25 m = +4 D.' }, { q: 'A concave lens always forms an image that is…', o: ['real and inverted', 'virtual, erect and diminished', 'real and enlarged'], a: 1, why: 'The rays always diverge.' }]
};
