// Class 10 · Ch 13 Magnetic Effects of Electric Current — electromagnetic induction (Faraday, Lenz) and the AC generator.
import { S, V, box, sph, mat, wire, beam, THREE, label } from '../scene.js';
const SPD = ['Still', 'Slow', 'Medium', 'Fast', 'Very fast'], W = [0, .6, 1.1, 1.7, 2.5], WG = [0, 2, 4, 6, 8];
let lastM, mN, mS, hx, needle, dial, coil, pN, pS, bulb, ph, th, hist, hx0, mv, lg, lb;
const sgn = x => x < 0 ? -1 : 1, flux = x => 1 / (1 + (x / 3) * (x / 3));
export default {
  title: 'Electromagnetic Induction', cam: { d: 19, e: .15, a: .15, t: V(2, 1.5, 0), ref: 2 },
  head: 'Meter reading',
  sliders: [{ k: 'm', l: 'Mode', min: 1, max: 2, step: 1, v: 1, names: ['Magnet and coil', 'AC generator'] }, { k: 's', l: 'Speed', min: 0, max: 4, step: 1, v: 2, names: SPD, axis: true }],
  toggles: [{ k: 'rm', l: 'Reverse magnet', v: false }, { k: 'rt', l: 'Turn the other way', v: false, w: P => P.m === 2 }],
  setup() {
    mS = box(2.2, 1.1, 1.1, 0x3b82f6); mN = box(2.2, 1.1, 1.1, 0xef4444);
    const pts = []; for (let k = 0; k <= 120; k++) { const a = k / 120 * 2 * Math.PI * 6; pts.push(new THREE.Vector3(-1.5 + 3 * k / 120, Math.cos(a) * 1.7, Math.sin(a) * 1.7)); }
    hx = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, .1, 6), new THREE.MeshStandardMaterial({ color: 0xd9822b })); S.add(hx);
    dial = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, .2, 32), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })); dial.rotation.x = Math.PI / 2; dial.position.set(9, 4, 0); S.add(dial);
    needle = new THREE.Group(); const nb = box(.1, 1.5, .1, 0xef4444); nb.position.y = .75; S.remove(nb); needle.add(nb); needle.position.set(9, 4, .2); S.add(needle);
    wire([[-1.5, 1.7], [-1.5, 5], [7.1, 5], [7.1, 4]], 0x94a3b8, .06); wire([[1.5, 1.7], [1.5, 3], [7.1, 3], [7.1, 4]], 0x94a3b8, .06);
    pN = box(2, 4.4, 3.4, 0xef4444); pS = box(2, 4.4, 3.4, 0x3b82f6); pN.position.set(-5.5, 0, 0); pS.position.set(5.5, 0, 0);
    coil = new THREE.Group(); const c = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: 0xd9822b })); m.position.set(x, y, z); coil.add(m); };
    c(.16, .16, 2.6, 1.6, 0, 0); c(.16, .16, 2.6, -1.6, 0, 0); c(3.2, .16, .16, 0, 0, 1.3); c(3.2, .16, .16, 0, 0, -1.3); S.add(coil);
    bulb = sph(.8, 0xe5e7eb); bulb.material = mat(0xe5e7eb, { emissive: 0xfde047, emissiveIntensity: 0 }); bulb.position.set(0, 4.2, 0);
    lg = label('Galvanometer', '#e2e8f0', 1); lg.position.set(9, 6.4, 0); lb = label('', '#fde047', .9);
  },
  reset() { ph = 0; th = 0; hist = []; hx0 = 0; mv = 0; },
  step(dt, P) {
    const M = P.m === 1, pol = P.rm ? -1 : 1; ph += dt; if (lastM !== P.m) { lastM = P.m; hist = []; } lg.set(M ? 'Galvanometer' : ''); [mN, mS, hx, needle, dial].forEach(o => o.visible = M); [pN, pS, coil, bulb].forEach(o => o.visible = !M);
    if (M) {
      const w = W[P.s], x = 7 * Math.sin(ph * w), v = 7 * w * Math.cos(ph * w), dF = -2 * x / 9 / Math.pow(1 + x * x / 9, 2);                    // magnet position and speed · slope of the flux curve
      const emf = pol * dF * v * -1; P.emf = emf; P.mv = Math.abs(v) < .05 ? 0 : (x * v < 0 ? 1 : -1);                                          // 1 = coming towards the coil
      mS.position.set(x - pol * 1.1, 0, 0); mN.position.set(x + pol * 1.1, 0, 0); needle.rotation.z = -Math.max(-1, Math.min(1, emf * .7)) * .9;
      lb.position.set(x, 2.2, 0); lb.set(''); hist.push([ph, emf]); while (hist.length && ph - hist[0][0] > 4) hist.shift();
    } else {
      const w = WG[P.s] * (P.rt ? -1 : 1); th += w * dt; coil.rotation.z = th; const E = -pol * w * Math.sin(th) * .8; P.emf = E; P.mv = 0;
      bulb.material.emissiveIntensity = Math.min(1.2, Math.abs(E) * .35); bulb.material.color.set(Math.abs(E) > .2 ? 0xfff3b0 : 0x94a3b8);
      hist.push([ph, E]); while (hist.length && ph - hist[0][0] > 4) hist.shift();
    }
  },
  ro: { 'Meter reading': P => P.m === 1 ? (Math.abs(P.emf) < .04 ? 'Zero' : P.emf > 0 ? 'Right' : 'Left') : (P.emf >= 0 ? '+' : '−') + Math.abs(P.emf).toFixed(1), Magnet: P => P.m === 1 ? (P.mv === 0 ? 'Still' : P.mv > 0 ? 'Moving towards the coil' : 'Moving away') : null, Bulb: P => P.m === 2 ? (Math.abs(P.emf) < .2 ? 'Off' : Math.abs(P.emf) < 2 ? 'Dim' : 'Bright') : null },
  status: P => P.m === 1 ? (Math.abs(P.emf) < .04 ? ['No current', false, 'warn'] : ['Current induced', true]) : (P.s === 0 ? ['Coil still', false, 'warn'] : ['AC voltage', true]),
  graph: P => { const t0 = hist.length ? hist[0][0] : 0; return { pts: hist.length ? hist.map(h => [h[0] - t0, h[1]]) : [[0, 0]], xmax: 4, ymin: P.m === 1 ? -2 : -8, ymax: P.m === 1 ? 2 : 8, xl: 'time (s)', yl: 'induced voltage', color: '#fde047' }; },
  note: P => P.m === 1 ? 'The needle moves only while the magnet moves. Faster motion gives a bigger deflection, and moving the other way reverses it (Faraday and Lenz).' : 'The turning coil cuts the field, so the voltage rises and falls like a sine wave. The current reverses every half turn: this is alternating current (AC).',
  try: ['Set Speed to Still. Does the needle move?', 'Raise the speed. What happens to the deflection?', 'Switch to AC generator and watch the graph and the bulb.'],
  key: ['Faraday: a changing magnetic field through a coil induces a current.', 'Lenz: the induced current opposes the change that causes it.', 'An AC generator\'s current reverses direction every half turn.', 'Faster motion or more turns gives a bigger induced voltage.', '<b>Fleming&rsquo;s right-hand rule</b> (forefinger field, thumb motion, middle finger induced current). AC generator: slip rings; DC generator: split-ring commutator, so the current keeps one direction.'],
  quiz: [{ q: 'The galvanometer needle stays at zero when the magnet is…', o: ['at rest near the coil', 'moving fast', 'reversed'], a: 0, why: 'Only a changing field induces a current.' }, { q: 'Moving the magnet faster makes the deflection…', o: ['smaller', 'bigger', 'zero'], a: 1, why: 'A faster change induces a bigger voltage.' }, { q: 'An AC generator takes the current out through…', o: ['slip rings', 'a split ring', 'a battery'], a: 0, why: 'Slip rings keep the current alternating.' }]
};
