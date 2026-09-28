// modules.js — Physics Lab registry (levels + modules) in ONE file.
// ADD A MODULE: add an object to a level's "modules" list, create sims/<id>.js,
// then run:  node tools/make-pages.mjs   (or copy any module html and rename).
//   id, label, sub (short line), color, icon (svg inner markup, 24x24 stroke)
//   soon:true  -> roadmap card (dimmed, not clickable)

// Level icon: an atom that grows richer with each level (1 orbit → orbits → ring → sparks).
export function levelIcon(n){
  const o=Math.min(n,3);
  let s='<circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none"/>';
  for(let i=0;i<o;i++) s+=`<ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(${i*60} 24 24)"/>`;
  if(n>=4) s+='<circle cx="24" cy="24" r="22.5" opacity=".55"/>';
  if(n>=5) s+='<path d="M24 1v4M24 43v4M1 24h4M43 24h4" />';
  if(n>=6) s+='<circle cx="24" cy="24" r="17" stroke-dasharray="2 3" opacity=".8"/>';
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${s}</svg>`;
}

export const LEVELS = [
 { n:1, color:"#22c55e", blurb:"Feel the basics — pushes, pulls and how things move.", modules:[
   {id:"friction", label:"Force & Friction", sub:"Push a block", color:"#f59e0b", icon:'<rect x="4" y="11" width="9" height="7" rx="1"/><path d="M15 14h6m-2-2 2 2-2 2M3 20h18"/>'},
   {id:"pressure", label:"Pressure & Buoyancy", sub:"Floating and sinking", color:"#0ea5e9", icon:'<path d="M3 10c3-2 6 2 9 0s6 2 9 0M3 16c3-2 6 2 9 0s6 2 9 0"/>', soon:true},
   {id:"sound1", label:"Sound & Vibration", sub:"How sound is made", color:"#a855f7", icon:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6"/>', soon:true} ]},
 { n:2, color:"#14b8a6", blurb:"Measure and predict — time, heat and reflection.", modules:[
   {id:"pendulum", label:"Simple Pendulum", sub:"Time period & g", color:"#ef4444", icon:'<path d="M12 3v0M12 3 7 17"/><circle cx="7" cy="18" r="2.5"/><path d="M4 3h16"/>'},
   {id:"heat", label:"Heat & Temperature", sub:"Conduction, convection", color:"#f97316", icon:'<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z"/>', soon:true},
   {id:"reflection", label:"Reflection", sub:"Plane mirrors", color:"#64748b", icon:'<path d="M3 20h18M6 4l6 16M18 4l-6 16"/>', soon:true} ]},
 { n:3, color:"#0ea5e9", blurb:"Laws of motion — forces, energy and flight paths.", modules:[
   {id:"projectile", label:"Projectile Motion", sub:"Angle & speed", color:"#f97316", icon:'<path d="M3 19C7 4 15 4 21 19"/><circle cx="12" cy="6.5" r="1.8"/>'},
   {id:"newton", label:"Newton's Laws", sub:"F = m × a", color:"#3b82f6", icon:'<circle cx="12" cy="12" r="8"/><path d="M8 12h8m-3-3 3 3-3 3"/>', soon:true},
   {id:"energy", label:"Work & Energy", sub:"Kinetic ↔ potential", color:"#eab308", icon:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>', soon:true} ]},
 { n:4, color:"#6366f1", blurb:"Light in action — bending, lenses and the eye.", modules:[
   {id:"refraction", label:"Refraction of Light", sub:"Snell's law", color:"#38bdf8", icon:'<path d="M3 12h18M5 4l7 8 6 8"/>'},
   {id:"lens", label:"Lenses & Mirrors", sub:"Image formation", color:"#06b6d4", icon:'<path d="M12 3c-5 4-5 14 0 18 5-4 5-14 0-18z"/>', soon:true},
   {id:"eye", label:"Human Eye", sub:"Vision & defects", color:"#10b981", icon:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', soon:true} ]},
 { n:5, color:"#a855f7", blurb:"Invisible forces — circuits, magnets and gravity.", modules:[
   {id:"circuit", label:"Electric Circuits", sub:"Ohm's law", color:"#eab308", icon:'<path d="M4 8h16v9H4zM10 8v9"/>', soon:true},
   {id:"magnet", label:"Magnetic Fields", sub:"Field lines", color:"#ef4444", icon:'<path d="M6 4v9a6 6 0 0 0 12 0V4h-4v9a2 2 0 0 1-4 0V4z"/>', soon:true},
   {id:"gravity", label:"Gravitation", sub:"Orbits & weight", color:"#8b5cf6", icon:'<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4"/>', soon:true} ]},
 { n:6, color:"#f43f5e", blurb:"Power the world — induction, motors and energy sources.", modules:[
   {id:"induction", label:"Electromagnetic Induction", sub:"Faraday's law", color:"#f43f5e", icon:'<path d="M4 12c0-6 6-6 6 0s6 6 6 0M18 5v14"/>', soon:true},
   {id:"motor", label:"Motor & Generator", sub:"Fleming's rules", color:"#ec4899", icon:'<circle cx="12" cy="12" r="7"/><path d="M12 5v14M5 12h14"/>', soon:true},
   {id:"sources", label:"Sources of Energy", sub:"Solar, wind, nuclear", color:"#22c55e", icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>', soon:true} ]}
];
