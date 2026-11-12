// Class 9 · Ch 12 Sound — transverse and longitudinal waves side by side in one sim: v = f × λ.
import { S, V, mat, THREE, label, arrow, sph } from '../scene.js';
const N = 110, ROWS = 4, X0 = -13, DX = 26 / (N - 1);
let pos, geo, mark, ph, dirA, lw;
export default {
  title: 'Waves — Transverse and Longitudinal', cam: { d: 19, e: .05, a: 0, t: V(0, 2.2, 0), ref: 2 },
  head: 'Wave speed v',
  sliders: [{ k: 'ty', l: 'Wave type', min: 1, max: 2, step: 1, v: 1, names: ['Transverse', 'Longitudinal'] }, { k: 'f', l: 'Frequency', min: .5, max: 2, step: .5, v: 1, u: 'Hz' }, { k: 'L', l: 'Wavelength', min: 2, max: 8, step: 1, v: 4, u: 'm' }],
  setup() {
    pos = new Float32Array(N * ROWS * 3); geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    S.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x93c5fd, size: .32 }))); mark = sph(.32, 0xef4444); dirA = arrow(0xfacc15, .1);
    lw = label('', '#fde047', 1.2); label('wave moves this way', '#fde047', 1).position.set(0, 7.3, 0); label('red particle: watch how it moves', '#fca5a5', 1).position.set(0, -1.3, 0);
  },
  reset() { ph = 0; },
  step(dt, P) {
    ph += dt; const k = 2 * Math.PI / P.L, w = 2 * Math.PI * P.f, tr = P.ty === 1, A = tr ? .8 : Math.min(.45, .45 / k * 1.6);
    for (let r = 0; r < ROWS; r++) for (let i = 0; i < N; i++) { const x0 = X0 + i * DX, d = A * Math.sin(k * x0 - w * ph), j = (r * N + i) * 3;
      pos[j] = x0 + (tr ? 0 : d); pos[j + 1] = .6 + r * 1.15 + (tr ? d : 0); pos[j + 2] = 0; }
    geo.attributes.position.needsUpdate = true;
    const d0 = A * Math.sin(-w * ph); mark.position.set(tr ? 0 : d0, 2.35 + (tr ? d0 : 0), 0);   // the red particle (x0 = 0, second row)
    dirA.set(-3, 6.3, 6, 1, 0); P.v = P.f * P.L; lw.position.set(0, 8.4, 0); lw.set(P.ty === 1 ? 'Particles move UP and DOWN' : 'Particles move LEFT and RIGHT');
  },
  ro: { 'Wave speed v': P => P.v.toFixed(1) + ' m/s', 'Frequency f': P => P.f + ' Hz', 'Wavelength λ': P => P.L + ' m', 'Time period T': P => (1 / P.f).toFixed(2) + ' s' },
  status: P => [P.ty === 1 ? 'Transverse: motion ⟂ wave' : 'Longitudinal: motion ∥ wave', true],
  note: P => P.ty === 1 ? `Each particle moves up and down <b>at right angles</b> to the way the wave travels. <b>v = f × λ</b> = ${P.f} × ${P.L} = <b>${P.v.toFixed(1)} m/s</b>.` : `Each particle moves back and forth <b>along</b> the way the wave travels, making compressions and rarefactions. <b>v = f × λ</b> = ${P.f} × ${P.L} = <b>${P.v.toFixed(1)} m/s</b>.`,
  try: ['Watch the red particle in each wave type. Which way does it move compared with the yellow arrow?', 'Double the frequency, keep λ. What happens to v?', 'Set Longitudinal. Find a compression (crowded) and a rarefaction (spread out).'],
  key: ['<b>Transverse wave</b>: particles vibrate at right angles to the direction of the wave. Examples: ripples on water, waves on a string, light.', '<b>Longitudinal wave</b>: particles vibrate along the direction of the wave. Sound in air is one.', 'Wavelength λ is the distance between two neighbouring crests (or two compressions).', '<b>v = f × λ</b> holds for every wave.'],
  quiz: [{ q: 'Sound in air is a…', o: ['transverse wave', 'longitudinal wave', 'wave that needs no medium'], a: 1, why: 'Air particles move back and forth along the wave.' }, { q: 'A wave has f = 2 Hz and λ = 3 m. Its speed is…', o: ['1.5 m/s', '5 m/s', '6 m/s'], a: 2, why: 'v = f × λ = 2 × 3 = 6 m/s.' }, { q: 'In a transverse wave the particles move…', o: ['along the wave', 'at right angles to the wave', 'not at all'], a: 1, why: 'That is what transverse means.' }]
};
