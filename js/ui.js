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
    // Play error buzz for red notifications
    if (type === 'red' && typeof playSound === 'function') playSound('error');
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
            
            if (target === 'analysis') {
                setTimeout(renderAllCharts, 120);
                setTimeout(renderCalendar, 50);
            }
            if (target === 'shop' && typeof renderShop === 'function') setTimeout(renderShop, 50);
            if (target === 'skilltree' && typeof renderSkillTree === 'function') setTimeout(renderSkillTree, 50);
            if (target === 'tutorial' && typeof renderTutorial === 'function') setTimeout(renderTutorial, 50);
            if (target === 'journal' && typeof renderJournal === 'function') setTimeout(renderJournal, 50);
            if (target === 'log' && typeof renderTemplates === 'function') setTimeout(renderTemplates, 50);
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
    
    // Energy Balance
    if (typeof renderEnergyBalance === 'function') renderEnergyBalance();
    
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

    // Journal tab badge (unread count)
    if (typeof getUnreadJournalCount === 'function') {
        const count = getUnreadJournalCount();
        const journalTab = document.querySelector('.tab[data-tab="journal"]');
        if (journalTab) {
            let badge = journalTab.querySelector('.tab-badge');
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'tab-badge';
                    journalTab.appendChild(badge);
                }
                badge.textContent = count;
            } else if (badge) {
                badge.remove();
            }
        }
    }
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
        const bonusXP = qScale(D.level, 250, 800);
        const bonusGold = qScale(D.level, 80, 250);
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

    // Weekly Muscle Coverage
    renderMuscleCoverage();
}

function renderMuscleCoverage() {
    const grid = document.getElementById('muscleCoverageGrid');
    if (!grid || typeof getWeeklyCoverage !== 'function') return;

    const coverage = getWeeklyCoverage();
    const groupIcons = { 'Chest': '🫁', 'Back': '🔙', 'Shoulders': '🪨', 'Arms': '💪', 'Legs': '🦵', 'Core': '🎯' };

    grid.innerHTML = coverage.map(c => {
        const icon = groupIcons[c.group] || '◈';
        const status = c.days >= 2 ? 'hit' : c.days === 1 ? 'partial' : 'miss';
        const dots = '●'.repeat(Math.min(c.days, 3)) + '○'.repeat(Math.max(0, 2 - c.days));
        return `
            <div class="mc-item mc-${status}">
                <div class="mc-icon">${icon}</div>
                <div class="mc-name">${c.group}</div>
                <div class="mc-dots">${dots}</div>
                <div class="mc-count">${c.days}×</div>
            </div>
        `;
    }).join('');
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

// ═══════════════════════════════════════════
//  DUNGEON CALENDAR HEATMAP
// ═══════════════════════════════════════════

let _heatmapYear = new Date().getFullYear();

function renderCalendar(year) {
    if (year !== undefined) _heatmapYear = year;
    const yr = _heatmapYear;

    const grid = document.getElementById('heatmapGrid');
    const monthsEl = document.getElementById('heatmapMonths');
    const yearEl = document.getElementById('heatmapYear');
    if (!grid) return;

    yearEl.textContent = yr;

    // ---- Build daily XP map ----
    const dailyXP = {};
    const dailyCount = {};

    function addDay(dateStr, xp) {
        const day = dateStr.slice(0, 10); // YYYY-MM-DD
        dailyXP[day] = (dailyXP[day] || 0) + xp;
        dailyCount[day] = (dailyCount[day] || 0) + 1;
    }

    if (D.workouts) D.workouts.forEach(w => addDay(w.date, w.xp || 0));
    if (D.foods) D.foods.forEach(f => addDay(f.date, f.xp || 0));
    if (D.quests) D.quests.filter(q => q.cleared).forEach(q => addDay(q.date, q.xp || 0));

    // ---- Determine XP thresholds for color levels ----
    const xpValues = Object.values(dailyXP).filter(v => v > 0).sort((a, b) => a - b);
    let t1 = 30, t2 = 80, t3 = 150, t4 = 300;
    if (xpValues.length > 4) {
        t1 = xpValues[Math.floor(xpValues.length * 0.2)] || 30;
        t2 = xpValues[Math.floor(xpValues.length * 0.45)] || 80;
        t3 = xpValues[Math.floor(xpValues.length * 0.7)] || 150;
        t4 = xpValues[Math.floor(xpValues.length * 0.9)] || 300;
    }

    function xpLevel(xp) {
        if (!xp || xp <= 0) return 0;
        if (xp < t1) return 1;
        if (xp < t2) return 2;
        if (xp < t3) return 3;
        return 4;
    }

    // ---- Build grid: weeks as columns, days as rows ----
    // Start from Jan 1 of the year
    const jan1 = new Date(yr, 0, 1);
    const dec31 = new Date(yr, 11, 31);
    const startDow = (jan1.getDay() + 6) % 7; // Monday=0

    // Pad start
    const startDate = new Date(jan1);
    startDate.setDate(startDate.getDate() - startDow);

    // Generate all cells (up to 53 weeks × 7 days)
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cursor = new Date(startDate);

    let totalActiveDays = 0;
    let totalXP = 0;

    while (cursor <= dec31 || (cursor.getDay() + 6) % 7 !== 0) {
        const dateStr = cursor.toISOString().slice(0, 10);
        const isThisYear = cursor.getFullYear() === yr;
        const isFuture = cursor > today;
        const xp = dailyXP[dateStr] || 0;
        const count = dailyCount[dateStr] || 0;
        const lv = (isThisYear && !isFuture) ? xpLevel(xp) : -1;

        if (isThisYear && xp > 0) {
            totalActiveDays++;
            totalXP += xp;
        }

        cells.push({
            date: dateStr,
            dow: (cursor.getDay() + 6) % 7,
            month: cursor.getMonth(),
            year: cursor.getFullYear(),
            lv, xp, count, isFuture, isThisYear
        });

        cursor.setDate(cursor.getDate() + 1);
        // Safety break
        if (cells.length > 400) break;
    }

    // ---- Render grid ----
    // Group by week (columns)
    const weeks = [];
    let currentWeek = [];
    cells.forEach((cell, i) => {
        currentWeek.push(cell);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length) weeks.push(currentWeek);

    let html = '';
    weeks.forEach(week => {
        html += '<div class="heatmap-week">';
        week.forEach(cell => {
            let cls = 'heatmap-cell';
            if (!cell.isThisYear) cls += ' hm-outside';
            else if (cell.isFuture) cls += ' hm-future';
            else cls += ` hm-lv${cell.lv}`;

            // Today marker
            const todayStr = today.toISOString().slice(0, 10);
            if (cell.date === todayStr) cls += ' hm-today';

            html += `<div class="${cls}" data-date="${cell.date}" data-xp="${cell.xp}" data-count="${cell.count}"></div>`;
        });
        html += '</div>';
    });
    grid.innerHTML = html;

    // ---- Month labels ----
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let monthHtml = '';
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        const firstCell = week.find(c => c.isThisYear && c.dow === 0);
        if (firstCell && firstCell.month !== lastMonth) {
            lastMonth = firstCell.month;
            monthHtml += `<span class="heatmap-month-label" style="grid-column:${wi + 1}">${monthNames[firstCell.month]}</span>`;
        }
    });
    monthsEl.innerHTML = monthHtml;

    // ---- Stats ----
    document.getElementById('hmTotalDays').textContent = totalActiveDays;
    document.getElementById('hmTotalXP').textContent = totalXP.toLocaleString();
    document.getElementById('hmStreak').textContent = D.streak || 0;

    // ---- Tooltip on hover ----
    grid.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener('mouseenter', (e) => showHeatmapTooltip(e, cell));
        cell.addEventListener('mouseleave', hideHeatmapTooltip);
        cell.addEventListener('touchstart', (e) => { e.preventDefault(); showHeatmapTooltip(e, cell); }, { passive: false });
    });
}

function showHeatmapTooltip(e, cell) {
    const tooltip = document.getElementById('heatmapTooltip');
    if (!tooltip) return;

    const date = cell.dataset.date;
    const xp = parseInt(cell.dataset.xp) || 0;
    const count = parseInt(cell.dataset.count) || 0;

    const d = new Date(date + 'T00:00:00');
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formatted = `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    let text = `<strong>${formatted}</strong><br>`;
    if (xp > 0) {
        text += `⚡ ${xp} XP · ${count} activities`;
    } else {
        text += `<span style="color:#555">No gates opened</span>`;
    }

    tooltip.innerHTML = text;
    tooltip.classList.remove('hidden');

    const rect = cell.getBoundingClientRect();
    const container = cell.closest('.heatmap-container').getBoundingClientRect();
    tooltip.style.left = (rect.left - container.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - container.top - 40) + 'px';
}

function hideHeatmapTooltip() {
    const tooltip = document.getElementById('heatmapTooltip');
    if (tooltip) tooltip.classList.add('hidden');
}

function initHeatmapNav() {
    const prev = document.getElementById('heatmapPrev');
    const next = document.getElementById('heatmapNext');
    if (prev) prev.addEventListener('click', () => { _heatmapYear--; renderCalendar(); });
    if (next) next.addEventListener('click', () => {
        if (_heatmapYear < new Date().getFullYear()) { _heatmapYear++; renderCalendar(); }
    });
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
    if (typeof playSound === 'function') playSound('penalty');
    
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
