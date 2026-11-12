// scene.js — the 3D part. Sims import the helpers below (box, beam, label …); students rarely edit this file.
import * as THREE from 'three';
export { THREE };
export const D = Math.PI / 180;
const cv = document.getElementById('cv'), R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
export const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(45, 1, .1, 300);
const grad = (a, b) => { const g = document.createElement('canvas'); g.width = 2; g.height = 256; const x = g.getContext('2d'), q = x.createLinearGradient(0, 0, 0, 256);
  q.addColorStop(0, a); q.addColorStop(1, b); x.fillStyle = q; x.fillRect(0, 0, 2, 256); const t = new THREE.CanvasTexture(g); t.colorSpace = THREE.SRGBColorSpace; return t; };
const BG = { dark: grad('#1a2744', '#0a0f1d'), light: grad('#cfdcf5', '#f3f6fc') };
S.background = BG.dark;
S.add(new THREE.HemisphereLight(0xffffff, 0x334466, .95));
const dl = new THREE.DirectionalLight(0xffffff, .8); dl.position.set(5, 10, 6); S.add(dl);

// ── camera: drag = rotate, wheel = zoom. `fit` widens the view on tall/narrow stages (phones) so nothing is cut off.
let cam = { a: .6, e: .45, d: 16, t: new THREE.Vector3() }, drag = false, lx = 0, ly = 0, fit = 1;
cv.onpointerdown = e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); };
cv.onpointerup = cv.onpointercancel = () => drag = false;
cv.onpointermove = e => { if (!drag) return; cam.a -= (e.clientX - lx) * .008; cam.e = Math.max(.02, Math.min(1.5, cam.e + (e.clientY - ly) * .006)); lx = e.clientX; ly = e.clientY; };
cv.addEventListener('wheel', e => { cam.d = Math.max(5, Math.min(60, cam.d + e.deltaY * .02)); e.preventDefault(); }, { passive: false });
function resize() {
  const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; const a = w / h;
  R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setSize(w, h, false); C.aspect = a;
  const ref = cam.ref || 2, need = Math.atan(Math.tan(22.5 * D) * ref / Math.min(a, ref));   // sims are framed for a wide stage (cam.ref = that aspect, default 2)
  C.fov = Math.min(2 * need / D, 62); fit = Math.max(1, Math.tan(need) / Math.tan(C.fov / 2 * D)); C.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(cv);
const LABELS = [];
export const view = {
  set(c) { cam = { a: .6, e: .45, d: 16, t: new THREE.Vector3(), ...(c || {}) }; resize(); },
  theme(light) { S.background = light ? BG.light : BG.dark; },
  labels(on) { LABELS.forEach(l => l.visible = on); view.labelsOn = on; }, labelsOn: true,
  render() { const d = cam.d * fit; C.position.set(cam.t.x + d * Math.cos(cam.e) * Math.sin(cam.a), cam.t.y + d * Math.sin(cam.e), cam.t.z + d * Math.cos(cam.e) * Math.cos(cam.a)); C.lookAt(cam.t); sizeLabels(); R.render(S, C); },
  labelList: LABELS
};

// ── helpers used by sims
export const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .6, ...o });
export const add = o => (S.add(o), o);
export const box = (w, h, d, c) => add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)));
export const sph = (r, c) => add(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(c)));
export const line = (a, b, c) => add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color: c })));
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export function floor(w, d, y = 0) {            // returns the floor mesh so a sim can recolour it
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(0x1b2438)); f.rotation.x = -Math.PI / 2; f.position.y = y; S.add(f);
  const g = new THREE.GridHelper(w, w, 0x3a4a70, 0x2a3552); g.position.y = y + .01; S.add(g); return f;
}
// thick, always-visible ray (WebGL lines are 1px hairlines). m.set(a,b) re-aims it.
export function beam(color, w = .09) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(w, w, 1, 10), new THREE.MeshBasicMaterial({ color })), up = V(0, 1, 0), d = V(); S.add(m);
  m.set = (a, b) => { d.subVectors(b, a); const L = d.length() || 1e-4; m.position.copy(a).addScaledVector(d, .5); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(up, d.divideScalar(L)); return m; };
  return m;
}
// horizontal arrow with a solid head. g.set(x, y, length, direction = 1, z = 0)
export function arrow(color, w = .1) {
  const g = new THREE.Group(), mk = geo => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })), HL = w * 7;
  const sh = mk(new THREE.CylinderGeometry(w, w, 1, 10)), hd = mk(new THREE.ConeGeometry(w * 3, HL, 14)); g.add(sh, hd); S.add(g);
  g.set = (x, y, len, dir = 1, z = 0) => { const L = Math.max(.01, len), hl = Math.min(HL, L * .5);
    sh.scale.y = Math.max(.001, L - hl); sh.position.x = dir * (L - hl) / 2; hd.scale.y = hl / HL; hd.position.x = dir * (L - hl / 2);
    sh.rotation.z = hd.rotation.z = -dir * Math.PI / 2; g.position.set(x, y, z); g.visible = len > .05; };
  return g;
}
// arrow between any two points in the x–y plane. g.to(ax, ay, bx, by, z = 0)
export function arrowTo(color, w = .1) {
  const g = new THREE.Group(), mk = geo => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })), HL = w * 7;
  const sh = mk(new THREE.CylinderGeometry(w, w, 1, 10)), hd = mk(new THREE.ConeGeometry(w * 3, HL, 14)); g.add(sh, hd); S.add(g);
  g.to = (ax, ay, bx, by, z = 0) => { const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), hl = Math.min(HL, L * .5);
    sh.scale.y = Math.max(.001, L - hl); sh.position.y = (L - hl) / 2; hd.scale.y = hl / HL; hd.position.y = L - hl / 2;
    g.rotation.z = Math.atan2(dy, dx) - Math.PI / 2; g.position.set(ax, ay, z); g.visible = L > .05; };
  return g;
}
// a thick wire through a list of [x, y] points (one object)
export function wire(pts, color = 0x94a3b8, r = .08, z = 0) {
  const path = new THREE.CurvePath(); for (let i = 1; i < pts.length; i++) path.add(new THREE.LineCurve3(V(pts[i - 1][0], pts[i - 1][1], z), V(pts[i][0], pts[i][1], z)));
  return add(new THREE.Mesh(new THREE.TubeGeometry(path, pts.length * 12, r, 6, false), new THREE.MeshBasicMaterial({ color })));
}
// floating text that always faces the camera:  const t = label('Hi', '#fff');  t.set('new text', '#hex');  t.position.set(x, y, z)
// Its size follows the camera distance and the screen, but never drops below MIN_PX so it stays readable on a phone (see view.render).
const LW = 640, LH = 160, MIN_PX = 12, MAX_GROW = 5;           // canvas size (2× for sharp text) · smallest text height on screen · biggest boost
export function label(text = '', color = '#fff', scale = 1) {
  const c = document.createElement('canvas'); c.width = LW; c.height = LH; const x = c.getContext('2d'), t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.scale.set(5 * scale, 1.25 * scale, 1); s.renderOrder = 10; S.add(s); LABELS.push(s);
  s.sc = scale; s.fs = 40; s.tw = 0;                                // fs = text size on a 80 px tall label · tw = text width on a 320 px wide label
  let last = ''; s.set = (str, col = color) => { if (str + col === last) return; last = str + col; x.clearRect(0, 0, LW, LH);
    let fs = 80; x.font = `700 ${fs}px system-ui,sans-serif`; while (x.measureText(str).width > 592 && fs > 32) { fs -= 4; x.font = `700 ${fs}px system-ui,sans-serif`; }
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 16; x.lineJoin = 'round'; x.strokeStyle = 'rgba(8,12,24,.9)'; x.strokeText(str, LW / 2, 84); x.fillStyle = col; x.fillText(str, LW / 2, 84);
    s.fs = fs / 2; s.tw = x.measureText(str).width / 2; t.needsUpdate = true; };
  s.set(text); return s;
}
// keep every visible label at least MIN_PX tall on screen: px per world unit at the label's distance → text height in px → boost if too small
const lp = new THREE.Vector3();
function sizeLabels() {
  const w = cv.clientWidth || 1, h = cv.clientHeight || 1, min = Math.max(MIN_PX, Math.min(MIN_PX + 4, Math.min(w, h) * .03));   // 12 px on a 390 px phone, a little more on big screens
  for (const s of LABELS) { if (!s.visible) continue;
    const ppu = h / (2 * C.position.distanceTo(s.position) * Math.tan(C.fov * D / 2)), px = s.fs / 80 * 1.25 * s.sc * ppu, k = Math.min(MAX_GROW, Math.max(1, min / (px || 1)));
    s.scale.set(5 * s.sc * k, 1.25 * s.sc * k, 1); s.px = px * k; s.wpx = s.tw / 320 * 5 * s.sc * k * ppu;      // s.px = text height on screen · s.wpx = text width on screen
    lp.copy(s.position).project(C); const sx = (lp.x + 1) / 2 * w, over = Math.max(0, 4 - (sx - s.wpx / 2)) - Math.max(0, sx + s.wpx / 2 - (w - 4));   // slide the label back inside the screen if it sticks out
    s.center.x = .5 - over / (5 * s.sc * k * ppu); s.sx = sx + over; }
}
let ac;                                          // short tone (Web Audio) for the sound modules
export function beep(f, g = .1, dur = 1.2) {
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), n = ac.createGain(), t = ac.currentTime;
    o.frequency.value = f; n.gain.setValueAtTime(g, t); n.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(n).connect(ac.destination); o.start(); o.stop(t + dur); } catch (e) {}
}
