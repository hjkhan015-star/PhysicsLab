# Class 10 improvement roadmap

Planned from the teacher's handwritten notes (Light, Electricity, Magnetic Effects). One phase at a time. Each phase ships as a **changed-files zip** (repo folders kept), is tested on phone and tablet sizes, and bumps the cache version in `sw.js`.

Look rules for every phase: one colour per ray or quantity, arrows on every ray, labels that never overlap, no heavy effects (phones must stay smooth), new text in simple words.

## What the code does today (checked)
| Sim | Today | Gap from the notes |
|---|---|---|
| `refraction10` | Air↔Glass, one refracted ray, grey reflected ray, no arrows | arrows, dotted extension, reflected ray, three media |
| `mirrors10` | Fixed-curvature mirror arc, P/F/C labels (no dots), all rays yellow, one arrow object | curvature, dots, colours, back side, 3D shape, real objects, 2D button |
| `lenses10` | Lens as a lathe shape, 2F₁…2F₂ labels (no dots), all rays yellow | dots, colours, better look, real objects, 2D button |
| `prism10` | Deviation, minimum deviation, VIBGYOR with real n for each colour | does not *show why* colours split; no spectrum sim |
| `electricity10` | Dots travel only the main loop | in **parallel**, the second resistor gets no current flow |
| `magnet10` | Compass placed by two sliders; lines for magnet, wire, solenoid are open and 2D | tap/free compass, connected lines, 3D, better look |
| `motor10` | One coil, one speed slider, two reverse switches | needs a full phase |
| `induction10` | Magnet-and-coil + a basic AC generator mode | reuse the motor logic for a proper generator |

## Phase 1 — Refraction (`refraction10`) — DONE
Built as planned. Medium is a quick pick (Water · Glass · Diamond · Own n). **Three layers** is a switch (air | water | chosen medium; glass if water is chosen) and the ray can go up as well as down, so total internal reflection also appears between layers. Arrows on every ray, dotted no-bend line, angle labels i, r (r₁, r₂), n × sin θ in the Monitor. Reflected ray only at TIR.
- Arrow on the incident ray and on the refracted ray.
- A **dotted line** continues the incident ray straight on in the second medium (undeviated path), so students see the bend.
- Reflected grey ray removed. It comes back only for **total internal reflection**, where it is the whole point (white, with an arrow).
- **Three media**: quick-pick medium (Water 1.33 · Glass 1.5 · Diamond 2.42) and a **Three layers** mode (for example air | water | glass) where the ray bends at each boundary, with i and r marked at both.
- Monitor: speed of light in each layer, n₁ sin i₁ = n₂ sin i₂ = n₃ sin i₃ shown with the student's numbers.

## Phase 2 — Mirrors and Lenses (`mirrors10`, `lenses10`) — DONE
Built as planned, with a new shared helper `raytools.js` (arrowheads, dotted lines, real-looking objects). The mirror is a real curved cap (R = 2f) with a thin back and hatching; turn the picture to see it as a dish. Dots and labels at C, F, P and 2F₁, F₁, O, F₂, 2F₂. Ray colours: yellow parallel to the axis, blue through F (or F₁), pink through C (or O). Dotted virtual extensions. **Change object** cycles arrow, candle, tree. **2D view** snaps the camera back to the flat diagram. The lens gets fatter as f gets shorter, with a glass look, a bright rim and a dotted lens plane.
- Mirror curvature changes with f (R = 2f): the drawn mirror gets more or less curved as the slider moves.
- Dots on the axis for **C, F, P** (mirror) and **2F₁, F₁, O, F₂, 2F₂** (lens), each in its own colour.
- Three principal rays in three colours (parallel to axis · through F · through C or O), with arrows. Same colours in the key.
- Dashed construction lines **behind the mirror** (virtual image side), with a hatched back to show the back of the mirror.
- When the camera is orbited, the mirror shows its **real 3D shape** (a cut sphere cap), like the lens does.
- One or two **real objects** (candle, pencil, small tree) that the student can pick, instead of only an arrow.
- **2D button**: one tap returns the camera to the flat ray-diagram view. Same in lenses.
- Better lens visuals: glass look with a bright edge, thickness that follows f, principal axis ticks.

## Phase 3 — Prism and Electromagnetic Spectrum (`prism10`, new `spectrum10`) — DONE
Built as planned. Prism: a **Why does it split?** switch shows seven coloured rays inside the glass, n and speed for violet and red, and an n–wavelength graph. Prism and Spectrum are header tabs. Spectrum: a log-scale slider from 1 kHz to 10²² Hz with wavelength, frequency and photon energy, an animated wave (all moving at the same speed), seven bands, 15 real examples (Wi-Fi, Bluetooth, microwave oven, 4G/5G, FM, TV remote, X-ray and more) with a **Jump to** list, a zoomed visible-light bar, notes, try-this and quiz.
- `prism10`: a **Why does it split?** view. Shows that each colour has its own refractive index, so each bends by a different amount. Colour bar with wavelength (nm), n and speed in glass for every colour, plus a small n–wavelength graph. Violet slows most, red least.
- New `spectrum10` (tab beside Prism): a full electromagnetic spectrum, radio to gamma, with a slider along it. Shows wavelength, frequency and energy, an animated wave that squeezes as frequency rises, and **what lives where**: AM/FM radio, TV, mobile and 5G, **Wi-Fi and Bluetooth (about 2.4 GHz)**, microwave oven, infrared (remote, night vision), visible, ultraviolet, X-ray, gamma. All travel at the same speed in air or vacuum. Quick facts and a "match the use" quiz.

## Phase 4 — Electricity (`electricity10`, new `water10`) — DONE
Built as planned. Ohm's law: in parallel the charge dots now split at the junction and flow through both branches (speed follows each branch's current, so faster through the smaller R), with I₁ and I₂ labelled. Resistors are drawn as real parts with the 4-band colour code that follows the value; the battery is a dry cell. New `water10` tab (Ohm's law · Water analogy): Battery, Resistor, Capacitor and Inductor, each as the water picture, the real component and its circuit symbol, with a switch, live time-constant behaviour (the capacitor charges and discharges, the inductor current builds and dies away) and a graph.
- **Fix Ohm's law in parallel**: charge dots now split at the junction and flow through both branches, thicker through the smaller resistance (I₁ : I₂ = R₂ : R₁). Series stays as is.
- **Real pictures of components**: battery, resistor with colour bands, bulb, switch, ammeter, voltmeter, rheostat, capacitor, inductor coil. Each shown as a realistic picture next to its circuit symbol.
- New **water analogy** sim `water10`: pump = battery, pressure = voltage, flow = current, narrow pipe = resistance, tank with a rubber sheet = capacitor, heavy paddle wheel = inductor. Pick a component, see the water picture, the real component and the circuit symbol side by side, with a live graph (capacitor charging, inductor current build-up).

## Phase 5 — Magnetic field lines (`magnet10`)
- **Compass**: two modes. *Slider* (as now) and *Tap*: tap anywhere to put the compass there, drag it freely. The needle follows the true field.
- **Connected field lines**: bar-magnet lines run through the magnet and close, solenoid lines close through the coil, wire circles stay closed. Arrowheads along each line, glow, thinner lines where the field is weaker.
- **2D / 3D** toggle: in 3D the lines are revolved around the magnet or solenoid axis and can be orbited; the wire shows rings at several heights.

## Phase 6 — DC motor, one full phase (`motor10`)
- Full armature: iron core, several turns (slider), split ring and two carbon brushes, battery wired to the brushes with the current path glowing.
- Modes: **Run** · **Step by step** (stops at 0°, 90°, 180° with force arrows, current direction in AB and CD, and where the commutator switches) · **Fleming's hand** (a left-hand model, three fingers) · **Inside a real motor** (cut-away).
- Controls: current, field strength, turns, load. A live **torque–angle** graph and a speed gauge.
- Same colours throughout: field blue, current yellow, force green.

## Phase 7 — AC generator (`induction10` → new `generator10` tab)
- A shared machine engine (`machine10core.js`, same idea as `sky8core.js`) built from the motor: coil, magnets, field.
- AC generator with **slip rings** and brushes, hand crank, bulb and meter. Live voltage graph with the coil position marked (0°, 90°, 180°, 270°). Flux and induced voltage shown together.
- Toggle **Slip rings ⇄ Split ring**: shows alternating output turning into pulsating DC.
- Fleming's right-hand rule model. `induction10` keeps the Magnet-and-coil lab.

## Assumptions to confirm
1. The notes' "Class - VIII, Magnet" line is blank. Treated as nothing to do for now (no Class 8 magnet sim exists).
2. "Three medium" is read as a quick-pick of three media plus a three-layer mode (Phase 1).
3. "One tap 2D position" is read as a button that snaps the camera back to the flat view (Phase 2).
4. The reflected ray stays only for total internal reflection.
5. The EM spectrum sim is placed as a tab next to Prism, Class 10 chapter 10–11.

## Testing, each phase
Run the layout harness at 390×844 and 768×1024, check every slider and switch, take screenshots of the new views, test touch dragging where the camera or compass is involved. Package only changed files with their folders.
