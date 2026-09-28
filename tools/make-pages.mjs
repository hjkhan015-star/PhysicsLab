// Generates one HTML page per ready module in modules.js.  Usage: node tools/make-pages.mjs
import { LEVELS } from '../modules.js';
import { writeFileSync } from 'node:fs';
const page = m => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0a0e16"><title>${m.label} · Physics Lab</title>
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon.svg">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png"><link rel="stylesheet" href="app.css">
<script type="importmap">{"imports":{"three":"./vendor/three.module.js"}}</script></head>
<body><div class="bar"><a href="index.html" aria-label="Back">←</a><b id="ttl">${m.label}</b></div>
<div class="wrap"><canvas id="cv"></canvas><div id="ro"></div><div class="ctl" id="ctl"></div><div id="note"></div></div>
<script type="module">import { run } from './kit.js'; import cfg from './sims/${m.id}.js'; run(cfg);</script>
</body></html>`;
for (const l of LEVELS) for (const m of l.modules) if (!m.soon) { writeFileSync(new URL(`../${m.id}.html`, import.meta.url), page(m)); console.log('wrote', m.id + '.html'); }
