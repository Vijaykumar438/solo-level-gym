// ==========================================
//  DATA.JS — All data structures & constants
// ==========================================

const RANKS = [
    { min: 1, max: 10, name: 'E', title: 'E-Rank', css: 'rank-e' },
    { min: 11, max: 30, name: 'D', title: 'D-Rank', css: 'rank-d' },
    { min: 31, max: 60, name: 'C', title: 'C-Rank', css: 'rank-c' },
    { min: 61, max: 100, name: 'B', title: 'B-Rank', css: 'rank-b' },
    { min: 101, max: 200, name: 'A', title: 'A-Rank', css: 'rank-a' },
    { min: 201, max: 350, name: 'S', title: 'S-Rank', css: 'rank-s' },
    { min: 351, max: 9999, name: 'X', title: 'National Level', css: 'rank-x' }
];

const TITLES = {
    1: 'The Weakest Hunter',
    5: 'Persistent Novice',
    10: 'Awakened Prospect',
    15: 'Iron Initiate',
    20: 'Gate Breaker',
    30: 'Steel Warrior',
    40: 'Crimson Fighter',
    50: 'Shadow Aspirant',
    60: 'Demon Slayer',
    75: 'Sovereign Candidate',
    100: 'Monarch Apparent',
    150: 'Shadow Sovereign',
    200: 'Absolute Being',
    250: 'The Shadow Monarch',
    351: 'National Level Hunter',
    400: 'The Threat',
    450: 'Calamity',
    500: 'The Monster',
    600: 'Extinction-Class Entity',
    750: 'The Absolute Nightmare',
    999: 'He Who Must Not Be Challenged'
};

const CALORIE_RATES = {
    'Push-ups':     { low: 4, medium: 6, high: 8 },
    'Pull-ups':     { low: 5, medium: 8, high: 11 },
    'Squats':       { low: 4, medium: 6, high: 9 },
    'Deadlift':     { low: 5, medium: 8, high: 11 },
    'Bench Press':  { low: 4, medium: 7, high: 10 },
    'OHP':          { low: 4, medium: 6, high: 9 },
    'Running':      { low: 6, medium: 8, high: 10 },
    'Cycling':      { low: 5, medium: 7, high: 9 },
    'Swimming':     { low: 6, medium: 8, high: 11 },
    'HIIT':         { low: 8, medium: 10, high: 12 },
    'Boxing':       { low: 6, medium: 9, high: 12 },
    'Jump Rope':    { low: 8, medium: 10, high: 13 },
    'Walking':      { low: 3, medium: 4, high: 5 },
    'Yoga':         { low: 2, medium: 3, high: 4 },
    'Rows':         { low: 4, medium: 7, high: 10 },
    'Plank':        { low: 3, medium: 5, high: 7 },
    'Other':        { low: 4, medium: 6, high: 8 }
};

const SKILLS_DEFS = [
    { id: 'iron_will',     name: 'Iron Will',                 type: 'Passive', icon: '🛡', desc: 'WIL growth +10%. Forged through relentless discipline.', unlock: 3 },
    { id: 'rapid_rec',     name: 'Rapid Recovery',            type: 'Passive', icon: '💚', desc: 'VIT gains +10%. Muscles repair faster between sessions.', unlock: 5 },
    { id: 'shadow_step',   name: 'Shadow Step',               type: 'Active',  icon: '⚡', desc: 'Short burst sprint. AGI +5% in cardio sessions.', unlock: 8 },
    { id: 'unyield_sinew', name: 'Rune of Unyielding Sinew',  type: 'Rune',    icon: '🔷', desc: 'STR gains +10%. Ancient power flows through your tendons.', unlock: 12 },
    { id: 'monarchs_gaze', name: "Monarch's Gaze",            type: 'Active',  icon: '👁', desc: 'Increased focus under fatigue. WIL checks boosted.', unlock: 18 },
    { id: 'shadow_vit',    name: 'Ancient Shadow Vitality',    type: 'Passive', icon: '🖤', desc: 'END growth +15%. The shadows sustain you.', unlock: 25 },
    { id: 'first_monarch', name: 'Breath of the First Monarch',type: 'Rune',   icon: '👑', desc: 'All stats growth +5%. You glimpse the Monarch within.', unlock: 40 },
    { id: 'arise',         name: 'Arise',                     type: 'Ultimate',icon: '🌑', desc: 'PHS growth +20%. The shadow army awakens within you.', unlock: 60 },
    { id: 'domain',        name: 'Domain of Shadows',         type: 'Domain',  icon: '⬛', desc: 'All growth +10%. Reality bends to your will.', unlock: 100 },
    { id: 'national_aura', name: 'Threat Aura',               type: 'Domain',  icon: '☠️', desc: 'All growth +15%. You are no longer a hunter — you are the danger.', unlock: 200 },
    { id: 'extinction',    name: 'Extinction Protocol',       type: 'Ultimate',icon: '💀', desc: 'All stats growth +25%. Nations tremble at your name.', unlock: 351 }
];

const ACHIEVEMENTS_DEFS = [
    { id: 'first_blood',  name: 'First Blood',       icon: '🎯', desc: 'Complete your first workout',    cond: d => d.stats.totalWorkouts >= 1 },
    { id: 'gate_clear',   name: 'Gate Cleared',       icon: '⬡',  desc: 'Complete all daily quests once',  cond: d => d.stats.totalQuestsCompleted >= 5 },
    { id: 'w10',          name: 'Tenacious',          icon: '💪', desc: 'Complete 10 workouts',            cond: d => d.stats.totalWorkouts >= 10 },
    { id: 'w50',          name: 'Warrior',            icon: '⚔',  desc: 'Complete 50 workouts',            cond: d => d.stats.totalWorkouts >= 50 },
    { id: 'cal1k',        name: 'Calorie Crusher',    icon: '🔥', desc: 'Burn 1,000 calories total',       cond: d => d.stats.totalCalBurned >= 1000 },
    { id: 'cal10k',       name: 'Inferno',            icon: '🌋', desc: 'Burn 10,000 calories total',      cond: d => d.stats.totalCalBurned >= 10000 },
    { id: 'streak7',      name: 'Week of Steel',      icon: '🔗', desc: 'Maintain 7-day streak',           cond: d => d.streak >= 7 },
    { id: 'streak30',     name: 'Unbreakable',        icon: '🏔',  desc: 'Maintain 30-day streak',          cond: d => d.streak >= 30 },
    { id: 'meals20',      name: 'Disciplined Eater',  icon: '🍖', desc: 'Log 20 meals',                    cond: d => d.stats.totalMeals >= 20 },
    { id: 'lv10',         name: 'D-Rank Ascension',   icon: '⭐', desc: 'Reach level 10',                  cond: d => d.level >= 10 },
    { id: 'lv30',         name: 'C-Rank Ascension',   icon: '🌟', desc: 'Reach level 30',                  cond: d => d.level >= 30 },
    { id: 'lv60',         name: 'B-Rank Ascension',   icon: '✨', desc: 'Reach level 60',                  cond: d => d.level >= 60 },
    { id: 'lv100',        name: 'A-Rank Ascension',   icon: '💎', desc: 'Reach level 100',                 cond: d => d.level >= 100 },
    { id: 'lv200',        name: 'S-Rank Ascension',   icon: '🏆', desc: 'Reach level 200',                 cond: d => d.level >= 200 },
    { id: 'lv351',        name: 'National Level',     icon: '☠️', desc: 'Reach level 351 — You are no longer a hunter', cond: d => d.level >= 351 },
    { id: 'w100',         name: 'Centurion',          icon: '🗡️', desc: 'Complete 100 workouts',            cond: d => d.stats.totalWorkouts >= 100 },
    { id: 'cal50k',       name: 'Extinction Event',   icon: '💀', desc: 'Burn 50,000 calories total',       cond: d => d.stats.totalCalBurned >= 50000 },
    { id: 'streak90',     name: 'The Monster',        icon: '👹', desc: 'Maintain 90-day streak',           cond: d => d.streak >= 90 }
];

const WISDOM = [
    // ===== Original System Quotes =====
    "The body breaks before the will — forge the latter in fire.",
    "Only shadows remain when light fades; become the shadow.",
    "A hunter who rests too long becomes the hunted.",
    "Pain is the currency of growth. Pay willingly.",
    "The dungeon does not care about your excuses.",
    "Between the man you are and the man you could be — there lies only action.",
    "Every rep is a spell. Every set, an incantation. The body transforms through ritual.",
    "Weakness is a choice. Strength is earned, one day at a time.",
    "The gates do not open for the hesitant.",
    "You were not born strong. You were born with the potential to become unbreakable.",
    "Discipline is the shadow that never leaves, even in the darkest dungeon.",
    "The Monarchs did not ascend by comfort — they ascended through fire.",
    "Sleep is the potion. Food is the mana. Training is the battle. Recover, refuel, return.",
    "Your reflection is your final boss. Defeat it daily.",
    "The System rewards those who show up — even broken, even bleeding.",
    "A single push-up done today echoes louder than a thousand planned for tomorrow.",
    "Arise — not because it is easy, but because you refuse to stay fallen.",
    "Every missed day feeds the weakness within. Every completed gate starves it.",
    "The strongest hunters were once the weakest. They simply refused to stop.",
    "Iron sharpens iron. Your body is the blade; the gym is the forge.",

    // ===== Broken Heart / Rebuild Yourself =====
    "She left. The weight stayed. Pick it up.",
    "The best revenge is a version of yourself they can't even recognize.",
    "They broke your heart. Let the gym break your limits.",
    "You lost someone. Don't lose yourself too.",
    "Heartbreak is just another dungeon. Clear it.",
    "Love didn't kill you. So nothing in this gym can.",
    "The person who left missed the version you're about to become.",
    "You don't need closure. You need a barbell and a purpose.",
    "Cry if you must. Then wipe your face and lift.",
    "The pain in your chest? Replace it with the burn in your muscles.",
    "They chose someone else. Choose yourself. Every. Single. Day.",
    "You weren't abandoned. You were set free to become dangerous.",
    "Turn your 'why wasn't I enough' into 'watch me become too much.'",
    "Broken hearts heal. Weak bodies don't — unless you train them.",
    "Fall apart in private. Rebuild in public. Let the results speak.",
    "One day they'll see you and realize the mistake. You won't even notice.",
    "Stop rereading old texts. Start rewriting your body.",
    "They left you empty. Fill yourself with iron.",
    "Your heart got shattered? Good. Build a chest so strong nothing gets through again.",
    "Missing someone? Miss your old PRs instead. Go beat them.",

    // ===== Loneliness & Inner Darkness =====
    "The gym doesn't judge you. The weights don't ask why you're sad. Just show up.",
    "Loneliness is just a dungeon with no party. Solo it.",
    "You feel alone? Good. Legends are forged in solitude.",
    "Nobody's coming to save you. That's the best news you'll ever hear.",
    "The darkness you feel? Channel it. Darkness is where shadows are born.",
    "You don't need anyone to believe in you. The System already does.",
    "While they're out living easy, you're in here becoming unbreakable.",
    "Silence the noise. Silence the memories. Let the iron do the talking.",
    "The loneliest road leads to the strongest version of you.",
    "Your pain is fuel. Your anger is pre-workout. Use everything.",

    // ===== Getting Back Up / Resilience =====
    "You've survived 100% of your worst days. This set is nothing.",
    "Rock bottom is just a solid foundation to build a monster on.",
    "They told you you're nothing. Prove them wrong in silence.",
    "The world broke you? Congratulations — broken things get rebuilt stronger.",
    "Stop waiting for motivation. Discipline doesn't need your feelings.",
    "You are not your past. You are what you do next.",
    "The version of you that gave up doesn't exist here. Move.",
    "Scars mean you survived. Muscles mean you chose to fight back.",
    "Every scar is an upgrade. Every failure is XP. Keep grinding.",
    "They counted you out. Let your body be the proof they were wrong.",

    // ===== Self-Worth & Transformation =====
    "You are the project. The gym is the lab. Get to work.",
    "Stop begging people to stay. Become someone people are afraid to lose.",
    "Your value doesn't decrease because someone failed to see it.",
    "Build a body that matches the strength you've been hiding inside.",
    "The glow-up isn't for them. It's for the person in the mirror.",
    "You don't owe anyone an explanation. You owe yourself a transformation.",
    "Invest the energy you wasted on them — into yourself.",
    "They'll miss you eventually. Make sure the person they miss no longer exists.",
    "The old you died in that heartbreak. Let the new one be terrifying.",
    "You can't control who stays. You can control how strong you become.",

    // ===== Late Night / Raw Truth =====
    "3 AM and you can't sleep? Tomorrow you train harder than today. That's the only plan.",
    "The nights are long when you're healing. But the mornings belong to hunters.",
    "You're hurting. I know. But pain shared with iron becomes power.",
    "Some nights you'll want to quit everything. Survive the night. Train at dawn.",
    "The tears you shed in silence water the strength growing inside you.",
    "Tonight you grieve. Tomorrow you conquer. The System never closes.",
    "You're not broken. You're mid-transformation. Caterpillar to something lethal.",
    "That empty feeling? It's just making room for something greater.",
    "The heaviest weight you'll ever lift is your broken self off the floor. Do it anyway.",
    "They forgot about you. Make sure history doesn't."
];

function getDefaultData() {
    return {
        level: 1,
        xp: 0,
        gold: 0,
        freePoints: 0,
        stats: {
            str: 5, agi: 4, vit: 5, end: 4, wil: 3, phs: 3.0,
            totalWorkouts: 0,
            totalCalBurned: 0,
            totalCalConsumed: 0,
            totalMeals: 0,
            totalQuestsCompleted: 0,
            totalDaysActive: 0,
            totalPenalties: 0,
            shadowMissionsCompleted: 0,
            bossesDefeated: 0
        },
        streak: 0,
        lastActiveDate: null,
        achievements: [],
        unlockedSkills: [],
        workouts: [],    // { id, date, exercise, reps, sets, weight, intensity, calBurned, xp }
        foods: [],       // { id, date, food, meal, protein, carbs, fats, calories, xp }
        quests: [],      // { id, date, title, desc, type, xp, gold, cleared, failed }
        penalties: [],   // { id, date, reason, xpLost }
        shadowArmy: 0,
        skillTree: { strength: [], endurance: [], shadow: [] },
        boss: null,
        lastShadowMission: 0,
        loginStreak: 0,
        lastLoginReward: null,
        shop: {
            purchased: [],
            inventory: [],
            equipped: null
        },
        physique: {
            currentWeight: null,
            targetWeight: null,
            startWeight: null,
            startDate: null,
            history: []  // { date, weight }
        },
        settings: {
            playerName: 'Hunter',
            soundEnabled: true
        }
    };
}

function xpForLevel(level) {
    if (level <= 1) return 120;
    return Math.floor(120 * Math.pow(1.18, level - 1));
}

function getRank(level) {
    return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[0];
}

function getTitle(level) {
    let title = 'The Weakest Hunter';
    const keys = Object.keys(TITLES).map(Number).sort((a, b) => a - b);
    for (const k of keys) {
        if (level >= k) title = TITLES[k];
    }
    return title;
}

function getRandomWisdom() {
    return WISDOM[Math.floor(Math.random() * WISDOM.length)];
}
