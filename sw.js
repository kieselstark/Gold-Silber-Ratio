const CACHE_NAME = 'gold-platin-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Cache-First für statische Assets
  if (STATIC_ASSETS.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request)
    );
  }
  // Netzwerk-Fallback für simulierte API-Daten
  else if (event.request.url.includes('/simulated-data')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({
          status: "offline",
          message: "Keine Internetverbindung - simulierte Daten werden angezeigt"
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    );
  }
});
