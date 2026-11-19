// Class 9 · Ch 12 Sound — SOUND SPREADS IN 3D: every vibration sends a spherical shell of compression outwards, faster in water than in air. Not to scale, slowed down.
import { S, V, THREE, sph, mat, label, box } from '../scene.js';
const TABS = [['sound9', 'Wave'], ['waves9', 'Types'], ['spread9', 'Spread'], ['echo9', 'Echo']];
const FQ = [170, 340, 680], FN = ['Low', 'Middle', 'High'], VS = [340, 1500], MED = ['Air', 'Water'], SX = -6, LX = 6, RATE = 2, RMAX = 17, NS = 18;
let shells = [], lis, gr, tn = 0, nxt = 0, hit = 0;
const lam = P => VS[P.md - 1] / FQ[P.f - 1], sp = P => 1.2 * Math.pow(lam(P), .55);                 // gap between shells on screen (not to scale)
const fmt = l => l >= 1 ? +l.toPrecision(3) + ' m' : +(l * 100).toPrecision(3) + ' cm';
export default {
  title: 'Sound Spreads in 3D', tabs: TABS, cam: { d: 24, e: .5, a: .35, t: V(0, 0, 0) }, head: 'Speed of sound',
  sliders: [{ k: 'f', l: 'Pitch', min: 1, max: 3, step: 1, v: 2, names: FN }, { k: 'md', l: 'Medium', min: 1, max: 2, step: 1, v: 1, names: MED }],
  setup() {
    gr = new THREE.GridHelper(44, 22, 0x3a4a70, 0x24304d); gr.position.y = -2.6; S.add(gr);
    const sp0 = sph(.7, 0xa855f7); sp0.position.set(SX, 0, 0); lis = sph(.6, 0x38bdf8); lis.position.set(LX, 0, 0);
    label('speaker', '#d8b4fe', 1).position.set(SX, 1.9, 0); label('listener', '#7dd3fc', 1).position.set(LX, 1.9, 0);
    for (let i = 0; i < NS; i++) { const gm = new THREE.SphereGeometry(1, 28, 18), m = new THREE.Mesh(gm, new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: .1, depthWrite: false, side: THREE.DoubleSide })); m.add(new THREE.Mesh(gm, new THREE.MeshBasicMaterial({ color: 0xa5f3fc, wireframe: true, transparent: true, opacity: .5, depthWrite: false }))); m.position.set(SX, 0, 0); m.visible = false; m.userData.age = -1; S.add(m); shells.push(m); }
    label('Slowed down · not to scale', '#cbd5e1', 1).position.set(0, -3.6, 0);
  },
  reset() { tn = 0; nxt = 0; shells.forEach(s => { s.userData.age = -1; s.visible = false; }); },
  step(dt, P) {
    const g = sp(P), v = g * RATE; tn += dt; if (tn >= 1 / RATE) { tn = 0; const s = shells[nxt++ % NS]; s.userData.age = 0; s.visible = true; }
    let near = false; shells.forEach(s => { if (s.userData.age < 0) return; s.userData.age += dt; const r = .5 + v * s.userData.age; if (r > RMAX) { s.userData.age = -1; s.visible = false; return; }
      s.scale.setScalar(r); s.material.opacity = .05 * (1 - r / RMAX); s.children[0].material.opacity = .4 * (1 - r / RMAX); if (Math.abs(r - (LX - SX)) < .7) near = true; });
    hit = near ? .25 : Math.max(0, hit - dt); lis.scale.setScalar(1 + (near ? .4 : 0)); lis.material.color.setHex(near ? 0xfde047 : 0x38bdf8);
    P.v = VS[P.md - 1]; P.l = lam(P);
  },
  ro: { 'Speed of sound': P => P.v + ' m/s', 'Frequency f': P => FQ[P.f - 1] + ' Hz', 'Wavelength λ': P => fmt(P.l), 'Reaches 340 m in': P => (340 / P.v).toFixed(2) + ' s' },
  status: P => ['Sound spreads in all directions', true],
  note: P => `Each vibration sends out a growing shell of compression in <b>all directions</b>. The gap between shells is the wavelength: <b>λ = v ÷ f</b> = ${P.v} ÷ ${FQ[P.f - 1]} = <b>${fmt(P.l)}</b>. Sound is faster in <b>water</b> than in <b>air</b>, so the shells spread faster and sit further apart.`,
  try: ['Switch from Air to Water. What happens to the speed of the shells and to the gap between them?', 'Raise the pitch. What happens to the gap (wavelength)?', 'Watch the listener flash. How long would sound take to travel 340 m in air? In water?'],
  key: ['Sound travels in all directions from the source and needs a <b>medium</b> (solid, liquid or gas). It cannot travel through a vacuum.', 'Speed of sound: about <b>340 m/s in air</b>, <b>1500 m/s in water</b>, <b>5960 m/s in steel</b> (usually fastest in solids).', 'A higher frequency means a shorter wavelength in the same medium.', 'Speed of sound also rises when the air gets warmer.'],
  quiz: [{ q: 'Sound cannot travel through…', o: ['water', 'steel', 'a vacuum'], a: 2, why: 'Sound needs particles to vibrate.' }, { q: 'In which medium is sound usually fastest?', o: ['air', 'water', 'steel'], a: 2, why: 'Solids carry sound fastest.' }, { q: 'A source vibrates 340 times a second in air (v = 340 m/s). λ is…', o: ['1 m', '340 m', '0.5 m'], a: 0, why: 'λ = v ÷ f = 340 ÷ 340 = 1 m.' }]
};
