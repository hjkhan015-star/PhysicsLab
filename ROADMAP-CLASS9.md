# Class 9 improvement roadmap

Planned from the teacher's notes (Motion, Sound monitor, Work-Power-Energy, Human ear). One phase at a time; each phase ships as a full repo zip.

Look rules for every phase: one colour per quantity (distance blue, displacement green, velocity yellow, acceleration red, KE cyan, PE amber, work green, power violet); glowing trails and snapshots; no heavy post-processing (phones must stay smooth).

## Phase 1 — Motion — DONE (six header tabs, home card `dist9`)
- **`dist9` Distance and displacement**: three walks (there and back, round the field, corner). Blue trail = path, green arrow = straight line from A. Monitor: displacement, distance, direction, time. Round the field ends with displacement 0.
- **`speed9` Speed and velocity**: Two cars (same speed, opposite velocities) · Round the bend (speed constant, velocity arrow turns) · Round trip (average speed vs average velocity).
- **`accel9` Acceleration**: Steady / Faster / Slower / Uneven. A snapshot every second (equal gaps = uniform), velocity and acceleration arrows, live v–t graph, gap in the last second. Track is scaled to fit every setting.
- **`graphs9` Graphs**: four motions (at rest, steady, faster, uneven) × three live graphs (s–t, v–t, a–t); the area under v–t is shaded; Monitor shows s, v, a.
- **`motion9` Equations** (existing): now a tab, v–t area shaded, v = u+at and s = ut+½at² shown with the student's numbers.
- **`circular9`** (existing): now a tab; **Cut / reattach the string** (the ball flies off along the tangent); ω added to the Monitor; glowing trail.
- Engine: `trail()` in `scene.js` (glowing bead trail); `fill` option for graphs (shaded area); header tabs scroll sideways when there are more than four.
- Left for a later polish: ruler / drag-to-measure, a graph scrub marker, "find the unknown" equation mode with answer check, unrolled-circumference strip in `circular9`.

## Phase 2 — Work, Power, Energy — DONE (five header tabs, home card `work9`)
- **`work9` Work**: W = F × s × cos θ with angle 0° / 60° / 90° (90° = no work). Force arrow with its along-motion (green) and sideways (grey) parts; force–distance graph with the area shaded; Monitor: work, F cos θ, distance, angle.
- **`forms9` PE and KE**: PE = mgh (weight on a ruler pole) and KE = ½mv² (moving ball). A bar for the energy now and a faded bar for h × 2 (PE doubles) or v × 2 (KE × 4).
- **`energy9` Conservation** (existing, now a tab): new **Friction** switch — the ball slowly stops, a red heat bar grows, and PE + KE + heat stays constant. Bars moved so all three fit on a phone.
- **`power9` Power**: two motors lift the same load 5 m; work is equal, time = W ÷ P, so the stronger motor finishes first. Monitor: work, both times, both powers, kWh and cost for 10 h.
- **`transform9` Transformations**: Dam → bulb, Swing (pendulum), Cycle, Solar. A vertical five-step chain with a moving pulse; auto-play or Next step; Monitor: energy now, step, next form.
- Left for a later polish: a dam / turbine drawing instead of coloured blocks, a rotating "energy meter" for kWh, a lift-by-hand angle drag in `work9`.

## Phase 3 — Sound — DONE (four header tabs: Wave · Types · Spread · Echo, home card `sound9`)
- **`sound9` Wave**: the Monitor scope shows the wave itself in a **fixed 20 ms window**, so the shape changes (more waves fit as f rises, taller as A rises) and the axis never stretches. T is marked on the scope. The 3D air has a speaker cone pushing a lattice of particles coloured by density (red compression, blue rarefaction), a tracked red particle, and a moving λ bracket between two compressions. Monitor: λ, f, T, A, v, with an infra / audible / ultra chip. Hear-it button kept.
- **`waves9` Types**: transverse vs longitudinal, now a tab, with density colours in the longitudinal wave.
- **`spread9` Spread** (new): expanding 3D spherical shells from a speaker, faster and further apart in water than in air; the listener flashes when a shell arrives; "reaches 340 m in" row.
- **`echo9` Echo**: now a tab.
- Left for a later polish: drag-to-measure λ, a moving ship and pulse ring in `echo9`, a rope and a spring side by side in `waves9`, a loudness (dB) bar.

## Phase 4 — Human Ear (its own phase) — NEXT
3D cutaway, Journey / Parts / Cochlea / Range / Care tabs.
