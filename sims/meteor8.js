// Class 8 · Ch 17 — Meteor tab: meteoroid → meteor → meteorite, over a curved Earth with air and space. Engine shared with sky8core.js.
import base from './sky8core.js';
export default { ...base, title: 'Meteors — Shooting Stars', head: 'Now',
  tabs: [['skyobjects8', 'Sky'], ['meteor8', 'Meteor'], ['scale8', 'Scale'], ['satellites8', 'Orbits']],
  sliders: base.sliders.map(s => s.k === 'm' ? { ...s, v: 2, w: () => false } : s),             // Mode is fixed to Meteor
  toggles: [],
  try: base.try.filter(t => /Meteor|Pebble|Boulder/.test(t.t || t)), key: base.key.filter(k => /meteor|Most/.test(k)), quiz: base.quiz.filter(q => /glowing streak/.test(q.q)) };
