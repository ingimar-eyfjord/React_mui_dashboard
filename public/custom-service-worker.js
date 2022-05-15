const v = "2.0.f56dsfsdfsdf";
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
