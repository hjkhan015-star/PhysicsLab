// Class 9 · Ch 12 Sound — a longitudinal wave: v = f × λ, and the audible range. Slowed down so you can see it.
import { S, V, box, beam, mat, THREE, beep, label } from '../scene.js';
const F = [10, 20, 100, 256, 512, 1000, 2000, 10000, 20000, 25000, 50000], FN = F.map(f => (f >= 1000 ? f / 1000 + ' kHz' : f + ' Hz')), MED = ['Air', 'Water', 'Steel'], VS = [340, 1500, 5960];
const N = 100, ROWS = 4, DX = .28, X0 = -13.9, VSCENE = 4;
let pos, geo, mark, lw, lc, lr, ph;
const lam = P => VS[P.md - 1] / F[P.f - 1];
const lamD = l => 1.8 + .8 * (Math.pow(l, .25) - .287);                       // wavelength drawn on screen (not to scale)
const rng = f => f < 20 ? 'Infrasonic' : f > 20000 ? 'Ultrasonic' : 'Audible';
const fmt = l => l >= 1 ? +l.toPrecision(3) + ' m' : l >= .01 ? +(l * 100).toPrecision(3) + ' cm' : +(l * 1000).toPrecision(3) + ' mm';
export default {
  title: 'Sound Waves — v = f × λ', cam: { d: 19, e: .1, a: 0, t: V(0, 3.2, 0), ref: 2 },
  head: 'Wavelength λ',
  sliders: [{ k: 'f', l: 'Frequency', min: 1, max: 11, step: 1, v: 4, names: FN, axis: true }, { k: 'md', l: 'Medium', min: 1, max: 3, step: 1, v: 1, names: MED }],
  buttons: [{ l: '🔊 Hear it', fn: P => { const f = F[P.f - 1]; if (f >= 20 && f <= 20000) beep(f, .04, 1); } }],
  setup() {
    const g = box(28.6, 3.6, 2.4, 0x93c5fd); g.material = mat(0x93c5fd, { transparent: true, opacity: .12 }); g.position.set(0, 1.9, 0);
    pos = new Float32Array(N * ROWS * 3); geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    S.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x93c5fd, size: .3 }))); mark = beam(0xfde047, .08);
    lw = label('', '#fde047', 1.3); lc = label('Compression', '#fca5a5', 1.1); lr = label('Rarefaction', '#a5b4fc', 1.1); label('Slowed down so you can see it', '#cbd5e1', 1.1).position.set(0, -1.1, 0);
  },
  reset() { ph = 0; },
  step(dt, P) {
    ph += dt; const l = lam(P), ld = lamD(l), k = 2 * Math.PI / ld, w = k * VSCENE, A = Math.min(.4, .45 / k); P.l = l;
    for (let r = 0; r < ROWS; r++) for (let i = 0; i < N; i++) { const x0 = X0 + i * DX, j = (r * N + i) * 3; pos[j] = x0 + A * Math.sin(k * x0 - w * ph); pos[j + 1] = .6 + r * .9; pos[j + 2] = 0; }
    geo.attributes.position.needsUpdate = true;
    const xc = X0 + ld + (((w * ph + Math.PI) / k) % ld), xr = xc + ld / 2 > 13 ? xc - ld / 2 : xc + ld / 2; lc.position.set(xc, 4.6, 0); lr.position.set(xr, 4.6 + 1.1, 0);
    mark.set(V(-10, 6.4, 0), V(-10 + ld, 6.4, 0)); lw.position.set(-10 + ld / 2, 7.3, 0); lw.set('one wavelength λ = ' + fmt(l));
  },
  ro: { 'Wavelength λ': P => fmt(P.l), 'Speed v': P => VS[P.md - 1] + ' m/s', 'Frequency f': P => FN[P.f - 1] },
  status: P => { const r = rng(F[P.f - 1]); return [r, r === 'Audible', r === 'Audible' ? '' : 'warn']; },
  graph: P => { const l = P.l, u = l >= 1 ? 1 : l >= .01 ? 100 : 1000, un = l >= 1 ? 'm' : l >= .01 ? 'cm' : 'mm', pts = [];
    for (let i = 0; i <= 120; i++) { const x = 3 * l * i / 120; pts.push([x * u, Math.sin(2 * Math.PI * (x / l) - ph * 2)]); }
    return { pts, xmax: 3 * l * u, ymin: -2, ymax: 2, xl: `distance (${un})`, yl: 'displacement', ref: [[0, 1.7], [l * u, 1.7]], color: '#38bdf8' }; },
  note: P => `<b>v = f × λ</b>, so λ = v ÷ f = ${VS[P.md - 1]} ÷ ${F[P.f - 1]} = <b>${fmt(P.l)}</b>. Higher frequency means a shorter wavelength.`,
  try: ['Keep Air. Raise the frequency. What happens to λ?', 'Set 1 kHz, then change Medium. Why does λ grow in Steel?', 'Find the frequencies where the pill turns Infrasonic and Ultrasonic.'],
  key: ['Sound is a longitudinal wave of compressions and rarefactions.', 'Amplitude is the greatest displacement of a particle from rest.', 'Time period T is the time for one vibration; T = 1 ÷ f.', 'Humans hear 20 Hz to 20 000 Hz. Below is infrasonic, above is ultrasonic.', 'In a <b>transverse</b> wave the particles move at right angles to the wave (water ripples, light). Sound is not transverse: its particles move back and forth along the wave.'],
  quiz: [{ q: 'A wave has f = 500 Hz and λ = 0.68 m. Its speed is…', o: ['340 m/s', '735 m/s', '0.00136 m/s'], a: 0, why: 'v = f × λ = 500 × 0.68 = 340 m/s.' }, { q: 'A sound of 10 Hz is…', o: ['Infrasonic', 'Audible', 'Ultrasonic'], a: 0, why: 'Below 20 Hz is infrasonic.' }, { q: 'Sound travels fastest in…', o: ['Air', 'Water', 'Steel'], a: 2, why: 'Solids carry sound fastest.' }]
};
