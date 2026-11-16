// Class 8 · Ch 16 Light — laws of reflection; regular (mirror) vs diffuse (rough wall) reflection. Turn the mirror, name the rays, one or three torches.
import { S, V, D, THREE, mat, box, beam, label } from '../scene.js';
const L = 4.6, RL = 5, ARROWS = true, NF = 20, FW = .7, YEL = 0xfde047, ORG = 0xfb923c;     // torch distance · reflected ray length · false = draw no arrowheads · rough-wall bumps and their width
const fr = i => Math.abs(Math.sin(i * 12.9898 + 3.1) * 43758.5453) % 1, H = Array.from({ length: NF + 1 }, (_, j) => (fr(j) - .5) * 1.1);   // height of each bump corner along the rough wall
const cr = (a, b) => a[0] * b[1] - a[1] * b[0], rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)], wrap = a => Math.atan2(Math.sin(a), Math.cos(a)), P3 = (p, z = 0) => V(p[0], p[1], z);
const hitRough = (p, d) => { let b = null; for (let j = 0; j < NF; j++) { const ax = -7 + j * FW, ay = H[j], e = [FW, H[j + 1] - ay], den = cr(d, e); if (Math.abs(den) < 1e-6) continue; const w = [ax - p[0], ay - p[1]], t = cr(w, e) / den, s = cr(w, d) / den; if (t > 0 && s >= 0 && s <= 1 && (!b || t < b.t)) b = { t, n: [-e[1] / FW, 1] }; }     // which bump does this ray hit first?
  if (b) { const m = Math.hypot(...b.n); b.n = b.n.map(v => v / m); } return b; };
let wg, sm, rw, inc, rf, rf2, gI, gR, nl, ah, hd, ai, ar, torch, lbl;
export default {
  title: 'Reflection — Bouncing Light', cam: { d: 14, e: .08, a: 0, t: V(0, 3.2, 0), ref: 1.3 },
  sliders: [{ k: 'i', l: '🔦 Torch angle', min: 0, max: 80, step: 5, v: 40, u: '°' }, { k: 't', l: '🪞 Mirror tilt', min: -30, max: 30, step: 5, v: 0, u: '°' },
    { k: 's', l: '🧱 Surface', min: 1, max: 2, step: 1, v: 1, names: ['Smooth mirror', 'Rough wall'] }, { k: 'n', l: '💡 Torches', min: 1, max: 2, step: 1, v: 1, names: ['One', 'Three'] }],
  setup() {
    wg = new THREE.Group(); S.add(wg);                                                                                                                       // the wall turns about the middle (0,0)
    sm = new THREE.Group(); wg.add(sm); const mir = box(14, .3, 3, 0xcbd5e1); mir.material = mat(0xdbe4ee, { metalness: .3, roughness: .2, emissive: 0x2a3a52 }); mir.position.y = -.15; sm.add(mir);
    const shine = box(13.6, .05, 2.8, 0xffffff); shine.material = new THREE.MeshBasicMaterial({ color: 0xe8f6ff }); shine.position.y = .01; sm.add(shine); const back = box(14, .12, 3.05, 0x64748b); back.position.y = -.36; sm.add(back);   // polished top, grey back
    const pr = [[-7, -.6], [7, -.6]]; for (let j = NF; j >= 0; j--) pr.push([-7 + j * FW, H[j]]); const sh = new THREE.Shape(pr.map(p => new THREE.Vector2(...p))); const g = new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: false });   // rough wall: a row of tilted bumps
    rw = new THREE.Mesh(g, mat(0x9a8a78, { flatShading: true, roughness: .95 })); rw.position.z = -1.5; wg.add(rw);
    inc = []; rf = []; rf2 = []; gI = []; gR = []; nl = []; ah = []; hd = []; torch = [];
    for (let k = 0; k < 9; k++) { inc.push(beam(YEL, .07)); rf.push(beam(ORG, .07)); rf2.push(beam(ORG, .07)); const a = beam(YEL, .2), b = beam(ORG, .2); [a, b].forEach(m => { m.material.transparent = true; m.material.opacity = .13; m.material.blending = THREE.AdditiveBlending; m.material.depthWrite = false; }); gI.push(a); gR.push(b);
      nl.push(beam(0x94a3b8, .035)); const h1 = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff7c2 })); S.add(h1); hd.push(h1); }
    for (let k = 0; k < 18; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.17, .45, 12), new THREE.MeshBasicMaterial({ color: k < 9 ? YEL : ORG })); S.add(c); ah.push(c); }                // one arrowhead per ray, at its far end
    ai = []; ar = []; for (let k = 0; k < 8; k++) { ai.push(beam(YEL, .045)); ar.push(beam(ORG, .045)); }
    for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.4, .6, 1.7, 16), mat(0xfacc15, { emissive: 0x7a5a00 })); S.add(t); torch.push(t); }
    lbl = { inc: label('incident ray', '#fde047', .75), rf: label('reflected ray', '#fb923c', .75), nm: label('normal', '#cbd5e1', .75), ai: label('', '#fde047', .8), ar: label('', '#fb923c', .8), wl: label('', '#94a3b8', .75) };
  },
  reset() {},
  step(dt, P) {
    const al = P.i * D, ph = P.t * D, rough = P.s === 2, nT = P.n === 2 ? 3 : 1, u = [-Math.sin(al), Math.cos(al)], dd = [-u[0], -u[1]], ew = [Math.cos(ph), Math.sin(ph)], nw = [-Math.sin(ph), Math.cos(ph)], sp = nT === 3 ? 2.4 : 0, SK = k => (k - (nT - 1) / 2) * sp;
    wg.rotation.z = ph; sm.visible = !rough; rw.visible = rough; P.iS = P.i - P.t; P.back = !rough && Math.abs(P.iS) > 85; P.iM = Math.round(Math.abs(P.iS));                    // angle in = torch angle minus mirror tilt (measured from the normal)
    const dls = rough ? (nT === 3 ? [-.45, .45] : [-1.6, -.8, 0, .8, 1.6]) : [0], pp = [Math.cos(al), Math.sin(al)], rays = []; for (let k = 0; k < nT; k++) dls.forEach(dl => rays.push({ k, dl, st: [ew[0] * SK(k) + u[0] * L + pp[0] * dl, ew[1] * SK(k) + u[1] * L + pp[1] * dl] }));   // rough wall: a wide beam of parallel rays across the torch face
    const pi = nT === 3 ? rays.findIndex(r => r.k === 1) : 0; let C = null;                                                             // the labelled ray: first ray of the middle torch (or the outer ray of one torch)
    rays.forEach((r, q) => { let hit, n; if (rough) { const pl = rot(r.st, -ph), dl = rot(dd, -ph), h = hitRough(pl, dl), t = h ? h.t : -pl[1] / dl[1]; hit = rot([pl[0] + dl[0] * t, pl[1] + dl[1] * t], ph); n = rot(h ? h.n : [0, 1], ph); }
      else { hit = [ew[0] * SK(r.k), ew[1] * SK(r.k)]; n = nw; }
      const dn = dd[0] * n[0] + dd[1] * n[1], rr = [dd[0] - 2 * dn * n[0], dd[1] - 2 * dn * n[1]], ok = dn < 0 && !P.back; let end = [hit[0] + rr[0] * RL, hit[1] + rr[1] * RL], b2 = null, e2 = null, r2 = null;
      if (rough && ok) { const nl_ = rot(n, -ph), hl = rot(hit, -ph), h2 = hitRough([hl[0] + nl_[0] * .02, hl[1] + nl_[1] * .02], rot(rr, -ph)); if (h2 && h2.t < RL) {          // the reflected ray hits the next bump and bounces again
        b2 = [hit[0] + rr[0] * h2.t, hit[1] + rr[1] * h2.t]; const n2 = rot(h2.n, ph), d2 = rr[0] * n2[0] + rr[1] * n2[1]; r2 = [rr[0] - 2 * d2 * n2[0], rr[1] - 2 * d2 * n2[1]]; e2 = [b2[0] + r2[0] * 3.5, b2[1] + r2[1] * 3.5]; end = b2; } }
      inc[q].visible = gI[q].visible = true; inc[q].set(P3(r.st), P3(hit)); gI[q].set(P3(r.st), P3(hit)); rf[q].visible = gR[q].visible = ok; if (ok) { rf[q].set(P3(hit), P3(end)); gR[q].set(P3(hit), P3(end)); }
      rf2[q].visible = !!e2; if (e2) rf2[q].set(P3(b2), P3(e2));
      hd[q].visible = true; hd[q].position.set(hit[0], hit[1], 0);
      const arrow = (m, tip, dir, vis) => { m.visible = ARROWS && vis; if (m.visible) { m.position.set(tip[0] - dir[0] * .22, tip[1] - dir[1] * .22, 0); m.quaternion.setFromUnitVectors(V(0, 1, 0), V(dir[0], dir[1], 0)); } };
      arrow(ah[q], hit, dd, true); arrow(ah[9 + q], e2 || end, r2 || rr, ok);                                                                                          // incident arrow touches the surface; the reflected arrow sits at the very end of the ray; nothing mid-ray
      const prim = q === pi; nl[q].visible = prim || (rough && nT === 1); if (nl[q].visible) { const len = prim ? (rough ? 2.4 : 6.2) : .9; nl[q].set(P3(hit), V(hit[0] + n[0] * len, hit[1] + n[1] * len, 0)); }
      if (prim) C = { hit, n, rr, end, st: r.st, ok, len: rough ? 2.4 : 6.2 }; });
    for (let q = rays.length; q < 9; q++) [inc[q], gI[q], rf[q], rf2[q], gR[q], nl[q], hd[q], ah[q], ah[9 + q]].forEach(o => o.visible = false);
    torch.forEach((t, k) => { t.visible = k < nT; if (k < nT) { t.position.set(ew[0] * SK(k) + u[0] * (L + .85), ew[1] * SK(k) + u[1] * (L + .85), 0); t.quaternion.setFromUnitVectors(V(0, 1, 0), V(u[0], u[1], 0)); t.scale.set(rough ? (nT === 3 ? 1.5 : 3.4) : 1, 1, 1); } });
    const pn = Math.atan2(C.n[1], C.n[0]), di = wrap(Math.atan2(u[1], u[0]) - pn), dr = wrap(Math.atan2(C.rr[1], C.rr[0]) - pn), arc = (pool, dlt, vis) => pool.forEach((m, j) => { m.visible = vis; if (vis) { const a0 = pn + dlt * j / 8, a1 = pn + dlt * (j + 1) / 8; m.set(V(C.hit[0] + 1.5 * Math.cos(a0), C.hit[1] + 1.5 * Math.sin(a0), 0), V(C.hit[0] + 1.5 * Math.cos(a1), C.hit[1] + 1.5 * Math.sin(a1), 0)); } });
    const cl = rough && nT === 3; arc(ai, di, !P.back && !cl); arc(ar, dr, C.ok && !cl);                                      // six scattered rays: skip the angle arcs so the picture stays readable P.iA = Math.round(Math.abs(di) / D); P.rA = C.ok ? Math.round(Math.abs(dr) / D) : 0;
    const oi = di >= 0 ? [-u[1], u[0]] : [u[1], -u[0]], orr = dr <= 0 ? [C.rr[1], -C.rr[0]] : [-C.rr[1], C.rr[0]], at = (a, b, f, o, w) => [a[0] + (b[0] - a[0]) * f + o[0] * w, a[1] + (b[1] - a[1]) * f + o[1] * w];   // names and angle labels sit just outside the rays, never on them
    lbl.inc.position.set(...at(C.st, C.hit, .25, oi, 1.2), 0); lbl.rf.position.set(...at(C.hit, C.end, .8, orr, 1.3), 0); lbl.rf.visible = C.ok;
    lbl.nm.position.set(C.hit[0] + C.n[0] * (C.len + .6), C.hit[1] + C.n[1] * (C.len + .6), 0); lbl.nm.set(rough ? 'normal (at this bump)' : 'normal');
    lbl.ai.position.set(C.hit[0] + u[0] * 2.1 + oi[0] * .95, C.hit[1] + u[1] * 2.1 + oi[1] * .95, 0); lbl.ai.visible = !P.back && !cl; lbl.ai.set(`i = ${P.iA}°`);
    lbl.ar.position.set(C.hit[0] + C.rr[0] * 2.1 + orr[0] * .95, C.hit[1] + C.rr[1] * 2.1 + orr[1] * .95, 0); lbl.ar.visible = C.ok && !cl; lbl.ar.set(`r = ${P.rA}°`);
    const wl = rot([0, -1.5], ph); lbl.wl.position.set(wl[0], wl[1], 0); lbl.wl.set(rough ? 'Rough wall' : 'Mirror');
  },
  head: 'Angle in',
  ro: { 'Angle in': P => P.back ? '—' : P.iM + '°', 'Angle out': P => P.s === 2 ? 'every way' : P.back ? '—' : P.rA + '°', 'Mirror turned': P => (P.t > 0 ? '+' : '') + P.t + '°', 'Ray turned': P => P.s === 2 ? null : (2 * P.t > 0 ? '+' : '') + 2 * P.t + '°', 'Same?': P => P.s === 2 ? '❌ No' : P.back ? '—' : '✅ Yes!' },
  note: P => P.s === 2 ? 'Each ray hits a bump tilted differently, so the light scatters. Every bump still obeys i = r.'
    : P.back ? 'The light now hits the back of the mirror. Turn the mirror back.'
    : P.t ? `Mirror turned <b>${P.t}°</b>: the reflected ray turned <b>${2 * P.t}°</b>. Still i = r = <b>${P.iM}°</b>.` : P.i === 0 ? '<b>Straight in, straight back!</b> The light hits head-on.' : `The light hits at <b>${P.iM}°</b> and leaves at <b>${P.iM}°</b>. The two angles are always equal.`,
  try: [{ t: 'Move the torch to <b>0°</b>. Where does the light go?', check: P => P.s === 1 && P.i === 0 && P.t === 0, yes: 'Yes! It bounces straight back.' },
    { t: 'Set <b>60°</b>. What is the angle out?', check: P => P.s === 1 && P.i === 60 && P.t === 0, yes: 'Yes! The angle out is 60° too.' },
    { t: 'Turn the mirror by <b>10°</b>. How far does the reflected ray turn?', check: P => P.s === 1 && Math.abs(P.t) === 10, yes: 'Yes! It turns twice as much: 20°.' },
    { t: 'Switch to <b>Rough wall</b>. Where does the light go?', check: P => P.s === 2, yes: 'Yes! A rough wall scatters light.' },
    { t: 'Pick <b>Three</b> torches on the mirror, then on the rough wall. Compare the reflected rays.', check: P => P.n === 2 && P.s === 2, yes: 'Yes! The mirror keeps rays parallel; the wall scatters them.' }],
  key: ['The <b>normal</b> is the line standing straight out from the surface (at 90°).', 'Angle in (i) equals angle out (r). Both are measured from the normal. The rays and normal lie in one plane.', 'Turn a mirror by some angle and the reflected ray turns twice as much.',
    'Smooth surface: regular reflection, parallel rays stay parallel. Rough surface: diffuse reflection, light scatters.', 'Every ray obeys the law, even on a rough wall. The bumps just tilt the normal differently.',
    'Mirror image: as far behind the mirror as you are in front, same size, flipped left to right. You cannot catch it on a screen.'],
  quiz: [{ q: 'A ray hits a mirror at 30° to the normal. The reflected ray leaves at…', o: ['60°', '30°', '0°'], a: 1, why: 'The two angles are always equal.' }, { q: 'Which gives diffuse reflection?', o: ['A mirror', 'Still water', 'A rough wall'], a: 2, why: 'Bumps send rays in many directions.' },
    { q: 'You turn a mirror by 10°. The reflected ray turns by…', o: ['5°', '10°', '20°'], a: 2, why: 'The reflected ray turns twice as much as the mirror.' }]
};
