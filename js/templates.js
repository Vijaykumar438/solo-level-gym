// ==========================================
//  TEMPLATES.JS — Workout Templates & Quick Log
//  Pre-built + custom split routines
// ==========================================

// ── Pre-built templates ──
const PRESET_TEMPLATES = [
    {
        id: 'push', name: 'Push Day', icon: '🔴', desc: 'Chest, Shoulders, Triceps',
        exercises: [
            { name: 'Bench Press',       reps: 10, sets: 4, weight: 0, intensity: 'medium' },
            { name: 'Incline Bench Press', reps: 10, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Dumbbell Fly',      reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'OHP',               reps: 10, sets: 4, weight: 0, intensity: 'medium' },
            { name: 'Lateral Raise',     reps: 15, sets: 3, weight: 0, intensity: 'low' },
            { name: 'Tricep Pushdown',   reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Skull Crushers',    reps: 10, sets: 3, weight: 0, intensity: 'medium' },
        ]
    },
    {
        id: 'pull', name: 'Pull Day', icon: '🔵', desc: 'Back, Biceps, Rear Delts',
        exercises: [
            { name: 'Pull-ups',          reps: 8,  sets: 4, weight: 0, intensity: 'high' },
            { name: 'Barbell Row',       reps: 10, sets: 4, weight: 0, intensity: 'medium' },
            { name: 'Lat Pulldown',      reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Seated Cable Row',  reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Face Pull',         reps: 15, sets: 3, weight: 0, intensity: 'low' },
            { name: 'Barbell Curl',      reps: 10, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Hammer Curl',       reps: 12, sets: 3, weight: 0, intensity: 'medium' },
        ]
    },
    {
        id: 'legs', name: 'Leg Day', icon: '🟢', desc: 'Quads, Hamstrings, Glutes, Calves',
        exercises: [
            { name: 'Squats',            reps: 10, sets: 4, weight: 0, intensity: 'high' },
            { name: 'Romanian Deadlift', reps: 10, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Leg Press',         reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Leg Curl',          reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Leg Extension',     reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Calf Raise',        reps: 15, sets: 4, weight: 0, intensity: 'medium' },
            { name: 'Hip Thrust',        reps: 12, sets: 3, weight: 0, intensity: 'medium' },
        ]
    },
    {
        id: 'upper', name: 'Upper Body', icon: '🟠', desc: 'Chest, Back, Shoulders, Arms',
        exercises: [
            { name: 'Bench Press',       reps: 10, sets: 4, weight: 0, intensity: 'medium' },
            { name: 'Pull-ups',          reps: 8,  sets: 3, weight: 0, intensity: 'high' },
            { name: 'OHP',               reps: 10, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Barbell Row',       reps: 10, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Dumbbell Curl',     reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Tricep Pushdown',   reps: 12, sets: 3, weight: 0, intensity: 'medium' },
        ]
    },
    {
        id: 'lower', name: 'Lower Body', icon: '🟡', desc: 'Squats, Deadlift, Lunges, Calves',
        exercises: [
            { name: 'Squats',            reps: 10, sets: 4, weight: 0, intensity: 'high' },
            { name: 'Deadlift',          reps: 8,  sets: 3, weight: 0, intensity: 'high' },
            { name: 'Lunges',            reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Leg Curl',          reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Calf Raise',        reps: 15, sets: 4, weight: 0, intensity: 'medium' },
            { name: 'Hip Thrust',        reps: 12, sets: 3, weight: 0, intensity: 'medium' },
        ]
    },
    {
        id: 'fullbody', name: 'Full Body Blitz', icon: '🟣', desc: 'All major compounds in one session',
        exercises: [
            { name: 'Squats',            reps: 8,  sets: 4, weight: 0, intensity: 'high' },
            { name: 'Bench Press',       reps: 8,  sets: 4, weight: 0, intensity: 'high' },
            { name: 'Barbell Row',       reps: 8,  sets: 4, weight: 0, intensity: 'medium' },
            { name: 'OHP',               reps: 8,  sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Deadlift',          reps: 6,  sets: 3, weight: 0, intensity: 'high' },
            { name: 'Pull-ups',          reps: 8,  sets: 3, weight: 0, intensity: 'high' },
        ]
    },
    {
        id: 'core', name: 'Core Crusher', icon: '🔶', desc: 'Abs, obliques, full core destruction',
        exercises: [
            { name: 'Plank',             reps: 60, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Hanging Leg Raise', reps: 12, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Russian Twist',     reps: 20, sets: 3, weight: 0, intensity: 'medium' },
            { name: 'Ab Wheel Rollout',  reps: 10, sets: 3, weight: 0, intensity: 'high' },
            { name: 'Mountain Climbers', reps: 2,  sets: 3, weight: 0, intensity: 'high' },
            { name: 'Cable Crunch',      reps: 15, sets: 3, weight: 0, intensity: 'medium' },
        ]
    },
    {
        id: 'cardio', name: 'Cardio Burn', icon: '🔥', desc: 'Heart-rate destruction session',
        exercises: [
            { name: 'Running',           reps: 15, sets: 1, weight: 0, intensity: 'medium' },
            { name: 'Jump Rope',         reps: 5,  sets: 3, weight: 0, intensity: 'high' },
            { name: 'Cycling',           reps: 10, sets: 1, weight: 0, intensity: 'medium' },
            { name: 'Burpees',           reps: 5,  sets: 3, weight: 0, intensity: 'high' },
        ]
    }
];

// ── Active template session state ──
let activeTemplateSession = null;

// ── Get all templates (presets + custom) ──
function getAllTemplates() {
    const custom = (D && D.templates) ? D.templates : [];
    return [...PRESET_TEMPLATES, ...custom];
}

// ── Render templates section ──
function renderTemplates() {
    const container = document.getElementById('templatesContent');
    if (!container) return;

    const templates = getAllTemplates();
    const customCount = (D && D.templates) ? D.templates.length : 0;

    let html = `
        <div class="tpl-header">
            <span class="tpl-header-title">⚡ Quick Routines</span>
            <button class="tpl-create-btn" onclick="openTemplateCreator()">+ Create</button>
        </div>
        <div class="tpl-grid">
    `;

    templates.forEach(tpl => {
        const isCustom = tpl.isCustom || false;
        const exCount = tpl.exercises.length;
        const exNames = tpl.exercises.map(e => e.name).slice(0, 3).join(', ');
        const moreCount = exCount > 3 ? ` +${exCount - 3} more` : '';
        html += `
            <div class="tpl-card" onclick="startTemplateSession('${tpl.id}')">
                <div class="tpl-card-top">
                    <span class="tpl-card-icon">${tpl.icon}</span>
                    ${isCustom ? '<span class="tpl-card-custom">CUSTOM</span>' : ''}
                </div>
                <div class="tpl-card-name">${tpl.name}</div>
                <div class="tpl-card-desc">${tpl.desc}</div>
                <div class="tpl-card-exercises">${exNames}${moreCount}</div>
                <div class="tpl-card-count">${exCount} exercises</div>
                ${isCustom ? `<button class="tpl-delete-btn" onclick="event.stopPropagation();deleteCustomTemplate('${tpl.id}')" title="Delete">✕</button>` : ''}
            </div>
        `;
    });

    html += `</div>`;

    // Active session UI
    if (activeTemplateSession) {
        html += renderActiveSession();
    }

    container.innerHTML = html;
}

// ── Start a template session ──
function startTemplateSession(tplId) {
    const templates = getAllTemplates();
    const tpl = templates.find(t => t.id === tplId);
    if (!tpl) return;

    // Deep clone exercises so user edits don't affect the template
    activeTemplateSession = {
        templateId: tplId,
        name: tpl.name,
        icon: tpl.icon,
        exercises: tpl.exercises.map(ex => ({
            ...ex,
            logged: false,
            expanded: false
        }))
    };

    if (typeof playSound === 'function') playSound('click');
    renderTemplates();

    // Scroll to the session
    setTimeout(() => {
        const el = document.getElementById('activeSessionPanel');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ── Render active session ──
function renderActiveSession() {
    if (!activeTemplateSession) return '';
    const s = activeTemplateSession;
    const loggedCount = s.exercises.filter(e => e.logged).length;
    const totalCount = s.exercises.length;
    const allDone = loggedCount === totalCount;

    let html = `
        <div class="tpl-session" id="activeSessionPanel">
            <div class="tpl-session-header">
                <div class="tpl-session-title">${s.icon} ${s.name}</div>
                <div class="tpl-session-progress">${loggedCount} / ${totalCount} logged</div>
                <button class="tpl-session-close" onclick="cancelTemplateSession()">✕</button>
            </div>
            <div class="tpl-session-bar">
                <div class="tpl-session-bar-fill" style="width:${(loggedCount/totalCount)*100}%"></div>
            </div>
            <div class="tpl-exercise-list">
    `;

    s.exercises.forEach((ex, i) => {
        const exDef = (typeof EXERCISE_DB !== 'undefined') && EXERCISE_DB.find(e => e.name === ex.name);
        const isCardio = exDef ? exDef.isCardio : false;
        const repsLabel = isCardio ? 'Min' : 'Reps';

        html += `
            <div class="tpl-ex-item ${ex.logged ? 'tpl-ex-done' : ''}" data-idx="${i}">
                <div class="tpl-ex-header" onclick="toggleTemplateExercise(${i})">
                    <div class="tpl-ex-check">${ex.logged ? '✓' : (i + 1)}</div>
                    <div class="tpl-ex-name">${ex.name}${isCardio ? ' ⏱' : ''}</div>
                    <div class="tpl-ex-summary">${ex.reps}×${ex.sets}${ex.weight > 0 ? ' · ' + ex.weight + 'kg' : ''}</div>
                    <div class="tpl-ex-arrow">${ex.expanded ? '▾' : '▸'}</div>
                </div>
                ${ex.expanded && !ex.logged ? `
                    <div class="tpl-ex-form">
                        <div class="tpl-ex-fields">
                            <div class="tpl-field">
                                <label>${repsLabel}</label>
                                <input type="number" value="${ex.reps}" min="1" id="tplReps_${i}">
                            </div>
                            <div class="tpl-field">
                                <label>Sets</label>
                                <input type="number" value="${ex.sets}" min="1" id="tplSets_${i}">
                            </div>
                            <div class="tpl-field">
                                <label>Weight</label>
                                <input type="number" value="${ex.weight}" min="0" step="0.5" id="tplWeight_${i}">
                            </div>
                            <div class="tpl-field">
                                <label>Intensity</label>
                                <select id="tplIntensity_${i}">
                                    <option value="low"${ex.intensity==='low'?' selected':''}>Low</option>
                                    <option value="medium"${ex.intensity==='medium'?' selected':''}>Med</option>
                                    <option value="high"${ex.intensity==='high'?' selected':''}>High</option>
                                </select>
                            </div>
                        </div>
                        <button class="tpl-log-btn" onclick="logTemplateExercise(${i})">⚔ LOG THIS</button>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `</div>`;

    // Log All / Finish buttons
    if (!allDone) {
        const remaining = totalCount - loggedCount;
        html += `<button class="tpl-logall-btn" onclick="logAllTemplateExercises()">⚡ LOG ALL REMAINING (${remaining})</button>`;
    } else {
        html += `<div class="tpl-complete-msg">🏆 All exercises logged! Session complete.</div>`;
    }

    html += `</div>`;
    return html;
}

// ── Toggle exercise expand ──
function toggleTemplateExercise(idx) {
    if (!activeTemplateSession || activeTemplateSession.exercises[idx].logged) return;
    activeTemplateSession.exercises[idx].expanded = !activeTemplateSession.exercises[idx].expanded;
    renderTemplates();
}

// ── Log a single exercise from the session ──
function logTemplateExercise(idx) {
    if (!activeTemplateSession) return;
    const ex = activeTemplateSession.exercises[idx];
    if (ex.logged) return;

    // Read values from form
    const reps = parseInt(document.getElementById(`tplReps_${idx}`)?.value) || ex.reps;
    const sets = parseInt(document.getElementById(`tplSets_${idx}`)?.value) || ex.sets;
    const weight = parseFloat(document.getElementById(`tplWeight_${idx}`)?.value) || 0;
    const intensity = document.getElementById(`tplIntensity_${idx}`)?.value || ex.intensity;

    // Update session state
    ex.reps = reps;
    ex.sets = sets;
    ex.weight = weight;
    ex.intensity = intensity;

    // Call the real logWorkout
    const result = logWorkout(ex.name, reps, sets, weight, intensity);
    ex.logged = true;
    ex.expanded = false;

    if (typeof vibrate === 'function') vibrate([30, 50, 30]);
    if (typeof playSound === 'function') playSound('workout');
    sysNotify(`[Template] ${ex.name} — +${result.xpGain} XP, -${result.calBurned} cal`, 'green');

    renderTemplates();
    refreshUI();
}

// ── Log all remaining exercises at once ──
function logAllTemplateExercises() {
    if (!activeTemplateSession) return;
    let totalXP = 0, totalCal = 0, count = 0;

    activeTemplateSession.exercises.forEach((ex, i) => {
        if (ex.logged) return;

        // Read form values if expanded, otherwise use defaults
        const repsEl = document.getElementById(`tplReps_${i}`);
        const setsEl = document.getElementById(`tplSets_${i}`);
        const weightEl = document.getElementById(`tplWeight_${i}`);
        const intensityEl = document.getElementById(`tplIntensity_${i}`);

        const reps = repsEl ? parseInt(repsEl.value) || ex.reps : ex.reps;
        const sets = setsEl ? parseInt(setsEl.value) || ex.sets : ex.sets;
        const weight = weightEl ? parseFloat(weightEl.value) || 0 : ex.weight;
        const intensity = intensityEl ? intensityEl.value : ex.intensity;

        const result = logWorkout(ex.name, reps, sets, weight, intensity);
        ex.logged = true;
        ex.expanded = false;
        totalXP += result.xpGain;
        totalCal += result.calBurned;
        count++;
    });

    if (typeof vibrate === 'function') vibrate([30, 50, 30, 50, 30, 100]);
    if (typeof playSound === 'function') playSound('questComplete');
    sysNotify(`[Template Complete] ${count} exercises logged — +${totalXP} XP, -${totalCal} cal`, 'gold');

    renderTemplates();
    refreshUI();
}

// ── Cancel session ──
function cancelTemplateSession() {
    activeTemplateSession = null;
    renderTemplates();
}

// ── Template Creator ──
let creatorExercises = [];

function openTemplateCreator() {
    const overlay = document.getElementById('templateCreatorOverlay');
    if (!overlay) return;
    creatorExercises = [];
    renderCreatorExercises();
    document.getElementById('tplCreatorName').value = '';
    overlay.classList.remove('hidden');
    if (typeof playSound === 'function') playSound('click');
}

function closeTemplateCreator() {
    const overlay = document.getElementById('templateCreatorOverlay');
    if (overlay) overlay.classList.add('hidden');
    creatorExercises = [];
}

function addCreatorExercise() {
    const sel = document.getElementById('tplCreatorExercise');
    const name = sel?.value;
    if (!name) return;
    if (creatorExercises.find(e => e.name === name)) {
        sysNotify('[System] Exercise already added.', 'red');
        return;
    }
    creatorExercises.push({ name, reps: 10, sets: 3, weight: 0, intensity: 'medium' });
    renderCreatorExercises();
    sel.value = '';
}

function removeCreatorExercise(idx) {
    creatorExercises.splice(idx, 1);
    renderCreatorExercises();
}

function renderCreatorExercises() {
    const container = document.getElementById('tplCreatorList');
    if (!container) return;

    if (creatorExercises.length === 0) {
        container.innerHTML = '<div class="tpl-creator-empty">No exercises added yet. Pick from the dropdown above.</div>';
        return;
    }

    container.innerHTML = creatorExercises.map((ex, i) => `
        <div class="tpl-creator-item">
            <span class="tpl-creator-item-name">${ex.name}</span>
            <input type="number" value="${ex.reps}" min="1" class="tpl-creator-input" placeholder="Reps" onchange="creatorExercises[${i}].reps=parseInt(this.value)||10">
            <input type="number" value="${ex.sets}" min="1" class="tpl-creator-input" placeholder="Sets" onchange="creatorExercises[${i}].sets=parseInt(this.value)||3">
            <button class="tpl-creator-remove" onclick="removeCreatorExercise(${i})">✕</button>
        </div>
    `).join('');
}

function saveCustomTemplate() {
    const name = document.getElementById('tplCreatorName')?.value?.trim();
    if (!name) { sysNotify('[System] Template name required.', 'red'); return; }
    if (creatorExercises.length < 2) { sysNotify('[System] Add at least 2 exercises.', 'red'); return; }

    if (!D.templates) D.templates = [];
    const tpl = {
        id: 'custom_' + Date.now(),
        name: name,
        icon: '⚙',
        desc: creatorExercises.map(e => e.name).slice(0, 3).join(', ') + (creatorExercises.length > 3 ? '...' : ''),
        exercises: creatorExercises.map(e => ({ ...e })),
        isCustom: true
    };

    D.templates.push(tpl);
    saveGame();
    closeTemplateCreator();
    renderTemplates();
    if (typeof playSound === 'function') playSound('purchase');
    sysNotify(`[System] Template "${name}" created with ${creatorExercises.length} exercises.`, 'green');
}

function deleteCustomTemplate(id) {
    if (!D.templates) return;
    D.templates = D.templates.filter(t => t.id !== id);
    saveGame();
    renderTemplates();
    sysNotify('[System] Template deleted.', 'red');
}

// ── Populate creator exercise select from EXERCISE_DB ──
function populateCreatorSelect() {
    const sel = document.getElementById('tplCreatorExercise');
    if (!sel || typeof EXERCISE_DB === 'undefined') return;
    sel.innerHTML = '<option value="">— Pick Exercise —</option>';
    EXERCISE_DB.forEach(ex => {
        if (ex.name === 'Other') return;
        const opt = document.createElement('option');
        opt.value = ex.name;
        opt.textContent = `${ex.name} (${ex.group})`;
        sel.appendChild(opt);
    });
}
