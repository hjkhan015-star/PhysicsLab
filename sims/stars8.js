// Class 8 · Ch 17 Stars and the Solar System — why we have day and night (Earth spins) and why we have seasons (Earth's tilt as it goes round the Sun). Not to scale.
import { S, V, D, THREE, arrow, label, view } from '../scene.js';
import { earthTex, litMat, ll } from '../earth.js';
const EPS = 23.5 * D, LAT = [-30, 0, 26], PLACE = ['South 30°', 'Equator', 'North 26°'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dateName = d => { let m = 0, r = Math.round(d); r = ((r - 1) % 365 + 365) % 365 + 1; while (r > ML[m]) r -= ML[m++]; return MON[m] + ' ' + r; };
const clock = h => { let m = Math.round(h * 60) % 1440, hh = Math.floor(m / 60), mm = m % 60; return (hh % 12 || 12) + ':' + String(mm).padStart(2, '0') + (hh < 12 ? ' am' : ' pm'); };
const TN = Array.from({ length: 49 }, (_, i) => clock(i / 2)), DN = Array.from({ length: 73 }, (_, i) => dateName(1 + i * 5));
const hi = a => a > 50 ? 'high' : a > 20 ? 'medium' : a > 0 ? 'low' : 'below horizon';
let sunM, halo, epos, tilt, spin, earth, mat_, axis, pin, stick, head, ray, sline, ghost, gl, rays, lSun, lEarth, lYou, lN, lSpin, lNS, lOrb, orbit, stars;
let T, Dd, lt, ld, lastMode, A0;
export default {
  title: 'Day, Night and Seasons', cam: { d: 17, e: 1.05, a: 0, t: V(-4.6, 0, 2.4), ref: 1.35 },
  head: 'Now', tabs: [['stars8', 'Earth'], ['eclipse8', 'Eclipses'], ['planets8', 'Planets']],
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Day', 'Year'] },
    { k: 't', l: '🕐 Time of day', min: 0, max: 24, step: .5, v: 10, names: TN, axis: true, w: P => P.m === 1 },
    { k: 'd', l: '📅 Date', min: 1, max: 361, step: 5, v: 81, names: DN, axis: true, w: P => P.m === 2 },
    { k: 'p', l: '📍 You live', min: 1, max: 3, step: 1, v: 3, names: PLACE, axis: true }],
  toggles: [{ k: 'run', l: 'Run time', v: true }],
  setup() {
    const g = new THREE.BufferGeometry(), a = []; for (let i = 0; i < 260; i++) { const u = Math.random() * 6.283, v = Math.acos(2 * Math.random() - 1), r = 70; a.push(r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u)); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: .35, sizeAttenuation: false, transparent: true, opacity: .55 })); stars.frustumCulled = false; S.add(stars);
    sunM = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), new THREE.MeshBasicMaterial({ color: 0xfbbf24 })); halo = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 16), new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: .2, depthWrite: false, blending: THREE.AdditiveBlending })); S.add(sunM, halo);
    epos = new THREE.Group(); tilt = new THREE.Group(); spin = new THREE.Group(); S.add(epos); epos.add(tilt); tilt.add(spin);
    mat_ = litMat({ map: earthTex(), ambient: .12 }); earth = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), mat_); spin.add(earth);
    axis = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, 1, 8), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })); tilt.add(axis);
    pin = new THREE.Group(); stick = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 })); head = new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 10), new THREE.MeshBasicMaterial({ color: 0xef4444 })); pin.add(stick, head); spin.add(pin);
    sline = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 1, 8), new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: .9 })); S.add(sline);   // from "You" towards the Sun
    ghost = [0, 1, 2, 3].map(k => { const m = new THREE.Group(), e = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), litMat({ map: earthTex(), ambient: .12 })); const ax = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 3.3, 6), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })); m.add(e, ax); m.rotation.z = EPS; const w = new THREE.Group(); w.add(m); S.add(w); w.e = e; return w; });
    gl = [0, 1, 2, 3].map(() => label('', '#cbd5e1', .75));
    const pts = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * 6.2832; pts.push(new THREE.Vector3(8 * Math.cos(a), 0, -8 * Math.sin(a))); } orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x64748b })); S.add(orbit);
    rays = [-2.2, 0, 2.2].map(z => arrow(0xfde047, .08)); A0 = Math.atan2(ll(92, 26).z, ll(92, 26).x);
    lSun = label('Sun', '#fde047', .9); lEarth = label('Earth', '#93c5fd', .85); lYou = label('You', '#fca5a5', .85); lN = label('North Pole', '#e2e8f0', .7); lSpin = label('spins west → east', '#cbd5e1', .7); lNS = label('Not to scale', '#fbbf24', .8); lOrb = label('Earth’s path (orbit)', '#94a3b8', .7);
  },
  reset() { T = 10; Dd = 81; lt = ld = -1; lastMode = 0; },
  step(dt, P) {
    const A = P.m === 1; if (lastMode !== P.m) { lastMode = P.m; view.set(A ? { d: 17, e: 1.05, a: 0, t: V(-4.6, 0, 2.4), ref: 1.35 } : { d: 24, e: 1.1, a: 0, t: V(0, 0, 3.4), ref: 1.15 }); }
    if (P.t !== lt) { lt = P.t; T = P.t; } if (P.d !== ld) { ld = P.d; Dd = P.d; }
    if (P.run) { T = (T + dt * 1.2) % 24; Dd = Dd + dt * 9; if (Dd > 366) Dd -= 365; }
    P.T = T; P.D = Dd; const lat = LAT[P.p - 1], R = A ? 2.5 : 1.15, ep = A ? 0 : EPS;
    [orbit, lOrb, lNS, ...gl, ...ghost].forEach(o => o.visible = !A); [...rays, lSpin, lYou].forEach(o => o.visible = A); lEarth.visible = true;
    const th = (Dd - 172) / 365 * 6.2832; P.th = th; epos.position.set(A ? 0 : 8 * Math.cos(th), 0, A ? 0 : -8 * Math.sin(th)); tilt.rotation.z = ep; spin.scale.setScalar(R);
    const sDir = A ? V(-1, 0, 0) : V(-epos.position.x, 0, -epos.position.z).normalize();
    sunM.position.set(A ? -10.5 : 0, 0, 0); sunM.scale.setScalar(A ? 2.9 : 1.9); halo.position.copy(sunM.position); halo.scale.setScalar(A ? 2.9 : 1.9); mat_.uniforms.sun.value.copy(sDir);
    const pl = ll(92, lat), a0 = Math.atan2(pl.z, pl.x);   // where "You" stand on the map
    if (A) { spin.rotation.y = a0 - Math.PI + (T - 12) / 24 * 6.2832; } else { const sl = sDir.clone().applyAxisAngle(V(0, 0, 1), -ep); spin.rotation.y = a0 - Math.atan2(sl.z, sl.x); }   // day mode: spin with the clock · seasons mode: show the moment of noon
    const nn = pl.clone().normalize(); stick.quaternion.setFromUnitVectors(V(0, 1, 0), nn); stick.scale.y = .32; stick.position.copy(nn).multiplyScalar(1.16); head.position.copy(nn).multiplyScalar(1.34);   // the pin stands straight out of the ground
    epos.updateMatrixWorld(true);
    const nW = nn.clone().applyQuaternion(spin.getWorldQuaternion(new THREE.Quaternion())), sinA = Math.max(-1, Math.min(1, nW.dot(sDir))), alt = Math.asin(sinA) / D; P.alt = alt;
    const top = head.getWorldPosition(V()), dirW = sDir.clone(); sline.visible = alt > -3; { const e = top.clone().addScaledVector(dirW, A ? 4.2 : 2.2), d = e.clone().sub(top), L = d.length(); sline.position.copy(top).addScaledVector(d, .5); sline.scale.set(1, L, 1); sline.quaternion.setFromUnitVectors(V(0, 1, 0), d.divideScalar(L)); }
    axis.scale.y = R * 3.2; axis.position.y = 0; P.part = alt > 3 ? (T < 12 ? 'Morning' : 'Afternoon') : alt < -3 ? 'Night' : T < 12 ? 'Sunrise' : 'Sunset'; P.dn = alt > 3 ? 'Day ☀️' : alt < -3 ? 'Night 🌙' : T < 12 ? 'Sunrise 🌅' : 'Sunset 🌇';
    if (A) { rays.forEach((r, i) => r.set(-6.6, 0, 3.3, 1, [-1.6, 0, 1.6][i])); lSun.position.set(-10.5, 0, 3.4); lEarth.position.set(0, -.2, 3.3); lEarth.set('Earth'); lYou.position.copy(top).add(V(Math.sign(top.x || 1) * 1.7, .5, 0)); lN.position.set(0, 3, -1.4); lSpin.position.set(.5, -.2, 5.4); lSpin.visible = true; lNS.visible = true; lNS.position.set(-6.5, -.2, 5.4); lNS.set('Sizes not to scale'); }
    else { lSun.position.set(0, 0, 3.1); lEarth.position.copy(epos.position).add(V(0, 0, 2.1)); lEarth.set('Earth'); lN.position.copy(epos.position).add(V(-Math.sin(EPS) * 2.2, Math.cos(EPS) * 2.2 + .6, 0)); lNS.position.set(0, 0, 10.4); lNS.set('Sizes and distances not to scale'); lOrb.position.set(0, 0, 9.2); lOrb.visible = false;
      ghost.forEach((w, k) => { const p = k === 0 ? [8, 0] : k === 1 ? [0, -8] : k === 2 ? [-8, 0] : [0, 8]; w.position.set(p[0], 0, p[1]); w.scale.setScalar(.75); w.e.material.uniforms.sun.value.set(-p[0], 0, -p[1]).normalize(); const near = Math.abs(Math.atan2(Math.sin(th - k * 1.5708), Math.cos(th - k * 1.5708))) < .35; w.visible = !near; gl[k].visible = !near;
        gl[k].position.set(p[0] * 1.08, 1.6, p[1] * 1.08 + (k === 3 ? 1 : 0)); gl[k].set(['21 Jun', '22 Sep', '21 Dec', '21 Mar'][k], '#cbd5e1'); gl[k].position.x += k === 0 ? -.3 : k === 2 ? .3 : 0; }); }
    lN.visible = true; lSun.visible = true;
    const dl = Math.asin(Math.sin(ep) * Math.cos(th)) / D; P.dec = dl; const td = Math.tan(lat * D) * Math.tan(dl * D); P.dayLen = td >= 1 ? 0 : td <= -1 ? 24 : 24 / Math.PI * Math.acos(-td); P.noon = 90 - Math.abs(lat - dl); const s = dl; P.ssn = lat === 0 ? 'Hot all year' : (lat > 0 ? s : -s) > 14 ? 'Summer' : (lat > 0 ? s : -s) < -14 ? 'Winter' : (Math.sin((Dd - 80) / 365 * 6.2832) * (lat > 0 ? 1 : -1)) > 0 ? 'Spring' : 'Autumn'; P.dist = 149.6 * (1 - .0167 * Math.cos((Dd - 3) / 365 * 6.2832));
    if (!A) lYou.visible = false;
  },
  ro: { Now: P => P.m === 1 ? P.dn : P.ssn, 'Time': P => P.m === 1 ? clock(P.T) : null, 'Sun height': P => P.m === 1 ? (P.alt > 0 ? Math.round(P.alt) + '° ' + hi(P.alt) : 'below horizon') : null,
    'Date': P => P.m === 2 ? dateName(P.D) : null, 'Day length': P => P.m === 2 ? (P.dayLen >= 23.9 ? '24 h (Sun never sets)' : P.dayLen <= .1 ? '0 h (Sun never rises)' : P.dayLen.toFixed(1) + ' h') : null, 'Sun at noon': P => P.m === 2 ? Math.round(P.noon) + '° ' + hi(P.noon) : null, 'From the Sun': P => P.m === 2 ? Math.round(P.dist) + ' million km' : null },
  status: P => P.m === 1 ? (P.alt > 3 ? ['Daytime', true] : P.alt < -3 ? ['Night', false, 'warn'] : ['Twilight', false, 'warn']) : [P.ssn, true],
  note: P => P.m === 1 ? (P.alt > 3 ? `It is <b>day</b> here: your side of Earth faces the Sun. The Sun is ${P.alt > 50 ? 'high' : P.alt > 20 ? 'halfway up' : 'low'} in the sky.` : P.alt < -3 ? 'It is <b>night</b> here: your side of Earth faces away from the Sun. Earth spins once in 24 hours.' : 'The Sun is just rising or setting: you are on the line between day and night.')
    : (P.dec > 14 ? '<b>North Pole leans towards the Sun</b>: summer in the north, long days. South has winter.' : P.dec < -14 ? '<b>South Pole leans towards the Sun</b>: summer in the south. North has winter, short days.' : 'Neither pole leans to the Sun: day and night are almost equal.') + ' The <b>tilt</b>, not the distance, makes seasons.',
  try: [{ t: 'Drag <b>Time of day</b> to midnight. Is it day or night where you live?', check: P => P.m === 1 && P.alt < -10, yes: 'Yes! Night: your side faces away from the Sun.' },
    { t: 'Find the time when the Sun is <b>highest</b>. What time is it?', check: P => P.m === 1 && P.alt > 60, yes: 'Yes! The Sun is highest at about noon.' },
    { t: 'Switch to <b>Seasons</b>. Set the date near <b>21 June</b>. Which pole leans to the Sun?', check: P => P.m === 2 && P.dec > 20, yes: 'Yes! The North Pole leans to the Sun.' },
    { t: 'Set the date near <b>21 December</b> and look at <b>Day length</b>. Is it longer or shorter than in June?', check: P => P.m === 2 && P.dec < -20 && P.p === 3, yes: 'Yes! Days are shorter in the north in December.' },
    { t: 'Pick <b>Equator</b> and move the date. Does the day length change a lot?', check: P => P.m === 2 && P.p === 2, yes: 'No! At the equator days are always about 12 hours.' }],
  key: ['<b>Day and night:</b> Earth spins once on its axis in about 24 hours. The side facing the Sun has day.', 'Earth spins from west to east, so the Sun seems to rise in the east and set in the west.', '<b>Seasons:</b> Earth goes round the Sun once in a year (365¼ days). Its axis is tilted about 23½° and always points the same way.', 'When the North Pole leans towards the Sun it is summer in the north and winter in the south. Six months later it is the other way round.', 'The tilt, not the distance from the Sun, causes seasons. Earth is actually closest to the Sun in January.', 'Sizes and distances in the picture are not to scale.'],
  quiz: [{ q: 'What causes day and night?', o: ['Earth spinning on its axis', 'Earth going round the Sun', 'The Moon moving'], a: 0, why: 'Earth spins once in about 24 hours.' }, { q: 'What causes the seasons?', o: ['Earth being nearer to the Sun', 'The tilt of Earth’s axis', 'The Sun getting hotter'], a: 1, why: 'The tilt changes how high the Sun is and how long the day is.' },
    { q: 'It is summer in India (north). What season is it in Australia (south)?', o: ['Summer', 'Winter', 'No season'], a: 1, why: 'The two halves of Earth have opposite seasons.' }]
};
