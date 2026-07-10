var cacheName = 'geeks-cache-v1';
var cacheAssets = [
    '/assets/notfound.html',
    '/assets/notfound.css'

];

// Call install Event
self.addEventListener('install', e => {
    // Wait until promise is finished 
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            cache.addAll(cacheAssets)
                // When everything is set
                .then(() => self.skipWaiting())
        })
    );
})