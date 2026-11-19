// Class 8 · Ch 17 Stars and the Solar System — comets (tail always away from the Sun), meteoroid → meteor → meteorite, and the night sky turning round the Pole Star.
// NOT TO SCALE: comet orbit, Sun, tail, heights of the air and the rock are drawn to fit; numbers shown are illustrative. Star positions are real (RA / Dec), drawn as a chart looking north from about 26°N.
import { S, V, D, THREE, label, beam, view } from '../scene.js';
import { frus, glowSprite } from '../earth.js';
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), clock = h => { let m = Math.round(((h % 24) + 24) % 24 * 60), hh = Math.floor(m / 60), mm = m % 60; return (hh % 12 || 12) + ':' + String(mm).padStart(2, '0') + (hh < 12 ? ' am' : ' pm'); };
const TN = Array.from({ length: 25 }, (_, i) => clock(18 + i * .5)), KM = 43, AA = 7, EE = .72, BB = AA * Math.sqrt(1 - EE * EE), ER = 3.5, GM = 1.327e20;      // clock names · million km per drawn unit · comet orbit a, e, b · Earth's orbit radius (150 ÷ 43)
const kep = M => { let E = M; for (let i = 0; i < 6; i++) E -= (E - EE * Math.sin(E) - M) / (1 - EE * Math.cos(E)); return E; };
const TW = ['No tail', 'Short', 'Long', 'Very long'];
// stars: [name, RA hours, Dec °, brightness 1–3]
const UMA = [['Dubhe', 11.062, 61.75, 3], ['Merak', 11.031, 56.38, 3], ['Phecda', 11.897, 53.69, 2], ['Megrez', 12.257, 57.03, 1.5], ['Alioth', 12.9, 55.96, 3], ['Mizar', 13.399, 54.93, 2.5], ['Alkaid', 13.792, 49.31, 2.5]], UL = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]];
const CAS = [['Caph', .153, 59.15, 2.5], ['Schedar', .675, 56.54, 2.5], ['Navi', .945, 60.72, 2.5], ['Ruchbah', 1.43, 60.24, 2], ['Segin', 1.907, 63.67, 1.5]], CL = [[0, 1], [1, 2], [2, 3], [3, 4]], POL = ['Polaris', 2.53, 89.26, 3];
const BG = Array.from({ length: 70 }, (_, i) => [(Math.abs(Math.sin(i * 12.9898) * 43758.5) % 1) * 24, 32 + (Math.abs(Math.sin(i * 78.233) * 12345.6) % 1) * 58, .5]);
const ALL = [...UMA, ...CAS, POL, ...BG.map((b, i) => ['', ...b])], CR = 7.2, PDMAX = 62;                    // chart radius (units) for a pole distance of 62°
const NAMES = ['Meteoroid', 'Meteor', 'Meteorite', 'Burnt up'];
const GR = 40, rnd = i => Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;           // Earth's curve (drawn radius) · pseudo-random 0–1
const landTex = () => { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const x = c.getContext('2d'); x.fillStyle = '#1d5fa6'; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 26; i++) { const cx = rnd(i) * 1024, cy = rnd(i + 50) * 512, r = 40 + rnd(i + 99) * 110; for (let k = 0; k < 7; k++) { const sd = k < 2, rr = r * (.35 + rnd(i * 3 + k) * .5) * (sd ? 1.15 : 1); x.fillStyle = sd ? '#d9c98a' : k < 5 ? '#3f8f4f' : '#6b7f3a'; x.beginPath(); x.ellipse(cx + (rnd(i * 7 + k) - .5) * r * 1.4, cy + (rnd(i * 9 + k + 3) - .5) * r * .9, rr, rr * .6, rnd(k + i) * 3, 0, 7); x.fill(); } }
  for (let i = 0; i < 46; i++) { x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(rnd(i + 200) * 1024, rnd(i + 300) * 512, 30 + rnd(i + 400) * 60, 8 + rnd(i + 500) * 14, 0, 0, 7); x.fill(); }   // clouds
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const skyTex = () => { const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(120,190,255,0)'); g.addColorStop(.45, 'rgba(120,190,255,.3)'); g.addColorStop(.7, 'rgba(140,205,255,.7)'); g.addColorStop(1, 'rgba(190,230,255,.95)'); x.fillStyle = g; x.fillRect(0, 0, 4, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const NB = 18, AH = 3.5, KMU = 100 / AH;                    // trail length · air thickness drawn · km per unit (illustrative)
let disc, lt, sun, glow, earthR, orbD, cDots, nuc, coma, tail1, tail2, ray, lSun, lCom, lTail, lEO, lCO, lNS, lastMode, lastLay, T, cM, lc;
let spc, aline, ground, air, rock, rockG, trail, trH, tt, rs, phase, hold, size0, lm1, lm2, lm3, lAir, lNS2, hist, hacc, landed, stars, lines, lbs, rot, STAR_N = ALL.length;
const M4 = new THREE.Matrix4(), Q0 = new THREE.Quaternion(), COL = new THREE.Color();
export default {
  title: 'Comets, Meteors and Stars', cam: { d: 19, e: 1.25, a: 1.5708, t: V(-5, 0, 0), ref: .85 },
  head: 'Now', tabs: [['skyobjects8', 'Sky'], ['scale8', 'Scale'], ['satellites8', 'Orbits']],
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 3, step: 1, v: 1, names: ['Comet', 'Meteor', 'Stars'] },
    { k: 'c', l: '☄ Comet place', min: 0, max: 350, step: 10, v: 120, u: '°', axis: true, w: P => P.m === 1 },
    { k: 'z', l: '🪨 Rock size', min: 1, max: 3, step: 1, v: 2, names: ['Pebble', 'Stone', 'Boulder'], axis: true, w: P => P.m === 2 },
    { k: 'v', l: '💨 Speed', min: 10, max: 70, step: 10, v: 30, u: 'km/s', axis: true, w: P => P.m === 2 },
    { k: 't', l: '🕐 Time of night', min: 0, max: 12, step: .5, v: 3, names: TN, axis: true, w: P => P.m === 3 }],
  toggles: [{ k: 'run', l: 'Run time', v: true, w: P => P.m !== 2 }, { k: 'ln', l: 'Show lines', v: true, w: P => P.m === 3 }],
  setup() {
    sun = new THREE.Mesh(new THREE.SphereGeometry(.7, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfbbf24 })); glow = glowSprite(); S.add(sun);
    orbD = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 5, 4), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 }), 110); orbD.frustumCulled = false; S.add(orbD); for (let i = 0; i < 110; i++) { const E = i / 110 * 6.2832; M4.setPosition(AA * (Math.cos(E) - EE), 0, BB * Math.sin(E)); orbD.setMatrixAt(i, M4); }
    earthR = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 5, 4), new THREE.MeshBasicMaterial({ color: 0x60a5fa }), 70); earthR.frustumCulled = false; S.add(earthR); for (let i = 0; i < 70; i++) { const a = i / 70 * 6.2832; M4.setPosition(ER * Math.cos(a), 0, ER * Math.sin(a)); earthR.setMatrixAt(i, M4); }
    nuc = new THREE.Mesh(new THREE.SphereGeometry(.2, 14, 10), new THREE.MeshBasicMaterial({ color: 0xe5e7eb })); S.add(nuc); coma = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending })); S.add(coma);
    tail1 = frus(0x7dd3fc, .4); tail2 = frus(0xfde68a, .32); ray = beam(0xfde047, .018);
    lSun = label('Sun', '#fde047', .85); lCom = label('Comet', '#e2e8f0', .85); lTail = label('Tail: always away from the Sun', '#7dd3fc', .75); lEO = label('Earth’s path', '#60a5fa', .65); lCO = label('Comet’s path', '#cbd5e1', .65); lNS = label('Not to scale', '#fbbf24', .8);
    // meteor
    ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 26, 60, 26), new THREE.MeshBasicMaterial({ map: landTex() })); ground.rotation.x = -Math.PI / 2;   // a curved patch of Earth: land, sea, clouds
    { const p = ground.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const gx = p.getX(i), gz = p.getY(i); p.setZ(i, -(gx * gx + gz * gz) / (2 * GR)); } p.needsUpdate = true; } S.add(ground);
    air = new THREE.Mesh(new THREE.PlaneGeometry(90, AH + 3), new THREE.MeshBasicMaterial({ map: skyTex(), transparent: true, depthWrite: false })); air.position.set(0, (AH - 3) / 2, -14); S.add(air);   // blue glow of the air, thinning to nothing at the top
    { const a = []; for (let i = 0; i < 170; i++) a.push((rnd(i + 600) - .5) * 80, AH + .4 + rnd(i + 700) * 12, -16); spc = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(a, 3)), new THREE.PointsMaterial({ color: 0xffffff, size: .14, transparent: true, opacity: .85 })); S.add(spc); spc.frustumCulled = false; }   // stars in space
    aline = beam(0x7dd3fc, .02); aline.set(V(-30, AH, -14), V(30, AH, -14));
    rock = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0x9a8f86 })); S.add(rock); rockG = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: .6, depthWrite: false, blending: THREE.AdditiveBlending })); S.add(rockG);
    trail = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), NB); trail.frustumCulled = false; trail.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(NB * 3), 3); S.add(trail);
    lm1 = label('Meteoroid: a rock in space', '#cbd5e1', .8); lm2 = label('Meteor: the glow (shooting star)', '#cbd5e1', .8); lm3 = label('Meteorite: a piece that lands', '#cbd5e1', .8); lAir = label('Air (atmosphere) · space above', '#7dd3fc', .7); lNS2 = label('Heights and sizes not to scale', '#fbbf24', .75);
    // stars
    stars = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), STAR_N); stars.frustumCulled = false; S.add(stars);
    disc = new THREE.Mesh(new THREE.CircleGeometry(CR + .2, 72), new THREE.MeshBasicMaterial({ color: 0x0b1433, transparent: true, opacity: .75 })); disc.position.set(0, -1.6, -.2); S.add(disc); lines = Array.from({ length: 14 }, () => beam(0x93c5fd, .028)); lbs = { dip: label('Saptarishi (Big Dipper)', '#fde047', .8), pol: label('Pole Star', '#fca5a5', .85), cas: label('Cassiopeia', '#86efac', .8), ptr: label('Pointer stars', '#fde68a', .7), fac: label('You face north', '#cbd5e1', .7), nst: label('Stars not to scale', '#fbbf24', .7) };
  },
  reset() { T = 0; cM = 120 * D; lc = -1; lt = -1; lastMode = 0; lastLay = ''; phase = 0; hold = 0; hist = []; hacc = 0; tt = 0; landed = false; rot = 0; },
  step(dt, P) {
    const m = P.m, lay = document.documentElement.dataset.mode;
    if (lastMode !== m || lastLay !== lay) { lastMode = m; lastLay = lay; if (m === 2) { phase = 0; hold = 0; tt = 0; }
      view.set(m === 1 ? { d: 19, e: 1.25, a: lay === 'portrait' ? 1.5708 : 0, t: V(lay === 'portrait' ? -3.4 : -5, 0, 0), ref: lay === 'portrait' ? 1.3 : 1.15 } : m === 2 ? { d: 22, e: .08, a: 0, t: V(0, 6.6, 0), ref: .8 } : (lay === 'portrait' ? { d: 17, e: .1, a: 0, t: V(0, -.4, 0), ref: 1.17 } : { d: 24, e: .1, a: 0, t: V(0, -3.2, 0), ref: 1 })); }
    const A = m === 1, B = m === 2, C = m === 3;
    [sun, glow, orbD, earthR, nuc, coma, tail1, tail2, ray, lSun, lCom, lTail, lEO, lCO, lNS].forEach(o => o.visible = A); [ground, air, spc, aline, rock, rockG, trail, lm1, lm2, lm3, lAir, lNS2].forEach(o => o.visible = B); [disc, stars, ...lines, ...Object.values(lbs)].forEach(o => o.visible = C);
    if (A) {
      if (P.c !== lc) { lc = P.c; cM = P.c * D; } if (P.run) cM = (cM + dt * 6.2832 / 26) % 6.2832; const E = kep(cM), x = AA * (Math.cos(E) - EE), z = BB * Math.sin(E), pos = V(x, 0, z), d = pos.length(), dn = V(-AA * Math.sin(E), 0, BB * Math.cos(E)).normalize(), away = pos.clone().normalize();
      const dpe = AA * (1 - EE), f = cl((9 - d) / (9 - dpe)), L = 6.2 * Math.pow(f, 1.1), vel = Math.sqrt(GM * (2 / (d * KM * 1e9) - 1 / (AA * KM * 1e9))) / 1000; P.d = d * KM; P.v = vel; P.L = L; P.tw = L < .3 ? 0 : L < 1.8 ? 1 : L < 3.8 ? 2 : 3;
      P.away = (-AA * Math.sin(E) * x + BB * Math.cos(E) * z) > 0;
      sun.position.set(0, 0, 0); glow.position.copy(sun.position); glow.scale.setScalar(5); nuc.position.copy(pos); coma.position.copy(pos); coma.scale.setScalar(.25 + .6 * f); coma.visible = f > .02;
      tail1.visible = tail2.visible = L > .25; if (L > .25) { tail1.set(pos, .1, pos.clone().addScaledVector(away, L), .06 + .2 * L); const dd = away.clone().addScaledVector(dn, -.32).normalize(); tail2.set(pos, .12, pos.clone().addScaledVector(dd, L * .8), .1 + .32 * L); }
      ray.set(V(0, 0, 0), pos.clone().addScaledVector(away, Math.max(L, .6) + .4));
      lSun.position.set(0, 0, 1.4); lCom.position.copy(pos).add(V(0, 0, .9)); lTail.position.copy(pos).addScaledVector(away, L + .8).add(V(0, 0, 0)); lTail.visible = L > 1.6; lEO.position.set(ER * .72, 0, -ER * .72 - .4); lCO.position.set(-AA - 1.4 - EE * AA * .6, 0, -BB * .55); lNS.position.set(-10.5, 0, 5.4);
    } else if (B) {
      const size = P.z, v = P.v, survive = size === 3 || (size === 2 && v <= 50), A0 = V(-8, 12.5, 0), G0 = V(5.5, .18 - 5.5 * 5.5 / (2 * GR), 0);
      const burn = survive ? (size === 3 ? .35 : .62) : 1.05, remAt = t => { const pp = V().lerpVectors(A0, G0, t), pr = cl((AH - pp.y) / (AH - .18)); return Math.max(0, 1 - burn * Math.pow(pr, .9)); };
      if (phase === 0) { tt += dt * (.12 + v / 70 * .1); if (tt >= 1) { tt = 1; phase = survive ? 1 : 2; hold = 0; } else if (!survive && remAt(tt) <= .02) { phase = 2; hold = 0; } } else { hold += dt; if (hold > (phase === 1 ? 3.2 : 2.2)) { phase = 0; tt = 0; hold = 0; hist = []; } }
      const pos = phase === 2 ? hist[0] || A0.clone().lerp(G0, tt) : A0.clone().lerp(G0, tt), alt = Math.max(0, pos.y - .18) * KMU, inAir = pos.y < AH, rem = phase === 0 ? remAt(tt) : phase === 1 ? 1 - burn : 0;
      const rs0 = [.26, .4, .6][size - 1] * rem; rock.visible = rs0 > .02; rock.position.copy(phase === 1 ? G0 : pos).add(V(0, phase === 1 ? rs0 * .3 : 0, 0)); rock.scale.setScalar(Math.max(.001, rs0)); rock.rotation.set(tt * 6, tt * 4, 0);
      const target = phase === 0 && inAir && rem > .02 ? cl(.25 + v / 70 * .7) : 0; rs = (rs || 0) + (target - (rs || 0)) * Math.min(1, dt * 3); rockG.visible = rs > .02; rockG.position.copy(pos); rockG.scale.setScalar(.18 + rs * (.5 + size * .2)); rockG.material.opacity = .15 + .45 * rs;
      hacc += dt; if (hacc > .05) { hacc = 0; if (phase === 0) { hist.unshift(pos.clone()); if (hist.length > NB) hist.pop(); } else if (hist.length) hist.pop(); }
      for (let i = 0; i < NB; i++) { const h = hist[i], k = 1 - i / NB, on = h ? cl(rs * 1.3) * k : 0; trail.setMatrixAt(i, M4.compose(h || pos, Q0, V(1, 1, 1).multiplyScalar(h ? Math.max(.001, .22 * k * (.6 + size * .25)) : .0001))); COL.setRGB(on, .6 * on, .25 * on * on); trail.setColorAt(i, COL); } trail.instanceMatrix.needsUpdate = true; trail.instanceColor.needsUpdate = true;
      P.alt = alt; P.nm = phase === 0 ? (inAir && rs > .05 ? 1 : 0) : phase === 1 ? 2 : 3; P.sv = phase === 0 ? (alt > 40 ? v : Math.max(.3, v * alt / 40)) : 0; P.surv = survive; P.rem = rem; P.air = inAir;
      lm1.position.set(-2.6, 13.6, 0); lm2.position.set(-2.8, 6.4, 0); lm3.position.set(3.6, -1.7, 0); lAir.position.set(6.3, AH + .6, 0); lNS2.position.set(-3.5, -4.2, 0);
      lm1.set('Meteoroid: a rock in space', P.nm === 0 ? '#fde047' : '#94a3b8'); lm2.set('Meteor: the glow (shooting star)', P.nm === 1 ? '#fde047' : '#94a3b8'); lm3.set('Meteorite: a piece that lands', P.nm === 2 ? '#fde047' : '#94a3b8');
    } else {
      if (P.t !== lt) { lt = P.t; T = P.t; } if (P.run) { T += dt * .35; if (T > 12) T -= 12; } const LST = 18 + T, k = CR / PDMAX; P.T = T; P.turn = Math.round(T * 15 * 1.0027); const pts = [];
      for (let i = 0; i < STAR_N; i++) { const s = ALL[i], H = (21.3 + T * 1.0027 - s[1]) * 15 * D, pd = (90 - s[2]), r = pd * k, x = -r * Math.sin(H), y = r * Math.cos(H) - 0, pz = 0; pts.push(V(x, y - 1.6 + 0, 0)); const sz = i < 13 ? .12 + s[3] * .05 : .05; M4.compose(pts[i], Q0, V(sz, sz, sz)); stars.setMatrixAt(i, M4); } stars.instanceMatrix.needsUpdate = true;
      const U = i => pts[i], Cc = i => pts[7 + i], pol = pts[12]; let li = 0; const show = P.ln; lines.forEach(l => l.visible = false);
      if (show) { UL.forEach(([a, b]) => { lines[li].visible = true; lines[li++].set(U(a), U(b)); }); CL.forEach(([a, b]) => { lines[li].visible = true; lines[li++].set(Cc(a), Cc(b)); }); lines[li].visible = true; lines[li++].set(U(1), pol); }
      const cen = [0, 1, 2, 3, 4, 5, 6].reduce((a, i) => a.add(U(i)), V()).multiplyScalar(1 / 7), cc = [0, 1, 2, 3, 4].reduce((a, i) => a.add(Cc(i)), V()).multiplyScalar(1 / 5);
      lbs.dip.position.copy(cen).add(V(0, -1.9, 0)); lbs.pol.position.copy(pol).add(V(1.6, .9, 0)); lbs.cas.position.copy(cc).add(V(0, 1.3, 0)); lbs.ptr.position.copy(U(0).clone().lerp(U(1), .5)).add(V(-1.7, .3, 0)); lbs.ptr.visible = show; lbs.fac.position.set(0, -CR - .8, 0); lbs.nst.position.set(0, CR + 1.2, 0);
      const Hd = ((21.3 + T * 1.0027 - 12.2) % 24 + 24) % 24; P.dipH = Hd < 3 || Hd > 21 ? 'high' : Hd > 9 && Hd < 15 ? 'low' : Hd <= 9 ? 'going down' : 'coming up';
    }
    if (!C) { /* nothing */ }
  },
  ro: { Now: P => P.m === 1 ? TW[P.tw] : P.m === 2 ? NAMES[P.nm] : 'Sky turned ' + P.turn + '°', 'From the Sun': P => P.m === 1 ? Math.round(P.d) + ' million km' : null, 'Speed': P => P.m === 1 ? Math.round(P.v) + ' km/s' : P.m === 2 ? (P.sv >= 1 ? Math.round(P.sv) + ' km/s' : P.sv > 0 ? '< 1 km/s' : '0 km/s') : null,
    'One orbit': P => P.m === 1 ? '2.9 Earth years' : null, 'Height': P => P.m === 2 ? Math.round(P.alt) + ' km' : null, 'Rock left': P => P.m === 2 ? Math.round(P.rem * 100) + ' %' : null,
    'Time': P => P.m === 3 ? clock(18 + P.T) : null, 'Saptarishi is': P => P.m === 3 ? P.dipH : null, 'Pole Star': P => P.m === 3 ? 'does not move' : null },
  status: P => P.m === 1 ? (P.away ? ['Going away from the Sun', false, 'warn'] : ['Coming towards the Sun', true]) : P.m === 2 ? [NAMES[P.nm], P.nm !== 3] : ['Sky turning', true],
  note: P => P.m === 1 ? (P.tw === 0 ? 'Far from the Sun the comet is a cold ball of ice and dust: no tail, and it moves slowly.' : `<b>${TW[P.tw]} tail.</b> ${P.away ? 'It shrinks as the comet leaves the Sun' : 'It grows as the comet nears the Sun'}, and always points away from the Sun. Fastest when near.`)
    : P.m === 2 ? (P.nm === 0 ? '<b>Meteoroid:</b> a rock moving through space.' : P.nm === 1 ? '<b>Meteor:</b> the rock rubs against air and glows: a shooting star.' : P.nm === 2 ? '<b>Meteorite:</b> a piece that reached the ground.' : 'It <b>burnt up</b> in the air. Only a streak of light was seen. Try a bigger rock.')
    : 'Stars circle the <b>Pole Star</b> as Earth spins. Follow the two pointer stars of Saptarishi to find it.',
  try: [{ t: '<b>Comet:</b> move the comet close to the Sun (place 0°). What happens to the tail?', check: P => P.m === 1 && P.tw >= 3, yes: 'Yes! A long tail, pointing away from the Sun.' },
    { t: 'Move the comet far away (place 180°). Where is its tail now?', check: P => P.m === 1 && Math.abs(P.c - 180) <= 20 && P.tw === 0, yes: 'Yes! No tail when it is far from the Sun.' },
    { t: '<b>Meteor:</b> pick a <b>Pebble</b>. Does anything reach the ground?', check: P => P.m === 2 && P.z === 1, yes: 'No! A pebble burns up completely. Only a shooting star.' },
    { t: 'Pick a <b>Boulder</b>. What is the piece on the ground called?', check: P => P.m === 2 && P.z === 3 && P.nm === 2, yes: 'Yes! A meteorite.' },
    { t: '<b>Stars:</b> switch off <b>Run time</b> and move the time slider. Which star does not move?', check: P => P.m === 3 && !P.run, yes: 'The Pole Star stays still. Everything else circles it.' }],
  key: ['A <b>comet</b> is a ball of ice and dust going round the Sun in a long oval orbit. Near the Sun the ice turns to gas and makes a bright tail.', 'A comet’s tail always points <b>away from the Sun</b>. It is longest near the Sun. A comet moves fastest near the Sun and slowest far away.', 'A <b>meteoroid</b> is a rock in space. When it falls through the air it glows: that streak is a <b>meteor</b> (shooting star). A piece that reaches the ground is a <b>meteorite</b>.', 'Most meteors are tiny and burn up completely.', 'The <b>Pole Star</b> stays in the north. The other stars seem to circle it because Earth spins.', '<b>Saptarishi</b> (Big Dipper) has seven stars. The two pointer stars show the way to the Pole Star. <b>Cassiopeia</b> is shaped like a W.'],
  quiz: [{ q: 'A comet’s tail points…', o: ['Towards the Sun', 'Away from the Sun', 'Along its path'], a: 1, why: 'The Sun pushes the gas and dust away.' }, { q: 'The glowing streak in the sky is a…', o: ['Meteoroid', 'Meteor', 'Meteorite'], a: 1, why: 'A meteor is the glow; a meteorite is the rock on the ground.' },
    { q: 'Which star seems to stay still in the northern sky?', o: ['Sirius', 'The Pole Star', 'Mars'], a: 1, why: 'The Pole Star lies almost above Earth’s north pole.' }]
};
