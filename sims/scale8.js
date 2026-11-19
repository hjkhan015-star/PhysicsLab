// Class 8 · Ch 17 Stars and the Solar System — how big is the Universe? One zoom slider from Earth to the edge of what we can see.
// Distances and sizes are real (rounded) and drawn to the scale of the CURRENT zoom only; things too small to see are shown as enlarged dots. Light-travel times are worked out from distance ÷ 299,792 km/s.
import { S, V, THREE, label, beam, view } from '../scene.js';
import { earthTex, glowSprite } from '../earth.js';
const CS = 299792.458, LY = 9.4607e12, X0 = -5.5, WU = 14, LMIN = 4.2, LMAX = 24.4;                  // km/s · km in a light-year · where "you" are on screen · screen units across the view
const num = (x, d = 1) => { const r = x >= 100 ? Math.round(x) : x >= 10 ? +x.toFixed(d) : +x.toFixed(d + 1); return r.toLocaleString('en-US'); };
const fmtLen = km => { if (km >= LY) { const n = km / LY; return n >= 1e9 ? num(n / 1e9) + ' billion light-years' : n >= 1e6 ? num(n / 1e6) + ' million light-years' : n < 1.5 ? '1 light-year' : num(n) + ' light-years'; } return km >= 1e12 ? num(km / 1e12) + ' trillion km' : km >= 1e9 ? num(km / 1e9) + ' billion km' : km >= 1e6 ? num(km / 1e6) + ' million km' : num(km) + ' km'; };
const fmtLight = km => { const s = km / CS; if (s < 60) return (s < 1 ? s.toFixed(2) : s.toFixed(1)) + ' seconds'; if (s < 3600) return (s / 60).toFixed(1) + ' minutes'; if (s < 86400) return (s / 3600).toFixed(1) + ' hours'; const y = s / 31557600; if (y < .5) return Math.round(s / 86400) + ' days'; return y < 10 ? y.toFixed(1) + ' years' : y < 1e6 ? Math.round(y).toLocaleString('en-US') + ' years' : y < 1e9 ? num(y / 1e6) + ' million years' : num(y / 1e9) + ' billion years'; };
const nice = k => { const e = Math.pow(10, Math.floor(Math.log10(k))), m = k / e; return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * e; };
const sm = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), vis = (lw, a, b) => sm((lw - a) / .6) * sm((b - lw) / .6);
// [name, distance km from Earth, radius km, colour, window in log10(view width) [from, to], label, label height offset]
const OB = [['Earth', 0, 6371, 0x3b82f6, [0, 9.3], 'Earth', 1.1], ['Moon', 384400, 1737, 0xd1d5db, [5.5, 8.7], 'Moon', 1.1], ['Sun', 1.496e8, 696000, 0xfbbf24, [7.3, 11.3], 'Sun', 1.1],
  ['Mercury', 1.496e8 - 5.79e7, 2440, 0x9ca3af, [8.1, 10.3], 'Mercury', -1.3], ['Venus', 1.496e8 - 1.082e8, 6052, 0xfcd34d, [8.1, 10.3], 'Venus', 1.7], ['Mars', 1.496e8 + 2.279e8, 3390, 0xef4444, [8.1, 10.3], 'Mars', -1.3],
  ['Jupiter', 1.496e8 + 7.786e8, 69911, 0xd9a066, [8.6, 11.1], 'Jupiter', 1.1], ['Saturn', 1.496e8 + 1.434e9, 58232, 0xf5deb3, [8.9, 11.2], 'Saturn', -1.3], ['Uranus', 1.496e8 + 2.873e9, 25362, 0x67e8f9, [9.2, 11.3], 'Uranus', 1.1], ['Neptune', 1.496e8 + 4.495e9, 24622, 0x4f6bff, [9.4, 11.4], 'Neptune', -1.3],
  ['Voyager 1', 2.59e10, 1, 0xf87171, [10.1, 11.9], 'Voyager 1 (spacecraft)', 1.1], ['Solar system', 1.496e8, 4.5e9, 0xfde68a, [11.2, 14.9], 'Solar system', 1.4], ['Proxima Centauri', 4.0e13, 107000, 0xfb923c, [12.9, 16], 'Nearest star', 1.1],
  ['Centre of the Milky Way', 2.55e17, 5e15, 0xfef3c7, [17.0, 19.6], 'Centre of the Milky Way', 1.1], ['Virgo cluster', 5.1e20, 1e19, 0xc4b5fd, [20.5, 23.4], 'A cluster of galaxies', 1.1]];
const LM = [['Earth', 12742, 'Our home planet. It is 12,742 km across.', 'across'], ['Moon', 384400, 'About 30 Earths would fit in the gap between us and the Moon.'], ['Sun', 1.496e8, 'The Sun is so big that about a million Earths would fit inside it.'], ['Neptune', 4.495e9 + 1.496e8, 'Neptune is the farthest planet. Sunlight takes about 4 hours to get there.'],
  ['Voyager 1', 2.59e10, 'Voyager 1 is the farthest spacecraft we have made: about a light-day away.'], ['Nearest star', 4.0e13, 'Light from the nearest star, Proxima Centauri, takes over 4 years to reach us.'], ['Centre of the Milky Way', 2.55e17, 'Our galaxy, the Milky Way, has hundreds of billions of stars. We live in one of its arms.'],
  ['Andromeda galaxy', 2.365e19, 'Andromeda is the nearest big galaxy. Its light left about 2½ million years ago.'], ['Virgo cluster', 5.1e20, 'Galaxies group in clusters. This one has about 1,000 galaxies.'], ['Edge of what we can see', 4.4e23, 'There are billions of galaxies. Light from the edge took about 13.8 billion years to arrive.']];
const STG = [[LMIN, 'Earth'], [5.585, 'Moon'], [8.175, 'Sun'], [9.65, 'Planets'], [13.6, 'Stars'], [17.4, 'Milky Way'], [19.37, 'Galaxies'], [23.64, 'Universe']], NSTEP = Math.round((LMAX - LMIN) * 10);
const SN = Array.from({ length: NSTEP + 1 }, (_, i) => { const L = LMIN + i / 10; let n = 'Earth'; STG.forEach(([a, b]) => { if (L >= a - 1e-6) n = b; }); return n; });
const galTex = () => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(.12, 'rgba(255,225,160,.8)'); g.addColorStop(.45, 'rgba(150,170,255,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { const arm = i % 2, t = Math.pow(Math.abs(Math.sin(i * 12.9898) * 43758.5) % 1, .7) * 3.4 + .35, a = t * 1.7 + arm * Math.PI + (Math.abs(Math.sin(i * 78.233) * 999) % 1 - .5) * .5, r = 12 + t * 34; x.fillStyle = `rgba(${200 + (i % 3) * 20},${210},255,${.35 + (i % 5) * .1})`; x.fillRect(128 + r * Math.cos(a), 128 + r * Math.sin(a), 2, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
// SIZE mode: real radii (km), smallest to biggest. [name, radius km, colour, is a star]
const SZ = [['Moon', 1737, 0xd1d5db, 0], ['Earth', 6371, 0x3b82f6, 0], ['Jupiter', 69911, 0xd9a066, 0], ['Sun', 696000, 0xfbbf24, 1], ['Sirius A', 1.19e6, 0xbfdbfe, 1], ['Arcturus', 1.77e7, 0xfb923c, 1], ['Betelgeuse', 4.9e8, 0xef4444, 1]], SZN = [2, 3, 4, 6, 7];
const SZT = ['Earth is nearly 4 times as wide as the Moon. The Moon is Earth’s natural satellite.', 'Jupiter is about 11 times as wide as Earth. More than 1,300 Earths would fit inside it.', 'The Sun is about 109 times as wide as Earth. About 1.3 million Earths would fit inside it.', 'Stars come in many sizes. Arcturus is about 25 times as wide as the Sun, so the Sun is now a small dot.', 'Betelgeuse is a red giant about 700 times as wide as the Sun. The Sun and Earth are now far too small to see.'];
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = n => String(n).split('').map(d => SUP[+d]).join(''), vol = x => x < 1e6 ? num(x) : x < 1e9 ? num(x / 1e6) + ' million' : x < 1e12 ? num(x / 1e9) + ' billion' : num(x / 1e12) + ' trillion';
let szm, szl, szg, szN, sunG, pulse, pbeam, lpulse, lj, tr;
function sizeStep(P) {          // true proportions: the biggest thing drawn 2.6 units wide (radius); everything else in the same proportion (tiny things become enlarged dots)
  const n = SZN[P.s - 1], rs = SZ.slice(0, n).map(o => Math.max(o[1] * 2.6 / SZ[n - 1][1], .07)), xs = []; let x = 0, clip = false;
  rs.forEach((r, i) => { x = i ? x + Math.max(rs[i - 1] + r + .3, 1.25) : 0; xs.push(x); }); const sh = -(xs[0] - rs[0] + xs[n - 1] + rs[n - 1]) / 2;
  SZ.forEach((o, i) => { const on = i < n, big = on && o[1] * 2.6 / SZ[n - 1][1] < .07; if (big) clip = true; szm[i].visible = szl[i].visible = on; szg[i].visible = on && !!o[3];
    if (!on) return; szm[i].position.set(xs[i] + sh, 0, 0); szm[i].scale.setScalar(rs[i]); szg[i].position.set(xs[i] + sh, 0, -.1); szg[i].scale.setScalar(rs[i] * 5); szl[i].position.set(xs[i] + sh, (i % 2 ? -1 : 1) * (rs[i] + .65), 0); });
  szN.visible = clip; szN.position.set(0, -4.6, 0); P.big = SZ[n - 1]; }
const cand = []; let Lc, Lt, lz, ob, labs, mw, an, edge, web, pin, you, bar, lbar, lNS, lAn, lMW, wd;
const M4 = new THREE.Matrix4(), Q0 = new THREE.Quaternion(), NW = 260;
const WD = Array.from({ length: NW }, (_, i) => { const r = Math.pow(10, 20.6 + (Math.abs(Math.sin(i * 91.17) * 4375.8) % 1) * 3), a = (Math.abs(Math.sin(i * 17.31) * 9999) % 1) * 6.2832; return [r * Math.cos(a), r * Math.sin(a)]; });
export default {
  title: 'How Big is the Universe?', cam: { d: 17, e: .02, a: 0, t: V(0, 0, 0), ref: 1.05 },
  head: 'Showing', tabs: [['skyobjects8', 'Sky'], ['meteor8', 'Meteor'], ['scale8', 'Scale'], ['satellites8', 'Orbits']],
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Distance', 'Size'] },
    { k: 'z', l: '🔭 Zoom out', min: LMIN, max: LMAX, step: .1, v: LMIN, names: SN, axis: true, w: P => P.m === 1 },
    { k: 'j', l: '🎯 Jump to', min: 1, max: 8, step: 1, v: 1, names: STG.map(s => s[1]), axis: true, w: P => P.m === 1 },
    { k: 's', l: '📏 Compare', min: 1, max: 5, step: 1, v: 1, names: ['Moon, Earth', '+ Jupiter', '+ Sun', '+ Stars', '+ Giant star'], axis: true, w: P => P.m === 2 }],
  toggles: [{ k: 'auto', l: 'Zoom out by itself', v: false, w: P => P.m === 1 }, { k: 'race', l: '💡 Light race', v: false, w: P => P.m === 1 }],
  setup() {
    const g = new THREE.SphereGeometry(1, 20, 14); ob = OB.map((o, i) => { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: o[3], transparent: true, depthWrite: false })); m.renderOrder = 2 + i * .01; S.add(m); return m; });
    labs = OB.map(o => label(o[5], '#e2e8f0', .8));
    mw = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: galTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); mw.renderOrder = 1; S.add(mw);
    an = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: mw.material.map, color: 0xbfd4ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); an.renderOrder = 1; an.rotation.z = .5; S.add(an);
    edge = new THREE.Mesh(new THREE.RingGeometry(.99, 1, 120), new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, side: THREE.DoubleSide, depthWrite: false })); S.add(edge);
    web = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 5, 4), new THREE.MeshBasicMaterial({ color: 0xdbeafe, transparent: true, depthWrite: false }), NW); web.frustumCulled = false; S.add(web);
    pin = new THREE.Mesh(new THREE.ConeGeometry(.16, .42, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 })); pin.rotation.z = Math.PI; pin.renderOrder = 9; S.add(pin); you = label('You are here', '#fca5a5', .85);
    bar = beam(0xe2e8f0, .04); lbar = label('', '#e2e8f0', .8); lNS = label('Sizes true for this zoom only', '#fbbf24', .72); lAn = label('Andromeda galaxy', '#e2e8f0', .8); lMW = label('Milky Way', '#e2e8f0', .85); wd = label('Galaxies', '#bfdbfe', .75);
    ob[0].material.map = earthTex(); ob[0].material.color.set(0xffffff); sunG = glowSprite();                                   // Earth with its map, Sun with a soft glow
    pulse = new THREE.Mesh(new THREE.SphereGeometry(.18, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff7c2 })); pulse.renderOrder = 8; S.add(pulse); pbeam = beam(0xfde047, .03); lpulse = label('', '#fde047', .8);   // the light race
    const g1 = new THREE.SphereGeometry(1, 36, 24); szm = SZ.map(o => { const m = new THREE.Mesh(g1, new THREE.MeshBasicMaterial({ color: o[2] })); S.add(m); return m; }); szm[1].material.map = earthTex(); szm[1].material.color.set(0xffffff);
    szl = SZ.map(o => label(o[0], '#e2e8f0', .85)); szg = SZ.map(o => glowSprite(o[0] === 'Sun' ? '255,170,40' : o[2] === 0xef4444 ? '255,90,60' : o[2] === 0xfb923c ? '255,150,60' : '170,200,255')); szN = label('Dots are bigger than the real thing', '#fbbf24', .75);
  },
  reset() { Lc = Lt = LMIN; lz = LMIN; tr = 0; lj = undefined; },
  step(dt, P) {
    const D1 = P.m === 1; if (lj === undefined) lj = P.j;
    if (!D1) { [...ob, ...labs, mw, an, edge, web, pin, you, bar, lbar, lNS, lAn, lMW, wd, pulse, pbeam, lpulse, sunG].forEach(o => o.visible = false); sizeStep(P); return; }
    [...szm, ...szl, ...szg, szN].forEach(o => o.visible = false); [pin, you, bar, lbar, lNS].forEach(o => o.visible = true);
    if (P.j !== lj) { lj = P.j; Lt = STG[P.j - 1][0]; lz = P.z; }                                                               // Jump to: glide to a named stop
    if (P.z !== lz) { lz = P.z; Lt = P.z; } if (P.auto) Lt = Math.min(LMAX, Lt + dt * .45); Lc += (Lt - Lc) * Math.min(1, dt * 5); const lw = Lc, W = Math.pow(10, lw), k = WU / W, X = km => X0 + km * k; P.W = W; P.L = lw;
    OB.forEach((o, i) => { const v = vis(lw, o[4][0], o[4][1]), m = ob[i], rr = Math.max(o[2] * k, o[0] === 'Voyager 1' ? .07 : o[0] === 'Solar system' ? .2 : .1), x = X(o[1]); m.visible = v > .02 && x > X0 - 12 && x < 12 && rr < 40; m.position.set(x, 0, 0); m.scale.set(rr, rr, rr); m.material.opacity = (o[0] === 'Solar system' ? .35 : 1) * v;
      cand[i] = v > .35 && Math.abs(x) < 8.3 && rr < 7 ? { i, x, rr } : null; });
    const slots = [[], [], [], []], SY = [1.2, 2.5, -1.4, -2.7]; labs.forEach(l => l.visible = false);
    cand.forEach(c => { if (!c) return; for (let s = 0; s < 4; s++) if (slots[s].every(x2 => Math.abs(c.x - x2) >= 2.1)) { slots[s].push(c.x); const lb = labs[c.i], r = Math.min(c.rr, 3.5); lb.visible = true; lb.position.set(c.x, SY[s] + (SY[s] > 0 ? r : -r), 0); break; } });
    // galaxies
    const gv = vis(lw, 16.4, 21.4), mx = X(2.55e17), dia = 9.5e17 * k; mw.visible = gv > .02; mw.position.set(mx, 0, 0); mw.scale.set(dia, dia, 1); mw.material.opacity = gv; lMW.visible = gv > .4 && Math.abs(mx) < 9 && dia > 1.5; lMW.position.set(mx, -dia * .32 - .4, 0);
    const av = vis(lw, 18.8, 22.4), ax = X(2.365e19), ad = 2.1e18 * k; an.visible = av > .02; an.position.set(ax, ad * .25, 0); an.scale.set(Math.max(ad, .25), Math.max(ad, .25) * .45, 1); an.material.opacity = av; lAn.visible = av > .4 && Math.abs(ax) < 8; lAn.position.set(ax, 1.1 + Math.max(ad, .25) * .3, 0);
    const wv = vis(lw, 20.9, 24.6); web.visible = wv > .02; web.material.opacity = wv * .8; for (let i = 0; i < NW; i++) { M4.compose(V(X(WD[i][0]), WD[i][1] * k, 0), Q0, V(.05, .05, .05)); web.setMatrixAt(i, M4); } web.instanceMatrix.needsUpdate = true; wd.visible = wv > .5; wd.position.set(4.5, 3.4, 0);
    const ev = vis(lw, 22.6, 25), er = 4.4e23 * k; edge.visible = ev > .02 && er < 60; edge.position.set(X0, 0, 0); edge.scale.set(er, er, 1); edge.material.opacity = ev; const el = labs.length; 
    // you are here
    const er0 = 6371 * k; pin.position.set(X0, Math.max(er0, .1) + .3, 0); you.position.set(X0 + (lw < 5 ? 2 : 0), Math.max(-Math.max(er0, .1) - .75, -3), 0); you.visible = true;
    // scale bar
    const len = nice(W * 4 / WU), lu = len * k; bar.set(V(-1.5 - lu / 2 + 4, -3.6, 0), V(-1.5 + lu / 2 + 4, -3.6, 0)); lbar.position.set(2.5, -4.35, 0); lbar.set('Bar = ' + fmtLen(len), '#e2e8f0'); lNS.position.set(0, -5.4, 0);
    // what are we looking at
    let f = 0; LM.forEach((m, i) => { if (m[1] <= W * .98) f = i; }); P.f = f; P.fd = LM[f][1];
    // light race: a light pulse crosses the picture at 299,792 km/s (the clock is sped up so you can watch it)
    tr += dt; const ru = Math.min(1, (tr % 9) / 6.5), px = X0 + ru * (7.4 - X0), rd = (px - X0) / k, rv = !!P.race; P.rd = rd; pulse.visible = pbeam.visible = lpulse.visible = rv;
    if (rv) { pulse.position.set(px, 0, .3); pbeam.set(V(X0, 0, .3), V(px, 0, .3)); lpulse.position.set(Math.min(px, 5.6), .7, 0); lpulse.set('Light: ' + fmtLight(Math.max(rd, 1e-3)), '#fde047'); }
    sunG.visible = ob[2].visible; sunG.position.copy(ob[2].position); sunG.scale.setScalar(Math.max(ob[2].scale.x, .12) * 5); sunG.material.opacity = ob[2].material.opacity;
  },
  ro: { 'Showing': P => P.m === 1 ? LM[P.f][0] : P.big[0], 'Light takes': P => P.m === 1 ? fmtLight(P.f === 0 ? 12742 : P.fd) : null, 'Distance': P => P.m === 1 ? (P.f === 0 ? '12,742 km across' : fmtLen(P.fd)) : null, 'View is': P => P.m === 1 ? fmtLen(P.W) + ' wide' : null,
    'Light travelled': P => P.m === 1 && P.race ? fmtLight(Math.max(P.rd, 1e-3)) : null, 'Across': P => P.m === 2 ? fmtLen(2 * P.big[1]) : null, 'Earths in a row': P => P.m === 2 ? num(2 * P.big[1] / 12742) : null, 'Earths fit inside': P => P.m === 2 ? vol(Math.pow(P.big[1] / 6371, 3)) : null },
  status: P => P.m === 2 ? ['True sizes', true] : [SN[Math.round((P.L - LMIN) * 10)] || 'Universe', true],
  note: P => P.m === 2 ? `<b>${P.big[0]}.</b> ${SZT[P.s - 1]}` : `<b>${LM[P.f][0]}.</b> ${LM[P.f][2]}`,
  try: [{ t: 'Zoom out until you can see the <b>Moon</b>. How long does its light take to reach us?', check: P => P.f === 1, yes: 'About 1.3 seconds!' },
    { t: 'Find the <b>Sun</b>. How long does sunlight take to reach Earth?', check: P => P.f === 2, yes: 'About 8 minutes. We see the Sun as it was 8 minutes ago.' },
    { t: 'Zoom out to the <b>nearest star</b>. How many years does its light take?', check: P => P.f === 5, yes: 'Over 4 years!' },
    { t: 'Zoom out to the <b>Milky Way</b>. Where is the red pin?', check: P => P.f >= 6, yes: 'Inside one of its arms. The Sun is one star in the Milky Way.' },
    { t: 'Zoom out as far as you can. What do the small dots stand for?', check: P => P.f === 9, yes: 'Each dot is a whole galaxy!' },
    { t: 'Switch on <b>💡 Light race</b> and zoom to the <b>Sun</b>. How long does the light dot take to cross?', check: P => P.m === 1 && P.race && P.f >= 2, yes: 'Minutes! Light is very fast, but space is huge.' },
    { t: 'Switch to <b>Size</b> and pick <b>+ Sun</b>. How many Earths in a row would cross the Sun?', check: P => P.m === 2 && P.s === 3, yes: 'About 109 Earths!' },
    { t: 'In <b>Size</b>, pick <b>+ Giant star</b>. What happened to the Sun?', check: P => P.m === 2 && P.s === 5, yes: 'It is now a tiny dot next to a giant star.' }],
  key: ['<b>Light</b> travels 299,792 km every second. A <b>light-year</b> is the distance light travels in one year: about 9.46 million million km.', 'Light takes 1.3 seconds from the Moon, about 8 minutes from the Sun and over 4 years from the nearest star.', 'The Sun is one of hundreds of billions of stars in our galaxy, the <b>Milky Way</b>.', 'There are billions of galaxies in the Universe.', 'Each zoom level is drawn to its own scale. Tiny things are shown as dots so you can see them.', 'In <b>Size</b> mode everything is drawn in true proportion. Some stars are hundreds of times wider than the Sun.'],
  quiz: [{ q: 'About how long does sunlight take to reach Earth?', o: ['8 seconds', '8 minutes', '8 hours'], a: 1, why: 'The Sun is about 150 million km away.' }, { q: 'A light-year is a unit of…', o: ['Time', 'Distance', 'Speed'], a: 1, why: 'It is how far light goes in one year.' },
    { q: 'What is the Milky Way?', o: ['A star', 'Our galaxy', 'A planet'], a: 1, why: 'It is the galaxy that holds the Sun and billions of other stars.' }, { q: 'About how many Earths would fit inside the Sun?', o: ['About 100', 'About 1.3 million', 'Just 1'], a: 1, why: 'The Sun is 109 times as wide as Earth, so over a million Earths fit inside.' }]
};
