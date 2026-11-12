// optics.js — pure optics formulas for the Class 10 light sims (no 3D, no page). New Cartesian sign convention, as in the SEBA book:
// the pole P (mirror) or optical centre O (lens) is the origin · the light travels in the +x direction · distances along the light are +, against it −
// · heights above the axis are +, below are −.  Object distance u is always negative.  Concave mirror f < 0, convex mirror f > 0, convex lens f > 0, concave lens f < 0.
export const mirrorV = (u, f) => Math.abs(1 / f - 1 / u) < 1e-9 ? Infinity : 1 / (1 / f - 1 / u);          // 1/v + 1/u = 1/f
export const lensV = (u, f) => Math.abs(1 / f + 1 / u) < 1e-9 ? Infinity : 1 / (1 / f + 1 / u);            // 1/v − 1/u = 1/f
export const magMirror = (u, v) => -v / u;                                                                  // m = −v/u
export const magLens = (u, v) => v / u;                                                                     // m = v/u
export const power = fCm => 100 / fCm;                                                                       // P = 1/f, f in metres → dioptre
// describe the image in words. kind: 'mirror' | 'lens'
export function image(kind, u, f) {
  const v = kind === 'mirror' ? mirrorV(u, f) : lensV(u, f), inf = !isFinite(v), m = inf ? Infinity : kind === 'mirror' ? magMirror(u, v) : magLens(u, v);
  const real = inf ? true : kind === 'mirror' ? v < 0 : v > 0, erect = inf ? false : m > 0, a = Math.abs(m), size = inf ? 'Very large' : a > 1.02 ? 'Enlarged' : a < .98 ? 'Diminished' : 'Same size';
  return { v, m, inf, real, erect, size, text: inf ? 'At infinity' : `${real ? 'Real' : 'Virtual'}, ${erect ? 'erect' : 'inverted'}, ${size.toLowerCase()}` };
}
// the three principal rays. Each ray = { p0: start, p1: point on the mirror/lens, p2: end of the solid outgoing ray, v: where the dashed back-extension goes (or null) }.
// Points are [x, y] in cm. xEdge = how far the outgoing rays are drawn when they never meet (diverging). A ray that cannot be drawn (object at F …) is left out.
export function rays(kind, u, f, h0, xEdge = 70) {
  const mir = kind === 'mirror', im = image(kind, u, f), tip = [u, h0], out = [], realImg = !im.inf && (mir ? im.v < 0 : im.v > 0) && Math.abs(im.v) <= xEdge;
  const end = (p1, d) => { const t = xEdge / Math.max(1e-9, Math.abs(d[0])); return [p1[0] + d[0] * t, p1[1] + d[1] * t]; };
  const mk = (y, d) => { const p1 = [0, y]; return { p0: tip, p1, p2: realImg ? [im.v, im.m * h0] : end(p1, d), v: !im.inf && !(mir ? im.v < 0 : im.v > 0) ? [im.v, im.m * h0] : null }; };
  if (mir) {
    out.push(mk(h0, f < 0 ? [f, -h0] : [-f, h0]));                                                              // 1: parallel to axis → through F (or seems to come from F)
    if (Math.abs(f - u) > 1e-6) out.push(mk(h0 * f / (f - u), [-1, 0]));                                        // 2: through F (or toward F) → parallel to axis
    if (Math.abs(2 * f - u) > 1e-6) { const y3 = h0 * 2 * f / (2 * f - u); out.push(mk(y3, [u, h0 - y3])); }  // 3: through C → back along itself
  } else {
    out.push(mk(h0, f > 0 ? [f, -h0] : [-f, h0]));                                                              // 1: parallel to axis → through F2 (or seems to come from F1)
    out.push(mk(0, [-u, -h0]));                                                                                 // 2: through the optical centre → straight on
    if (Math.abs(f + u) > 1e-6) out.push(mk(h0 * f / (f + u), [1, 0]));                                         // 3: through F1 → parallel to axis
  }
  return out;
}
// a lens with a very distant object: parallel rays at heights ±h come to the focus (or seem to come from it)
export function farRays(f, h, xEdge = 60) {
  return [h, -h].map(y => { const d = f > 0 ? [f, -y] : [-f, y], p1 = [0, y], t = f > 0 ? 1 : xEdge / Math.max(1e-6, d[0]); return { p0: [-70, y], p1, p2: f > 0 ? [f, 0] : [d[0] * t, y + d[1] * t], v: f > 0 ? null : [f, 0] }; });
}
// the glass prism: refraction at two faces (apex angle A, refractive index n). All angles in degrees. Returns null when the ray cannot leave (total internal reflection).
export function prism(i, A, n) {
  const R = Math.PI / 180, r1 = Math.asin(Math.sin(i * R) / n) / R, r2 = A - r1, s = n * Math.sin(r2 * R); if (s > 1) return null;
  const e = Math.asin(s) / R; return { r1, r2, e, d: i + e - A };
}
export const minDeviation = (A, n) => 2 * Math.asin(n * Math.sin(A * Math.PI / 360)) * 180 / Math.PI - A;
export const minDevAngle = (A, n) => Math.asin(n * Math.sin(A * Math.PI / 360)) * 180 / Math.PI;                 // the angle of incidence that gives the minimum deviation
