importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js");
// Cache first
// workbox.routing.registerRoute(({ request }) => request.destination === "image", new workbox.strategies.CacheFirst());
// //? Change often
workbox.routing.registerRoute(({ request }) => request.destination === "image" || request.destination === "script" || request.destination === "style" , new workbox.strategies.CacheFirst());


addEventListener('install', e => e.waitUntil(
  caches.open(v).then(cache => cache.addAll(['/']))
));

addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse =>
      cachedResponse || fetch(e.request)
    )
  );
});

addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.map(key => {
      if (key != v) return caches.delete(key);
    }));
  }));
});

addEventListener('message', e => {
  if (e.data === 'skipWaiting') {
    skipWaiting();
  }
});
