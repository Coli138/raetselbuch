// Bei jeder Änderung an der App die Version hochzählen, damit das iPad die neuen Dateien holt.
const CACHE = 'raetselbuch-v5';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Immer zuerst aus dem Speicher: so läuft die App ohne Netz, und ein WLAN-Anmeldeportal
// im Zug kann keine falschen Seiten unterschieben.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true })).then(hit => hit || fetch(e.request))
  );
});
