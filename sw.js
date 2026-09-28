// Service worker: precache the app shell, then cache-first for everything same-origin (works offline).
// Bump VERSION whenever you change files so users get the update.
const VERSION = 'physics-lab-v1';
const CORE = ['./', 'index.html', 'app.css', 'kit.js', 'modules.js', 'manifest.webmanifest', 'vendor/three.module.js',
  'friction.html', 'pendulum.html', 'projectile.html', 'refraction.html',
  'sims/friction.js', 'sims/pendulum.js', 'sims/projectile.js', 'sims/refraction.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); return res; }).catch(() => caches.match('index.html'))));
});
