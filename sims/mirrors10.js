// Class 10 · Ch 10 Light — spherical mirrors. New Cartesian sign convention; three coloured principal rays; the mirror's curve follows f (R = 2f).
import { S, V, beam, THREE, label, sph, view } from '../scene.js';
import { image, rays } from '../optics.js';
import { head, placeHead, dotted, mkObj } from '../raytools.js';
const SX = .28, SY = .7, H0 = 4, YL = 10, T = .35, K = H0 * SY;                        // scene units per cm (sideways, up) · object height · mirror half-height (cm) · back thickness · object height in units
const RC = [0xfde047, 0x22d3ee, 0xf472b6], RN = ['#fde047', '#67e8f9', '#f9a8d4'];     // ray 1 parallel to axis · ray 2 through F · ray 3 through C
const CAM = { d: 17.5, e: 0, a: 0, t: V(-5, 0, 0), ref: 2 };
const u2 = (x, y) => [x * SX, y * SY], v3 = a => V(a[0], a[1], 0), N = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(1), Q = x => x < 0 ? `(−${Math.abs(x)})` : String(x);
const sag = (y, R) => R - Math.sqrt(Math.max(0, R * R - y * y));
function geo(sgn, R) { const ym = Math.min(YL, R), p = [], n = 24;                  // a cap of a sphere with a thin back: shows its true shape when you turn the picture
  for (let k = 0; k <= n; k++) { const y = ym * k / n; p.push(new THREE.Vector2(y * SY, sgn * sag(y, R) * SX)); } for (let k = n; k >= 0; k--) { const y = ym * k / n; p.push(new THREE.Vector2(y * SY, sgn * sag(y, R) * SX + T)); }
  return new THREE.LatheGeometry(p, 48); }
let mir, ob, im, inc, out, vir, hI, hO, hatch, dP, dF, dC, lP, lF, lC, lOb, lIm, lk, lo;
export default {
  title: 'Spherical Mirrors — Image Formation', cam: CAM,
  head: 'Image distance v',
  sliders: [{ k: 't', l: 'Mirror', min: 1, max: 2, step: 1, v: 1, names: ['Concave', 'Convex'] }, { k: 'u', l: 'Object distance |u|', min: 2, max: 60, step: 1, v: 30, u: 'cm' }, { k: 'f', l: 'Focal length |f|', min: 5, max: 20, step: 1, v: 10, u: 'cm' }],
  buttons: [{ l: '2D view', fn: () => view.set(CAM) }, { l: '🕯 Change object', fn: P => { P.ok = ((P.ok || 0) + 1) % 3; } }],
  setup() {
    beam(0x64748b, .04).set(V(-72 * SX, 0, 0), V(30 * SX, 0, 0)); mir = new THREE.Mesh(geo(-1, 20), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, emissive: 0x3b6ea5, emissiveIntensity: .55, metalness: .35, roughness: .3, side: THREE.DoubleSide })); mir.rotation.z = -Math.PI / 2; S.add(mir);
    hatch = Array.from({ length: 11 }, () => beam(0x94a3b8, .03));
    inc = [0, 1, 2].map(() => beam(0xfde047, .05)); out = [0, 1, 2].map(() => beam(0xfde047, .05)); vir = [0, 1, 2].map(() => dotted(0x94a3b8)); hI = [0, 1, 2].map(() => head(0xfde047)); hO = [0, 1, 2].map(() => head(0xfde047));
    dP = sph(.17, 0xf8fafc); dF = sph(.17, 0xfbbf24); dC = sph(.17, 0xf472b6);
    lP = label('P', '#f8fafc', .8); lF = label('F', '#fbbf24', .8); lC = label('C', '#f9a8d4', .8); lOb = label('Object', '#e2e8f0', .7); lIm = label('Image', '#fdba74', .7); lk = lo = null;
  },
  reset() { lk = lo = null; },
  step(dt, P) {
    const sgn = P.t === 1 ? -1 : 1, f = sgn * P.f, u = -P.u, I = image('mirror', u, f), Rr = 2 * P.f, kd = P.ok || 0; Object.assign(P, { fs: f, us: u, I });
    if (lk !== `${P.t}|${P.f}`) { lk = `${P.t}|${P.f}`; mir.geometry.dispose(); mir.geometry = geo(sgn, Rr); const ym = Math.min(YL, Rr);
      hatch.forEach((h, k) => { const y = -ym + 2 * ym * k / 10, xb = sgn * sag(Math.abs(y), Rr) * SX + T; h.set(V(xb, y * SY, 0), V(xb + .5, y * SY - .5, 0)); }); }   // hatching = the back of the mirror
    if (lo !== kd) { lo = kd; if (ob) { S.remove(ob); S.remove(im); } ob = mkObj(kd, 0xe2e8f0); im = mkObj(kd, 0xf97316); }
    ob.position.set(u * SX, 0, 0); ob.setM(1, K); lOb.position.set(u * SX, K + .6, 0);
    const R = rays('mirror', u, f, H0), show = !I.inf && Math.abs(I.v) <= 70 && Math.abs(I.m * H0) <= 14, ids = [0]; if (Math.abs(f - u) > 1e-6) ids.push(1); if (Math.abs(2 * f - u) > 1e-6) ids.push(2);
    im.visible = lIm.visible = show; if (show) { im.position.set(I.v * SX, 0, 0); im.setM(I.m, K); im.setA(I.real ? 1 : .5); im.setTop(!I.real); lIm.position.set(I.v * SX + 1.2, I.m * K / 2, 0); }
    for (let k = 0; k < 3; k++) { const r = R[k], ok = r && Math.abs(r.p1[1]) <= YL; inc[k].visible = out[k].visible = hI[k].visible = hO[k].visible = !!ok; if (!ok) { vir[k].hide(); continue; }
      const c = RC[ids[k]], p1 = u2(sgn * sag(Math.abs(r.p1[1]), Rr), r.p1[1]), a = u2(...r.p0), b = u2(...r.p2);                                   // the ray meets the curved surface, not a flat plane
      inc[k].set(v3(a), v3(p1)); out[k].set(v3(p1), v3(b)); [inc[k], out[k], hI[k], hO[k]].forEach(o => (o.material || o.children[0].material).color.set(c)); placeHead(hI[k], a, p1, true); placeHead(hO[k], p1, b, false);
      if (r.v) vir[k].set(p1, u2(...r.v), c); else vir[k].hide(); }
    dP.position.set(0, 0, 0); dF.position.set(f * SX, 0, 0); dC.position.set(2 * f * SX, 0, 0); lP.position.set(0, -1.4, 0); lF.position.set(f * SX, -1.4, 0); lC.position.set(2 * f * SX, -1.4, 0);
  },
  ro: { 'Image distance v': P => P.I.inf ? 'At infinity' : N(P.I.v) + ' cm', 'Magnification m': P => P.I.inf ? 'Very large' : N(P.I.m), Image: P => P.I.text },
  status: P => P.I.inf ? ['Image at infinity', false, 'warn'] : P.I.real ? ['Real image', true] : ['Virtual image', false, 'warn'],
  note: P => P.I.inf ? 'The object is at F, so the reflected rays leave parallel and the image forms at infinity.'
    : `<b>1/v + 1/u = 1/f</b>: 1/v = 1/${Q(P.fs)} − 1/${Q(P.us)}, so v = <b>${N(P.I.v)} cm</b>. <b>m = −v/u</b> = ${N(P.I.m)}. ${P.I.text}.`,
  try: ['Set f = 10 cm. Move the object from 60 cm down to 5 cm. Note each image.', 'Put the object exactly at F. What happens to the image?', 'Switch to Convex. Can you ever get a real image?', 'Change f and watch the mirror: a smaller f gives a more curved mirror (R = 2f). Drag the picture to turn it and see the real shape.'],
  key: ['Sign convention: measure from the pole; +x is the direction of the light.', 'Concave mirror f is negative; convex mirror f is positive.', 'Mirror formula: 1/v + 1/u = 1/f. Magnification: m = −v/u. Radius of curvature R = 2f.', 'm is negative for real, inverted images and positive for virtual, erect ones.', 'Ray colours: <b>yellow</b> parallel to the axis · <b>blue</b> through F · <b>pink</b> through C. Dotted lines behind the mirror are only apparent paths. Hatching shows the back of the mirror.'],
  quiz: [{ q: 'An object at C of a concave mirror gives an image that is…', o: ['real, inverted, same size', 'virtual, erect, enlarged', 'real, inverted, enlarged'], a: 0, why: 'At C the image is also at C, real and the same size.' }, { q: 'Object 30 cm from a concave mirror with f = −10 cm. Image distance v =', o: ['−15 cm', '+15 cm', '−7.5 cm'], a: 0, why: '1/v = 1/(−10) − 1/(−30) = −1/15.' }, { q: 'A convex mirror always forms an image that is…', o: ['real and inverted', 'virtual, erect and diminished', 'virtual and enlarged'], a: 1, why: 'The rays only seem to meet behind the mirror.' }, { q: 'A mirror has f = 15 cm (size only). Its radius of curvature R is…', o: ['7.5 cm', '15 cm', '30 cm'], a: 2, why: 'R = 2f.' }]
};
