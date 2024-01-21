const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = ['/history', '/Watch','/downloads'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })const CACHE_NAME = 'my-site-cache-v1';
    const urlsToCache = ['/history', '/Watch', '/downloads'];
    
    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(urlsToCache))
      );
    });
    
    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            // Cache hit - return response
            if (response) {
              return response;
            }
    
            // Clone the request to make sure it can be used by both the cache and fetch
            const fetchRequest = event.request.clone();
    
            return fetch(fetchRequest)
              .then(response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
    
                // Clone the response to store it in the cache
                const responseToCache = response.clone();
    
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
    
                return response;
              });
          })
      );
    });
    
    self.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
    
  );
});


