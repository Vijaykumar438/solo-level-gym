// ==========================================
//  UI.JS — All DOM rendering
// ==========================================

// ---- Notification system ----
function sysNotify(msg, type = '') {
    const container = document.getElementById('sysNotif');
    const el = document.createElement('div');
    el.className = 'notif ' + type;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

// ---- Tab switching ----
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`[data-panel="${target}"]`).classList.add('active');
            
            if (target === 'analysis') setTimeout(renderAllCharts, 120);
            if (target === 'shop' && typeof renderShop === 'function') setTimeout(renderShop, 50);
        });
    });
}

// ---- Full UI refresh ----
function refreshUI() {
    const rank = getRank(D.level);
    const needed = xpForLevel(D.level);
    const pct = Math.min((D.xp / needed) * 100, 100);
    
    // Header
    document.getElementById('hqLevel').textContent = D.level;
    document.getElementById('hqRank').textContent = rank.name;
    document.getElementById('hqGold').textContent = D.gold;
    
    // Rank badge color
    const badge = document.getElementById('hqRankBadge');
    badge.className = 'hq-item rank-badge ' + rank.css;
    
    // XP bar
    document.getElementById('xpText').textContent = `${D.xp} / ${needed}`;
    document.getElementById('xpFill').style.width = pct + '%';
    
    // Status window
    document.getElementById('playerName').textContent = D.settings.playerName;
    document.getElementById('swLevel').textContent = D.level;
    document.getElementById('swRank').textContent = rank.title;
    document.getElementById('swTitle').textContent = getTitle(D.level);
    
    // Equipped weapon in status
    const weaponEl = document.getElementById('swWeapon');
    if (weaponEl) {
        const equipped = typeof getEquippedWeapon === 'function' ? getEquippedWeapon() : null;
        weaponEl.textContent = equipped ? `${equipped.icon} ${equipped.name}` : '—';
    }
    
    // Stats
    renderStats();
    
    // Stat points panel
    const spPanel = document.getElementById('statPointsPanel');
    if (D.freePoints > 0) {
        spPanel.classList.remove('hidden');
        document.getElementById('freePoints').textContent = D.freePoints;
    } else {
        spPanel.classList.add('hidden');
    }
    
    // Physique tracker
    renderPhysiqueTracker();
    
    // Quests
    renderQuests();
    
    // Feed
    renderTodayFeed();
    
    // Skills & Achievements
    renderSkills();
    renderAchievements();
    
    // Lifetime
    renderLifetime();

    // Avatar
    if (typeof renderAvatar === 'function') renderAvatar();

    // Boss Raid
    if (typeof renderBossPanel === 'function') renderBossPanel();

    // Shadow Army
    if (typeof renderArmyPanel === 'function') renderArmyPanel();
}

// ---- Stats rendering ----
function renderStats() {
    const stats = ['str', 'agi', 'vit', 'end', 'wil', 'phs'];
    const maxStat = 200; // visual cap for bar
    
    stats.forEach(s => {
        const val = D.stats[s];
        const elVal = document.getElementById('stat' + s.toUpperCase());
        const elBar = document.getElementById('bar' + s.toUpperCase());
        if (elVal) elVal.textContent = s === 'phs' ? val.toFixed(1) : val;
        if (elBar) elBar.style.width = Math.min((val / maxStat) * 100, 100) + '%';
    });
}

// ---- Physique Tracker ----
function renderPhysiqueTracker() {
    const el = document.getElementById('physProgress');
    const p = D.physique;
    
    if (p.currentWeight) {
        document.getElementById('pCurWeight').value = p.currentWeight;
    }
    if (p.targetWeight) {
        document.getElementById('pTarWeight').value = p.targetWeight;
    }
    
    if (!p.startWeight || !p.targetWeight) {
        el.innerHTML = '<div style="color:var(--dim);text-align:center;padding:10px;font-size:.9rem">[Set your weight to begin tracking]</div>';
        return;
    }
    
    const progress = Math.abs(p.startWeight - p.currentWeight);
    const total = Math.abs(p.startWeight - p.targetWeight);
    const pct = total > 0 ? Math.min((progress / total) * 100, 100) : 0;
    const remaining = Math.abs(p.targetWeight - p.currentWeight);
    const change = p.currentWeight - p.startWeight;
    const days = p.startDate ? Math.floor((new Date() - new Date(p.startDate)) / 86400000) : 0;
    
    el.innerHTML = `
        <div class="pp-bar-wrap">
            <div class="pp-info"><span>Progress</span><span>${pct.toFixed(1)}%</span></div>
            <div class="pp-track">
                <div class="pp-fill" style="width:${pct}%"></div>
                <div class="pp-label">${remaining.toFixed(1)} kg remaining</div>
            </div>
        </div>
        <div class="pp-stats">
            <div class="pp-stat"><div class="pp-stat-val">${p.startWeight.toFixed(1)}</div><div class="pp-stat-label">Start (kg)</div></div>
            <div class="pp-stat"><div class="pp-stat-val">${p.currentWeight.toFixed(1)}</div><div class="pp-stat-label">Current (kg)</div></div>
            <div class="pp-stat"><div class="pp-stat-val">${p.targetWeight.toFixed(1)}</div><div class="pp-stat-label">Target (kg)</div></div>
        </div>
        <div style="text-align:center;margin-top:12px;font-size:.9rem;color:var(--dim)">
            Day ${days} · ${Math.abs(change).toFixed(1)} kg ${change >= 0 ? 'gained' : 'lost'}
        </div>
    `;
}

// ---- Quest rendering ----
function renderQuests() {
    const container = document.getElementById('questList');
    const quests = getTodayQuests();
    
    // Date
    document.getElementById('gateDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    // Meta
    const cleared = quests.filter(q => q.cleared).length;
    document.getElementById('gateProgress').textContent = `${cleared}/${quests.length}`;
    document.getElementById('streakVal').textContent = D.streak;
    
    // Recent penalties
    const recentPen = D.penalties.filter(p => {
        const d = new Date(p.date);
        const week = new Date(); week.setDate(week.getDate() - 7);
        return d >= week;
    });
    document.getElementById('penaltyCount').textContent = recentPen.length;
    
    // Gate bonus
    const bonusBox = document.getElementById('gateBonusBox');
    const allCleared = quests.length > 0 && quests.every(q => q.cleared);
    if (allCleared) bonusBox.classList.add('claimed');
    else bonusBox.classList.remove('claimed');
    
    // Update bonus text with scaled values
    const bonusTextEl = document.getElementById('gateBonusText');
    if (bonusTextEl && typeof qScale === 'function') {
        const bonusXP = qScale(D.level, 150, 500);
        const bonusGold = qScale(D.level, 50, 150);
        bonusTextEl.textContent = `+${bonusXP} Bonus XP, +${bonusGold} Gold`;
    }
    
    if (quests.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--dim)">[Generating daily gates...]</div>';
        return;
    }
    
    container.innerHTML = quests.map(q => {
        const cls = q.cleared ? 'cleared' : q.failed ? 'failed' : '';
        const penaltyCls = q.isPenalty ? ' quest-penalty' : '';
        const check = q.cleared ? '✓' : q.failed ? '✗' : '';
        const rewardLabel = q.isPenalty ? 'Mercy' : '';
        return `
            <div class="quest-item ${cls}${penaltyCls}" data-qid="${q.id}">
                <div class="qi-check">${check}</div>
                <div class="qi-body">
                    <div class="qi-title">${q.title}</div>
                    <div class="qi-desc">${q.desc}</div>
                </div>
                <div class="qi-reward">
                    <div class="qi-xp">${rewardLabel} +${q.xp} XP</div>
                    <div class="qi-gold">+${q.gold} G</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Click to clear
    container.querySelectorAll('.quest-item:not(.cleared):not(.failed)').forEach(el => {
        el.addEventListener('click', () => {
            const qid = parseFloat(el.dataset.qid);
            const result = clearQuest(qid);
            if (result) {
                if (typeof vibrate === 'function') vibrate([40, 30, 40]);
                el.classList.add('cleared', 'just-cleared');
                el.querySelector('.qi-check').textContent = '✓';
                sysNotify(`[Quest Cleared] "${result.quest.title}" — +${result.quest.xp} XP, +${result.quest.gold} Gold`, 'green');
                refreshUI();
            }
        });
    });
    
    // Penalties
    renderPenalties(recentPen);
}

function renderPenalties(penalties) {
    const el = document.getElementById('penaltyLog');
    if (!penalties || penalties.length === 0) {
        el.innerHTML = '<div style="text-align:center;padding:15px;color:var(--green);font-size:.9rem">✓ No penalties this week. Commendable.</div>';
        return;
    }
    el.innerHTML = penalties.map(p => `
        <div class="pen-item">
            <div class="pen-text">${p.reason}</div>
            <div class="pen-val">-${p.xpLost} XP</div>
        </div>
    `).join('');
}

// ---- Today Feed ----
function renderTodayFeed() {
    const container = document.getElementById('todayFeed');
    const workouts = getTodayWorkouts();
    const foods = getTodayFoods();
    
    const items = [];
    workouts.forEach(w => items.push({ ...w, _type: 'workout', _time: new Date(w.date) }));
    foods.forEach(f => items.push({ ...f, _type: 'food', _time: new Date(f.date) }));
    items.sort((a, b) => b._time - a._time);
    
    if (items.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--dim)">[No activity reported today. The System waits.]</div>';
        return;
    }
    
    container.innerHTML = items.map(item => {
        if (item._type === 'workout') {
            return `
                <div class="feed-item">
                    <div class="fi-icon">⚔</div>
                    <div class="fi-body">
                        <div class="fi-title">${item.exercise}</div>
                        <div class="fi-detail">${item.reps} reps × ${item.sets} sets${item.weight ? ' @ ' + item.weight + 'kg' : ''} · ${item.intensity}</div>
                        <div class="fi-reward">+${item.xp} XP · -${item.calBurned} cal burned</div>
                    </div>
                    <div>
                        <div class="fi-time">${item._time.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                        <button class="fi-del" onclick="handleDeleteWorkout(${item.id})">✕</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="feed-item">
                    <div class="fi-icon">🍖</div>
                    <div class="fi-body">
                        <div class="fi-title">${item.food} <span style="color:var(--dim);font-size:.8rem">(${item.meal})</span></div>
                        <div class="fi-detail">P:${item.protein}g · C:${item.carbs}g · F:${item.fats}g → ${item.calories} kcal</div>
                        <div class="fi-reward">+${item.xp} XP</div>
                    </div>
                    <div>
                        <div class="fi-time">${item._time.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                        <button class="fi-del" onclick="handleDeleteFood(${item.id})">✕</button>
                    </div>
                </div>
            `;
        }
    }).join('');
}

// ---- Skills & Achievements ----
function renderSkills() {
    const el = document.getElementById('skillsList');
    el.innerHTML = SKILLS_DEFS.map(skill => {
        const unlocked = D.unlockedSkills.includes(skill.id);
        return `
            <div class="skill-item ${unlocked ? '' : 'locked'}">
                <div class="si-icon">${skill.icon}</div>
                <div class="si-body">
                    <div class="si-name">${unlocked ? skill.name : '???'}</div>
                    <div class="si-type">${skill.type} · ${unlocked ? 'Unlocked' : 'Lv.' + skill.unlock}</div>
                    <div class="si-desc">${unlocked ? skill.desc : 'Reach level ' + skill.unlock + ' to unlock.'}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAchievements() {
    const el = document.getElementById('achieveList');
    el.innerHTML = ACHIEVEMENTS_DEFS.map(ach => {
        const unlocked = D.achievements.includes(ach.id);
        return `
            <div class="ach-item ${unlocked ? '' : 'locked'}">
                <div class="ai-icon">${ach.icon}</div>
                <div class="ai-body">
                    <div class="ai-name">${ach.name}</div>
                    <div class="ai-desc">${ach.desc}</div>
                </div>
                <div class="ai-status">${unlocked ? '✓ CLEARED' : 'LOCKED'}</div>
            </div>
        `;
    }).join('');
}

// ---- Lifetime ----
function renderLifetime() {
    document.getElementById('ltWorkouts').textContent = D.stats.totalWorkouts;
    document.getElementById('ltCalBurned').textContent = D.stats.totalCalBurned.toLocaleString();
    document.getElementById('ltCalEaten').textContent = D.stats.totalCalConsumed.toLocaleString();
    document.getElementById('ltMeals').textContent = D.stats.totalMeals;
    document.getElementById('ltQuests').textContent = D.stats.totalQuestsCompleted;
    document.getElementById('ltDays').textContent = D.stats.totalDaysActive;
    const smEl = document.getElementById('ltShadowMissions');
    const bossEl = document.getElementById('ltBosses');
    if (smEl) smEl.textContent = D.stats.shadowMissionsCompleted || 0;
    if (bossEl) bossEl.textContent = D.stats.bossesDefeated || 0;
}

// ---- Level Up Overlay ----
function showLevelUp(level, pts) {
    const overlay = document.getElementById('levelUpOverlay');
    document.getElementById('luLevel').textContent = level;
    document.getElementById('luSub').textContent = `+${pts} free stat points · +1 all stats`;
    document.getElementById('luWisdom').textContent = `"${getRandomWisdom()}"`;
    overlay.classList.remove('hidden');
    if (typeof vibrate === 'function') vibrate([50, 80, 50, 80, 100]);
}

function closeLevelUp() {
    document.getElementById('levelUpOverlay').classList.add('hidden');
    refreshUI();
}

// ---- Decay Report Overlay ----
function showDecayReport(report) {
    if (!report || !report.messages || report.messages.length === 0) return;
    
    const overlay = document.getElementById('decayOverlay');
    if (!overlay) return;
    
    // Title
    const titleEl = document.getElementById('decayTitle');
    if (report.missedDays === 1) {
        titleEl.textContent = 'YOU MISSED 1 DAY';
    } else if (report.missedDays <= 3) {
        titleEl.textContent = `${report.missedDays} DAYS ABSENT`;
    } else if (report.missedDays <= 7) {
        titleEl.textContent = `${report.missedDays} DAYS OF WEAKNESS`;
    } else {
        titleEl.textContent = `${report.missedDays} DAYS — NEARLY FORGOTTEN`;
    }
    
    // Subtitle
    const subEl = document.getElementById('decaySubtitle');
    const subs = [
        "The System does not forgive. The System does not forget.",
        "While you rested, the demons grew stronger.",
        "Your absence fed the darkness.",
        "The shadows waited. You did not come.",
        "Weakness is a debt. Today you pay.",
    ];
    subEl.textContent = subs[Math.min(report.missedDays - 1, subs.length - 1)];
    
    // Build losses list
    const lossesEl = document.getElementById('decayLosses');
    let html = '';
    
    report.messages.forEach(msg => {
        const isStat = msg.includes('Stats');
        const isPenalty = msg.includes('PENALTY');
        
        let cls = 'decay-loss-item';
        if (isStat) cls += ' decay-loss-critical';
        else if (isPenalty) cls += ' decay-loss-penalty';
        
        html += `<div class="${cls}">${msg}</div>`;
    });
    
    lossesEl.innerHTML = html;
    
    // Vibrate aggressively
    if (typeof vibrate === 'function') vibrate([200, 100, 200, 100, 300]);
    
    overlay.classList.remove('hidden');
}

function closeDecayReport() {
    const overlay = document.getElementById('decayOverlay');
    if (overlay) overlay.classList.add('hidden');
    
    // Clear pending report
    if (D && D._pendingDecayReport) {
        delete D._pendingDecayReport;
        saveGame();
    }
    
    refreshUI();
}
