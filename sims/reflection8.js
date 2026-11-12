// Class 8 · Ch 16 Light — laws of reflection; regular (mirror) vs diffuse (rough wall) reflection.
import { S, V, D, THREE, mat, box, beam, label } from '../scene.js';
const L = 6.5; let mir, inc, rf, torch, lin, lout;
export default {
  title: 'Reflection — Bouncing Light', cam: { d: 14, e: .08, a: 0, t: V(0, 3.2, 0), ref: 1.3 },
  sliders: [{ k: 'i', l: '🔦 Torch angle', min: 0, max: 80, step: 5, v: 40, u: '°' }, { k: 's', l: '🪞 Surface', min: 1, max: 2, step: 1, v: 1, names: ['Smooth mirror', 'Rough wall'] }],
  setup() { mir = box(14, .3, 3, 0xcbd5e1); mir.position.y = -.15; beam(0x94a3b8, .04).set(V(0, 0), V(0, 7.2)); label('normal', '#cbd5e1', .8).position.set(0, 7.7, 0);
    inc = beam(0xfde047, .1); rf = [0, 1, 2, 3, 4, 5, 6].map(() => beam(0xfb923c, .08));
    torch = new THREE.Mesh(new THREE.CylinderGeometry(.4, .6, 1.7, 16), mat(0xfacc15, { emissive: 0x7a5a00 })); S.add(torch); lin = label('', '#fde047'); lout = label('', '#fb923c'); },
  reset() {},
  step(dt, P) {
    const i = P.i * D, a = V(-L * Math.sin(i), L * Math.cos(i)), rough = P.s === 2; inc.set(a, V());
    const n = a.clone().normalize(); torch.position.copy(a).addScaledVector(n, .85); torch.quaternion.setFromUnitVectors(V(0, 1, 0), n);
    rf.forEach((m, k) => { m.visible = rough || k === 3; if (m.visible) { const t = Math.max(-80 * D, Math.min(80 * D, i + (rough ? 2 * (k - 3) * 9 * D : 0))); m.set(V(), V(L * Math.sin(t), L * Math.cos(t))); } });
    mir.material.color.set(rough ? 0x8a7a6a : 0xdbe4ee); mir.material.metalness = rough ? 0 : .25; mir.material.roughness = rough ? .95 : .2; mir.material.emissive.set(rough ? 0x000000 : 0x2a3a52);
    lin.position.set(a.x / 2 - 1.5, a.y / 2 + .7, 0); lin.set(`in ${P.i}°`); lout.position.set(L * Math.sin(i) / 2 + 1.6, L * Math.cos(i) / 2 + .7, 0); lout.set(rough ? 'scattered' : `out ${P.i}°`);
  },
  head: 'Angle out',
  ro: { 'Angle out': P => P.s === 2 ? 'every way' : P.i + '°', 'Same?': P => P.s === 2 ? '❌ No' : '✅ Yes!' },
  note: P => P.s === 2 ? '<b>Rough wall:</b> bumps send light in every direction. We can see a wall from anywhere.'
    : P.i === 0 ? '<b>Straight in, straight back!</b> The light hits head-on.' : `The light hits at <b>${P.i}°</b> and leaves at <b>${P.i}°</b>. The two angles are always equal.`,
  try: [{ t: 'Move the torch to <b>0°</b>. Where does the light go?', check: P => P.s === 1 && P.i === 0, yes: 'Yes! It bounces straight back.' },
    { t: 'Set <b>60°</b>. What is the angle out?', check: P => P.s === 1 && P.i === 60, yes: 'Yes! The angle out is 60° too.' },
    { t: 'Switch to <b>Rough wall</b>. Where does the light go?', check: P => P.s === 2, yes: 'Yes! A rough wall scatters light.' }],
  key: ['The <b>normal</b> is the grey line standing straight up from the mirror.', 'Angle in equals angle out. The rays and normal lie in one plane.', 'Smooth surface: regular reflection. Rough surface: diffuse reflection, light scatters.', 'Mirror image: as far behind the mirror as you are in front, same size, flipped left to right. You cannot catch it on a screen.'],
  quiz: [{ q: 'A ray hits a mirror at 30° to the normal. The reflected ray leaves at…', o: ['60°', '30°', '0°'], a: 1, why: 'The two angles are always equal.' }, { q: 'Which gives diffuse reflection?', o: ['A mirror', 'Still water', 'A rough wall'], a: 2, why: 'Bumps send rays in many directions.' }]
};
