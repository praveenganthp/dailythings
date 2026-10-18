/**
 * DailyThings Offline Service Worker
 * Provides offline caching, lightning-fast boot, and installable PWA support.
 */

const CACHE_NAME = 'dailythings-cache-v1';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest',
];

// Install: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET and cross-origin analytics/forms
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin) && !request.url.includes('fonts.googleapis.com') && !request.url.includes('fonts.gstatic.com')) {
    return;
  }

  // Navigation requests (HTML documents): Network first, falling back to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex = await cache.match('/index.html') || await cache.match('/');
          return cachedIndex || Response.error();
        })
    );
    return;
  }

  // Static assets (hashed files in /assets/, fonts, icons): Cache-first with background revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached immediately, fetch fresh copy in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Offline - ignore network error
          });
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        return networkResponse;
      });
    })
  );
});
