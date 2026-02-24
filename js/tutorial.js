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
        content: `Every day, the System generates <strong>8 daily quests</strong> tailored to your rank:<br><br>
        • <strong>Workout quests</strong> — Strength and lifting challenges<br>
        • <strong>Cardio quests</strong> — Running, HIIT, endurance<br>
        • <strong>Nutrition quests</strong> — Protein and meal tracking<br>
        • <strong>Discipline quests</strong> — Sleep, hydration, cold showers<br>
        • <strong>Mobility quests</strong> — Stretching, yoga, foam rolling, recovery<br>
        • <strong>Mental quests</strong> — Meditation, journaling, visualization<br>
        • <strong>Shadow Challenge</strong> — Special themed combat challenges<br>
        • <strong>Bonus quests</strong> — Extra challenges for big rewards<br><br>
        <span class="tut-highlight">Clear all 8 gates to earn bonus XP and Gold!</span><br><br>
        ⚠ <strong>Penalty System:</strong> If you skip a day entirely, you'll receive stat decay — the System punishes laziness. Maintain your streak to avoid degradation.`
    },
    {
        id: 'logging',
        icon: '⬢',
        title: 'Workout & Food Logging',
        content: `The <strong>Log Tab</strong> is where you report your training:<br><br>
        <strong>Workout Log:</strong> Choose from <strong>75+ exercises</strong> across 8 muscle groups — Chest, Back, Shoulders, Arms, Legs, Core, Cardio, and Full Body. Use the <strong>muscle group filter pills</strong> to narrow the dropdown quickly. Cardio exercises (marked with ⏱) use duration in minutes; others use reps.<br><br>
        <strong>Food Log:</strong> Start typing a food name and the <strong>smart autocomplete</strong> will suggest matching items from a database of 80+ common foods (chicken, rice, eggs, dal, biryani, protein shakes, etc.). Select one and the System auto-fills protein, carbs, and fats for you.<br><br>
        <strong>Servings:</strong> Adjust the servings multiplier (0.5×, 1×, 2× etc.) and all macros scale automatically. You can always override the values manually.<br><br>
        <span class="tut-tip">💡 Tip: Higher intensity = more XP and calories burned. Push yourself.</span>`
    },
    {
        id: 'energy',
        icon: '⚖',
        title: 'Energy Balance (Intake vs Output)',
        content: `Below the food log, the <strong>Energy Balance</strong> panel tracks the collision between what you eat and what you burn — in real time:<br><br>
        <strong>🍖 Intake:</strong> Total calories consumed today (from all food logs).<br>
        <strong>🔥 Output:</strong> Calories burned from workouts + your estimated BMR (Basal Metabolic Rate, auto-calculated from your body weight in the Physique Tracker).<br><br>
        <strong>The Verdict:</strong><br>
        • <span style="color:var(--green)">SURPLUS</span> — Eating more than burning. Good for muscle building / bulking.<br>
        • <span style="color:var(--red)">DEFICIT</span> — Burning more than eating. Good for fat loss / cutting.<br>
        • <span style="color:var(--blue)">MAINTENANCE</span> — Roughly balanced. Good for body recomposition.<br><br>
        <span class="tut-tip">💡 Tip: Set your body weight in the Physique Tracker (Status tab) for accurate BMR. The output adjusts proportionally throughout the day.</span>`
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
        <strong>Achievements:</strong> Milestone rewards for hitting targets like "10 workouts", "7-day streak", "10,000 calories burned". Track your collection and aim for 100% completion.`
    },
    {
        id: 'analysis',
        icon: '△',
        title: 'Analysis & Calendar',
        content: `The <strong>Analysis Tab</strong> tracks your journey with:<br><br>
        <strong>Dungeon Calendar:</strong> A GitHub-style heatmap showing daily activity over the entire year. Brighter squares = more XP that day.<br><br>
        <strong>Charts:</strong> 7-day XP progress, calorie tracking, and macro breakdown (protein/carbs/fats).<br><br>
        <strong>Lifetime Records:</strong> Total workouts, calories, quests, days active, shadow missions, and bosses slain — your hunter resume.<br><br>
        <span class="tut-tip">💡 For daily intake vs output analysis, check the Energy Balance panel in the Log tab.</span>`
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
        2. <strong>Clear all 8 daily gates.</strong> The bonus XP for full completion stacks up fast.<br>
        3. <strong>Log food regularly.</strong> Use the smart search — just type and pick. Track every meal.<br>
        4. <strong>Watch your energy balance.</strong> Bulking? Stay in surplus. Cutting? Stay in deficit.<br>
        5. <strong>Fight the weekly boss.</strong> Boss kills give massive rewards + shadow soldiers.<br>
        6. <strong>Accept shadow missions.</strong> They're free XP bursts disguised as quick challenges.<br>
        7. <strong>Check the shop often.</strong> Relics give permanent growth bonuses.<br>
        8. <strong>High intensity = more XP.</strong> Push harder when you can, rest when you must.<br>
        9. <strong>Set your weight.</strong> Physique Tracker gives accurate BMR for energy balance.<br><br>
        <span class="tut-highlight">"Arise. The System is watching."</span>`
    }
];

let tutorialExpanded = {};

function renderTutorial() {
    const container = document.getElementById('tutorialContent');
    if (!container) return;

    let html = `
        <div class="jn-header">
            <div class="jn-header-icon">📖</div>
            <div class="jn-header-title">HUNTER'S GUIDE</div>
            <div class="jn-header-sub">System Manual — Everything you need to survive</div>
            <div class="jn-progress">${TUTORIAL_SECTIONS.length} sections</div>
        </div>
    `;

    TUTORIAL_SECTIONS.forEach((sec, i) => {
        const isOpen = tutorialExpanded[sec.id] || false;
        html += `
            <div class="jn-chapter ${isOpen ? '' : ''}" data-section="${sec.id}">
                <div class="jn-chapter-header" onclick="toggleTutSection('${sec.id}')">
                    <div class="jn-ch-left">
                        <span class="jn-ch-icon">${sec.icon}</span>
                        <div class="jn-ch-info">
                            <span class="jn-ch-num">Section ${String(i + 1).padStart(2, '0')}</span>
                            <span class="jn-ch-title">${sec.title}</span>
                        </div>
                    </div>
                    <div class="jn-ch-right">
                        <span class="jn-ch-arrow">${isOpen ? '▾' : '▸'}</span>
                    </div>
                </div>
                <div class="jn-chapter-body ${isOpen ? 'open' : ''}" id="tutBody_${sec.id}">
                    ${sec.content}
                </div>
            </div>
        `;
    });

    // Quick Start
    html += `
        <div class="tut-quickstart">
            <div class="tut-qs-title">⚡ QUICK START</div>
            <div class="tut-qs-steps">
                <div class="tut-qs-step"><span class="tut-qs-num">1</span> Go to <strong>Log Tab</strong> → Report a workout</div>
                <div class="tut-qs-step"><span class="tut-qs-num">2</span> Log food → Type a name, pick from suggestions</div>
                <div class="tut-qs-step"><span class="tut-qs-num">3</span> Check <strong>Daily Gate</strong> → Clear your quests</div>
                <div class="tut-qs-step"><span class="tut-qs-num">4</span> Level up → Distribute stat points</div>
                <div class="tut-qs-step"><span class="tut-qs-num">5</span> Come back tomorrow → Build your streak</div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function toggleTutSection(id) {
    const body = document.getElementById(`tutBody_${id}`);
    const chapter = body?.closest('.jn-chapter');
    if (!body) return;

    const wasHidden = !body.classList.contains('open');

    // Close all other sections
    document.querySelectorAll('#tutorialContent .jn-chapter-body.open').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('#tutorialContent .jn-ch-arrow').forEach(a => a.textContent = '▸');

    // Toggle this one
    if (wasHidden) {
        body.classList.add('open');
        const arrow = chapter?.querySelector('.jn-ch-arrow');
        if (arrow) arrow.textContent = '▾';
        tutorialExpanded = {};
        tutorialExpanded[id] = true;
    } else {
        tutorialExpanded[id] = false;
    }

    if (typeof playSound === 'function') playSound('click');
}

function initTutorial() {
    tutorialExpanded['welcome'] = true;
}
