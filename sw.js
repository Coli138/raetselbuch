// Bei jeder Änderung an der App die Version hochzählen, damit das iPad die neuen Dateien holt.
const CACHE = 'raetselbuch-v9';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'welt.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-512.png'];

// Aufnahmen und Flaggen der Weltkarte: eine Datei je Land und Kleinstaat.
// Sie werden einzeln geholt; fehlt eine, läuft die App trotzdem (dann spricht die Gerätestimme).
importScripts('welt.js');
const EXTRA = [];
WELT.l.forEach((_, i) => EXTRA.push(`ton/l${i}.m4a`));
WELT.p.forEach((_, i) => EXTRA.push(`ton/p${i}.m4a`));
[...WELT.l, ...WELT.p].forEach(c => EXTRA.push(`flaggen/${c[5]}.svg`));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES).then(() => Promise.all(EXTRA.map(u => c.add(u).catch(() => {})))))
    .then(() => self.skipWaiting()));
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
