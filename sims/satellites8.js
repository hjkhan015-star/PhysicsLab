// Class 8 · Ch 17 Stars and the Solar System — artificial satellites (ISS, Earth-watching, GPS, geostationary) vs the Moon, and the ISS ground track on a flat map.
// A MODEL, NOT LIVE TRACKING: circular orbits worked out from the height (period = 2π√(r³/GM)); the ISS position is an invented starting point, so it is not where the real ISS is now. Works offline.
// NOT TO SCALE: satellites are drawn far too big; the Moon is drawn much closer than it really is (real: 60 Earth radii away).
import { S, V, D, THREE, label, beam, view } from '../scene.js';
import { earthTex, litMat, mapCanvas, ll } from '../earth.js';
const RE = 6371, GM = 398600, WE = 2 * Math.PI / 1436.07, X = V(1, 0, 0), Y = V(0, 1, 0);                   // Earth radius km · km³/s² · Earth turns this many radians per minute
const per = alt => 2 * Math.PI * Math.sqrt(Math.pow(RE + alt, 3) / GM) / 60;                             // orbit time in minutes
const ORB = [{ n: 'ISS', alt: 400, inc: 51.6, node: .6, c: 0xfb923c, t0: .5, lab: 'ISS (space station)' }, { n: 'EO', alt: 800, inc: 98, node: 2.3, c: 0x22d3ee, t0: 2, lab: 'Earth-watching satellite' }, { n: 'GPS', alt: 20200, inc: 55, node: 1.3, c: 0x4ade80, t0: 4, lab: 'GPS satellite' }, { n: 'GEO', alt: 35786, inc: 0, node: 0, c: 0xe879f9, t0: 0, lab: 'Geostationary satellite' }];
const MOONR = 8.6, MOONT = 27.32 * 1440, SPD = [0, 6, 20, 60], SPN = ['Stop', 'Slow', 'Medium', 'Fast'], ISSV = 7.66;
const fmtT = m => m < 120 ? Math.round(m) + ' minutes' : m < 2880 ? (m / 60).toFixed(m % 60 < 3 || m % 60 > 57 ? 0 : 1) + ' hours' : Math.round(m / 1440) + ' days';
const ns = (x, p, n) => (x >= 0 ? x : -x).toFixed(0) + '° ' + (x >= 0 ? p : n);
let earth, emat, sats, rings, moon, mmat, mk, tie, lEarth, lSat, lMoon, lMk, lNS, lMap, mapM, mapT, trk, iss, lIss, lAs, as, lLim, lines, lastMode, lastHi, lastLay, T, lt, spin;
let ISS_LON0 = 40, ISS_TH0 = .8; const M4 = new THREE.Matrix4(), Q0 = new THREE.Quaternion(), NR = 96, NT = 110;
const vec = (r, inc, node, th) => V(Math.cos(th), 0, -Math.sin(th)).applyAxisAngle(X, inc * D).applyAxisAngle(Y, node).multiplyScalar(r);
const trackPt = (tau) => { const th = ISS_TH0 + 2 * Math.PI * tau / per(400), inc = 51.6 * D, lat = Math.asin(Math.sin(inc) * Math.sin(th)) / D; let lon = Math.atan2(Math.cos(inc) * Math.sin(th), Math.cos(th)) / D + ISS_LON0 - tau * 360 / 1436.07; lon = ((lon + 540) % 360) - 180; return [lat, lon]; };
const mp = (lat, lon) => V(lon / 180 * 7, lat / 90 * 3.5, 0);
export default {
  title: 'Satellites', cam: { d: 10, e: .55, a: 0, t: V(0, 0, 0), ref: 1.1 },
  head: 'ISS goes round in', tabs: [['skyobjects8', 'Sky'], ['meteor8', 'Meteor'], ['scale8', 'Scale'], ['satellites8', 'Orbits']],
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Orbits', 'ISS map'] },
    { k: 's', l: '⏱ Time speed', min: 1, max: 4, step: 1, v: 2, names: SPN, axis: true },
    { k: 't', l: '🕐 Time', min: 0, max: 300, step: 5, v: 20, u: 'min', axis: true, w: P => P.m === 2 }],
  toggles: [{ k: 'hi', l: 'High orbits', v: false, w: P => P.m === 1 }, { k: 'trk', l: 'Ground track', v: true, w: P => P.m === 2 }],
  setup() {
    emat = litMat({ map: earthTex(), ambient: .15 }); earth = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), emat); S.add(earth);
    sats = ORB.map(o => { const g = new THREE.Group(), b = new THREE.MeshBasicMaterial({ color: o.c }); g.add(new THREE.Mesh(new THREE.BoxGeometry(1, .6, .6), b)); [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.BoxGeometry(1.1, .05, .5), new THREE.MeshBasicMaterial({ color: 0x1d4ed8 })); p.position.set(0, 0, s * .8); g.add(p); }); S.add(g); return g; });
    rings = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 5, 4), new THREE.MeshBasicMaterial({ color: 0xcbd5e1 }), 5 * NR); rings.frustumCulled = false; S.add(rings);
    mmat = litMat({ color: 0xc9ccd3, ambient: .1 }); moon = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), mmat); S.add(moon);
    mk = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 })); S.add(mk); tie = beam(0xe879f9, .02);
    lEarth = label('Earth', '#93c5fd', .85); lSat = ORB.map(o => label(o.lab, '#' + o.c.toString(16).padStart(6, '0'), .75)); lMoon = label('Moon: a natural satellite', '#e2e8f0', .8); lMk = label('Stays above this spot', '#f5d0fe', .7); lNS = label('Not to scale', '#fbbf24', .8);
    // map
    const c = mapCanvas(1024, 512, '#1e3a8a', '#2f855a'), x = c.getContext('2d'); x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 1.5; for (let lo = -150; lo <= 150; lo += 30) { x.beginPath(); x.moveTo((lo + 180) / 360 * 1024, 0); x.lineTo((lo + 180) / 360 * 1024, 512); x.stroke(); } for (let la = -60; la <= 60; la += 30) { x.beginPath(); x.moveTo(0, (90 - la) / 180 * 512); x.lineTo(1024, (90 - la) / 180 * 512); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 256); x.lineTo(1024, 256); x.stroke(); x.setLineDash([10, 8]); x.strokeStyle = 'rgba(253,224,71,.75)'; [51.6, -51.6].forEach(la => { x.beginPath(); x.moveTo(0, (90 - la) / 180 * 512); x.lineTo(1024, (90 - la) / 180 * 512); x.stroke(); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; mapM = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), new THREE.MeshBasicMaterial({ map: t })); S.add(mapM);
    trk = new THREE.InstancedMesh(new THREE.SphereGeometry(.06, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffffff }), NT); trk.frustumCulled = false; trk.instanceColor = null; S.add(trk);
    iss = new THREE.Group(); iss.add(new THREE.Mesh(new THREE.BoxGeometry(.36, .2, .2), new THREE.MeshBasicMaterial({ color: 0xfb923c })), Object.assign(new THREE.Mesh(new THREE.BoxGeometry(.7, .04, .2), new THREE.MeshBasicMaterial({ color: 0x60a5fa })))); S.add(iss);
    as = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 })); as.position.copy(mp(26, 92)); S.add(as);
    iss.traverse(o => { if (o.material) { o.material.depthTest = false; o.renderOrder = 10; } }); trk.material.depthTest = false; trk.renderOrder = 9; as.material.depthTest = false; as.renderOrder = 9;   // drawn on top of the map, never behind it
    lIss = label('ISS', '#fb923c', .85); lAs = label('Assam', '#fca5a5', .75); lLim = label('ISS stays between these lines (51.6°)', '#fde047', .65); lMap = label('Model, not live tracking (works offline)', '#fbbf24', .72);
  },
  reset() { T = 20; lt = -1; lastMode = 0; lastHi = -1; lastLay = ''; spin = 0; },
  step(dt, P) {
    const m = P.m, O = m === 1, hi = !!P.hi, lay = document.documentElement.dataset.mode;
    if (lastMode !== m || lastHi !== hi || lastLay !== lay) { lastMode = m; lastHi = hi; lastLay = lay;
      view.set(!O ? { d: 17, e: 0, a: 0, lock: true, t: V(0, lay === 'portrait' ? .4 : -.5, 0), ref: 1.08 } : hi ? { d: 22, e: .55, a: 0, t: V(0, 0, 0), ref: lay === 'portrait' ? 1 : .8 } : { d: 10, e: .55, a: 0, t: V(0, 0, 0), ref: 1.5 });
      const R = hi ? 1 : 3, rr = ORB.map(o => R * (RE + o.alt) / RE); rings.visible = O; let n = 0; for (let k = 0; k < 4; k++) { const on = O && (hi ? k !== 1 : k < 2); for (let i = 0; i < NR; i++) { const a = i / NR * 6.2832; M4.compose(on ? vec(rr[k], ORB[k].inc, ORB[k].node, a) : V(), Q0, V(1, 1, 1).multiplyScalar(on ? .012 * R + .008 : .0001)); rings.setMatrixAt(n++, M4); } }
      for (let i = 0; i < NR; i++) { const a = i / NR * 6.2832, on = O && hi; M4.compose(on ? V(Math.cos(a) * MOONR, 0, 0).add(V(0, 0, -Math.sin(a) * MOONR)).applyAxisAngle(X, 5 * D) : V(), Q0, V(1, 1, 1).multiplyScalar(on ? .03 : .0001)); rings.setMatrixAt(n++, M4); } rings.instanceMatrix.needsUpdate = true; }
    if (P.t !== lt) { lt = P.t; T = P.t; } const mult = SPD[P.s - 1] * (O && hi ? 10 : 1); T += dt * mult; P.T = T; spin = T * WE;
    [earth, mk, tie, moon, lEarth, lMoon, lMk, lNS, ...lSat].forEach(o => o.visible = O); sats.forEach(g => g.visible = O); [mapM, trk, iss, as, lIss, lAs, lLim, lMap].forEach(o => o.visible = !O);
    const issOrb = per(400); P.iss = issOrb;
    if (O) {
      const R = hi ? 1 : 3; earth.scale.setScalar(R); earth.rotation.y = spin; emat.uniforms.sun.value.set(-1, 0, 0);
      ORB.forEach((o, k) => { const on = hi ? k !== 1 : k < 2, g = sats[k]; g.visible = on; lSat[k].visible = on; if (!on) return; let th;
        if (k === 3) { const L = ll(83, 0).applyAxisAngle(Y, spin); th = Math.atan2(-L.z, L.x); } else th = o.t0 + 2 * Math.PI * T / per(o.alt);
        const r = R * (RE + o.alt) / RE, p = vec(r, o.inc, o.node, th); g.position.copy(p); g.scale.setScalar(hi ? .2 : .2); g.lookAt(V()); lSat[k].position.copy(p).addScaledVector(p.clone().normalize(), hi ? 1 : 1.1).add(V(0, .25, 0));
        if (k === 3) { const d = p.clone().normalize(); mk.visible = tie.visible = lMk.visible = true; mk.position.copy(d.clone().multiplyScalar(R * 1.01)); mk.scale.setScalar(.07 * R + .03); tie.set(p, mk.position); lMk.position.copy(p).add(V(0, -.6, .2)); } });
      if (!hi) { mk.visible = tie.visible = lMk.visible = false; } lSat[2].visible = hi; lSat[3].visible = hi;
      moon.visible = lMoon.visible = hi; if (hi) { const a = 2 * Math.PI * T / MOONT, mp3 = V(Math.cos(a) * MOONR, 0, -Math.sin(a) * MOONR).applyAxisAngle(X, 5 * D); moon.position.copy(mp3); moon.scale.setScalar(.27); mmat.uniforms.sun.value.set(-1, 0, 0); lMoon.position.copy(mp3).add(V(0, .9, 0)); }
      lEarth.position.set(0, -R - .6, .2); lNS.position.set(0, hi ? -3.6 : -R - 1.7, hi ? 3 : 2);
    } else {
      const [la, lo] = trackPt(T), p = mp(la, lo); iss.position.copy(p); iss.position.z = .2; lIss.position.copy(p).add(V(0, .55, 0)); P.lat = la; P.lon = lo; lAs.position.copy(as.position).add(V(.3, -.5, 0));
      for (let i = 0; i < NT; i++) { const tau = T - 90 + i * 2.6, [a, b] = trackPt(tau); M4.compose(P.trk ? mp(a, b) : V(0, 0, -5), Q0, V(1, 1, 1).multiplyScalar(P.trk ? (tau < T ? .7 : 1) : .0001)); trk.setMatrixAt(i, M4); } trk.instanceMatrix.needsUpdate = true; trk.material.color.setHex(0xfde047);
      lLim.position.set(0, 3.5 * 51.6 / 90 + .35, 0); lMap.position.set(0, -4.3, 0); lLim.position.y = 3.5 * 51.6 / 90 + .38;
    }
  },
  ro: { 'ISS goes round in': P => fmtT(P.iss), 'Main satellite': P => P.m === 1 ? (P.hi ? 'Geostationary' : 'ISS') : null, 'ISS height': P => '400 km', 'GPS (20,200 km)': P => P.m === 1 && P.hi ? fmtT(per(20200)) : null, 'Geostationary': P => P.m === 1 && P.hi ? '35,786 km · 24 hours' : null, 'Moon (natural)': P => P.m === 1 && P.hi ? '384,400 km · 27 days' : null,
    'ISS is over': P => P.m === 2 ? ns(P.lat, 'N', 'S') + ', ' + ns(P.lon, 'E', 'W') : null, 'ISS speed': P => P.m === 2 ? ISSV + ' km/s' : null, 'Time passed': P => P.m === 2 ? fmtT(P.T) : null },
  status: P => P.s === 1 ? ['Time stopped', false, 'warn'] : ['Model running', true],
  note: P => P.m === 1 ? (P.hi ? 'Higher satellites go slower. A <b>geostationary</b> one takes 24 h, so it stays above one spot. The Moon is a <b>natural</b> satellite.' : 'The <b>ISS</b> is only about 400 km up and goes round Earth in about 90 minutes. The lower the orbit, the faster.')
    : 'A <b>model</b>, not live tracking. The ISS goes round in 90 minutes while Earth turns, so each loop is shifted west.',
  try: [{ t: 'Watch the <b>ISS</b>. About how long does it take to go round Earth once?', check: P => P.m === 1 && !P.hi && P.s >= 2, yes: 'About 90 minutes: 16 times a day!' },
    { t: 'Switch on <b>High orbits</b>. Which satellite stays above one spot?', check: P => P.m === 1 && P.hi, yes: 'The geostationary one: it goes round in 24 hours, like Earth turns.' },
    { t: 'Switch to <b>ISS map</b> and turn on <b>Ground track</b>. Does the ISS ever fly over the poles?', check: P => P.m === 2 && P.trk, yes: 'No! It stays between 51.6° north and south.' },
    { t: 'Set <b>Time speed</b> to <b>Fast</b>. Is each loop in the same place on the map?', check: P => P.m === 2 && P.s === 4, yes: 'No. Earth turns underneath, so every loop is shifted.' }],
  key: ['A <b>satellite</b> is an object that goes round a bigger one. The <b>Moon</b> is a <b>natural</b> satellite; satellites that people build and launch are <b>artificial</b>.', 'The <b>ISS</b> (International Space Station) is about 400 km above Earth and goes round once in about 90 minutes.', 'The higher the orbit, the slower the satellite and the longer one orbit takes. GPS satellites take about 12 hours.', 'A <b>geostationary</b> satellite is about 36,000 km up and takes 24 hours, the same time Earth takes to spin, so it stays above one spot.',
    'Uses: <b>communication</b> (TV, phone, internet), <b>weather</b> forecasting, <b>GPS</b> navigation, and <b>remote sensing</b> (pictures of forests, floods and farms).', 'This is a model that works offline. It is not the real ISS position and the drawing is not to scale.'],
  quiz: [{ q: 'The Moon is a…', o: ['Artificial satellite', 'Natural satellite', 'Star'], a: 1, why: 'It orbits Earth and was not made by people.' }, { q: 'A geostationary satellite…', o: ['Stays above one spot', 'Goes round in 90 minutes', 'Never moves'], a: 0, why: 'It takes 24 hours, the same time Earth takes to spin.' },
    { q: 'Which satellite is used for weather forecasts?', o: ['Weather satellite', 'The Moon', 'A comet'], a: 0, why: 'It watches clouds and storms from space.' }]
};
