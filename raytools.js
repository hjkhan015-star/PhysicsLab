// raytools.js — small drawing helpers shared by the Class 10 light sims (mirrors, lenses): arrowheads, dotted lines, real-looking objects.
import { S, V, beam, THREE } from './scene.js';
export const head = col => { const h = new THREE.Mesh(new THREE.ConeGeometry(.2, .55, 12), new THREE.MeshBasicMaterial({ color: col })); h.renderOrder = 5; S.add(h); return h; };
export function placeHead(h, A, B, atEnd) {                                // arrowhead on the segment A→B, a little before B (atEnd) or a little after A
  const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1, d = Math.min(2.2, len * .45), p = atEnd ? [B[0] - dx / len * d, B[1] - dy / len * d] : [A[0] + dx / len * d, A[1] + dy / len * d];
  h.position.set(p[0], p[1], .1); h.rotation.z = Math.atan2(dy, dx) - Math.PI / 2; }
export function dotted(col, w = .045) {                                    // a dotted line made of short dashes; points are [x, y] in scene units
  const bs = Array.from({ length: 36 }, () => beam(col, w));
  return { set(a, b, c) { const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, n = Math.min(36, Math.floor(len / .5)); bs.forEach((s, k) => { s.visible = k < n; if (k < n) { if (c !== undefined) s.material.color.set(c); const t0 = k * .5 / len, t1 = Math.min(1, (k * .5 + .28) / len); s.set(V(a[0] + dx * t0, a[1] + dy * t0), V(a[0] + dx * t1, a[1] + dy * t1)); } }); }, hide() { bs.forEach(s => s.visible = false); } };
}
// real-looking objects, 1 unit tall, standing on the axis at the group's origin. kind: 0 arrow · 1 candle · 2 tree.  g.setM(m, k): height m×k (negative m = upside down), width |m|×k.  g.setA(a): opacity.
export function mkObj(kind, tint = 0xe2e8f0) {
  const g = new THREE.Group(), mats = [], add = (geo, col, y) => { const m = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true }); mats.push(m); const o = new THREE.Mesh(geo, m); o.position.y = y; g.add(o); };
  if (kind === 0) { add(new THREE.CylinderGeometry(.05, .05, .75, 8), tint, .375); add(new THREE.ConeGeometry(.16, .25, 12), tint, .875); }
  else if (kind === 1) { add(new THREE.CylinderGeometry(.13, .13, .72, 16), 0xfde68a, .36); add(new THREE.ConeGeometry(.1, .28, 12), 0xfb923c, .86); add(new THREE.ConeGeometry(.05, .14, 10), 0xfef08a, .84); }
  else { add(new THREE.CylinderGeometry(.07, .07, .3, 8), 0x92400e, .15); add(new THREE.ConeGeometry(.36, .5, 14), 0x16a34a, .52); add(new THREE.ConeGeometry(.26, .42, 14), 0x22c55e, .8); }
  g.setM = (m, k) => g.scale.set(Math.abs(m) * k, m * k, Math.abs(m) * k); g.setA = a => mats.forEach(x => x.opacity = a); g.setTop = t => { mats.forEach(x => x.depthTest = !t); g.children.forEach(o => o.renderOrder = t ? 6 : 0); }; S.add(g); return g;     // setTop(true): draw over the mirror (a virtual image sits behind it)
}
