// Class 10 · Ch 12 Electricity — the WATER ANALOGY. Pump = battery · pressure = voltage · flow = current · narrow pipe = resistor · tank with a rubber sheet = capacitor · heavy paddle wheel = inductor.
// Each part is shown three ways: the water picture (top), the real component and its circuit symbol (below).
import { S, V, mat, beam, box, sph, THREE, label } from '../scene.js';
const Y0 = -.3, Y1 = 3.5, HH = Y1 - Y0, PL = 24 + 2 * HH, N = 40, W = 0x38bdf8, YC = (Y0 + Y1) / 2, SYM = -2.3;           // pipe loop: 12 wide, bottom Y0, top Y1
const at = u => { u = ((u % PL) + PL) % PL; if (u < HH) return [-6, Y0 + u]; u -= HH; if (u < 12) return [-6 + u, Y1]; u -= 12; if (u < HH) return [6, Y1 - u]; u -= HH; return [6 - u, Y0]; };
const MAP = [['Pump = Battery', 'Pressure = Voltage · Flow = Current'], ['Narrow pipe = Resistor', 'Narrower pipe → less flow'], ['Tank + rubber sheet = Capacitor', 'Stores water (charge), then pushes back'], ['Heavy paddle wheel = Inductor', 'Slow to start, slow to stop']];
const NM = ['Pump pushes the water', 'Narrow pipe', 'Tank with a rubber sheet', 'Heavy paddle wheel'], REAL = ['Battery (cell)', 'Resistor', 'Capacitor', 'Inductor (coil)'];
const poly = (pts, col, w = .05) => pts.slice(1).map((p, i) => beam(col, w).set(V(pts[i][0], pts[i][1], 0), V(p[0], p[1], 0)));
const arc = (cx, cy, r, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const cyl = (r, h, col, rot) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), mat(col)); if (rot) m.rotation.z = Math.PI / 2; return m; };
let dp, dots, pump, blades, pbar, fbar, cons, tank, memb, wheel, real, sym, bands, lbl, lN, lR, lS, lM1, lM2, lP, lF, lV, lQ, vc, iL, tt, lm, hist, ht, pa;
export default {
  title: 'Electricity — Water Analogy', tabs: [['electricity10', 'Ohm’s law'], ['water10', 'Water analogy']], cam: { d: 19, t: V(0, 1.5, 0), e: 0, a: 0, ref: 1.3 }, head: 'Current I',
  sliders: [{ k: 'c', l: 'Component', min: 1, max: 4, step: 1, v: 1, names: ['Battery', 'Resistor', 'Capacitor', 'Inductor'] }, { k: 'V', l: 'Voltage (pressure) V', min: 1, max: 12, step: 1, v: 6, u: 'V' }, { k: 'R', l: 'Resistance R', min: 1, max: 20, step: 1, v: 6, u: 'Ω' },
    { k: 'C', l: 'Capacitance C', min: 1, max: 10, step: 1, v: 5, w: P => P.c === 3 }, { k: 'L', l: 'Inductance L', min: 1, max: 10, step: 1, v: 5, w: P => P.c === 4 }],
  toggles: [{ k: 'on', l: 'Switch ON', v: true }],
  setup() {
    // ── the water picture: a pipe loop, dots = water, pump on the left
    poly([[-6, Y0], [-6, Y1], [6, Y1], [6, Y0], [-6, Y0]], 0x1d4ed8, .3); [[-6, Y0], [-6, Y1], [6, Y1], [6, Y0]].forEach(p => { const s = sph(.3, 0x1d4ed8); s.position.set(p[0], p[1], 0); });
    dp = new Float32Array(N * 3); dots = new THREE.BufferGeometry(); dots.setAttribute('position', new THREE.BufferAttribute(dp, 3)); const pts = new THREE.Points(dots, new THREE.PointsMaterial({ color: 0xbae6fd, size: .32 })); pts.frustumCulled = false; S.add(pts);
    pump = cyl(1, .5, 0x7c3aed); pump.rotation.x = Math.PI / 2; pump.position.set(-6, YC, .3); S.add(pump); blades = new THREE.Group(); [0, 1].forEach(k => { const b = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.8, .2), mat(0xe9d5ff)); b.rotation.z = k * Math.PI / 2; blades.add(b); }); blades.position.set(-6, YC, .65); S.add(blades);
    pbar = box(.5, 1, .4, W); fbar = box(.5, 1, .4, 0xfde047); poly([[-4.6, .4], [-4.6, 3]], 0x475569, .04); poly([[4.6, .4], [4.6, 3]], 0x475569, .04);
    cons = [box(1, 1, .5, 0x94a3b8), box(1, 1, .5, 0x94a3b8)];                                                                                     // the narrow pipe (resistor)
    tank = new THREE.Group(); poly([[-1.3, 2.2], [1.3, 2.2], [1.3, 4.8], [-1.3, 4.8], [-1.3, 2.2]], 0xcbd5e1, .06).forEach(b => tank.add(b)); S.add(tank); tank.visible = false;
    memb = box(.14, 2.5, .5, 0xfb923c); wheel = new THREE.Group(); wheel.add(cyl(1, .5, 0x94a3b8)); wheel.children[0].rotation.x = Math.PI / 2; for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.22, 2.3, .35), mat(0xe2e8f0)); s.rotation.z = k * Math.PI / 3; wheel.add(s); } wheel.position.set(0, Y1, .5); S.add(wheel);
    // ── real components (left) and circuit symbols (right)
    real = [0, 1, 2, 3].map(() => { const g = new THREE.Group(); g.position.set(-3.3, SYM, 0); S.add(g); return g; }); sym = [0, 1, 2, 3].map(() => []);
    const cell = real[0]; cell.add(Object.assign(cyl(.7, 3, 0x14532d, true), {})); const cp = cyl(.28, .4, 0xd4a017, true); cp.position.x = 1.65; cell.add(cp); const sr = cyl(.72, .5, 0xe2e8f0, true); sr.position.x = -.7; cell.add(sr);
    const rs = real[1], rb = cyl(.5, 2.4, 0xe2c9a0, true); rs.add(rb); [-1.7, 1.7].forEach(x => { const l = cyl(.05, 1.2, 0xcbd5e1, true); l.position.x = x; rs.add(l); }); bands = [-.75, -.4, -.05, .75].map(x => { const m = cyl(.52, .16, 0, true); m.position.x = x; rs.add(m); return m; });
    const cap = real[2], cb = cyl(.8, 2, 0x1e3a8a); cap.add(cb); const ct = cyl(.82, .2, 0xcbd5e1); ct.position.y = 1.05; cap.add(ct); const stp = new THREE.Mesh(new THREE.BoxGeometry(.3, 1.8, .05), new THREE.MeshBasicMaterial({ color: 0xf8fafc })); stp.position.set(0, 0, .82); cap.add(stp); [-.3, .3].forEach(x => { const l = cyl(.05, 1.2, 0xcbd5e1); l.position.set(x, -1.6, 0); cap.add(l); });
    const ind = real[3], core = cyl(.3, 2.8, 0x64748b, true); ind.add(core); { const pts = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 14; pts.push(new THREE.Vector3(-1.2 + 2.4 * i / 160, .62 * Math.cos(a), .62 * Math.sin(a))); } ind.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, .09, 8), mat(0xb45309, { metalness: .5 }))); }
    const SY = [3.4, SYM];                                                                                                                      // symbol centre
    sym[0].push(...poly([[2.0, SY[1]], [3.1, SY[1]]], 0xe2e8f0), ...poly([[3.1, SY[1] - .8], [3.1, SY[1] + .8]], 0xfde047, .08), ...poly([[3.7, SY[1] - .45], [3.7, SY[1] + .45]], 0xe2e8f0, .08), ...poly([[3.7, SY[1]], [4.8, SY[1]]], 0xe2e8f0));
    sym[1].push(...poly([[1.8, SY[1]], [2.6, SY[1]], [2.85, SY[1] + .5], [3.3, SY[1] - .5], [3.75, SY[1] + .5], [4.2, SY[1] - .5], [4.45, SY[1]], [5, SY[1]]], 0xe2e8f0, .06));
    sym[2].push(...poly([[2.0, SY[1]], [3.2, SY[1]]], 0xe2e8f0), ...poly([[3.2, SY[1] - .9], [3.2, SY[1] + .9]], 0xfde047, .08), ...poly([[3.7, SY[1] - .9], [3.7, SY[1] + .9]], 0xfde047, .08), ...poly([[3.7, SY[1]], [4.9, SY[1]]], 0xe2e8f0));
    sym[3].push(...poly([[1.8, SY[1]], [2.3, SY[1]]], 0xe2e8f0), ...[0, 1, 2, 3].flatMap(k => poly(arc(2.75 + k * .75, SY[1], .375, Math.PI, 0, 8), 0xe2e8f0, .06)), ...poly([[5.3, SY[1]], [5.8, SY[1]]], 0xe2e8f0));
    lN = label('', '#bae6fd', .9); lN.position.set(0, 5.5, 0); lR = label('Real component', '#cbd5e1', .75); lR.position.set(-3.3, -4.3, 0); lS = label('Circuit symbol', '#cbd5e1', .75); lS.position.set(3.4, -4.3, 0); lbl = label('', '#fde047', .8);
    lM1 = label('', '#e2e8f0', .9); lM1.position.set(0, -5.4, 0); lM2 = label('', '#94a3b8', .8); lM2.position.set(0, -6.1, 0); lP = label('', '#7dd3fc', .75); lP.position.set(-2.1, YC, 0); lF = label('', '#fde047', .75); lF.position.set(2.1, YC, 0); lV = label('Pump', '#e9d5ff', .75); lV.position.set(-6, 0 - .3, 0); lV.visible = false; lQ = label('', '#fdba74', .8);
  },
  reset() { vc = iL = tt = ht = 0; lm = 0; hist = []; pa = 0; },
  step(dt, P) {
    dt = Math.min(dt, .05); if (lm !== P.c) { lm = P.c; vc = iL = tt = ht = 0; hist = []; } const c = P.c, Vs = P.on ? P.V : 0, R = P.R; let I;
    if (c <= 2) I = Vs / R; else if (c === 3) { const tau = R * P.C / 20; vc = Vs + (vc - Vs) * Math.exp(-dt / tau); I = (Vs - vc) / R; } else { const tau = P.L / R, ie = Vs / R; iL = ie + (iL - ie) * Math.exp(-dt / tau); I = iL; }
    P.I = I; P.vc = vc; P.tau = c === 3 ? R * P.C / 20 : c === 4 ? P.L / R : 0; tt += dt; ht += dt; if (ht > .1) { ht = 0; hist.push([tt, c === 3 ? vc : Math.abs(I)]); if (hist.length > 400) hist.shift(); }
    pa += I * .5 * dt; for (let i = 0; i < N; i++) { const [x, y] = at(pa + i * PL / N); dp[i * 3] = x; dp[i * 3 + 1] = y; dp[i * 3 + 2] = .55; } dots.attributes.position.needsUpdate = true;
    blades.rotation.z -= I * dt * 1.2; wheel.rotation.z -= I * dt * .9; wheel.scale.setScalar(.75 + .07 * P.L);
    const ph_ = Vs / 12 * 2.6, fh = Math.min(2.6, Math.abs(I) / 12 * 2.6) + .001; pbar.scale.y = ph_ + .001; pbar.position.set(-4.6, .4 + ph_ / 2, 0); fbar.scale.y = fh; fbar.position.set(4.6, .4 + fh / 2, 0);
    lP.set(`Pressure ${Vs} V`); lF.set(`Flow ${I.toFixed(2)} A`);
    // narrow pipe (all modes except the plain Battery view); in Capacitor/Inductor it sits on the right-hand pipe
    const g = Math.max(.12, .9 * (1 - .045 * R)), horiz = c === 2; cons.forEach((b, k) => { b.visible = c >= 2; const o = (g / 2 + .4) * (k ? -1 : 1); if (horiz) { b.scale.set(2.4, .8, 1); b.position.set(0, Y1 + o, 0); } else { b.scale.set(.8, 2.4, 1); b.position.set(6 + o, YC, 0); } });
    tank.visible = c === 3; memb.visible = c === 3; memb.position.set(P.V ? Math.max(-.9, Math.min(.9, vc / P.V * .9)) : 0, Y1, 0); wheel.visible = c === 4;
    real.forEach((g_, k) => g_.visible = k === c - 1); sym.forEach((s, k) => s.forEach(b => b.visible = k === c - 1)); if (c === 2) { const d = R < 10 ? [R, 0, 0xc0c0c0] : [Math.floor(R / 10), R % 10, 0x111111], BC = [0x111111, 0x7c3f00, 0xdc2626, 0xf97316, 0xfacc15, 0x16a34a, 0x2563eb, 0x7c3aed, 0x6b7280, 0xf8fafc], col = [BC[d[0]], BC[d[1]], d[2], 0xd4a017]; bands.forEach((b, i) => b.material.color.set(col[i])); }
    lN.set(NM[c - 1]); lR.set(REAL[c - 1]); lM1.set(MAP[c - 1][0]); lM2.set(MAP[c - 1][1]); lQ.visible = false;
  },
  ro: { 'Current I': P => P.I.toFixed(2) + ' A', 'Voltage V': P => (P.on ? P.V : 0) + ' V', 'Resistance R': P => P.R + ' Ω', 'Capacitor voltage': P => P.c === 3 ? P.vc.toFixed(2) + ' V' : null, 'Charge stored Q': P => P.c === 3 ? (P.C * P.vc).toFixed(1) + ' units (C × V)' : null, 'Time constant': P => P.c >= 3 ? P.tau.toFixed(2) + ' s' : null },
  status: P => P.c === 3 ? [P.on ? 'Charging' : 'Discharging', true] : P.c === 4 ? [P.on ? 'Current building up' : 'Current dying away', true] : [P.on ? 'Water flowing' : 'Switch off', P.on],
  graph: P => { const c = P.c, I = P.V / P.R;
    if (c <= 2) { const pts = []; for (let v = 0; v <= P.V; v++) pts.push([v, v / P.R]); return { pts, xmax: 12, ymin: 0, ymax: 4 * Math.max(1, Math.ceil(12 / P.R / 4)), xl: 'pressure / voltage V (volt)', yl: 'flow / current I (A)', color: '#fde047' }; }
    const mx = Math.max(10, Math.ceil(tt / 5) * 5); return c === 3 ? { pts: hist, xmax: mx, ymin: 0, ymax: 12, xl: 'time (s)', yl: 'capacitor voltage (V)', ref: [[0, P.on ? P.V : 0], [mx, P.on ? P.V : 0]], color: '#fb923c' }
      : { pts: hist, xmax: mx, ymin: 0, ymax: 4 * Math.max(1, Math.ceil(12 / P.R / 4)), xl: 'time (s)', yl: 'current I (A)', ref: [[0, I], [mx, I]], color: '#fde047' }; },
  note: P => P.c === 1 ? `The <b>pump</b> (battery) pushes water round the pipe. More <b>pressure</b> (voltage) means more <b>flow</b> (current). Water is not used up: the same amount flows round.`
    : P.c === 2 ? `A <b>narrow pipe</b> resists the flow, like a <b>resistor</b>. <b>I = V/R = ${P.V}/${P.R} = ${(P.V / P.R).toFixed(2)} A</b>. A narrower pipe (bigger R) means less flow.`
    : P.c === 3 ? `Water pushes the <b>rubber sheet</b> and fills the tank, so the flow slows as the sheet pushes back. Like a <b>capacitor</b> charging: it stores charge and its voltage rises towards V. Switch off to let it discharge. Time constant τ = R×C = ${P.tau.toFixed(2)} s.`
    : `The <b>heavy wheel</b> is slow to speed up and slow to stop, like an <b>inductor</b> that opposes any change of current. I rises slowly; switch off and it keeps flowing for a while. τ = L/R = ${P.tau.toFixed(2)} s.`,
  try: ['Battery: raise the pressure (voltage). What happens to the flow (current)?', 'Resistor: make the pipe narrower (bigger R). What happens to the flow? Check I = V/R.', { t: 'Capacitor: switch <b>ON</b> and watch the rubber sheet. Then switch <b>OFF</b>. Which way does the water flow now?', check: P => P.c === 3 && !P.on && P.vc > .5, yes: 'It flows backwards: the capacitor discharges.' },
    { t: 'Inductor: switch ON, then OFF. Does the flow stop at once?', check: P => P.c === 4 && !P.on && Math.abs(P.I) > .05, yes: 'No. The heavy wheel keeps the water moving for a while.' }],
  key: ['Voltage = pressure · Current = flow rate · Resistance = narrow pipe · Battery = pump.', 'Resistor: V = IR. A bigger R gives a smaller current.', 'Capacitor: stores charge. It charges quickly through a small R and a small C; τ = R × C.', 'Inductor: opposes changes in current, like the inertia of a heavy wheel; τ = L / R.', 'Real parts: a resistor shows colour bands, a capacitor has a + / − marking, an inductor is a coil of wire.'],
  quiz: [{ q: 'In the water picture, voltage is like…', o: ['the pipe width', 'the water pressure', 'the amount of water'], a: 1, why: 'The pump gives pressure, as a battery gives voltage.' }, { q: 'A resistor is like…', o: ['a pump', 'a narrow pipe', 'a rubber sheet'], a: 1, why: 'It restricts the flow.' }, { q: 'A capacitor in the water picture is…', o: ['a tank with a rubber sheet', 'a heavy paddle wheel', 'a tap'], a: 0, why: 'It stores water (charge) and pushes back.' }, { q: 'Which part resists a change in the flow?', o: ['resistor', 'inductor', 'battery'], a: 1, why: 'The inductor behaves like a heavy wheel: it is slow to start and slow to stop.' }]
};
