'use strict';
/*eslint no-invalid-this: 0 */

this.addEventListener('install', event => {
  console.log('service worker received install event');
  // This seems to be needed even though the fetch listener
  // adds all downloaded files to the cache.
  const promise = caches.open('v1').
    then(cache => {
      return cache.addAll([
        '/index.html',
        '/favicon.ico',
        '/running-calculator.css',
        '/running-calculator.js',
        '/images/Boston2013.jpg'
        //'/service-worker.js' // shouldn't be cached
      ]);
    });

  const ctorName = promise.constructor.name;
  if (ctorName !== 'Promise') {
    console.error('install event handler created a', ctorName,
      'instead of a Promise');
  } else {
    event.waitUntil(promise);
  }
});

// Intercepts each HTTP request.
this.addEventListener('fetch', event => {
  console.log('service worker received fetch event for', event.request.url);
  const promise =
    // Try to find in cache.
    caches.match(event.request).
    // If not found in cache ...
    catch(() => {
      // Try to download from network.
      return fetch(event.request);
    }).
    // If successfully downloaded from network ...
    then(response => {
      console.log('successfully downloaded from network', response.url);
      // Add the contents to cache for next time.
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

  const ctorName = promise.constructor.name;
  if (ctorName !== 'Promise') {
    console.error('fetch event handler created a', ctorName,
      'instead of a Promise');
  } else {
    event.respondWith(promise);
  }
});

this.addEventListener('activate', () => {
  console.log('service worker received activate event');
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
