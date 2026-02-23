// ==========================================
//  DB.JS — Firestore Cloud Save / Load
// ==========================================

let _cloudSaveTimer = null;
const CLOUD_SAVE_DEBOUNCE = 2000; // 2 seconds debounce

// ---- Save to Cloud (debounced) ----
function cloudSaveDebounced() {
    if (!currentUser) return;
    if (_cloudSaveTimer) clearTimeout(_cloudSaveTimer);
    _cloudSaveTimer = setTimeout(() => cloudSave(), CLOUD_SAVE_DEBOUNCE);
}

// ---- Immediate Cloud Save ----
async function cloudSave() {
    if (!currentUser || !D) return;
    try {
        const uid = currentUser.uid;
        // Strip transient fields before saving
        const saveData = JSON.parse(JSON.stringify(D));
        delete saveData._pendingDecayReport;

        await fireDB.collection('hunters').doc(uid).set({
            gameData: saveData,
            profile: {
                displayName: currentUser.displayName || D.settings.playerName || 'Hunter',
                email: currentUser.email || null,
                photoURL: currentUser.photoURL || null,
                isAnonymous: currentUser.isAnonymous || false
            },
            lastSaved: firebase.firestore.FieldValue.serverTimestamp(),
            appVersion: 5
        }, { merge: true });

        updateSyncIndicator('saved');
        console.log('[System] Cloud save complete.');
    } catch (err) {
        console.error('[System] Cloud save failed:', err);
        updateSyncIndicator('error');
    }
}

// ---- Load from Cloud ----
async function loadGameFromCloud(uid) {
    try {
        const doc = await fireDB.collection('hunters').doc(uid).get();

        if (doc.exists && doc.data().gameData) {
            const cloudData = doc.data().gameData;

            // Merge with defaults (in case new fields were added)
            const def = getDefaultData();
            D = def;
            Object.assign(D, cloudData);

            // Deep merge nested objects
            for (const k in def.stats) {
                if (!(k in D.stats)) D.stats[k] = def.stats[k];
            }
            if (!D.physique) D.physique = def.physique;
            if (!D.settings) D.settings = def.settings;
            if (!D.shop) D.shop = def.shop;

            // Also update localStorage as offline fallback
            localStorage.setItem('soloLevelingSystem', JSON.stringify(D));
            console.log('[System] Loaded from cloud. Level:', D.level);
            updateSyncIndicator('saved');
        } else {
            // New user — load from localStorage or create fresh
            console.log('[System] New hunter detected. Creating profile...');
            loadGame(); // loads from localStorage or creates default

            // Set player name from Google profile if available
            if (currentUser && currentUser.displayName && D.settings.playerName === 'Hunter') {
                D.settings.playerName = currentUser.displayName;
            }

            // Save initial data to cloud
            saveGame();
            await cloudSave();
        }
    } catch (err) {
        console.error('[System] Cloud load failed, using local data:', err);
        loadGame(); // fallback to localStorage
        updateSyncIndicator('error');
    }
}

// ---- Sync Indicator ----
function updateSyncIndicator(status) {
    const el = document.getElementById('syncIndicator');
    if (!el) return;
    switch (status) {
        case 'saving':
            el.textContent = '↑';
            el.className = 'sync-indicator sync-saving';
            el.title = 'Saving to cloud...';
            break;
        case 'saved':
            el.textContent = '☁';
            el.className = 'sync-indicator sync-saved';
            el.title = 'Saved to cloud';
            break;
        case 'error':
            el.textContent = '⚠';
            el.className = 'sync-indicator sync-error';
            el.title = 'Cloud sync error';
            break;
        case 'offline':
            el.textContent = '○';
            el.className = 'sync-indicator sync-offline';
            el.title = 'Offline — using local data';
            break;
    }
}

// ---- Online / Offline Detection ----
window.addEventListener('online', () => {
    console.log('[System] Connection restored.');
    updateSyncIndicator('saving');
    cloudSave();
});

window.addEventListener('offline', () => {
    console.log('[System] Connection lost. Data saved locally.');
    updateSyncIndicator('offline');
});

// ---- Delete Cloud Data (for account reset) ----
async function deleteCloudData() {
    if (!currentUser) return;
    try {
        await fireDB.collection('hunters').doc(currentUser.uid).delete();
        console.log('[System] Cloud data deleted.');
    } catch (err) {
        console.error('[System] Failed to delete cloud data:', err);
    }
}
