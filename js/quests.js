// ==========================================
//  QUESTS.JS — 8-Pillar Daily Quest System
//  v37: Complete transformation program
//  If you follow all 8 daily quests honestly,
//  you WILL have a shredded body by A-rank.
// ==========================================

// ── Quest Categories ──
const QUEST_CATS = {
    strength:   { icon: '💪', label: 'STRENGTH',   color: '#ff5252' },
    endurance:  { icon: '🔥', label: 'ENDURANCE',  color: '#42a5f5' },
    nutrition:  { icon: '🍎', label: 'NUTRITION',  color: '#ffa726' },
    recovery:   { icon: '💧', label: 'RECOVERY',   color: '#66bb6a' },
    mindset:    { icon: '🧠', label: 'MINDSET',    color: '#7e57c2' },
    wellness:   { icon: '🧘', label: 'WELLNESS',   color: '#ec407a' },
    challenge:  { icon: '⚡', label: 'CHALLENGE',  color: '#ffd740' },
    discipline: { icon: '🔒', label: 'DISCIPLINE', color: '#78909c' }
};

// ── Helpers ──

function qScale(level, min, max) {
    const t = Math.min((level - 1) / 199, 1);
    return Math.round(min + t * (max - min));
}

function qPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function qPickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, arr.length));
}

// ── Muscle Group Intelligence ──

const Q_MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
const Q_COMPOUNDS = ['Bench Press', 'Incline Bench Press', 'Squats', 'Front Squats', 'Deadlift', 'Romanian Deadlift', 'OHP', 'Military Press', 'Barbell Row', 'Pull-ups', 'Chin-ups', 'Clean and Press', 'Hip Thrust', 'T-Bar Row'];

// Get which muscle groups the user trained this week (from actual workout log)
function getWeeklyMuscleData() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    const coverage = {};
    Q_MUSCLE_GROUPS.forEach(g => { coverage[g] = { count: 0, days: new Set() }; });

    (D.workouts || []).forEach(w => {
        const d = new Date(w.date);
        if (d < weekStart) return;
        const dayKey = d.toDateString();
        const ex = EXERCISE_DB.find(e => e.name === w.exercise);
        if (ex && coverage[ex.group]) {
            coverage[ex.group].count++;
            coverage[ex.group].days.add(dayKey);
        }
    });

    return coverage;
}

// Find the least-trained muscle groups this week
function getLeastTrainedGroups(coverage, count) {
    const sorted = Q_MUSCLE_GROUPS
        .map(g => ({ group: g, days: coverage[g].days.size, count: coverage[g].count }))
        .sort((a, b) => a.days - b.days || a.count - b.count);
    return sorted.slice(0, count).map(s => s.group);
}

// Check if core was trained recently (last 2 days)
function coreTrainedRecently() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return (D.workouts || []).some(w => {
        const ex = EXERCISE_DB.find(e => e.name === w.exercise);
        return ex && ex.group === 'Core' && new Date(w.date) >= twoDaysAgo;
    });
}

// Get yesterday's quest titles for anti-repeat
function qYesterdayTitles() {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yStr = y.toDateString();
    return D.quests.filter(q => new Date(q.date).toDateString() === yStr).map(q => q.title);
}

// Build quest from generator pool, avoid yesterday repeats (up to 5 attempts)
function qBuild(generators, yTitles) {
    for (let i = 0; i < 5; i++) {
        const gen = qPick(generators);
        const quest = typeof gen === 'function' ? gen() : gen;
        if (!yTitles.includes(quest.title) || i >= 4) return quest;
    }
    const gen = qPick(generators);
    return typeof gen === 'function' ? gen() : gen;
}

// Pick exercises from a specific muscle group
function qGroupExercises(group, count) {
    const pool = EXERCISE_DB.filter(e => e.group === group && !e.isCardio);
    return qPickN(pool, count);
}

// ============================
//  WEEKLY MUSCLE COVERAGE (UI helper)
// ============================
function getWeeklyCoverage() {
    const coverage = getWeeklyMuscleData();
    return Q_MUSCLE_GROUPS.map(g => ({
        group: g,
        days: coverage[g].days.size,
        count: coverage[g].count,
        hit: coverage[g].days.size >= 2 // 2x/week = optimal
    }));
}

// ============================
//  MAIN GENERATOR — 8 Pillars
// ============================
function generateDailyQuests() {
    const today = todayStr();
    const existing = D.quests.filter(q => new Date(q.date).toDateString() === today);
    if (existing.length > 0) return;

    const level = D.level;
    const rank = getRank(level);
    const yTitles = qYesterdayTitles();
    const coverage = getWeeklyMuscleData();
    const leastTrained = getLeastTrainedGroups(coverage, 3);
    const needsCore = !coreTrainedRecently();

    const workoutGroup = leastTrained[0] || qPick(Q_MUSCLE_GROUPS);
    let challengeGroup = leastTrained[1] || qPick(Q_MUSCLE_GROUPS.filter(g => g !== workoutGroup));
    if (needsCore && workoutGroup !== 'Core' && challengeGroup !== 'Core') {
        challengeGroup = 'Core';
    }

    const quests = [];
    // 4 GYM pillars
    quests.push(buildStrengthQuest(level, rank, yTitles, workoutGroup));
    quests.push(buildEnduranceQuest(level, rank, yTitles));
    quests.push(buildChallengeQuest(level, rank, yTitles, challengeGroup));
    quests.push(buildRecoveryQuest(level, rank, yTitles));
    // 4 LIFE pillars
    quests.push(buildNutritionQuest(level, rank, yTitles));
    quests.push(buildMindsetQuest(level, rank, yTitles));
    quests.push(buildWellnessQuest(level, rank, yTitles));
    quests.push(buildDisciplineQuest(level, rank, yTitles));

    quests.forEach(q => {
        q.id = Date.now() + '_' + Math.floor(Math.random() * 1000000);
        q.date = new Date().toISOString();
        q.cleared = false;
        q.failed = false;
        D.quests.push(q);
    });

    saveGame();
}

// ============================
//  PILLAR 1: STRENGTH (Progressive Overload)
// ============================
function buildStrengthQuest(level, rank, yTitles, targetGroup) {
    const r = rank.name;
    const xp = qScale(level, 70, 350);
    const gold = qScale(level, 12, 75);
    const lv = level;

    const generators = [];

    generators.push(() => {
        const exs = qGroupExercises(targetGroup, qScale(lv, 2, 4));
        const names = exs.map(e => e.name).join(', ');
        const totalReps = qScale(lv, 60, 200);
        return { title: `${targetGroup} Assault`, desc: `Train ${targetGroup.toLowerCase()}: ${names} — ${totalReps}+ total reps` };
    });

    generators.push(() => {
        const exs = qGroupExercises(targetGroup, 1);
        if (exs.length === 0) return { title: 'Foundation Training', desc: `Log ${qScale(lv, 2, 5)} exercises today` };
        const ex = exs[0];
        const reps = qScale(lv, 30, 120);
        const sets = qScale(lv, 3, 6);
        return { title: `Strength Gate: ${ex.name}`, desc: `${reps} total reps of ${ex.name} across ${sets}+ sets` };
    });

    generators.push(() => {
        const groupEx = qGroupExercises(targetGroup, 2);
        const compound = qPick(Q_COMPOUNDS.filter(c => {
            const ex = EXERCISE_DB.find(e => e.name === c);
            return ex && ex.group === targetGroup;
        }));
        const names = groupEx.map(e => e.name);
        if (compound && !names.includes(compound)) names.unshift(compound);
        const sets = qScale(lv, 3, 5);
        return { title: `${targetGroup} Foundation`, desc: `${names.slice(0, 3).join(', ')} — ${sets} sets each` };
    });

    generators.push(() => {
        const target = qScale(lv, 80, 300);
        const minEx = qScale(lv, 2, 5);
        return { title: `${targetGroup} Volume`, desc: `${target} total reps across ${minEx}+ ${targetGroup.toLowerCase()} exercises` };
    });

    generators.push(() => {
        const ex = qPick(qGroupExercises(targetGroup, 3));
        if (!ex) return { title: 'Progressive Overload', desc: `Increase weight or reps on ${qScale(lv, 2, 4)} exercises vs last session` };
        return { title: `Overload: ${ex.name}`, desc: `Beat your last ${ex.name} session — more weight, reps, or sets` };
    });

    if (r === 'E' || r === 'D') {
        generators.push(() => ({ title: 'Awakening Drill', desc: `Log any workout with ${qScale(lv, 30, 100)} total reps` }));
    }
    if (r === 'C' || r === 'B') {
        generators.push(() => ({ title: 'Iron Discipline', desc: `${qScale(lv, 4, 7)} exercises, ${qScale(lv, 3, 5)} sets each` }));
    }
    if (r === 'A' || r === 'S') {
        generators.push(() => ({ title: "Sovereign's Grind", desc: `${qScale(lv, 250, 450)} total reps across ${qScale(lv, 6, 9)} exercises at high intensity` }));
    }
    if (r === 'X') {
        generators.push(() => ({ title: "The Threat's Protocol", desc: `${qScale(lv, 500, 750)}+ total reps across 10+ exercises` }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'strength', cat: 'strength', targetGroup };
}

// ============================
//  PILLAR 2: ENDURANCE (Cardio & Fat Burning)
// ============================
function buildEnduranceQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 55, 280);
    const gold = qScale(level, 10, 60);
    const lv = level;

    const cardioExs = EXERCISE_DB.filter(e => e.isCardio);
    const generators = [];

    generators.push(() => {
        const ex = qPick(cardioExs);
        const duration = qScale(lv, 10, 60);
        return { title: `Endurance: ${ex.name}`, desc: `${duration} minutes of ${ex.name}` };
    });

    generators.push(() => {
        const exs = qPickN(cardioExs, qScale(lv, 2, 3));
        const names = exs.map(e => e.name).join(' → ');
        const perMin = qScale(lv, 5, 15);
        return { title: 'Cardio Circuit', desc: `${names} — ${perMin} min each, minimal rest` };
    });

    generators.push(() => {
        const ex = qPick(cardioExs);
        const intervals = qScale(lv, 4, 12);
        return { title: `HIIT: ${ex.name}`, desc: `${intervals} intervals — 30s max effort / 30s rest` };
    });

    generators.push(() => {
        const ex = qPick(cardioExs);
        const mins = qScale(lv, 15, 60);
        return { title: `${ex.name} Endurance`, desc: `${mins} minutes continuous — no stopping` };
    });

    generators.push(() => {
        const target = qScale(lv, 100, 500);
        return { title: 'Calorie Inferno', desc: `Burn ${target}+ calories through cardio` };
    });

    generators.push(() => ({ title: 'Step Quest', desc: `Walk ${qScale(lv, 5000, 15000).toLocaleString()}+ steps today` }));
    generators.push(() => ({ title: 'Fat Burn Zone', desc: `${qScale(lv, 20, 45)} min steady-state cardio at moderate intensity` }));

    if (r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Marathon", desc: `${qScale(lv, 45, 90)} min intense cardio — no breaks` }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'endurance', cat: 'endurance' };
}

// ============================
//  PILLAR 5: NUTRITION (The #1 Factor for Shredding)
//  70% of body transformation is diet
// ============================
function buildNutritionQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 50, 220);
    const gold = qScale(level, 10, 50);
    const lv = level;

    const generators = [
        // Protein is king for muscle + shredding
        () => ({ title: 'Protein Protocol', desc: `Hit ${qScale(lv, 80, 200)}g+ protein today — the muscle builder` }),
        () => ({ title: 'Meal Tracking', desc: `Log ALL meals today with full macros — ${qScale(lv, 3, 6)} meals minimum` }),
        () => ({ title: 'Full Day Track', desc: 'Log breakfast, lunch, dinner with accurate macros — no skipping' }),
        () => ({ title: 'Calorie Target', desc: 'Stay within your daily calorie goal (±200 cal) — track everything' }),
        () => ({ title: 'Clean Eating', desc: 'Zero processed food or added sugar today — whole foods only' }),
        () => ({ title: 'Hydration + Fuel', desc: `Drink ${qScale(lv, 2, 4)}+ liters of water AND log all meals` }),
        () => ({ title: 'Pre-Workout Fuel', desc: 'Proper meal 1-2 hours before training — carbs + protein, log it' }),
        () => ({ title: 'Post-Workout Window', desc: `${qScale(lv, 25, 50)}g+ protein within 1 hour after training` }),
        () => ({ title: 'Macro Balance', desc: `Hit ${qScale(lv, 100, 200)}g protein, keep fats under ${qScale(lv, 80, 65)}g` }),
        () => ({ title: 'Veggie Protocol', desc: `Include vegetables in ${qScale(lv, 2, 4)}+ meals today` }),
        () => ({ title: 'No Junk Day', desc: 'Zero junk food, zero sugary drinks, zero fried food — all day' }),
        () => ({ title: 'Fiber Gate', desc: `${qScale(lv, 20, 40)}g+ fiber through whole foods today` }),
        () => ({ title: 'Meal Prep', desc: 'Prepare at least 2 meals in advance — eat clean, save time' }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Deficit Discipline', desc: 'Maintain a 300-500 calorie deficit today — shredding requires precision' }));
        generators.push(() => ({ title: 'Macro Perfection', desc: 'Hit protein, carb, and fat targets all within ±10%' }));
        generators.push(() => ({ title: 'Timed Nutrition', desc: `Eat every ${qScale(lv, 4, 3)} hours — ${qScale(lv, 4, 6)} evenly spaced meals` }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Feast", desc: `${qScale(lv, 200, 300)}g protein, ${qScale(lv, 5, 7)} clean meals, zero deviation` }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'nutrition', cat: 'nutrition' };
}

// ============================
//  PILLAR 8: DISCIPLINE (Daily Habits)
// ============================
function buildDisciplineQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 35, 200);
    const gold = qScale(level, 8, 45);
    const lv = level;

    const generators = [
        () => ({ title: 'Early Rise', desc: `Wake before ${r === 'X' ? '4:30' : r === 'S' ? '5:00' : r === 'A' ? '5:30' : r === 'B' ? '6:00' : r === 'C' ? '6:30' : '7:00'} AM` }),
        () => ({ title: 'Digital Detox', desc: `No social media for ${qScale(lv, 2, 6)}+ hours today` }),
        () => ({ title: 'No Sugar Gate', desc: 'Zero added sugar today — discipline is power' }),
        () => ({ title: 'Cold Exposure', desc: `Cold shower for ${qScale(lv, 30, 180)}+ seconds — embrace discomfort` }),
        () => ({ title: 'Morning Ritual', desc: 'Wake, hydrate, stretch, plan your day — all before breakfast' }),
        () => ({ title: 'Dopamine Fast', desc: 'No sugar, no social media, no junk — full discipline day' }),
        () => ({ title: 'Posture Protocol', desc: 'Maintain conscious good posture all day — stand tall' }),
        () => ({ title: 'Zero Excuses', desc: 'Complete every task you set today — no exceptions' }),
        () => ({ title: 'Sunlight Protocol', desc: '15+ min direct sunlight within 1 hour of waking' }),
        () => ({ title: 'No Caffeine After 2PM', desc: 'Cut caffeine after 2 PM — protect your sleep' }),
        () => ({ title: 'Walk After Meals', desc: `${qScale(lv, 5, 15)}-min walk after at least 2 meals today` }),
        () => ({ title: 'Phone Curfew', desc: 'No phone 1 hour before bed — protect sleep quality' }),
        () => ({ title: 'Single-Tasking', desc: 'No multitasking today — one task at a time, full focus' }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Iron Routine', desc: 'Follow a strict hourly schedule from wake to sleep' }));
        generators.push(() => ({ title: 'Full Stack', desc: `Cold shower ${qScale(lv, 60, 180)}s + no sugar + 8hr sleep` }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Discipline", desc: 'Every second accounted for. Perfect routine. Zero deviation.' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'discipline', cat: 'discipline' };
}

// ============================
//  PILLAR 4: RECOVERY (Sleep + Hydration + Mobility)
//  You grow during recovery, not during training
// ============================
function buildRecoveryQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 35, 190);
    const gold = qScale(level, 7, 42);
    const lv = level;

    const bodyParts = ['hips', 'shoulders', 'ankles', 'thoracic spine', 'hamstrings', 'hip flexors', 'wrists', 'lower back', 'glutes'];
    const generators = [
        // Sleep — the #1 recovery tool
        () => ({ title: 'Quality Sleep', desc: 'Get 7-8 hours of quality sleep tonight — muscles grow during sleep' }),
        () => ({ title: 'Night Routine', desc: `No screens ${qScale(lv, 30, 90)} min before bed + sleep 8 hours` }),
        () => ({ title: 'Sleep Hygiene', desc: 'Dark room, cool temp, no phone in bed — optimize sleep quality' }),
        // Hydration
        () => ({ title: 'Hydration Protocol', desc: `Drink ${qScale(lv, 2, 4)}+ liters of water today` }),
        () => ({ title: 'Hydrate + Electrolytes', desc: `${qScale(lv, 2, 4)}L water + electrolytes (sodium, potassium, magnesium)` }),
        // Stretching & Mobility
        () => { const p = qPick(bodyParts); return { title: `Unlock: ${p.charAt(0).toUpperCase() + p.slice(1)}`, desc: `${qScale(lv, 5, 20)}-min ${p} mobility routine` }; },
        () => ({ title: 'Warm-up Protocol', desc: `${qScale(lv, 5, 15)}-min proper warm-up before your workout` }),
        () => ({ title: 'Cool-down Stretch', desc: `${qScale(lv, 5, 15)}-min stretch after training — aid recovery` }),
        () => ({ title: 'Foam Roll Session', desc: `Foam roll for ${qScale(lv, 5, 20)}+ minutes — release tight muscles` }),
        () => ({ title: 'Flexibility Gate', desc: `Hold ${qScale(lv, 4, 10)} stretches for ${qScale(lv, 30, 60)} seconds each` }),
        () => ({ title: 'Active Recovery', desc: `Light yoga or stretching for ${qScale(lv, 10, 30)}+ minutes` }),
        () => ({ title: 'Morning Stretch', desc: `${qScale(lv, 5, 15)}-min stretch immediately after waking up` }),
        () => ({ title: 'Desk Reset', desc: `Take ${qScale(lv, 3, 6)} stretch breaks throughout the day` }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Full Restoration', desc: `Yoga ${qScale(lv, 15, 30)}min + foam roll ${qScale(lv, 10, 20)}min + 8hr sleep` }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Recovery", desc: '8hr sleep + yoga + foam roll + stretching + 3L water' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'recovery', cat: 'recovery' };
}

// ============================
//  PILLAR 6: MINDSET (Knowledge + Goals + Focus)
// ============================
function buildMindsetQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 35, 190);
    const gold = qScale(level, 7, 42);
    const lv = level;

    const generators = [
        () => { const ex = qPick(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other')); return { title: `Form Study: ${ex.name}`, desc: `Watch a tutorial on proper ${ex.name} form — knowledge prevents injury` }; },
        () => ({ title: 'Goal Setting', desc: `Write ${qScale(lv, 3, 5)} specific fitness goals with deadlines` }),
        () => ({ title: 'Progress Review', desc: 'Review your last 7 days — what worked? What needs to change?' }),
        () => ({ title: 'Training Journal', desc: `Journal ${qScale(lv, 5, 15)} min: reflect on progress and plan ahead` }),
        () => ({ title: 'Knowledge Quest', desc: 'Read or watch 15+ min about training science, nutrition, or recovery' }),
        () => ({ title: 'Visualization', desc: `${qScale(lv, 5, 15)} minutes visualizing your ideal physique and performance` }),
        () => ({ title: 'Mind-Muscle Connection', desc: 'Focus on feeling every contraction during every rep today' }),
        () => ({ title: 'Read 20 Pages', desc: 'Read 20 pages of a book — any genre — build the reading habit' }),
        () => ({ title: 'Learn Something New', desc: 'Learn one new thing today — training technique, nutrition fact, or life skill' }),
        () => ({ title: 'Positive Self-Talk', desc: 'Zero negative self-talk today — catch and correct every negative thought' }),
        () => ({ title: 'Focus Block', desc: `${qScale(lv, 25, 60)} minutes of deep focus work — no distractions, no phone` }),
        () => ({ title: 'Weekly Planning', desc: 'Plan your training split, meals, and schedule for the next 7 days' }),
    ];

    if (r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Strategic Planning', desc: 'Program next week: exercises, sets, reps, progressive overload targets' }));
        generators.push(() => ({ title: "Sovereign's Mind", desc: 'Training journal + week programming + visualization — full mental prep' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'mindset', cat: 'mindset' };
}

// ============================
//  PILLAR 7: WELLNESS (Emotional + Mental Health)
//  Cortisol kills gains. Manage stress.
// ============================
function buildWellnessQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 35, 180);
    const gold = qScale(level, 7, 40);
    const lv = level;

    const generators = [
        () => ({ title: 'Meditation', desc: `Meditate for ${qScale(lv, 5, 25)} minutes — still mind, strong body` }),
        () => ({ title: 'Gratitude Journal', desc: `Write ${qScale(lv, 3, 5)} things you are genuinely grateful for` }),
        () => ({ title: 'Breathwork', desc: `${qScale(lv, 5, 15)} minutes of box breathing or Wim Hof method` }),
        () => ({ title: 'Nature Walk', desc: `${qScale(lv, 10, 30)} minutes walking in nature — reduce cortisol` }),
        () => ({ title: 'Journaling', desc: `Write freely for ${qScale(lv, 5, 15)} minutes — process your emotions` }),
        () => ({ title: 'Acts of Kindness', desc: 'Do 1 intentional act of kindness for someone today' }),
        () => ({ title: 'Social Connection', desc: 'Have a meaningful conversation with someone you care about' }),
        () => ({ title: 'Stress Release', desc: 'Identify your biggest stressor today — write a plan to handle it' }),
        () => ({ title: 'Body Scan', desc: `${qScale(lv, 5, 15)}-min body scan meditation — release tension` }),
        () => ({ title: 'Digital Sunset', desc: 'No screens 1 hour before bed — read, stretch, or meditate instead' }),
        () => ({ title: 'Mindful Eating', desc: 'Eat one meal today with zero distractions — phone away, TV off' }),
        () => ({ title: 'Self-Compassion', desc: 'Write one thing you did well today and one area to improve — no judgment' }),
        () => ({ title: 'Laughter Therapy', desc: 'Watch or do something that makes you genuinely laugh — stress melts gains' }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Deep Meditation', desc: `${qScale(lv, 15, 30)} minutes of focused meditation — master your mind` }));
        generators.push(() => ({ title: 'Emotional Audit', desc: 'Journal: What am I avoiding? What am I afraid of? Face it.' }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Inner Peace", desc: 'Meditate 20min + gratitude journal + nature walk — full wellness stack' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'wellness', cat: 'wellness' };
}

// ============================
//  PILLAR 3: CHALLENGE (Intense Physical Test)
// ============================
function buildChallengeQuest(level, rank, yTitles, targetGroup) {
    const r = rank.name;
    const xp = qScale(level, 55, 300);
    const gold = qScale(level, 12, 65);
    const lv = level;

    const generators = [];

    generators.push(() => {
        const exs = qGroupExercises(targetGroup, qScale(lv, 2, 4));
        const names = exs.map(e => e.name).join(', ');
        const reps = qScale(lv, 80, 250);
        return { title: `⚡ ${targetGroup} Destruction`, desc: `${reps} total reps: ${names}` };
    });

    generators.push(() => {
        const ex = qPick(qGroupExercises(targetGroup, 3));
        if (!ex) return { title: '⚡ Shadow Trial', desc: `${qScale(lv, 100, 300)} reps of any exercise` };
        const reps = qScale(lv, 50, 200);
        return { title: `⚡ Trial: ${ex.name}`, desc: `${reps} reps in as few sets as possible` };
    });

    generators.push(() => {
        const ex = qPick(qGroupExercises(targetGroup, 3));
        if (!ex) return { title: '⚡ Speed Trial', desc: `${qScale(lv, 50, 100)} reps in under 5 minutes` };
        const reps = qScale(lv, 30, 80);
        return { title: `⚡ Speed: ${ex.name}`, desc: `${reps} reps in under ${Math.max(2, qScale(lv, 5, 3))} minutes` };
    });

    generators.push(() => {
        const exs = qGroupExercises(targetGroup, 2);
        if (exs.length < 2) {
            const allExs = qPickN(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other'), 2);
            if (allExs.length < 2) return { title: '⚡ Circuit', desc: '3 exercises back-to-back, 3 rounds' };
            return { title: `⚡ Superset: ${allExs[0].name} × ${allExs[1].name}`, desc: `${qScale(lv, 3, 5)} rounds, ${qScale(lv, 8, 15)} reps each` };
        }
        return { title: `⚡ Superset: ${exs[0].name} × ${exs[1].name}`, desc: `${qScale(lv, 3, 5)} rounds, ${qScale(lv, 8, 15)} reps each, no rest` };
    });

    generators.push(() => {
        const count = qScale(lv, 3, 5);
        const exs = qPickN(EXERCISE_DB.filter(e => e.group !== 'Other'), count);
        const names = exs.map(e => e.name).join(' → ');
        const rounds = qScale(lv, 2, 4);
        return { title: '⚡ Shadow Circuit', desc: `${rounds} rounds: ${names} — ${qScale(lv, 8, 15)} reps each` };
    });

    generators.push(() => {
        const ex = qPick(EXERCISE_DB.filter(e => e.group !== 'Other'));
        const rounds = qScale(lv, 4, 8);
        return { title: `⚡ Tabata: ${ex.name}`, desc: `${rounds} rounds — 20s max effort / 10s rest` };
    });

    generators.push(() => {
        const ex = qPick(EXERCISE_DB.filter(e => e.group !== 'Other'));
        const rounds = qScale(lv, 6, 15);
        const reps = qScale(lv, 5, 12);
        return { title: `⚡ EMOM: ${ex.name}`, desc: `Every Minute On the Minute: ${reps} reps × ${rounds} rounds` };
    });

    if (r === 'B' || r === 'A') {
        generators.push(() => ({ title: '⚡ Chipper', desc: '100 squats + 75 push-ups + 50 sit-ups + 25 burpees — for time' }));
        generators.push(() => ({ title: '⚡ PR Hunt', desc: 'Attempt a personal record on any compound lift' }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: '⚡ Murph', desc: '1-mile run + 100 pull-ups + 200 push-ups + 300 squats + 1-mile run' }));
        generators.push(() => ({ title: '⚡ 1000 Reps', desc: '1000 total reps across any exercises today' }));
    }
    if (r === 'X') {
        generators.push(() => ({ title: '⚡ Extinction', desc: '2000 total reps. Beyond human.' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'challenge', cat: 'challenge', targetGroup };
}

// ============================
//  QUEST CLEARING
// ============================
function clearQuest(questId) {
    // Primary lookup: match by ID (string-safe comparison)
    let quest = D.quests.find(q => String(q.id) === String(questId));

    // Fallback: if ID lookup fails (e.g. old float precision IDs), match by data-qid proximity
    if (!quest) {
        const qidNum = parseFloat(questId);
        quest = D.quests.find(q => !q.cleared && !q.failed && Math.abs(Number(q.id) - qidNum) < 1);
    }

    if (!quest || quest.cleared || quest.failed) return null;

    quest.cleared = true;

    // Guard: ensure D.stats exists and has totalQuestsCompleted
    if (!D.stats) D.stats = {};
    if (typeof D.stats.totalQuestsCompleted !== 'number') D.stats.totalQuestsCompleted = 0;
    D.stats.totalQuestsCompleted++;

    if (typeof grantXP === 'function') grantXP(quest.xp);
    if (typeof grantGold === 'function') grantGold(quest.gold);
    if (typeof playSound === 'function') playSound('questComplete');

    const todayQ = getTodayQuests();
    const allCleared = todayQ.length > 0 && todayQ.every(q => q.cleared);

    if (allCleared) {
        const bonusXP = qScale(D.level, 250, 800);
        const bonusGold = qScale(D.level, 80, 250);
        if (typeof grantXP === 'function') grantXP(bonusXP);
        if (typeof grantGold === 'function') grantGold(bonusGold);
        if (typeof D.streak === 'number') D.streak++;
        const allClearMsg = (typeof NARRATOR !== 'undefined') ? NARRATOR.getAllClearReaction() : 'The shadows bow to your discipline.';
        sysNotify(`[All 8 Gates Cleared] +${bonusXP} XP, +${bonusGold} Gold`, 'gold');
        setTimeout(() => { if (typeof sysNotify === 'function') sysNotify(allClearMsg, 'gold'); }, 1500);
    }

    if (typeof checkAchievements === 'function') checkAchievements();
    saveGame();

    return { quest, allCleared };
}

// ============================
//  QUEST AUTO-COMPLETION
//  Runs after every workout/food log
// ============================
function checkAutoCompleteQuests() {
    if (!D || !D.quests) return;

    const todayQ = getTodayQuests().filter(q => !q.cleared && !q.failed);
    if (todayQ.length === 0) return;

    const todayWorkouts = getTodayWorkouts();
    const todayFoods = getTodayFoods();
    const todayCardio = todayWorkouts.filter(w => {
        const ex = (typeof EXERCISE_DB !== 'undefined') && EXERCISE_DB.find(e => e.name === w.exercise);
        return ex ? ex.isCardio : false;
    });

    // Get muscle groups trained today
    const groupsTrained = new Set();
    todayWorkouts.forEach(w => {
        const ex = (typeof EXERCISE_DB !== 'undefined') && EXERCISE_DB.find(e => e.name === w.exercise);
        if (ex && ex.group) groupsTrained.add(ex.group);
    });

    // Total reps today (non-cardio)
    const totalReps = todayWorkouts
        .filter(w => {
            const ex = (typeof EXERCISE_DB !== 'undefined') && EXERCISE_DB.find(e => e.name === w.exercise);
            return ex ? !ex.isCardio : true;
        })
        .reduce((sum, w) => sum + (w.reps * w.sets), 0);

    // Unique exercises today
    const uniqueExercises = new Set(todayWorkouts.map(w => w.exercise)).size;

    // Total protein today
    const totalProtein = todayFoods.reduce((sum, f) => sum + (f.protein || 0), 0);

    // Total calories consumed
    const totalCalConsumed = todayFoods.reduce((sum, f) => sum + (f.calories || 0), 0);

    // Total cal burned from workouts
    const totalCalBurned = todayWorkouts.reduce((sum, w) => sum + (w.calBurned || 0), 0);

    // Cardio minutes today
    const cardioMinutes = todayCardio.reduce((sum, w) => sum + (w.reps || 0), 0);

    const autoCleared = [];

    todayQ.forEach(q => {
        let shouldClear = false;

        switch (q.type) {
            case 'strength':
                // Clear if: trained the target muscle group OR logged enough exercises/reps
                if (q.targetGroup && groupsTrained.has(q.targetGroup)) {
                    shouldClear = true;
                } else if (uniqueExercises >= 2 && totalReps >= 30) {
                    shouldClear = true;
                }
                break;

            case 'endurance':
                // Clear if any cardio exercise was logged today
                if (todayCardio.length > 0) {
                    shouldClear = true;
                }
                break;

            case 'nutrition':
                // Clear if user logged 2+ meals today
                if (todayFoods.length >= 2) {
                    shouldClear = true;
                }
                break;

            case 'challenge':
                // Clear if target group was hit AND logged 2+ exercises
                if (q.targetGroup && groupsTrained.has(q.targetGroup) && uniqueExercises >= 2) {
                    shouldClear = true;
                } else if (uniqueExercises >= 3 && totalReps >= 60) {
                    shouldClear = true;
                }
                break;

            // recovery, mindset, wellness, discipline → require manual click (real-world actions)
            default:
                break;
        }

        if (shouldClear) {
            const result = clearQuest(q.id);
            if (result) {
                autoCleared.push(q);
            }
        }
    });

    // Show notifications for auto-cleared quests
    if (autoCleared.length > 0) {
        autoCleared.forEach((q, i) => {
            const reaction = (typeof NARRATOR !== 'undefined') ? NARRATOR.getQuestReaction(q) : '';
            setTimeout(() => {
                sysNotify(`[Auto-Cleared] "${q.title}" — +${q.xp} XP`, 'green');
                if (reaction) setTimeout(() => sysNotify(reaction, 'blue'), 800);
            }, i * 1500);
        });
        if (typeof vibrate === 'function') vibrate([40, 30, 40, 30, 40]);
        if (typeof refreshUI === 'function') refreshUI();
    }

    return autoCleared;
}
