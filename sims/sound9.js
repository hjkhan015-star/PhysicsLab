// Class 9 · Ch 12 Sound — SOUND WAVE: the Monitor scope shows the wave itself in a fixed 20 ms window (more waves fit as f rises); the 3D air shows compressions, rarefactions and the wavelength λ.
import { S, V, box, beam, sph, mat, THREE, beep, label } from '../scene.js';
const TABS = [['sound9', 'Wave'], ['waves9', 'Types'], ['spread9', 'Spread'], ['echo9', 'Echo']];
const F = [10, 50, 100, 250, 500, 1000, 2000, 5000, 20000, 25000], FN = F.map(f => (f >= 1000 ? f / 1000 + ' kHz' : f + ' Hz')), MED = ['Air', 'Water', 'Steel'], VS = [340, 1500, 5960];
const N = 80, RW = 4, DP = 3, DX = .33, X0 = -13.2, VSC = 3, WIN = 20, B = [.38, .58, 1], R = [1, .35, .35];
let pos, col, geo, mark, t1, t2, cone, red, lw, lc, lr, ph;
const lam = P => VS[P.md - 1] / F[P.f - 1];
const lamD = l => 1.8 + .8 * (Math.pow(l, .25) - .287);                       // wavelength drawn on screen (not to scale)
const rng = f => f < 20 ? 'Infrasonic' : f > 20000 ? 'Ultrasonic' : 'Audible';
const fmt = l => l >= 1 ? +l.toPrecision(3) + ' m' : l >= .01 ? +(l * 100).toPrecision(3) + ' cm' : +(l * 1000).toPrecision(3) + ' mm';
const fmtT = s => s >= 1 ? +s.toPrecision(3) + ' s' : s >= .001 ? +(s * 1000).toPrecision(3) + ' ms' : +(s * 1e6).toPrecision(3) + ' µs';
export default {
  title: 'Sound Wave — f, T, A and λ', tabs: TABS, cam: { d: 18, e: .16, a: .1, t: V(-1.8, 3, 0), ref: 2 }, head: 'Wavelength λ',
  sliders: [{ k: 'f', l: 'Frequency f', min: 1, max: 10, step: 1, v: 5, names: FN, axis: true }, { k: 'am', l: 'Amplitude A (loudness)', min: 1, max: 6, step: 1, v: 3 }, { k: 'md', l: 'Medium', min: 1, max: 3, step: 1, v: 1, names: MED }],
  buttons: [{ l: '🔊 Hear it', fn: P => { const f = F[P.f - 1]; if (f >= 20 && f <= 20000) beep(f, .04, 1); } }],
  setup() {
    const g = box(27, 3.8, 3.4, 0x93c5fd); g.material = mat(0x93c5fd, { transparent: true, opacity: .1 }); g.position.set(0, 1.9, 0);
    pos = new Float32Array(N * RW * DP * 3); col = new Float32Array(N * RW * DP * 3); geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    S.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: .36, vertexColors: true })));
    box(1.6, 3.4, 3.2, 0x7c3aed).position.set(X0 - 2.1, 1.9, 0); cone = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.5, 24), mat(0xc4b5fd)); cone.rotation.z = Math.PI / 2; S.add(cone);
    red = sph(.3, 0xef4444); mark = beam(0xfde047, .09); t1 = beam(0xfde047, .09); t2 = beam(0xfde047, .09);
    lw = label('', '#fde047', 1.3); lc = label('Compression', '#fca5a5', 1.1); lr = label('Rarefaction', '#a5b4fc', 1.1); label('red particle: stays near its place', '#fca5a5', 1).position.set(0, -1.8, 0); label('Slowed down so you can see it', '#cbd5e1', 1).position.set(0, -2.9, 0);
    
  },
  reset() { ph = 0; },
  step(dt, P) {
    ph += dt; const l = lam(P), ld = lamD(l), k = 2 * Math.PI / ld, w = k * VSC, A = Math.min(.42, .45 / k) * (.35 + .65 * P.am / 6), kc = .4 + .6 * P.am / 6; P.l = l; let j = 0;
    for (let r = 0; r < RW; r++) for (let d = 0; d < DP; d++) for (let i = 0; i < N; i++) { const x0 = X0 + i * DX, phi = k * x0 - w * ph, t = .5 - .5 * kc * Math.cos(phi);
      pos[j] = x0 + A * Math.sin(phi); pos[j + 1] = .6 + r * .85; pos[j + 2] = (d - 1) * .9; col[j] = B[0] + t * (R[0] - B[0]); col[j + 1] = B[1] + t * (R[1] - B[1]); col[j + 2] = B[2] + t * (R[2] - B[2]); j += 3; }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    cone.position.set(X0 - 1 + A * Math.sin(k * X0 - w * ph) * 1.4, 1.9, 0); red.position.set(A * Math.sin(-w * ph), 1.45, 0);
    let x1 = X0 + ld + (((w * ph + Math.PI) / k) % ld); if (x1 + ld > 12.5) x1 -= ld; const x2 = x1 + ld; lc.position.set(x1, 4.7, 0); lr.position.set(x1 + ld / 2, -.6, 0);
    mark.set(V(x1, 6.7, 0), V(x2, 6.7, 0)); t1.set(V(x1, 6.35, 0), V(x1, 7.05, 0)); t2.set(V(x2, 6.35, 0), V(x2, 7.05, 0)); lw.position.set(0, 8, 0); lw.set('λ = ' + fmt(l) + '  (compression to compression)');
  },
  graph: P => { const f = F[P.f - 1], A = P.am, T = 1000 / f, pts = [];
    if (f * WIN / 1000 <= 40) for (let i = 0; i <= 300; i++) { const t = WIN * i / 300; pts.push([t, A * Math.sin(2 * Math.PI * f * t / 1000 - ph * 3)]); } else for (let i = 0; i <= 160; i++) pts.push([WIN * i / 160, (i % 2 ? -1 : 1) * A]);
    const g = { pts, xmax: WIN, ymin: -8, ymax: 8, xl: 'time (ms) · window fixed at 20 ms', yl: 'amplitude', color: '#38bdf8' }; if (T <= WIN) g.ref = [[0, 7], [T, 7]]; return g; },
  ro: { 'Wavelength λ': P => fmt(P.l), 'Frequency f': P => FN[P.f - 1], 'Time period T': P => fmtT(1 / F[P.f - 1]), 'Amplitude A': P => P.am, 'Speed v': P => VS[P.md - 1] + ' m/s' },
  status: P => { const r = rng(F[P.f - 1]); return [r, r === 'Audible', r === 'Audible' ? '' : 'warn']; },
  note: P => { const f = F[P.f - 1], c = f * WIN / 1000; return `<b>T = 1 ÷ f</b> = ${fmtT(1 / f)}. <b>λ = v ÷ f</b> = ${VS[P.md - 1]} ÷ ${f} = <b>${fmt(P.l)}</b>. About ${c < 1 ? 'a part of one wave' : +c.toPrecision(2) + ' waves'} fit in the 20 ms scope. Bigger <b>amplitude</b> = louder sound (taller wave, stronger compressions).`; },
  try: ['Raise the frequency. Count how many waves fit in the scope. What happens to T and λ?', 'Keep f. Raise the amplitude. What changes in the scope, and what stays the same?', 'Set 1 kHz, then change Medium. Why does λ grow in Water and Steel?'],
  key: ['Sound is a <b>longitudinal wave</b> of compressions (crowded) and rarefactions (spread out).', '<b>Frequency f</b> = vibrations per second (Hz). <b>Time period T</b> = 1 ÷ f. <b>Amplitude A</b> = greatest displacement from rest; larger A means a louder sound.', '<b>Wavelength λ</b> = distance between two neighbouring compressions (or rarefactions). <b>v = f × λ</b>.', 'Humans hear 20 Hz to 20 000 Hz. Below is infrasonic, above is ultrasonic. Particles only vibrate to and fro; they do not travel with the wave.'],
  quiz: [{ q: 'A wave has f = 500 Hz and λ = 0.68 m. Its speed is…', o: ['340 m/s', '735 m/s', '0.00136 m/s'], a: 0, why: 'v = f × λ = 500 × 0.68 = 340 m/s.' }, { q: 'A sound has f = 250 Hz. Its time period is…', o: ['0.004 s', '250 s', '0.25 s'], a: 0, why: 'T = 1 ÷ f = 1 ÷ 250 = 0.004 s = 4 ms.' }, { q: 'Increasing the amplitude of a sound makes it…', o: ['higher pitched', 'louder', 'faster'], a: 1, why: 'Amplitude relates to loudness; frequency relates to pitch.' }]
};
