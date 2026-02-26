// ==========================================
//  TUTORIAL.JS — Interactive Guide System
//  v42: Fixed boot rendering, added Domain section
// ==========================================

const TUTORIAL_SECTIONS = [
    {
        id: 'welcome',
        icon: '◈',
        title: 'Welcome to the System',
        content: `You've awakened as a Hunter. This app is your <strong>System</strong> — a Solo Leveling themed gym &amp; life tracker that turns every day into an RPG battle.<br><br>
        <span class="tut-highlight">Everything you do earns XP, Gold, and stat growth.</span> Log workouts, track meals, complete 8 daily quests across body &amp; mind, defeat bosses, and watch yourself transform — both in the app and in real life.<br><br>
        The <strong>System is alive.</strong> It watches your behavior, reacts to your patterns, and speaks to you through the System Voice panel. It knows when you're slacking, celebrates your streaks, and evolves its personality as you rank up.`
    },
    {
        id: 'status',
        icon: '⚔',
        title: 'Status Window & Stats',
        content: `Your <strong>Status Tab</strong> shows your hunter profile with 6 combat stats:<br><br>
        <div class="tut-stats-grid">
            <span><strong>STR</strong> — Strength (lifting, pushing, pulling)</span>
            <span><strong>AGI</strong> — Agility (speed, cardio, HIIT)</span>
            <span><strong>VIT</strong> — Vitality (recovery, sleep, resilience)</span>
            <span><strong>END</strong> — Endurance (sustained effort, stamina)</span>
            <span><strong>WIL</strong> — Willpower (discipline, mental toughness)</span>
            <span><strong>PHS</strong> — Physique (overall body composition)</span>
        </div><br>
        Every level-up gives <strong>+1 to all stats automatically</strong> plus <strong>free stat points</strong> to distribute where you choose. Higher ranks = more free points per level:<br><br>
        E/D: 3 pts &middot; C/B: 4 pts &middot; A/S: 5 pts &middot; X: 7 pts<br><br>
        <span class="tut-tip">💡 Don't neglect any stat — the System will call you out if one falls too far behind.</span>`
    },
    {
        id: 'ranks',
        icon: '🏅',
        title: 'Rank System & Timeline',
        content: `As you level up, you ascend through hunter ranks. Each rank maps to a <strong>real-world transformation timeline</strong>:<br><br>
        <div class="tut-rank-list">
            <span class="tut-rank rank-e">E-Rank</span> Lv 1–10 &middot; ~1 week &middot; Complete beginner<br>
            <span class="tut-rank rank-d">D-Rank</span> Lv 11–30 &middot; ~1 month &middot; Building habits<br>
            <span class="tut-rank rank-c">C-Rank</span> Lv 31–60 &middot; ~2.5 months &middot; Visible changes<br>
            <span class="tut-rank rank-b">B-Rank</span> Lv 61–100 &middot; ~5 months &middot; Clearly fit<br>
            <span class="tut-rank rank-a">A-Rank</span> Lv 101–200 &middot; ~1.3 years &middot; <strong>Shredded, athletic</strong><br>
            <span class="tut-rank rank-s">S-Rank</span> Lv 201–350 &middot; ~3 years &middot; <strong>Elite physique (top 1%)</strong><br>
            <span class="tut-rank rank-x">X-Rank</span> Lv 351+ &middot; ~3+ years &middot; <strong>National Level (top 0.1%)</strong><br>
        </div><br>
        Each rank unlocks new skills, tougher bosses, harder quests, better shop items, exclusive titles, and your <strong>avatar visually evolves</strong> — gaining aura rings, energy veins, glowing eyes, lightning arcs, and more.<br><br>
        <span class="tut-highlight">If you honestly follow all 8 daily quests to S-Rank, you WILL have an elite physique. That's just biology.</span>`
    },
    {
        id: 'quests',
        icon: '⬡',
        title: 'Daily Gate — 8-Pillar Quest System',
        content: `Every day, the System generates <strong>8 daily quests</strong> across two domains — 4 GYM pillars and 4 LIFE pillars. This is a <strong>complete transformation program</strong>:<br><br>
        <div class="tut-stats-grid">
            <span>💪 <strong>STRENGTH</strong> — Progressive overload, muscle building</span>
            <span>🔥 <strong>ENDURANCE</strong> — Cardio, HIIT, fat burning</span>
            <span>⚡ <strong>CHALLENGE</strong> — Intense physical tests, circuits</span>
            <span>💧 <strong>RECOVERY</strong> — Sleep, stretching, hydration, mobility</span>
            <span>🍎 <strong>NUTRITION</strong> — Meal tracking, protein targets, clean eating</span>
            <span>🧠 <strong>MINDSET</strong> — Knowledge, goals, visualization, journaling</span>
            <span>🧘 <strong>WELLNESS</strong> — Meditation, gratitude, stress management</span>
            <span>🔒 <strong>DISCIPLINE</strong> — Early rising, cold showers, habits</span>
        </div><br>
        <strong>Smart auto-completion:</strong> Strength, Endurance, Nutrition, and Challenge quests auto-clear when you log matching workouts or meals. Recovery, Mindset, Wellness, and Discipline require a manual click (honor system — these are real-world actions).<br><br>
        <strong>Muscle intelligence:</strong> The System tracks which muscle groups you've trained this week and targets your <strong>least-trained groups</strong>, ensuring balanced development.<br><br>
        <span class="tut-highlight">Clear all 8 gates for a massive bonus XP &amp; Gold reward! The System acknowledges perfection.</span><br><br>
        ⚠ <strong>Penalty:</strong> Skip a day entirely and you'll receive stat decay. The System punishes laziness.`
    },
    {
        id: 'narrator',
        icon: '🧠',
        title: 'The Living System (Narrator)',
        content: `The System is not a robot. It's <strong>alive</strong>.<br><br>
        The <strong>System Voice</strong> panel on your Status tab displays contextual messages that cycle every 18 seconds. The System reacts to:<br><br>
        &bull; <strong>Time of day</strong> — Different greetings for 4 AM warriors vs. evening trainers<br>
        &bull; <strong>Login streaks</strong> — Milestone messages at 3, 7, 14, 21, 30, 60, 100, 365 days<br>
        &bull; <strong>Comeback after absence</strong> — Ranges from "Good, you returned" to "The System nearly forgot you"<br>
        &bull; <strong>Quest progress</strong> — Knows how many gates you've cleared today<br>
        &bull; <strong>Pillar neglect</strong> — Warns if any pillar hasn't been cleared in 3+ days<br>
        &bull; <strong>Stat imbalance</strong> — Calls out your weakest stat<br>
        &bull; <strong>GYM vs LIFE balance</strong> — Notices if you train body but neglect mind (or vice versa)<br>
        &bull; <strong>Body fat %</strong> — Comments on your composition progress<br><br>
        <strong>Rank-based personality:</strong><br>
        &bull; E-Rank: Blunt mentor — <em>"You are weak. But weakness is not permanent."</em><br>
        &bull; B-Rank: Impressed — <em>"People ask what you're doing differently. The answer is everything."</em><br>
        &bull; S-Rank: Reverent — <em>"The System bows. Not out of protocol. Out of respect."</em><br>
        &bull; X-Rank: Legendary — <em>"Even the System wonders what you'll become next."</em><br><br>
        <span class="tut-tip">💡 The System also reacts when you clear quests, log workouts, log food, and level up — with category-specific commentary.</span>`
    },
    {
        id: 'logging',
        icon: '⬢',
        title: 'Workout & Food Logging',
        content: `The <strong>Log Tab</strong> is where you report your training and nutrition:<br><br>
        <strong>Workout Log:</strong><br>
        &bull; Choose from <strong>75+ exercises</strong> across 8 muscle groups — Chest, Back, Shoulders, Arms, Legs, Core, Cardio, and Full Body<br>
        &bull; Use the <strong>muscle group filter pills</strong> to narrow the dropdown quickly<br>
        &bull; Cardio exercises (marked with ⏱) use duration in minutes; others use reps x sets x weight<br>
        &bull; Higher intensity = more XP + more calories burned<br>
        &bull; Every workout deals <strong>damage to the weekly boss</strong><br><br>
        <strong>Workout Templates:</strong> Save your favorite workout routines as templates for quick logging. Create Push/Pull/Legs splits or custom programs.<br><br>
        <strong>Food Log:</strong><br>
        &bull; Start typing and the <strong>smart autocomplete</strong> suggests from 80+ foods (chicken, rice, eggs, dal, biryani, protein shakes, etc.)<br>
        &bull; Auto-fills protein, carbs, and fats<br>
        &bull; Adjust servings (0.5x, 1x, 2x) — all macros scale automatically<br>
        &bull; Override any value manually<br><br>
        <span class="tut-tip">💡 Logging workouts + food auto-completes matching quests. Log consistently and gates clear themselves!</span>`
    },
    {
        id: 'energy',
        icon: '⚖',
        title: 'Energy Balance (Intake vs Output)',
        content: `The <strong>Energy Balance</strong> panel tracks the collision between what you eat and what you burn — updated in real time:<br><br>
        <strong>🍖 Intake:</strong> Total calories consumed today (sum of all food logs)<br>
        <strong>🔥 Output:</strong> Calories burned from workouts + your estimated BMR (auto-calculated from body weight)<br><br>
        <strong>The Verdict:</strong><br>
        &bull; <span style="color:var(--green)">SURPLUS</span> — Eating more than burning: muscle building / bulking<br>
        &bull; <span style="color:var(--red)">DEFICIT</span> — Burning more than eating: fat loss / cutting<br>
        &bull; <span style="color:var(--blue)">MAINTENANCE</span> — Roughly balanced: body recomposition<br><br>
        <strong>Live TDEE:</strong> Your Total Daily Energy Expenditure is calculated using the Mifflin-St Jeor equation with an activity multiplier based on your actual logged workouts today.<br><br>
        <span class="tut-tip">💡 Set your weight, height, age, and gender in Body Analysis (Status tab) for accurate BMR/TDEE calculations.</span>`
    },
    {
        id: 'body',
        icon: '📐',
        title: 'Body Analysis',
        content: `The <strong>Body Analysis</strong> panel on the Status tab tracks your physical transformation:<br><br>
        <strong>Weight Tracking:</strong> Set current weight + target weight. The System tracks your progress over time.<br><br>
        <strong>Body Fat % (U.S. Navy Method):</strong> Enter neck, waist (and hip for females) measurements. The System calculates your body fat percentage and categorizes it (Essential to Obese).<br><br>
        <strong>BMR &amp; TDEE:</strong> Automatically calculated from your weight, height, age, and gender using the Mifflin-St Jeor equation. This powers the Energy Balance panel.<br><br>
        <strong>Progress History:</strong> Every save creates a historical entry so you can track your body composition changes over weeks and months.<br><br>
        <span class="tut-tip">💡 Update your body analysis at least weekly. Watching the numbers change is one of the most motivating parts of the journey.</span>`
    },
    {
        id: 'boss',
        icon: '☠',
        title: 'Weekly Boss Raid',
        content: `Every week, a boss appears matched to your rank. Boss HP scales with your level.<br><br>
        <strong>Boss Pool:</strong> <strong>123 unique bosses</strong> across all ranks — from Goblin Scouts and Slime Brutes at E-rank to Frost Dragons, Plague Archons, and Void Behemoths at X-rank. Each with unique SVG art and themed abilities.<br><br>
        <strong>How to deal damage:</strong> Log workouts! Every workout automatically damages the boss based on calories burned and XP earned.<br><br>
        <strong>Defeat rewards:</strong> Massive XP, Gold, and +1 Shadow Soldier to your army.<br><br>
        <strong>Stale boss protection:</strong> If a boss is too easy or too hard (spawned at the wrong level), it automatically refreshes.<br><br>
        <span class="tut-tip">💡 Higher intensity workouts deal more boss damage. Go all-out on boss week!</span>`
    },
    {
        id: 'shadows',
        icon: '\u2620',
        title: 'Shadow Soldiers & Extraction',
        content: `<strong>Named Shadow Soldiers:</strong> Just like Sung Jinwoo, you extract powerful named shadows by reaching milestones. 15 unique soldiers from Iron to Ashborn's Will.<br><br>
        <strong>How to extract:</strong><br>
        &bull; Reach level milestones (Lv 5, 15, 30, 50, 70, 100, 150)<br>
        &bull; Defeat bosses (5, 15, 30 kills)<br>
        &bull; Clear quests (100 total)<br>
        &bull; Build streaks (14, 60 days)<br>
        &bull; Complete shadow missions (5 total)<br>
        &bull; Log workouts (10 total)<br><br>
        <strong>Passive Bonuses:</strong> Each shadow gives permanent buffs — XP%, Gold%, or Boss DMG%. All bonuses stack!<br><br>
        <strong>Key Shadows:</strong><br>
        &bull; <strong>Iron</strong> (E-Rank) — Shadow Knight, first shadow at Lv 5<br>
        &bull; <strong>Igris</strong> (C-Rank) — Blood-Red Knight at Lv 30, All +5%<br>
        &bull; <strong>Beru</strong> (A-Rank) — Ant King at 30 boss kills, Boss DMG +15%<br>
        &bull; <strong>Kaisel</strong> (A-Rank) — Shadow Dragon at Lv 70, All +8%<br>
        &bull; <strong>Bellion</strong> (S-Rank) — Grand Marshal at Lv 100, All +12%<br>
        &bull; <strong>Ashborn's Will</strong> (X-Rank) — Shadow Monarch Fragment at Lv 150, All +20%<br><br>
        <strong>Shadow Missions:</strong> Random emergency quests pop up while training. Complete them for XP/Gold and shadow mission milestones.<br><br>
        <span class="tut-tip">\uD83D\uDCA1 "ARISE!" — When you hit a milestone, the extraction animation fires. Collect all 15 shadows to become the true Shadow Monarch.</span>`
    },
    {
        id: 'shop',
        icon: '⬟',
        title: "Hunter's Armory (Shop)",
        content: `Spend Gold to buy items across 4 categories:<br><br>
        <strong>⚔ Weapons:</strong> Equippable weapons with stat bonuses and XP multipliers. Each rank tier has unique blades, axes, spears, and legendary artifacts. Equip from your inventory.<br><br>
        <strong>🧪 Potions:</strong> One-time use boosts — XP potions (2x XP for 1 hour), streak shields (protect your streak from a missed day), gold doublers, stat boosters.<br><br>
        <strong>💍 Relics:</strong> Permanent passive bonuses — increased stat growth, gold earn rates, XP multipliers. These stack and persist forever.<br><br>
        <strong>📜 Scrolls:</strong> Rare knowledge items with unique effects.<br><br>
        <strong>Anti-exploit:</strong> Daily purchase limits prevent farming. Timed boosts have real cooldowns.<br><br>
        <span class="tut-tip">💡 Invest in Relics early — their permanent bonuses compound over time. A 5% XP relic at level 10 saves you weeks by level 200.</span>`
    },
    {
        id: 'skills',
        icon: '◇',
        title: 'Skills & Achievements',
        content: `<strong>Skills:</strong> Passive and active abilities that unlock at certain levels. They provide stat growth rate bonuses and special effects. Check the Skills tab to see what you've unlocked and what's coming next.<br><br>
        <strong>Achievements:</strong> Milestone rewards for hitting targets:<br>
        &bull; Workout milestones (10, 50, 100, 500 workouts)<br>
        &bull; Streak milestones (7, 14, 30, 60, 100 days)<br>
        &bull; Calorie milestones (10K, 50K, 100K burned)<br>
        &bull; Quest milestones (50, 100, 500 quests cleared)<br>
        &bull; Boss kills, shadow army size, rank achievements<br><br>
        <span class="tut-tip">💡 Achievements grant bonus XP and Gold. Check your collection and hunt for 100% completion!</span>`
    },
    {
        id: 'analysis',
        icon: '△',
        title: 'Analysis & Calendar',
        content: `The <strong>Analysis Tab</strong> tracks your journey with data:<br><br>
        <strong>Dungeon Calendar:</strong> A GitHub-style heatmap showing daily activity over the entire year. Brighter squares = more XP earned that day. Hover to see details.<br><br>
        <strong>Charts:</strong><br>
        &bull; 7-day XP progress line chart<br>
        &bull; Calorie intake vs. output tracking<br>
        &bull; Macro breakdown (protein / carbs / fats) pie chart<br><br>
        <strong>Lifetime Records:</strong> Total workouts, calories burned, quests completed, days active, shadow missions, bosses slain, food entries — your complete hunter resume.<br><br>
        <span class="tut-tip">💡 Use the Export/Import buttons for manual backups. Never lose your grind.</span>`
    },
    {
        id: 'journal',
        icon: '📖',
        title: "Hunter's Journal",
        content: `The <strong>Journal Tab</strong> is your personal training diary:<br><br>
        &bull; Write daily reflections, training notes, and progress updates<br>
        &bull; Entries are timestamped and saved permanently<br>
        &bull; Review past entries to track your mental journey alongside physical progress<br>
        &bull; Unread entries show a badge on the Journal tab<br><br>
        <span class="tut-tip">💡 The Mindset quest pillar sometimes asks you to journal — use this tab for that! Writing about your journey reinforces discipline.</span>`
    },
    {
        id: 'avatar',
        icon: '👤',
        title: 'Rank Avatar Evolution',
        content: `Your avatar on the Status tab <strong>visually evolves</strong> as you rank up:<br><br>
        <strong>E-Rank:</strong> Basic silhouette, no special effects<br>
        <strong>D-Rank:</strong> Faint energy field, subtle aura<br>
        <strong>C-Rank:</strong> Green aura ring, energy veins appear<br>
        <strong>B-Rank:</strong> Purple aura, glowing eyes, deltoid caps, energy wisps rise from body<br>
        <strong>A-Rank:</strong> Gold aura, bright glowing eyes, hand energy circles, quad definitions<br>
        <strong>S-Rank:</strong> Crimson aura, lightning arcs, sparkle particles, crown appears, spinning dashed rings<br>
        <strong>X-Rank:</strong> Dark red/black aura, demon horns, dark mist, dark particles, maximum visual intensity<br><br>
        <span class="tut-highlight">The avatar is a visual representation of your real transformation. Watch it evolve as you do.</span>`
    },
    {
        id: 'cloud',
        icon: '☁',
        title: 'Cloud Save & Notifications',
        content: `<strong>Cloud Sync:</strong> Sign in with <strong>Google</strong> to sync your progress across devices. Data is saved to Firebase Firestore and auto-syncs whenever you make changes.<br><br>
        <strong>Guest mode</strong> saves locally only (localStorage). Link a Google account anytime to upgrade without losing progress.<br><br>
        <strong>PWA Install:</strong> Add to your home screen for a full-screen app experience with offline support.<br><br>
        <strong>Training Reminders:</strong> Enable push notifications to get daily training reminders at your chosen time. The System will nudge you with a random wisdom quote if you haven't trained.<br><br>
        <span class="tut-tip">💡 Cloud save is automatic — no manual saves needed. Your grind is always protected.</span>`
    },
    {
        id: 'domain',
        icon: '🌌',
        title: "Hunter's Domain (Status Background)",
        content: `The Status tab background is a <strong>living environment</strong> called the <strong>Hunter's Domain</strong>. It evolves as you rank up — from a dim dungeon to the Shadow Sovereign's dimension.<br><br>
        <strong>Rank Environments:</strong><br>
        <div class="tut-rank-list">
            <span class="tut-rank rank-e">E-Rank</span> Dark cavern — dim gray particles, faint fog<br>
            <span class="tut-rank rank-d">D-Rank</span> Green dungeon — bioluminescent orbs<br>
            <span class="tut-rank rank-c">C-Rank</span> Crystal cavern — blue energy sweeps<br>
            <span class="tut-rank rank-b">B-Rank</span> Shadow realm — purple mist, energy pillars<br>
            <span class="tut-rank rank-a">A-Rank</span> Monarch's domain — golden aura, rune circle<br>
            <span class="tut-rank rank-s">S-Rank</span> Sovereign throne — gold &amp; cyan, dual rune rings<br>
            <span class="tut-rank rank-x">X-Rank</span> Shadow dimension — red/black chaos, 3 rune circles<br>
        </div><br>
        <strong>Animated effects:</strong> Floating particles drift left→right, energy lines sweep across the screen, ground fog pulses, energy pillars breathe upward, and rotating rune circles appear at higher ranks. Everything intensifies as you progress.<br><br>
        <span class="tut-tip">💡 The domain is your realm. It reflects your power. Train harder and watch it transform with you.</span>`
    },
    {
        id: 'tips',
        icon: '🗡',
        title: 'Pro Hunter Tips',
        content: `<strong>Maximize your progression:</strong><br><br>
        1. <strong>Never break your streak.</strong> Consistency beats intensity. The System rewards daily discipline above all.<br>
        2. <strong>Clear all 8 daily gates.</strong> The bonus XP for full completion stacks up massively over weeks.<br>
        3. <strong>Honor ALL pillars.</strong> Don't just lift — meditate, eat clean, sleep well, build discipline. The 8-pillar system is designed so that by A-rank, you're truly transformed.<br>
        4. <strong>Log food accurately.</strong> Use the smart search — type and pick. 70% of body transformation is nutrition.<br>
        5. <strong>Watch your energy balance.</strong> Bulking? Stay in surplus. Cutting? Stay in deficit. Know your TDEE.<br>
        6. <strong>Fight the weekly boss.</strong> Boss kills give massive rewards + shadow soldiers.<br>
        7. <strong>Accept shadow missions.</strong> They're free XP bursts — always say yes.<br>
        8. <strong>Invest in Relics.</strong> Permanent growth bonuses compound over time.<br>
        9. <strong>High intensity = more XP.</strong> Push harder when you can, rest when you must.<br>
        10. <strong>Trust the System.</strong> It knows when you're slacking, celebrates when you're grinding, and evolves as you do. Listen to it.<br><br>
        <span class="tut-highlight">"Arise. The System is watching. The System is alive."</span>`
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
            <div class="jn-header-sub">System Manual v42 — Complete reference for your transformation</div>
            <div class="jn-progress">${TUTORIAL_SECTIONS.length} sections</div>
        </div>
    `;

    TUTORIAL_SECTIONS.forEach((sec, i) => {
        const isOpen = tutorialExpanded[sec.id] || false;
        html += `
            <div class="jn-chapter" data-section="${sec.id}">
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
                <div class="tut-qs-step"><span class="tut-qs-num">1</span> Go to <strong>Log Tab</strong> and report a workout</div>
                <div class="tut-qs-step"><span class="tut-qs-num">2</span> Log food — type a name, pick from suggestions</div>
                <div class="tut-qs-step"><span class="tut-qs-num">3</span> Check <strong>Daily Gate</strong> and clear your 8 quests</div>
                <div class="tut-qs-step"><span class="tut-qs-num">4</span> Level up and distribute stat points</div>
                <div class="tut-qs-step"><span class="tut-qs-num">5</span> Read the <strong>System Voice</strong> — it's talking to you</div>
                <div class="tut-qs-step"><span class="tut-qs-num">6</span> Come back tomorrow and build your streak</div>
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
    renderTutorial();
}
