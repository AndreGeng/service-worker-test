
// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker-test/src/sw.js')
    .then(function(reg) {
      console.log('Registration succeeded. Scope is ' + reg.scope);
      console.log('reg', reg);
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
}
