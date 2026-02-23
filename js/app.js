// ==========================================
//  APP.JS — Initialization & Event Binding
// ==========================================

// ---- PWA Install Prompt ----
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner();
});

function showInstallBanner() {
    // Don't show if already installed or dismissed recently
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('installDismissed')) return;

    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
        <img src="icons/icon-96.png" alt="SYSTEM">
        <div class="install-banner-text">
            <div class="install-banner-title">Install SYSTEM</div>
            <div class="install-banner-sub">Add to home screen for full experience</div>
        </div>
        <button class="sys-btn" id="installBtn">[INSTALL]</button>
        <button class="install-banner-close" id="installDismiss">✕</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('installBtn').addEventListener('click', async () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const result = await deferredInstallPrompt.userChoice;
            if (result.outcome === 'accepted') {
                sysNotify('[System] App installed. You are now bound to the System.', 'green');
            }
            deferredInstallPrompt = null;
        }
        banner.remove();
    });

    document.getElementById('installDismiss').addEventListener('click', () => {
        banner.remove();
        sessionStorage.setItem('installDismissed', '1');
    });
}

// ---- Haptic Vibration Helper ----
function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// ---- Boot Sequence ----
function bootSequence() {
    const lines = document.querySelectorAll('.boot-msg');
    const bootScreen = document.getElementById('bootScreen');
    const mainApp = document.getElementById('mainApp');
    const enterBtn = document.getElementById('bootEnter');

    let i = 0;
    function showLine() {
        if (i < lines.length) {
            lines[i].classList.add('show');
            i++;
            setTimeout(showLine, 350);
        } else {
            // Show enter button after messages
            enterBtn.classList.remove('hidden');
            enterBtn.addEventListener('click', () => {
                if (typeof playSound === 'function') playSound('boot');
                bootScreen.style.opacity = '0';
                setTimeout(() => {
                    bootScreen.classList.add('hidden');
                    mainApp.classList.remove('hidden');
                    mainApp.style.opacity = '0';
                    requestAnimationFrame(() => {
                        mainApp.style.transition = 'opacity 0.8s';
                        mainApp.style.opacity = '1';
                    });
                    initParticles();
                    refreshUI();
                    renderAllCharts();
                    sysNotify('[System] Player recognized. Welcome back, Hunter.', 'blue');
                    
                    // Wisdom on status panel
                    document.getElementById('wisdomText').textContent = `"${getRandomWisdom()}"`;

                    // Check daily login reward
                    if (typeof checkDailyLogin === 'function') checkDailyLogin();

                    // Init weekly boss
                    if (typeof getWeeklyBoss === 'function') getWeeklyBoss();

                    // Start shadow mission scheduler
                    if (typeof startShadowMissionScheduler === 'function') startShadowMissionScheduler();
                    
                    // Show decay report if player was absent
                    if (D._pendingDecayReport) {
                        setTimeout(() => {
                            if (typeof showDecayReport === 'function') showDecayReport(D._pendingDecayReport);
                        }, 800);
                    }
                }, 600);
            });
        }
    }
    showLine();
}

// ---- Particle Canvas ----
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const COUNT = 50;
    
    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.8 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: -(Math.random() * 0.6 + 0.1),
            a: Math.random() * 0.5 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(79,195,247,${p.a})`;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ---- Calorie Auto-Preview ----
function updateCalPreview() {
    const p = parseFloat(document.getElementById('logProtein').value) || 0;
    const c = parseFloat(document.getElementById('logCarbs').value) || 0;
    const f = parseFloat(document.getElementById('logFats').value) || 0;
    const cal = (p * 4) + (c * 4) + (f * 9);
    document.getElementById('calPreview').textContent = cal + ' kcal estimated';
}

// ---- Form Handlers ----
function handleWorkoutSubmit() {
    const exercise = document.getElementById('logExercise').value;
    const reps = parseInt(document.getElementById('logReps').value) || 0;
    const sets = parseInt(document.getElementById('logSets').value) || 0;
    const weight = parseFloat(document.getElementById('logWeight').value) || 0;
    const intensity = document.getElementById('logIntensity').value;

    if (!exercise || reps <= 0 || sets <= 0) {
        sysNotify('[System] Incomplete data. Fill all fields.', 'red');
        return;
    }

    const result = logWorkout(exercise, reps, sets, weight, intensity);
    vibrate([30, 50, 30]);
    if (typeof playSound === 'function') playSound('workout');
    sysNotify(`[Workout Logged] ${exercise} — +${result.xpGain} XP, -${result.calBurned} cal`, 'green');
    document.getElementById('logExercise').value = '';
    document.getElementById('logReps').value = '';
    document.getElementById('logSets').value = '1';
    document.getElementById('logWeight').value = '';
    document.getElementById('logIntensity').value = 'medium';
    refreshUI();
}

function handleFoodSubmit() {
    const food = document.getElementById('logFood').value;
    const meal = document.getElementById('logMeal').value;
    const protein = parseFloat(document.getElementById('logProtein').value) || 0;
    const carbs = parseFloat(document.getElementById('logCarbs').value) || 0;
    const fats = parseFloat(document.getElementById('logFats').value) || 0;

    if (!food) {
        sysNotify('[System] Name the sustenance.', 'red');
        return;
    }

    const result = logFood(food, meal, protein, carbs, fats);
    vibrate(20);
    if (typeof playSound === 'function') playSound('food');
    sysNotify(`[Food Logged] ${food} — ${result.calories} kcal, +${result.xpGain} XP`, 'blue');
    document.getElementById('logFood').value = '';
    document.getElementById('logProtein').value = '';
    document.getElementById('logCarbs').value = '';
    document.getElementById('logFats').value = '';
    document.getElementById('calPreview').textContent = '0 kcal estimated';
    refreshUI();
}

function handlePhysiqueSubmit() {
    const cur = parseFloat(document.getElementById('pCurWeight').value);
    const tar = parseFloat(document.getElementById('pTarWeight').value);

    if (!cur || !tar) {
        sysNotify('[System] Provide both weights.', 'red');
        return;
    }

    updatePhysique(cur, tar);
    sysNotify('[Physique Updated] The System tracks your form.', 'blue');
    refreshUI();
}

// ---- Delete Handlers ----
function handleDeleteWorkout(id) {
    deleteWorkout(id);
    refreshUI();
    sysNotify('[Removed] Workout entry deleted.', '');
}

function handleDeleteFood(id) {
    deleteFood(id);
    refreshUI();
    sysNotify('[Removed] Food entry deleted.', '');
}

// ---- Stat Allocation ----
function handleStatAllocate(stat) {
    if (D.freePoints <= 0) {
        sysNotify('[System] No free points available.', 'red');
        return;
    }
    allocateStat(stat);
    vibrate(15);
    if (typeof playSound === 'function') playSound('statUp');
    sysNotify(`[+1 ${stat.toUpperCase()}] Stat enhanced.`, 'green');
    refreshUI();
}

// ---- Player Name ----
function handleNameChange() {
    const name = prompt('Enter your Hunter name:', D.settings.playerName);
    if (name && name.trim()) {
        D.settings.playerName = name.trim();
        saveGame();
        refreshUI();
        sysNotify(`[System] Identity updated: ${name.trim()}`, 'blue');
    }
}

// ---- Data Management ----
function handleExportData() {
    const blob = new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solo-leveling-save.json';
    a.click();
    URL.revokeObjectURL(url);
    sysNotify('[System] Save file exported.', 'blue');
}

function handleImportData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                if (imported.level !== undefined) {
                    // Reset and load imported data with defaults merge
                    const def = getDefaultData();
                    D = def;
                    Object.assign(D, imported);
                    // Ensure nested objects have all keys
                    for (const k in def.stats) {
                        if (!(k in D.stats)) D.stats[k] = def.stats[k];
                    }
                    if (!D.physique) D.physique = def.physique;
                    if (!D.settings) D.settings = def.settings;
                    if (!D.shop) D.shop = def.shop;
                    saveGame();
                    refreshUI();
                    renderAllCharts();
                    sysNotify('[System] Save file loaded. Welcome back, Hunter.', 'green');
                } else {
                    sysNotify('[System] Invalid save file.', 'red');
                }
            } catch {
                sysNotify('[System] Failed to parse save file.', 'red');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function handleResetData() {
    const overlay = document.getElementById('resetOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function confirmReset() {
    localStorage.removeItem('soloLevelingSystem');
    if (typeof deleteCloudData === 'function') deleteCloudData();
    location.reload();
}

function cancelReset() {
    const overlay = document.getElementById('resetOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// ============================
//  MAIN INIT
// ============================

// ---- App Init (called AFTER authentication) ----
function appInit() {
    // Load game data (already loaded from cloud in auth flow, but ensure local is synced)
    if (!D) {
        try { loadGame(); } catch(e) { console.error('[System] loadGame error:', e); D = getDefaultData(); }
    }

    // Check for new day (missed day penalties, clear old quests)
    try { checkNewDay(); } catch(e) { console.error('[System] checkNewDay error:', e); }

    // Generate quests if needed
    try { generateDailyQuests(); } catch(e) { console.error('[System] generateDailyQuests error:', e); }

    // Initialize shop data
    try { if (typeof initShopData === 'function') initShopData(); } catch(e) { console.error('[System] initShopData error:', e); }

    // Initialize tabs
    initTabs();

    // Boot animation
    bootSequence();
}

document.addEventListener('DOMContentLoaded', () => {
    // ---- Login Screen Event Bindings ----

    // Google Sign-In button
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            googleBtn.disabled = true;
            googleBtn.innerHTML = '<span class="login-btn-spinner"></span> Connecting...';
            const errEl = document.getElementById('loginError');
            if (errEl) errEl.classList.add('hidden');
            await signInWithGoogle();
            googleBtn.disabled = false;
            googleBtn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="google-icon" alt=""> Sign in with Google';
        });
    }

    // Guest Sign-In button
    const guestBtn = document.getElementById('guestSignInBtn');
    if (guestBtn) {
        guestBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('guestNameInput');
            const name = nameInput ? nameInput.value.trim() : '';
            if (!name) {
                const errEl = document.getElementById('loginError');
                if (errEl) {
                    errEl.textContent = '[Enter a Hunter name to continue]';
                    errEl.classList.remove('hidden');
                }
                return;
            }
            guestBtn.disabled = true;
            guestBtn.textContent = '[AWAKENING...]';
            await signInAsGuest(name);
            guestBtn.disabled = false;
            guestBtn.textContent = '[ENTER AS GUEST]';
        });
    }

    // Enter key on guest name input
    const guestInput = document.getElementById('guestNameInput');
    if (guestInput) {
        guestInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (guestBtn) guestBtn.click();
            }
        });
    }

    // ---- Start Auth Listener (triggers appInit on success) ----
    initAuthListener();

    // ---- Event Bindings ----

    // Workout button
    document.getElementById('submitWorkout').addEventListener('click', handleWorkoutSubmit);

    // Food button
    document.getElementById('submitFood').addEventListener('click', handleFoodSubmit);

    // Calorie preview live update
    ['logProtein', 'logCarbs', 'logFats'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateCalPreview);
    });

    // Physique button
    document.getElementById('savePhysBtn').addEventListener('click', handlePhysiqueSubmit);

    // Stat allocation buttons
    document.querySelectorAll('.sp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleStatAllocate(btn.dataset.alloc);
        });
    });

    // Level-up overlay close
    document.getElementById('luClose').addEventListener('click', closeLevelUp);

    // Player name click
    document.getElementById('playerName').addEventListener('click', handleNameChange);
    document.getElementById('playerName').style.cursor = 'pointer';
    document.getElementById('playerName').title = 'Click to change name';

    // Data management
    document.getElementById('btnExport').addEventListener('click', handleExportData);
    document.getElementById('btnImport').addEventListener('click', handleImportData);
    document.getElementById('btnReset').addEventListener('click', handleResetData);

    // Shop filters
    if (typeof initShopFilters === 'function') initShopFilters();

    // Reset confirm modal
    const resetConfirm = document.getElementById('resetConfirm');
    const resetCancel = document.getElementById('resetCancel');
    if (resetConfirm) resetConfirm.addEventListener('click', confirmReset);
    if (resetCancel) resetCancel.addEventListener('click', cancelReset);

    // Shadow Mission buttons
    const smComplete = document.getElementById('smComplete');
    const smSkip = document.getElementById('smSkip');
    if (smComplete) smComplete.addEventListener('click', () => { if (typeof completeShadowMission === 'function') completeShadowMission(); });
    if (smSkip) smSkip.addEventListener('click', () => { if (typeof skipShadowMission === 'function') skipShadowMission(); });

    // Login Reward close
    const lrClose = document.getElementById('lrClose');
    if (lrClose) lrClose.addEventListener('click', () => { if (typeof closeLoginReward === 'function') closeLoginReward(); });

    // Decay Report close
    const decayClose = document.getElementById('decayClose');
    if (decayClose) decayClose.addEventListener('click', () => { if (typeof closeDecayReport === 'function') closeDecayReport(); });

    // Sign Out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) signOutBtn.addEventListener('click', () => { if (typeof signOutUser === 'function') signOutUser(); });

    // Link Google Account button (for guest users)
    const linkGoogleBtn = document.getElementById('linkGoogleBtn');
    if (linkGoogleBtn) linkGoogleBtn.addEventListener('click', () => { if (typeof linkGuestToGoogle === 'function') linkGuestToGoogle(); });

    // Sound toggle button
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => { if (typeof toggleSound === 'function') toggleSound(); });
        // Set initial icon
        if (D && D.settings) soundBtn.textContent = D.settings.soundEnabled !== false ? '🔊' : '🔇';
    }

    // Heatmap navigation
    if (typeof initHeatmapNav === 'function') initHeatmapNav();
});
