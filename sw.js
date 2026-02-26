// ==========================================
//  SERVICE WORKER — Offline PWA support
// ==========================================

const CACHE_NAME = 'solo-leveling-v40';
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
    '/js/narrator.js',
    '/js/app.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // Boss SVG icons (Mbosses — 122 icons)
    '/icons/Mbosses/caro-asercion/cloaked-figure-on-horseback.svg',
    '/icons/Mbosses/caro-asercion/goblin.svg',
    '/icons/Mbosses/cathelineau/bad-gnome.svg',
    '/icons/Mbosses/cathelineau/fomorian.svg',
    '/icons/Mbosses/cathelineau/medusa-head.svg',
    '/icons/Mbosses/cathelineau/transparent-slime.svg',
    '/icons/Mbosses/cathelineau/tree-face.svg',
    '/icons/Mbosses/cathelineau/witch-face.svg',
    '/icons/Mbosses/delapouite/alien-bug.svg',
    '/icons/Mbosses/delapouite/alien-egg.svg',
    '/icons/Mbosses/delapouite/anubis.svg',
    '/icons/Mbosses/delapouite/bottled-shadow.svg',
    '/icons/Mbosses/delapouite/brain-tentacle.svg',
    '/icons/Mbosses/delapouite/brute.svg',
    '/icons/Mbosses/delapouite/bullet-bill.svg',
    '/icons/Mbosses/delapouite/bully-minion.svg',
    '/icons/Mbosses/delapouite/carnivorous-plant.svg',
    '/icons/Mbosses/delapouite/ceiling-barnacle.svg',
    '/icons/Mbosses/delapouite/centaur.svg',
    '/icons/Mbosses/delapouite/daemon-pull.svg',
    '/icons/Mbosses/delapouite/devil-mask.svg',
    '/icons/Mbosses/delapouite/djinn.svg',
    '/icons/Mbosses/delapouite/drakkar-dragon.svg',
    '/icons/Mbosses/delapouite/egyptian-sphinx.svg',
    '/icons/Mbosses/delapouite/elysium-shade.svg',
    '/icons/Mbosses/delapouite/fairy.svg',
    '/icons/Mbosses/delapouite/female-vampire.svg',
    '/icons/Mbosses/delapouite/fish-monster.svg',
    '/icons/Mbosses/delapouite/floating-ghost.svg',
    '/icons/Mbosses/delapouite/floating-tentacles.svg',
    '/icons/Mbosses/delapouite/gargoyle.svg',
    '/icons/Mbosses/delapouite/giant.svg',
    '/icons/Mbosses/delapouite/goblin-head.svg',
    '/icons/Mbosses/delapouite/golem-head.svg',
    '/icons/Mbosses/delapouite/grasping-slug.svg',
    '/icons/Mbosses/delapouite/greek-sphinx.svg',
    '/icons/Mbosses/delapouite/griffin-symbol.svg',
    '/icons/Mbosses/delapouite/half-body-crawling.svg',
    '/icons/Mbosses/delapouite/horned-reptile.svg',
    '/icons/Mbosses/delapouite/horus.svg',
    '/icons/Mbosses/delapouite/ice-golem.svg',
    '/icons/Mbosses/delapouite/jawless-cyclop.svg',
    '/icons/Mbosses/delapouite/kenku-head.svg',
    '/icons/Mbosses/delapouite/kraken-tentacle.svg',
    '/icons/Mbosses/delapouite/mermaid.svg',
    '/icons/Mbosses/delapouite/metroid.svg',
    '/icons/Mbosses/delapouite/mimic-chest.svg',
    '/icons/Mbosses/delapouite/mummy-head.svg',
    '/icons/Mbosses/delapouite/ogre.svg',
    '/icons/Mbosses/delapouite/oni.svg',
    '/icons/Mbosses/delapouite/orc-head.svg',
    '/icons/Mbosses/delapouite/pick-of-destiny.svg',
    '/icons/Mbosses/delapouite/purple-tentacle.svg',
    '/icons/Mbosses/delapouite/resting-vampire.svg',
    '/icons/Mbosses/delapouite/rock-golem.svg',
    '/icons/Mbosses/delapouite/sasquatch.svg',
    '/icons/Mbosses/delapouite/shambling-mound.svg',
    '/icons/Mbosses/delapouite/shambling-zombie.svg',
    '/icons/Mbosses/delapouite/slime.svg',
    '/icons/Mbosses/delapouite/spider-eye.svg',
    '/icons/Mbosses/delapouite/spiked-dragon-head.svg',
    '/icons/Mbosses/delapouite/swallower.svg',
    '/icons/Mbosses/delapouite/swamp-bat.svg',
    '/icons/Mbosses/delapouite/thwomp.svg',
    '/icons/Mbosses/delapouite/troglodyte.svg',
    '/icons/Mbosses/delapouite/unicorn.svg',
    '/icons/Mbosses/delapouite/vampire-dracula.svg',
    '/icons/Mbosses/faithtoken/dragon-head.svg',
    '/icons/Mbosses/lorc/beast-eye.svg',
    '/icons/Mbosses/lorc/behold.svg',
    '/icons/Mbosses/lorc/bestial-fangs.svg',
    '/icons/Mbosses/lorc/cracked-alien-skull.svg',
    '/icons/Mbosses/lorc/cyclops.svg',
    '/icons/Mbosses/lorc/daemon-skull.svg',
    '/icons/Mbosses/lorc/diablo-skull.svg',
    '/icons/Mbosses/lorc/dinosaur-bones.svg',
    '/icons/Mbosses/lorc/dinosaur-egg.svg',
    '/icons/Mbosses/lorc/dinosaur-rex.svg',
    '/icons/Mbosses/lorc/double-dragon.svg',
    '/icons/Mbosses/lorc/dragon-head.svg',
    '/icons/Mbosses/lorc/dragon-spiral.svg',
    '/icons/Mbosses/lorc/ent-mouth.svg',
    '/icons/Mbosses/lorc/evil-bat.svg',
    '/icons/Mbosses/lorc/evil-book.svg',
    '/icons/Mbosses/lorc/evil-comet.svg',
    '/icons/Mbosses/lorc/evil-fork.svg',
    '/icons/Mbosses/lorc/evil-minion.svg',
    '/icons/Mbosses/lorc/evil-moon.svg',
    '/icons/Mbosses/lorc/evil-tree.svg',
    '/icons/Mbosses/lorc/eyestalk.svg',
    '/icons/Mbosses/lorc/fairy.svg',
    '/icons/Mbosses/lorc/fleshy-mass.svg',
    '/icons/Mbosses/lorc/frankenstein-creature.svg',
    '/icons/Mbosses/lorc/ghost.svg',
    '/icons/Mbosses/lorc/gluttonous-smile.svg',
    '/icons/Mbosses/lorc/gooey-daemon.svg',
    '/icons/Mbosses/lorc/grim-reaper.svg',
    '/icons/Mbosses/lorc/harpy.svg',
    '/icons/Mbosses/lorc/haunting.svg',
    '/icons/Mbosses/lorc/horned-skull.svg',
    '/icons/Mbosses/lorc/hydra.svg',
    '/icons/Mbosses/lorc/hydra-shot.svg',
    '/icons/Mbosses/lorc/ifrit.svg',
    '/icons/Mbosses/lorc/imp.svg',
    '/icons/Mbosses/lorc/imp-laugh.svg',
    '/icons/Mbosses/lorc/infested-mass.svg',
    '/icons/Mbosses/lorc/lizardman.svg',
    '/icons/Mbosses/lorc/minotaur.svg',
    '/icons/Mbosses/lorc/pretty-fangs.svg',
    '/icons/Mbosses/lorc/sea-dragon.svg',
    '/icons/Mbosses/lorc/sharp-smile.svg',
    '/icons/Mbosses/lorc/spark-spirit.svg',
    '/icons/Mbosses/lorc/spectre.svg',
    '/icons/Mbosses/lorc/toad-teeth.svg',
    '/icons/Mbosses/lorc/triton-head.svg',
    '/icons/Mbosses/lorc/unfriendly-fire.svg',
    '/icons/Mbosses/lorc/vile-fluid.svg',
    '/icons/Mbosses/lorc/werewolf.svg',
    '/icons/Mbosses/lorc/witch-flight.svg',
    '/icons/Mbosses/lorc/wyvern.svg',
    '/icons/Mbosses/skoll/sea-creature.svg',
    '/icons/Mbosses/skoll/troll.svg',
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

// Handle notification click — open the app
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'dismiss') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Focus existing window if open
            for (const client of windowClients) {
                if (client.url.includes('/index.html') || client.url.endsWith('/')) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            return clients.openWindow('/');
        })
    );
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
