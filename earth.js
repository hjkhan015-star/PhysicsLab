// earth.js — shared by stars8, eclipse8, satellites8, scale8. A crude world map drawn in code (no image files, works offline) + a "lit sphere" material.
// Not to scale / not exact: continents are rough outlines of [longitude, latitude] points, good enough to recognise India, Africa, Australia…
import { THREE, D, S, V } from './scene.js';
export const LAND = [
  [[-168, 66], [-140, 70], [-95, 72], [-80, 68], [-62, 58], [-55, 50], [-68, 44], [-76, 35], [-81, 25], [-97, 26], [-97, 18], [-88, 15], [-80, 8], [-105, 20], [-117, 32], [-124, 42], [-125, 50], [-140, 60], [-168, 66]],   // North America
  [[-80, 8], [-60, 10], [-50, 0], [-35, -7], [-40, -22], [-58, -38], [-68, -54], [-74, -45], [-71, -20], [-81, -5], [-80, 8]],                                                                                          // South America
  [[-10, 36], [10, 37], [32, 31], [43, 12], [51, 11], [40, -10], [33, -26], [20, -35], [12, -18], [9, 4], [-8, 5], [-17, 15], [-10, 36]],                                                                               // Africa
  [[-10, 36], [-9, 43], [2, 51], [8, 58], [30, 70], [60, 70], [100, 77], [140, 72], [180, 68], [170, 60], [142, 52], [130, 42], [122, 30], [110, 20], [106, 10], [100, 2], [98, 16], [92, 22], [88, 22], [80, 14], [77, 8], [72, 20], [66, 25], [57, 25], [50, 30], [43, 12], [35, 30], [28, 40], [14, 41], [3, 43], [-10, 36]],         // Europe + Asia (India = the pointed part at 77°E, 8°N)
  [[114, -22], [131, -12], [142, -11], [153, -26], [146, -39], [135, -34], [115, -34], [114, -22]],                                                                                                                     // Australia
  [[-180, -70], [-120, -74], [-60, -66], [0, -70], [60, -68], [120, -66], [180, -70], [180, -90], [-180, -90], [-180, -70]],                                                                                            // Antarctica
  [[-55, 60], [-30, 70], [-20, 82], [-60, 82], [-72, 76], [-55, 60]]                                                                                                                                                    // Greenland
];
// draw the map into a canvas (x = longitude −180…180, y = latitude 90…−90)
export function mapCanvas(w = 512, h = 256, sea = '#1d4ed8', land = '#22a755', ice = '#e8f1f8') {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = sea; x.fillRect(0, 0, w, h);
  LAND.forEach((p, k) => { x.fillStyle = k === 5 || k === 6 ? ice : land; x.beginPath(); p.forEach(([lo, la], i) => { const X = (lo + 180) / 360 * w, Y = (90 - la) / 180 * h; i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.closePath(); x.fill(); });
  return c;
}
export const earthTex = () => { const t = new THREE.CanvasTexture(mapCanvas()); t.colorSpace = THREE.SRGBColorSpace; return t; };
// A sphere that is bright on the side facing the Sun and dark on the other side (a hard, clear day/night line).
// m = litMat({ map | color, ambient }); m.uniforms.sun.value = a THREE.Vector3 pointing from the sphere TOWARD the Sun (world space).
// m.uniforms.tint (Vector3 colour multiplier) lets eclipse8 turn the Moon red; m.uniforms.dim (0–1) darkens it.
export function litMat({ map = null, color = 0xffffff, ambient = .1, soft = .06 } = {}) {
  const m = new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, hasMap: { value: map ? 1 : 0 }, col: { value: new THREE.Color(color) }, sun: { value: new THREE.Vector3(1, 0, 0) }, amb: { value: ambient }, soft: { value: soft }, tint: { value: new THREE.Vector3(1, 1, 1) }, dim: { value: 1 } },
    vertexShader: 'varying vec3 vN; varying vec2 vU; void main(){ vN = normalize(mat3(modelMatrix) * normal); vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D map; uniform float hasMap; uniform vec3 col; uniform vec3 sun; uniform float amb; uniform float soft; uniform vec3 tint; uniform float dim; varying vec3 vN; varying vec2 vU;\n' +
      'void main(){ vec3 base = hasMap > .5 ? texture2D(map, vU).rgb : col; float d = dot(normalize(vN), normalize(sun)); float k = smoothstep(-soft, soft + .04, d); vec3 c = base * (amb + (1.0 - amb) * k) * tint * dim; gl_FragColor = vec4(c, 1.0);\n' +
      '#include <colorspace_fragment>\n}'
  });
  return m;
}
// a point on a unit sphere that uses the map above (lon, lat in degrees; local coordinates of a SphereGeometry): ll(92, 26, 3) is Assam on an Earth of radius 3
export const ll = (lo, la, r = 1) => { const u = (lo + 180) * D, t = (90 - la) * D; return new THREE.Vector3(-r * Math.cos(u) * Math.sin(t), r * Math.cos(t), r * Math.sin(u) * Math.sin(t)); };

export function frus(col, op) {                     // a see-through cone/shadow: a ring at p0 (radius r0) joined to a ring at p1 (radius r1). m.set(p0, r0, p1, r1)
  const N = 28, g = new THREE.BufferGeometry(), pos = new Float32Array(2 * N * 3), idx = []; for (let i = 0; i < N; i++) { const j = (i + 1) % N; idx.push(i, j, N + i, j, N + j, N + i); }
  g.setIndex(idx); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, side: THREE.DoubleSide, depthWrite: false })); m.frustumCulled = false; m.renderOrder = 3; S.add(m);
  const ax = V(), e1 = V(), e2 = V(); m.set = (p0, r0, p1, r1) => { ax.subVectors(p1, p0).normalize(); e1.crossVectors(ax, Math.abs(ax.y) < .9 ? V(0, 1, 0) : V(1, 0, 0)).normalize(); e2.crossVectors(ax, e1);
    for (let i = 0; i < N; i++) { const a = i / N * 6.2832, c = Math.cos(a), s = Math.sin(a); for (let k = 0; k < 2; k++) { const p = k ? p1 : p0, r = k ? r1 : r0; pos[(k * N + i) * 3] = p.x + (e1.x * c + e2.x * s) * r; pos[(k * N + i) * 3 + 1] = p.y + (e1.y * c + e2.y * s) * r; pos[(k * N + i) * 3 + 2] = p.z + (e1.z * c + e2.z * s) * r; } } g.attributes.position.needsUpdate = true; return m; };
  return m;
}
