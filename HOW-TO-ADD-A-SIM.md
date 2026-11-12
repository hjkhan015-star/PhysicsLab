# How to add a simulation (10 minutes)

You only touch **two things**: one file in `sims/`, and one line in `syllabus.js`. No build step, no install.

1. **Copy a sim** that looks like yours into `sims/` and rename it `<topic><class>.js` (e.g. `sims/lightning8.js`).
   Class 8 → copy `friction8.js` (simple words) · Class 9 → `laws9.js` (formulas) · Class 10 → `electricity10.js` (board depth).
2. **Edit it** (see the cheat-sheet below).
3. **Register it:** in `syllabus.js` find the card (it has `soon: true`) and delete `soon: true`. The card now opens `lab.html?sim=<id>`.
4. **Test:** `python3 -m http.server 8000` → open http://localhost:8000 (ES modules + the service worker need http, not double-click).
5. Bump `VERSION` in `sw.js` so phones pick up the change.

## What a sim file looks like

```js
import { V, box, floor, arrow, label } from '../scene.js';     // 3D helpers (see scene.js)
export default {
  title: 'Friction — Rough or Smooth?',
  cam:  { d: 17, e: .3, a: .2, t: V(1, 1, 0) },                 // d distance · e up/down · a left/right · t look-at · ref 1.3 = tall/narrow scenes
  sliders: [                                                    // → the control dock
    { k: 'F', l: '💪 Your push', min: 0, max: 40, step: 2, v: 10, u: 'N' },
    { k: 's', l: '🧱 Surface', min: 1, max: 4, step: 1, v: 3, names: ['Ice', 'Smooth', 'Wood', 'Carpet'] } ],   // names → buttons (≤4) or a named slider (axis:true / >4)
  toggles: [{ k: 'show', l: 'Show forces', v: true }],           // optional on/off switches
  buttons: [{ l: '🔊 Hear it', fn: P => beep(440) }],            // optional action buttons
  setup(P) { /* build 3D objects once */ },
  reset(P) { /* start values: runs on ↻ and at the start */ },
  step(dt, P) { /* every frame: P.F, P.s … are the slider values; move things, save results in P */ },
  ro:   { 'Your push': P => P.F + ' N', Friction: P => '10 N' },  // → MONITOR rows (numbers only). First row = big headline (or set head:'Friction')
  status: P => ['Moving', true],                                 // optional pill: [text, green?, 'warn'|'crit']
  graph:  P => ({ pts: [[0, 1], [1, 2]], xmax: 10, ymax: 20, xl: 'time (s)', yl: 'speed' }),   // optional live graph
  note: P => 'Short explanation that changes with the sliders',   // → caption + info sheet "Now"
  try:  ['Activity 1', { t: 'Activity 2', check: P => P.s === 1, yes: 'Yes! Well done.' }],   // → "Try this"; optional check → ✅ + cheer (use it in Class 8; keep it false at the start)
  key:  ['Point to remember'],                                   // → "Remember"
  quiz: [{ q: 'Question?', o: ['A', 'B', 'C'], a: 1, why: 'Because…' }]   // → "Quiz" (a = index of the right answer)
};
```
**Rules of thumb:** numbers go in `ro` (Monitor), words go in `note`/`try`/`key`. Class 8 → emoji + words, no formulas. Class 9 → show the formula with the student's numbers filled in. Class 10 → add derived results and board-style questions.

## 3D helpers (scene.js)
`box(w,h,d,color)` · `sph(r,color)` · `floor(w,d)` · `beam(color,width).set(a,b)` thick ray · `arrow(color).set(x,y,len,dir,z)` · `label('text','#hex').set('new text')` floating text · `arrowTo(color).to(ax,ay,bx,by,z)` arrow between any two points · `wire([[x,y],…],color,r)` thick bent wire · `beep(hz)` · `V(x,y,z)` · `D` (degrees→radians).

**Show a control only sometimes:** add `w: P => P.mode === 2` to any slider, toggle or button — it is hidden while `w` returns false. A Monitor row (`ro`) whose function returns `null` is hidden too.

**Light sims** share `optics.js` (pure functions, New Cartesian sign convention): `image('mirror'|'lens', u, f)`, `rays(...)`, `prism(i, A, n)`. Import it with `import { image, rays } from '../optics.js';`.

## Files at a glance
| File | What it is | Edit it? |
|---|---|---|
| `index.html` | home: class tabs → cards | rarely |
| `lab.html` | the ONE page that runs any sim (`?sim=<id>`) | no |
| `app.js` | the UI player: dock, monitor, info sheet, menu, layouts | only to change the UI |
| `scene.js` | 3D camera + helpers | only to add a helper |
| `optics.js` | mirror / lens / prism formulas (no 3D) | only to add a formula |
| `style.css` | all styling; colours at the top; one block per screen layout | to restyle |
| `syllabus.js` | classes → chapters → sims (data only) | **yes, one line per sim** |
| `sims/*.js` | **one file per simulation** | **yes — this is where you work** |
| `sw.js`, `manifest.webmanifest`, `icons/`, `vendor/` | offline + install + three.js | no |
