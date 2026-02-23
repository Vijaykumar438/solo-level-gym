// ==========================================
//  FEATURES.JS — Shadow Missions, Boss Raid,
//  Shadow Army, Daily Login Rewards
// ==========================================

// ============= SURPRISE SHADOW MISSIONS =============
const SHADOW_MISSIONS = [
    // Quick Burst challenges (30-120 sec timer)
    { title: '⚡ SHADOW SURGE', desc: 'Drop and do 20 push-ups RIGHT NOW!', timer: 90, xp: 120, gold: 30, type: 'burst' },
    { title: '⚡ GHOST SPRINT', desc: '30 seconds of high-knees — GO!', timer: 60, xp: 100, gold: 25, type: 'burst' },
    { title: '⚡ IRON HOLD', desc: 'Hold a plank for 45 seconds. The shadows are watching.', timer: 60, xp: 110, gold: 28, type: 'burst' },
    { title: '⚡ SHADOW SQUATS', desc: '25 bodyweight squats. Feel the burn. Embrace it.', timer: 75, xp: 100, gold: 25, type: 'burst' },
    { title: '⚡ PHANTOM BURSTS', desc: '10 burpees. No rest. No mercy.', timer: 90, xp: 140, gold: 35, type: 'burst' },
    { title: '⚡ DEMON LUNGES', desc: '20 walking lunges. Each step brings power.', timer: 75, xp: 100, gold: 25, type: 'burst' },
    { title: '⚡ SHADOW DIPS', desc: '15 dips on any surface — chair, bench, floor.', timer: 60, xp: 90, gold: 22, type: 'burst' },
    { title: '⚡ MONARCH\'S CRUNCH', desc: '30 crunches. The core is the throne of power.', timer: 75, xp: 95, gold: 24, type: 'burst' },
    // Discipline challenges
    { title: '🧊 COLD DECREE', desc: 'Splash cold water on your face or take a cold shower now.', timer: 120, xp: 80, gold: 20, type: 'discipline' },
    { title: '🧘 SHADOW SILENCE', desc: '60 seconds of eyes-closed deep breathing. Still your mind.', timer: 90, xp: 70, gold: 18, type: 'discipline' },
    { title: '💧 HYDRATION ORDER', desc: 'Drink a full glass of water right now. Fuel the machine.', timer: 45, xp: 50, gold: 12, type: 'discipline' },
    { title: '📖 MENTAL GATE', desc: 'Read one page of any book. Knowledge is power.', timer: 120, xp: 60, gold: 15, type: 'discipline' },
    // Power challenges (harder, more reward)
    { title: '💀 MONARCH\'S TRIAL', desc: '15 push-ups + 15 squats + 30s plank. No breaks.', timer: 120, xp: 200, gold: 50, type: 'power' },
    { title: '💀 SHADOW GAUNTLET', desc: '10 burpees + 20 mountain climbers. Survive.', timer: 120, xp: 220, gold: 55, type: 'power' },
    { title: '💀 ARISE PROTOCOL', desc: '1 minute wall sit + 20 push-ups. The shadows demand it.', timer: 150, xp: 250, gold: 60, type: 'power' },
];

let shadowMissionActive = false;
let shadowMissionTimer = null;
let shadowMissionInterval = null;

function tryTriggerShadowMission() {
    if (shadowMissionActive) return;
    if (!D) return;
    
    // Don't trigger if player just started (level 1, no workouts)
    if (D.level < 2 && D.stats.totalWorkouts < 1) return;
    
    // Check cooldown — max 1 per 30 min
    const lastMission = D.lastShadowMission || 0;
    const now = Date.now();
    if (now - lastMission < 30 * 60 * 1000) return;
    
    // Random chance: ~15% on each trigger check
    if (Math.random() > 0.15) return;
    
    // Filter by level
    let pool = SHADOW_MISSIONS.filter(m => m.type === 'burst' || m.type === 'discipline');
    if (D.level >= 10) pool = pool.concat(SHADOW_MISSIONS.filter(m => m.type === 'power'));
    
    const mission = pool[Math.floor(Math.random() * pool.length)];
    showShadowMission(mission);
}

function showShadowMission(mission) {
    shadowMissionActive = true;
    D.lastShadowMission = Date.now();
    saveGame();
    
    if (typeof vibrate === 'function') vibrate([100, 50, 100, 50, 200]);
    
    const overlay = document.getElementById('shadowMissionOverlay');
    document.getElementById('smTitle').textContent = mission.title;
    document.getElementById('smDesc').textContent = mission.desc;
    document.getElementById('smReward').textContent = `+${mission.xp} XP · +${mission.gold} Gold`;
    
    let remaining = mission.timer;
    const timerEl = document.getElementById('smTimer');
    const timerFill = document.getElementById('smTimerFill');
    timerEl.textContent = remaining + 's';
    timerFill.style.width = '100%';
    
    overlay.classList.remove('hidden');
    overlay.classList.add('sm-entrance');
    setTimeout(() => overlay.classList.remove('sm-entrance'), 600);
    if (typeof playSound === 'function') playSound('shadowMission');
    
    shadowMissionInterval = setInterval(() => {
        remaining--;
        timerEl.textContent = remaining + 's';
        timerFill.style.width = ((remaining / mission.timer) * 100) + '%';
        
        if (remaining <= 10) timerFill.classList.add('sm-urgent');
        
        if (remaining <= 0) {
            failShadowMission(mission);
        }
    }, 1000);
    
    // Store current mission for the buttons
    overlay._mission = mission;
}

function completeShadowMission() {
    const overlay = document.getElementById('shadowMissionOverlay');
    const mission = overlay._mission;
    clearInterval(shadowMissionInterval);
    
    grantXP(mission.xp);
    grantGold(mission.gold);
    D.stats.shadowMissionsCompleted = (D.stats.shadowMissionsCompleted || 0) + 1;
    
    // Shadow army: every 3 missions = +1 soldier
    if (D.stats.shadowMissionsCompleted % 3 === 0) {
        D.shadowArmy = (D.shadowArmy || 0) + 1;
        sysNotify(`[Shadow Extraction] A new shadow soldier has joined your army! (${D.shadowArmy} total)`, 'gold');
    }
    
    saveGame();
    
    if (typeof vibrate === 'function') vibrate([40, 30, 40]);
    sysNotify(`[Mission Complete] ${mission.title} — +${mission.xp} XP, +${mission.gold} Gold`, 'green');
    
    overlay.classList.add('hidden');
    shadowMissionActive = false;
    refreshUI();
}

function failShadowMission(mission) {
    clearInterval(shadowMissionInterval);
    const overlay = document.getElementById('shadowMissionOverlay');
    
    const xpLost = Math.round(mission.xp * 0.3);
    applyPenalty(`Shadow Mission failed: "${mission.title}"`, xpLost);
    
    if (typeof vibrate === 'function') vibrate([200]);
    sysNotify(`[Mission Failed] Time expired. -${xpLost} XP penalty.`, 'red');
    
    overlay.classList.add('hidden');
    shadowMissionActive = false;
    refreshUI();
}

function skipShadowMission() {
    clearInterval(shadowMissionInterval);
    const overlay = document.getElementById('shadowMissionOverlay');
    
    sysNotify('[Mission Declined] The shadows note your hesitation...', '');
    
    overlay.classList.add('hidden');
    shadowMissionActive = false;
}


// ============= WEEKLY BOSS RAID =============
const BOSS_POOL = {
    E: [
        { name: 'Iron Golem',         img: 'icons/bosses/iron_golem.svg',         hp: 500,   reward: { xp: 300,  gold: 100 } },
        { name: 'Stone Sentinel',     img: 'icons/bosses/stone_sentinel.svg',     hp: 450,   reward: { xp: 280,  gold: 90 } },
        { name: 'Ruin Crawler',       img: 'icons/bosses/ruin_crawler.svg',       hp: 550,   reward: { xp: 320,  gold: 110 } },
    ],
    D: [
        { name: 'Cerberus',           img: 'icons/bosses/cerberus.svg',           hp: 1200,  reward: { xp: 600,  gold: 200 } },
        { name: 'Venom Serpent',      img: 'icons/bosses/venom_serpent.svg',      hp: 1100,  reward: { xp: 550,  gold: 180 } },
        { name: 'Shadow Stalker',     img: 'icons/bosses/shadow_stalker.svg',     hp: 1300,  reward: { xp: 650,  gold: 220 } },
    ],
    C: [
        { name: 'Ice Monarch',        img: 'icons/bosses/ice_monarch.svg',        hp: 2500,  reward: { xp: 1000, gold: 350 } },
        { name: 'Blood Ogre',         img: 'icons/bosses/blood_ogre.svg',         hp: 2800,  reward: { xp: 1100, gold: 380 } },
        { name: 'Thunder Wyvern',     img: 'icons/bosses/thunder_wyvern.svg',     hp: 2300,  reward: { xp: 950,  gold: 320 } },
        { name: 'Curse Wraith',       img: 'icons/bosses/curse_wraith.svg',       hp: 2600,  reward: { xp: 1050, gold: 360 } },
    ],
    B: [
        { name: 'Demon King Baran',   img: 'icons/bosses/demon_king_baran.svg',   hp: 5000,  reward: { xp: 1800, gold: 500 } },
        { name: 'Flame Titan',        img: 'icons/bosses/flame_titan.svg',        hp: 5500,  reward: { xp: 2000, gold: 550 } },
        { name: 'Abyss Knight',       img: 'icons/bosses/abyss_knight.svg',       hp: 4800,  reward: { xp: 1700, gold: 480 } },
        { name: 'Bone Dragon',        img: 'icons/bosses/bone_dragon.svg',        hp: 5200,  reward: { xp: 1900, gold: 520 } },
    ],
    A: [
        { name: 'Frost Dragon',       img: 'icons/bosses/frost_dragon.svg',       hp: 10000, reward: { xp: 3000, gold: 800 } },
        { name: 'Monarch of Plague',   img: 'icons/bosses/monarch_of_plague.svg', hp: 11000, reward: { xp: 3200, gold: 850 } },
        { name: 'Beast Sovereign',     img: 'icons/bosses/beast_sovereign.svg',   hp: 9500,  reward: { xp: 2800, gold: 750 } },
        { name: 'Iron Body Monarch',   img: 'icons/bosses/iron_body_monarch.svg', hp: 12000, reward: { xp: 3500, gold: 900 } },
    ],
    S: [
        { name: 'Antares',            img: 'icons/bosses/antares.svg',            hp: 25000, reward: { xp: 6000,  gold: 1500 } },
        { name: 'Shadow Monarch',     img: 'icons/bosses/shadow_monarch.svg',     hp: 28000, reward: { xp: 6500,  gold: 1700 } },
        { name: 'Legia',              img: 'icons/bosses/legia.svg',              hp: 23000, reward: { xp: 5500,  gold: 1400 } },
        { name: 'Monarch of Frost',   img: 'icons/bosses/monarch_of_frost.svg',   hp: 26000, reward: { xp: 6200,  gold: 1600 } },
        { name: 'Beru',               img: 'icons/bosses/beru.svg',               hp: 22000, reward: { xp: 5200,  gold: 1300 } },
    ],
    X: [
        { name: 'The Absolute Being', img: 'icons/bosses/the_absolute_being.svg', hp: 100000, reward: { xp: 25000, gold: 10000 } },
        { name: 'Ashborn Reborn',     img: 'icons/bosses/ashborn_reborn.svg',     hp: 90000,  reward: { xp: 22000, gold: 9000 } },
        { name: 'Ruler of Death',     img: 'icons/bosses/ruler_of_death.svg',     hp: 110000, reward: { xp: 28000, gold: 11000 } },
        { name: 'The Architect',      img: 'icons/bosses/the_architect.svg',      hp: 95000,  reward: { xp: 24000, gold: 9500 } },
        { name: 'Chaos Sovereign',    img: 'icons/bosses/chaos_sovereign.svg',    hp: 120000, reward: { xp: 30000, gold: 12000 } },
    ],
};

function getWeeklyBoss() {
    if (!D) return null;
    const now = new Date();
    // Week key: year + ISO week number
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    const weekKey = now.getFullYear() + '-W' + weekNum;
    
    if (!D.boss) D.boss = {};
    
    if (D.boss.weekKey !== weekKey) {
        // New week, new boss — pick from rank pool using week as seed
        const rank = getRank(D.level);
        const pool = BOSS_POOL[rank.name] || BOSS_POOL.E;
        const bossIdx = weekNum % pool.length;
        const template = pool[bossIdx];
        
        // Scale HP by level
        const hpScale = 1 + (D.level * 0.05);
        
        D.boss = {
            weekKey,
            name: template.name,
            img: template.img,
            rank: rank.name,
            maxHp: Math.round(template.hp * hpScale),
            currentHp: Math.round(template.hp * hpScale),
            reward: template.reward,
            defeated: false,
            damageLog: [] // { date, damage, source }
        };
        saveGame();
    }
    
    return D.boss;
}

function dealBossDamage(amount, source) {
    if (!D.boss || D.boss.defeated) return;
    
    D.boss.currentHp = Math.max(0, D.boss.currentHp - amount);
    D.boss.damageLog.push({
        date: new Date().toISOString(),
        damage: amount,
        source
    });
    
    if (D.boss.currentHp <= 0) {
        D.boss.defeated = true;
        D.boss.currentHp = 0;
        grantXP(D.boss.reward.xp);
        grantGold(D.boss.reward.gold);
        D.stats.bossesDefeated = (D.stats.bossesDefeated || 0) + 1;
        
        // +1 shadow soldier for boss kill
        D.shadowArmy = (D.shadowArmy || 0) + 1;
        
        if (typeof vibrate === 'function') vibrate([50, 100, 50, 100, 50, 200]);
        if (typeof playSound === 'function') playSound('bossDefeat');
        sysNotify(`[BOSS DEFEATED] ☠ ${D.boss.name} has fallen! +${D.boss.reward.xp} XP, +${D.boss.reward.gold} Gold, +1 Shadow Soldier!`, 'gold');
        saveGame();
        refreshUI();
        return true;
    }
    
    saveGame();
    return false;
}


// ============= DAILY LOGIN REWARDS =============
const LOGIN_REWARDS = [
    { day: 1, xp: 50,  gold: 10,  label: '50 XP' },
    { day: 2, xp: 75,  gold: 15,  label: '75 XP' },
    { day: 3, xp: 100, gold: 25,  label: '100 XP' },
    { day: 4, xp: 100, gold: 30,  label: '100 XP + 30G' },
    { day: 5, xp: 150, gold: 40,  label: '150 XP' },
    { day: 6, xp: 150, gold: 50,  label: '150 XP + 50G' },
    { day: 7, xp: 300, gold: 100, label: '🌟 300 XP + 100G + Shadow Soldier!' },
];

function checkDailyLogin() {
    if (!D) return;
    const today = new Date().toDateString();
    
    if (D.lastLoginReward === today) return; // Already claimed today
    
    D.lastLoginReward = today;
    D.loginStreak = (D.loginStreak || 0) + 1;
    
    // Check if streak was broken (more than 1 day gap)
    if (D.lastActiveDate) {
        const last = new Date(D.lastActiveDate);
        const now = new Date(today);
        const diff = Math.floor((now - last) / 86400000);
        if (diff > 1) {
            D.loginStreak = 1; // Reset streak
        }
    }
    
    const dayIdx = ((D.loginStreak - 1) % 7); // Cycle every 7 days
    const reward = LOGIN_REWARDS[dayIdx];
    
    grantXP(reward.xp);
    grantGold(reward.gold);
    
    // Day 7 bonus: shadow soldier
    if (dayIdx === 6) {
        D.shadowArmy = (D.shadowArmy || 0) + 1;
    }
    
    saveGame();
    
    // Show login reward popup after a small delay
    setTimeout(() => {
        showLoginReward(reward, D.loginStreak, dayIdx);
    }, 1500);
}

function showLoginReward(reward, streak, dayIdx) {
    const overlay = document.getElementById('loginRewardOverlay');
    document.getElementById('lrStreak').textContent = `Day ${streak} · Login Streak`;
    document.getElementById('lrReward').textContent = `Today: ${reward.label}`;
    
    // Render the 7-day grid
    const grid = document.getElementById('lrGrid');
    grid.innerHTML = LOGIN_REWARDS.map((r, i) => {
        let cls = 'lr-day';
        if (i < dayIdx) cls += ' lr-claimed';
        else if (i === dayIdx) cls += ' lr-today';
        else cls += ' lr-locked';
        return `<div class="${cls}">
            <div class="lr-day-num">Day ${i + 1}</div>
            <div class="lr-day-icon">${i === 6 ? '🌟' : '◆'}</div>
            <div class="lr-day-val">${r.xp} XP</div>
        </div>`;
    }).join('');
    
    overlay.classList.remove('hidden');
    if (typeof vibrate === 'function') vibrate([30, 50, 30]);
    if (typeof playSound === 'function') playSound('loginReward');
}

function closeLoginReward() {
    document.getElementById('loginRewardOverlay').classList.add('hidden');
}


// ============= SHADOW ARMY =============
function getShadowArmyCount() {
    return D.shadowArmy || 0;
}

function getShadowArmyRank() {
    const count = getShadowArmyCount();
    if (count >= 100) return { name: 'Monarch\'s Legion', icon: '👑', tier: 6 };
    if (count >= 50)  return { name: 'Shadow Battalion', icon: '⬛', tier: 5 };
    if (count >= 25)  return { name: 'Shadow Company',   icon: '🖤', tier: 4 };
    if (count >= 10)  return { name: 'Shadow Squad',     icon: '🌑', tier: 3 };
    if (count >= 5)   return { name: 'Shadow Unit',      icon: '◼', tier: 2 };
    if (count >= 1)   return { name: 'First Shadow',     icon: '▪', tier: 1 };
    return { name: 'No Shadows', icon: '○', tier: 0 };
}


// ============= BOSS DAMAGE INTEGRATION =============
// Hook into workout logging to deal boss damage
const _originalLogWorkout = logWorkout;
logWorkout = function(exercise, reps, sets, weight, intensity) {
    const result = _originalLogWorkout(exercise, reps, sets, weight, intensity);
    
    // Deal boss damage based on calories burned
    const damage = Math.round(result.calBurned * 1.5 + result.xpGain * 0.5);
    const boss = getWeeklyBoss();
    if (boss && !boss.defeated) {
        dealBossDamage(damage, exercise);
    }
    
    // Chance to trigger shadow mission after workout
    setTimeout(() => tryTriggerShadowMission(), 3000);
    
    return result;
};


// ============= SHADOW MISSION SCHEDULER =============
// Check for random shadow missions periodically
let shadowMissionScheduler = null;

function startShadowMissionScheduler() {
    // Check every 5-10 minutes
    shadowMissionScheduler = setInterval(() => {
        tryTriggerShadowMission();
    }, (5 + Math.random() * 5) * 60 * 1000);
    
    // Also check 30 seconds after boot
    setTimeout(() => tryTriggerShadowMission(), 30000);
}


// ============= UI RENDER HELPERS =============
function renderBossPanel() {
    const sec = document.getElementById('bossSection');
    if (!sec) return;
    
    const boss = getWeeklyBoss();
    if (!boss) return;
    
    const b = D.boss;
    const defeated = b && b.defeated;
    
    document.getElementById('bossRankLabel').textContent = boss.rank + '-Rank';
    const bossIconEl = document.getElementById('bossIcon');
    if (boss.img) {
        bossIconEl.innerHTML = '<img src="' + boss.img + '" alt="' + boss.name + '" draggable="false">';
    } else {
        bossIconEl.textContent = '👹';
    }
    document.getElementById('bossName').textContent = boss.name;
    
    if (defeated) {
        document.getElementById('bossHpText').textContent = 'DEFEATED';
        document.getElementById('bossHpFill').style.width = '0%';
        document.getElementById('bossHpFill').style.background = 'var(--green)';
        const hint = sec.querySelector('.boss-damage-hint');
        if (hint) hint.innerHTML = '<span style="color:var(--green)">✓ Boss defeated this week! +' + boss.reward.xp + ' XP earned</span>';
    } else if (b) {
        const pct = Math.max((b.currentHp / b.maxHp) * 100, 0);
        document.getElementById('bossHpText').textContent = Math.ceil(b.currentHp) + ' / ' + b.maxHp;
        document.getElementById('bossHpFill').style.width = pct + '%';
        
        // Color shifts as HP drops
        if (pct < 25) document.getElementById('bossHpFill').style.background = 'linear-gradient(90deg,#1b5e20,#4caf50)';
        else if (pct < 50) document.getElementById('bossHpFill').style.background = 'linear-gradient(90deg,#e65100,#ff9800)';
    }
}

function renderArmyPanel() {
    const countEl = document.getElementById('armyCount');
    const rankEl = document.getElementById('armyRankName');
    const visualEl = document.getElementById('armyVisual');
    if (!countEl) return;
    
    const count = getShadowArmyCount();
    const armyRank = getShadowArmyRank();
    countEl.textContent = count;
    rankEl.textContent = armyRank.name;
    
    // Update army icon
    const iconEl = document.getElementById('armySection');
    if (iconEl) {
        const ico = iconEl.querySelector('.army-icon');
        if (ico) ico.textContent = armyRank.icon;
    }
    
    // Build visual soldiers (max 30 dots)
    const showCount = Math.min(count, 30);
    let html = '';
    for (let i = 0; i < showCount; i++) {
        html += '<div class="army-soldier"></div>';
    }
    if (count > 30) html += `<span style="color:var(--dim);font-size:.7rem;margin-left:4px">+${count - 30}</span>`;
    visualEl.innerHTML = html;
}
