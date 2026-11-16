// Class 8 · Ch 17 Stars and the Solar System — solar eclipse, lunar eclipse and Moon phases. Sun–Earth–Moon line-up, dark and light shadows, the Moon's tilted orbit, and what you see from Earth.
// NOT TO SCALE: the Sun, Earth and Moon are drawn near and big so the shadows fit on a phone. The geometry (which shadow hits what) is worked out from the drawn sizes, so near Moon → total, far Moon → annular.
import { S, C, V, D, THREE, label, arrow, beam, view } from '../scene.js';
import { earthTex, litMat, frus } from '../earth.js';
const DS = 8, RS = .8, RE = .7, RM = .3, DN = 2.9, DF = 4, DP = 3.4, TAU = 12 * D, SYN = 29.5;      // Sun distance · Sun, Earth, Moon radius · Moon distance near / far / phases · tilt drawn (real ≈ 5°) · days in a lunar month
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), SUN = V(-DS, 0, 0);
const lens = (a, b, d) => { if (d >= a + b) return 0; if (d <= Math.abs(a - b)) return Math.PI * Math.min(a, b) ** 2; const A = Math.acos(cl((d * d + a * a - b * b) / (2 * d * a), -1, 1)), B = Math.acos(cl((d * d + b * b - a * a) / (2 * d * b), -1, 1)); return a * a * A + b * b * B - .5 * Math.sqrt(Math.max(0, (-d + a + b) * (d + a - b) * (d - a + b) * (d + a + b))); };   // overlap area of two circles
const NAMES = ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
const phaseName = age => { const a = age % SYN; return a < .9 || a > SYN - .9 ? NAMES[0] : a < 6.5 ? NAMES[1] : a < 8.3 ? NAMES[2] : a < 13.5 ? NAMES[3] : a < 16.3 ? NAMES[4] : a < 21.5 ? NAMES[5] : a < 23.3 ? NAMES[6] : NAMES[7]; };
const moonTex = () => { const c = document.createElement('canvas'); c.width = 128; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#c9ccd3'; x.fillRect(0, 0, 128, 64); for (let i = 0; i < 46; i++) { const a = Math.abs(Math.sin(i * 91.7) * 43758) % 1, b = Math.abs(Math.sin(i * 12.3 + 1) * 24634) % 1, r = 2 + (Math.abs(Math.sin(i * 7.7) * 999) % 1) * 7; x.fillStyle = `rgba(110,116,130,${.25 + b * .3})`; x.beginPath(); x.arc(a * 128, b * 64, r, 0, 7); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
let tex, hud, hctx, hsig, sunM, halo, earth, emat, moon, mmat, plane, ring, orb, ghosts, pen, umb, ant, pen2, umb2, pin, pstick, phead, sl1, sl2, rays, lab, lastMode, lastLay, day, ld, spinA;
const ORB_N = 72, pt = V();
export default {
  title: 'Eclipses and Moon Phases', cam: { d: 17, e: .55, a: 0, t: V(-2.1, 0, 0), ref: 1 },
  head: 'Now', tabs: [['stars8', 'Earth'], ['eclipse8', 'Eclipses'], ['planets8', 'Planets']],
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 3, step: 1, v: 1, names: ['Solar', 'Lunar', 'Phases'] },
    { k: 's', l: '🌙 Moon moves', min: -40, max: 40, step: 2, v: -16, u: '°', axis: true, w: P => P.m < 3 },
    { k: 'nu', l: '🔄 Turn the tilt', min: 0, max: 90, step: 10, v: 90, u: '°', axis: true, w: P => P.m < 3 && P.tilt },
    { k: 'd', l: '📅 Day of month', min: 1, max: 30, step: 1, v: 8, axis: true, w: P => P.m === 3 }],
  toggles: [{ k: 'near', l: 'Moon is near', v: true, w: P => P.m === 1 }, { k: 'tilt', l: 'Tilt Moon’s orbit', v: false, w: P => P.m < 3 }, { k: 'run', l: 'Run time', v: true, w: P => P.m === 3 }],
  setup() {
    tex = earthTex(); emat = litMat({ map: tex, ambient: .14 }); earth = new THREE.Mesh(new THREE.SphereGeometry(RE, 32, 22), emat); S.add(earth);
    mmat = litMat({ map: moonTex(), ambient: .06, soft: .03 }); moon = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), mmat); S.add(moon);
    sunM = new THREE.Mesh(new THREE.SphereGeometry(RS, 28, 18), new THREE.MeshBasicMaterial({ color: 0xfbbf24 })); sunM.position.copy(SUN); S.add(sunM); halo = new THREE.Mesh(new THREE.SphereGeometry(RS * 1.35, 24, 16), new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: .2, depthWrite: false, blending: THREE.AdditiveBlending })); halo.position.copy(SUN); S.add(halo);
    plane = new THREE.Mesh(new THREE.CircleGeometry(4.9, 56), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: .1, side: THREE.DoubleSide, depthWrite: false })); plane.rotation.x = -Math.PI / 2; S.add(plane);
    orb = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 5), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 }), ORB_N); orb.frustumCulled = false; S.add(orb);
    ghosts = Array.from({ length: 8 }, () => { const g = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), litMat({ map: null, color: 0xc9ccd3, ambient: .05, soft: .03 })); S.add(g); return g; });
    pen = frus(0x94a3b8, .32); umb = frus(0x000000, .8); ant = frus(0x64748b, .3); pen2 = frus(0x94a3b8, .24); umb2 = frus(0x450a0a, .5);
    pstick = beam(0xef4444, .035); phead = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 })); S.add(phead); sl1 = beam(0xfde047, .018); sl2 = beam(0xe2e8f0, .018); rays = [-1.2, 0, 1.2].map(() => arrow(0xfde047, .06));
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; hctx = cv.getContext('2d'); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; hud = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); hud.renderOrder = 20; hud.position.z = -6; hud.t = t; C.add(hud); S.add(C);
    lab = { sun: label('Sun', '#fde047', .9), earth: label('Earth', '#93c5fd', .85), moon: label('Moon', '#e2e8f0', .85), um: label('Dark shadow (umbra)', '#cbd5e1', .75), pe: label('Light shadow (penumbra)', '#cbd5e1', .75), you: label('You', '#fca5a5', .85), ns: label('Sizes and distances not to scale', '#fbbf24', .75), sf: label('Never look at the Sun directly!', '#fbbf24', .8), tl: label('Moon’s tilted path', '#94a3b8', .7), n: label('New Moon', '#cbd5e1', .7), f: label('Full Moon', '#cbd5e1', .7), q1: label('First quarter', '#cbd5e1', .7), q3: label('Last quarter', '#cbd5e1', .7) };
  },
  reset() { day = 8; ld = -1; spinA = 0; lastMode = 0; lastLay = ''; hsig = ''; },
  step(dt, P) {
    const m = P.m, solar = m === 1, lunar = m === 2, ph = m === 3, lay = document.documentElement.dataset.mode;
    if (lastMode !== m || lastLay !== lay) { lastMode = m; lastLay = lay; view.set({ d: 17, e: .55, a: 0, t: V(lunar ? -1.2 : -2.1, lay === 'portrait' ? 2.6 : lay === 'landscape' ? -.7 : 0, 0), ref: 1 }); hsig = ''; }
    if (P.d !== ld) { ld = P.d; day = P.d; } if (ph && P.run) { day += dt * 1.5; if (day > 30.5) day -= SYN; }
    spinA += dt * .4; earth.rotation.y = spinA;
    // ── where the Moon is
    const dM = ph ? DP : P.near ? DN : DF, psi = (ph ? (day - 1) / SYN * 360 : solar ? P.s : 180 + P.s) * D, tl = !ph && P.tilt, nu = P.nu * D, c = Math.cos(nu), s = Math.sin(nu), ct = Math.cos(TAU), st = Math.sin(TAU);
    const posAt = (ps, out) => { const vx = -Math.cos(ps) * dM, vz = Math.sin(ps) * dM; if (!tl) return out.set(vx, 0, vz); const dot = c * vx + s * vz, k = 1 - ct; return out.set(vx * ct + c * dot * k, (s * vx - c * vz) * st, vz * ct + s * dot * k); };
    const M = posAt(psi, V()); moon.position.copy(M); const rm = ph ? .45 : RM; moon.scale.setScalar(rm); const toSun = SUN.clone().sub(M).normalize(); mmat.uniforms.sun.value.copy(toSun); emat.uniforms.sun.value.set(-1, 0, 0);
    const mats = new THREE.Matrix4(), q = new THREE.Quaternion(), one = V(1, 1, 1); for (let i = 0; i < ORB_N; i++) { posAt(i / ORB_N * 6.2832, pt); mats.compose(pt, q, one); orb.setMatrixAt(i, mats); } orb.instanceMatrix.needsUpdate = true;
    plane.scale.setScalar(dM / 3.4 + .1); [pen, umb, ant, pen2, umb2, sl1, sl2, pstick, phead, lab.um, lab.pe, lab.you, lab.sf, lab.tl, plane].forEach(o => o.visible = false); rays.forEach(r => r.visible = ph); ghosts.forEach(g => g.visible = ph);
    [lab.n, lab.f, lab.q1, lab.q3].forEach(l => l.visible = false); plane.visible = !ph && tl; lab.tl.visible = !ph && tl;
    // ── the pin ("You") and what is seen from there
    let O = V(), type = 'None', cov = 0, gap = 0, hudData = null;
    if (solar) {
      const u = M.clone().sub(SUN).normalize(), t0 = -M.dot(u), cc = M.clone().addScaledVector(u, t0), h = cc.length();           // the line from the Sun through the Moon's middle: how close does it pass to Earth's middle?
      O = h < RE ? cc.clone().addScaledVector(u, -Math.sqrt(RE * RE - h * h)) : cc.clone().normalize().multiplyScalar(RE);
      const vS = SUN.clone().sub(O), vM = M.clone().sub(O), ts = Math.asin(RS / vS.length()), tm = Math.asin(rm / vM.length()), f = vS.clone().normalize(), g = vM.clone().normalize(), sep = Math.acos(cl(f.dot(g), -1, 1));
      cov = lens(ts, tm, sep) / (Math.PI * ts * ts); type = sep >= ts + tm ? 'None' : tm >= ts && sep <= tm - ts + 1e-4 ? 'Total' : tm < ts && sep <= ts - tm + 1e-4 ? 'Annular' : 'Partial'; if (type === 'Total') cov = 1;
      const e2 = V(0, 1, 0).addScaledVector(f, -f.y).normalize(), e1 = V().crossVectors(f, e2), dd = g.clone().sub(f); P.Rm = tm / ts; hudData = { dx: dd.dot(e1) / ts, dy: dd.dot(e2) / ts, rm: tm / ts, cov, type }; gap = Math.acos(cl(M.clone().normalize().dot(V(-1, 0, 0)), -1, 1)) / D;
      const dms = M.distanceTo(SUN), Lu = dms * rm / (RS - rm), k = (RS + rm) / dms, Le = M.length() + RE + .9, L1 = Math.min(Le, Lu);
      pen.visible = true; pen.set(M, rm, M.clone().addScaledVector(u, Le), rm + k * Le); umb.visible = true; umb.set(M, rm, M.clone().addScaledVector(u, L1), rm * (1 - L1 / Lu));
      if (Le > Lu) { ant.visible = true; ant.set(M.clone().addScaledVector(u, Lu), 0, M.clone().addScaledVector(u, Le), rm * (Le / Lu - 1)); }
      P.Lu = Lu; P.reach = Lu >= M.length() - RE;
      lab.um.set('Dark shadow (umbra)'); lab.pe.set('Light shadow (penumbra)'); lab.um.position.set(1.6, 1.5, -1); lab.pe.position.set(1.4, -.9, 3.3); lab.um.visible = lab.pe.visible = true; lab.sf.visible = true;
      sl1.visible = sl2.visible = true; sl1.set(O, O.clone().addScaledVector(f, 2.6)); sl2.set(O, O.clone().addScaledVector(g, vM.length())); mmat.uniforms.tint.value.set(1, 1, 1); mmat.uniforms.dim.value = 1;
    } else if (lunar) {
      const x = M.x, off = Math.hypot(M.y, M.z), Lu = DS * RE / (RS - RE), ru = RE * (1 - x / Lu), rp = RE + x * (RS + RE) / DS, uA = lens(RM, ru, off) / (Math.PI * RM * RM), pA = lens(RM, rp, off) / (Math.PI * RM * RM);
      type = off + RM <= ru ? 'Total' : off - RM < ru ? 'Partial' : off - RM < rp ? 'Penumbral' : 'None'; cov = uA; gap = Math.acos(cl(M.clone().normalize().dot(V(1, 0, 0)), -1, 1)) / D;
      const Le = DF + 1.3, o = V(0, 0, 0); umb2.visible = true; umb2.set(o, RE, V(Le, 0, 0), RE * (1 - Le / Lu)); pen2.visible = true; pen2.set(o, RE, V(Le, 0, 0), RE + Le * (RS + RE) / DS);
      mmat.uniforms.tint.value.set(1 - .3 * uA, 1 - .78 * uA, 1 - .88 * uA); mmat.uniforms.dim.value = 1 - .3 * (pA - uA) - .45 * uA;
      O = M.clone().normalize().multiplyScalar(RE); const f = M.clone().sub(O).normalize(); sl2.visible = true; sl2.set(O, M);
      hudData = { off: off / RM, ru: ru / RM, rp: rp / RM, dz: M.z / RM, dy: M.y / RM, uA, type }; P.ru = ru / RM;
      lab.um.set('Earth’s dark shadow'); lab.pe.set('Earth’s light shadow'); lab.um.position.set(Le * .74, -.2, 0); lab.pe.position.set(Le * .82, 1.8, 0); lab.um.visible = lab.pe.visible = true;
    } else {
      O = M.clone().normalize().multiplyScalar(RE); sl2.visible = true; sl2.set(O, M); cov = (1 - Math.cos(psi)) / 2; mmat.uniforms.tint.value.set(1, 1, 1); mmat.uniforms.dim.value = 1; P.age = day - 1; P.ph = phaseName(day - 1);
      rays.forEach((r, i) => r.set(-6.1, 0, 2.4, 1, [-1.2, 0, 1.2][i])); hudData = { psi: psi, cov };
      ghosts.forEach((g, i) => { const ps = i * .7854; posAt(ps, g.position); g.visible = Math.abs(Math.atan2(Math.sin(ps - psi), Math.cos(ps - psi))) > .3; g.material.uniforms.sun.value.copy(SUN.clone().sub(g.position).normalize()); });
      lab.n.position.set(-DP - .5, .6, 0); lab.f.position.set(DP + .6, .6, 0); lab.q1.position.set(0, .5, DP + .5); lab.q3.position.set(0, .5, -DP - .5); const near = a => Math.abs(Math.atan2(Math.sin(psi - a), Math.cos(psi - a))) < .6; lab.n.visible = !near(0); lab.q1.visible = !near(1.5708); lab.f.visible = !near(3.1416); lab.q3.visible = !near(4.7124);
    }
    P.ty = type; P.cov = cov; P.gap = gap; P.dM = dM; P.nearMoon = dM <= DN + .01; P.mY = M.y;
    pstick.visible = phead.visible = !!(solar || lunar || ph); { const n = O.clone().normalize(); pstick.set(O, O.clone().addScaledVector(n, .3)); phead.position.copy(O).addScaledVector(n, .33); lab.you.visible = true; lab.you.position.copy(O).addScaledVector(n, .9).add(V(0, .9, 0)); lab.you.set('You'); }
    P.ps = psi / D;
    lab.sun.position.set(-DS, lay === 'portrait' ? RS + .8 : -RS - .65, 0); lab.earth.position.set(.2, -RE - .8, 0); lab.moon.position.copy(M).add(V(0, rm + .55, 0)); lab.ns.position.set(-2.1, -1.6, 4.2); lab.sf.position.set(-DS + 1.4, lay === 'portrait' ? -RS - .8 : -RS - 1.5, 0); lab.sf.visible = solar;
    lab.tl.position.set(-dM * .72, -.9, dM * .72);
    // ── the "view from Earth" picture
    const sig = [m, hudData && Object.values(hudData).map(v => typeof v === 'number' ? v.toFixed(3) : v).join()].join('|'); if (sig !== hsig) { hsig = sig; drawHud(hctx, m, hudData); hud.t.needsUpdate = true; }
    const cvE = document.getElementById('cv'), w = cvE.clientWidth || 1, h = cvE.clientHeight || 1, visH = 2 * 6 * Math.tan(C.fov * D / 2), visW = visH * C.aspect, px = Math.min(w * .46, h * .36), sz = px / h * visH, pad = 8 / h * visH, topPad = (lay === 'portrait' ? 54 : 8) / h * visH;
    hud.scale.set(sz, sz, 1); hud.position.set(lay === 'portrait' ? visW / 2 - sz / 2 - pad : -visW / 2 + sz / 2 + pad, visH / 2 - sz / 2 - topPad, -6);
  },
  ro: { Now: P => P.m === 1 ? (P.ty === 'None' ? 'No eclipse' : P.ty + ' eclipse') : P.m === 2 ? (P.ty === 'None' ? 'No eclipse' : P.ty + ' eclipse') : P.ph,
    'Sun covered': P => P.m === 1 ? Math.round(P.cov * 100) + ' %' : null, 'Moon in dark shadow': P => P.m === 2 ? Math.round(P.cov * 100) + ' %' : null,
    'Moon is': P => P.m === 1 ? (P.nearMoon ? 'near (looks bigger)' : 'far (looks smaller)') : null, 'Moon–line gap': P => P.m < 3 ? Math.round(P.gap) + '°' : null,
    'Day': P => P.m === 3 ? Math.round(P.age + 1) + ' of 30' : null, 'Moon lit (from Earth)': P => P.m === 3 ? Math.round(P.cov * 100) + ' %' : null },
  status: P => P.m === 3 ? [P.ph, true] : P.ty === 'None' ? ['No eclipse', false, 'warn'] : [P.ty, true],
  note: P => P.m === 1 ? (P.ty === 'Total' ? '<b>Total solar eclipse.</b> The Moon hides the whole Sun and the sky goes dark. Never look at the Sun directly!' : P.ty === 'Annular' ? '<b>Annular eclipse.</b> The far Moon looks too small to hide the Sun: a bright ring is left. Never look at the Sun directly!' : P.ty === 'Partial' ? '<b>Partial eclipse.</b> The Moon hides only part of the Sun. Never look at the Sun directly!' : P.tilt && Math.abs(P.mY) > .15 ? 'The tilted orbit lifts the Moon above or below the line, so its shadow misses Earth: <b>no eclipse</b> this time.' : 'No eclipse: the Moon is not in line with the Sun and you. Drag <b>Moon moves</b> to 0°.')
    : P.m === 2 ? (P.ty === 'Total' ? '<b>Total lunar eclipse.</b> The Moon is inside Earth’s dark shadow and looks dim red.' : P.ty === 'Partial' ? '<b>Partial lunar eclipse.</b> Part of the Moon is inside Earth’s dark shadow.' : P.ty === 'Penumbral' ? '<b>Penumbral eclipse.</b> Only the light shadow touches the Moon: it just looks a little dim.' : P.tilt && Math.abs(P.mY) > .15 ? 'The tilted orbit lifts the Moon above or below Earth’s shadow: <b>no eclipse</b> this time.' : 'No eclipse: the Moon is not in Earth’s shadow. Drag <b>Moon moves</b> to 0°.')
    : `<b>${P.ph}.</b> The Sun always lights half of the Moon. From Earth we see ${Math.round(P.cov * 100)}% of the Moon’s face lit.`,
  try: [{ t: '<b>Solar:</b> drag <b>Moon moves</b> to 0°. What do you see from Earth?', check: P => P.m === 1 && P.ty === 'Total', yes: 'Yes! A total solar eclipse. Never look at the Sun!' },
    { t: 'Switch the Moon to <b>far</b> (turn off <b>Moon is near</b>). What changes?', check: P => P.m === 1 && P.ty === 'Annular', yes: 'Yes! The far Moon is too small: a ring of Sun is left.' },
    { t: 'Find a <b>partial</b> eclipse. Move the Moon a little away from 0°.', check: P => P.m === 1 && P.ty === 'Partial', yes: 'Yes! Only part of the Sun is hidden.' },
    { t: 'Turn on <b>Tilt Moon’s orbit</b>. Is there still an eclipse at 0°? Then <b>turn the tilt</b> to 0°.', check: P => P.m === 1 && P.tilt && P.nu === 0 && P.ty !== 'None', yes: 'Yes! Eclipses happen only when the Moon crosses the line.' },
    { t: '<b>Lunar:</b> move the Moon to 0°. What colour is the Moon?', check: P => P.m === 2 && P.ty === 'Total', yes: 'Yes! Red: sunlight bends round Earth’s edge.' },
    { t: '<b>Phases:</b> set the day to <b>15</b>. How much of the Moon do we see lit?', check: P => P.m === 3 && P.ph === 'Full Moon', yes: 'Yes! A full Moon.' }],
  key: ['A <b>solar eclipse</b>: the Moon is between the Sun and Earth, and its shadow falls on Earth. It happens at new Moon.', 'Total: the Moon hides the whole Sun. Partial: only part is hidden. Annular: the Moon is far and looks small, so a ring of Sun is left.', 'A <b>lunar eclipse</b>: Earth is between the Sun and the Moon, and Earth’s shadow falls on the Moon. It happens at full Moon.',
    'The Moon’s orbit is tilted about 5° to Earth’s path, so the Moon usually passes above or below the line. That is why there is not an eclipse every month.', 'The dark shadow is the <b>umbra</b>; the light shadow is the <b>penumbra</b>.', 'Never look at the Sun directly, even in an eclipse. It can hurt your eyes for ever. Use a pinhole viewer.', 'The Moon has no light of its own. The Sun lights half of it; the phases show how much of that half we can see. A month is about 29½ days.'],
  quiz: [{ q: 'When does a solar eclipse happen?', o: ['Moon between Sun and Earth', 'Earth between Sun and Moon', 'Moon far from Earth'], a: 0, why: 'The Moon’s shadow falls on Earth.' }, { q: 'Why is there not an eclipse every month?', o: ['The Moon is too small', 'The Moon’s orbit is tilted', 'Earth stops moving'], a: 1, why: 'The Moon usually passes above or below the Sun–Earth line.' },
    { q: 'During a total lunar eclipse the Moon looks…', o: ['Blue', 'Dim red', 'Invisible'], a: 1, why: 'Some red light bends round Earth into the shadow.' }]
};
// ── the little picture of what you see from Earth (a canvas on the screen)
function drawHud(x, m, d) {
  const W = 256, cx = 128, cy = 138, R = 104; x.clearRect(0, 0, W, W); x.fillStyle = 'rgba(8,12,24,.82)'; x.strokeStyle = '#94a3b8'; x.lineWidth = 3; x.beginPath(); x.roundRect ? x.roundRect(4, 4, 248, 248, 18) : x.rect(4, 4, 248, 248); x.fill(); x.stroke();
  x.font = '700 20px system-ui,sans-serif'; x.textAlign = 'center'; x.fillStyle = '#e2e8f0'; x.fillText(m === 3 ? 'What we see from Earth' : 'View from Earth', cx, 28);
  x.save(); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.clip();
  if (m === 1 && d) {                              // solar: sky, Sun, Moon, corona
    const Rs = 46, b = 1 - .97 * Math.pow(d.cov, 4); x.fillStyle = `rgb(${Math.round(60 + 90 * b)},${Math.round(90 + 110 * b)},${Math.round(150 + 90 * b)})`; if (d.type === 'Total') x.fillStyle = '#050816'; x.fillRect(0, 0, W, W);
    if (d.type === 'Total') { for (let i = 0; i < 30; i++) { x.fillStyle = 'rgba(255,255,255,.7)'; x.fillRect(20 + (i * 83) % 216, 40 + (i * 57) % 190, 2, 2); } const g = x.createRadialGradient(cx, cy, Rs * .95, cx, cy, Rs * 1.9); g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, Rs * 1.9, 0, 7); x.fill(); }
    x.fillStyle = '#fde047'; x.beginPath(); x.arc(cx, cy, Rs, 0, 7); x.fill(); x.fillStyle = '#0b1020'; x.beginPath(); x.arc(cx + d.dx * Rs, cy - d.dy * Rs, d.rm * Rs, 0, 7); x.fill();
  } else if (m === 2 && d) {                       // lunar: the Moon with Earth's shadow sliding over it
    const Rm = 42; x.fillStyle = '#050816'; x.fillRect(0, 0, W, W); for (let i = 0; i < 24; i++) { x.fillStyle = 'rgba(255,255,255,.6)'; x.fillRect(14 + (i * 71) % 228, 40 + (i * 53) % 200, 2, 2); }
    const shx = cx - d.dz * Rm, shy = cy + d.dy * Rm;   // Earth's shadow sits opposite to where the Moon is off the line x.save(); x.beginPath(); x.arc(cx, cy, Rm, 0, 7); x.clip(); x.fillStyle = '#d6d8de'; x.fillRect(0, 0, W, W);
    x.fillStyle = 'rgba(30,20,30,.3)'; x.beginPath(); x.arc(shx, shy, d.rp * Rm, 0, 7); x.fill(); const k = d.uA; x.fillStyle = `rgba(${Math.round(150 - 60 * k)},${Math.round(40)},${Math.round(30)},.82)`; x.beginPath(); x.arc(shx, shy, d.ru * Rm, 0, 7); x.fill(); x.restore();
    x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, Rm, 0, 7); x.stroke();
  } else if (m === 3 && d) {                       // phases: the lit part of the Moon as we see it
    const Rm = 52; x.fillStyle = '#050816'; x.fillRect(0, 0, W, W); x.fillStyle = '#1e293b'; x.beginPath(); x.arc(cx, cy, Rm, 0, 7); x.fill();
    const ps = d.psi, wax = Math.sin(ps) > 0, cc = Math.cos(ps); x.fillStyle = '#f1f5f9'; x.beginPath(); const sg = wax ? 1 : -1; x.arc(cx, cy, Rm, -Math.PI / 2, Math.PI / 2, !wax);
    for (let i = 0; i <= 40; i++) { const th = Math.PI / 2 - i / 40 * Math.PI; x.lineTo(cx + sg * Rm * cc * Math.cos(th), cy + Rm * Math.sin(th)); } x.closePath(); x.fill();
    x.fillStyle = 'rgba(100,110,130,.35)'; [[-14, -10, 8], [10, 8, 10], [-6, 20, 6], [18, -22, 6]].forEach(([a, b, r]) => { x.beginPath(); x.arc(cx + a, cy + b, r, 0, 7); x.fill(); });
  }
  x.restore(); x.strokeStyle = '#94a3b8'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
  if (m === 1) { x.font = '700 18px system-ui,sans-serif'; x.fillStyle = '#fbbf24'; x.fillText('Never look at the Sun!', cx, 246); }
}
