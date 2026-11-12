// sw.js — makes the lab work offline. The shell is cached on install; every other file (each simulation) is cached the
// first time it is opened — and index.html fetches them all in the background. Bump VERSION when you change files.
const VERSION = 'physics-lab-v8.1';
const CORE = ['./', 'index.html', 'lab.html', 'style.css', 'app.js', 'scene.js', 'optics.js', 'syllabus.js', 'manifest.webmanifest', 'vendor/three.module.js', 'icons/icon.svg', 'icons/icon-192.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); return res; }).catch(() => caches.match('index.html'))));
});
