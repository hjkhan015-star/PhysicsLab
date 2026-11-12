// Class 8 · Sound — vibrations, loudness (amplitude) and pitch (frequency). Slowed down so you can see it.
import { S, V, box, THREE, beep, label } from '../scene.js';
const LOUD = ['Whisper', 'Soft', 'Medium', 'Loud', 'Very loud'], PITCH = ['Very low', 'Low', 'Medium', 'High', 'Very high'], HZ = [130, 260, 440, 660, 880], LAM = [10, 7, 5, 3.5, 2.5];
const N = 90, ROWS = 3, DX = .3; let pos, geo, src, t;
export default {
  title: 'Sound — Vibrations', cam: { d: 22, e: .12, a: 0, t: V(0, 1.6, 0) },
  head: 'Shakes per second',
  sliders: [{ k: 'a', l: '🔈 Loudness', min: 1, max: 5, step: 1, v: 3, names: LOUD }, { k: 'p', l: '🎵 Pitch', min: 1, max: 5, step: 1, v: 3, names: PITCH }],
  setup() {
    src = box(.8, 3, 2.5, 0xa855f7); src.position.set(-14.5, 1.6, 0); label('Speaker', '#d8b4fe', .9).position.set(-14.5, 4.3, 0);
    pos = new Float32Array(N * ROWS * 3); geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    S.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x93c5fd, size: .35 })));
  },
  reset() { t = 0; },
  step(dt, P) {
    t += dt; const k = 2 * Math.PI / LAM[P.p - 1], w = k * 4, A = .09 * P.a;       // wave speed 4 units/s
    for (let r = 0; r < ROWS; r++) for (let i = 0; i < N; i++) { const x0 = -13.5 + i * DX, j = (r * N + i) * 3;
      pos[j] = x0 + A * Math.sin(k * x0 - w * t); pos[j + 1] = .6 + r * 1.0; pos[j + 2] = 0; }
    geo.attributes.position.needsUpdate = true; src.position.x = -14.5 + A * Math.sin(-w * t);
  },
  buttons: [{ l: '🔊 Hear it', fn: P => { beep(HZ[P.p - 1], .03 * P.a + .02, 1.3); if (P.p <= 2) P.lo = true; if (P.p >= 4) P.hi = true; } }],
  ro: { 'Shakes per second': P => HZ[P.p - 1] + ' Hz' },
  note: () => 'Sound is made by <b>vibrations</b> (shaking). Bigger shakes sound louder; faster shakes sound higher.',
  try: [{ t: 'Turn <b>Loudness</b> up. What changes: the size of the shake or its speed?', check: P => P.a === 5, yes: 'Yes! A bigger shake is louder.' },
    { t: 'Turn <b>Pitch</b> up. Do the shakes get faster?', check: P => P.p === 5, yes: 'Yes! More shakes per second is a higher pitch.' },
    { t: 'Press <b>🔊 Hear it</b> at low and high pitch. Which sounds thinner?', check: P => P.lo && P.hi, yes: 'Yes! High sounds are thin.' }],
  key: ['Sound needs air, water or a solid. It cannot cross empty space (<b>vacuum</b>).', '<b>Frequency</b> is shakes per second. Its unit is hertz (Hz).', 'People hear 20 to 20,000 Hz. Lower is infrasound, higher is ultrasound.', 'Loud, unpleasant sound is noise. Too much of it is noise pollution.'],
  quiz: [{ q: 'What makes the pitch of a sound higher?', o: ['A bigger shake', 'Faster shakes (more per second)', 'A heavier speaker'], a: 1, why: 'More shakes per second make a higher pitch.' }, { q: 'Can sound travel through a vacuum?', o: ['Yes', 'No', 'Only through water'], a: 1, why: 'Sound needs air, water or a solid.' }]
};
