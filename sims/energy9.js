// Class 9 · Ch 11 Work and Energy — KE ⇄ PE on a frictionless track; PE + KE stays constant.
import { S, V, THREE, mat, box, sph, label } from '../scene.js';
const K = .08, G = 9.8; let ball, x, vx, bPE, bKE, E0, H0;
export default {
  title: 'Work & Energy — KE ⇄ PE', cam: { d: 29, e: .08, a: 0, t: V(2, 4.6, 0), ref: 1.2 },
  sliders: [{ k: 'h', l: 'Start height h', min: 2, max: 10, step: 1, v: 8, u: 'm' }, { k: 'm', l: 'Mass m', min: 1, max: 10, step: 1, v: 2, u: 'kg' }],
  setup() { const pts = []; for (let i = -24; i <= 24; i++) pts.push(V(i * .5, K * i * i * .25, 0));
    S.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, .18, 8), mat(0x64748b)));
    ball = sph(.55, 0xf97316); bPE = box(1.6, 1, 1.6, 0xf59e0b); bKE = box(1.6, 1, 1.6, 0x22d3ee); bPE.position.x = 13; bKE.position.x = 15.5;
    label('PE', '#fbbf24', 1.2).position.set(13, 8.8, 0); label('KE', '#67e8f9', 1.2).position.set(15.5, 8.8, 0); },
  reset(P) { x = -Math.sqrt(P.h / K); vx = 0; E0 = P.m * G * P.h; H0 = P.h; },
  step(dt, P) {
    const n = 20, h = dt / n; for (let i = 0; i < n; i++) { const yp = 2 * K * x, ypp = 2 * K; vx += -(G * yp + yp * ypp * vx * vx) / (1 + yp * yp) * h; x += vx * h;
      const sp = Math.sqrt(Math.max(0, 2 * G * (H0 - K * x * x)) / (1 + 4 * K * K * x * x)); vx = (vx === 0 ? -Math.sign(x) : Math.sign(vx)) * sp; }   // keeps total energy exactly constant
    const y = K * x * x, v2 = vx * vx * (1 + 4 * K * K * x * x); ball.position.set(x, y + .75, 0);
    P.y = y; P.v = Math.sqrt(v2); P.PE = P.m * G * y; P.KE = .5 * P.m * v2; P.E0 = E0;
    bPE.scale.y = Math.max(.02, 7 * P.PE / E0); bPE.position.y = bPE.scale.y / 2; bKE.scale.y = Math.max(.02, 7 * P.KE / E0); bKE.position.y = bKE.scale.y / 2;
  },
  ro: { Speed: P => P.v.toFixed(1) + ' m/s', Height: P => P.y.toFixed(1) + ' m', 'PE = mgh': P => P.PE.toFixed(0) + ' J', 'KE = ½mv²': P => P.KE.toFixed(0) + ' J', 'PE + KE': P => (P.PE + P.KE).toFixed(0) + ' J' },
  head: 'Speed',
  note: P => (P.y > P.h * .85 ? '<b>Near the top:</b> almost all the energy is <b>PE</b> (stored).' : P.y < P.h * .15 ? `<b>At the bottom:</b> almost all the energy is <b>KE</b> (motion). v = √(2gh) = ${Math.sqrt(2 * G * P.h).toFixed(1)} m/s.` : '<b>On the way:</b> PE is turning into KE (and back).') + ' <b>PE + KE stays constant</b> — energy is only changed from one form to another. Press ↻ after changing h or m.',
  try: ['Watch the two bars. When one goes down, what does the other do?', 'Double the mass. Does the speed at the bottom change?', 'Raise h from 4 m to 8 m. By what factor does the bottom speed grow? (v = √(2gh))'],
  key: ['<b>KE = ½mv²</b> · <b>PE = mgh</b> · Work <b>W = F × s</b>', '<b>Law of conservation of energy:</b> energy only changes form, never lost. This track is <b>frictionless</b>, so nothing is lost to friction.', 'Power <b>P = W/t</b> (watt). Work is measured in joule (J).', 'Work is done when a force moves a body in its direction.', 'Commercial unit of energy: <b>1 kWh</b> = 1 kW for 1 hour = 3.6 × 10⁶ J (one &ldquo;unit&rdquo; on the electricity bill).'],
  quiz: [{ q: 'At the lowest point the ball has maximum…', o: ['PE', 'KE', 'mass'], a: 1, why: 'All PE has changed into KE.' }, { q: 'The law of conservation of energy says energy is…', o: ['created by motion', 'destroyed by friction', 'changed from one form to another'], a: 2, why: 'The total stays the same.' }]
};
