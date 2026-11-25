// Class 10 · Ch 10–11 Light — the electromagnetic spectrum, from radio waves to gamma rays. Slide along it (log scale) and see wavelength, frequency, energy and what uses that part.
import { S, V, THREE, beam, box, sph, label } from '../scene.js';
const C = 3e8, H = 4.1357e-15, X0 = -8, UW = 16 / 19, LOG0 = 3;                                   // speed of light · Planck constant (eV s) · bar left end · units per decade (10³ … 10²² Hz)
const BANDS = [['Radio', 3, 8.48, 0x94a3b8, 'The longest waves (a metre to kilometres). They carry radio and TV programmes.'],
  ['Microwave', 8.48, 11.48, 0xa78bfa, 'Wi-Fi, Bluetooth, mobile 4G/5G, radar and microwave ovens all use these waves (1 m to 1 mm).'],
  ['Infrared', 11.48, 14.63, 0xef4444, 'Hot objects give out infrared. You feel it as heat. TV remotes and thermal cameras use it.'],
  ['Visible', 14.63, 14.875, 0xfacc15, 'The only waves our eyes see: red (700 nm) to violet (400 nm).'],
  ['Ultraviolet', 14.875, 16.48, 0x8b5cf6, 'The Sun gives UV. It tans skin and kills germs. Too much harms skin and eyes.'],
  ['X-ray', 16.48, 19.48, 0x22d3ee, 'X-rays pass through flesh but not bone, so doctors use them to see inside the body.'],
  ['Gamma', 19.48, 22, 0xf472b6, 'Gamma rays come from radioactive atoms. Very penetrating; used to treat cancer.']];
const MK = [['AM radio', 1e6], ['FM radio', 1e8], ['TV broadcast', 5e8], ['Mobile 4G', 1.8e9], ['Wi-Fi · Bluetooth · microwave oven', 2.4e9], ['Wi-Fi (5 GHz)', 5e9], ['Radar', 1e10], ['5G (mmWave)', 2.8e10], ['Body heat', 3e13], ['TV remote', 3.2e14], ['Red light', 4.3e14], ['Violet light', 7.5e14], ['Sun’s UV', 1.5e15], ['Medical X-ray', 3e18], ['Gamma from atoms', 1e20]];
const lg = f => Math.log10(f), xo = L => X0 + (L - LOG0) * UW, sup = s => String(s).replace(/[-0-9]/g, c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
const sig = x => x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2);
const fmtF = f => f < 1e6 ? sig(f / 1e3) + ' kHz' : f < 1e9 ? sig(f / 1e6) + ' MHz' : f < 1e12 ? sig(f / 1e9) + ' GHz' : f < 1e15 ? sig(f / 1e12) + ' THz' : f < 1e18 ? sig(f / 1e15) + ' PHz' : f < 1e21 ? sig(f / 1e18) + ' EHz' : sig(f / 1e21) + ' ZHz';
const fmtL = l => l >= 1e3 ? sig(l / 1e3) + ' km' : l >= 1 ? sig(l) + ' m' : l >= 1e-2 ? sig(l * 100) + ' cm' : l >= 1e-3 ? sig(l * 1e3) + ' mm' : l >= 1e-6 ? sig(l * 1e6) + ' µm' : l >= 1e-9 ? sig(l * 1e9) + ' nm' : l >= 1e-12 ? sig(l * 1e12) + ' pm' : sig(l * 1e15) + ' fm';
const fmtE = e => { if (e >= .01 && e < 1e4) return sig(e) + ' eV'; const ex = Math.floor(Math.log10(e)); return (e / Math.pow(10, ex)).toFixed(1) + ' × 10' + sup(ex) + ' eV'; };
function nm2rgb(nm) { let r = 0, g = 0, b = 0; if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1; return new THREE.Color(r, g, b); }
const band = L => BANDS.findIndex(b => L < b[2]) < 0 ? 6 : BANDS.findIndex(b => L < b[2]);
const SN = Array.from({ length: 191 }, (_, i) => fmtF(Math.pow(10, LOG0 + i / 10)));
let wv, ptr, dots, lBand, lPtr, lMk, zoom, zp, lz, pos, lx, lj;
const NS = 100;
export default {
  title: 'Electromagnetic Spectrum', tabs: [['prism10', 'Prism'], ['spectrum10', 'Spectrum']], cam: { d: 17, e: 0, a: 0, t: V(0, -2.3, 0), ref: 1.3 },
  head: 'Wavelength',
  sliders: [{ k: 'x', l: '📡 Frequency (slide along)', min: 0, max: 190, step: 1, v: 64, names: SN, axis: true }, { k: 'j', l: '🎯 Jump to', min: 1, max: MK.length, step: 1, v: 5, names: MK.map(m => m[0]), axis: true }],
  setup() {
    wv = Array.from({ length: NS }, () => beam(0xa78bfa, .11));
    BANDS.forEach((b, i) => { const w = (b[2] - b[1]) * UW, bx = box(w, .9, .4, b[3]); bx.position.set(xo(b[1]) + w / 2, -3.8, 0); const nx = label(i === 4 ? 'UV' : b[0], '#e2e8f0', .75); nx.position.set(xo((b[1] + b[2]) / 2), i === 3 || i === 1 ? -5.75 : -4.95, 0); });
    const v0 = xo(BANDS[3][1]), v1 = xo(BANDS[3][2]); beam(0x64748b, .03).set(V(v0, -4.25, 0), V(-3.9, -6.75, 0)); beam(0x64748b, .03).set(V(v1, -4.25, 0), V(3.9, -6.75, 0));
    zoom = []; for (let k = 0; k < 28; k++) { const nm = 700 - 300 * (k + .5) / 28, b = box(.28, .8, .3, 0xffffff); b.material.color.copy(nm2rgb(nm)); b.position.set(-3.9 + .28 * (k + .5), -7.2, 0); zoom.push(b); }
    label('Visible light, zoomed in', '#cbd5e1', .75).position.set(0, -8.7, 0); label('700 nm', '#fca5a5', .6).position.set(-3.9, -7.95, 0); label('400 nm', '#c4b5fd', .6).position.set(3.9, -7.95, 0);
    dots = MK.map(m => { const d = sph(.14, 0xf8fafc); d.position.set(xo(lg(m[1])), -3.25, 0); return d; });
    ptr = new THREE.Mesh(new THREE.ConeGeometry(.28, .6, 12), new THREE.MeshBasicMaterial({ color: 0xfde047 })); ptr.rotation.z = Math.PI; S.add(ptr); zp = new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 12), new THREE.MeshBasicMaterial({ color: 0xfde047 })); zp.rotation.z = Math.PI; S.add(zp);
    lPtr = label('', '#fde047', .8); lMk = label('', '#f8fafc', .8); lz = label('All travel at 3 × 10⁸ m/s in vacuum', '#94a3b8', .72); lz.position.set(0, 4.9, 0); lBand = label('', '#e2e8f0', .9); lBand.position.set(0, 4.1, 0);
  },
  reset() { pos = 64; lx = lj = undefined; },
  step(dt, P) {
    if (lx === undefined) { lx = P.x; lj = P.j; } if (P.x !== lx) { lx = P.x; pos = P.x; } if (P.j !== lj) { lj = P.j; pos = (lg(MK[P.j - 1][1]) - LOG0) * 10; }
    const L = LOG0 + pos / 10, f = Math.pow(10, L), lam = C / f, bi = band(L), q = pos / 190, vis = bi === 3, nm = lam * 1e9; Object.assign(P, { f, lam, bi, E: H * f });
    const col = vis ? nm2rgb(Math.max(400, Math.min(700, nm))) : new THREE.Color(BANDS[bi][3]), N = 1 + 20 * Math.pow(q, 1.3), k = 2 * Math.PI * N / 16, ph = 3 * performance.now() / 1000;   // schematic: fewer waves than the real ones
    for (let i = 0; i < NS; i++) { const xa = -8 + 16 * i / NS, xb = -8 + 16 * (i + 1) / NS; wv[i].set(V(xa, 1.6 + 1.2 * Math.sin(k * (xa - ph)), 0), V(xb, 1.6 + 1.2 * Math.sin(k * (xb - ph)), 0)); wv[i].material.color.copy(col); }
    const px = xo(L); ptr.position.set(px, -2.7, 0); lPtr.position.set(px, -2.0, 0); lPtr.set(fmtF(f));
    let nb = -1, bd = .3; MK.forEach((m, i) => { const d = Math.abs(lg(m[1]) - L); dots[i].scale.setScalar(d < .3 ? 1.8 : 1); if (d < bd) { bd = d; nb = i; } }); P.mk = nb >= 0 ? MK[nb][0] : '';
    lMk.visible = nb >= 0; if (nb >= 0) { lMk.position.set(Math.max(-5.2, Math.min(5.2, px)), -1.3, 0); lMk.set(MK[nb][0]); } lBand.set(BANDS[bi][0], '#' + new THREE.Color(BANDS[bi][3]).getHexString());
    zp.visible = vis; if (vis) zp.position.set(-3.9 + 7.8 * (700 - nm) / 300, -6.55, 0);
  },
  ro: { Wavelength: P => fmtL(P.lam), Frequency: P => fmtF(P.f), 'Photon energy': P => fmtE(P.E), Band: P => BANDS[P.bi][0], 'Speed in vacuum': () => '3 × 10⁸ m/s' },
  status: P => [BANDS[P.bi][0], true],
  note: P => `<b>${BANDS[P.bi][0]}.</b> ${BANDS[P.bi][4]}${P.mk ? ` <b>Here: ${P.mk}.</b>` : ''}`,
  try: [{ t: 'Slide to <b>Wi-Fi · Bluetooth · microwave oven</b> (about 2.4 GHz). Which band is it? What is its wavelength?', check: P => P.mk.startsWith('Wi-Fi ·'), yes: 'Microwaves, about 12 cm long.' },
    { t: 'Find <b>FM radio</b> and then <b>Medical X-ray</b>. Which has the longer wavelength? Which has more energy?', check: P => P.mk === 'Medical X-ray', yes: 'FM is longer. X-rays carry far more energy.' },
    { t: 'Go to the <b>Visible</b> band. Watch the small zoom bar. Which colour has the longest wavelength?', check: P => P.bi === 3, yes: 'Red. Violet is the shortest.' },
    { t: 'Slide from the left end to the right end. What happens to the wavelength? To the energy? To the speed?' }],
  key: ['All electromagnetic waves travel at the same speed in vacuum: <b>c = 3 × 10⁸ m/s</b>.', '<b>c = f × λ</b>: a higher frequency means a shorter wavelength.', 'Order, long to short wavelength: <b>Radio · Microwave · Infrared · Visible · Ultraviolet · X-ray · Gamma</b>.', 'Photon energy rises with frequency: <b>E = h f</b>. Gamma and X-rays carry the most.', 'Wi-Fi, Bluetooth, mobile phones and microwave ovens all use microwaves (about 1 to 30 GHz).', 'They need no medium, so light reaches us from the Sun through space.'],
  quiz: [{ q: 'Which has the longest wavelength?', o: ['X-rays', 'Radio waves', 'Visible light'], a: 1, why: 'Radio waves are the longest, from about a metre to kilometres.' }, { q: 'In a vacuum, which travels fastest?', o: ['Radio waves', 'Gamma rays', 'They are all equal'], a: 2, why: 'All electromagnetic waves travel at 3 × 10⁸ m/s in vacuum.' }, { q: 'Wi-Fi and Bluetooth use…', o: ['infrared', 'microwaves', 'X-rays'], a: 1, why: 'Both work at about 2.4 GHz, in the microwave band.' }, { q: 'A TV remote sends signals using…', o: ['infrared', 'ultraviolet', 'gamma rays'], a: 0, why: 'Infrared, which our eyes cannot see.' }, { q: 'If the frequency doubles, the wavelength…', o: ['doubles', 'halves', 'stays the same'], a: 1, why: 'λ = c / f, so λ becomes half.' }]
};
