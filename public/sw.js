// BLACKFLIX — minimal service worker (required for PWA install prompt)
const CACHE = 'blackflix-v1';
const PRECACHE = ['/', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Network-first for API calls, cache-first for static assets
  const url = new URL(e.request.url);
  if (url.hostname === 'api.themoviedb.org' || url.hostname === 'image.tmdb.org') {
    // Always network for TMDB
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
