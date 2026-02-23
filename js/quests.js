// ==========================================
//  QUESTS.JS — Daily quest generation & logic
//  Difficulty scales continuously with level
// ==========================================

// Helper: scale a value linearly between min and max based on level (1-250)
function qScale(level, min, max) {
    const t = Math.min((level - 1) / 199, 1); // 0 at lv1, 1 at lv200
    return Math.round(min + t * (max - min));
}

// Helper: pick random from array
function qPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateDailyQuests() {
    const today = todayStr();
    const existing = D.quests.filter(q => new Date(q.date).toDateString() === today);
    if (existing.length > 0) return; // Already generated
    
    const level = D.level;
    const rank = getRank(level);
    
    const quests = [];
    
    // Quest 1: Strength / Workout
    quests.push(buildWorkoutQuest(level, rank));
    
    // Quest 2: Cardio / Endurance
    quests.push(buildCardioQuest(level, rank));
    
    // Quest 3: Nutrition
    quests.push(buildNutritionQuest(level, rank));
    
    // Quest 4: Discipline / Lifestyle
    quests.push(buildDisciplineQuest(level, rank));
    
    // Quest 5: Mobility & Recovery
    quests.push(buildMobilityQuest(level, rank));
    
    // Quest 6: Mental Fortitude
    quests.push(buildMentalQuest(level, rank));
    
    // Quest 7: Shadow Challenge
    quests.push(buildShadowChallengeQuest(level, rank));
    
    // Quest 8: Bonus / Random challenge
    quests.push(buildBonusQuest(level, rank));
    
    quests.forEach(q => {
        q.id = Date.now() + Math.random();
        q.date = new Date().toISOString();
        q.cleared = false;
        q.failed = false;
        D.quests.push(q);
    });
    
    saveGame();
}

function buildWorkoutQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 70, 350);
    const gold = qScale(level, 12, 75);

    const pools = {
        E: [
            { title: 'Iron Temple: Push-ups',     desc: `Complete ${qScale(level,20,50)} push-ups (any sets)` },
            { title: 'Iron Temple: Squats',        desc: `Complete ${qScale(level,25,60)} bodyweight squats` },
            { title: 'Foundation Training',        desc: `Complete any workout — at least ${qScale(level,1,2)} exercises` },
            { title: 'Awakening Drill',            desc: `Log a workout with ${qScale(level,30,80)} total reps` },
        ],
        D: [
            { title: 'Strength Protocol',          desc: `Complete ${qScale(level,60,100)} push-ups + ${qScale(level,50,80)} squats` },
            { title: 'Iron Ascension',             desc: `Lift weights — at least ${qScale(level,3,4)} compound exercises` },
            { title: 'Dungeon Raid: Full Body',    desc: `Full body workout — ${qScale(level,4,5)} exercises minimum` },
            { title: 'D-Rank Proving Grounds',     desc: `Log ${qScale(level,100,160)} total reps across any exercises` },
        ],
        C: [
            { title: 'Gate of Steel',              desc: `Heavy compounds: Deadlift, Squat, Bench — ${qScale(level,3,4)} sets each` },
            { title: 'Berserker Protocol',         desc: `Complete ${qScale(level,120,200)} total reps (high intensity)` },
            { title: 'Shadow Training',            desc: `45+ min workout with ${qScale(level,5,6)} exercises` },
            { title: 'Blue Gate Assault',          desc: `Log ${qScale(level,2,3)} separate workouts today` },
        ],
        B: [
            { title: "Demon King's Trial",         desc: `${qScale(level,180,280)} total reps across ${qScale(level,5,7)} exercises` },
            { title: 'Push-Pull-Legs Destruction',  desc: `Complete PPL session with progressive overload — log 4+ exercises` },
            { title: 'Red Gate Challenge',          desc: `60+ min intense workout, ${qScale(level,6,8)} exercises minimum` },
            { title: 'Forged in Agony',             desc: `Heavy day — at least ${qScale(level,3,5)} sets at high intensity` },
        ],
        A: [
            { title: "Sovereign's Grind",           desc: `${qScale(level,250,400)} total reps across ${qScale(level,6,8)} exercises at high intensity` },
            { title: 'National Level Protocol',    desc: `90+ min workout with progressive overload on every compound` },
            { title: 'Double Dungeon',              desc: `Complete 2 full workout sessions today` },
            { title: 'Monarch Candidate Trial',    desc: `Log ${qScale(level,7,10)} exercises today — total annihilation` },
        ],
        S: [
            { title: "Monarch's Wrath",             desc: `${qScale(level,350,500)}+ total reps across 8+ exercises — no mercy` },
            { title: 'Absolute Destruction',        desc: `2+ workout sessions, 90+ min total, high intensity only` },
            { title: 'Shadow Sovereign Protocol',   desc: `Complete the ultimate session: 10+ exercises, progressive overload throughout` },
            { title: 'Arise: Full System Override',  desc: `Push every muscle group to failure today — log everything` },
        ],
        X: [
            { title: "The Threat's Protocol",       desc: `${qScale(level,500,750)}+ total reps across 10+ exercises — you are no longer human` },
            { title: 'National Level Annihilation', desc: `3+ workout sessions today, 120+ min total — nations fall before you` },
            { title: 'Extinction-Class Training',   desc: `Complete 12+ exercises, max intensity every set — the monster feeds` },
            { title: 'Calamity Workout',            desc: `Every muscle group destroyed. Progressive overload on all. No mercy. No rest.` },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'workout' };
}

function buildCardioQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 55, 280);
    const gold = qScale(level, 10, 60);

    const pools = {
        E: [
            { title: 'Endurance Gate',    desc: `Run or walk for ${qScale(level,10,20)} minutes` },
            { title: 'Sprint Awakening',  desc: `Complete ${qScale(level,3,5)} sprint intervals` },
            { title: 'Step Quest',        desc: `Walk ${qScale(level,3000,5000)}+ steps today` },
        ],
        D: [
            { title: 'Shadow Sprint',     desc: `Run ${qScale(level,15,25)} minutes at moderate pace` },
            { title: 'HIIT Dungeon',      desc: `Complete a ${qScale(level,15,25)} min HIIT session` },
            { title: 'Endurance Trial',   desc: `Cycle or swim for ${qScale(level,20,30)} minutes` },
        ],
        C: [
            { title: 'Demon Sprint',      desc: `Run ${qScale(level,25,35)} minutes at high pace` },
            { title: 'Blue Gate HIIT',     desc: `${qScale(level,25,35)} min HIIT — push through the wall` },
            { title: 'Cardio Raid',        desc: `Complete ${qScale(level,30,45)} min of any cardio (cycling, swimming, boxing)` },
        ],
        B: [
            { title: 'Red Zone Cardio',    desc: `${qScale(level,35,50)} min cardio at high intensity` },
            { title: 'Interval Hellgate',  desc: `Complete ${qScale(level,10,15)} sprint intervals (30s on / 30s off)` },
            { title: 'Demon Endurance',    desc: `Run ${qScale(level,5,8)} km today` },
        ],
        A: [
            { title: 'Sovereign Sprint',   desc: `${qScale(level,45,60)} min of intense cardio — no breaks` },
            { title: 'National Level Run',  desc: `Run ${qScale(level,8,12)} km at race pace` },
            { title: 'S-Gate HIIT',         desc: `${qScale(level,30,45)} min HIIT at maximum output` },
        ],
        S: [
            { title: "Monarch's Marathon",  desc: `${qScale(level,60,90)} min of cardio — break through every limit` },
            { title: 'Shadow Marathon',     desc: `Run ${qScale(level,10,15)}+ km or 60+ min continuous` },
            { title: 'Antares Protocol',    desc: `Double cardio session: AM + PM, total ${qScale(level,60,90)}+ min` },
        ],
        X: [
            { title: "The Monster's Run",   desc: `${qScale(level,90,120)} min of cardio — you don't stop until the world does` },
            { title: 'National Level Marathon', desc: `Run ${qScale(level,15,25)}+ km — the threat runs endlessly` },
            { title: 'Extinction Cardio',   desc: `Triple cardio session: AM + noon + PM, total ${qScale(level,90,150)}+ min` },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'cardio' };
}

function buildNutritionQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 40, 180);
    const gold = qScale(level, 8, 40);

    const pools = {
        E: [
            { title: 'Sustenance Protocol',  desc: 'Log all 3 main meals today' },
            { title: 'Protein Starter',      desc: `Consume ${qScale(level,60,90)}g+ protein today` },
            { title: 'Fuel the Machine',     desc: 'Log 2+ meals with macros tracked' },
        ],
        D: [
            { title: 'Protein Ritual',       desc: `Consume ${qScale(level,90,120)}g+ protein today` },
            { title: 'Clean Fuel',           desc: 'Log all meals — stay within calorie goal (±200)' },
            { title: "Hunter's Feast",       desc: 'Log 4+ meals/snacks with full macros' },
        ],
        C: [
            { title: 'Macro Discipline',     desc: `Hit ${qScale(level,120,150)}g protein & log all meals` },
            { title: 'Shadow Diet',          desc: 'Zero processed food today — whole foods only' },
            { title: 'Calorie Commander',    desc: 'Track every calorie — all meals + snacks logged with macros' },
        ],
        B: [
            { title: 'Demon Nutrition',      desc: `${qScale(level,150,180)}g protein, all meals tracked, within calorie target` },
            { title: 'Meal Prep Mastery',    desc: 'Eat 5+ planned meals today — no improvisation' },
            { title: 'Macro Perfection',     desc: 'Hit protein goal AND keep carbs/fats within ±10% target' },
        ],
        A: [
            { title: 'Sovereign Fuel',       desc: `${qScale(level,170,200)}g protein, 5+ meals, all macros perfect` },
            { title: 'Elite Nutrition',      desc: 'Every meal timed around training — pre/post workout nutrition logged' },
            { title: 'A-Rank Diet Code',     desc: 'Zero sugar, ${qScale(level,180,220)}g protein, calorie target ±100' },
        ],
        S: [
            { title: "Monarch's Feast",       desc: `${qScale(level,200,250)}g protein, 6 clean meals, zero cheat — perfection` },
            { title: 'Shadow Sovereign Diet', desc: 'Every gram tracked. Every meal timed. No exceptions. No mercy.' },
            { title: 'Absolute Nutrition',    desc: 'Hit exact macro targets: P/C/F all within ±5% — surgical precision' },
        ],
        X: [
            { title: "The Threat's Feast",    desc: `${qScale(level,250,350)}g protein, 7 meals, zero cheat — the monster must be fed` },
            { title: 'Extinction Diet',       desc: 'Every calorie weaponized. Every macro perfected. You are the system now.' },
            { title: 'National Level Fuel',   desc: `${qScale(level,280,400)}g protein, all macros ±3%, timed around triple sessions` },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'food' };
}

function buildDisciplineQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 35, 200);
    const gold = qScale(level, 8, 45);

    const pools = {
        E: [
            { title: "Monarch's Rest",       desc: 'Get 7-8 hours of sleep tonight' },
            { title: 'Hydration Protocol',   desc: 'Drink 2+ liters of water today' },
            { title: 'Early Rise',           desc: 'Wake up before 7:30 AM' },
            { title: 'Stretch Gate',         desc: 'Complete a 10-min stretching routine' },
        ],
        D: [
            { title: 'Cold Exposure',        desc: 'Take a cold shower for 30+ seconds' },
            { title: 'Mental Forge',         desc: 'Read for 20+ minutes or meditate for 10+' },
            { title: 'Shadow Discipline',    desc: 'No junk food or sugar today' },
            { title: 'Digital Detox',        desc: 'No social media for 3+ hours during the day' },
        ],
        C: [
            { title: 'Ice Protocol',          desc: 'Cold shower for 60+ seconds — no flinching' },
            { title: 'Focus Gate',            desc: 'Meditate for 15+ minutes — still mind, sharp blade' },
            { title: 'Dopamine Fast',         desc: 'No sugar, no social media, no junk — full discipline' },
            { title: 'Wake Before Dawn',      desc: 'Wake before 6 AM and complete a morning routine' },
        ],
        B: [
            { title: 'Red Gate Discipline',   desc: 'Cold shower 90s + meditate 15min + no sugar' },
            { title: 'Sleep Optimization',    desc: '8 hours sleep, no screens 1hr before bed' },
            { title: 'Demon Willpower',       desc: 'Complete every task you set today — zero excuses' },
            { title: 'Iron Routine',          desc: 'Follow a strict hourly schedule all day' },
        ],
        A: [
            { title: "Sovereign's Code",       desc: 'Cold shower 2min + meditate 20min + no sugar + 8hr sleep' },
            { title: 'A-Rank Protocol',       desc: 'Wake at 5 AM, morning routine, journal, full discipline day' },
            { title: 'Mental Fortress',        desc: 'No complaints. No excuses. No weakness. Entire day.' },
        ],
        S: [
            { title: "Monarch's Discipline",   desc: 'Every second accounted for. Perfect routine. Zero deviation.' },
            { title: 'Shadow Sovereign Code',  desc: '5 AM wake + cold shower + meditate + train + read + 8hr sleep' },
            { title: 'Absolute Willpower',     desc: 'The perfect day: every habit, every meal, every minute — executed.' },
        ],
        X: [
            { title: "The Threat's Code",      desc: '4 AM wake. Ice bath 3min. Meditate 30min. Train twice. Read. No sugar. No weakness.' },
            { title: 'National Level Discipline', desc: 'The monster obeys no one — except its own code. Perfect day. Every day.' },
            { title: 'Extinction Protocol',    desc: 'Zero deviation. Zero complaint. Zero failure. You are beyond human limitation.' },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'discipline' };
}

function buildMobilityQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 30, 170);
    const gold = qScale(level, 6, 38);

    const pools = {
        E: [
            { title: 'Joint Unlock',            desc: 'Complete a 5-min full-body stretch routine' },
            { title: 'Warm-up Protocol',        desc: 'Do a proper warm-up before your workout (5+ min)' },
            { title: 'Flexibility Gate',        desc: `Hold ${qScale(level,3,5)} different stretches for 20 seconds each` },
            { title: 'Cool-down Ritual',        desc: 'Complete a cool-down stretch after training (5+ min)' },
        ],
        D: [
            { title: 'Mobility Flow',           desc: 'Complete a 10-min mobility routine (hips, shoulders, ankles)' },
            { title: 'Recovery Protocol',       desc: 'Foam roll for 10+ minutes — target tight areas' },
            { title: 'Limber Gate',             desc: `Hold ${qScale(level,5,8)} stretches for 30 seconds each` },
            { title: 'Active Recovery',         desc: 'Light yoga or stretching for 15+ minutes' },
        ],
        C: [
            { title: 'Shadow Flexibility',      desc: 'Complete a 15-min yoga or mobility session' },
            { title: 'Deep Tissue Recovery',    desc: 'Foam roll every major muscle group — 15+ min total' },
            { title: 'Hip Unlock Protocol',     desc: 'Complete hip mobility circuit: pigeon, 90-90, couch stretch — 3 sets each' },
            { title: 'Shoulder Restoration',    desc: 'Full shoulder mobility routine — band work, dislocates, wall slides' },
        ],
        B: [
            { title: 'Red Gate Recovery',       desc: '20-min mobility session + foam rolling — full body restoration' },
            { title: 'Demon Flexibility',       desc: 'Complete a 30-min yoga flow or deep stretch session' },
            { title: 'Joint Armor Protocol',    desc: 'Warm-up + cool-down both logged, plus 10-min foam rolling' },
            { title: 'Recovery Dungeon',        desc: 'Contrast therapy: stretch 15min + foam roll 10min + cold exposure' },
        ],
        A: [
            { title: "Sovereign's Flexibility",  desc: '30-min dedicated mobility work — every joint, every angle' },
            { title: 'Full Restoration',        desc: 'Yoga 20min + foam roll 15min + deep breathing 5min' },
            { title: 'A-Rank Recovery Code',    desc: 'Full warm-up, training, full cool-down — no shortcuts on recovery today' },
        ],
        S: [
            { title: "Monarch's Recovery",       desc: '45-min recovery session: yoga + foam roll + dynamic stretches — the body is the weapon, maintain it' },
            { title: 'Shadow Body Restoration', desc: 'Every joint mobilized. Every muscle foam-rolled. Full 40-min session.' },
            { title: 'Total Recovery Protocol', desc: 'Active recovery day: 30-min yoga + 20-min foam roll + contrast shower' },
        ],
        X: [
            { title: "The Threat's Maintenance", desc: '60-min recovery protocol: deep yoga + percussion therapy + full foam roll — the weapon must never dull' },
            { title: 'Extinction Recovery',      desc: 'Complete recovery between double sessions: 30-min yoga + full foam roll + cold therapy' },
            { title: 'National Level Restoration', desc: 'Every joint mobilized twice. Every muscle lengthened. 60-min session — machines need maintenance too.' },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'mobility' };
}

function buildMentalQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 35, 190);
    const gold = qScale(level, 7, 42);

    const pools = {
        E: [
            { title: 'Mind Gate: Focus',         desc: 'Meditate or sit in silence for 5 minutes' },
            { title: 'Hunter\'s Journal',        desc: 'Write down 1 thing you\'re grateful for today' },
            { title: 'Visualize the Path',       desc: 'Spend 3 minutes visualizing your ideal physique' },
            { title: 'Knowledge Seeker',         desc: 'Watch a technique video or read about proper form for any exercise' },
        ],
        D: [
            { title: 'Mental Forge: Clarity',    desc: 'Meditate for 10 minutes — clear the static' },
            { title: 'Goal Inscription',         desc: 'Write down 3 specific short-term fitness goals' },
            { title: 'Shadow Study',             desc: 'Research proper form for 2 exercises you regularly do' },
            { title: 'Hunter\'s Reflection',     desc: 'Journal for 5 minutes: what went well, what needs work' },
        ],
        C: [
            { title: 'Blue Gate Meditation',     desc: 'Meditate for 15 minutes — forge the unbreakable mind' },
            { title: 'Form Mastery Study',       desc: 'Study and practice proper technique for 3 exercises' },
            { title: 'Progress Review',          desc: 'Review your last 7 days of training — find patterns, adjust strategy' },
            { title: 'Warrior\'s Journal',       desc: 'Journal for 10 minutes: reflect on progress, set next week\'s targets' },
        ],
        B: [
            { title: 'Red Gate Mind',            desc: 'Meditate 15min + journal 10min — sharpen both edges of the blade' },
            { title: 'Strategic Planning',       desc: 'Plan your entire next week of training: exercises, splits, goals' },
            { title: 'Technique Laboratory',     desc: 'Film yourself on 2 exercises and analyze form against reference' },
            { title: 'Mental Armor',             desc: 'Practice positive self-talk during every set today — zero negative thoughts' },
        ],
        A: [
            { title: "Sovereign's Mind",          desc: '20-min meditation + detailed training journal + next-week programming' },
            { title: 'A-Rank Mental Code',       desc: 'Complete visualization 10min + meditation 15min + gratitude journal' },
            { title: 'Master Strategist',        desc: 'Analyze your monthly progress data and adjust your program accordingly' },
        ],
        S: [
            { title: "Monarch's Meditation",      desc: '30-min meditation — the Shadow Monarch\'s mind is an impenetrable fortress' },
            { title: 'Shadow Sovereign\'s Study', desc: 'Deep study: research programming, periodization, or nutrition science for 30+ min' },
            { title: 'Total Mental Mastery',      desc: 'Meditate 20min + journal 15min + visualize 10min + plan entire week' },
        ],
        X: [
            { title: "The Threat's Mind",         desc: '45-min meditation. The monster\'s mind is forged in absolute silence. No thoughts. No weakness.' },
            { title: 'National Level Strategy',   desc: 'Full program review + redesign. Periodization planned. Every variable optimized. The mind commands.' },
            { title: 'Extinction Mindset',        desc: 'Meditate 30min + detailed journal + full week programming + technique study — total mental dominance' },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'mental' };
}

function buildShadowChallengeQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 45, 280);
    const gold = qScale(level, 10, 55);

    const pools = {
        E: [
            { title: '⚔ Shadow Trial: Endure',      desc: `Complete a ${qScale(level,1,2)}-minute plank — the shadows are watching` },
            { title: '⚔ Shadow Trial: Volume',       desc: `Complete ${qScale(level,50,80)} reps of any single exercise without stopping` },
            { title: '⚔ Shadow Trial: Speed',        desc: `Complete ${qScale(level,15,25)} burpees in under ${qScale(level,5,3)} minutes` },
            { title: '⚔ Shadow Trial: Climb',        desc: `Do ${qScale(level,3,8)} pull-ups or ${qScale(level,10,20)} inverted rows` },
        ],
        D: [
            { title: '⚔ Shadow Trial: Iron Grip',    desc: `Dead hang for ${qScale(level,30,50)} seconds — grip is the gateway to power` },
            { title: '⚔ Shadow Trial: Tabata',       desc: `Complete a 4-minute Tabata round (20s work / 10s rest × 8)` },
            { title: '⚔ Shadow Trial: Superset',     desc: `Complete 3 supersets: pair any 2 exercises, no rest between them` },
            { title: '⚔ Shadow Trial: 100 Rep',      desc: `Complete 100 reps of any single exercise as fast as possible` },
        ],
        C: [
            { title: '⚔ Shadow Trial: EMOM',         desc: `Complete an EMOM workout: ${qScale(level,8,12)} rounds — one movement per minute` },
            { title: '⚔ Shadow Trial: Unbroken',     desc: `Complete ${qScale(level,100,150)} reps of any exercise — no rest, no breaking` },
            { title: '⚔ Shadow Trial: Pyramid',      desc: `Pyramid set: 1-2-3-4-5-4-3-2-1 reps of a compound exercise — no rest at top` },
            { title: '⚔ Shadow Trial: Complex',      desc: `Complete a barbell complex: 5 exercises, 5 reps each, don't let go of the bar` },
        ],
        B: [
            { title: '⚔ Shadow Trial: Chipper',      desc: `100 air squats + 75 push-ups + 50 sit-ups + 25 burpees — for time` },
            { title: '⚔ Shadow Trial: Heavy Single',  desc: `Work up to a heavy single (1-rep) on any compound lift — test your strength` },
            { title: '⚔ Shadow Trial: Drop Sets',    desc: `Complete 3 exercises with drop sets (3 drops each) — chase the burn` },
            { title: '⚔ Shadow Trial: Time Cap',     desc: `Complete ${qScale(level,200,300)} total reps across 5 exercises in under 30 minutes` },
        ],
        A: [
            { title: '⚔ Shadow Trial: Murph Lite',    desc: `1 km run + 50 pull-ups + 100 push-ups + 150 squats + 1 km run (partition as needed)` },
            { title: '⚔ Shadow Trial: Giant Sets',    desc: `Complete 4 giant sets (4 exercises back-to-back, no rest) — 4 rounds` },
            { title: '⚔ Shadow Trial: Max Effort',    desc: `Attempt a new PR on 2 different lifts today — push beyond the known` },
            { title: '⚔ Shadow Trial: Density',       desc: `Complete as many rounds as possible in 20 minutes: 5 pull-ups + 10 push-ups + 15 squats` },
        ],
        S: [
            { title: '⚔ Shadow Trial: Full Murph',    desc: `1-mile run + 100 pull-ups + 200 push-ups + 300 squats + 1-mile run — the Monarch\'s challenge` },
            { title: '⚔ Shadow Trial: 1000 Reps',    desc: `Complete 1000 total reps across any exercises — the shadow army grows with every rep` },
            { title: '⚔ Shadow Trial: King Maker',   desc: `PR attempt on all 3 big lifts (squat, bench, deadlift) — become the king` },
            { title: '⚔ Shadow Trial: War',           desc: `45-min AMRAP — 5 exercises, max rounds, no mercy — only war remains` },
        ],
        X: [
            { title: '⚔ Shadow Trial: Extinction',    desc: `2000 total reps. Any exercises. No time limit. The monster doesn't count — it consumes.` },
            { title: '⚔ Shadow Trial: Double Murph',  desc: `Two full Murphs in one day. The threat knows no ceiling.` },
            { title: '⚔ Shadow Trial: Absolute PR',   desc: `PR on every compound lift attempted today — squat, bench, dead, OHP, row — all fall` },
            { title: '⚔ Shadow Trial: Annihilation',  desc: `60-min AMRAP. 8 exercises. Zero rest. The system cannot measure what you are becoming.` },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'shadow_challenge' };
}

function buildBonusQuest(level, rank) {
    const r = rank.name;
    const xp = qScale(level, 40, 250);
    const gold = qScale(level, 8, 55);

    const pools = {
        E: [
            { title: 'Bonus: Plank Hold',    desc: `Hold plank for ${qScale(level,30,45)} seconds` },
            { title: 'Bonus: Step Count',    desc: `Walk ${qScale(level,4000,6000)}+ steps today` },
            { title: 'Bonus: Stretch',       desc: 'Complete a 10-min stretching routine' },
            { title: 'Bonus: Wall Sit',      desc: `Wall sit for ${qScale(level,20,40)} seconds` },
        ],
        D: [
            { title: 'Bonus: Dead Hang',     desc: `Hang from a bar for ${qScale(level,20,40)} seconds` },
            { title: 'Bonus: Burpee Trial',  desc: `Complete ${qScale(level,10,25)} burpees` },
            { title: 'Bonus: Mobility',      desc: 'Complete a 15-min mobility/yoga routine' },
            { title: 'Bonus: Ab Circuit',    desc: `Complete ${qScale(level,30,60)} crunches + ${qScale(level,20,40)} leg raises` },
        ],
        C: [
            { title: 'Bonus: Grip Forge',    desc: `Dead hang for ${qScale(level,40,60)} seconds` },
            { title: 'Bonus: Burpee Gate',   desc: `Complete ${qScale(level,25,40)} burpees with no rest` },
            { title: 'Bonus: 10K Steps',     desc: `Walk ${qScale(level,8000,12000)}+ steps today` },
            { title: 'Bonus: Core Assault',  desc: `${qScale(level,50,80)} crunches + 60s plank + ${qScale(level,30,50)} leg raises` },
        ],
        B: [
            { title: 'Bonus: PR Attempt',    desc: 'Attempt a personal record on any lift' },
            { title: 'Bonus: Double Session', desc: 'Complete 2 separate workout sessions today' },
            { title: 'Bonus: Muscle-Up Work', desc: `${qScale(level,5,10)} muscle-up attempts or ${qScale(level,15,25)} pull-ups` },
            { title: 'Bonus: 15K Steps',     desc: 'Walk 15,000+ steps today — stay moving' },
        ],
        A: [
            { title: 'Bonus: Fasted Training', desc: 'Complete a fasted workout session (train before eating)' },
            { title: 'Bonus: Triple Threat',   desc: 'Workout + cardio + stretching — all 3 in one day' },
            { title: 'Bonus: 20K Steps',       desc: '20,000+ steps today — a Sovereign walks endlessly' },
            { title: 'Bonus: Max Dead Hang',   desc: `Dead hang for ${qScale(level,60,90)}+ seconds` },
        ],
        S: [
            { title: 'Bonus: Impossible Day',   desc: '2 workouts + 10K run + all meals perfect + full discipline' },
            { title: 'Bonus: Shadow Endurance',  desc: '1000 total reps of any exercises across the day' },
            { title: 'Bonus: PR Destruction',    desc: 'Break a personal record on 2+ different lifts' },
            { title: 'Bonus: 25K Steps',         desc: '25,000+ steps — the Shadow Monarch never rests' },
        ],
        X: [
            { title: 'Bonus: Extinction Day',    desc: '3 workouts + 15K run + all meals perfect + full discipline — inhuman' },
            { title: 'Bonus: Monster Endurance',  desc: '1500+ total reps across the day — the threat feeds on volume' },
            { title: 'Bonus: PR Annihilation',    desc: 'Break a personal record on 3+ different lifts — human limits do not apply' },
            { title: 'Bonus: 30K Steps',          desc: '30,000+ steps — the monster roams without rest' },
        ],
    };

    const template = qPick(pools[r] || pools.E);
    return { ...template, xp, gold, type: 'bonus' };
}

// ---- Clear a quest ----
function clearQuest(questId) {
    const quest = D.quests.find(q => q.id === questId);
    if (!quest || quest.cleared || quest.failed) return null;
    
    quest.cleared = true;
    D.stats.totalQuestsCompleted++;
    grantXP(quest.xp);
    grantGold(quest.gold);
    if (typeof playSound === 'function') playSound('questComplete');
    
    // Check if all today's quests are cleared
    const todayQ = getTodayQuests();
    const allCleared = todayQ.length > 0 && todayQ.every(q => q.cleared);
    
    if (allCleared) {
        // Bonus scales with level too (8 quests = bigger reward)
        const bonusXP = qScale(D.level, 250, 800);
        const bonusGold = qScale(D.level, 80, 250);
        grantXP(bonusXP);
        grantGold(bonusGold);
        D.streak++;
        sysNotify(`[All 8 Gates Cleared] +${bonusXP} Bonus XP, +${bonusGold} Gold. The shadows bow to your discipline.`, 'gold');
    }
    
    checkAchievements();
    saveGame();
    
    return { quest, allCleared };
}
