// Class 8 · Ch 17 — Sky tab: Comet and Stars. (The Meteor now has its own tab, meteor8.) Both share the engine in sky8core.js.
import base from './sky8core.js';
export default { ...base, title: 'Comets and Stars', head: 'Now',
  tabs: [['skyobjects8', 'Sky'], ['meteor8', 'Meteor'], ['scale8', 'Scale'], ['satellites8', 'Orbits']],
  sliders: base.sliders.map(s => s.k === 'm' ? { k: 'mm', l: '🔀 Mode', min: 1, max: 2, step: 1, v: 1, names: ['Comet', 'Stars'] } : s),
  step(dt, P) { P.m = P.mm === 2 ? 3 : 1; base.step(dt, P); },
  try: base.try.filter(t => !/Meteor|Pebble|Boulder/.test(t.t || t)), key: base.key.filter(k => !/meteoroid/.test(k)), quiz: base.quiz.filter(q => !/glowing streak/.test(q.q)) };
