// Class 9 (bonus) · projectile — kept from the original lab, with Try/Remember panels.
import { S, D, V, sph, line, floor, mat, THREE } from '../scene.js';
let ball, trail, pos, vel, pts, t;
export default {
  title: 'Projectile Motion', cam: { d: 32, t: V(10, 4, 0), e: .25, a: .3 },
  sliders: [{ k: 'v', l: 'Launch speed', min: 5, max: 30, step: 1, v: 20, u: 'm/s' }, { k: 'ang', l: 'Launch angle', min: 5, max: 85, step: 1, v: 45, u: '°' }, { k: 'g', l: 'Gravity', min: 1.6, max: 20, step: .2, v: 9.8, u: 'm/s²' }],
  setup() { floor(60, 12); ball = sph(.4, 0xf97316); trail = line(V(), V(0, 1), 0xfbbf24);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.5, .8, 1.2, 16), mat(0x64748b)); c.rotation.z = -.8; c.position.set(-.3, .4, 0); S.add(c); },
  reset(P) { pos = V(0, .5, 0); vel = V(P.v * Math.cos(P.ang * D), P.v * Math.sin(P.ang * D)); pts = [pos.clone()]; t = 0; P.H = 0; P.done = 0; P.Rg = 0; },
  step(dt, P) {
    if (!P.done) { vel.y -= P.g * dt; pos.addScaledVector(vel, dt); t += dt; P.H = Math.max(P.H, pos.y - .5);
      if (pos.y <= .4) { pos.y = .4; P.done = 1; P.Rg = pos.x; } pts.push(pos.clone()); trail.geometry.setFromPoints(pts); }
    ball.position.copy(pos); P.t = t;
  },
  ro: { Time: P => P.t.toFixed(1) + ' s', 'Max height': P => P.H.toFixed(1) + ' m', Range: P => P.Rg.toFixed(1) + ' m' },
  note: P => `Sideways speed stays constant while gravity pulls down. Theory range = v²sin2θ/g = <b>${(P.v * P.v * Math.sin(2 * P.ang * D) / P.g).toFixed(1)} m</b>. 45° gives the longest throw; 30° and 60° land at the same spot!`,
  try: ['Compare 30° and 60° — do they land together?', 'Which angle gives the maximum range? Check R = v² sin2θ / g.', 'Reduce g to the Moon value. What happens to height and range?'],
  key: ['Horizontal speed stays <b>constant</b>; vertical motion is free fall with g.', 'Range R = v²sin2θ/g · height H = v²sin²θ/2g', 'Beyond the Class 9 list: a bonus extension of Motion and Gravitation.'],
  quiz: [{ q: 'Which launch angle gives the longest range (no air)?', o: ['30°', '45°', '60°'], a: 1, why: 'R = v² sin2θ / g is biggest when 2θ = 90°.' }, { q: 'The horizontal velocity of a projectile…', o: ['increases', 'decreases', 'stays constant'], a: 2, why: 'Gravity acts only downwards.' }]
};
