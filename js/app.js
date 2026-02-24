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

// ═══════════════════════════════════════════
//  PWA NOTIFICATION SYSTEM
// ═══════════════════════════════════════════
let _notifTimer = null;

function notifSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
}

async function toggleNotifications() {
    if (!notifSupported()) {
        sysNotify('[System] Notifications not supported on this device.', 'red');
        return;
    }

    // Currently enabled → disable
    if (D.settings.notificationsEnabled) {
        D.settings.notificationsEnabled = false;
        saveGame();
        updateNotifUI();
        clearScheduledNotif();
        sysNotify('[System] Training reminders disabled.', 'red');
        return;
    }

    // Request permission
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
        sysNotify('[System] Notification permission denied. Enable in browser settings.', 'red');
        return;
    }

    D.settings.notificationsEnabled = true;
    saveGame();
    updateNotifUI();
    scheduleNotif();
    sysNotify('[System] Training reminders activated. The System is watching.', 'green');
}

function setNotifTime(hour) {
    D.settings.notifReminderHour = parseInt(hour, 10);
    saveGame();
    scheduleNotif();
    sysNotify(`[System] Reminder set for ${formatHour(D.settings.notifReminderHour)}.`, 'blue');
}

function formatHour(h) {
    if (h === 0) return '12:00 AM';
    if (h === 12) return '12:00 PM';
    return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
}

function updateNotifUI() {
    const btn = document.getElementById('notifToggleBtn');
    const status = document.getElementById('notifToggleStatus');
    const timeRow = document.getElementById('notifTimeRow');
    const timeSelect = document.getElementById('notifTimeSelect');
    const hint = document.getElementById('notifHint');
    if (!btn) return;

    const on = D.settings.notificationsEnabled;
    btn.classList.toggle('active', on);
    status.textContent = on ? 'ON' : 'OFF';
    timeRow.style.display = on ? 'flex' : 'none';
    if (timeSelect) timeSelect.value = D.settings.notifReminderHour || 18;
    if (hint) {
        hint.textContent = on
            ? `Reminders active — ${formatHour(D.settings.notifReminderHour || 18)} daily`
            : 'Enable to receive daily "System" reminders to train';
    }
}

function scheduleNotif() {
    clearScheduledNotif();
    if (!D.settings.notificationsEnabled) return;

    const now = new Date();
    const target = new Date();
    target.setHours(D.settings.notifReminderHour || 18, 0, 0, 0);

    // If target time already passed today, schedule for tomorrow
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    const ms = target - now;
    _notifTimer = setTimeout(() => {
        fireTrainingReminder();
        // Reschedule for next day
        scheduleNotif();
    }, ms);
}

function clearScheduledNotif() {
    if (_notifTimer) {
        clearTimeout(_notifTimer);
        _notifTimer = null;
    }
}

async function fireTrainingReminder() {
    if (!D.settings.notificationsEnabled) return;
    if (Notification.permission !== 'granted') return;

    // Don't notify if user already trained today
    const today = new Date().toDateString();
    const trainedToday = D.workouts && D.workouts.some(w => new Date(w.date).toDateString() === today);
    if (trainedToday) return;

    const msg = getNotifMessage();

    // Try service worker notification (works in background on mobile)
    try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(msg.title, {
            body: msg.body,
            icon: 'icons/icon-192.png',
            badge: 'icons/icon-96.png',
            tag: 'training-reminder',
            renotify: true,
            vibrate: [200, 100, 200, 100, 200],
            data: { url: '/' },
            actions: [
                { action: 'open', title: '⬡ Enter Gate' },
                { action: 'dismiss', title: '✕ Later' }
            ]
        });
    } catch (e) {
        // Fallback: basic notification
        new Notification(msg.title, {
            body: msg.body,
            icon: 'icons/icon-192.png',
            tag: 'training-reminder'
        });
    }
}

// Fire a "no training yet" nudge on app open
function checkOpenNotification() {
    if (!notifSupported()) return;
    if (!D.settings.notificationsEnabled) return;
    if (Notification.permission !== 'granted') return;

    const today = new Date().toDateString();
    const trainedToday = D.workouts && D.workouts.some(w => new Date(w.date).toDateString() === today);
    const hour = new Date().getHours();

    // If it's past noon and haven't trained, show an in-app nudge
    if (!trainedToday && hour >= 12) {
        const msgs = [
            "⚠ You haven't trained today. The System is watching.",
            "⬡ Daily gate remains uncompleted. The shadows grow.",
            "☠ No workout detected. Degradation approaches.",
            "🔥 Your streak depends on today. Enter the gate.",
            "🌑 The System demands action. Train or face consequences."
        ];
        const pick = msgs[Math.floor(Math.random() * msgs.length)];
        setTimeout(() => sysNotify(pick, 'red'), 2000);
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

                    // Init tutorial
                    if (typeof initTutorial === 'function') initTutorial();

                    // Init notification system
                    updateNotifUI();
                    if (D.settings.notificationsEnabled) scheduleNotif();
                    checkOpenNotification();
                    
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
    const cal = Math.round((p * 4) + (c * 4) + (f * 9));
    document.getElementById('calPreview').textContent = cal + ' kcal estimated';
}

// ═══════════════════════════════════════════
//  FOOD AUTOCOMPLETE — Smart food search
// ═══════════════════════════════════════════
let _selectedFoodItem = null;
let _sugActiveIdx = -1;

function initFoodAutocomplete() {
    const input = document.getElementById('logFood');
    const sugBox = document.getElementById('foodSuggestions');
    const servingsInput = document.getElementById('logServings');
    if (!input || !sugBox) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        _sugActiveIdx = -1;
        if (q.length < 2) { sugBox.classList.add('hidden'); return; }

        const matches = FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8);
        if (matches.length === 0) { sugBox.classList.add('hidden'); return; }

        sugBox.innerHTML = matches.map((f, i) => {
            const cal = Math.round((f.protein * 4) + (f.carbs * 4) + (f.fats * 9));
            return `<div class="food-sug-item" data-idx="${i}">
                <div>
                    <span class="food-sug-name">${highlightMatch(f.name, q)}</span>
                </div>
                <div class="food-sug-meta">
                    <div class="food-sug-macro">P:${f.protein} C:${f.carbs} F:${f.fats}</div>
                    <div>${cal} kcal · ${f.servingLabel}</div>
                </div>
            </div>`;
        }).join('');

        sugBox.classList.remove('hidden');

        // Bind click on suggestions
        sugBox.querySelectorAll('.food-sug-item').forEach((el, i) => {
            el.addEventListener('click', () => selectFoodSuggestion(matches[i]));
        });
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = sugBox.querySelectorAll('.food-sug-item');
        if (sugBox.classList.contains('hidden') || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            _sugActiveIdx = Math.min(_sugActiveIdx + 1, items.length - 1);
            updateSugActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            _sugActiveIdx = Math.max(_sugActiveIdx - 1, 0);
            updateSugActive(items);
        } else if (e.key === 'Enter' && _sugActiveIdx >= 0) {
            e.preventDefault();
            items[_sugActiveIdx].click();
        } else if (e.key === 'Escape') {
            sugBox.classList.add('hidden');
        }
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.food-autocomplete-wrap')) {
            sugBox.classList.add('hidden');
        }
    });

    // Servings multiplier
    if (servingsInput) {
        servingsInput.addEventListener('input', () => {
            if (_selectedFoodItem) applyFoodServings(_selectedFoodItem);
        });
    }
}

function highlightMatch(name, query) {
    const idx = name.toLowerCase().indexOf(query);
    if (idx === -1) return name;
    return name.substring(0, idx) +
        '<span class="food-sug-match">' + name.substring(idx, idx + query.length) + '</span>' +
        name.substring(idx + query.length);
}

function updateSugActive(items) {
    items.forEach((el, i) => {
        el.classList.toggle('active', i === _sugActiveIdx);
    });
    if (_sugActiveIdx >= 0 && items[_sugActiveIdx]) {
        items[_sugActiveIdx].scrollIntoView({ block: 'nearest' });
    }
}

function selectFoodSuggestion(food) {
    _selectedFoodItem = food;
    document.getElementById('logFood').value = food.name;
    document.getElementById('foodSuggestions').classList.add('hidden');
    document.getElementById('servingHint').textContent = `(1 serving = ${food.servingLabel})`;
    document.getElementById('logServings').value = 1;
    applyFoodServings(food);
}

function applyFoodServings(food) {
    const qty = parseFloat(document.getElementById('logServings').value) || 1;
    document.getElementById('logProtein').value = Math.round(food.protein * qty * 10) / 10;
    document.getElementById('logCarbs').value = Math.round(food.carbs * qty * 10) / 10;
    document.getElementById('logFats').value = Math.round(food.fats * qty * 10) / 10;
    updateCalPreview();
}

// ═══════════════════════════════════════════
//  ENERGY BALANCE — Intake vs Output (live TDEE grows minute-by-minute)
// ═══════════════════════════════════════════
let _ebRefreshTimer = null;

function renderEnergyBalance() {
    const el = document.getElementById('energyBalance');
    if (!el) return;

    const todayFoods = getTodayFoods();
    const todayWorkouts = getTodayWorkouts();

    // Calories IN
    let calIn = 0, totalP = 0, totalC = 0, totalF = 0;
    todayFoods.forEach(f => {
        calIn += f.calories || 0;
        totalP += f.protein || 0;
        totalC += f.carbs || 0;
        totalF += f.fats || 0;
    });

    // Calories OUT — workout burn
    let workoutBurn = 0;
    todayWorkouts.forEach(w => { workoutBurn += w.calBurned || 0; });

    // Live TDEE (grows throughout the day, minute-precision)
    const bmr = calcBMR();
    const tdee = getDailyTDEE();
    const tdeeSoFar = getLiveTDEE();

    const calOut = workoutBurn + tdeeSoFar;
    const net = calIn - calOut;
    const totalOut = workoutBurn + tdee; // Full day estimate

    // Activity label
    const bc = D.physique && D.physique.bodyComp;
    const mult = (bc && bc.activityLevel) || 1.55;
    const actLabels = { '1.2': 'Sedentary', '1.375': 'Light', '1.55': 'Moderate', '1.725': 'Active', '1.9': 'Athlete' };
    const actLabel = actLabels[String(mult)] || 'Moderate';

    // Body info source
    const weight = (D.physique && D.physique.currentWeight) || 70;
    const hasData = !!(bc && bc.height && bc.age);

    // Bar widths
    const maxCal = Math.max(calIn, calOut, 500);
    const inPct = Math.min(100, Math.round((calIn / maxCal) * 100));
    const outPct = Math.min(100, Math.round((calOut / maxCal) * 100));

    // Verdict
    let verdict, verdictClass, verdictDesc;
    if (net > 200) {
        verdict = `+${net} kcal SURPLUS`;
        verdictClass = 'surplus';
        verdictDesc = 'You are in a calorie surplus. Ideal for muscle building / bulking.';
    } else if (net < -200) {
        verdict = `${net} kcal DEFICIT`;
        verdictClass = 'deficit';
        verdictDesc = 'You are in a calorie deficit. Ideal for fat loss / cutting.';
    } else {
        verdict = `${net >= 0 ? '+' : ''}${net} kcal MAINTENANCE`;
        verdictClass = 'balanced';
        verdictDesc = 'Roughly at maintenance. Good for recomposition.';
    }

    el.innerHTML = `
        <div class="eb-summary">
            <div class="eb-col eb-in">
                <div class="eb-col-label">Intake</div>
                <div class="eb-col-val">${calIn}</div>
                <div class="eb-col-sub">kcal consumed</div>
            </div>
            <div class="eb-vs">⚔</div>
            <div class="eb-col eb-out">
                <div class="eb-col-label">Output</div>
                <div class="eb-col-val" id="ebOutVal">${calOut}</div>
                <div class="eb-col-sub">${workoutBurn} exercise + ${tdeeSoFar} TDEE</div>
            </div>
        </div>
        <div class="eb-bar-wrap">
            <div class="eb-bar-labels">
                <span>🍖 Intake: ${calIn} kcal</span>
                <span>🔥 Output: ${calOut} kcal</span>
            </div>
            <div class="eb-bar-track">
                <div class="eb-bar-in" style="width:${inPct}%"></div>
                <div class="eb-bar-out" style="width:${outPct}%"></div>
            </div>
        </div>
        <div class="eb-verdict ${verdictClass}">
            <div class="eb-verdict-label">— Energy Verdict —</div>
            <div class="eb-verdict-val">${verdict}</div>
            <div class="eb-verdict-desc">${verdictDesc}</div>
        </div>
        <div class="eb-breakdown">
            <div class="eb-break-item">
                <div class="eb-break-val">${Math.round(totalP)}g</div>
                <div class="eb-break-label">Protein</div>
            </div>
            <div class="eb-break-item">
                <div class="eb-break-val">${Math.round(totalC)}g</div>
                <div class="eb-break-label">Carbs</div>
            </div>
            <div class="eb-break-item">
                <div class="eb-break-val">${Math.round(totalF)}g</div>
                <div class="eb-break-label">Fats</div>
            </div>
        </div>
        <div class="eb-footer">
            <span>📊 Full-day est: ${totalOut} kcal (TDEE ${tdee} + exercise ${workoutBurn})</span>
            <span>⚙ BMR ${bmr} × ${actLabel} · ${weight}kg${hasData ? '' : ' (defaults — set Age & Height in Body Composition)'}</span>
        </div>
    `;

    // Start live refresh (every 60s) if not already running
    if (!_ebRefreshTimer) {
        _ebRefreshTimer = setInterval(() => {
            // Only refresh if the log panel is visible
            const logPanel = document.querySelector('[data-panel="log"]');
            if (logPanel && !logPanel.classList.contains('hidden') && logPanel.offsetParent !== null) {
                renderEnergyBalance();
            }
        }, 60000);
    }
}

// ═══════════════════════════════════════════
//  EXERCISE SELECTOR — Muscle group filter + dynamic dropdown
// ═══════════════════════════════════════════
function initExerciseSelector() {
    const bar = document.getElementById('exerciseFilterBar');
    const sel = document.getElementById('logExercise');
    if (!bar || !sel || typeof EXERCISE_DB === 'undefined') return;

    // Build filter pills from groups
    EXERCISE_GROUPS.forEach(g => {
        const btn = document.createElement('button');
        btn.className = 'ef-pill';
        btn.dataset.group = g;
        btn.textContent = g;
        bar.appendChild(btn);
    });

    // Populate all exercises initially
    populateExerciseSelect('All');

    // Filter pill click handler
    bar.addEventListener('click', e => {
        const pill = e.target.closest('.ef-pill');
        if (!pill) return;
        bar.querySelectorAll('.ef-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        populateExerciseSelect(pill.dataset.group);
        if (typeof playSound === 'function') playSound('click');
    });
}

function populateExerciseSelect(group) {
    const sel = document.getElementById('logExercise');
    if (!sel) return;
    const prev = sel.value; // preserve selection if still valid

    // Filter exercises
    const exercises = group === 'All'
        ? EXERCISE_DB
        : EXERCISE_DB.filter(ex => ex.group === group);

    // Clear & repopulate
    sel.innerHTML = '<option value="">— Select Exercise —</option>';
    let currentGroup = '';
    exercises.forEach(ex => {
        if (group === 'All' && ex.group !== currentGroup && ex.group !== 'Other') {
            currentGroup = ex.group;
            const optGroup = document.createElement('optgroup');
            optGroup.label = `── ${currentGroup} ──`;
            sel.appendChild(optGroup);
        }
        const opt = document.createElement('option');
        opt.value = ex.name;
        opt.textContent = ex.isCardio ? `${ex.name} ⏱` : ex.name;
        if (group === 'All' && currentGroup && ex.group !== 'Other') {
            sel.querySelector(`optgroup[label="── ${currentGroup} ──"]`).appendChild(opt);
        } else {
            sel.appendChild(opt);
        }
    });

    // Restore previous if valid
    if (prev) {
        const exists = [...sel.options].some(o => o.value === prev);
        if (exists) sel.value = prev;
    }
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
    document.getElementById('logServings').value = '1';
    document.getElementById('servingHint').textContent = '';
    document.getElementById('calPreview').textContent = '0 kcal estimated';
    _selectedFoodItem = null;
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

// ---- Body Fat Calculator Handler ----
function handleBodyFatCalc() {
    const gender = document.getElementById('bfGender').value;
    const height = parseFloat(document.getElementById('bfHeight').value);
    const neck = parseFloat(document.getElementById('bfNeck').value);
    const waist = parseFloat(document.getElementById('bfWaist').value);
    const hip = parseFloat(document.getElementById('bfHip').value) || 0;
    const age = parseInt(document.getElementById('bfAge').value, 10) || 0;
    const activityLevel = parseFloat(document.getElementById('bfActivity').value) || 1.55;

    if (!height || !neck || !waist) {
        sysNotify('[System] Fill in height, neck, and waist measurements.', 'red');
        return;
    }
    if (gender === 'female' && !hip) {
        sysNotify('[System] Hip measurement required for female calculation.', 'red');
        return;
    }
    if (waist <= neck) {
        sysNotify('[System] Waist must be larger than neck measurement.', 'red');
        return;
    }

    const weight = D.physique.currentWeight || parseFloat(document.getElementById('pCurWeight').value) || 0;
    const bf = calcBodyFat(gender, height, neck, waist, hip);
    const bmi = weight > 0 ? calcBMI(weight, height) : 0;

    saveBodyComp(gender, height, neck, waist, hip, bf, bmi, age, activityLevel);
    renderBodyFatResults();
    if (typeof playSound === 'function') playSound('questClear');
    sysNotify(`[Body Analysis Complete] Body Fat: ${bf.toFixed(1)}% — BMR/TDEE updated.`, 'blue');
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

    // Initialize template creator dropdown
    if (typeof populateCreatorSelect === 'function') populateCreatorSelect();

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

    // Food autocomplete
    initFoodAutocomplete();

    // Exercise selector (muscle group filter + dynamic dropdown)
    initExerciseSelector();

    // Physique button
    document.getElementById('savePhysBtn').addEventListener('click', handlePhysiqueSubmit);

    // Body Fat Calculator
    document.getElementById('calcBfBtn').addEventListener('click', handleBodyFatCalc);
    document.getElementById('bfGender').addEventListener('change', function() {
        document.getElementById('bfHipRow').style.display = this.value === 'female' ? '' : 'none';
    });
    // Hide hip row by default (male)
    document.getElementById('bfHipRow').style.display = 'none';
    // Restore saved measurements
    restoreBodyCompInputs();

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
