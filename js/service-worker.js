const CACHE_NAME = 'deliverypay-v1';

self.addEventListener('install', event => {
    console.log('ServiceWorker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('ServiceWorker activating...');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    // Only handle same-origin requests
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
                .catch(() => {
                    // Return a fallback for navigation requests
                    if (event.request.mode === 'navigate') {
                        return new Response('Offline - Please check your connection', {
                            status: 200,
                            headers: { 'Content-Type': 'text/html' }
                        });
                    }
                })
        );
    }
});