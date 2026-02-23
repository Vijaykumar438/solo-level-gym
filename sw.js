// ==========================================
//  SERVICE WORKER — Offline PWA support
// ==========================================

const CACHE_NAME = 'solo-leveling-v7';
const ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/panels.css',
    '/css/animations.css',
    '/css/features.css',
    '/css/mobile.css',
    '/js/firebase-config.js',
    '/js/auth.js',
    '/js/db.js',
    '/js/data.js',
    '/js/sounds.js',
    '/js/engine.js',
    '/js/quests.js',
    '/js/shop.js',
    '/js/ui.js',
    '/js/charts.js',
    '/js/features.js',
    '/js/avatar.js',
    '/js/app.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap'
];

// Install — cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — network-first for local assets, cache-first for CDN
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const isLocal = url.origin === self.location.origin;

    if (isLocal) {
        // Network-first: always try to get latest version
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            try { cache.put(event.request, clone); } catch(e) {}
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Offline: serve from cache
                    return caches.match(event.request).then(cached => {
                        if (cached) return cached;
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
                })
        );
    } else {
        // CDN assets: cache-first
        event.respondWith(
            caches.match(event.request)
                .then(cached => {
                    if (cached) return cached;
                    return fetch(event.request).then(response => {
                        if (response.ok && event.request.method === 'GET') {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                try { cache.put(event.request, clone); } catch(e) {}
                            });
                        }
                        return response;
                    });
                })
        );
    }
});
