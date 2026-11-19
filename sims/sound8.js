// Class 8 · Ch 13 Sound — vibrations, loudness (amplitude) and pitch (frequency), slowed down so you can see them. Turn 🔊 Sound on to hear it.
// Only the vibrating part moves: the speaker's cone (not its box), the fork's prongs (not its handle), the string (not the guitar). Sound needs a medium: air, water — not empty space.
import { S, V, box, THREE, tone, label } from '../scene.js';
const LOUD = ['Whisper', 'Soft', 'Medium', 'Loud', 'Very loud'], PITCH = ['Very low', 'Low', 'Medium', 'High', 'Very high'], HZ = [110, 220, 440, 880, 1760], LAM = [10, 7, 5, 3.4, 2.4], GAIN = [.05, .11, .2, .36, .6];
const SRC = ['Speaker', 'Tuning fork', 'Guitar string'], KIND = ['speaker', 'fork', 'string'], MED = ['Air', 'Water', 'Empty space'], SPD = [340, 1500, 0], VIS = [1, 2.2, 1], MCOL = [0x93c5fd, 0x38bdf8, 0x93c5fd];
const N = 62, ROWS = 7, DX = .28, XS = -9.2, NS = 40, YC = 2.7; let col, trc, tf, lM, lS, pos, geo, pts, cab, cone, cap, ring, hand, fork, prA, prB, str, strG, sp, bodyG, lbl, lmed, t;
const sp0 = new Float32Array(NS * 3), TR = [], hh = (i, r) => Math.abs(Math.sin(i * 12.9898 + r * 78.233) * 43758.5453) % 1;
for (let i = 4; i < N; i += 10) TR.push(3 * N + i);                  // the particles we follow (yellow)
const tpos = new Float32Array(TR.length * 3);
export default {
  title: 'Sound — Vibrations', cam: { d: 18.5, e: .1, a: 0, t: V(-.2, 2.7, 0), ref: 1.5 }, head: 'Shakes per second',
  sliders: [{ k: 'a', l: '🔈 Loudness', min: 1, max: 5, step: 1, v: 3, names: LOUD }, { k: 'p', l: '🎵 Pitch', min: 1, max: 5, step: 1, v: 3, names: PITCH },
    { k: 'src', l: '🎸 Source', min: 1, max: 3, step: 1, v: 1, names: SRC, axis: true }, { k: 'm', l: '🌫 Medium', min: 1, max: 3, step: 1, v: 1, names: MED }],
  toggles: [{ k: 'snd', l: '🔊 Sound on', v: false }],
  setup() {
    cab = box(1.1, 5, 3.4, 0x1e293b); cab.position.set(XS - .6, YC, 0); ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .12, 8, 28), new THREE.MeshStandardMaterial({ color: 0x94a3b8 })); ring.rotation.y = Math.PI / 2; ring.position.set(XS - .02, YC, 0); S.add(ring);
    cone = new THREE.Mesh(new THREE.CylinderGeometry(1.45, .55, .65, 24), new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: .5 })); cone.rotation.z = -Math.PI / 2; S.add(cone);
    cap = new THREE.Mesh(new THREE.SphereGeometry(.5, 14, 10), new THREE.MeshStandardMaterial({ color: 0xe9d5ff })); S.add(cap);
    hand = box(.5, 2.4, .6, 0x94a3b8); fork = box(1.4, .45, .6, 0x94a3b8); prA = box(.4, 3.6, .6, 0xcbd5e1); prB = box(.4, 3.6, .6, 0xcbd5e1);
    bodyG = box(2.6, 5.2, 1.4, 0x8a5a2b); bodyG.position.set(XS - 1.5, YC, 0);
    str = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sp0, 3)), new THREE.PointsMaterial({ color: 0xfde047, size: .24 })); S.add(str); str.frustumCulled = false;
    pos = new Float32Array(N * ROWS * 3); col = new Float32Array(N * ROWS * 3); geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); pts = new THREE.Points(geo, new THREE.PointsMaterial({ vertexColors: true, size: .27 })); S.add(pts); pts.frustumCulled = false;
    trc = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(tpos, 3)), new THREE.PointsMaterial({ color: 0xfde047, size: .5 })); S.add(trc); trc.frustumCulled = false;
    lbl = label('', '#d8b4fe', .9); lbl.position.set(XS + 3.8, YC + 3.6, 0); lmed = label('', '#e2e8f0', .9); lmed.position.set(2, YC - 3.4, 0);
  },
  reset() { t = 0; tf = 0; lM = lS = 0; },
  step(dt, P) {
    t += dt; const s = P.src - 1, vac = P.m === 3, vis = VIS[P.m - 1], lam = LAM[P.p - 1] * vis, k = 2 * Math.PI / lam, w = k * 4 * vis, A = .1 * P.a * (vac ? 1 : 1), ph = Math.sin(-w * t) * A, f = HZ[P.p - 1];
    [cab, ring, cone, cap].forEach(o => o.visible = s === 0); [hand, fork, prA, prB].forEach(o => o.visible = s === 1); [bodyG, str].forEach(o => o.visible = s === 2);
    if (s === 0) { cab.position.x = XS - .6; cone.position.set(XS + .25 + ph, YC, 0); cap.position.set(XS + .62 + ph, YC, 0); }                                // only the cone moves
    if (s === 1) { hand.position.set(XS - .6, YC - 1.7, 0); fork.position.set(XS - .6, YC - .3, 0); prA.position.set(XS - 1.2 - ph * .7, YC + 1.7, 0); prB.position.set(XS + 0 + ph * .7, YC + 1.7, 0); }   // only the prongs move
    if (s === 2) { for (let i = 0; i < NS; i++) { const u = i / (NS - 1); sp0[i * 3] = XS + .15 + ph * Math.sin(Math.PI * u) * 1.1; sp0[i * 3 + 1] = YC - 2.2 + u * 4.4; sp0[i * 3 + 2] = .1; } str.geometry.attributes.position.needsUpdate = true; }   // only the string moves
    const x0s = XS + (s === 1 ? .15 : s === 2 ? .3 : .75);
    pts.visible = trc.visible = !vac; if (lM !== P.m || lS !== P.src) { lM = P.m; lS = P.src; tf = 0; } tf += dt;                          // the shaking spreads outwards from the source
    const cB = new THREE.Color(MCOL[P.m - 1]), cD = new THREE.Color(0x64748b), xf = x0s + .2 + (w / k) * tf, jy = P.m === 2 ? .1 : .24;
    for (let r = 0; r < ROWS; r++) for (let i = 0; i < N; i++) { const x0 = x0s + .6 + i * DX + (hh(r, i) - .5) * .1, j = (r * N + i) * 3, u = Math.max(0, Math.min(1, (xf - x0) / 1.5)), g = u * u * (3 - 2 * u);   // g = 0 (not reached yet, at rest) … 1 (shaking)
      pos[j] = x0 + g * A * Math.sin(k * (x0 - XS) - w * t); pos[j + 1] = YC - 2.25 + r * .75 + (hh(i, r) - .5) * jy; pos[j + 2] = 0; col[j] = cD.r + (cB.r - cD.r) * g; col[j + 1] = cD.g + (cB.g - cD.g) * g; col[j + 2] = cD.b + (cB.b - cD.b) * g; }
    TR.forEach((q, n) => { tpos[n * 3] = pos[q * 3]; tpos[n * 3 + 1] = pos[q * 3 + 1]; tpos[n * 3 + 2] = .05; });
    geo.attributes.position.needsUpdate = geo.attributes.color.needsUpdate = trc.geometry.attributes.position.needsUpdate = true;
    lbl.set(SRC[s] + (s === 0 ? ': only the cone shakes' : s === 1 ? ': prongs shake' : ': string shakes'), '#d8b4fe'); lmed.set(vac ? 'Empty space: no sound' : MED[P.m - 1] + ' particles · yellow = follow one', vac ? '#fca5a5' : '#e2e8f0');
    if (P.snd && !vac) tone.set(f, GAIN[P.a - 1], KIND[s]); else tone.stop(); P.heard = P.snd && !vac; if (P.snd && P.p <= 2) P.lo = true; if (P.snd && P.p >= 4) P.hi = true; if (P.snd && vac) P.silent = true;
  },
  ro: { 'Shakes per second': P => HZ[P.p - 1] + ' Hz', 'One shake takes': P => (1000 / HZ[P.p - 1]).toFixed(P.p > 3 ? 2 : 1) + ' ms', Loudness: P => LOUD[P.a - 1], Pitch: P => PITCH[P.p - 1], 'Sound speed': P => SPD[P.m - 1] ? SPD[P.m - 1] + ' m/s' : '0 – none' },
  status: P => P.m === 3 ? ['No sound in empty space', false, 'warn'] : P.snd ? ['Playing', true] : ['Tap 🔊 Sound on', false, 'warn'],
  note: P => P.m === 3 ? '<b>Empty space has no air.</b> The source still shakes, but there is nothing to carry the shakes, so you hear nothing.' : `<b>Sound is made by vibrations.</b> Bigger shake → <b>louder</b>. Faster shakes → <b>higher pitch</b>.${P.m === 2 ? ' Sound is faster in water.' : ''} Grey = resting, blue = shaking.${P.snd ? '' : ' Switch <b>🔊 Sound on</b> to hear it.'}`,
  try: [{ t: 'Switch <b>🔊 Sound on</b>. Turn <b>Loudness</b> up. What changes: the size of the shake or its speed?', check: P => P.heard && P.a === 5, yes: 'Yes! A bigger shake is louder.' },
    { t: 'With sound on, turn <b>Pitch</b> from low to high. Do the shakes get faster?', check: P => P.lo && P.hi, yes: 'Yes! More shakes per second is a higher pitch.' },
    { t: 'Watch one <b>yellow</b> particle. Does it travel with the wave, or only shake in its own place?' },
    { t: 'Change the <b>Source</b> to <b>Tuning fork</b>. What part is shaking?', check: P => P.src === 2, yes: 'Yes! Only the two prongs shake.' },
    { t: 'Set the <b>Medium</b> to <b>Empty space</b> with sound on. Can you hear it?', check: P => P.silent, yes: 'Yes! No air, no sound.' }],
  key: ['Sound is made by <b>vibrations</b> — back-and-forth shaking.', 'Sound needs a <b>medium</b>: air, water or a solid. It cannot cross empty space (<b>vacuum</b>).', '<b>Amplitude</b> (size of the shake) → <b>loudness</b>. <b>Frequency</b> (shakes per second) → <b>pitch</b>.', 'Frequency is measured in <b>hertz (Hz)</b>. <b>Time period</b> is the time for one shake.', 'People hear 20 to 20,000 Hz. Lower is infrasound, higher is ultrasound.', 'Pleasant sound is music. Unpleasant, loud sound is noise. Too much of it is noise pollution.'],
  quiz: [{ q: 'What makes the pitch of a sound higher?', o: ['A bigger shake', 'Faster shakes (more per second)', 'A heavier speaker'], a: 1, why: 'More shakes per second make a higher pitch.' }, { q: 'Can sound travel through a vacuum?', o: ['Yes', 'No', 'Only through water'], a: 1, why: 'Sound needs air, water or a solid to carry the shakes.' }, { q: 'Which part of a loudspeaker vibrates to make sound?', o: ['The whole box', 'The cone at the front', 'The wire'], a: 1, why: 'The cone pushes the air in front of it.' }, { q: 'The range of human hearing is…', o: ['2 to 200 Hz', '20 to 20,000 Hz', '200 to 2,000,000 Hz'], a: 1, why: 'Below is infrasound, above is ultrasound.' }]
};
