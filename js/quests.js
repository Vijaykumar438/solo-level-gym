// ==========================================
//  QUESTS.JS — Dynamic Daily Quest System
//  Smart muscle rotation + EXERCISE_DB integration
//  Non-repetitive quest generation
// ==========================================

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
//  MAIN GENERATOR
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

    // Pick the primary workout group (least trained)
    const workoutGroup = leastTrained[0] || qPick(Q_MUSCLE_GROUPS);
    // Shadow challenge targets a different group
    let shadowGroup = leastTrained[1] || qPick(Q_MUSCLE_GROUPS.filter(g => g !== workoutGroup));
    // Force core if not trained in 2 days
    if (needsCore && workoutGroup !== 'Core' && shadowGroup !== 'Core') {
        shadowGroup = 'Core';
    }

    const quests = [];
    quests.push(buildWorkoutQuest(level, rank, yTitles, workoutGroup));
    quests.push(buildCardioQuest(level, rank, yTitles));
    quests.push(buildNutritionQuest(level, rank, yTitles));
    quests.push(buildDisciplineQuest(level, rank, yTitles));
    quests.push(buildMobilityQuest(level, rank, yTitles));
    quests.push(buildMentalQuest(level, rank, yTitles));
    quests.push(buildShadowChallengeQuest(level, rank, yTitles, shadowGroup));
    quests.push(buildBonusQuest(level, rank, yTitles, leastTrained));

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
//  QUEST 1: WORKOUT (Dynamic + Smart Rotation)
// ============================
function buildWorkoutQuest(level, rank, yTitles, targetGroup) {
    const r = rank.name;
    const xp = qScale(level, 70, 350);
    const gold = qScale(level, 12, 75);
    const lv = level;

    const generators = [];

    // -- Dynamic: Targeted muscle group (uses smart rotation) --
    generators.push(() => {
        const exs = qGroupExercises(targetGroup, qScale(lv, 2, 4));
        const names = exs.map(e => e.name).join(', ');
        const totalReps = qScale(lv, 60, 200);
        return { title: `${targetGroup} Assault`, desc: `Train ${targetGroup.toLowerCase()} today: ${names} — ${totalReps}+ total reps` };
    });

    // -- Dynamic: Single exercise from target group --
    generators.push(() => {
        const exs = qGroupExercises(targetGroup, 1);
        if (exs.length === 0) return { title: 'Foundation Training', desc: `Log ${qScale(lv, 2, 5)} exercises today` };
        const ex = exs[0];
        const reps = qScale(lv, 30, 120);
        const sets = qScale(lv, 3, 6);
        return { title: `Strength Gate: ${ex.name}`, desc: `Complete ${reps} total reps of ${ex.name} across ${sets}+ sets` };
    });

    // -- Dynamic: Target group + compounds --
    generators.push(() => {
        const groupEx = qGroupExercises(targetGroup, 2);
        const compound = qPick(Q_COMPOUNDS.filter(c => {
            const ex = EXERCISE_DB.find(e => e.name === c);
            return ex && ex.group === targetGroup;
        }));
        const names = groupEx.map(e => e.name);
        if (compound && !names.includes(compound)) names.unshift(compound);
        const sets = qScale(lv, 3, 5);
        return { title: `${targetGroup} Foundation`, desc: `Complete ${names.slice(0, 3).join(', ')} — ${sets} sets each, build the foundation` };
    });

    // -- Dynamic: Superset within target group --
    generators.push(() => {
        const exs = qGroupExercises(targetGroup, 2);
        if (exs.length < 2) return { title: `${targetGroup} Session`, desc: `Complete ${qScale(lv, 3, 6)} ${targetGroup.toLowerCase()} exercises today` };
        const rounds = qScale(lv, 3, 5);
        return { title: `Superset: ${exs[0].name} × ${exs[1].name}`, desc: `${rounds} supersets — ${qScale(lv, 8, 15)} reps each, no rest between` };
    });

    // -- Dynamic: Rep target for target group --
    generators.push(() => {
        const target = qScale(lv, 80, 300);
        const minEx = qScale(lv, 2, 5);
        return { title: `${targetGroup} Volume`, desc: `Hit ${target} total reps across ${minEx}+ ${targetGroup.toLowerCase()} exercises` };
    });

    // -- Dynamic: Progressive overload focus --
    generators.push(() => {
        const ex = qPick(qGroupExercises(targetGroup, 3));
        if (!ex) return { title: 'Progressive Overload', desc: `Increase weight or reps on ${qScale(lv, 2, 4)} exercises vs last session` };
        return { title: `Overload: ${ex.name}`, desc: `Beat your last ${ex.name} session — more weight, more reps, or more sets` };
    });

    // -- Rank-scaled static quests --
    if (r === 'E' || r === 'D') {
        generators.push(() => ({ title: 'Awakening Drill', desc: `Log any workout with ${qScale(lv, 30, 100)} total reps — every rep counts` }));
        generators.push(() => ({ title: 'Foundation Builder', desc: `Complete ${qScale(lv, 2, 4)} different exercises today` }));
    }
    if (r === 'C' || r === 'B') {
        generators.push(() => ({ title: 'Berserker Protocol', desc: `Complete ${qScale(lv, 150, 280)} total reps at medium+ intensity` }));
        generators.push(() => ({ title: 'Iron Discipline', desc: `${qScale(lv, 4, 7)} exercises, ${qScale(lv, 3, 5)} sets each — structured session` }));
    }
    if (r === 'A' || r === 'S') {
        generators.push(() => ({ title: "Sovereign's Grind", desc: `${qScale(lv, 250, 450)} total reps across ${qScale(lv, 6, 9)} exercises at high intensity` }));
        generators.push(() => ({ title: 'Double Dungeon', desc: 'Complete 2 full workout sessions today — AM and PM' }));
    }
    if (r === 'X') {
        generators.push(() => ({ title: "The Threat's Protocol", desc: `${qScale(lv, 500, 750)}+ total reps across 10+ exercises — beyond human` }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'workout', targetGroup };
}

// ============================
//  QUEST 2: CARDIO (Dynamic)
// ============================
function buildCardioQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 55, 280);
    const gold = qScale(level, 10, 60);
    const lv = level;

    const cardioExs = EXERCISE_DB.filter(e => e.isCardio);
    const generators = [];

    // -- Dynamic: Specific cardio exercise --
    generators.push(() => {
        const ex = qPick(cardioExs);
        const duration = qScale(lv, 10, 60);
        return { title: `Endurance: ${ex.name}`, desc: `Complete ${duration} minutes of ${ex.name}` };
    });

    // -- Dynamic: Cardio circuit --
    generators.push(() => {
        const exs = qPickN(cardioExs, qScale(lv, 2, 3));
        const names = exs.map(e => e.name).join(' → ');
        const perMin = qScale(lv, 5, 15);
        return { title: 'Cardio Circuit', desc: `${names} — ${perMin} min each, minimal rest between` };
    });

    // -- Dynamic: Interval training --
    generators.push(() => {
        const ex = qPick(cardioExs);
        const intervals = qScale(lv, 4, 12);
        return { title: `Intervals: ${ex.name}`, desc: `${intervals} intervals — 30s max effort / 30s rest` };
    });

    // -- Dynamic: Duration challenge --
    generators.push(() => {
        const ex = qPick(cardioExs);
        const mins = qScale(lv, 15, 60);
        return { title: `${ex.name} Endurance`, desc: `${mins} minutes of continuous ${ex.name.toLowerCase()} — no stopping` };
    });

    // -- Dynamic: Calorie burn target --
    generators.push(() => {
        const target = qScale(lv, 100, 500);
        return { title: 'Calorie Inferno', desc: `Burn ${target}+ calories through cardio today` };
    });

    // -- Static --
    generators.push(() => ({ title: 'Step Quest', desc: `Walk ${qScale(lv, 4000, 20000).toLocaleString()}+ steps today` }));
    generators.push(() => ({ title: 'Fat Burn Zone', desc: `${qScale(lv, 20, 45)} min of steady-state cardio at moderate intensity — fat burning zone` }));

    if (r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Marathon", desc: `${qScale(lv, 45, 90)} min of intense cardio — no breaks` }));
        generators.push(() => ({ title: 'Double Cardio', desc: 'Two separate cardio sessions today — AM and PM' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'cardio' };
}

// ============================
//  QUEST 3: NUTRITION (Dynamic)
// ============================
function buildNutritionQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 40, 180);
    const gold = qScale(level, 8, 40);
    const lv = level;

    const generators = [
        () => ({ title: 'Protein Protocol', desc: `Consume ${qScale(lv, 60, 250)}g+ protein today` }),
        () => ({ title: 'Meal Logging', desc: `Log ${qScale(lv, 2, 6)}+ meals with full macros tracked` }),
        () => ({ title: 'Full Day Track', desc: 'Log breakfast, lunch, dinner — all 3 with macros' }),
        () => ({ title: 'Calorie Target', desc: 'Track every calorie today — stay within your calorie goal (±200)' }),
        () => ({ title: 'Clean Eating', desc: 'Zero processed food or added sugar today — whole foods only' }),
        () => ({ title: 'Hydration + Fuel', desc: `Drink ${qScale(lv, 2, 4)}+ liters of water AND log all meals` }),
        () => ({ title: 'Pre-Workout Fuel', desc: 'Eat a proper meal 1-2 hours before training — log it' }),
        () => ({ title: 'Post-Workout Recovery', desc: `${qScale(lv, 20, 50)}g+ protein within 1 hour after training` }),
        () => ({ title: 'Macro Balance', desc: `Hit ${qScale(lv, 80, 200)}g protein + keep fats under ${qScale(lv, 100, 80)}g` }),
        () => ({ title: 'Meal Timing', desc: `Eat every ${qScale(lv, 4, 3)} hours — ${qScale(lv, 3, 6)} evenly spaced meals` }),
        () => ({ title: 'Veggie Protocol', desc: `Include vegetables in ${qScale(lv, 2, 4)}+ meals today` }),
        () => ({ title: 'Fiber Gate', desc: `Consume ${qScale(lv, 20, 40)}g+ fiber today through whole foods` }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Meal Prep Mastery', desc: `Eat ${qScale(lv, 4, 7)} planned meals today — zero improvisation` }));
        generators.push(() => ({ title: 'Macro Perfection', desc: 'Hit protein, carb, and fat targets all within ±10%' }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Feast", desc: `${qScale(lv, 200, 350)}g protein, ${qScale(lv, 5, 7)} meals, zero cheat` }));
        generators.push(() => ({ title: 'Surgical Nutrition', desc: 'Every macro within ±5% of target — surgical precision' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'food' };
}

// ============================
//  QUEST 4: DISCIPLINE (Dynamic)
// ============================
function buildDisciplineQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 35, 200);
    const gold = qScale(level, 8, 45);
    const lv = level;

    const generators = [
        () => ({ title: "Quality Sleep", desc: 'Get 7-8 hours of quality sleep tonight' }),
        () => ({ title: 'Hydration Protocol', desc: `Drink ${qScale(lv, 2, 4)}+ liters of water today` }),
        () => ({ title: 'Early Rise', desc: `Wake up before ${r === 'X' ? '4:30' : r === 'S' ? '5:00' : r === 'A' ? '5:30' : r === 'B' ? '6:00' : r === 'C' ? '6:30' : '7:00'} AM` }),
        () => ({ title: 'Digital Detox', desc: `No social media for ${qScale(lv, 2, 6)}+ hours today` }),
        () => ({ title: 'No Sugar Gate', desc: 'Zero added sugar today — discipline is power' }),
        () => ({ title: 'Cold Exposure', desc: `Cold shower for ${qScale(lv, 30, 180)}+ seconds` }),
        () => ({ title: 'Night Routine', desc: `No screens ${qScale(lv, 30, 90)} min before bed + 8 hours sleep` }),
        () => ({ title: 'Morning Ritual', desc: 'Wake, hydrate, stretch, plan your day — all before breakfast' }),
        () => ({ title: 'Dopamine Fast', desc: 'No sugar, no social media, no junk — full discipline' }),
        () => ({ title: 'Posture Protocol', desc: 'Maintain conscious good posture all day' }),
        () => ({ title: 'Gratitude Gate', desc: 'Write 3 things you are grateful for today' }),
        () => ({ title: 'Zero Excuses', desc: 'Complete every task you set today — no exceptions' }),
        () => ({ title: 'Sunlight Protocol', desc: 'Get 15+ minutes of direct sunlight within 1 hour of waking' }),
        () => ({ title: 'No Caffeine After 2PM', desc: 'Cut caffeine after 2 PM — protect your sleep architecture' }),
        () => ({ title: 'Walk After Meals', desc: `Take a ${qScale(lv, 5, 15)}-minute walk after at least 2 meals today` }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Iron Routine', desc: 'Follow a strict hourly schedule from wake to sleep' }));
        generators.push(() => ({ title: 'Full Discipline Stack', desc: `Cold shower ${qScale(lv, 60, 180)}s + meditate ${qScale(lv, 10, 30)}min + no sugar + 8hr sleep` }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Discipline", desc: 'Every second accounted for. Perfect routine. Zero deviation.' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'discipline' };
}

// ============================
//  QUEST 5: MOBILITY & RECOVERY (Dynamic)
// ============================
function buildMobilityQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 30, 170);
    const gold = qScale(level, 6, 38);
    const lv = level;

    const bodyParts = ['hips', 'shoulders', 'ankles', 'thoracic spine', 'hamstrings', 'hip flexors', 'wrists', 'neck', 'lower back', 'glutes'];

    const generators = [
        () => { const p = qPick(bodyParts); return { title: `Unlock: ${p.charAt(0).toUpperCase() + p.slice(1)}`, desc: `${qScale(lv, 5, 20)}-min ${p} mobility routine` }; },
        () => ({ title: 'Warm-up Protocol', desc: `Do a proper ${qScale(lv, 5, 15)}-min warm-up before your workout` }),
        () => ({ title: 'Cool-down Ritual', desc: `Complete a ${qScale(lv, 5, 15)}-min cool-down stretch after training` }),
        () => ({ title: 'Foam Roll Session', desc: `Foam roll for ${qScale(lv, 5, 20)}+ minutes — target tight areas` }),
        () => ({ title: 'Flexibility Gate', desc: `Hold ${qScale(lv, 3, 10)} different stretches for ${qScale(lv, 20, 45)} seconds each` }),
        () => ({ title: 'Active Recovery', desc: `Light yoga or stretching for ${qScale(lv, 10, 30)}+ minutes` }),
        () => ({ title: 'Mobility Flow', desc: `${qScale(lv, 8, 25)}-min full-body mobility routine` }),
        () => ({ title: 'Deep Stretch', desc: `Hold ${qScale(lv, 4, 8)} deep stretches for 60 seconds each` }),
        () => { const p1 = qPick(bodyParts); const p2 = qPick(bodyParts.filter(b => b !== p1)); return { title: `Dual Unlock: ${p1} + ${p2}`, desc: `Mobility work for ${p1} and ${p2} — ${qScale(lv, 5, 10)} min each` }; },
        () => ({ title: 'Band Work', desc: `${qScale(lv, 3, 6)} band exercises for joint health` }),
        () => ({ title: 'Morning Stretch', desc: `${qScale(lv, 5, 15)}-min stretch immediately after waking up` }),
        () => ({ title: 'Desk Reset', desc: `Take ${qScale(lv, 3, 6)} stretch breaks throughout the day (2+ min each)` }),
    ];

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Full Restoration', desc: `Yoga ${qScale(lv, 15, 30)}min + foam roll ${qScale(lv, 10, 20)}min` }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: "Monarch's Recovery", desc: '45-min recovery: yoga + foam roll + dynamic stretches' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'mobility' };
}

// ============================
//  QUEST 6: MENTAL FORTITUDE (Dynamic)
// ============================
function buildMentalQuest(level, rank, yTitles) {
    const r = rank.name;
    const xp = qScale(level, 35, 190);
    const gold = qScale(level, 7, 42);
    const lv = level;

    const generators = [
        // Dynamic: study form for a random exercise
        () => { const ex = qPick(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other')); return { title: `Form Study: ${ex.name}`, desc: `Research proper technique for ${ex.name} — watch a tutorial or practice form` }; },
        // Dynamic: study form for multiple exercises
        () => { const exs = qPickN(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other'), qScale(lv, 2, 3)); return { title: 'Form Mastery', desc: `Study technique for: ${exs.map(e => e.name).join(', ')}` }; },
        () => ({ title: 'Meditation', desc: `Meditate for ${qScale(lv, 5, 30)} minutes` }),
        () => ({ title: 'Gratitude Journal', desc: `Write ${qScale(lv, 1, 5)} things you're grateful for` }),
        () => ({ title: 'Visualization', desc: `${qScale(lv, 3, 15)} minutes visualizing your ideal physique and performance` }),
        () => ({ title: 'Training Journal', desc: `Journal for ${qScale(lv, 5, 20)} min: reflect on progress and set targets` }),
        () => ({ title: 'Goal Setting', desc: `Write ${qScale(lv, 3, 5)} specific short-term fitness goals with deadlines` }),
        () => ({ title: 'Progress Review', desc: 'Review your last 7 days of training — identify weak points' }),
        () => ({ title: 'Breathwork', desc: `${qScale(lv, 5, 15)} minutes of focused breathwork (box breathing or Wim Hof)` }),
        () => ({ title: 'Positive Mindset', desc: 'Practice positive self-talk during every set today — zero negativity' }),
        () => ({ title: 'Knowledge Quest', desc: 'Read or watch content about training science, nutrition, or recovery' }),
        () => ({ title: 'Mind-Muscle Connection', desc: 'Focus on mind-muscle connection for every rep today — feel every contraction' }),
    ];

    if (r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Strategic Planning', desc: 'Plan next week: exercises, splits, sets, progression targets' }));
        generators.push(() => ({ title: "Sovereign's Mind", desc: `${qScale(lv, 15, 30)}-min meditation + training journal + week programming` }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'mental' };
}

// ============================
//  QUEST 7: SHADOW CHALLENGE (Dynamic + Group Rotation)
// ============================
function buildShadowChallengeQuest(level, rank, yTitles, targetGroup) {
    const r = rank.name;
    const xp = qScale(level, 45, 280);
    const gold = qScale(level, 10, 55);
    const lv = level;

    const generators = [];

    // -- Dynamic: Targeted muscle group challenge (different from workout quest) --
    generators.push(() => {
        const exs = qGroupExercises(targetGroup, qScale(lv, 2, 4));
        const names = exs.map(e => e.name).join(', ');
        const reps = qScale(lv, 80, 250);
        return { title: `⚔ ${targetGroup} Destruction`, desc: `${reps} total reps: ${names} — full ${targetGroup.toLowerCase()} annihilation` };
    });

    // -- Dynamic: Single exercise from target group --
    generators.push(() => {
        const ex = qPick(qGroupExercises(targetGroup, 3));
        if (!ex) return { title: '⚔ Shadow Trial', desc: `Complete ${qScale(lv, 100, 300)} reps of any exercise` };
        const reps = qScale(lv, 50, 200);
        return { title: `⚔ Shadow Trial: ${ex.name}`, desc: `Complete ${reps} reps of ${ex.name} in as few sets as possible` };
    });

    // -- Dynamic: Timed challenge --
    generators.push(() => {
        const ex = qPick(qGroupExercises(targetGroup, 3));
        if (!ex) return { title: '⚔ Speed Trial', desc: `Complete ${qScale(lv, 50, 100)} reps in under 5 minutes` };
        const reps = qScale(lv, 30, 80);
        return { title: `⚔ Speed Trial: ${ex.name}`, desc: `${reps} reps of ${ex.name} in under ${Math.max(2, qScale(lv, 5, 3))} minutes` };
    });

    // -- Dynamic: Superset from target group --
    generators.push(() => {
        const exs = qGroupExercises(targetGroup, 2);
        if (exs.length < 2) {
            const allExs = qPickN(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other'), 2);
            if (allExs.length < 2) return { title: '⚔ Shadow Circuit', desc: 'Complete 3 exercises back-to-back, 3 rounds' };
            return { title: `⚔ Superset: ${allExs[0].name} × ${allExs[1].name}`, desc: `${qScale(lv, 3, 5)} rounds, ${qScale(lv, 8, 15)} reps each, no rest between` };
        }
        return { title: `⚔ Superset: ${exs[0].name} × ${exs[1].name}`, desc: `${qScale(lv, 3, 5)} rounds, ${qScale(lv, 8, 15)} reps each, no rest between` };
    });

    // -- Dynamic: Circuit with mixed exercises --
    generators.push(() => {
        const count = qScale(lv, 3, 5);
        const exs = qPickN(EXERCISE_DB.filter(e => e.group !== 'Other'), count);
        const names = exs.map(e => e.name).join(' → ');
        const rounds = qScale(lv, 2, 4);
        return { title: '⚔ Shadow Circuit', desc: `${rounds} rounds: ${names} — ${qScale(lv, 8, 15)} reps each, go!` };
    });

    // -- Dynamic: Tabata --
    generators.push(() => {
        const ex = qPick(EXERCISE_DB.filter(e => e.group !== 'Other'));
        const rounds = qScale(lv, 4, 8);
        return { title: `⚔ Tabata: ${ex.name}`, desc: `${rounds} rounds — 20s max effort / 10s rest` };
    });

    // -- Dynamic: EMOM --
    generators.push(() => {
        const ex = qPick(EXERCISE_DB.filter(e => e.group !== 'Other'));
        const rounds = qScale(lv, 6, 15);
        const reps = qScale(lv, 5, 12);
        return { title: `⚔ EMOM: ${ex.name}`, desc: `Every Minute On the Minute: ${reps} reps × ${rounds} rounds` };
    });

    // -- Dynamic: Drop set --
    generators.push(() => {
        const ex = qPick(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other'));
        const drops = qScale(lv, 2, 4);
        return { title: `⚔ Drop Set: ${ex.name}`, desc: `${drops} drop sets — start heavy, reduce weight each drop, no rest` };
    });

    // -- Rank-specific epic quests --
    if (r === 'B' || r === 'A') {
        generators.push(() => ({ title: '⚔ Shadow Trial: Chipper', desc: '100 squats + 75 push-ups + 50 sit-ups + 25 burpees — for time' }));
        generators.push(() => ({ title: '⚔ Shadow Trial: PR Hunt', desc: 'Attempt a personal record on any compound lift' }));
    }
    if (r === 'A' || r === 'S') {
        generators.push(() => ({ title: '⚔ Shadow Trial: AMRAP 20', desc: '20-min AMRAP: 5 pull-ups + 10 push-ups + 15 squats' }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: '⚔ Shadow Trial: Murph', desc: '1-mile run + 100 pull-ups + 200 push-ups + 300 squats + 1-mile run' }));
        generators.push(() => ({ title: '⚔ Shadow Trial: 1000 Reps', desc: '1000 total reps across any exercises today' }));
    }
    if (r === 'X') {
        generators.push(() => ({ title: '⚔ Shadow Trial: Extinction', desc: '2000 total reps. The monster consumes.' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'shadow_challenge', targetGroup };
}

// ============================
//  QUEST 8: BONUS (Dynamic + Coverage-Aware)
// ============================
function buildBonusQuest(level, rank, yTitles, leastTrained) {
    const r = rank.name;
    const xp = qScale(level, 40, 250);
    const gold = qScale(level, 8, 55);
    const lv = level;

    // Third least-trained group for even more coverage
    const bonusGroup = leastTrained[2] || qPick(Q_MUSCLE_GROUPS);
    const generators = [];

    // -- Dynamic: Least-trained group finisher --
    generators.push(() => {
        const exs = qGroupExercises(bonusGroup, 2);
        const names = exs.map(e => e.name).join(' + ');
        return { title: `Bonus: ${bonusGroup} Extra`, desc: `Add ${names} to today's training — cover your weak spots` };
    });

    // -- Dynamic: Random exercise hold --
    generators.push(() => {
        const holds = [
            { name: 'Plank', unit: 'seconds' },
            { name: 'Wall Sit', unit: 'seconds' },
            { name: 'Dead Hang', unit: 'seconds' },
            { name: 'L-Sit', unit: 'seconds' },
            { name: 'Hollow Body Hold', unit: 'seconds' },
        ];
        const h = qPick(holds);
        const secs = qScale(lv, 20, 120);
        return { title: `Bonus: ${h.name}`, desc: `Hold for ${secs} ${h.unit}` };
    });

    // -- Dynamic: Step count --
    generators.push(() => {
        const steps = qScale(lv, 4000, 25000);
        return { title: `Bonus: ${(steps / 1000).toFixed(0)}K Steps`, desc: `Walk ${steps.toLocaleString()}+ steps today` };
    });

    // -- Dynamic: Exercise finisher --
    generators.push(() => {
        const ex = qPick(EXERCISE_DB.filter(e => !e.isCardio && e.group !== 'Other'));
        const reps = qScale(lv, 20, 80);
        return { title: `Bonus: ${ex.name} Finisher`, desc: `End your workout with ${reps} extra reps of ${ex.name}` };
    });

    // -- Static variety --
    generators.push(() => ({ title: 'Bonus: Active Minutes', desc: `${qScale(lv, 30, 120)}+ active minutes today` }));
    generators.push(() => ({ title: 'Bonus: New Exercise', desc: "Try an exercise you've never done before" }));
    generators.push(() => ({ title: 'Bonus: Tempo Reps', desc: `${qScale(lv, 15, 50)} slow tempo reps (3s down, 1s up) on any exercise` }));
    generators.push(() => ({ title: 'Bonus: Unilateral Work', desc: `Complete ${qScale(lv, 2, 4)} single-arm or single-leg exercises — fix imbalances` }));
    generators.push(() => ({ title: 'Bonus: Core Burn', desc: `Complete: ${qScale(lv, 20, 60)} crunches + ${qScale(lv, 20, 60)}s plank + ${qScale(lv, 10, 40)} leg raises` }));
    generators.push(() => ({ title: 'Bonus: Grip Strength', desc: `Dead hang ${qScale(lv, 20, 90)}s + ${qScale(lv, 10, 30)} wrist curls each hand` }));

    if (r === 'B' || r === 'A' || r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Bonus: PR Attempt', desc: 'Attempt a personal record on any lift' }));
        generators.push(() => ({ title: 'Bonus: Double Session', desc: 'Complete 2 separate workout sessions today' }));
    }
    if (r === 'S' || r === 'X') {
        generators.push(() => ({ title: 'Bonus: Impossible Day', desc: '2 workouts + cardio + all meals perfect + full discipline' }));
    }

    const template = qBuild(generators, yTitles);
    return { ...template, xp, gold, type: 'bonus' };
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
        sysNotify(`[All 8 Gates Cleared] +${bonusXP} Bonus XP, +${bonusGold} Gold. The shadows bow to your discipline.`, 'gold');
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
            case 'workout':
                // Clear if: trained the target muscle group OR logged enough exercises/reps
                if (q.targetGroup && groupsTrained.has(q.targetGroup)) {
                    shouldClear = true;
                } else if (uniqueExercises >= 2 && totalReps >= 30) {
                    shouldClear = true;
                }
                break;

            case 'cardio':
                // Clear if any cardio exercise was logged today
                if (todayCardio.length > 0) {
                    shouldClear = true;
                }
                break;

            case 'food':
                // Clear if user logged 2+ meals today
                if (todayFoods.length >= 2) {
                    shouldClear = true;
                }
                break;

            case 'shadow_challenge':
                // Clear if target group was hit AND logged 2+ exercises
                if (q.targetGroup && groupsTrained.has(q.targetGroup) && uniqueExercises >= 2) {
                    shouldClear = true;
                } else if (uniqueExercises >= 3 && totalReps >= 60) {
                    shouldClear = true;
                }
                break;

            case 'bonus':
                // Bonus auto-clears if user has done significant work today
                if (uniqueExercises >= 3 && totalReps >= 80) {
                    shouldClear = true;
                } else if (q.targetGroup && groupsTrained.has(q.targetGroup) && todayWorkouts.length >= 2) {
                    shouldClear = true;
                }
                break;

            // discipline, mobility, mental → require manual click (real-world actions)
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
        autoCleared.forEach(q => {
            sysNotify(`[Auto-Cleared] "${q.title}" — +${q.xp} XP, +${q.gold} Gold`, 'green');
        });
        if (typeof vibrate === 'function') vibrate([40, 30, 40, 30, 40]);
        if (typeof refreshUI === 'function') refreshUI();
    }

    return autoCleared;
}
