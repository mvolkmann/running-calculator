'use strict';
/*eslint no-invalid-this: 0 */

console.log('entered service worker');

this.addEventListener('install', event => {
  const promise = caches.open('v1').
    then(cache => {
      return cache.addAll([
        '/index.html',
        '/running-calculator.css',
        '/running-calculator.js',
        '/images/Boston2013.jpg'
        //'/service-worker.js' // shouldn't be cached
      ]);
    });
  event.waitUntil(promise);
});

this.addEventListener('fetch', event => {
  console.log('got fetch event =', event);
  let response;

  const promise =
    // Try to find in cache.
    caches.match(event.request).
    // If not found in cache ...
    catch(() => {
      // try to download from network.
      return fetch(event.request);
    }).
    // If successfully downloaded from network ...
    then(r => {
      console.log('successfully downloaded from network, r =', r);
      console.log('successfully downloaded from network,',
        'r.prototype.constructor =', r.prototype.constructor);
      // add the contents to cache for next time.
      response = r;
      caches.open('v1').then(cache => {
        cache.put(event.request, response);
      });
      return response.clone();
    }).
    // Failed to download from network.
    catch(() => { // Omit this catch to allow an error.
      // Use a default file.
      return caches.match('/sw-test/gallery/myLittleVader.jpg');
    });

  event.respondWith(promise);
});

this.addEventListener('activate', event => {
  console.log('service worker was activated; event =', event);
  // Uncomment this when version 2 is ready.
  /*
  const cacheWhitelist = ['v2'];

  const promise = caches.keys().
    then(keyList =>
      // Delete any caches not in cacheWhitelist.
      Promise.all(keyList.map(key =>
        cacheWhitelist.includes(key) ?
          null :
          caches.delete(key))));

  event.waitUntil(promise);
  */
});
