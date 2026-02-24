// ==========================================
//  SERVICE WORKER — Offline PWA support
// ==========================================

const CACHE_NAME = 'solo-leveling-v28';
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
    '/js/tutorial.js',
    '/js/journal.js',
    '/js/templates.js',
    '/js/avatar.js',
    '/js/app.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // Boss SVG icons
    '/icons/bosses/iron_golem.svg',
    '/icons/bosses/stone_sentinel.svg',
    '/icons/bosses/ruin_crawler.svg',
    '/icons/bosses/cerberus.svg',
    '/icons/bosses/venom_serpent.svg',
    '/icons/bosses/shadow_stalker.svg',
    '/icons/bosses/ice_monarch.svg',
    '/icons/bosses/blood_ogre.svg',
    '/icons/bosses/thunder_wyvern.svg',
    '/icons/bosses/curse_wraith.svg',
    '/icons/bosses/demon_king_baran.svg',
    '/icons/bosses/flame_titan.svg',
    '/icons/bosses/abyss_knight.svg',
    '/icons/bosses/bone_dragon.svg',
    '/icons/bosses/frost_dragon.svg',
    '/icons/bosses/monarch_of_plague.svg',
    '/icons/bosses/beast_sovereign.svg',
    '/icons/bosses/iron_body_monarch.svg',
    '/icons/bosses/antares.svg',
    '/icons/bosses/shadow_monarch.svg',
    '/icons/bosses/legia.svg',
    '/icons/bosses/monarch_of_frost.svg',
    '/icons/bosses/beru.svg',
    '/icons/bosses/the_absolute_being.svg',
    '/icons/bosses/ashborn_reborn.svg',
    '/icons/bosses/ruler_of_death.svg',
    '/icons/bosses/the_architect.svg',
    '/icons/bosses/chaos_sovereign.svg',
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
// Listen for skip waiting message from client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

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
