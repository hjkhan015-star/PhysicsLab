// Class 8 · Ch 15 Some Natural Phenomena — rubbing makes charge; lightning is a giant spark.
import { S, V, box, sph, beam, mat, THREE, label } from '../scene.js';
const AMT = ['None', 'A little', 'Some', 'A lot', 'Very much'], CH = ['None', 'Low', 'Medium', 'High'], RATE = [0, .1, .17, .3, .5], CAP = [0, .3, 1, 1, 1];
const MINUS = [.38, .65, .98], PLUS = [.97, .44, .44], N = 60;                       // blue = minus charge, red = plus charge
let table, bA, bB, tA, tB, cloth, bits, dots, trunk, crown, house, rod, cloud, bolt, flash, lm, lp, lt, qs, Cs, ts, hit, t;
const bp = new Float32Array(N * 3), bc = new Float32Array(N * 3), tp = new Float32Array(12 * 3), tops = {};
const word = q => CH[q < .02 ? 0 : q < .4 ? 1 : q < .8 ? 2 : 3];
export default {
  title: 'Charge and Lightning', cam: { d: 20, e: .12, a: 0, t: V(0, 5.3, 0), ref: 1.3 },
  head: 'Charge',
  sliders: [{ k: 'm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Rub it', 'Thunderstorm'] },
    { k: 'r', l: '👋 Rubbing', min: 1, max: 5, step: 1, v: 3, names: AMT, axis: true, w: P => P.m === 1 },
    { k: 'c', l: '⛈ Cloud charge', min: 1, max: 5, step: 1, v: 4, names: AMT, axis: true, w: P => P.m === 2 }],
  toggles: [{ k: 'rod', l: 'Lightning rod', v: true, w: P => P.m === 2 }],
  setup() {
    table = box(14, .4, 5, 0x8a5a2b); cloth = box(2.6, .2, 1.8, 0xf59e0b);
    bA = sph(1.1, 0x60a5fa); bB = sph(1.1, 0xf472b6); tA = beam(0xcbd5e1, .03); tB = beam(0xcbd5e1, .03);
    bits = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(tp, 3)), new THREE.PointsMaterial({ color: 0xf8fafc, size: .35 })); S.add(bits);
    dots = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: .45, vertexColors: true }));
    dots.geometry.setAttribute('position', new THREE.BufferAttribute(bp, 3)); dots.geometry.setAttribute('color', new THREE.BufferAttribute(bc, 3)); S.add(dots);
    trunk = box(.6, 3, .6, 0x92400e); crown = sph(1.4, 0x16a34a); house = box(3.4, 3.6, 2.6, 0xe2e8f0); rod = box(.14, 2.4, .14, 0x94a3b8); cloud = box(11, 1.8, 3.2, 0x64748b);
    bolt = [0, 1, 2, 3, 4].map(() => { const b = beam(0xfde047, .13); b.visible = false; return b; }); flash = new THREE.PointLight(0xfff3b0, 0, 60); flash.position.set(0, 8, 6); S.add(flash);
    lm = label('minus', '#93c5fd', .9); lp = label('plus', '#fca5a5', .9); lt = label('Thunder!', '#fde047', 1.2); lt.position.set(0, 7.2, 0);
  },
  reset() { qs = 0; Cs = 0; ts = 9; hit = 'rod'; t = 0; },
  step(dt, P) {
    const A = P.m === 1; t += dt; ts += dt;
    [cloth, bA, bB, tA, tB, bits].forEach(o => o.visible = A); [trunk, crown, house, cloud].forEach(o => o.visible = !A); rod.visible = !A && P.rod;
    table.scale.set(A ? 1 : 1.7, 1, A ? 1 : 1.3); table.material.color.set(A ? 0x8a5a2b : 0x3f6b3a); table.position.set(0, A ? 2.4 : 0, 0);
    let n = 0;
    const dot = (x, y, z, c) => { if (n < N) { bp.set([x, y, z], n * 3); bc.set(c, n * 3); n++; } };
    if (A) {
      const q = P.r - 1; qs += (q / 4 - qs) * Math.min(1, dt * 1.5); P.q = qs;                                  // charge builds up while we rub
      const th = qs * .5, L = 3.4;
      bA.position.set(-1.2 - L * Math.sin(th), 9 - L * Math.cos(th), 0); bB.position.set(1.2 + L * Math.sin(th), 9 - L * Math.cos(th), 0);
      tA.set(V(-1.2, 9, 0), bA.position); tB.set(V(1.2, 9, 0), bB.position); cloth.position.set(5, 2.7, 0); cloth.rotation.z = 0;
      for (let k = 0; k < Math.round(qs * 8); k++) { const a = k * 2.4 + t * .4; dot(bA.position.x + Math.cos(a) * 1.15, bA.position.y + Math.sin(a) * 1.15, 0, MINUS); dot(bB.position.x + Math.cos(a + 1) * 1.15, bB.position.y + Math.sin(a + 1) * 1.15, 0, MINUS); }
      for (let k = 0; k < Math.round(qs * 6); k++) dot(4 + (k % 4) * .7, 2.9, (k >> 2) * .5 - .3, PLUS);
      for (let i = 0; i < 12; i++) { const lift = qs > .45 ? Math.max(0, Math.sin(t * 3 + i)) * 1.1 * Math.min(1, (qs - .45) * 2.2) : 0; tp.set([-2.6 + i * .48, 2.75 + lift, ((i * 5) % 3 - 1) * .5], i * 3); }
      bits.geometry.attributes.position.needsUpdate = true;
      lm.position.set(0, 10.6, 0); lm.set('Balloons: minus charge'); lp.position.set(5, 3.8, 0); lp.set('Cloth: plus charge'); lt.set(''); P.pull = qs > .45;
    } else {
      const lv = P.c - 1, cap = CAP[lv]; hit = P.rod ? 'rod' : 'tree';
      if (Cs < cap) Cs = Math.min(cap, Cs + RATE[lv] * dt); if (cap < 1 && Cs > cap) Cs = cap;
      if (Cs >= 1) { Cs = 0; ts = 0; }                                                                            // discharge → spark
      P.q = Cs; cloud.position.set(0, 10.5, 0); cloud.material.color.set(0x64748b); trunk.position.set(-4.8, 1.7, 0); crown.position.set(-4.8, 4.4, 0); house.position.set(3.6, 2.2, 0); rod.position.set(3.6, 5.2, 0);
      for (let k = 0; k < Math.round(Cs * 18); k++) dot(-4.5 + (k % 9) * 1.1, 9.4, ((k / 9 | 0) - .5) * 1.2, MINUS);
      const tx = hit === 'rod' ? 3.6 : -4.8, ty = hit === 'rod' ? 6.4 : 5.8;
      for (let k = 0; k < Math.round(Cs * 8); k++) dot(tx + ((k % 3) - 1) * .5, ty + .3 + (k >> 2) * .4, 0, PLUS);
      const on = ts < .35; bolt.forEach((b, i) => { b.visible = on; if (on) { const f = i / 5, g = (i + 1) / 5, j = k => (k === 0 || k === 5 ? 0 : (Math.sin(k * 9.3 + Math.floor(t * 0) + tx) * .9));
        b.set(V(tx * (1 - f) * .3 + tx * f + j(i), 9.6 + (ty - 9.6) * f, 0), V(tx * (1 - g) * .3 + tx * g + j(i + 1), 9.6 + (ty - 9.6) * g, 0)); } });
      if (Cs === 0 && ts < .05 && hit === 'tree') P.treeHit = true;
      flash.intensity = on ? 3 * (1 - ts / .35) : 0; lt.set(ts > .5 && ts < 1.5 ? 'Thunder!' : ''); P.spark = on;
      lm.position.set(-6.5, 10.9, 0); lm.set('minus charge'); lp.position.set(tx, 7.4, 0); lp.set(Cs > .05 ? 'plus charge' : '');
    }
    dots.geometry.setDrawRange(0, n); dots.geometry.attributes.position.needsUpdate = true; dots.geometry.attributes.color.needsUpdate = true;
  },
  ro: { Charge: P => word(P.q) },
  status: P => P.m === 2 ? (P.spark ? ['Sparks!', true] : ['Charging', false, 'warn']) : P.pull ? ['Paper jumps', true] : ['No pull', false, 'warn'],
  note: P => P.m === 1 ? (P.q < .45 ? 'Rubbing moves minus charge to the balloons. Rub more to make a strong charge.' : 'Both balloons have minus charge, so they push apart. Paper bits jump up to them.')
    : P.c < 3 ? 'The cloud has little charge. No spark can jump yet.' : `The cloud keeps gaining charge. A big spark jumps to the ${hit === 'rod' ? 'rod on the house' : 'tall tree'}.`,
  try: [{ t: 'In <b>Rub it</b>, set <b>Rubbing</b> to <b>Very much</b>. What do the balloons do?', check: P => P.m === 1 && P.r === 5, yes: 'Yes! Same charges push apart.' },
    { t: 'Rub only <b>A little</b>. Do the paper bits jump?', check: P => P.m === 1 && P.r === 2 && !P.pull, yes: 'Yes! Too little charge to lift paper.' },
    { t: 'In <b>Thunderstorm</b>, turn the rod off. Where does the spark go?', check: P => P.treeHit, yes: 'Yes! With no rod, the tree is hit.' }],
  key: ['Rubbing moves minus charge. Like charges push apart; unlike charges pull together.', 'In a storm, go indoors. Never stand under a tall tree.', 'Stay away from water, wires and metal poles in a storm.', 'A lightning rod carries the spark safely to the ground.'],
  quiz: [{ q: 'Two balloons with the same charge will…', o: ['pull together', 'push apart', 'do nothing'], a: 1, why: 'Like charges push apart.' }, { q: 'Where is it safest in a thunderstorm?', o: ['Under a tall tree', 'Inside a house', 'In open water'], a: 1, why: 'A house keeps you away from the strike.' }]
};
