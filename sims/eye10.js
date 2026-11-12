// Class 10 · Ch 11 Human Eye and Colourful World — defects of vision and their correction. Eye lens accommodates (ciliary muscles change its thickness).
import { S, V, box, sph, beam, THREE, label } from '../scene.js';
const EYE = ['Normal', 'Short-sighted', 'Long-sighted'], DIST = [10, 25, 50, 100, 200, 500, 1e5], DN = ['10 cm', '25 cm', '50 cm', '1 m', '2 m', '5 m', 'Far away'];
const RET = 2.5, FMIN = [1 / (1 / 25 + 1 / RET), 1 / (1 / 12 + 1 / RET), 1 / (1 / 100 + 1 / RET)], FMAX = [RET, 1 / (1 / 100 + 1 / RET), RET], FC = [0, -100, 100 / 3];   // cm: near / far limits of the eye lens · corrective lens
const K = 1.6, YR = 1.2;                                                                                             // scene units per cm in the eyeball · ray height at the lens
let ball, lens, ret, cm1, cm2, cor, rI, rC, rO, lL, lR, lC, lM;
const sgn = x => (x < 0 ? '−' : '') + Math.abs(x);
const lathe = (sx) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: .6 })); m.scale.set(...sx); S.add(m); return m; };
export default {
  title: 'Defects of the Human Eye', cam: { d: 13, e: 0, a: 0, t: V(-2, 0, 0), ref: 2 },
  head: 'Image falls',
  sliders: [{ k: 'e', l: 'Eye', min: 1, max: 3, step: 1, v: 2, names: EYE }, { k: 'd', l: 'Object distance', min: 1, max: 7, step: 1, v: 7, names: DN, axis: true }],
  toggles: [{ k: 'cor', l: 'Corrective lens', v: false, w: P => P.e !== 1 }],
  setup() {
    ball = sph(2.1, 0xe2e8f0); ball.material = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: .3 }); ball.position.set(1.9, 0, 0);
    ret = new THREE.Mesh(new THREE.TorusGeometry(2.1, .1, 8, 32, 2.2), new THREE.MeshBasicMaterial({ color: 0xf87171 })); ret.rotation.z = -1.1; ret.position.set(1.9, 0, 0); S.add(ret);
    lens = lathe([.5, 1.2, .8]); cm1 = box(.5, .5, .8, 0xa16207); cm2 = box(.5, .5, .8, 0xa16207); cor = lathe([.4, 1.6, 1]); cor.position.x = -2.2;
    rI = [0, 1].map(() => beam(0xfde047, .05)); rC = [0, 1].map(() => beam(0xfde047, .05)); rO = [0, 1].map(() => beam(0xfde047, .05));
    lC = label('Cornea', '#e2e8f0', .9); lL = label('Eye lens', '#7dd3fc', .9); lR = label('Retina', '#fca5a5', .9); lM = label('Ciliary muscles', '#fdba74', .9);
  },
  reset() {},
  step(dt, P) {
    const t = P.e - 1, dT = DIST[P.d - 1], corr = P.cor && t > 0, fc = FC[t];
    let Dv = dT, sl = YR / Math.max(12, dT * K);                                                                     // distance the eye "sees" (virtual image of the object if corrected)
    if (corr) { const v = 1 / (1 / fc + 1 / -dT); Dv = Math.abs(v); sl = sl - YR / (fc * K); }
    const fNeed = 1 / (1 / Dv + 1 / RET), f = Math.min(FMAX[t], Math.max(FMIN[t], fNeed)), v = 1 / (1 / f - 1 / Dv), dv = v - RET;
    P.v = v; P.where = Math.abs(dv) < .03 ? 'On retina' : dv < 0 ? 'In front of retina' : 'Behind retina'; P.clear = Math.abs(dv) < .03; P.f = f;
    const th = .4 + (RET - f) * 1.6; lens.scale.set(th, 1.2, .8); lens.position.set(0, 0, 0); cm1.position.set(0, 1.9 - (th - .4) * .4, 0); cm2.position.set(0, -1.9 + (th - .4) * .4, 0);
    cor.visible = corr; if (corr) { cor.geometry.dispose?.(); cor.scale.set(fc > 0 ? .4 : .25, 1.6, 1); cor.material.color.set(fc > 0 ? 0x7dd3fc : 0xc4b5fd); }
    const xi = 4 + (v - RET) * K * 8;                                                                            // drawn 8 times exaggerated so the miss is visible
    [1, -1].forEach((s, k) => { const y = YR * s, y0 = y * (1 - 5.8 / Math.max(12, dT * K)), ya = y + sl * s * 2.2;
      rI[k].set(V(-8, y0, 0), V(-2.2, y, 0)); rC[k].set(V(-2.2, y, 0), V(0, ya, 0)); rO[k].set(V(0, ya, 0), V(4, ya * (1 - 4 / xi), 0)); });
    lC.position.set(-.6, 3, 0); lL.position.set(0, -3.1, 0); lR.position.set(5.2, 2.6, 0); lM.position.set(-1.6, 3.9, 0);
  },
  ro: { 'Image falls': P => P.where, 'Eye lens': P => P.f > 2.42 ? 'Thin (relaxed)' : P.f < 2.3 ? 'Thick (tense)' : 'Medium' },
  status: P => P.clear ? ['Clear', true] : ['Blurred', false, 'warn'],
  note: P => P.e === 1 ? (P.clear ? 'A normal eye focuses on the retina from 25 cm to infinity. The ciliary muscles change the lens thickness.' : 'Closer than the near point (25 cm) the normal eye cannot focus. The image falls behind the retina.')
    : P.e === 2 ? (P.cor ? 'A concave lens spreads the rays first, so the image moves back onto the retina.' : 'Short-sighted (myopia): far objects focus in front of the retina. A concave lens corrects it.')
    : (P.cor ? 'A convex lens converges the rays first, so near objects focus on the retina.' : 'Long-sighted (hypermetropia): near objects focus behind the retina. A convex lens corrects it.'),
  try: ['Normal eye: move the object from far away to 10 cm. Where does it become blurred?', 'Short-sighted, Far away: turn the corrective lens on and off.', 'Long-sighted at 25 cm: what changes with the convex lens?'],
  key: ['Near point is 25 cm; far point is infinity for a normal eye.', 'Accommodation: ciliary muscles change the focal length of the eye lens.', 'Myopia needs a concave lens; hypermetropia needs a convex lens.', 'Lens power P = 1/f in dioptre; concave lenses have negative power.', '<b>Presbyopia</b>: with age the near point moves away, so reading is hard; bifocal lenses (concave on top, convex below) correct it.'],
  quiz: [{ q: 'A short-sighted person cannot see distant objects clearly because the image forms…', o: ['in front of the retina', 'behind the retina', 'on the retina'], a: 0, why: 'The eye lens is too strong or the eyeball too long.' }, { q: 'Which lens corrects hypermetropia?', o: ['Concave', 'Convex', 'Cylindrical'], a: 1, why: 'A convex lens adds converging power.' }, { q: 'The near point of a normal eye is…', o: ['25 cm', '2.5 cm', '100 cm'], a: 0, why: 'The least distance of distinct vision is about 25 cm.' }]
};
