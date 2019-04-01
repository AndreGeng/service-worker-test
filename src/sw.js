console.log('sw', this);
this.addEventListener('install', function(event) {
  event.waitUnit(
    caches
    .open('v1')
    .then(function(cache) {
      return cache.addAll([
        'service-worker-test/src/style.css',
        'service-worker-test/src/index.js',
      ]);
    })
  );
});
