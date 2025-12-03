const CACHE_VERSION = 'cranksmith-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/builder',
    '/performance',
    '/tire-pressure',
    '/weight',
    '/offline',
    '/icon-192.jpeg',
    '/icon-512.jpeg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('cranksmith-') &&
                                cacheName !== STATIC_CACHE &&
                                cacheName !== DYNAMIC_CACHE &&
                                cacheName !== IMAGE_CACHE &&
                                cacheName !== API_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // API requests - Network first, fallback to cache
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response
                    const responseClone = response.clone();

                    // Cache successful responses
                    if (response.status === 200) {
                        caches.open(API_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Return offline response for API calls
                            return new Response(
                                JSON.stringify({ error: 'Offline', offline: true }),
                                {
                                    headers: { 'Content-Type': 'application/json' },
                                    status: 503
                                }
                            );
                        });
                })
        );
        return;
    }

    // Images - Cache first, fallback to network
    if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|webp|svg|gif|ico)$/)) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(request)
                        .then((response) => {
                            // Clone and cache the response
                            const responseClone = response.clone();
                            caches.open(IMAGE_CACHE).then((cache) => {
                                cache.put(request, responseClone);
                            });
                            return response;
                        });
                })
        );
        return;
    }

    // CSS and JS - Cache first, fallback to network
    if (url.pathname.match(/\.(css|js)$/)) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    return cachedResponse || fetch(request)
                        .then((response) => {
                            const responseClone = response.clone();
                            caches.open(STATIC_CACHE).then((cache) => {
                                cache.put(request, responseClone);
                            });
                            return response;
                        });
                })
        );
        return;
    }

    // Pages - Stale-while-revalidate strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        // Update cache in background
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, networkResponse.clone());
                        });
                        return networkResponse;
                    })
                    .catch(() => {
                        // If both network and cache fail, show offline page
                        if (request.mode === 'navigate') {
                            return caches.match('/offline');
                        }
                    });

                // Return cached version immediately, update in background
                return cachedResponse || fetchPromise;
            })
    );
});

// Handle background sync for failed requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-builds') {
        event.waitUntil(syncBuilds());
    }
});

async function syncBuilds() {
    console.log('[SW] Background sync triggered, notifying clients');

    // Notify all clients to process their sync queues
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'PROCESS_SYNC_QUEUE'
        });
    });
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'CrankSmith';
    const options = {
        body: data.body || 'New update available',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: data.url
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});
