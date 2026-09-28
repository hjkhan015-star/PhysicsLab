import { S, D, V, box, floor, THREE } from '../kit.js';
let b, aF, aR, x, v;
export default {
  title: 'Force & Friction', cam: { d: 15, t: V(0, 1, 0) },
  sliders: [{ k: 'F', l: 'Applied force', min: 0, max: 60, step: 1, v: 20, u: 'N' }, { k: 'mu', l: 'Roughness (μ)', min: 0, max: 1, step: .05, v: .3, u: '' }, { k: 'm', l: 'Mass', min: 1, max: 10, step: 1, v: 4, u: 'kg' }],
  setup() { floor(30, 10); b = box(2, 1, 2, 0xf59e0b); b.position.y = .5;
    aF = new THREE.ArrowHelper(V(1), V(), 3, 0x22c55e); aR = new THREE.ArrowHelper(V(-1), V(), 3, 0xef4444); S.add(aF, aR); },
  reset() { x = -10; v = 0; },
  step(dt, P) {
    const fmax = P.mu * P.m * 9.8, go = P.F > fmax; let a = 0;
    if (go) { a = (P.F - fmax) / P.m; v += a * dt; } else v = Math.max(0, v - fmax / P.m * dt);
    x += v * dt; if (x > 12) x = -10; b.position.x = x;
    P.a = a; P.fr = go ? fmax : Math.min(P.F, fmax); P.v = v;
    aF.position.set(x - 1, 1.6, 0); aF.setLength(Math.max(.01, P.F / 10), .4, .3);
    aR.position.set(x + 1, 1.6, 0); aR.setLength(Math.max(.01, P.fr / 10), .4, .3);
  },
  ro: { Friction: P => P.fr.toFixed(1) + ' N', Acceleration: P => P.a.toFixed(2) + ' m/s²', Speed: P => P.v.toFixed(1) + ' m/s' },
  note: P => P.F > P.mu * P.m * 9.8 ? `<b>Moving!</b> Green push (${P.F} N) beats red friction. Net force = ${(P.F - P.fr).toFixed(1)} N, so a = F/m.` : `<b>Not moving.</b> Friction (max ${(P.mu * P.m * 9.8).toFixed(1)} N) matches your push. Try more force or a smoother surface (lower μ).`
};
