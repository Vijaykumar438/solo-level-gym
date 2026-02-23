// ==========================================
//  TUTORIAL.JS — Interactive Guide System
// ==========================================

const TUTORIAL_SECTIONS = [
    {
        id: 'welcome',
        icon: '◈',
        title: 'Welcome to the System',
        content: `You've awakened as a Hunter. This app is your <strong>System</strong> — a Solo Leveling themed gym tracker that turns every workout into an RPG battle.<br><br>
        <span class="tut-highlight">Everything you do earns XP, Gold, and stat growth.</span> Log workouts, complete daily quests, defeat bosses, and watch yourself level up — both in the app and in real life.`
    },
    {
        id: 'status',
        icon: '⚔',
        title: 'Status Window & Stats',
        content: `Your <strong>Status Tab</strong> shows your hunter profile with 6 stats:<br><br>
        <div class="tut-stats-grid">
            <span><strong>STR</strong> — Strength (push-ups, bench, deadlift)</span>
            <span><strong>AGI</strong> — Agility (cardio, sprints, HIIT)</span>
            <span><strong>VIT</strong> — Vitality (recovery, sleep quality)</span>
            <span><strong>END</strong> — Endurance (sustained effort, sets)</span>
            <span><strong>WIL</strong> — Willpower (discipline, streaks)</span>
            <span><strong>PHS</strong> — Physique (overall body composition)</span>
        </div><br>
        Every level-up gives <strong>free stat points</strong> to distribute. Higher ranks = more points per level (E: 3, D: 3, C: 4, B: 4, A: 5, S: 5, X: 7).`
    },
    {
        id: 'ranks',
        icon: '🏅',
        title: 'Rank System',
        content: `As you level up, you ascend through hunter ranks:<br><br>
        <div class="tut-rank-list">
            <span class="tut-rank rank-e">E-Rank</span> Lv 1–10 — The Weakest Hunter<br>
            <span class="tut-rank rank-d">D-Rank</span> Lv 11–30 — Rising Candidate<br>
            <span class="tut-rank rank-c">C-Rank</span> Lv 31–60 — Proven Fighter<br>
            <span class="tut-rank rank-b">B-Rank</span> Lv 61–100 — Elite Warrior<br>
            <span class="tut-rank rank-a">A-Rank</span> Lv 101–200 — Sovereign Class<br>
            <span class="tut-rank rank-s">S-Rank</span> Lv 201–350 — Shadow Monarch<br>
            <span class="tut-rank rank-x">X-Rank</span> Lv 351+ — National Level Threat<br>
        </div><br>
        Each rank unlocks new skills, tougher bosses, better shop items, and exclusive titles. Your avatar visually evolves with every rank.`
    },
    {
        id: 'quests',
        icon: '⬡',
        title: 'Daily Gate (Quests)',
        content: `Every day, the System generates <strong>5 daily quests</strong> tailored to your rank:<br><br>
        • <strong>Workout quests</strong> — Strength and cardio challenges<br>
        • <strong>Nutrition quests</strong> — Protein and meal tracking<br>
        • <strong>Discipline quests</strong> — Sleep, hydration, cold showers<br>
        • <strong>Bonus quests</strong> — Extra challenges for big rewards<br><br>
        <span class="tut-highlight">Clear all 5 gates to earn bonus XP and Gold!</span><br><br>
        ⚠ <strong>Penalty System:</strong> If you skip a day entirely, you'll receive stat decay — the System punishes laziness. Maintain your streak to avoid degradation.`
    },
    {
        id: 'logging',
        icon: '⬢',
        title: 'Workout & Food Logging',
        content: `The <strong>Log Tab</strong> is where you report your training:<br><br>
        <strong>Workout Log:</strong> Select exercise, reps, sets, weight, and intensity. The System calculates calories burned, XP gained, and deals boss damage automatically.<br><br>
        <strong>Food Log:</strong> Track meals with protein, carbs, and fats. Auto-calculates calories. Proper nutrition fuels your progression.<br><br>
        <span class="tut-tip">💡 Tip: Higher intensity = more XP and calories burned. Push yourself.</span>`
    },
    {
        id: 'boss',
        icon: '☠',
        title: 'Weekly Boss Raid',
        content: `Every week, a boss appears matched to your rank. Boss HP scales with your level.<br><br>
        <strong>How to deal damage:</strong> Log workouts! Every workout automatically damages the boss based on calories burned and XP earned.<br><br>
        <strong>Defeat rewards:</strong> Massive XP, Gold, and +1 Shadow Soldier.<br><br>
        Bosses rotate weekly from a pool of 3-5 per rank, each with unique SVG art. Higher rank = deadlier bosses = bigger rewards.`
    },
    {
        id: 'shadows',
        icon: '☬',
        title: 'Shadow Missions & Army',
        content: `<strong>Shadow Missions:</strong> Random emergency quests that pop up while you're using the app. Quick burst challenges (push-ups, planks, burpees) with a countdown timer. Complete them for bonus XP — fail and you lose XP.<br><br>
        <strong>Shadow Army:</strong> Earn shadow soldiers by:<br>
        • Defeating weekly bosses (+1 soldier)<br>
        • Completing 3 shadow missions (+1 soldier)<br>
        • Day 7 login streak bonus (+1 soldier)<br><br>
        Your army grows with ranks: First Shadow → Shadow Unit → Shadow Squad → Shadow Company → Shadow Battalion → Monarch's Legion.`
    },
    {
        id: 'shop',
        icon: '⬟',
        title: 'Hunter\'s Armory (Shop)',
        content: `Spend Gold to buy items across 4 categories:<br><br>
        <strong>⚔ Weapons:</strong> Equippable weapons with stat bonuses. Each rank tier has unique blades and artifacts.<br>
        <strong>🧪 Potions:</strong> One-time use boosts — XP potions, streak shields, gold doublers.<br>
        <strong>💍 Relics:</strong> Permanent passive bonuses to stat growth.<br>
        <strong>📜 Scrolls:</strong> Rare knowledge items with unique effects.<br><br>
        <span class="tut-tip">💡 Tip: Equip a weapon from your inventory for bonus stats shown on your Status panel.</span>`
    },
    {
        id: 'skills',
        icon: '◇',
        title: 'Skills & Achievements',
        content: `<strong>Skills:</strong> Passive and active abilities that unlock at certain levels. They boost stat growth rates. Check the Skills tab to see what you've unlocked and what's coming next.<br><br>
        <strong>Achievements:</strong> Milestone rewards for hitting targets like "10 workouts", "7-day streak", "10,000 calories burned". Track your collection and aim for 100% completion.<br><br>
        <strong>Skill Tree:</strong> Earn 1 skill point every 5 levels. Choose between 3 branches — Strength, Endurance, or Shadow — to customize your build with permanent bonuses.`
    },
    {
        id: 'skilltree',
        icon: '🌳',
        title: 'Skill Tree Branches',
        content: `The Skill Tree has <strong>3 branching paths</strong>, each with 5 tiers:<br><br>
        <strong style="color:#ff4444">⚔ Path of Destruction</strong> — Raw STR power and boss damage<br>
        <strong style="color:#44ff44">◉ Path of Resilience</strong> — END/VIT growth and decay protection<br>
        <strong style="color:#aa44ff">☬ Path of Shadows</strong> — WIL, gold bonuses, and shadow army growth<br><br>
        Each node costs 1-3 SP and requires the previous node in the branch. Plan your build wisely — every point matters.`
    },
    {
        id: 'analysis',
        icon: '△',
        title: 'Analysis & Calendar',
        content: `The <strong>Analysis Tab</strong> tracks your journey with:<br><br>
        <strong>Dungeon Calendar:</strong> A GitHub-style heatmap showing daily activity over the entire year. Brighter squares = more XP that day.<br><br>
        <strong>Charts:</strong> 7-day XP progress, calorie tracking, and macro breakdown (protein/carbs/fats).<br><br>
        <strong>Lifetime Records:</strong> Total workouts, calories, quests, days active, shadow missions, and bosses slain — your hunter resume.`
    },
    {
        id: 'cloud',
        icon: '☁',
        title: 'Cloud Save & Sync',
        content: `Sign in with <strong>Google</strong> to sync your progress across devices. Your data is saved to Firebase Firestore and auto-syncs whenever you make changes.<br><br>
        <strong>Guest mode</strong> saves locally only (localStorage). You can link a Google account later to upgrade.<br><br>
        <span class="tut-tip">💡 Tip: Use Export/Import in the Analysis tab for manual backups. Never lose your grind.</span>`
    },
    {
        id: 'tips',
        icon: '🗡',
        title: 'Pro Hunter Tips',
        content: `<strong>Maximize your progression:</strong><br><br>
        1. <strong>Never break your streak.</strong> Consistency is the #1 factor. Even a light workout counts.<br>
        2. <strong>Clear all 5 daily gates.</strong> The bonus XP for full completion stacks up fast.<br>
        3. <strong>Log food regularly.</strong> Nutrition quests give free XP and discipline growth.<br>
        4. <strong>Fight the weekly boss.</strong> Boss kills give massive rewards + shadow soldiers.<br>
        5. <strong>Accept shadow missions.</strong> They're free XP bursts disguised as quick challenges.<br>
        6. <strong>Invest skill points wisely.</strong> Pick a branch that matches your training style.<br>
        7. <strong>Check the shop often.</strong> Relics give permanent growth bonuses.<br>
        8. <strong>High intensity = more XP.</strong> Push harder when you can, rest when you must.<br><br>
        <span class="tut-highlight">"Arise. The System is watching."</span>`
    }
];

let tutorialExpanded = {};

function renderTutorial() {
    const container = document.getElementById('tutorialContent');
    if (!container) return;

    let html = `<div class="tut-header">
        <div class="tut-header-icon">📖</div>
        <h2 class="tut-header-title">HUNTER'S GUIDE</h2>
        <p class="tut-header-sub">Everything you need to know about the System</p>
    </div>`;

    html += '<div class="tut-sections">';

    for (let i = 0; i < TUTORIAL_SECTIONS.length; i++) {
        const sec = TUTORIAL_SECTIONS[i];
        const isOpen = tutorialExpanded[sec.id] || false;

        html += `<div class="tut-section ${isOpen ? 'open' : ''}" data-section="${sec.id}">
            <div class="tut-section-header" onclick="toggleTutSection('${sec.id}')">
                <div class="tut-section-num">${String(i + 1).padStart(2, '0')}</div>
                <div class="tut-section-icon">${sec.icon}</div>
                <div class="tut-section-title">${sec.title}</div>
                <div class="tut-section-arrow">${isOpen ? '▾' : '▸'}</div>
            </div>
            <div class="tut-section-body" style="${isOpen ? '' : 'display:none'}">
                ${sec.content}
            </div>
        </div>`;
    }

    html += '</div>';

    // Quick Start
    html += `<div class="tut-quickstart">
        <div class="tut-qs-title">⚡ QUICK START</div>
        <div class="tut-qs-steps">
            <div class="tut-qs-step"><span class="tut-qs-num">1</span> Go to <strong>Log Tab</strong> → Report a workout</div>
            <div class="tut-qs-step"><span class="tut-qs-num">2</span> Check <strong>Daily Gate</strong> → Clear your quests</div>
            <div class="tut-qs-step"><span class="tut-qs-num">3</span> Level up → Distribute stat points</div>
            <div class="tut-qs-step"><span class="tut-qs-num">4</span> Come back tomorrow → Build your streak</div>
        </div>
    </div>`;

    container.innerHTML = html;
}

function toggleTutSection(id) {
    tutorialExpanded[id] = !tutorialExpanded[id];
    renderTutorial();
}

function initTutorial() {
    // Start with welcome open
    tutorialExpanded['welcome'] = true;
}
