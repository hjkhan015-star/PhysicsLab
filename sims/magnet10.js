// Class 10 · Ch 13 Magnetic Effects of Electric Current — magnetic field lines of a bar magnet, a straight wire and a solenoid. Move the compass around.
import { S, V, box, mat, arrowTo, THREE, label } from '../scene.js';
const SRC = ['Bar magnet', 'Straight wire', 'Solenoid'], RD = [2.5, 4, 6], LS = 4.5, ND = 150, D = Math.PI / 180;
let bN, bS, wr, hx, body, nR, nW, dots, lN, lS, lH, lC, paths, key, ph;
const dp = new Float32Array(ND * 3);
const pole = (x, y, px, q) => { const dx = x - px, r2 = dx * dx + y * y + .04, r3 = r2 * Math.sqrt(r2); return [q * dx / r3, q * y / r3]; };      // field of one pole (N = +, S = −)
const bar = (x, y, k = 8) => { const a = pole(x, y, 2, 1), b = pole(x, y, -2, -1); return [k * (a[0] + b[0]), k * (a[1] + b[1])]; };
const dip = (x, y, k) => { const r2 = x * x + y * y, r = Math.sqrt(r2), r5 = r2 * r2 * r; return [k * (3 * x * x / r2 - 1) / (r2 * r), k * 3 * x * y / r5]; };
function field(P, x, y) {                                                                    // field of the source at (x, y); the second number is its strength
  const r = Math.hypot(x, y) || .01, s = P.rev ? -1 : 1; let b;
  if (P.s === 1) b = bar(x, y); else if (P.s === 2) b = [s * .9 * P.I / r * -y / r, s * .9 * P.I / r * x / r];
  else b = Math.abs(x) < LS && Math.abs(y) < 1.4 ? [s * .3 * P.I, 0] : dip(x, y, s * 2 * P.I);
  return b;
}
function build(P) {                                                                         // field lines as lists of [x, y] points, drawn in the direction of the field
  const out = [], s = P.rev ? -1 : 1;
  if (P.s === 1) { for (const f of [50, 80, 110, 140, 170, -50, -80, -110, -140, -170]) { let x = 2 + .35 * Math.cos(f * D), y = .35 * Math.sin(f * D); const c = [[x, y]];
      for (let k = 0; k < 900; k++) { const b = bar(x, y, 1), m = Math.hypot(b[0], b[1]) || 1; x += b[0] / m * .22; y += b[1] / m * .22; c.push([x, y]); if (Math.hypot(x + 2, y) < .4 || Math.hypot(x, y) > 30) break; } out.push(c); }
    out.push([[2.4, 0], [10, 0]], [[-10, 0], [-2.4, 0]]); }
  else if (P.s === 2) { if (P.I > 0) for (let k = 0; k < 8; k++) { const r = 1.3 + k * 4.8 / (1 + P.I); if (r > 9) break; const c = []; for (let j = 0; j <= 48; j++) { const a = s * j / 48 * 2 * Math.PI; c.push([r * Math.cos(a), r * Math.sin(a)]); } out.push(c); } }
  else if (P.I > 0) { const n = Math.min(4, Math.ceil(P.I * .9)), cs = [.9, -.9, .45, -.45];
    for (let k = 0; k < n; k++) { const c = cs[k], h = 2.6 + (k >> 1) * 2.6 + (k & 1) * 0, sg = c > 0 ? 1 : -1, pth = [[-LS, c], [LS, c]]; for (let j = 1; j <= 36; j++) { const a = j / 36 * Math.PI; pth.push([LS * Math.cos(a), c + sg * h * Math.sin(a)]); } out.push(s > 0 ? pth : pth.slice().reverse()); }
    out.push(s > 0 ? [[-LS, 0], [LS, 0]] : [[LS, 0], [-LS, 0]]); }
  return out.map(p => { const cum = [0]; for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return { p, cum, len: cum[cum.length - 1] }; });
}
export default {
  title: 'Magnetic Field Lines', cam: { d: 22, e: .1, a: 0, t: V(0, 0, 0), ref: 2 },
  head: 'Field',
  sliders: [{ k: 's', l: 'Source', min: 1, max: 3, step: 1, v: 2, names: SRC }, { k: 'I', l: 'Current', min: 0, max: 5, step: 1, v: 3, u: 'A', w: P => P.s !== 1 },
    { k: 'a', l: 'Compass around', min: 0, max: 345, step: 15, v: 45, u: '°' }, { k: 'r', l: 'Compass distance', min: 1, max: 3, step: 1, v: 2, names: ['Near', 'Middle', 'Far'], axis: true }],
  toggles: [{ k: 'rev', l: 'Reverse current', v: false, w: P => P.s !== 1 }],
  setup() {
    bS = box(2, 1.2, 1.2, 0x3b82f6); bN = box(2, 1.2, 1.2, 0xef4444); bS.position.set(-1, 0, 0); bN.position.set(1, 0, 0);
    wr = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 3, 16), new THREE.MeshStandardMaterial({ color: 0xb45309 })); wr.rotation.x = Math.PI / 2; S.add(wr);
    const pts = []; for (let k = 0; k <= 160; k++) { const a = k / 160 * 2 * Math.PI * 9; pts.push(new THREE.Vector3(-LS + 2 * LS * k / 160, Math.cos(a) * 1.4, Math.sin(a) * 1.4)); }
    hx = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, .09, 6), new THREE.MeshStandardMaterial({ color: 0xb45309 })); S.add(hx);
    body = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .15, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })); body.rotation.x = Math.PI / 2; S.add(body);
    nR = arrowTo(0xef4444, .09); nW = arrowTo(0xf8fafc, .09);
    dots = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(dp, 3)), new THREE.PointsMaterial({ color: 0x7dd3fc, size: .3 })); S.add(dots);
    lN = label('N', '#fca5a5', 1); lS = label('S', '#93c5fd', 1); lH = label('', '#fde047', 1.3); lC = label('Compass', '#e2e8f0', .8);
  },
  reset() { ph = 0; key = ''; },
  step(dt, P) {
    ph += dt; const k = `${P.s}|${P.I}|${P.rev}`; if (k !== key) { key = k; paths = build(P); }
    const bar = P.s === 1, wire = P.s === 2, sol = P.s === 3, s = P.rev ? -1 : 1;
    [bN, bS].forEach(o => o.visible = bar); wr.visible = wire; hx.visible = sol;
    const R = RD[P.r - 1], cx = R * Math.cos(P.a * D), cy = R * Math.sin(P.a * D), b = field(P, cx, cy), mag = Math.hypot(b[0], b[1]), I0 = bar ? 1 : P.I; P.B = mag; P.cur = I0;
    const bt = [b[0], b[1] + .08], ang = Math.atan2(bt[1], bt[0]);                                                  // plus a weak Earth field that points up
    body.position.set(cx, cy, .6); nR.to(cx, cy, cx + Math.cos(ang) * 1.2, cy + Math.sin(ang) * 1.2, .8); nW.to(cx, cy, cx - Math.cos(ang) * 1.2, cy - Math.sin(ang) * 1.2, .8);
    lC.position.set(cx, cy + 1.7, 0);
    lN.visible = lS.visible = bar || sol; lN.position.set(bar ? 3.2 : s * LS + s * 1.8, 0, 0); lS.position.set(bar ? -3.2 : -s * LS - s * 1.8, 0, 0); if (sol) { lN.position.set(s * (LS + 1.8), 0, 0); lS.position.set(-s * (LS + 1.8), 0, 0); }
    lH.position.set(0, -6.8, 0); lH.set(wire ? (s > 0 ? '⊙ current towards you' : '⊗ current away from you') : sol ? 'Right-hand rule: fingers = current, thumb = N' : '');
    let n = 0; const sp = (bar ? 2.2 : 1 + P.I * .4) * ph;
    for (const q of paths) { const m = Math.max(2, Math.round(q.len / .8)); for (let j = 0; j < m && n < ND; j++) { const d = ((sp / q.len + j / m) % 1) * q.len; let i = 1; while (i < q.cum.length - 1 && q.cum[i] < d) i++;
        const f = (d - q.cum[i - 1]) / ((q.cum[i] - q.cum[i - 1]) || 1); dp[n * 3] = q.p[i - 1][0] + (q.p[i][0] - q.p[i - 1][0]) * f; dp[n * 3 + 1] = q.p[i - 1][1] + (q.p[i][1] - q.p[i - 1][1]) * f; dp[n * 3 + 2] = 0; n++; } }
    dots.geometry.setDrawRange(0, n); dots.geometry.attributes.position.needsUpdate = true;
  },
  ro: { Field: P => P.cur === 0 ? 'None' : P.B < .35 ? 'Weak' : P.B < .9 ? 'Medium' : 'Strong', Direction: P => P.s === 1 ? 'N to S outside' : P.cur === 0 ? 'No field' : P.s === 2 ? (P.rev ? 'Clockwise' : 'Anticlockwise') : (P.rev ? 'Right to left inside' : 'Left to right inside') },
  status: P => P.cur === 0 ? ['Needle points north', false, 'warn'] : ['Needle follows the field', true],
  note: P => P.s === 1 ? 'Field lines leave the North pole and enter the South pole. Where the lines are closer the field is stronger. The compass needle lines up with the field.'
    : P.s === 2 ? (P.I === 0 ? 'No current, no field: the compass points north. Raise the current to see Oersted\'s effect.' : 'Current makes circular field lines round the wire. More current gives a stronger field. The needle turns.')
    : (P.I === 0 ? 'No current, no field. Raise the current.' : 'A solenoid acts like a bar magnet. The field inside is strong and uniform; more current or more turns makes it stronger.'),
  try: ['Straight wire: set Current to 0, then raise it. Watch the needle.', 'Reverse the current. Which way does the needle turn now?', 'Solenoid: compare the compass near and far. Where is the field stronger?'],
  key: ['Field lines go from N to S outside; closer lines mean a stronger field.', 'Oersted: a current in a wire deflects a compass needle.', 'Right-hand rule: thumb along the current, curled fingers give the field.', 'A solenoid with current behaves like a bar magnet.', '<b>Circular loop</b>: the field is circles near the wire and almost straight at the centre; more turns or more current make it stronger. A solenoid is many loops side by side.'],
  quiz: [{ q: 'The magnetic field lines around a straight current-carrying wire are…', o: ['circles around the wire', 'straight lines along the wire', 'zero'], a: 0, why: 'The field circles the wire; the right-hand rule gives the direction.' }, { q: 'Oersted found that a current…', o: ['deflects a compass needle', 'melts a magnet', 'cools a wire'], a: 0, why: 'A current produces a magnetic field.' }, { q: 'Outside a bar magnet, field lines go from…', o: ['N to S', 'S to N', 'N to N'], a: 0, why: 'They leave the North pole and enter the South pole.' }]
};
