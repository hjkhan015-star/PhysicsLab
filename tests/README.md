# Tests (not part of the app)
`check.py` opens every simulation at 4 phone sizes and fails on: any scrolling in the dock/monitor/page, clipped dock text,
console errors, or 3D labels under 11 px / off screen.
    pip install playwright && playwright install chromium
    python3 tests/check.py [sim ids...]      # SIZES=390x844 to limit sizes
Run a few sims per command (a full run takes several minutes). Run it after every change to style.css, app.js, scene.js or a sim.
