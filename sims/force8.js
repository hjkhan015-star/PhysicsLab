// Class 8 · Ch 11 Force and Pressure — FORCE. A push or a pull. Contact forces, non-contact forces, and the 3 things a force can do.
// One scene per example; only the chosen scene is visible. "How much force" = more force → bigger effect, in every scene.
import { S, V, box, sph, beam, arrow, arrowTo, floor, mat, THREE, label } from '../scene.js';
const TABS = [['force8', 'Force'], ['pressure8', 'Solids'], ['liquidpressure8', 'Liquids']];
const FN = [10, 20, 30, 40, 50], FW = ['Very small', 'Small', 'Medium', 'Big', 'Very big'];
const SKIN = 0xfcd9b6, SLV = 0x60a5fa, RED = 0xef4444, BLUE = 0x3b82f6, GREEN = 0x22c55e;
let fl, crate, hand, rope, wall, push, gap, lGap, lA, lB, lC, ball, ball2, wA1, wA2, trail, bat, sponge, magA, magB, field, comb, bits, minus, cart, wheel, key = '', st = {};
const tp = new Float32Array(60 * 3), hits = new Set();
const grp = (a, b, c, d) => { const g = new THREE.Group(); g.add(...[a, b, c, d].filter(Boolean)); return g; };
function mkHand() {                                    // fist on the right end, arm to the left; origin = the touching face of the fist
  const g = new THREE.Group(), f = new THREE.Mesh(new THREE.BoxGeometry(1, 1.3, 1.5), mat(SKIN)), a = new THREE.Mesh(new THREE.BoxGeometry(3.4, .8, 1), mat(SLV));
  f.position.x = -.5; a.position.x = -2.7; g.add(f, a); S.add(g); return g;
}
function mkMagnet(left, right) {                       // two coloured halves: red = N, blue = S
  const g = new THREE.Group(), a = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.6), mat(left)), b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.6), mat(right)); a.position.x = -.6; b.position.x = .6; g.add(a, b); S.add(g); g.parts = [a, b]; return g;
}
const place = (o, x, y = 0, z = 0) => o.position.set(x, y, z);
export default {
  title: 'Force — Push and Pull', cam: { d: 14.5, e: .3, a: 0, t: V(1, 1.9, 0), ref: 1.5 }, tabs: TABS, head: 'Force',
  sliders: [{ k: 'm', l: '🔀 Kind', min: 1, max: 3, step: 1, v: 1, names: ['Contact', 'Non-contact', 'Effects'] },
    { k: 'c', l: '🤝 Example', min: 1, max: 4, step: 1, v: 1, names: ['Push', 'Pull', 'Lift', 'Slide'], axis: true, w: P => P.m === 1 },
    { k: 'n', l: '🧲 Example', min: 1, max: 3, step: 1, v: 1, names: ['Magnet', 'Rubbed comb', 'Gravity'], axis: true, w: P => P.m === 2 },
    { k: 'e', l: '🎯 What changes', min: 1, max: 5, step: 1, v: 1, names: ['Shape', 'Direction', 'Start', 'Speed up', 'Slow down'], axis: true, w: P => P.m === 3 },
    { k: 'F', l: '💪 How much force', min: 1, max: 5, step: 1, v: 3, names: FW, axis: true }],
  toggles: [{ k: 'flip', l: 'Turn the magnet round', v: false, w: P => P.m === 2 && P.n === 1 }],
  setup() {
    fl = floor(34, 10);
    crate = box(2.2, 1.6, 2.2, 0xd97706); hand = mkHand(); rope = beam(0x92400e, .07); wall = box(1.2, 5, 3, 0x64748b); push = arrow(GREEN, .14);
    gap = arrowTo(0xe2e8f0, .05); lGap = label('', '#e2e8f0', .8); lA = label('', '#86efac', .9); lB = label('', '#fde047', .8); lC = label('', '#e2e8f0', .8);
    ball = sph(.8, 0xef4444); ball2 = sph(.8, 0x38bdf8); wA1 = arrowTo(GREEN, .09); wA2 = arrowTo(GREEN, .09);
    trail = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(tp, 3)), new THREE.PointsMaterial({ color: 0xfde047, size: .32 })); S.add(trail);
    bat = box(3.4, .5, 1.8, 0xa16207); sponge = box(2.4, 2.4, 2.4, 0xfde047);
    magA = mkMagnet(RED, BLUE); magB = mkMagnet(RED, BLUE); field = box(1, 2.6, 2.6, 0xfbbf24); field.material = mat(0xfbbf24, { transparent: true, opacity: .13 });
    comb = box(3.6, .35, .8, 0x2563eb); minus = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(8 * 3), 3)), new THREE.PointsMaterial({ color: 0x93c5fd, size: .35 })); S.add(minus);
    bits = Array.from({ length: 10 }, (_, i) => box(.38, .08, .38, i % 2 ? 0xf8fafc : 0xfecaca));
    cart = box(3, .9, 2, 0x22c55e); wheel = [-1, 1].map(s => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 2.3, 16), mat(0x1e293b)); w.rotation.x = Math.PI / 2; w.position.set(s * 1, .45, 0); S.add(w); return w; });
  },
  reset() { key = ''; hits.clear(); },
  step(dt, P) {
    const k = P.m === 1 ? 'c' + P.c : P.m === 2 ? 'n' + P.n + (P.flip ? 'r' : '') : 'e' + P.e, F = P.F, N = FN[F - 1];
    if (k !== key) { key = k; st = { t: 0, x: 0, y: 0, v: 0, p: 0, ph: 0 }; }
    const ALL = [crate, hand, rope, wall, push, gap, ball, ball2, wA1, wA2, trail, bat, sponge, magA, magB, field, comb, minus, cart, ...wheel, ...bits];
    ALL.forEach(o => o.visible = false); [lGap, lA, lB, lC].forEach(l => l.set('')); const show = (...o) => o.forEach(x => x.visible = true); const T = st.t += dt; P.fx = ''; P.F_N = N;
    // ── CONTACT ────────────────────────────────────────────────────────────────────────────────────────────────
    if (k === 'c1' || k === 'c2') {                                    // PUSH / PULL — hand touches the crate; it speeds up while the hand is on it, then coasts
      const pull = k === 'c2', ph = T % 7, on = ph < 1.3, a = N / 8;
      if (ph < dt * 1.5 || st.x === 0) { st.x = -5.5; st.v = 0; }
      if (on) st.v += a * dt; else st.v = Math.max(0, st.v - .5 * dt); st.x += st.v * dt; if (st.x > 9) { st.x = -5.5; st.v = 0; }
      crate.position.set(st.x, .8, 0); show(crate, hand, push);
      if (!pull) { hand.scale.x = 1; hand.position.set(on ? st.x - 1.1 : st.x - 1.1 - (ph - 1.3) * 1.2, 1.2, 0); push.set(st.x - 1.1 - N / 14, 1.2, N / 14, 1, 1.3); push.visible = on; lA.position.set(st.x - 3, 3.4, 0); lA.set(on ? 'PUSH' : '');
        lB.position.set(st.x - 1.1, 2.4, 0); lB.set(on ? 'Touching ✔' : '', '#fde047'); }
      else { show(rope); hand.scale.x = -1; const hx = on ? st.x + 1.1 + 3.2 : st.x + 1.1 + 3.2 + (ph - 1.3) * 1.2; hand.position.set(hx, 1.2, 0); rope.set(V(st.x + 1.1, .9, 0), V(hx, .9, 0)); rope.visible = true;
        push.set(st.x + 1.1, 2.1, N / 14, -1, 1.3); push.visible = on; lA.position.set(st.x + 3, 3.6, 0); lA.set(on ? 'PULL' : ''); lB.position.set(hx, 2.4, 0); lB.set(on ? 'Rope joins hand ✔' : '', '#fde047'); }
      P.fx = st.v < .1 ? 'Not moving yet' : 'Moves — speed ' + st.v.toFixed(1);
    } else if (k === 'c3') {                                           // LIFT — muscle force must beat the weight (30 N)
      const W = 30, up = N > W, ph = T % 6; if (ph < dt * 1.5 || !st.x) { st.x = 1; st.v = 0; }
      if (ph < 3.5 && up) { st.v += (N - W) / 5 * dt; st.x = Math.min(6.5, st.x + st.v * dt); } else if (ph >= 3.5) { st.x = Math.max(1, st.x - 4 * dt); st.v = 0; }
      crate.position.set(0, st.x - .2 + .6, 0); crate.scale.set(.9, .9, .9); show(crate, hand, push, wA1, lA, lB);
      hand.scale.x = 1; hand.rotation.z = 0; hand.position.set(-1.1, st.x + .6 - .2, 0); hand.children[0].visible = true;
      push.visible = false; wA1.to(0, st.x + .6 - .2 + .2, 0, st.x + .6 - .2 + .2 - W / 12, 1.6); wA1.visible = true;
      lA.position.set(-4.2, st.x + 1, 0); lA.set('Muscles: ' + N + ' N up', '#86efac'); lB.position.set(2.6, st.x - .6, 0); lB.set('Weight: 30 N down', '#fde047');
      if (up) P.lifted = true; P.fx = up ? 'Lifted!' : 'Too weak to lift';
    } else if (k === 'c4') {                                           // SLIDE — friction (contact) slows the crate
      const ph = T % 6; if (ph < dt * 1.5 || !st.x) { st.x = -6; st.v = N / 5; } st.v = Math.max(0, st.v - 2.2 * dt); st.x += st.v * dt; crate.position.set(st.x, .8, 0); crate.scale.set(1, 1, 1); show(crate, push, lA, lB);
      push.set(st.x + 1.1, .35, 1.7 + 0, -1, 1.4); push.visible = st.v > .05; lA.position.set(st.x, 3, 0); lA.set('Floor rubs on the crate'); lB.position.set(st.x + 1.5, 1.7, 0); lB.set(st.v > .05 ? 'Friction ←' : 'Stopped', '#fde047');
      P.fx = st.v > .05 ? 'Slowing down' : 'Stopped'; P.slid = true;
    }
    // ── NON-CONTACT ───────────────────────────────────────────────────────────────────────────────────────────
    else if (k[0] === 'n' && k[1] === '1') {                           // MAGNET — pulls or pushes across a gap
      const rep = !!P.flip, reach = 2.4 + F * 1.4, mx = -6.5; place(magA, mx, .8); magA.parts[0].material.color.set(BLUE); magA.parts[1].material.color.set(RED);   // fixed magnet: right face is N (red)
      if (st.x === 0 || T < dt * 1.5) { st.x = 3.5; st.v = 0; }
      const g = (st.x - 1.2) - (mx + 1.2);                              // clear gap between the magnets
      if (g > 0 && g < reach) st.v += (rep ? 1 : -1) * F * 2.4 * (1 - g / reach) * dt; st.v *= 1 - .5 * dt; st.x += st.v * dt;
      if (st.x - 1.2 < mx + 1.2 + .02) { st.x = mx + 2.4 + 1.2; st.v = 0; P.stuck = true; }
      if (st.x > 9 || (T > 9 && !rep) || (T > 9 && Math.abs(st.v) < .05)) { st.x = 3.5; st.v = 0; st.t = 0; }
      place(magB, st.x, .8); magB.parts[0].material.color.set(rep ? RED : BLUE); magB.parts[1].material.color.set(rep ? BLUE : RED);              // flipped → N faces N
      const near = g > 0 && g < reach; field.scale.set(reach, 1, 1); place(field, mx + 1.2 + reach / 2, .8); show(magA, magB, field, lA, lB, lGap, gap);
      gap.to(mx + 1.2, 2.9, st.x - 1.2, 2.9, 0); gap.visible = g > .4; lGap.position.set((mx + st.x) / 2, 3.6, 0); lGap.set(g > .4 ? 'Gap — NOT touching' : 'Stuck together');
      lA.position.set(mx, 2.3, 0); lA.set('Magnet', '#e2e8f0'); lB.position.set(st.x, 2.3, 0); lB.set(near ? (rep ? 'Pushed away →' : '← Pulled') : 'Too far — no pull', near ? '#86efac' : '#fca5a5');
      P.fx = Math.abs(st.v) < .05 ? (near ? 'Starting…' : 'Out of reach') : rep ? 'Pushed away' : 'Pulled in'; if (rep && near) P.repel = true; if (!rep && st.v < -.5) P.pulled = true;
    } else if (k[0] === 'n' && k[1] === '2') {                         // RUBBED COMB — pulls paper bits across a gap
      const ph = T % 8, h = ph < 4 ? 5.2 - ph * .8 : 2 + (ph - 4) * .8, reach = .5 + F * .85; place(comb, 0, h + .5, 0); show(comb, minus, ...bits, lA, lB, lGap);
      const mp = minus.geometry.attributes.position; for (let i = 0; i < 8; i++) mp.setXYZ(i, -1.5 + i * .43, h + .5 + .45, .45); mp.needsUpdate = true; let up = 0;
      bits.forEach((b, i) => { const x = -3.2 + i * .7, g = h - .1, lift = g < reach; if (lift) up++; const j = Math.sin(T * 9 + i * 2) * .12; b.position.set(x, lift ? Math.min(h, .1 + (reach - g) * 1.6 + .25 + j + Math.max(0, reach - g) * .2) : .1, ((i * 3) % 5 - 2) * .3); b.rotation.z = lift ? j * 2 : 0; });
      lA.position.set(0, h + 1.9, 0); lA.set('Rubbed comb: minus charge', '#93c5fd'); lB.position.set(0, .9, 3); lB.set('Paper bits', '#e2e8f0'); lGap.position.set(5.4, h / 2 + .2, 0); lGap.set(up ? '' : 'Gap');
      P.fx = up ? up + ' bits jump up' : 'Nothing moves'; if (up > 5) P.jump = true;
    } else if (k[0] === 'n' && k[1] === '3') {                         // GRAVITY — Earth pulls every object down, both fall together
      const ph = T % 4.5; if (ph < dt * 1.5 || !st.x) { st.x = 7.5; st.v = 0; } if (ph < .6) st.y = 7.5; else { st.v += 9.8 * dt * .8; st.x = Math.max(.8, st.x - st.v * dt); } if (ph < .6) st.x = 7.5;
      const R2 = .55 + F * .17; ball.scale.setScalar(.7 * .9); ball2.scale.setScalar(R2 / .8); place(ball, -3.2, st.x); place(ball2, 3.2, Math.max(R2, st.x + R2 - .6)); show(ball, ball2, wA1, wA2, lA, lB, lC);
      const y1 = ball.position.y, y2 = ball2.position.y; wA1.to(-3.2, y1, -3.2, y1 - .6 - .45, 0); wA2.to(3.2, y2, 3.2, y2 - .5 - F * .5, 0);
      lA.position.set(0, 9.3, 0); lA.set('Earth pulls both down', '#86efac'); lB.position.set(-3.2, 1.9, 1.4); lB.set(''); lC.position.set(0, .1, 3.2); lC.set('Heavier ball: bigger pull, same fall', '#fde047');
      if (st.x < 1.2) P.fx = 'Both land together'; else P.fx = 'Falling'; P.grav = true;
    }
    // ── EFFECTS ────────────────────────────────────────────────────────────────────────────────────────────────
    else if (k === 'e1') {                                             // SHAPE — squeeze a sponge
      const ph = T % 5, s = (ph < 1 ? ph : ph < 3 ? 1 : ph < 4 ? 4 - ph : 0) * (F * .11 + .04), W = 2.4 * (1 - s); show(wall, sponge, hand, push, lA, lB);
      wall.position.set(5, 2.5, 0); sponge.scale.set(1 - s, 1 + s * .5, 1 + s * .5); place(sponge, 4.4 - W / 2, 1.2 * (1 + s * .5));
      const hx = 4.4 - W; hand.scale.x = 1; hand.position.set(hx, 1.3, 0); push.set(hx - 1.2 - N / 14, 1.3, N / 14, 1, 1.4); push.visible = ph < 3 && ph > .3;
      lA.position.set(0, 5.5, 0); lA.set(s > .05 ? 'Shape changed!' : 'Sponge: normal shape', s > .05 ? '#fde047' : '#e2e8f0'); lB.position.set(hx - 2, 2.9, 0); lB.set(N + ' N push', '#86efac'); P.fx = s > .05 ? 'Squashed ' + Math.round(s * 100) + '%' : 'Normal shape'; if (F === 5 && s > .4) P.big = true;
    } else if (k === 'e2') {                                           // DIRECTION — a push from the side bends the path (more force = bigger bend)
      const X0 = 6, v0 = 5, ph = T % 4.2, tt = ph; st.vy = F * .85; const x = -X0 + v0 * tt, hit = x >= 0; show(ball, trail, bat, push, lA, lB, lC);
      const bx = hit ? 0 + v0 * (tt - X0 / v0) : x, by = hit ? .8 + st.vy * (tt - X0 / v0) : .8; place(ball, bx, by + 0, 0); ball.scale.setScalar(1);
      for (let i = 0; i < 60; i++) { const u = i / 59 * Math.min(tt, 4.4), px = -X0 + v0 * u, hh = Math.max(0, u - X0 / v0); tp[i * 3] = px >= 0 ? v0 * hh : px; tp[i * 3 + 1] = (px >= 0 ? .8 + st.vy * hh : .8) + 0; tp[i * 3 + 2] = 0; if (u > tt) { tp[i * 3 + 1] = -99; } } trail.geometry.attributes.position.needsUpdate = true;
      bat.position.set(0, .35 + (ph > X0 / v0 - .25 && ph < X0 / v0 + .35 ? .9 : 0), 0); bat.rotation.z = 0; bat.scale.set(.5, 1, 1);
      const nowHit = ph > X0 / v0 - .1 && ph < X0 / v0 + .5; push.set(0, -.2, 0, 1, 0); push.visible = false; wA1.to(0, 0, 0, 1.4 + F * .4, 1); wA1.visible = nowHit; wA1.position.z = 0;
      lA.position.set(-4, 3, 0); lA.set('Ball goes straight', '#e2e8f0'); lB.position.set(4.5, 2.5 + st.vy * 1.2, 0); lB.set(hit ? 'Path bends ↑' : '', '#fde047'); lC.position.set(0, -.9, 2.5); lC.set('Push from below', '#86efac');
      P.fx = hit ? 'Direction changed ' + Math.round(Math.atan(st.vy / v0) * 57.3) + '°' : 'Straight line'; if (hit) P.bent = Math.max(P.bent || 0, F);
    } else {                                                           // START / SPEED UP / SLOW DOWN — a force changes how fast something moves
      const m = P.e, ph = T % 8, on = ph > 1 && ph < 2.4; if (ph < dt * 1.5 || !st.x) { st.x = m === 3 ? -2 : -6.5; st.v = m === 3 ? 0 : m === 4 ? 2 : 5.5; st.p = 0; st.stopped = false; }
      const dv = N / 14 * (on ? 1 : 0) * dt / 1.4; if (m === 5) st.v = Math.max(0, st.v - N / 6 * dt * (on ? 1 : 0) * 1.2 / 1.4 * 1); else st.v += dv * (m === 3 ? 2.2 : 1.6);
      if (m === 5 && st.v === 0) st.stopped = true; st.x += st.v * dt; if (st.x > 9) st.x = m === 3 ? 9 : -6.5;
      cart.position.set(st.x, 1.35, 0); wheel[0].position.set(st.x - 1, .45, 0); wheel[1].position.set(st.x + 1, .45, 0); show(cart, ...wheel, hand, push, lA, lB, lC);
      if (m === 5) { hand.scale.x = -1; hand.position.set(on ? st.x + 1.6 : 7, 1.35, 0); hand.position.x = on ? Math.max(st.x + 1.5, 2) : 7.5; push.set(on ? hand.position.x - 1.2 : 0, 1.35, N / 14, -1, 1.4); }
      else { hand.scale.x = 1; hand.position.set(on ? st.x - 1.5 : st.x - 1.5 - Math.min(2, Math.abs(ph - 1.7)), 1.35, 0); push.set(hand.position.x - 1.2 - N / 14, 1.35, N / 14, 1, 1.4); }
      push.visible = on; lA.position.set(st.x, 3.4, 0); lA.set(m === 3 ? 'At rest → moving' : m === 4 ? 'Gets faster' : 'Gets slower', '#fde047'); lB.position.set(st.x, 4.6, 0); lB.set('Speed ' + st.v.toFixed(1), '#e2e8f0');
      P.fx = m === 3 ? (st.v > .1 ? 'Starts moving' : 'At rest') : m === 4 ? (on ? 'Speeding up' : 'Faster now') : (st.v < .05 && T % 8 > 2 ? 'Stopped' : on ? 'Slowing down' : 'Slower'); P.spd = st.v;
      if (m === 3 && st.v > .5) P.started = true; if (m === 5 && st.v < .05 && T % 8 > 2) P.stoppedIt = true;
    }
  },
  ro: { Force: P => P.F_N + ' N', 'What happens': P => P.fx, Kind: P => P.m === 1 ? 'Contact force' : P.m === 2 ? 'Non-contact force' : 'Effect of a force' },
  status: P => P.m === 1 ? ['Touching', true] : P.m === 2 ? ['Not touching', true] : ['Force at work', true],
  note: P => P.m === 1 ? ['<b>Contact force:</b> the thing pushing or pulling must <b>touch</b> the object. More force → faster speed.', '<b>Contact force:</b> the hand is joined by the rope — still contact. Pull harder and the crate speeds up more.', '<b>Muscular force</b> must be bigger than the weight to lift. Below 30 N the crate stays on the ground.', '<b>Friction</b> is a contact force. The floor touches the crate and slows it.'][P.c - 1]
    : P.m === 2 ? [P.flip ? '<b>Same poles repel.</b> The magnet pushes the other one away without touching it.' : '<b>Unlike poles attract.</b> A stronger magnet pulls from farther away — with no touching.', '<b>Electrostatic force:</b> a rubbed comb pulls paper bits across a gap. Closer or stronger → more bits jump.', '<b>Gravity</b> is a non-contact force: Earth pulls every object down. Heavier ball: bigger pull — but both land together.'][P.n - 1]
    : ['<b>A force can change shape.</b> A bigger push squashes the sponge more.', '<b>A force can change direction.</b> The ball was going straight. A side push bends its path — more force, bigger bend.', '<b>A force can start motion.</b> The cart was at rest. A bigger push gives it more speed.', '<b>A force can speed things up.</b> The cart was already moving. A bigger push makes it faster.', '<b>A force can slow things down or stop them.</b> A big enough push against the motion stops the cart.'][P.e - 1],
  try: [{ t: 'In <b>Contact → Push</b>, raise the force. Does the crate go faster?', check: P => P.m === 1 && P.c === 1 && P.F >= 4, yes: 'Yes! More force, more speed.' },
    { t: 'In <b>Lift</b>, find the smallest force that lifts the crate (weight 30 N).', check: P => P.lifted && P.F === 4, yes: 'Yes! Muscle force must beat the weight.' },
    { t: 'In <b>Non-contact → Magnet</b>, make the magnet stronger. Does it pull from farther away?', check: P => P.pulled && P.F >= 4, yes: 'Yes! No touching is needed.' },
    { t: 'Switch on <b>Turn the magnet round</b>. What happens now?', check: P => P.repel, yes: 'Yes! Same poles push apart.' },
    { t: 'In <b>Effects → Shape</b>, use the <b>Very big</b> force.', check: P => P.big, yes: 'Yes! Big force, big change of shape.' }],
  key: ['A force is a <b>push or a pull</b>. Its unit is the <b>newton (N)</b>.', '<b>Contact forces</b> need touching: muscular force and friction.', '<b>Non-contact forces</b> work across a gap: magnetic, electrostatic and gravitational force.', 'A force can <b>change shape</b>, <b>change direction</b>, and <b>start, stop, speed up or slow down</b> motion.', 'More force → more effect.'],
  quiz: [{ q: 'Which is a NON-contact force?', o: ['Muscular force', 'Friction', 'Gravity'], a: 2, why: 'Gravity pulls without touching.' }, { q: 'What can a force NOT do?', o: ['Change the shape of an object', 'Change the direction of motion', 'Change the colour of a magnet'], a: 2, why: 'A force can change shape, direction and speed.' }, { q: 'A bigger push on a cart at rest gives…', o: ['less speed', 'more speed', 'no change'], a: 1, why: 'More force, more effect.' }]
};
