// Class 8 · Ch 15 Some Natural Phenomena — rubbing makes charge (watch it build up as the cloth moves); lightning is a giant spark, and thunder arrives late.
import { S, C, V, box, sph, beam, mat, THREE, label, wire, rumble } from '../scene.js';
const AMT = ['None', 'A little', 'Some', 'A lot', 'Very much'], SPD = ['Stop', 'Slow', 'Medium', 'Fast', 'Very fast'], CH = ['None', 'Low', 'Medium', 'High'];
const RATE = [0, .08, .1, .16, .25], CAP = [0, .3, 1, 1, 1], FREQ = [0, .5, .8, 1.2, 1.8], PV = [-1.3, 1.3], OBS = [6.8, 1], MINGAP = 3;   // cloud charge per second · most charge each setting allows · strokes per second · string pivots · where "You" stand
const word = q => CH[q < .02 ? 0 : q < .4 ? 1 : q < .8 ? 2 : 3], R = Math.random, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sign = (g, col) => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = col; x.beginPath(); x.arc(32, 32, 29, 0, 7); x.fill(); x.lineWidth = 4; x.strokeStyle = '#0b1220'; x.stroke();
  x.strokeStyle = '#fff'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(17, 32); x.lineTo(47, 32); if (g === '+') { x.moveTo(32, 17); x.lineTo(32, 47); } x.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };   // round − / + sign sprites
const sp = (a, g, col, s) => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(a, 3)); const o = new THREE.Points(geo, new THREE.PointsMaterial({ map: sign(g, col), size: s, transparent: true, alphaTest: .05, depthWrite: false, depthTest: false })); o.renderOrder = 5; o.frustumCulled = false; S.add(o); return o; };
const mk = (sx, sy, tx, ty) => { let p = [[sx, sy], [tx, ty]]; for (let it = 0; it < 4; it++) { const q = [p[0]]; for (let i = 1; i < p.length; i++) { const [a, b] = p[i - 1], [c, d] = p[i], L = Math.hypot(c - a, d - b) || 1, o = (R() - .5) * L * .5; q.push([(a + c) / 2 - (d - b) / L * o, (b + d) / 2 + (c - a) / L * o], p[i]); } p = q; } return p; };   // jagged bolt path (17 points)
let table, frame, bA, bB, tA, tB, hg, bits, meter, mfill, cloud, rain, trunk, crown, crown2, house, roof, rod, gw, you, fl, ringM, glow, mp, pp, lm, lp, lw, lb, lq, lyou, lsw, lth, lrod, ltree, lmeter, light, mats;
let QL, QR, Cs, T, phi, th, rubs, lastS, acc, ts, hit, pend, ring, scorch, pts, thT, lastDur, vx0, flights;
const N = 90, NP = 40, mpA = new Float32Array(N * 3), ppA = new Float32Array(NP * 3), tp = new Float32Array(12 * 3), rn = new Float32Array(100 * 6), rx = new Float32Array(100), ry = new Float32Array(100), bM = [], bG = [], bB_ = [];
export default {
  title: 'Charge and Lightning', cam: { d: 18, e: .12, a: 0, t: V(0, 5.9, 0), ref: 1.3 },
  head: 'Charge',
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Rub it', 'Storm'] },
    { k: 'r', l: '👋 Rubbing', min: 1, max: 5, step: 1, v: 3, names: SPD, axis: true, w: P => P.m === 1 },
    { k: 'c', l: '⛈ Cloud charge', min: 1, max: 5, step: 1, v: 4, names: AMT, axis: true, w: P => P.m === 2 },
    { k: 'd', l: '📏 You are', min: 1, max: 4, step: 1, v: 2, u: 'km', axis: true, w: P => P.m === 2 }],
  toggles: [{ k: 'rod', l: 'Lightning rod', v: true, w: P => P.m === 2 }, { k: 'snd', l: '🔊 Thunder sound', v: true, w: P => P.m === 2 }],
  buttons: [{ l: '✋ Touch to discharge', fn: P => { P.dis = true; }, w: P => P.m === 1 }],
  setup() {
    table = box(14, .4, 5, 0x8a5a2b);
    frame = new THREE.Group(); S.add(frame); [[-3, 5.6, .25, 6, .25], [3, 5.6, .25, 6, .25]].forEach(([x, y, w, h, d]) => { const m = box(w, h, d, 0x94a3b8); m.position.set(x, y, -.6); frame.add(m); }); const bar = box(6.4, .25, .3, 0x94a3b8); bar.position.set(0, 8.7, -.6); frame.add(bar);
    bA = sph(1.1, 0x60a5fa); bB = sph(1.1, 0xf472b6); [bA, bB].forEach(b => b.scale.set(1, 1.15, 1)); tA = beam(0xcbd5e1, .03); tB = beam(0xcbd5e1, .03);
    hg = new THREE.Group(); S.add(hg); const cloth = box(2.2, 1.5, .14, 0xf59e0b), palm = sph(.62, 0xf1c27d), arm = box(.8, 4.4, .8, 0xf1c27d), cuff = box(.95, .6, .95, 0x2563eb); palm.position.set(.25, .15, .5); arm.position.set(1.15, 2.6, .6); arm.rotation.z = -.35; cuff.position.set(.98, 1.1, .6); cuff.rotation.z = -.35; hg.add(cloth, palm, arm, cuff); hg.position.z = 1.35;   // hand + wool cloth
    bits = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(tp, 3)), new THREE.PointsMaterial({ color: 0xf8fafc, size: .35 })); S.add(bits);
    meter = box(.7, 4.6, .25, 0x1e293b); meter.position.set(-6.4, 5.8, 0); mfill = box(.4, 1, .3, 0x60a5fa);
    cloud = new THREE.Group(); S.add(cloud); const lo = mat(0x5b6578), hi = mat(0x8a96ab); mats = [lo, hi];
    [[-5, 11.3, 0, 1.3], [-3.2, 11.9, .3, 1.65], [-1.2, 12.2, -.2, 1.7], [1, 12.1, .2, 1.8], [3.2, 11.8, 0, 1.55], [5, 11.2, .2, 1.2], [-3.8, 10.9, .8, 1.1], [0, 11.1, .9, 1.4], [3.6, 10.9, .7, 1.1]].forEach(([x, y, z, r], i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), i > 5 ? lo : hi); m.position.set(x, y, z); m.scale.y = .66; m.userData = { y, r }; cloud.add(m); });
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(rn, 3)); rain = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: .65 })); rain.frustumCulled = false; S.add(rain); for (let i = 0; i < 100; i++) { rx[i] = R() * 15 - 7.5; ry[i] = .4 + R() * 10; }
    trunk = box(.6, 2.6, .6, 0x92400e); crown = sph(1.2, 0x16a34a); crown2 = sph(.9, 0x22a755); house = box(3.4, 3, 2.4, 0xe2e8f0); roof = new THREE.Mesh(new THREE.ConeGeometry(2.45, 1.2, 4), mat(0xb45309)); roof.rotation.y = Math.PI / 4; S.add(roof); rod = box(.14, 1.8, .14, 0x94a3b8);
    gw = wire([[3.6, 4.5], [5.6, 3.6], [5.6, .3]], 0xd97706, .06); const door = box(.8, 1.4, .1, 0x7c2d12); door.position.set(3.6, .9, 1.22); const w1 = box(.7, .7, .1, 0xfde68a); w1.position.set(2.7, 2.2, 1.22); const w2 = box(.7, .7, .1, 0xfde68a); w2.position.set(4.5, 2.2, 1.22); house.userData = { d: [door, w1, w2] };
    you = new THREE.Group(); S.add(you); const hd = sph(.35, 0xf1c27d), bd = box(.5, 1.1, .3, 0x38bdf8); hd.position.y = 1.35; bd.position.y = .65; you.add(hd, bd); you.position.set(OBS[0], .2, 1);
    for (let i = 0; i < 16; i++) { bM.push(beam(0xfff7c2, .1)); bG.push(beam(0xfde047, .32)); } for (let i = 0; i < 12; i++) bB_.push(beam(0xfff7c2, .05));
    bG.forEach(b => { b.material.transparent = true; b.material.opacity = .22; b.material.blending = THREE.AdditiveBlending; b.material.depthWrite = false; }); [...bM, ...bG, ...bB_].forEach(b => b.visible = false);
    glow = sph(.3, 0xfff3b0); glow.material = new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }); ringM = new THREE.Mesh(new THREE.TorusGeometry(1, .07, 6, 64), new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0 })); S.add(ringM);
    fl = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false })); fl.renderOrder = 50; fl.position.z = -1; C.add(fl); S.add(C);        // full-screen flash (at most 2 short pulses per strike, strikes ≥ 3 s apart)
    light = new THREE.PointLight(0xfff3b0, 0, 60); light.position.set(0, 8, 6); S.add(light); mp = sp(mpA, '-', '#3b82f6', .7); pp = sp(ppA, '+', '#ef4444', .7);
    lm = label('', '#93c5fd', .8); lp = label('', '#fca5a5', .8); lw = label('', '#fdba74', .7); lb = label('Paper bits', '#e2e8f0', .7); lb.position.set(0, 1.7, 0); lmeter = label('Charge', '#93c5fd', .7); lmeter.position.set(-6.4, 8.5, 0);
    lq = label('', '#fde047', 1); lyou = label('You', '#e2e8f0', .8); lyou.position.set(OBS[0], 2.9, 0); lsw = label('', '#fdba74', .8); lsw.position.set(OBS[0] - .6, 4.2, 0); lrod = label('Lightning rod', '#cbd5e1', .7); lrod.position.set(3.6, 7.3, 0); ltree = label('Tall tree', '#86efac', .7); ltree.position.set(-4.8, 6.6, 0);
  },
  reset() { QL = QR = 0; Cs = .35; T = 0; phi = 0; th = 0; rubs = 0; lastS = 0; acc = 0; ts = 9; hit = 'rod'; pend = []; ring = null; scorch = 0; pts = null; thT = 0; lastDur = 0; vx0 = 5.2; flights = []; },
  step(dt, P) {
    const A = P.m === 1; T += dt; ts += dt; let nm = 0, np = 0; const M = (x, y) => { if (nm < N) { mpA[nm * 3] = x; mpA[nm * 3 + 1] = y; mpA[nm * 3 + 2] = 1.5; nm++; } }, Pl = (x, y) => { if (np < NP) { ppA[np * 3] = x; ppA[np * 3 + 1] = y; ppA[np * 3 + 2] = 1.5; np++; } };
    [frame, bA, bB, tA, tB, hg, bits, meter, mfill, lm, lp, lb, lmeter].forEach(o => o.visible = A); [cloud, rain, trunk, crown, crown2, house, roof, you, lyou, lsw, lq, lrod, ltree, gw, ringM].forEach(o => o.visible = !A); house.userData.d.forEach(o => o.visible = !A); rod.visible = lrod.visible = !A && P.rod; fl.visible = !A;
    table.scale.set(A ? 1 : 1.7, 1, A ? 1 : 1.3); table.material.color.set(A ? 0x8a5a2b : 0x3f6b3a); table.position.set(0, A ? 2.4 : 0, 0);
    if (A) {
      if (P.dis) { QL = QR = 0; P.dis = false; P.discharged = true; flights = []; }
      const rub = P.r > 1; phi += FREQ[P.r - 1] * 2 * Math.PI * dt; const tx = rub ? 3.4 * Math.sin(phi) : 5.2, ty = rub ? 5.4 : 3.7, ox = hg.position.x;
      hg.position.x += (tx - ox) * Math.min(1, dt * (rub ? 16 : 4)); hg.position.y += (ty - hg.position.y) * Math.min(1, dt * 6); hg.rotation.z = rub ? -.25 * Math.cos(phi) * .6 : 0;
      const vx = dt > 0 ? (hg.position.x - ox) / dt : 0, sg = Math.abs(vx) > 1.5 ? Math.sign(vx) : lastS; if (rub && sg !== lastS && lastS !== 0) rubs++; lastS = sg;                    // one rub each time the cloth turns round
      th += (.55 * Math.sqrt(QL * QR) - th) * Math.min(1, dt * 3); const bp = [0, 1].map(j => V(PV[j] + (j ? 1 : -1) * 3.15 * Math.sin(th), 8.6 - 3.15 * Math.cos(th), 0));
      [bA, bB].forEach((b, j) => { b.position.copy(bp[j]); b.rotation.z = (j ? -1 : 1) * th; }); tA.set(V(PV[0], 8.6, 0), V(PV[0] - 1.9 * Math.sin(th), 8.6 - 1.9 * Math.cos(th), 0)); tB.set(V(PV[1], 8.6, 0), V(PV[1] + 1.9 * Math.sin(th), 8.6 - 1.9 * Math.cos(th), 0));
      [0, 1].forEach(j => { const q = j ? QR : QL, touch = rub && Math.abs(hg.position.y - 5.4) < .6 && Math.abs(hg.position.x - bp[j].x) < 1.9;                                 // charge moves only while the cloth rubs that balloon
        if (touch) { const d = .065 * Math.abs(vx) * dt * (1 - q); j ? QR += d : QL += d; acc += Math.abs(vx) * dt * .9; while (acc > 1 && flights.length < 14) { acc -= 1; flights.push({ a: 0, j, x0: hg.position.x + (R() - .5) * 1.4, y0: hg.position.y + (R() - .5), s: R() * 6.28, r: R() }); } } });
      acc = Math.min(acc, 3); P.q = (QL + QR) / 2; const Qc = P.q;
      [0, 1].forEach(j => { const q = j ? QR : QL, n = Math.round(q * 10); for (let i = 0; i < n; i++) { const r = Math.sqrt((i + .5) / 10) * .85, a = i * 2.4 + T * .2; M(bp[j].x + r * Math.cos(a) * 1.0, bp[j].y + r * Math.sin(a) * 1.15); } });
      flights = flights.filter(f => (f.a += dt) < .35); flights.forEach(f => { const u = f.a / .35, j = f.j, ex = bp[j].x + Math.cos(f.s) * f.r * .8, ey = bp[j].y + Math.sin(f.s) * f.r * .9; M(f.x0 + (ex - f.x0) * u, f.y0 + (ey - f.y0) * u + Math.sin(u * Math.PI) * .7); });
      for (let i = 0; i < Math.round(Qc * 10); i++) Pl(hg.position.x - .8 + (i % 5) * .4, hg.position.y + (i < 5 ? .3 : -.3));
      mfill.scale.y = Math.max(.001, 4.2 * Qc); mfill.position.set(-6.4, 3.5 + 2.1 * Qc, .1); mfill.material.color.set(Qc > .8 ? 0x38bdf8 : 0x60a5fa);
      for (let i = 0; i < 12; i++) { const j = bp[0].x + (bp[1].x - bp[0].x) * 0 , x = -3.2 + i * .58, n = Math.abs(x - bp[0].x) < Math.abs(x - bp[1].x) ? 0 : 1, q = n ? QR : QL, lift = q > .3 ? Math.max(0, Math.sin(T * 3 + i)) * 1.5 * cl((q - .3) / .5) : 0; tp.set([x, 2.75 + lift, ((i * 5) % 3 - 1) * .5], i * 3); }
      bits.geometry.attributes.position.needsUpdate = true; P.pull = Math.max(QL, QR) > .35; P.rubs = rubs;
      lm.position.set(-.5, 10.5, 0); lm.set('Balloons: minus (−)'); lp.position.set(hg.position.x, hg.position.y - 1.4, 0); lp.set('Wool cloth: plus (+)');
    } else {
      const lv = P.c - 1, cap = CAP[lv]; hit = P.rod ? 'rod' : 'tree'; if (Cs < cap) Cs = Math.min(cap, Cs + RATE[lv] * dt); if (cap < 1 && Cs > cap) Cs = cap;
      const tx = hit === 'rod' ? 3.6 : -4.8, ty = hit === 'rod' ? 6.3 : 5.5;
      if (Cs >= 1 && ts > MINGAP) { Cs = 0; ts = 0; pts = mk(tx + (R() - .5) * 2.5, 10.2, tx, ty); const nB = [3, 6, 9, 11, 12].sort(() => R() - .5).slice(0, 3);                    // discharge → a jagged bolt with side branches
        pts.br = nB.map((k, i) => { let [x, y] = pts[k], s = R() < .5 ? -1 : 1; return [0, 1, 2, 3].map(() => { const a = [x, y]; x += s * (.4 + R() * .5); y -= .7 + R() * .4; return a; }).reduce((o, p, q, arr) => (o.push([q ? arr[q - 1] : pts[k], p]), o), []); });
        if (hit === 'tree') P.treeHit = true; scorch = hit === 'tree' ? 3 : 0; const dur = P.d * 3; pend.push({ at: T + dur, dur, t0: T, x: tx, y: ty, d: P.d }); ring = { x: tx, y: ty, t0: T, dur }; lastDur = dur; }
      P.q = Cs; mats[0].color.set(0x5b6578).lerp(new THREE.Color(0x2b3342), (P.c - 1) / 4); mats[1].color.set(0x8a96ab).lerp(new THREE.Color(0x465063), (P.c - 1) / 4); cloud.children.forEach((m, i) => { const s = .66 + Math.sin(T * .6 + i) * .025; m.scale.set(1 + Math.sin(T * .4 + i * 2) * .02, s, 1); });
      trunk.position.set(-4.8, 1.5, 0); crown.position.set(-4.8, 3.8, 0); crown2.position.set(-4.3, 4.6, .2); house.position.set(3.6, 1.7, 0); roof.position.set(3.6, 4.1, 0); rod.position.set(3.6, 5.4, 0);
      scorch = Math.max(0, scorch - dt); const sc = new THREE.Color(0x16a34a).lerp(new THREE.Color(0x3a2a1a), cl(scorch)); crown.material.color.copy(sc); crown2.material.color.copy(sc).multiplyScalar(1.1);
      const rn_ = (P.c - 1) * 25; for (let i = 0; i < 100; i++) { ry[i] -= 15 * dt; if (ry[i] < .4) { ry[i] = 10 + R() * .5; rx[i] = R() * 15 - 7.5; } const on = i < rn_; rn.set(on ? [rx[i], ry[i], 0, rx[i] - .12, ry[i] + .7, 0] : [0, -99, 0, 0, -99, 0], i * 6); } rain.geometry.attributes.position.needsUpdate = true;
      for (let k = 0; k < Math.round(Cs * 16); k++) M(-5.2 + (k % 8) * 1.45 + (k >> 3) * .6, 10.5 - (k >> 3) * .3); for (let k = 0; k < Math.round(Cs * 10); k++) Pl(-4 + k * .9, 13.1 - (k & 1) * .5);   // minus at the cloud base, plus at the top
      for (let k = 0; k < Math.round(Cs * 8); k++) Pl(tx + ((k % 3) - 1) * .5, ty + .5 + (k >> 2) * .5);                                                                                                // plus charge gathers on the tallest point
      const on = !!(pts && ts < .55 && (ts < .3 || ts > .34)), lead = ts < .14, nv = pts ? Math.ceil(16 * (lead ? ts / .14 : 1)) : 0;
      bM.forEach((b, i) => { b.visible = on && i < nv; if (b.visible) { b.set(V(pts[i][0], pts[i][1], 0), V(pts[i + 1][0], pts[i + 1][1], 0)); b.material.color.set(lead ? 0xa5b4fc : 0xfff7c2); const g = bG[i]; g.visible = !lead; if (!lead) g.set(V(pts[i][0], pts[i][1], 0), V(pts[i + 1][0], pts[i + 1][1], 0)); } else bG[i].visible = false; });
      bB_.forEach((b, i) => { const br = pts && pts.br && pts.br[i >> 2] && pts.br[i >> 2][i & 3]; b.visible = !!(on && br && i < nv * .75); if (b.visible) b.set(V(br[0][0], br[0][1], 0), V(br[1][0], br[1][1], 0)); });
      const f1 = ts >= .14 && ts < .3 ? 1 - (ts - .14) / .16 : 0, f2 = ts >= .34 && ts < .52 ? .7 * (1 - (ts - .34) / .18) : 0; fl.material.opacity = .45 * Math.max(f1, f2); light.intensity = 5 * Math.max(f1, f2);
      glow.visible = !!on && !lead; if (pts) { glow.position.set(tx, ty, 0); glow.scale.setScalar(1 + (ts - .14) * 2.5); } if (!glow.parent) S.add(glow); rod.material.color.set(on && hit === 'rod' && !lead ? 0xfde047 : 0x94a3b8);
      for (let i = pend.length - 1; i >= 0; i--) if (T >= pend[i].at) { thT = 2.5; if (P.snd) rumble(.6, 3.5); if (pend[i].d === 4) P.thundered = true; lastDur = pend[i].dur; pend.splice(i, 1); }                                   // the sound arrives
      thT = Math.max(0, thT - dt); lq.position.set(OBS[0] - .6, 5.4, 0); lq.set(thT > 0 ? 'Thunder!' : '');
      const sw = pend.length ? (T - pend[0].t0) : 0; lsw.set(pend.length ? `Flash seen: ${sw.toFixed(1)} s` : lastDur ? `Thunder came after ${lastDur} s` : '');
      if (ring) { const e = (T - ring.t0) / ring.dur, Rr = Math.hypot(OBS[0] - ring.x, OBS[1] - ring.y); ringM.position.set(ring.x, ring.y, 0); const r = Math.max(.01, Rr * Math.min(1, e)); ringM.scale.set(r, r, 1); ringM.material.opacity = e < 1 ? .5 : Math.max(0, .5 - (e - 1) * ring.dur * 2); } else ringM.material.opacity = 0;
      P.spark = !!on; P.dly = P.d * 3;
    }
    mp.geometry.setDrawRange(0, nm); pp.geometry.setDrawRange(0, np); mp.geometry.attributes.position.needsUpdate = pp.geometry.attributes.position.needsUpdate = true; mp.visible = pp.visible = true;
    if (A) [...bM, ...bG, ...bB_].forEach(b => b.visible = false); if (A) { fl.material.opacity = 0; light.intensity = 0; glow.visible = false; }
  },
  ro: { Charge: P => word(P.q), Rubs: P => P.m === 1 ? String(P.rubs) : null, 'You are': P => P.m === 2 ? P.d + ' km away' : null, 'Thunder after': P => P.m === 2 ? P.dly + ' s' : null },
  status: P => P.m === 2 ? (P.spark ? ['Flash!', true] : ['Charging', false, 'warn']) : P.pull ? ['Paper jumps', true] : P.r === 1 ? ['Not rubbing', false, 'warn'] : ['Rubbing…', false, 'warn'],
  note: P => P.m === 1 ? (P.r === 1 && P.q < .02 ? 'Nothing is rubbed yet. Raise Rubbing to start.' : P.q < .02 ? 'Rubbing moves minus charge from the cloth to the balloons.' : P.q < .45 ? 'Charge builds up with every rub. Keep going!' : 'Both balloons have minus charge, so they push apart. Paper jumps up.')
    : P.c < 3 ? 'The cloud has little charge. No spark can jump yet.' : `A spark jumps to the ${hit === 'rod' ? 'rod' : 'tall tree'}. Light is fast; thunder comes ${P.d * 3} s later.`,
  try: [{ t: 'In <b>Rub it</b>, set <b>Rubbing</b> to <b>Very fast</b>. Watch the charge build and the balloons swing apart.', check: P => P.m === 1 && P.r === 5 && P.q > .5, yes: 'Yes! Same charges push apart.' },
    { t: 'Set Rubbing to <b>Slow</b>. Do the paper bits jump yet?', check: P => P.m === 1 && P.r === 2 && P.q > .03 && !P.pull, yes: 'Yes! Not enough charge yet.' },
    { t: 'Press <b>Touch to discharge</b>. What happens to the balloons?', check: P => P.discharged, yes: 'Yes! The charge flows away.' },
    { t: 'In <b>Storm</b>, turn the rod off. Where does the spark go?', check: P => P.treeHit, yes: 'Yes! With no rod, the tree is hit.' },
    { t: 'Set <b>You are</b> to <b>4 km</b>. Count the seconds from flash to thunder.', check: P => P.thundered, yes: 'Yes! Far away, thunder comes later.' }],
  key: ['Rubbing moves minus charge. Like charges push apart; unlike charges pull together.', 'Touching a charged body lets the charge flow away (earthing).', 'Light is very fast, sound is slow: thunder takes about 3 s per km.', 'In a storm, go indoors. Never stand under a tall tree.', 'Stay away from water, wires and metal poles in a storm.', 'A lightning rod carries the spark safely to the ground.'],
  quiz: [{ q: 'Two balloons with the same charge will…', o: ['pull together', 'push apart', 'do nothing'], a: 1, why: 'Like charges push apart.' }, { q: 'Where is it safest in a thunderstorm?', o: ['Under a tall tree', 'Inside a house', 'In open water'], a: 1, why: 'A house keeps you away from the strike.' },
    { q: 'You see a flash, then hear thunder 6 s later. How far is the storm?', o: ['About 2 km', 'About 6 km', 'Right above you'], a: 0, why: 'Thunder takes about 3 s per km, so 6 s is about 2 km.' }]
};
