// Class 8 · Ch 12 Friction — pick a surface, add a lubricant (water, oil, powder, rollers) and push the block.
// The ZOOM panel shows what friction really is: the bumps of the two surfaces catching each other. A lubricant fills the gaps; rollers lift the block clear.
import { S, V, THREE, box, sph, floor, arrow, mat, label } from '../scene.js';
const NAME = ['Ice', 'Smooth floor', 'Wooden floor', 'Rough carpet'], MU = [.05, .2, .4, .7], COL = [0x9bd5f0, 0x4a5a7d, 0x8a5a2b, 0x8e3b46], AMP = [.07, .25, .55, 1];     // bump height in the zoom panel
const LUB = ['None', 'Water', 'Oil', 'Powder', 'Rollers'], LF = [1, .55, .3, .6, .08], FILL = [0, .7, 1.2, .45, 0], LCOL = [0, 0x38bdf8, 0xb45309, 0xf8fafc, 0], LOP = [0, .5, .6, .9, 0];
const PX = -3.7, PY = 6.2, PITCH = .5, NT = 15, PW = 7.4, X0 = -8, X1 = 10, Y0 = PY - 1.0;
let b, fl, aF, aR, lF, lR, lS, x, v, patch, powder, rol, rang, pan, low, up, lbase, ubase, fillm, balls, lz1, lz2, off, ph;
const strip = (down, col, n = NT) => { const s = new THREE.Shape(); s.moveTo(0, 0); for (let i = 0; i < n; i++) { s.lineTo((i + .5) * PITCH, down ? -1 : 1); s.lineTo((i + 1) * PITCH, 0); } s.lineTo(0, 0); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })); S.add(m); return m; };
const fx = (w, h, c, z = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, .06), new THREE.MeshBasicMaterial({ color: c })); m.position.z = z; S.add(m); return m; };
export default {
  title: 'Friction — Rough or Smooth?', cam: { d: 19, e: .3, a: .12, t: V(.6, 2.6, 0), ref: 1.2 }, head: 'Friction',
  sliders: [{ k: 'F', l: '💪 Your push', min: 0, max: 40, step: 2, v: 10, u: 'N' }, { k: 'l', l: '🛢 Lubricant', min: 1, max: 5, step: 1, v: 1, names: LUB, axis: true }, { k: 's', l: '🧱 Surface', min: 1, max: 4, step: 1, v: 3, names: NAME }],
  setup() {
    fl = floor(34, 10); b = box(2, 1.2, 2, 0xf59e0b); b.material.emissive = new THREE.Color(0); aF = arrow(0x22c55e, .13); aR = arrow(0xef4444, .13); lF = label('', '#4ade80', .9); lR = label('', '#f87171', .9); lS = label('', '#e2e8f0', 1);
    patch = new THREE.Mesh(new THREE.PlaneGeometry(26, 6), mat(0x38bdf8, { transparent: true, opacity: .5, roughness: .1, metalness: .3 })); patch.rotation.x = -Math.PI / 2; patch.position.set(1, .035, 0); S.add(patch);
    const pp = new Float32Array(420 * 3); for (let i = 0; i < 420; i++) { pp[i * 3] = -12 + Math.random() * 26; pp[i * 3 + 1] = .06 + Math.random() * .05; pp[i * 3 + 2] = (Math.random() - .5) * 5.6; }
    powder = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ color: 0xf8fafc, size: .22 })); S.add(powder);
    rol = [0, 1, 2, 3].map(() => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 2.2, 14), mat(0x94a3b8, { metalness: .5, roughness: .3 })); c.rotation.x = Math.PI / 2; S.add(c); return c; });
    // zoom panel
    pan = [fx(PW + 1.6, 4.6, 0x0b1424, -.12), fx(.8, 4.6, 0x475569, .08), fx(.8, 4.6, 0x475569, .08)]; pan[0].position.set(PX, PY, -.12); pan[1].position.set(PX - PW / 2 - .4, PY, .08); pan[2].position.set(PX + PW / 2 + .4, PY, .08);
    lbase = fx(PW, 1.2, 0x64748b); ubase = fx(PW, 1.2, 0xf59e0b); low = strip(false, 0x64748b); up = strip(true, 0xf59e0b, NT + 1); fillm = fx(PW, 1, 0x38bdf8, .02);
    balls = Array.from({ length: 5 }, () => { const s = new THREE.Mesh(new THREE.CircleGeometry(.4, 20), new THREE.MeshBasicMaterial({ color: 0xcbd5e1 })); S.add(s); return s; });
    lz1 = label('Zoom in: the bumps', '#fde047', .8); lz1.position.set(PX, PY + 2.8, 0); lz2 = label('', '#e2e8f0', .75); lz2.position.set(PX, PY - 2.8, 0);
  },
  reset() { x = X0; v = 0; off = 0; ph = 0; },
  step(dt, P) {
    const s = P.s - 1, l = P.l - 1, roll = l === 4, mu = MU[s] * LF[l], fst = mu * 40, fsl = roll ? fst : fst * .85;       // block 4 kg, g = 10 · sliding friction is a bit less than the most static friction can hold
    fl.material.color.set(COL[s]); P.go = P.F > fst;
    if (P.go) v += (P.F - fsl) / 4 * dt; else v = Math.max(0, v - fsl / 4 * dt);
    x += v * dt; if (x > X1) { x = X0; v = 0; } P.v = v; P.fmax = fst; P.mv = v > .05;
    P.fr = P.mv ? fsl : Math.min(P.F, fst); P.kind = roll ? 'Rolling' : P.mv ? 'Sliding' : 'Static';
    const by = roll ? 1.2 : .6; b.position.set(x, by, 0); P.heat = roll ? 0 : Math.min(1, v * P.fr / 70); b.material.emissive.setRGB(P.heat * .9, P.heat * .25, 0);
    rang = (rang || 0) + v * dt / .3; rol.forEach((r, i) => { r.visible = roll; r.position.set(x - 1.4 + i * .93, .3, 0); r.rotation.y = rang; });
    patch.visible = l >= 1 && l <= 2; patch.material.color.set(LCOL[l] || 0x38bdf8); patch.material.opacity = LOP[l] || 0; powder.visible = l === 3;
    const lp = P.F / 6, lf = P.fr / 6;
    aF.set(x - 1 - lp, by + 1.1, lp, 1); lF.position.set(x - 1 - lp / 2, by + 2.3, 0); lF.set(`Push ${P.F} N`);
    aR.set(x + 1, by - .25, lf, -1, 1.7); lR.position.set(x + 1 - lf / 2, by + .75, 1.7); lR.set(`Friction ${P.fr.toFixed(1)} N`);
    lS.position.set(4.9, 6.3, 0); lS.set(`${NAME[s]}${l ? ' + ' + LUB[l].toLowerCase() : ''}`);
    // ── zoom panel: two bumpy surfaces. Rough = tall interlocking bumps; lubricant fills the gaps; rollers lift the block clear.
    const a = AMP[s], pull = P.mv ? v : 0; off = (off + pull * dt * .5) % PITCH; ph += dt;
    low.position.set(PX - PW / 2, Y0, 0); low.scale.set(1, a, 1); lbase.position.set(PX, Y0 - .6, 0); lbase.material.color.set(COL[s]); low.material.color.set(COL[s]);
    const lift = roll ? 1.1 : 0, jig = P.mv && !roll ? Math.sin(ph * 38) * .035 * a * (1 + mu * 2) : 0, yb = Y0 + a + .04 + lift + jig;
    up.visible = !roll; up.scale.set(1, a, 1); up.position.set(PX - PW / 2 - PITCH * .5 + off, yb, 0); ubase.position.set(PX, yb + .6, 0); low.visible = true;
    fillm.visible = l >= 1 && l <= 3; fillm.material.color.set(LCOL[l] || 0x38bdf8); fillm.material.transparent = true; fillm.material.opacity = l === 3 ? .95 : .55; const fh = Math.max(.02, a * FILL[l]); fillm.scale.y = fh; fillm.position.set(PX, Y0 + fh / 2, .02);
    balls.forEach((o, i) => { o.visible = roll; o.position.set(PX - 2.8 + i * 1.4, Y0 + .4 + .02, .03); o.rotation.z = rang * .5; });
    const mk = a > .85 ? 'Big bumps catch hard' : a > .45 ? 'Bumps catch' : a > .15 ? 'Small bumps' : 'Almost no bumps';
    lz2.set(roll ? 'Rollers: surfaces do not touch' : l === 1 ? 'Water fills the gaps' : l === 2 ? 'Oil fills the gaps' : l === 3 ? 'Powder rolls between bumps' : mk, '#e2e8f0');
    if (l === 2 && s === 3 && P.go) P.oilWin = true; if (roll && P.go) P.rolled = true; if (P.s === 1 && !P.go && P.F === 0) P.iceSeen = true;
  },
  ro: { Friction: P => P.fr.toFixed(1) + ' N', 'Your push': P => P.F + ' N', 'Type of friction': P => P.kind, Heat: P => P.heat > .5 ? 'Hot!' : P.heat > .15 ? 'Warm' : 'None' },
  status: P => P.mv ? [P.kind + ' friction', true] : ['Stuck — friction holds', false, 'warn'],
  note: P => (P.l === 5 ? '<b>Rollers!</b> Rolling friction is far less than sliding. That is why wheels and ball bearings help.' : P.go ? '<b>It moves!</b> Your push is bigger than the friction.' : `<b>Not moving.</b> Friction holds the block until your push passes ${P.fmax.toFixed(1)} N.`)
    + (P.l === 3 ? ' Oil makes a slippery film, so the bumps cannot catch.' : P.l === 2 ? ' Water fills the gaps between bumps.' : P.l === 4 ? ' Powder acts like tiny rollers between the bumps.' : P.mv && P.heat > .3 ? ' Rubbing makes <b>heat</b> — feel your hands when you rub them!' : ''),
  try: [{ t: 'Put the surface on <b>Ice</b> and push with 4 N or more. What happens?', check: P => P.s === 1 && P.F >= 4 && P.go, yes: 'Yes! Ice has very little grip.' },
    { t: 'Switch to <b>Rough carpet</b>. Is the same push enough now?', check: P => P.s === 4 && P.F >= 4 && !P.go && P.l === 1, yes: 'Yes! Rough carpet grips hard.' },
    { t: 'On <b>Rough carpet</b> add <b>Oil</b>. Look at the zoom. Does the block move now?', check: P => P.oilWin, yes: 'Yes! Oil fills the bumps, so friction falls.' },
    { t: 'Try <b>Rollers</b> with a small push. How small can the push be?', check: P => P.rolled && P.F <= 4, yes: 'Yes! Rolling friction is tiny.' },
    { t: 'Push hard on <b>Rough carpet</b> with no lubricant. What do you notice about the heat?', check: P => P.s === 4 && P.heat > .3, yes: 'Yes! Friction makes heat.' }],
  key: ['Friction is a force that opposes things sliding on each other.', 'Surfaces look smooth but have tiny <b>bumps</b>. The bumps catch — that is friction.', 'Rough surfaces → <b>more</b> friction. Smooth surfaces → <b>less</b>.', '<b>Lubricants</b> (oil, grease, water, powder) fill the gaps and reduce friction.', '<b>Rolling friction</b> is much smaller than sliding friction — wheels and ball bearings.', 'Friction makes heat and wears parts. It is a <b>necessary evil</b>: we need it to walk and to brake.'],
  quiz: [{ q: 'Which surface gives the MOST friction?', o: ['Ice', 'Wooden floor', 'Rough carpet'], a: 2, why: 'Rougher surfaces have bigger bumps that catch more.' }, { q: 'Why do we oil the parts of a machine?', o: ['To make them heavier', 'To reduce friction', 'To increase friction'], a: 1, why: 'Oil fills the gaps between the bumps, so there is less friction and less wear.' }, { q: 'Which kind of friction is the smallest?', o: ['Sliding', 'Rolling', 'Static'], a: 1, why: 'Wheels and ball bearings roll instead of sliding.' }]
};
