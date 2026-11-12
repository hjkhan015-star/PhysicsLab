// Class 9 · Ch 12 Sound — the human ear (basic outline): follow a sound from the outer ear to the brain.
import { V, box, sph, label, mat } from '../scene.js';
const NAMES = ['Outer ear', 'Ear canal', 'Eardrum', 'Three small bones', 'Cochlea', 'Auditory nerve'];
const X = [-11.5, -7.5, -3.8, -.3, 3.8, 8.2], COL = [0xfdba74, 0xfcd34d, 0xf9a8d4, 0xcbd5e1, 0x86efac, 0xfde047];
const NOTE = ['The outer ear (pinna) collects sound waves and sends them into the ear canal.', 'Sound travels along the ear canal to the eardrum.', 'The sound waves make the thin eardrum vibrate.', 'Three tiny bones (hammer, anvil, stirrup) pass the vibrations on and make them stronger.', 'In the fluid-filled cochlea the vibrations become electrical signals.', 'The auditory nerve carries the signals to the brain, which tells us we heard a sound.'];
let parts = [], pulse, lab, ph, brain;
export default {
  title: 'The Human Ear', cam: { d: 19, e: .1, a: 0, t: V(.5, 1.8, 0), ref: 2 },
  head: 'Part',
  sliders: [{ k: 's', l: 'Follow the sound to', min: 1, max: 6, step: 1, v: 1, names: NAMES, axis: true }],
  setup() {
    parts = [box(2.4, 4, 1.2, 0xfdba74), box(4.6, 1.1, 1.1, 0xfcd34d), box(.35, 3.2, 1.2, 0xf9a8d4), box(2.4, 1.1, 1, 0xcbd5e1), sph(1.5, 0x86efac), box(3.6, .35, .35, 0xfde047)];
    parts.forEach((p, i) => p.position.set(X[i], 1.5, 0)); parts[4].position.y = 1.5; brain = sph(1.7, 0xf0abfc); brain.position.set(12, 1.5, 0);
    pulse = sph(.45, 0xfacc15); lab = label('', '#fff', 1.4); label('Brain', '#f0abfc', 1.1).position.set(12, 4, 0);
    for (let i = 0; i < 3; i++) box(.55, .55, .5, 0xe2e8f0).position.set(-1.4 + i * 1.1, 3.1, .2);    // the three small bones drawn above their box
  },
  reset() { ph = 0; },
  step(dt, P) {
    ph += dt * .45; const n = P.s - 1, x0 = -14, x1 = X[n] - 1.2, f = ph % 1.4, u = Math.min(1, f / 1);
    pulse.position.set(x0 + (x1 - x0) * u, 1.5, .8); pulse.scale.setScalar(f > 1 ? 0 : .7 + .3 * Math.sin(ph * 30));
    parts.forEach((p, i) => { const on = i <= n; p.material.color.set(on ? COL[i] : 0x334155); });
    brain.material.color.set(n === 5 ? 0xf0abfc : 0x334155);
    const i = n; if (i === 2 && f > .7) parts[2].position.x = X[2] + .15 * Math.sin(ph * 60); else parts[2].position.x = X[2];
    lab.position.set(X[n], 4.6, 0); lab.set(NAMES[n], '#fde047');
  },
  ro: { Part: P => NAMES[P.s - 1], Step: P => P.s + ' of 6' },
  status: P => [P.s === 6 ? 'Sound reaches the brain' : 'Sound on its way', true],
  note: P => NOTE[P.s - 1],
  try: ['Move the slider from 1 to 6. Which parts light up?', 'At the eardrum, watch it shake. Why must it be thin?', 'Say in order the six parts the sound passes through.'],
  key: ['Path of sound in the ear: <b>outer ear → ear canal → eardrum → three small bones → cochlea → auditory nerve → brain</b>.', 'The eardrum vibrates when sound waves hit it.', 'The three small bones (hammer, anvil, stirrup) pass on and strengthen the vibrations.', 'The cochlea changes vibrations into electrical signals; the auditory nerve takes them to the brain.'],
  quiz: [{ q: 'Which part vibrates first when sound waves arrive?', o: ['Cochlea', 'Eardrum', 'Auditory nerve'], a: 1, why: 'The thin eardrum is moved by the sound waves.' }, { q: 'Which part changes vibrations into electrical signals?', o: ['Cochlea', 'Ear canal', 'Outer ear'], a: 0, why: 'The cochlea makes signals for the nerve.' }, { q: 'The signals travel to the brain along the…', o: ['eardrum', 'auditory nerve', 'ear canal'], a: 1, why: 'The auditory nerve carries them.' }]
};
