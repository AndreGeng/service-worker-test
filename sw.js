// ServiceWorkerGlobalScope
// console.log('sw', this);
/* eslint no-console: 0 */
const cacheVersion = 'v3';
const self = this;
this.addEventListener('install', event => {
  console.log('event', event);

  event.waitUntil(
    caches
      .open(cacheVersion)
      .then(function(cache) {
        return cache.addAll([
          '/service-worker-test/',
          '/service-worker-test/src/style.css',
          '/service-worker-test/src/index.js',
        ]);
      })
      .then(function() {
        self.skipWaiting();
      })
  );
});

this.addEventListener('fetch', event => {
  console.log('fetch', event);
  const promise = Promise.race([
    fetch(event.request),
    new Promise(function(resolve, reject) {
      setTimeout(reject, 3000);
    }),
  ])
    .catch(function() {
      return caches.match(event.request)
        .catch(function() {
          console.log('request does not match anything in the cache, and network is not available');
        });
    });
  event.respondWith(promise);
});

this.addEventListener('activate', (event) => {
  console.log('activate');
  const deleteOldCachePromise = caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== cacheVersion)
          .map(name => {
            console.log('caches.delete', caches.delete);
            var deletePromise = caches.delete(name);
            console.log('cache delete result: ', deletePromise);
          }),
      );
    });
  event.waitUntil(
    deleteOldCachePromise
      .then(() => {
        self.clients.claim();
      })
  );
});

