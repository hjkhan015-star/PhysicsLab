// syllabus.js — the list of classes → chapters → simulations (DATA ONLY).
// Chapter numbers/titles follow the SEBA (Assam) General Science textbooks: Class 8 ch 11–17, Class 9 ch 8–12, Class 10 ch 10–14.
// To add a simulation: (1) write sims/<id>.js  (2) add one line below, remove  soon:true.  That's all — no build step.
//   id = file name in sims/ · ch = textbook chapter · label/sub = card text · icon = svg markup · bonus:true = extra, outside the syllabus

export function levelIcon(n) {                       // little atom icon, richer for higher classes
  const o = Math.min(n, 3);
  let s = '<circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none"/>';
  for (let i = 0; i < o; i++) s += `<ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(${i * 60} 24 24)"/>`;
  if (n >= 4) s += '<circle cx="24" cy="24" r="22.5" opacity=".55"/>';
  if (n >= 5) s += '<path d="M24 1v4M24 43v4M1 24h4M43 24h4"/>';
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${s}</svg>`;
}

export const CLASSES = [
 { n: 8, icon: 1, color: "#22c55e", tag: "Easy · Explore", blurb: "Play with it first! Push, shine, listen — no formulas, just see what happens.", modules: [
   { id: "pressure8", ch: 11, label: "Force and Pressure", sub: "Sink or not?", color: "#0ea5e9", icon: '<path d="M3 10c3-2 6 2 9 0s6 2 9 0M3 16c3-2 6 2 9 0s6 2 9 0"/>' },
   { id: "liquidpressure8", ch: 11, label: "Force and Pressure – Liquids", sub: "Liquid pressure", color: "#0284c7", icon: '<path d="M7 4h10v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3zM7 11h10"/>' },
   { id: "friction8", ch: 12, label: "Friction", sub: "Rough or smooth?", color: "#f59e0b", icon: '<rect x="4" y="11" width="9" height="7" rx="1"/><path d="M15 14h6m-2-2 2 2-2 2M3 20h18"/>' },
   { id: "sound8", ch: 13, label: "Sound", sub: "Loud, soft, high, low", color: "#a855f7", icon: '<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6"/>' },
   { id: "electro8", ch: 14, label: "Chemical Effects of Electric Current", sub: "Electroplating", color: "#14b8a6", icon: '<path d="M6 8h12v10H6zM9 5v3M15 5v3"/>' },
   { id: "lightning8", ch: 15, label: "Some Natural Phenomena", sub: "Lightning & static", color: "#eab308", icon: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>' },
   { id: "reflection8", ch: 16, label: "Light", sub: "Torch & mirror", color: "#64748b", icon: '<path d="M3 20h18M6 4l6 16M18 4l-6 16"/>' },
   { id: "eye8", ch: 16, label: "Light – Inside the Eye", sub: "Pupil & light", color: "#10b981", icon: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>' },
   { id: "stars8", ch: 17, label: "Stars and the Solar System", sub: "Moon, planets", color: "#6366f1", icon: '<path d="m12 3 2.5 6 6.5.5-5 4.3 1.6 6.4L12 17l-5.6 3.2L8 13.8 3 9.5 9.5 9z"/>' } ]},
 { n: 9, icon: 3, color: "#0ea5e9", tag: "Standard · Formulas", blurb: "Numbers enter the game — measure, use the equations and check them.", modules: [
   { id: "motion9", ch: 8, label: "Motion", sub: "u, a, t & graphs", color: "#ef4444", icon: '<path d="M3 17h4l3-8 4 10 3-6h4"/>' },
   { id: "circular9", ch: 8, label: "Motion – Circular Motion", sub: "v = 2πr ÷ T", color: "#f43f5e", icon: '<circle cx="12" cy="12" r="8"/><path d="M20 12l-2-2m2 2 2-2"/>' },
   { id: "laws9", ch: 9, label: "Force and Laws of Motion", sub: "F = m × a", color: "#3b82f6", icon: '<circle cx="12" cy="12" r="8"/><path d="M8 12h8m-3-3 3 3-3 3"/>' },
   { id: "momentum9", ch: 9, label: "Laws of Motion – Momentum", sub: "Collisions", color: "#6366f1", icon: '<circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M11 12h2"/>' },
   { id: "gravity9", ch: 10, label: "Gravitation", sub: "Weight & free fall", color: "#8b5cf6", icon: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4"/>' },
   { id: "float9", ch: 10, label: "Gravitation – Float or Sink", sub: "Archimedes", color: "#0ea5e9", icon: '<path d="M3 15c3-2 6 2 9 0s6 2 9 0M12 4v8m-3-3 3 3 3-3"/>' },
   { id: "energy9", ch: 11, label: "Work and Energy", sub: "KE ↔ PE", color: "#eab308", icon: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>' },
   { id: "sound9", ch: 12, label: "Sound", sub: "v = f × λ, echo", color: "#a855f7", icon: '<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6"/>' },
   { id: "waves9", ch: 12, label: "Sound – Wave Types", sub: "Transverse & longitudinal", color: "#d946ef", icon: '<path d="M3 12c3-8 6-8 9 0s6 8 9 0"/>' },
   { id: "ear9", ch: 12, label: "Sound – The Human Ear", sub: "Path of sound", color: "#e879f9", icon: '<path d="M8 20c-2-3 0-5 0-8a5 5 0 0 1 10 0c0 3-3 3-3 6' + '"/>' },
   { id: "echo9", ch: 12, label: "Sound – Echo & SONAR", sub: "d = v × t ÷ 2", color: "#c084fc", icon: '<path d="M4 8v8M9 5v14M14 8v8M19 10v4"/>' },
   { id: "pendulum9", label: "Simple Pendulum", sub: "Time period & g", color: "#ef4444", icon: '<path d="M12 3 7 17"/><circle cx="7" cy="18" r="2.5"/><path d="M4 3h16"/>', bonus: true },
   { id: "projectile9", label: "Projectile Motion", sub: "Angle & speed", color: "#f97316", icon: '<path d="M3 19C7 4 15 4 21 19"/><circle cx="12" cy="6.5" r="1.8"/>', bonus: true } ]},
 { n: 10, icon: 5, color: "#f43f5e", tag: "HSLC · Board depth", blurb: "Derive, calculate and explain — built for the HSLC board paper.", modules: [
   { id: "refraction10", ch: 10, label: "Light – Refraction", sub: "Snell's law & TIR", color: "#38bdf8", icon: '<path d="M3 12h18M5 4l7 8 6 8"/>' },
   { id: "mirrors10", ch: 10, label: "Light – Mirrors", sub: "Image formation", color: "#06b6d4", icon: '<path d="M12 3c-5 4-5 14 0 18 5-4 5-14 0-18z"/>' },
   { id: "lenses10", ch: 10, label: "Light – Lenses", sub: "Image & power", color: "#22d3ee", icon: '<path d="M12 3c4 4 4 14 0 18-4-4-4-14 0-18z"/><path d="M3 12h18"/>' },
   { id: "prism10", ch: 10, label: "Light – Prism", sub: "Deviation & colours", color: "#f59e0b", icon: '<path d="M12 4 3 19h18zM3 11l6 1"/>' },
   { id: "eye10", ch: 11, label: "Human Eye and Colourful World", sub: "Defects & colours", color: "#10b981", icon: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>' },
   { id: "scatter10", ch: 11, label: "Human Eye – Scattering", sub: "Blue sky, red Sun", color: "#60a5fa", icon: '<circle cx="7" cy="7" r="3"/><path d="M12 12l8 6M12 12l8-1M12 12l6-8"/>' },
   { id: "electricity10", ch: 12, label: "Electricity", sub: "Ohm's law, series/parallel", color: "#eab308", icon: '<path d="M4 8h16v9H4zM10 8v9"/>' },
   { id: "magnet10", ch: 13, label: "Magnetic Effects of Electric Current", sub: "Induction, motor", color: "#ef4444", icon: '<path d="M6 4v9a6 6 0 0 0 12 0V4h-4v9a2 2 0 0 1-4 0V4z"/>' },
   { id: "motor10", ch: 13, label: "Magnetic Effects – DC Motor", sub: "Fleming's rule", color: "#f97316", icon: '<circle cx="12" cy="12" r="6"/><path d="M12 6v12M6 12h12"/>' },
   { id: "induction10", ch: 13, label: "Magnetic Effects – Induction", sub: "Faraday & AC", color: "#fb7185", icon: '<path d="M3 12c3-8 6-8 9 0s6 8 9 0"/>' },
   { id: "domestic10", ch: 13, label: "Magnetic Effects – Domestic Circuits", sub: "Fuse & earth wire", color: "#facc15", icon: '<path d="M4 6h16M4 12h16M4 18h16M9 4v4"/>' },
   { id: "sources10", ch: 14, label: "Sources of Energy", sub: "Solar, wind, nuclear", color: "#22c55e", icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>' } ]}
];
// find a simulation (and its class) by id
export const findSim = id => { for (const c of CLASSES) for (const m of c.modules) if (m.id === id) return { cls: c, mod: m }; return null; };
