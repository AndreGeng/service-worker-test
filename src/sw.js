console.log('sw', this);
this.addEventListener('install', function(event) {
  event.waitUnit(
    caches
    .open('v1')
    .then(function(cache) {
      return cache.addAll([
        '/src/style.css',
        '/src/index.js',
      ]);
    })
  );
});
