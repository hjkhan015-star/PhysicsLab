// kit.js — Physics Lab shared runtime: 3D scene, helpers, slider UI, sim loop.
import * as THREE from 'three';
export { THREE };
export const D = Math.PI / 180;
const $ = id => document.getElementById(id);
const cv = $('cv'), R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
export const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(45, 1, .1, 300);
S.background = new THREE.Color(0x0d1320);
S.add(new THREE.HemisphereLight(0xffffff, 0x334466, .9));
const dl = new THREE.DirectionalLight(0xffffff, .8); dl.position.set(5, 10, 6); S.add(dl);

// orbit camera (drag to rotate, wheel/pinch-less zoom)
let cam = { a: .6, e: .45, d: 16, t: new THREE.Vector3() }, drag = false, lx = 0, ly = 0;
cv.onpointerdown = e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); };
cv.onpointerup = () => drag = false;
cv.onpointermove = e => { if (!drag) return; cam.a -= (e.clientX - lx) * .008; cam.e = Math.max(.05, Math.min(1.5, cam.e + (e.clientY - ly) * .006)); lx = e.clientX; ly = e.clientY; };
cv.addEventListener('wheel', e => { cam.d = Math.max(5, Math.min(60, cam.d + e.deltaY * .02)); e.preventDefault(); }, { passive: false });
function size() { const w = cv.clientWidth, h = cv.clientHeight; R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); }
addEventListener('resize', size);

// helpers used by sims
export const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .6, ...o });
export const add = o => (S.add(o), o);
export const box = (w, h, d, c) => add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)));
export const sph = (r, c) => add(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(c)));
export const line = (a, b, c) => add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color: c })));
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export function floor(w, d, y = 0) {
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(0x1b2438)); f.rotation.x = -Math.PI / 2; f.position.y = y; S.add(f);
  const g = new THREE.GridHelper(w, w, 0x3a4a70, 0x2a3552); g.position.y = y + .01; S.add(g);
}

// run a simulation config
export function run(cfg) {
  $('ttl').textContent = cfg.title; document.title = cfg.title + ' · Physics Lab';
  const P = {};
  $('ctl').innerHTML = cfg.sliders.map(s => `<label>${s.l}<b id="v_${s.k}"></b></label><input type="range" id="i_${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.v}">`).join('') + '<button class="btn" id="go">▶ Run / Reset</button>';
  cfg.sliders.forEach(s => { const el = $('i_' + s.k), f = () => { P[s.k] = +el.value; $('v_' + s.k).textContent = el.value + ' ' + s.u; }; el.oninput = f; f(); });
  $('ro').innerHTML = Object.keys(cfg.ro).map((k, i) => `<div>${k}: <b id="r${i}">–</b></div>`).join('');
  cfg.setup(P); cfg.reset(P); $('go').onclick = () => cfg.reset(P);
  cam = { a: .6, e: .45, d: 16, t: V(), ...(cfg.cam || {}) }; size();
  const clock = new THREE.Clock(), keys = Object.keys(cfg.ro);
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05); cfg.step(dt, P);
    keys.forEach((k, i) => $('r' + i).textContent = cfg.ro[k](P));
    $('note').innerHTML = cfg.note(P);
    C.position.set(cam.t.x + cam.d * Math.cos(cam.e) * Math.sin(cam.a), cam.t.y + cam.d * Math.sin(cam.e), cam.t.z + cam.d * Math.cos(cam.e) * Math.cos(cam.a));
    C.lookAt(cam.t); R.render(S, C);
  })();
}
