# Physics Lab — interactive 3D physics PWA

NCERT-style physics simulations for school students, arranged in **6 levels** (icon-based: the atom icon grows richer as topics get more advanced). Works offline once opened; installable on phone/desktop.

## Publish on GitHub Pages
1. Create a new GitHub repo and upload **all files** from this folder (keep the structure).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Open `https://<username>.github.io/<repo>/` → use **Install / Add to Home Screen**.

Run locally: `python3 -m http.server 8000` then open http://localhost:8000 (service workers & ES modules need http, not file://).

## Structure
- `modules.js` – registry of levels & modules (icons, colours, "soon" roadmap cards)
- `kit.js` – shared 3D scene, helpers, slider UI and sim loop
- `sims/<id>.js` – one simulation each (setup / reset / step / readouts / explanation)
- `<id>.html` – generated module pages (`node tools/make-pages.mjs`)
- `sw.js`, `manifest.webmanifest`, `icons/` – PWA files · `vendor/three.module.js` – three.js r160 (bundled, offline)

## Add a new simulation
1. Copy `sims/friction.js` → `sims/mytopic.js` and edit.
2. In `modules.js`, add/replace the entry (remove `soon:true`).
3. Run `node tools/make-pages.mjs`, add the new `.html` and `sims/*.js` to `CORE` in `sw.js`, and bump `VERSION`.
