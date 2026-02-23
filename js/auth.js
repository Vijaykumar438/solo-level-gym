// ==========================================
//  AUTH.JS — Firebase Authentication
// ==========================================

let currentUser = null;

// ---- Google Sign-In ----
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
        const result = await fireAuth.signInWithPopup(provider);
        return result.user;
    } catch (err) {
        console.error('[System] Google sign-in failed:', err);
        // Show error on login screen
        const errEl = document.getElementById('loginError');
        if (errEl) {
            if (err.code === 'auth/popup-closed-by-user') {
                errEl.textContent = '[Authentication cancelled by user]';
            } else if (err.code === 'auth/network-request-failed') {
                errEl.textContent = '[Network error — check connection]';
            } else {
                errEl.textContent = `[Error: ${err.message}]`;
            }
            errEl.classList.remove('hidden');
        }
        return null;
    }
}

// ---- Guest Sign-In (anonymous) ----
async function signInAsGuest(displayName) {
    try {
        const result = await fireAuth.signInAnonymously();
        // Store display name in user profile doc
        if (result.user && displayName) {
            await result.user.updateProfile({ displayName: displayName });
        }
        return result.user;
    } catch (err) {
        console.error('[System] Guest sign-in failed:', err);
        const errEl = document.getElementById('loginError');
        if (errEl) {
            errEl.textContent = `[Error: ${err.message}]`;
            errEl.classList.remove('hidden');
        }
        return null;
    }
}

// ---- Link Guest to Google (upgrade anonymous account) ----
async function linkGuestToGoogle() {
    if (!currentUser || !currentUser.isAnonymous) return false;
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await currentUser.linkWithPopup(provider);
        currentUser = result.user;
        sysNotify('[System] Account linked to Google. Progress is permanent.', 'green');
        updateUserUI();
        return true;
    } catch (err) {
        if (err.code === 'auth/credential-already-in-use') {
            sysNotify('[System] This Google account is already linked to another hunter.', 'red');
        } else {
            console.error('[System] Account linking failed:', err);
            sysNotify('[System] Failed to link account.', 'red');
        }
        return false;
    }
}

// ---- Sign Out ----
async function signOutUser() {
    try {
        // Save before signing out
        saveGame();
        await cloudSave();
        await fireAuth.signOut();
        currentUser = null;
        // Show login screen
        showLoginScreen();
    } catch (err) {
        console.error('[System] Sign out error:', err);
    }
}

// ---- Auth State Listener ----
function initAuthListener() {
    fireAuth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            console.log('[System] Authenticated:', user.displayName || user.uid);

            // Hide login, proceed with app init
            hideLoginScreen();

            // Load game data from cloud (or create new)
            await loadGameFromCloud(user.uid);

            // Run normal init sequence
            appInit();

            // Update user display in header
            updateUserUI();
        } else {
            currentUser = null;
            showLoginScreen();
        }
    });
}

// ---- Update User Display in Header ----
function updateUserUI() {
    const nameEl = document.getElementById('userDisplayName');
    const avatarEl = document.getElementById('userAvatar');
    const linkBtn = document.getElementById('linkGoogleBtn');

    if (!currentUser) return;

    const name = currentUser.displayName || D.settings.playerName || 'Hunter';
    if (nameEl) nameEl.textContent = name;

    if (avatarEl) {
        if (currentUser.photoURL) {
            avatarEl.src = currentUser.photoURL;
            avatarEl.style.display = 'block';
        } else {
            avatarEl.style.display = 'none';
        }
    }

    // Show "Link Google" button only for anonymous users
    if (linkBtn) {
        linkBtn.classList.toggle('hidden', !currentUser.isAnonymous);
    }
}

// ---- Show / Hide Login Screen ----
function showLoginScreen() {
    const login = document.getElementById('loginScreen');
    const boot = document.getElementById('bootScreen');
    const main = document.getElementById('mainApp');
    if (login) login.classList.remove('hidden');
    if (boot) boot.classList.add('hidden');
    if (main) main.classList.add('hidden');
}

function hideLoginScreen() {
    const login = document.getElementById('loginScreen');
    const boot = document.getElementById('bootScreen');
    if (login) {
        login.style.opacity = '0';
        login.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            login.classList.add('hidden');
            login.style.opacity = '';
            login.style.transition = '';
        }, 500);
    }
    // Show boot screen for the boot sequence
    if (boot) boot.classList.remove('hidden');
}
