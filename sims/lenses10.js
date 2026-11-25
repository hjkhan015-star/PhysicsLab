// Class 10 · Ch 10 Light — lenses. New Cartesian sign convention; three coloured principal rays; power in dioptre; real objects; dots at 2F₁, F₁, O, F₂, 2F₂.
import { S, V, beam, THREE, label, sph, view } from '../scene.js';
import { image, rays, farRays, power } from '../optics.js';
import { head, placeHead, dotted, mkObj } from '../raytools.js';
const SX = .28, SY = .7, H0 = 4, YL = 10, RL = 7, K = H0 * SY;
const RC = [0xfde047, 0xf472b6, 0x22d3ee];                                           // ray 1 parallel to axis (yellow) · ray 2 through O (pink) · ray 3 through F₁ (blue)
const CAM = { d: 19, e: 0, a: 0, t: V(0, 0, 0), ref: 2 };
const u2 = (x, y) => [x * SX, y * SY], v3 = a => V(a[0], a[1], 0), N = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(1), Q = x => x < 0 ? `(−${Math.abs(x)})` : String(x);
const lathe = t => { const pts = [], n = 12; for (let k = 0; k <= n; k++) pts.push(new THREE.Vector2(RL * k / n, t(k / n) / 2)); for (let k = n; k >= 0; k--) pts.push(new THREE.Vector2(RL * k / n, -t(k / n) / 2));
  const g = new THREE.LatheGeometry(pts, 40), m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: 0x7dd3fc, emissive: 0x0c4a6e, transparent: true, opacity: .5, roughness: .08, clearcoat: 1, side: THREE.DoubleSide }));
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), new THREE.LineBasicMaterial({ color: 0xe0f2fe }))); m.rotation.z = Math.PI / 2; S.add(m); return m; };   // glass body + bright rim
let cx, cv, ob, im, inc, out, vir, hI, hO, dots, lb, lOb, lIm, lo;
export default {
  title: 'Lenses — Image Formation', cam: CAM,
  head: 'Image distance v',
  sliders: [{ k: 't', l: 'Lens', min: 1, max: 2, step: 1, v: 1, names: ['Convex', 'Concave'] }, { k: 'u', l: 'Object distance |u|', min: 2, max: 60, step: 1, v: 30, u: 'cm', w: P => !P.far }, { k: 'f', l: 'Focal length |f|', min: 5, max: 20, step: 1, v: 10, u: 'cm' }],
  toggles: [{ k: 'far', l: 'Distant object', v: false }],
  buttons: [{ l: '2D view', fn: () => view.set(CAM) }, { l: '🕯 Change object', fn: P => { P.ok = ((P.ok || 0) + 1) % 3; } }],
  setup() {
    beam(0x64748b, .04).set(V(-72 * SX, 0, 0), V(72 * SX, 0, 0)); dotted(0x64748b, .035).set([0, -YL * SY], [0, YL * SY]);                       // axis · the plane of the lens (dotted)
    cx = lathe(r => 1.1 * (1 - r * r) + .1); cv = lathe(r => .15 + .9 * r * r);
    inc = [0, 1, 2].map(() => beam(0xfde047, .05)); out = [0, 1, 2].map(() => beam(0xfde047, .05)); vir = [0, 1, 2].map(() => dotted(0x94a3b8)); hI = [0, 1, 2].map(() => head(0xfde047)); hO = [0, 1, 2].map(() => head(0xfde047));
    dots = [0xf472b6, 0xfbbf24, 0xf8fafc, 0xfbbf24, 0xf472b6].map(c => sph(.17, c)); lb = ['2F₁', 'F₁', 'O', 'F₂', '2F₂'].map((t, i) => label(t, i === 2 ? '#f8fafc' : i % 4 === 0 ? '#f9a8d4' : '#fcd34d', .8));
    lOb = label('Object', '#e2e8f0', .7); lIm = label('Image', '#fdba74', .7); lo = null;
  },
  reset() { lo = null; },
  step(dt, P) {
    const f = (P.t === 1 ? 1 : -1) * P.f, u = P.far ? -1e6 : -P.u, I = image('lens', u, f), kd = P.ok || 0; Object.assign(P, { fs: f, us: u, I }); cx.visible = P.t === 1; cv.visible = P.t === 2;
    const kt = Math.max(.5, Math.min(1.6, 11 / P.f)); cx.scale.y = cv.scale.y = kt;                                                                  // a shorter focal length = a fatter lens
    if (lo !== kd) { lo = kd; if (ob) { S.remove(ob); S.remove(im); } ob = mkObj(kd, 0xe2e8f0); im = mkObj(kd, 0xf97316); }
    const R = P.far ? farRays(f, 3) : rays('lens', u, f, H0), show = !I.inf && Math.abs(I.v) <= 70 && (P.far || Math.abs(I.m * H0) <= 14), ids = P.far ? [0, 0] : [0, 1]; if (!P.far && Math.abs(f + u) > 1e-6) ids.push(2);
    ob.visible = lOb.visible = !P.far; if (!P.far) { ob.position.set(u * SX, 0, 0); ob.setM(1, K); lOb.position.set(u * SX, K + .6, 0); }
    im.visible = lIm.visible = show && !P.far; if (im.visible) { im.position.set(I.v * SX, 0, 0); im.setM(I.m, K); im.setA(I.real ? 1 : .5); im.setTop(!I.real); lIm.position.set(I.v * SX + 1.2, I.m * K / 2, 0); }
    for (let k = 0; k < 3; k++) { const r = R[k], ok = r && Math.abs(r.p1[1]) <= YL; inc[k].visible = out[k].visible = hI[k].visible = hO[k].visible = !!ok; if (!ok) { vir[k].hide(); continue; }
      const c = RC[ids[k]], p1 = u2(0, r.p1[1]), a = u2(...r.p0), b = u2(...r.p2); inc[k].set(v3(a), v3(p1)); out[k].set(v3(p1), v3(b)); [inc[k], out[k], hI[k], hO[k]].forEach(o => (o.material || o.children[0].material).color.set(c));
      placeHead(hI[k], a, p1, true); placeHead(hO[k], p1, b, false); if (r.v) vir[k].set(p1, u2(...r.v), c); else vir[k].hide(); }
    [-2 * P.f, -P.f, 0, P.f, 2 * P.f].forEach((x, i) => { dots[i].position.set(x * SX, 0, 0); lb[i].position.set(x * SX, -1.4, 0); });
  },
  ro: { 'Image distance v': P => P.I.inf ? 'At infinity' : N(P.I.v) + ' cm', 'Magnification m': P => P.far ? '≈ 0' : P.I.inf ? 'Very large' : N(P.I.m), Image: P => P.far ? 'Real, at F' : P.I.text, 'Power P': P => (P.fs > 0 ? '+' : '−') + Math.abs(power(P.fs)).toFixed(1) + ' D' },
  status: P => P.I.inf ? ['Image at infinity', false, 'warn'] : P.I.real ? ['Real image', true] : ['Virtual image', false, 'warn'],
  note: P => P.far ? (P.fs > 0 ? 'Parallel rays from a distant object meet at F. This gives the focal length of a convex lens.' : 'Parallel rays spread out as if from F. A concave lens never forms a real image.')
    : P.I.inf ? 'The object is at F₁, so the rays leave parallel and the image forms at infinity.'
    : `<b>1/v − 1/u = 1/f</b>: 1/v = 1/${Q(P.fs)} + 1/${Q(P.us)}, so v = <b>${N(P.I.v)} cm</b>. <b>m = v/u</b> = ${N(P.I.m)}. <b>P = 1/f</b> = ${N(power(P.fs))} D. ${P.I.text}.`,
  try: ['Convex, f = 10 cm: move the object from 60 cm to 5 cm. Note each image.', 'Switch on Distant object. Where do the rays meet?', 'Switch to Concave. Does the image type ever change?', 'Pick the candle with Change object. Put it at 2F₁. Is the image the same size?'],
  key: ['Sign convention: measure from the centre O; +x is the direction of the light.', 'Convex lens f is positive; concave lens f is negative.', 'Lens formula: 1/v − 1/u = 1/f. Magnification: m = v/u.', 'Power P = 1/f (f in metres) is in dioptre (D).', 'Ray colours: <b>yellow</b> parallel to the axis · <b>pink</b> through the centre O · <b>blue</b> through F₁. A shorter f makes a fatter lens.'],
  quiz: [{ q: 'A convex lens gives a virtual, erect, enlarged image when the object is…', o: ['beyond 2F₁', 'between F₁ and O', 'at F₁'], a: 1, why: 'Inside the focal length it works as a magnifying glass.' }, { q: 'Power of a convex lens with f = +25 cm is…', o: ['+4 D', '+0.25 D', '−4 D'], a: 0, why: 'P = 1 ÷ 0.25 m = +4 D.' }, { q: 'A concave lens always forms an image that is…', o: ['real and inverted', 'virtual, erect and diminished', 'real and enlarged'], a: 1, why: 'The rays always diverge.' }, { q: 'An object at 2F₁ of a convex lens gives an image at…', o: ['F₂', '2F₂', 'infinity'], a: 1, why: 'Real, inverted and the same size, at 2F₂.' }]
};
