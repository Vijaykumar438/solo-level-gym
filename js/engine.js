// ==========================================
//  ENGINE.JS — Core game logic
// ==========================================

let D; // global data reference

function loadGame() {
    const raw = localStorage.getItem('soloLevelingSystem');
    if (raw) {
        try {
            D = JSON.parse(raw);
            // Merge any new keys from defaults
            const def = getDefaultData();
            for (const k in def) {
                if (!(k in D)) D[k] = def[k];
            }
            for (const k in def.stats) {
                if (!(k in D.stats)) D.stats[k] = def.stats[k];
            }
            if (!D.physique) D.physique = def.physique;
            if (!D.settings) D.settings = def.settings;
            if (!D.shop) D.shop = def.shop;
            // Merge new settings keys
            for (const k in def.settings) {
                if (!(k in D.settings)) D.settings[k] = def.settings[k];
            }
        } catch {
            D = getDefaultData();
        }
    } else {
        D = getDefaultData();
    }
}

function saveGame() {
    localStorage.setItem('soloLevelingSystem', JSON.stringify(D));
    // Trigger cloud save (debounced) if authenticated
    if (typeof cloudSaveDebounced === 'function') {
        cloudSaveDebounced();
    }
}

// ---- XP & Leveling ----
function grantXP(amount) {
    if (amount <= 0) return;
    D.xp += amount;
    while (D.xp >= xpForLevel(D.level)) {
        levelUp();
    }
    saveGame();
}

function levelUp() {
    const needed = xpForLevel(D.level);
    D.xp -= needed;
    D.level++;
    
    // Grant free stat points (3-7 based on rank)
    const rank = getRank(D.level);
    let pts = 3;
    if (rank.name === 'D') pts = 3;
    else if (rank.name === 'C') pts = 4;
    else if (rank.name === 'B') pts = 4;
    else if (rank.name === 'A') pts = 5;
    else if (rank.name === 'S') pts = 5;
    else if (rank.name === 'X') pts = 7;
    D.freePoints += pts;
    
    // Auto +1 to all stats
    D.stats.str += 1;
    D.stats.agi += 1;
    D.stats.vit += 1;
    D.stats.end += 1;
    D.stats.wil += 1;
    D.stats.phs = Math.round((D.stats.phs + 0.5) * 10) / 10;
    
    // Check for new skill unlocks
    checkSkillUnlocks();
    
    // Check achievements
    checkAchievements();
    
    // Show level up overlay
    showLevelUp(D.level, pts);
    if (typeof playSound === 'function') playSound('levelUp');
    
    saveGame();
}

function grantGold(amount) {
    D.gold += amount;
    saveGame();
}

function loseXP(amount) {
    D.xp = Math.max(0, D.xp - amount);
    saveGame();
}

// ---- Stat Allocation ----
function allocateStat(stat) {
    if (D.freePoints <= 0) return false;
    if (stat === 'phs') {
        D.stats.phs = Math.round((D.stats.phs + 1) * 10) / 10;
    } else {
        D.stats[stat] += 1;
    }
    D.freePoints--;
    saveGame();
    return true;
}

// ---- Workout Logging ----
function logWorkout(exercise, reps, sets, weight, intensity) {
    const rate = CALORIE_RATES[exercise] || CALORIE_RATES['Other'];
    const intensityRate = rate[intensity] || rate.medium;
    
    // Calorie calc: cardio uses duration (minutes), others use rep timing
    let calBurned;
    const exDef = (typeof EXERCISE_DB !== 'undefined') && EXERCISE_DB.find(e => e.name === exercise);
    const isCardio = exDef ? exDef.isCardio : ['Running','Cycling','Swimming','Walking','HIIT','Jump Rope','Boxing'].includes(exercise);
    if (isCardio) {
        // reps = minutes for cardio
        calBurned = Math.round(reps * intensityRate * sets);
    } else {
        // rep-based: estimate time
        const timeMin = (reps * sets * 3) / 60; // ~3 sec per rep
        calBurned = Math.round(timeMin * intensityRate);
        // Bonus for heavy weight
        if (weight > 0) calBurned += Math.round(weight * 0.15 * sets);
    }
    
    // XP calc: base on effort
    let xpGain = Math.round(calBurned * 0.3 + reps * sets * 0.5);
    if (intensity === 'high') xpGain = Math.round(xpGain * 1.3);
    if (weight > 50) xpGain += 20;
    xpGain = Math.max(10, xpGain);
    
    // Gold
    const goldGain = Math.round(xpGain * 0.2);
    
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        exercise, reps, sets, weight, intensity,
        calBurned, xp: xpGain
    };
    
    D.workouts.push(entry);
    D.stats.totalWorkouts++;
    D.stats.totalCalBurned += calBurned;
    
    grantXP(xpGain);
    grantGold(goldGain);
    checkAchievements();
    
    saveGame();
    return { entry, xpGain, goldGain, calBurned };
}

// ---- Food Logging ----
function logFood(food, meal, protein, carbs, fats) {
    const calories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    const xpGain = Math.max(5, Math.round(calories * 0.04));
    const goldGain = Math.round(xpGain * 0.1);
    
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        food, meal, protein, carbs, fats, calories, xp: xpGain
    };
    
    D.foods.push(entry);
    D.stats.totalCalConsumed += calories;
    D.stats.totalMeals++;
    
    grantXP(xpGain);
    grantGold(goldGain);
    checkAchievements();
    
    saveGame();
    return { entry, xpGain, goldGain, calories };
}

// ---- Delete entries ----
function deleteWorkout(id) {
    const idx = D.workouts.findIndex(w => w.id === id);
    if (idx === -1) return;
    const w = D.workouts[idx];
    D.stats.totalWorkouts = Math.max(0, D.stats.totalWorkouts - 1);
    D.stats.totalCalBurned = Math.max(0, D.stats.totalCalBurned - w.calBurned);
    D.workouts.splice(idx, 1);
    saveGame();
}

function deleteFood(id) {
    const idx = D.foods.findIndex(f => f.id === id);
    if (idx === -1) return;
    const f = D.foods[idx];
    D.stats.totalCalConsumed = Math.max(0, D.stats.totalCalConsumed - f.calories);
    D.stats.totalMeals = Math.max(0, D.stats.totalMeals - 1);
    D.foods.splice(idx, 1);
    saveGame();
}

// ---- Streak & Day Check ----
function checkNewDay() {
    const today = new Date().toDateString();
    if (D.lastActiveDate === today) return false; // Same day
    
    if (D.lastActiveDate) {
        const last = new Date(D.lastActiveDate);
        const now = new Date(today);
        const diff = Math.floor((now - last) / 86400000);
        
        if (diff > 1) {
            // Missed day(s) — DEGRADATION SYSTEM
            const missed = diff - 1;
            const report = applyDegradation(missed);
            D.streak = 0;
            
            // Show decay report on boot
            D._pendingDecayReport = report;
        }
        
        // Check if yesterday's quests had failures
        checkYesterdayFailures();
    }
    
    D.lastActiveDate = today;
    D.stats.totalDaysActive++;
    saveGame();
    return true; // Is a new day
}

// ---- DEGRADATION SYSTEM ----
// The System punishes absence. Severity escalates with missed days.
function applyDegradation(missed) {
    const level = D.level;
    const rank = getRank(level);
    const report = {
        missedDays: missed,
        xpLost: 0,
        goldLost: 0,
        statsLost: {},
        soldiersLost: 0,
        penaltyQuest: false,
        messages: []
    };
    
    // ========= TIER 1: XP PENALTY (always) =========
    // Base: 50 per day, scales with level. Exponential for consecutive days.
    const baseXpPerDay = 50 + Math.floor(level * 2.5);
    let totalXpLost = 0;
    for (let i = 1; i <= missed; i++) {
        // Each consecutive day hurts 30% more than the last
        totalXpLost += Math.floor(baseXpPerDay * Math.pow(1.3, i - 1));
    }
    report.xpLost = totalXpLost;
    loseXP(totalXpLost);
    applyPenalty(
        `Absent for ${missed} day${missed > 1 ? 's' : ''}. The System does not forgive. -${totalXpLost} XP.`,
        totalXpLost
    );
    report.messages.push(`☠ ${totalXpLost} XP devoured by the void.`);
    
    // ========= TIER 2: GOLD DRAIN (2+ days) =========
    if (missed >= 2) {
        // Lose 10% of gold per missed day (min 20 per day)
        const goldPerDay = Math.max(20, Math.floor(D.gold * 0.10));
        const totalGoldLost = Math.min(D.gold, goldPerDay * missed);
        D.gold = Math.max(0, D.gold - totalGoldLost);
        report.goldLost = totalGoldLost;
        if (totalGoldLost > 0) {
            report.messages.push(`💰 ${totalGoldLost} Gold plundered by demons.`);
        }
    }
    
    // ========= TIER 3: SHADOW ARMY DESERTION (3+ days) =========
    if (missed >= 3 && D.shadowArmy > 0) {
        // Lose 1 soldier per 2 missed days
        const soldiersLost = Math.min(D.shadowArmy, Math.floor(missed / 2));
        D.shadowArmy = Math.max(0, D.shadowArmy - soldiersLost);
        report.soldiersLost = soldiersLost;
        if (soldiersLost > 0) {
            report.messages.push(`👤 ${soldiersLost} shadow soldier${soldiersLost > 1 ? 's' : ''} deserted your army.`);
        }
    }
    
    // ========= TIER 4: STAT DECAY (4+ days) =========
    if (missed >= 4) {
        const decayable = ['str', 'agi', 'vit', 'end', 'wil'];
        const decayCount = Math.min(missed - 3, 5); // 1 stat at 4 days, up to 5 at 8+
        const decayed = {};
        
        // Pick random stats to decay
        const shuffled = [...decayable].sort(() => Math.random() - 0.5);
        for (let i = 0; i < decayCount && i < shuffled.length; i++) {
            const stat = shuffled[i];
            const loss = missed >= 7 ? 2 : 1; // 7+ days = -2 per stat
            const minStat = 1; // Never drop below 1
            const actualLoss = Math.min(loss, D.stats[stat] - minStat);
            if (actualLoss > 0) {
                D.stats[stat] -= actualLoss;
                decayed[stat] = actualLoss;
            }
        }
        
        // PHS also decays
        if (missed >= 5) {
            const phsLoss = missed >= 7 ? 1.0 : 0.5;
            const actualPhsLoss = Math.min(phsLoss, D.stats.phs - 0.5);
            if (actualPhsLoss > 0) {
                D.stats.phs = Math.round((D.stats.phs - actualPhsLoss) * 10) / 10;
                decayed['phs'] = actualPhsLoss;
            }
        }
        
        report.statsLost = decayed;
        const statNames = Object.entries(decayed).map(([s, v]) => `${s.toUpperCase()} -${v}`);
        if (statNames.length > 0) {
            report.messages.push(`📉 Stats decayed: ${statNames.join(', ')}`);
        }
    }
    
    // ========= TIER 5: PENALTY QUEST (3+ days) =========
    if (missed >= 3) {
        report.penaltyQuest = true;
        generatePenaltyQuest(missed);
        report.messages.push(`⚠ PENALTY QUEST issued. Complete it or suffer further.`);
    }
    
    saveGame();
    return report;
}

// ---- Generate Penalty Quest ----
function generatePenaltyQuest(missedDays) {
    const level = D.level;
    const severity = Math.min(missedDays, 10); // Cap at 10 for scaling
    
    const penaltyQuests = [
        {
            title: '☠ PENALTY: Atonement Reps',
            desc: `Complete ${50 + severity * 20 + level * 2} reps of any exercise. The System demands payment.`,
            xp: 0, gold: 0, type: 'penalty'
        },
        {
            title: '☠ PENALTY: Shadow Penance',
            desc: `Log ${severity >= 5 ? 2 : 1} full workout session${severity >= 5 ? 's' : ''} today. Absence has consequences.`,
            xp: 0, gold: 0, type: 'penalty'
        },
        {
            title: '☠ PENALTY: Crawl Back',
            desc: `Complete ${20 + severity * 10} push-ups and ${30 + severity * 10} squats. Earn your place back.`,
            xp: 0, gold: 0, type: 'penalty'
        },
        {
            title: '☠ PENALTY: Demon Tax',
            desc: `Log all meals today AND complete a workout. You owe the System everything.`,
            xp: 0, gold: 0, type: 'penalty'
        },
        {
            title: '☠ PENALTY: The Price of Weakness',
            desc: `${30 + severity * 5} min cardio + ${30 + severity * 10} reps strength. Pain is the tax on laziness.`,
            xp: 0, gold: 0, type: 'penalty'
        },
    ];
    
    const quest = penaltyQuests[Math.floor(Math.random() * penaltyQuests.length)];
    quest.id = Date.now() + '_' + Math.floor(Math.random() * 1000000);
    quest.date = new Date().toISOString();
    quest.cleared = false;
    quest.failed = false;
    quest.isPenalty = true;
    
    // Penalty quests give NO reward — they only stop the bleeding
    // But if you CLEAR it, you get a small mercy reward
    quest.xp = Math.round(30 + level * 1.5);
    quest.gold = Math.round(10 + level * 0.5);
    
    D.quests.push(quest);
    saveGame();
}

function checkYesterdayFailures() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toDateString();
    
    const yQuests = D.quests.filter(q => new Date(q.date).toDateString() === yStr);
    const failed = yQuests.filter(q => !q.cleared && !q.failed);
    
    failed.forEach(q => {
        q.failed = true;
        const xpLost = Math.round(q.xp * 0.5);
        applyPenalty(`Failed quest: "${q.title}" — ${xpLost} XP forfeited.`, xpLost);
    });
    
    saveGame();
}

function applyPenalty(reason, xpLost) {
    D.penalties.push({
        id: Date.now() + Math.random(),
        date: new Date().toISOString(),
        reason,
        xpLost
    });
    D.stats.totalPenalties++;
    loseXP(xpLost);
}

// ---- Skills ----
function checkSkillUnlocks() {
    SKILLS_DEFS.forEach(skill => {
        if (D.level >= skill.unlock && !D.unlockedSkills.includes(skill.id)) {
            D.unlockedSkills.push(skill.id);
            sysNotify(`[Skill Acquired] ${skill.name} — ${skill.desc}`, 'gold');
        }
    });
}

// ---- Achievements ----
function checkAchievements() {
    ACHIEVEMENTS_DEFS.forEach(ach => {
        if (!D.achievements.includes(ach.id) && ach.cond(D)) {
            D.achievements.push(ach.id);
            grantXP(80);
            grantGold(30);
            sysNotify(`[Achievement Unlocked] ${ach.icon} ${ach.name} — +80 XP, +30 Gold`, 'gold');
        }
    });
    saveGame();
}

// ---- Physique ----
function updatePhysique(current, target) {
    if (!D.physique.startDate) {
        D.physique.startDate = new Date().toISOString();
        D.physique.startWeight = current;
    }
    D.physique.currentWeight = current;
    D.physique.targetWeight = target;
    D.physique.history.push({ date: new Date().toISOString(), weight: current });
    saveGame();
}

// ---- Body Fat Calculator (U.S. Navy Method) ----
const BF_CATEGORIES_MALE = [
    { max: 6,  label: 'Essential Fat', color: '#ff5252', icon: '⚠️' },
    { max: 14, label: 'Athletic',      color: '#69f0ae', icon: '⚡' },
    { max: 18, label: 'Fitness',       color: '#4fc3f7', icon: '💪' },
    { max: 25, label: 'Average',       color: '#ffd740', icon: '📊' },
    { max: 100,label: 'Above Average', color: '#ff5252', icon: '🔥' }
];
const BF_CATEGORIES_FEMALE = [
    { max: 14, label: 'Essential Fat', color: '#ff5252', icon: '⚠️' },
    { max: 21, label: 'Athletic',      color: '#69f0ae', icon: '⚡' },
    { max: 25, label: 'Fitness',       color: '#4fc3f7', icon: '💪' },
    { max: 32, label: 'Average',       color: '#ffd740', icon: '📊' },
    { max: 100,label: 'Above Average', color: '#ff5252', icon: '🔥' }
];

function calcBodyFat(gender, height, neck, waist, hip) {
    // U.S. Navy Method
    let bf;
    if (gender === 'male') {
        bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
        bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }
    return Math.max(2, Math.min(bf, 60)); // Clamp to sane range
}

function calcBMI(weight, heightCm) {
    const hm = heightCm / 100;
    return weight / (hm * hm);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#4fc3f7' };
    if (bmi < 25)   return { label: 'Normal',      color: '#69f0ae' };
    if (bmi < 30)   return { label: 'Overweight',   color: '#ffd740' };
    return             { label: 'Obese',        color: '#ff5252' };
}

function getBFCategory(bf, gender) {
    const cats = gender === 'male' ? BF_CATEGORIES_MALE : BF_CATEGORIES_FEMALE;
    return cats.find(c => bf <= c.max) || cats[cats.length - 1];
}

function calcLeanMass(weight, bfPct) {
    return weight * (1 - bfPct / 100);
}

function calcFatMass(weight, bfPct) {
    return weight * (bfPct / 100);
}

function saveBodyComp(gender, height, neck, waist, hip, bf, bmi) {
    if (!D.physique.bodyComp) D.physique.bodyComp = {};
    D.physique.bodyComp.gender = gender;
    D.physique.bodyComp.height = height;
    D.physique.bodyComp.neck = neck;
    D.physique.bodyComp.waist = waist;
    D.physique.bodyComp.hip = hip;
    D.physique.bodyComp.lastBF = bf;
    D.physique.bodyComp.lastBMI = bmi;
    D.physique.bodyComp.lastDate = new Date().toISOString();
    // History
    if (!D.physique.bodyComp.history) D.physique.bodyComp.history = [];
    D.physique.bodyComp.history.push({
        date: new Date().toISOString(),
        bf: Math.round(bf * 10) / 10,
        bmi: Math.round(bmi * 10) / 10,
        weight: D.physique.currentWeight || null,
        waist, neck, hip
    });
    // Keep last 50 entries
    if (D.physique.bodyComp.history.length > 50) {
        D.physique.bodyComp.history = D.physique.bodyComp.history.slice(-50);
    }
    saveGame();
}

// ---- Helpers ----
function todayStr() {
    return new Date().toDateString();
}

function getTodayWorkouts() {
    const t = todayStr();
    return D.workouts.filter(w => new Date(w.date).toDateString() === t);
}

function getTodayFoods() {
    const t = todayStr();
    return D.foods.filter(f => new Date(f.date).toDateString() === t);
}

function getTodayQuests() {
    const t = todayStr();
    return D.quests.filter(q => new Date(q.date).toDateString() === t);
}
