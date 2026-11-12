// Class 10 · Ch 13 Magnetic Effects of Electric Current — the DC motor. Fleming's left-hand rule and the split-ring commutator.
import { S, V, box, mat, arrowTo, arrow, THREE, label } from '../scene.js';
const A = 1.6, ZL = 1.3, ZLEN = 2 * ZL;
let coil, ringA, ringB, magN, magS, fF, fB, fC, fL1, fL2, fl, fb, fc3, lF, lB, lC, th, om, ph;
const a3 = (color, w = .09) => { const g = new THREE.Group(), mk = geo => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })), sh = mk(new THREE.CylinderGeometry(w, w, 1, 8)), hd = mk(new THREE.ConeGeometry(w * 2.6, w * 6, 12)); g.add(sh, hd); S.add(g);
  g.set = (o, d, L) => { const v = new THREE.Vector3(...d).normalize(); g.position.set(...o); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v); const hl = Math.min(w * 6, L * .5); sh.scale.y = L - hl; sh.position.y = (L - hl) / 2; hd.position.y = L - hl / 2; hd.scale.y = hl / (w * 6); }; return g; };
const sgn = x => x < 0 ? -1 : 1;
export default {
  title: 'DC Motor — Fleming\'s Left-Hand Rule', cam: { d: 15, e: .45, a: .7, t: V(0, 0, 0), ref: 2 },
  head: 'Rotation',
  sliders: [{ k: 'I', l: 'Current', min: 0, max: 5, step: 1, v: 3, u: 'A' }],
  toggles: [{ k: 'rc', l: 'Reverse current', v: false }, { k: 'rm', l: 'Reverse magnet', v: false }],
  setup() {
    magN = box(2, 4.4, 3.4, 0xef4444); magS = box(2, 4.4, 3.4, 0x3b82f6); magN.position.set(-5.5, 0, 0); magS.position.set(5.5, 0, 0);
    coil = new THREE.Group(); const c = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: 0xd9822b })); m.position.set(x, y, z); coil.add(m); };
    c(.16, .16, ZLEN, A, 0, 0); c(.16, .16, ZLEN, -A, 0, 0); c(2 * A, .16, .16, 0, 0, ZL); c(2 * A, .16, .16, 0, 0, -ZL); S.add(coil);
    const arc = col => new THREE.Mesh(new THREE.TorusGeometry(.6, .14, 8, 20, Math.PI), new THREE.MeshStandardMaterial({ color: col })); ringA = arc(0xd9822b); ringB = arc(0xcbd5e1); ringA.position.z = ringB.position.z = ZL + .9; S.add(ringA, ringB);
    box(.3, .35, .5, 0x1e293b).position.set(0, .95, ZL + .9); box(.3, .35, .5, 0x1e293b).position.set(0, -.95, ZL + .9);
    fF = a3(0x22c55e); fB = a3(0x38bdf8); fC = a3(0xfde047); fL1 = arrowTo(0x22c55e, .1); fL2 = arrowTo(0x22c55e, .1); fb = arrow(0x38bdf8, .07);
    lF = label('Force', '#86efac', .9); lB = label('Field', '#7dd3fc', .9); lC = label('Current', '#fde047', .9); label('N', '#fca5a5', 1.2).position.set(-5.5, 3, 0); label('S', '#93c5fd', 1.2).position.set(5.5, 3, 0); label('Split ring + brushes', '#cbd5e1', .8).position.set(0, -2.4, ZL + .9);
  },
  reset() { th = .6; om = 0; ph = 0; },
  step(dt, P) {
    const sc = P.rc ? -1 : 1, sm = P.rm ? -1 : 1, Bx = sm, cs = Math.cos(th), sAB = sc * sgn(cs);                  // field along +x · current in side AB (flips every half turn at the commutator)
    const F = sAB * sm; const tq = P.I * Math.abs(cs) * sc * sm * (cs >= 0 ? 1 : 1);                                // torque ∝ I · |cosθ| (the commutator keeps the push in the same direction)
    om += (3 * tq - 2 * om) * dt; if (P.I === 0) om *= Math.max(0, 1 - 3 * dt); th += om * dt; P.om = om; P.sAB = sAB; coil.rotation.z = th;
    ringA.rotation.z = th; ringB.rotation.z = th + Math.PI;
    const ax = A * Math.cos(th), ay = A * Math.sin(th), L = .3 + P.I * .3;                                           // force on AB is along ±y, on CD the opposite
    fL1.visible = fL2.visible = P.I > 0; fL1.to(ax, ay, ax, ay + F * L * 1.4, 0); fL2.to(-ax, -ay, -ax, -ay - F * L * 1.4, 0);
    fb.set(sm > 0 ? -3.2 : 3.2, 3.2, 6.4, sm, 0);
    fF.set([7.6, -3.4, 0], [0, F, 0], 2); fB.set([7.6, -3.4, 0], [Bx, 0, 0], 2); fC.set([7.6, -3.4, 0], [0, 0, sAB], 2);                          // Fleming's three fingers
    lF.position.set(7.6, -3.4 + F * 2.5, 0); lB.position.set(7.6 + Bx * 2.7, -3.4, 0); lC.position.set(7.6, -3.4, sAB * 2.6);
  },
  ro: { Rotation: P => P.I === 0 || Math.abs(P.om) < .05 ? 'Stopped' : P.om > 0 ? 'Anticlockwise' : 'Clockwise', Speed: P => Math.abs(P.om) < .05 ? 'Stopped' : Math.abs(P.om) < 2.5 ? 'Slow' : 'Fast', 'Current in side AB': P => P.I === 0 ? 'None' : P.sAB > 0 ? 'Towards you' : 'Away from you' },
  status: P => Math.abs(P.om) < .05 ? ['Not turning', false, 'warn'] : ['Motor turning', true],
  note: P => P.I === 0 ? 'No current, no force: the coil does not turn. Raise the current.' : 'The magnet pushes the two sides in opposite directions, so the coil turns. The split ring reverses the current every half turn so it keeps turning the same way.',
  try: ['Raise the current. Does the motor turn faster?', 'Reverse the current. How does the direction change?', 'Reverse the magnet as well. What happens now?'],
  key: ['Fleming\'s left-hand rule: forefinger field, middle finger current, thumb force.', 'A current-carrying wire in a magnetic field feels a force.', 'The split-ring commutator reverses the current every half turn.', 'More current gives a stronger force and a faster motor.'],
  quiz: [{ q: 'In Fleming\'s left-hand rule the thumb shows…', o: ['force', 'current', 'field'], a: 0, why: 'Thumb = force (motion), forefinger = field, middle finger = current.' }, { q: 'The split-ring commutator…', o: ['reverses the current every half turn', 'stores charge', 'cools the coil'], a: 0, why: 'This keeps the torque in one direction.' }, { q: 'If both the current and the magnet are reversed, the coil turns…', o: ['the same way', 'the opposite way', 'not at all'], a: 0, why: 'Two reversals cancel.' }]
};
