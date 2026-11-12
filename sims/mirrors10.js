// Class 10 · Ch 10 Light — spherical mirrors. New Cartesian sign convention; three principal rays.
import { S, V, beam, arrowTo, THREE, label } from '../scene.js';
import { image, rays } from '../optics.js';
const SX = .28, SY = .7, H0 = 4, YL = 10;                                      // scene units per cm (sideways, up) · object height · mirror half-height (cm)
const g = (x, y) => V(x * SX, y * SY, 0), N = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(1), Q = x => x < 0 ? `(−${Math.abs(x)})` : String(x);
let mir, ob, im, inc, out, vir, lP, lF, lC, ph;
export default {
  title: 'Spherical Mirrors — Image Formation', cam: { d: 21, e: 0, a: 0, t: V(-5, 0, 0), ref: 2 },
  head: 'Image distance v',
  sliders: [{ k: 't', l: 'Mirror', min: 1, max: 2, step: 1, v: 1, names: ['Concave', 'Convex'] }, { k: 'u', l: 'Object distance |u|', min: 2, max: 60, step: 1, v: 30, u: 'cm' }, { k: 'f', l: 'Focal length |f|', min: 5, max: 20, step: 1, v: 10, u: 'cm' }],
  setup() {
    beam(0x64748b, .04).set(g(-72, 0), g(30, 0)); mir = new THREE.Mesh(new THREE.TorusGeometry(14, .16, 8, 40, .8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 })); S.add(mir);
    ob = arrowTo(0xe2e8f0, .1); im = arrowTo(0xf97316, .1); inc = [0, 1, 2].map(() => beam(0xfde047, .05)); out = [0, 1, 2].map(() => beam(0xfde047, .05)); vir = [0, 1, 2].map(() => beam(0x94a3b8, .03));
    lP = label('P', '#e2e8f0', .8); lF = label('F', '#e2e8f0', .8); lC = label('C', '#e2e8f0', .8);
  },
  reset() {},
  step(dt, P) {
    const f = (P.t === 1 ? -1 : 1) * P.f, u = -P.u, I = image('mirror', u, f); Object.assign(P, { fs: f, us: u, I });
    if (P.t === 1) { mir.position.set(-14, 0, 0); mir.rotation.z = -.4; } else { mir.position.set(14, 0, 0); mir.rotation.z = Math.PI - .4; }
    ob.to(u * SX, 0, u * SX, H0 * SY); const R = rays('mirror', u, f, H0), show = !I.inf && Math.abs(I.v) <= 70 && Math.abs(I.m * H0) <= 14;
    im.visible = show; if (show) { im.to(I.v * SX, 0, I.v * SX, I.m * H0 * SY); im.children.forEach(c => c.material.color.set(I.real ? 0xf97316 : 0xfdba74)); }
    for (let k = 0; k < 3; k++) { const r = R[k], ok = r && Math.abs(r.p1[1]) <= YL; inc[k].visible = out[k].visible = !!ok; vir[k].visible = !!(ok && r.v);
      if (ok) { inc[k].set(g(...r.p0), g(...r.p1)); out[k].set(g(...r.p1), g(...r.p2)); if (r.v) vir[k].set(g(...r.p1), g(...r.v)); } }
    lP.position.set(0, -1.4, 0); lF.position.set(f * SX, -1.4, 0); lC.position.set(2 * f * SX, -1.4, 0);
  },
  ro: { 'Image distance v': P => P.I.inf ? 'At infinity' : N(P.I.v) + ' cm', 'Magnification m': P => P.I.inf ? 'Very large' : N(P.I.m), Image: P => P.I.text },
  status: P => P.I.inf ? ['Image at infinity', false, 'warn'] : P.I.real ? ['Real image', true] : ['Virtual image', false, 'warn'],
  note: P => P.I.inf ? 'The object is at F, so the reflected rays leave parallel and the image forms at infinity.'
    : `<b>1/v + 1/u = 1/f</b>: 1/v = 1/${Q(P.fs)} − 1/${Q(P.us)}, so v = <b>${N(P.I.v)} cm</b>. <b>m = −v/u</b> = ${N(P.I.m)}. ${P.I.text}.`,
  try: ['Set f = 10 cm. Move the object from 60 cm down to 5 cm. Note each image.', 'Put the object exactly at F. What happens to the image?', 'Switch to Convex. Can you ever get a real image?'],
  key: ['Sign convention: measure from the pole; +x is the direction of the light.', 'Concave mirror f is negative; convex mirror f is positive.', 'Mirror formula: 1/v + 1/u = 1/f. Magnification: m = −v/u.', 'm is negative for real, inverted images and positive for virtual, erect ones.'],
  quiz: [{ q: 'An object at C of a concave mirror gives an image that is…', o: ['real, inverted, same size', 'virtual, erect, enlarged', 'real, inverted, enlarged'], a: 0, why: 'At C the image is also at C, real and the same size.' }, { q: 'Object 30 cm from a concave mirror with f = −10 cm. Image distance v =', o: ['−15 cm', '+15 cm', '−7.5 cm'], a: 0, why: '1/v = 1/(−10) − 1/(−30) = −1/15.' }, { q: 'A convex mirror always forms an image that is…', o: ['real and inverted', 'virtual, erect and diminished', 'virtual and enlarged'], a: 1, why: 'The rays only seem to meet behind the mirror.' }]
};
