const CACHE_NAME = 'mon-site-cache-v1';
 const urlsToCache = ['/history', '/Watch','/downloads']; 
self.addEventListener('install', event => { 
  event.waitUntil( caches.open(CACHE_NAME).then(
    cache => cache.addAll(urlsToCache)) ); 
  }); 
self.addEventListener('fetch', event => {
   event.respondWith( caches.match(event.request).then(response => {
     // Accès au cache - réponse de retour if (réponse) { return réponse; } 
     return fetch( event.request); }) ); 
    }); 