// Class 10 · Ch 11 Human Eye and the Colourful World — scattering of light: blue sky, red Sun at sunrise/sunset, Tyndall effect.
import { S, V, box, sph, label, arrowTo, beam, mat } from '../scene.js';
const KS = [[1, 2.62, 5.85], [1, 1.3, 1.6], [1, 1, 1]], STR = [.12, .2, .35], PN = ['Air molecules', 'Fine dust', 'Large droplets'], H = 3.2;   // KS: scattering of red, green, blue (small particles scatter blue most: ∝ 1/λ⁴)
let sun, ray, sky, arrows = [], ls, lsky, ob;
const cl = c => Math.max(0, Math.min(1, c));
const calc = P => { const el = P.el * Math.PI / 180, m = 1 / Math.sin(el), k = KS[P.p - 1], a = STR[P.p - 1];
  const T = k.map(c => Math.exp(-a * m * c)), mx = Math.max(...T), sc = k.map((c, i) => c * Math.exp(-a * m * c * .5)), ms = Math.max(...sc); return { el, m, T, mx, sunc: T.map(t => t / mx), sky: sc.map(t => t / ms) }; };
const name = (c, bright) => { const [r, g, b] = c; if (bright && Math.abs(r - b) < .12 && Math.abs(r - g) < .12) return 'White / grey'; if (b > r && b >= g * .95) return 'Blue'; if (g / r > .85) return 'Yellow-white'; if (g / r > .45) return 'Orange'; return 'Red'; };
export default {
  title: 'Scattering of Light — Blue Sky and Red Sunset', cam: { d: 22, e: .02, a: 0, t: V(0, 3.5, 0), ref: 1.6 },
  head: 'Sky colour',
  sliders: [{ k: 'el', l: 'Sun height', min: 5, max: 90, step: 5, v: 90, u: '°' }, { k: 'p', l: 'Particles', min: 1, max: 3, step: 1, v: 1, names: PN }],
  setup() {
    sky = box(80, 44, .2, 0x3b82f6); sky.position.set(0, 20, -3); const g = box(36, .6, 8, 0x14532d); g.position.set(0, -.3, 0);
    const air = box(30, H, 5, 0xbfdbfe); air.material = mat(0xbfdbfe, { transparent: true, opacity: .13 }); air.position.set(0, H / 2, 0);
    sun = sph(1, 0xfde047); ray = beam(0xfde047, .13); ob = box(.7, 1.6, .5, 0xf1f5f9); ob.position.set(5, .8, 0);
    for (let i = 0; i < 6; i++) arrows.push(arrowTo(0x60a5fa, .07));
    ls = label('Sun', '#fde047', 1.1); lsky = label('Atmosphere', '#bfdbfe', 1); lsky.position.set(-9, H + .9, 0); label('Observer', '#e2e8f0', 1).position.set(5, -1.4, 0);
  },
  reset() {},
  step(dt, P) {
    const c = calc(P); P.c = c; const sx = 5 - 13 * Math.cos(c.el), sy = 13 * Math.sin(c.el);
    const bright = Math.max(.35, c.mx > .5 ? 1 : c.mx * 2); const sc = c.sunc.map(t => cl(t) * bright + (1 - bright) * .2);
    sun.position.set(sx, sy, 0); sun.material.color.setRGB(sc[0], sc[1] * .95, sc[2] * .8 + c.sunc[2] * .2); ls.position.set(sx, sy + 1.9, 0);
    ray.set(V(sx, sy, 0), V(5, 1.6, 0)); ray.material.color.setRGB(cl(c.sunc[0]), cl(c.sunc[1] * .95), cl(c.sunc[2] * .85));
    const day = Math.min(1, P.el / 25), skyk = .35 + .65 * day;                    // sky is dark when the Sun is very low
    sky.material.color.setRGB(c.sky[0] * skyk * .85, c.sky[1] * skyk * .85, c.sky[2] * skyk * .85);
    const s = Math.sin(c.el), co = Math.cos(c.el), inLen = Math.min(H / s, 17);    // path length inside the air layer
    arrows.forEach((a, i) => { const t = (i + .5) / 6, px = 5 - co * inLen * t, py = 1.6 + s * inLen * t - (1.6 * t * 0), len = 1.1 + .6 * (1 - t);
      a.to(px, Math.min(py, H - .1), px + (i % 2 ? 1.1 : -1.1) * len * .8, Math.min(py, H - .1) + len * .6, .6);
      a.children.forEach(m => m.material.color.setRGB(c.sky[0], c.sky[1], c.sky[2])); });
  },
  ro: { 'Sky colour': P => name(P.c.sky, true), 'Sun colour': P => name(P.c.sunc, false), 'Path in air': P => P.c.m.toFixed(1) + '× the noon path', 'Sunlight left': P => Math.round(P.c.mx * 100) + '%' },
  status: P => P.p === 3 ? ['Tyndall effect: all colours scatter', true] : P.el <= 15 ? ['Long path: blue scattered away', true, 'warn'] : ['Short path', true],
  note: P => P.p === 3 ? 'Large droplets scatter <b>all colours</b> about equally, so clouds and mist look <b>white</b>. A beam of light becomes visible in mist or dust: the <b>Tyndall effect</b>.' : P.el <= 15 ? 'The Sun is low, so its light travels a <b>long path</b> through the air. Most blue light is scattered away. The red light that is left reaches us: <b>red Sun</b> at sunrise and sunset.' : 'Tiny air molecules scatter <b>blue</b> light much more than red. The scattered blue reaches our eyes from every side: the <b>sky looks blue</b>.',
  try: ['Keep Air molecules. Lower the Sun from 90° to 5°. How do the Sun and sky colours change?', 'Set the Sun to 90° and change Particles to Large droplets. What colour is the sky now?', 'Why is the Sun red when it is low, but the sky is blue at noon?'],
  key: ['<b>Scattering</b>: particles in the air spread light in all directions. Small particles scatter blue light the most (shorter wavelength).', '<b>Blue sky</b>: air molecules scatter blue light of the Sun all over the sky. Without air the sky would look dark.', '<b>Red Sun at sunrise and sunset</b>: the light travels a long path, most blue is scattered away and red reaches us.', '<b>Tyndall effect</b>: the path of a light beam becomes visible when it is scattered by dust, smoke or tiny droplets (sunlight through mist or a forest). Large particles scatter all colours, so clouds look white.'],
  quiz: [{ q: 'The sky looks blue because…', o: ['air molecules scatter blue light most', 'the sea reflects blue', 'blue light is absorbed'], a: 0, why: 'Short wavelengths scatter the most.' }, { q: 'The Sun looks red at sunset because…', o: ['red light is scattered most', 'blue light is scattered away on the long path', 'the Sun is cooler then'], a: 1, why: 'Only the less scattered red light is left.' }, { q: 'The Tyndall effect is the…', o: ['bending of light in a prism', 'scattering of light by tiny particles that makes a beam visible', 'reflection from a mirror'], a: 1, why: 'Particles scatter light and show its path.' }]
};
