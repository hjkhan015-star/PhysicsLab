// Class 8 · Ch 16 Light — "Inside our eyes": how the pupil handles bright and dark.
import { S, V, box, sph, beam, mat, THREE, label } from '../scene.js';
const LIGHT = ['Dark', 'Dim', 'Normal', 'Bright', 'Very bright'], FR = [.7, .58, .45, .33, .22], RAYS = [-.8, 0, .8], IRIS = 1.4;
let pupil, ball, lens, irT, irB, ret, rA, rB, f, lp, li, lc, lr, ll;
const disc = (r, c, z) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: c })); m.position.z = z; S.add(m); return m; };
export default {
  title: 'Inside Our Eyes', cam: { d: 12.5, e: 0, a: 0, t: V(-.3, 0, 0), ref: 2 },
  head: 'Pupil',
  sliders: [{ k: 'L', l: '💡 Room light', min: 1, max: 5, step: 1, v: 3, names: LIGHT, axis: true }],
  setup() {
    disc(2.4, 0xf1f5f9, 0).position.x = -5; disc(IRIS, 0x92400e, .02).position.x = -5; pupil = disc(1, 0x020617, .04); pupil.position.x = -5;
    ball = sph(2.3, 0xe2e8f0); ball.material = mat(0xe2e8f0, { transparent: true, opacity: .35 }); ball.position.set(4.5, 0, 0);
    lens = sph(1, 0x38bdf8); lens.scale.set(.3, 1.05, .7); lens.position.set(3.2, 0, 0);
    irT = box(.35, 1, 1.4, 0x92400e); irB = box(.35, 1, 1.4, 0x92400e); irT.position.x = irB.position.x = 2.7;
    ret = new THREE.Mesh(new THREE.TorusGeometry(2.3, .1, 8, 32, 2.3), new THREE.MeshBasicMaterial({ color: 0xf87171 })); ret.rotation.z = -1.15; ret.position.set(4.5, 0, 0); S.add(ret);
    rA = RAYS.map(() => beam(0xfde047, .06)); rB = RAYS.map(() => beam(0xfde047, .06));
    lp = label('Pupil', '#e2e8f0', .8); lp.position.set(-5, -3.1, 0); li = label('Iris', '#fdba74', .8); li.position.set(-5, 3.1, 0);
    lc = label('Cornea (clear front)', '#e2e8f0', .8); lc.position.set(1.4, 3.6, 0); ll = label('Lens (focuses light)', '#7dd3fc', .8); ll.position.set(4.2, -3.5, 0); lr = label('Retina (screen)', '#fca5a5', .8); lr.position.set(8, 2.4, 0);
  },
  reset() { f = FR[2]; },
  step(dt, P) {
    const tg = FR[P.L - 1]; f += (tg - f) * Math.min(1, dt * 3); P.f = f; const pr = IRIS * f; pupil.scale.setScalar(pr);
    irT.scale.y = irB.scale.y = 1; irT.position.y = pr + .5; irB.position.y = -pr - .5;
    const col = new THREE.Color(0xfde047).multiplyScalar(.2 + .8 * (P.L - 1) / 4);
    RAYS.forEach((y, i) => { const ok = Math.abs(y) <= pr; rA[i].material.color.copy(col); rB[i].material.color.copy(col); rA[i].set(V(.2, y, 0), V(ok ? 3.2 : 2.5, y, 0)); rB[i].visible = ok; if (ok) rB[i].set(V(3.2, y, 0), V(6.8, 0, 0)); });
  },
  ro: { Pupil: P => P.f > .5 ? 'Big' : P.f > .3 ? 'Medium' : 'Small' },
  status: P => P.L < 3 ? ['Letting in more light', true] : P.L > 3 ? ['Letting in less light', true] : ['Medium light', true],
  note: P => P.f > .5 ? 'In dim light the pupil grows big. More light can enter.' : P.f > .3 ? 'The pupil is medium. It changes size when the light changes.' : 'In bright light the pupil gets small. Less light enters, so the eye stays safe.',
  try: [{ t: 'Set the light to <b>Dark</b>. Watch the pupil.', check: P => P.L === 1 && P.f > .6, yes: 'Yes! In the dark the pupil grows big.' },
    { t: 'Set it to <b>Very bright</b>. What changed?', check: P => P.L === 5 && P.f < .3, yes: 'Yes! In bright light the pupil is small.' },
    { t: 'Move the light to <b>Dim</b>. Is the pupil big or small?', check: P => P.L === 2 && P.f > .5, yes: 'Yes! Less light, bigger pupil.' }],
  key: ['The pupil is the black hole in the eye. It lets light in.', 'Rest your eyes often.', 'Read in enough light.', 'Do not rub your eyes.'],
  quiz: [{ q: 'In bright light the pupil becomes…', o: ['smaller', 'bigger', 'square'], a: 0, why: 'A small pupil lets less light in.' }, { q: 'Which part is like a screen at the back of the eye?', o: ['Lens', 'Retina', 'Cornea'], a: 1, why: 'The retina catches the picture.' }]
};
