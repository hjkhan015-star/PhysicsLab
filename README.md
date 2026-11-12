> **Status: BETA.** Layouts and tests pass, but the numbers and wording have not yet been checked against the SEBA textbooks, and the new simulations (`circular9`, `waves9`, `ear9`, `scatter10`, `domestic10`) need classroom testing.

## Publish on GitHub Pages
Repo → Settings → Pages → Deploy from branch → `main` / `(root)`. Open the link once on a phone to install the offline cache. After changing any file, bump `VERSION` in `sw.js`.

## Check before every update
`pip install playwright && playwright install chromium`, then `python3 tests/check.py` (see `tests/README.md`).

---

# Physics Lab — SEBA Class 8 · 9 · 10

Interactive 3D physics simulations arranged by class and textbook chapter. Installable, works offline, built for phones, tablets and classroom smart boards.

**Screens:** phone = model + number strip on top, control dock at the bottom (swipe the handle) · tablet = bottom bar with horizontal sliders · smart board / desktop (≥1024 px) = controls rail on the left, model in the middle, numbers + graph on the right. ⋯ menu: theme, 3D labels, board mode (big text), reset view, full screen. Keys: Space play/pause · R restart · I info · L labels · T theme.

| Class | Style | Ready simulations |
|---|---|---|
| **8** Easy · Explore | simple words, emoji, no formulas | Force & Pressure (solids, liquids) · Friction · Sound · Chemical effects of current · Lightning & static · Light (reflection, the eye) · Moon & planets |
| **9** Standard · Formulas | equations with your numbers, live graphs | Motion · Laws of Motion (+ momentum) · Gravitation (+ Archimedes) · Work & Energy · Sound (+ echo) · Pendulum★ · Projectile★ |
| **10** HSLC · Board depth | derivations, TIR, series/parallel | Refraction · Mirrors · Lenses · Prism · Human eye · Electricity · Magnet field · DC motor · Induction & AC · Sources of energy |

Every simulation has a caption, **Try this** activities, **Remember** points and a short **Quiz**. See `SYLLABUS.md` for the chapter map and what is still to build.

## Run / publish
- Local: `python3 -m http.server 8000` → http://localhost:8000 (needs http, not double-click).
- GitHub Pages: upload all files, Settings → Pages → `main` / root. Open once online, then it works offline (the home page caches every simulation).

## Add a simulation
Read **`HOW-TO-ADD-A-SIM.md`** — one file in `sims/` plus one line in `syllabus.js`. No build step.

## Files
`index.html` home · `lab.html` the one page that runs every sim (`?sim=friction8`) · `app.js` UI · `scene.js` 3D helpers · `optics.js` mirror/lens/prism formulas (no 3D) · `style.css` · `syllabus.js` · `sims/` · `sw.js` · `manifest.webmanifest` · `icons/` · `vendor/three.module.js`
