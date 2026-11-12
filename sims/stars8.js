// Class 8 · Ch 17 Stars and the Solar System — why the Moon changes shape, and the Sun's family of planets.
import { S, V, sph, arrow, mat, THREE, label, view } from '../scene.js';
const PL = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'], ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const PC = [0x9ca3af, 0xfcd34d, 0x3b82f6, 0xef4444, 0xf59e0b, 0xfde68a, 0x67e8f9, 0x6366f1], PS = [.35, .5, .55, .45, 1.1, .95, .7, .7], OR = i => 2.8 + i * 1.5;
const phase = a => a < 1 || a > 28.5 ? 'New' : a < 6.5 ? 'Crescent' : a < 8.5 ? 'Quarter' : a < 13.5 ? 'Gibbous' : a < 15.9 ? 'Full' : a < 21 ? 'Gibbous' : a < 22.9 ? 'Quarter' : 'Crescent';
let sun, earth, ring, moon, spr, ctx, tex, rays, pls, orb, nm, ang, lastDay, lastMode, lMoon, lEarth, lSun;
export default {
  title: 'Moon Phases and Planets', cam: { d: 24, e: 1.35, a: 0, t: V(-1, 0, 0), ref: 1.6 },
  head: 'Now showing',
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Moon phases', 'Planets'] },
    { k: 'd', l: '📅 Day of the month', min: 1, max: 30, step: 1, v: 8, w: P => P.m === 1 },
    { k: 'p', l: '🪐 Planet', min: 1, max: 9, step: 1, v: 1, names: ['None', ...PL], axis: true, w: P => P.m === 2 },
    { k: 't', l: '⏱ Time passing', min: 1, max: 3, step: 1, v: 2, names: ['Stop', 'Slow', 'Fast'], w: P => P.m === 2 }],
  setup() {
    sun = sph(2, 0xfbbf24); sun.material = mat(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: .8 }); earth = sph(1.3, 0x3b82f6);
    const seg = (r, a) => { for (let i = 0; i < 64; i++) { const u = i / 64 * 6.2832, v = (i + 1) / 64 * 6.2832; a.push(r * Math.cos(u), 0, r * Math.sin(u), r * Math.cos(v), 0, r * Math.sin(v)); } };
    const rp = []; seg(4.2, rp); const op = []; for (let i = 0; i < 8; i++) seg(OR(i), op);
    ring = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)), new THREE.LineBasicMaterial({ color: 0x64748b })); S.add(ring);
    orb = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(op, 3)), new THREE.LineBasicMaterial({ color: 0x475569 })); S.add(orb);
    moon = new THREE.Group(); moon.add(new THREE.Mesh(new THREE.SphereGeometry(.5, 20, 14), mat(0x1e293b))); const cap = new THREE.Mesh(new THREE.SphereGeometry(.53, 20, 10, 0, 6.2832, 0, 1.5708), new THREE.MeshBasicMaterial({ color: 0xf8fafc })); moon.add(cap); moon.rotation.z = Math.PI / 2; S.add(moon);
    rays = [-3, 0, 3].map(z => arrow(0xfde047, .08)); const cv = document.createElement('canvas'); cv.width = cv.height = 128; ctx = cv.getContext('2d'); tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); spr.scale.set(4.2, 4.2, 1); spr.position.set(7.5, 0, 3.6); S.add(spr);
    pls = PL.map((n, i) => { const m = sph(PS[i], PC[i]); return m; }); nm = PL.map(n => label(n, '#e2e8f0', .8));
    lMoon = label('Moon', '#e2e8f0', .7); lEarth = label('Earth', '#93c5fd', .8); lSun = label('Sun', '#fde047', .9); lMoon.set('What we see', '#e2e8f0');
  },
  reset() { ang = PL.map((_, i) => i * 2.4 + .5); lastDay = -1; lastMode = 0; },
  step(dt, P) {
    const A = P.m === 1; if (lastMode !== P.m) { lastMode = P.m; view.set(A ? { d: 24, e: 1.35, a: 0, t: V(-1, 0, 0), ref: 1.6 } : { d: 34, e: 1.3, a: 0, t: V(0, 0, 0), ref: 1.6 }); }
    [ring, moon, earth, spr, ...rays].forEach(o => o.visible = A); [orb, ...pls].forEach(o => o.visible = !A);
    if (A) {
      sun.position.set(-10, 0, 0); sun.scale.setScalar(1); earth.position.set(0, 0, 0); const age = P.d - 1, f = age / 29.5, th = f * 6.2832; P.age = age; P.ph = phase(age);
      moon.position.set(-4.2 * Math.cos(th), 0, 4.2 * Math.sin(th)); rays.forEach((r, i) => r.set(-7.2, 0, 3, 1, [-3, 0, 3][i]));
      lEarth.position.set(0, 1.6, 2.4); lEarth.set('Earth'); lSun.position.set(-10, 1, 3.4); lSun.set('Sun'); lMoon.position.set(7.5, 0, 6.6); lMoon.set('What we see');
      if (P.d !== lastDay) { lastDay = P.d; const R = 54, c = ctx, wax = f < .5, ck = Math.cos(th), rx = Math.abs(ck) * R; c.clearRect(0, 0, 128, 128); c.fillStyle = '#1e293b'; c.beginPath(); c.arc(64, 64, R, 0, 7); c.fill();
        c.fillStyle = '#f8fafc'; c.beginPath(); c.arc(64, 64, R, -1.5708, 1.5708, !wax); const right = wax === (ck > 0); c.ellipse(64, 64, Math.max(rx, .01), R, 0, 1.5708, right ? -1.5708 : 4.7124, right); c.fill(); tex.needsUpdate = true; }
      nm.forEach(l => l.set(''));
    } else {
      sun.position.set(0, 0, 0); sun.scale.setScalar(.7); const K = [0, 1, 4][P.t - 1]; lEarth.set(''); lMoon.set(''); lSun.position.set(0, 1.6, 1.8); lSun.set('Sun');
      pls.forEach((m, i) => { ang[i] += dt * K * .7 / Math.pow(OR(i), 1.5) * 4; m.position.set(OR(i) * Math.cos(ang[i]), 0, OR(i) * Math.sin(ang[i])); const on = P.p === i + 2; m.scale.setScalar(on ? 1.5 : 1);
        nm[i].position.set(m.position.x, .9 + PS[i], m.position.z); nm[i].set(PL[i], on ? '#fde047' : '#cbd5e1'); });
    }
  },
  ro: { 'Now showing': P => P.m === 1 ? P.ph : P.p > 1 ? PL[P.p - 2] : 'Planets', Position: P => P.m === 2 && P.p > 1 ? ORD[P.p - 2] + ' from the Sun' : null },
  status: P => P.m === 1 ? (P.ph === 'New' ? ['Dark side faces us', false, 'warn'] : P.ph === 'Full' ? ['Full lit face', true] : ['Part lit', true]) : ['Moving', true],
  note: P => P.m === 1 ? 'The Sun always lights half of the Moon. From Earth we see more or less of that lit half.' : P.p > 1 ? `${PL[P.p - 2]} is planet number ${P.p - 1} from the Sun.` : 'Eight planets go round the Sun. Pick one to see its name.',
  try: [{ t: 'Move <b>Day</b> to 1. Why is the Moon dark?', check: P => P.m === 1 && P.d === 1, yes: 'Yes! The dark side faces us.' },
    { t: 'Move <b>Day</b> to 15. How much of the lit half can we see?', check: P => P.m === 1 && P.ph === 'Full', yes: 'Yes! We see all of the lit half.' },
    { t: 'Switch to <b>Planets</b> and pick <b>Earth</b>. Which planets are closer to the Sun?', check: P => P.m === 2 && P.p === 4, yes: 'Yes! Mercury and Venus are closer.' }],
  key: ['The Moon shines because the Sun lights it.', 'Half of the Moon is always lit by the Sun.', 'The phases repeat every month, about 30 days.', 'Planets in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'],
  quiz: [{ q: 'What lights up the Moon?', o: ['The Sun', 'Earth', 'A lamp'], a: 0, why: 'The Moon has no light of its own.' }, { q: 'Which planet is closest to the Sun?', o: ['Earth', 'Mercury', 'Jupiter'], a: 1, why: 'Mercury is first in the line of planets.' }]
};
