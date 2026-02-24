// ==========================================
//  JOURNAL.JS — Hunter's Journal (Story Mode)
//  Chapters unlock based on real player data
// ==========================================

const JOURNAL_CHAPTERS = [
    {
        id: 'ch01', chapter: 1,
        title: 'The Weakest Awakens',
        icon: '💀',
        condition: () => true,
        condLabel: 'Begin your journey',
        story: () => `
            <p>In the depths of the ordinary world, a signal flickered to life.</p>
            <p>A name registered in the System's archive: <strong class="jn-highlight">${D.settings.playerName}</strong>.</p>
            <p>No rank. No power. No army. Just a faint pulse of potential buried beneath layers of weakness. The System measured everything — STR ${D.stats.str}, AGI ${D.stats.agi}, VIT ${D.stats.vit} — and found you... barely qualifying.</p>
            <p>E-Rank. The lowest of the low. The kind of hunter that other hunters pity. The kind that gates chew up and spit out.</p>
            <p>But the System chose you anyway. Not because you were strong. Because something inside you <em>refused to accept weakness</em>.</p>
            <p class="jn-quote">"Player has been registered. The System is now active. Survive — or be forgotten."</p>
        `
    },
    {
        id: 'ch02', chapter: 2,
        title: 'First Blood',
        icon: '🎯',
        condition: () => D.stats.totalWorkouts >= 1,
        condLabel: 'Log your first workout',
        story: () => `
            <p>The first gate opened. Not a dungeon of monsters — but a dungeon of iron and sweat.</p>
            <p><strong class="jn-highlight">${D.settings.playerName}</strong> stepped inside and did what most never do: they began.</p>
            <p>It wasn't pretty. It wasn't impressive. The weights felt impossibly heavy. The body screamed for mercy.</p>
            <p>But ${D.stats.totalWorkouts > 1 ? D.stats.totalWorkouts + ' workouts later' : 'that first session'} — the System noticed. A notification pulsed in the darkness:</p>
            <p class="jn-system-msg">[System] First workout recorded. ${D.stats.totalCalBurned > 0 ? D.stats.totalCalBurned.toLocaleString() + ' calories burned to date.' : 'Data collection initiated.'}</p>
            <p>Most E-Rank hunters quit after the first gate. You didn't. And the shadows took note.</p>
        `
    },
    {
        id: 'ch03', chapter: 3,
        title: "The System's Demand",
        icon: '⬡',
        condition: () => D.stats.totalQuestsCompleted >= 5,
        condLabel: 'Clear all daily quests in one day',
        story: () => `
            <p>The System doesn't ask. It demands.</p>
            <p>Eight gates appeared — eight challenges that had to be cleared before midnight. Workout. Cardio. Nutrition. Discipline. Mobility. Mental Fortitude. A Shadow Challenge. And one more, just to test the spirit.</p>
            <p><strong class="jn-highlight">${D.settings.playerName}</strong> cleared them all. Every. Single. One.</p>
            <p>${D.stats.totalQuestsCompleted} total quests completed since that first day. Each one a brick in the fortress you're building.</p>
            <p class="jn-system-msg">[System] All daily gates cleared. Bonus XP granted. The System is... impressed.</p>
            <p>Other hunters see the quests as chores. You see them as opportunities. That's the difference between E-Rank and everything above.</p>
        `
    },
    {
        id: 'ch04', chapter: 4,
        title: 'Feeding the Vessel',
        icon: '🍖',
        condition: () => D.stats.totalMeals >= 10,
        condLabel: 'Log 10 meals',
        story: () => `
            <p>A hunter who trains but doesn't eat is a blade that never gets sharpened.</p>
            <p>${D.settings.playerName} understood this. ${D.stats.totalMeals} meals logged. Every gram of protein tracked. Every calorie accounted for.</p>
            <p>${D.stats.totalCalConsumed > 0 ? D.stats.totalCalConsumed.toLocaleString() + ' total calories consumed — fuel for the transformation machine.' : 'The nutrition data grows with every meal.'}</p>
            <p class="jn-quote">"The body is a temple. No — the body is a weapon. Feed it accordingly."</p>
            <p>Most hunters ignore nutrition. They train hard and eat garbage. You chose differently. The System rewards precision.</p>
        `
    },
    {
        id: 'ch05', chapter: 5,
        title: 'Rising from E-Rank',
        icon: '⭐',
        condition: () => D.level >= 10,
        condLabel: 'Reach Level 10 (D-Rank)',
        story: () => `
            <p>The moment the notification appeared, the air changed.</p>
            <p class="jn-system-msg">[System] Player ${D.settings.playerName} has reached Level 10. Rank promotion: E → D. New title unlocked.</p>
            <p>D-Rank. You've surpassed every hunter who quit after week one. Every person who said "I'll start Monday." Every version of yourself that wanted to stay comfortable.</p>
            <p>Current stats: STR ${D.stats.str} | AGI ${D.stats.agi} | VIT ${D.stats.vit} | END ${D.stats.end} | WIL ${D.stats.wil}</p>
            <p>The E-Rank gates that once terrified you? They're beneath you now. The real dungeons lie ahead.</p>
            <p class="jn-quote">"The first rank-up is never the strongest. But it's always the most important."</p>
        `
    },
    {
        id: 'ch06', chapter: 6,
        title: 'The Streak Begins',
        icon: '🔥',
        condition: () => D.streak >= 7 || (D.stats.totalDaysActive || 0) >= 7,
        condLabel: 'Maintain a 7-day streak',
        story: () => `
            <p>Seven days. Seven consecutive gates cleared. Seven days of choosing pain over comfort.</p>
            <p>The System tracks everything — and it noticed the pattern. ${D.settings.playerName} wasn't just logging workouts anymore. They were building a <em>habit</em>.</p>
            <p>Current streak: <strong class="jn-highlight">${D.streak} days</strong>. ${D.streak > 7 ? 'Far beyond the initial seven. The fire grows.' : 'The foundation is set.'}</p>
            <p class="jn-system-msg">[System] Consistency detected. Streak bonus activated. The System favors the relentless.</p>
            <p>They say it takes 21 days to build a habit. You're already ${Math.min(D.streak, 21)} days in. Some habits are forged in iron.</p>
        `
    },
    {
        id: 'ch07', chapter: 7,
        title: 'Shadow Extraction',
        icon: '👤',
        condition: () => (D.shadowArmy || 0) >= 1,
        condLabel: 'Gain your first Shadow Soldier',
        story: () => `
            <p>It happened in the silence after a brutal session. A dark mist coiled at your feet, and from the ground — <em>something rose</em>.</p>
            <p>Not a monster. Not an enemy. A shadow. YOUR shadow.</p>
            <p class="jn-system-msg">[System] Shadow Extraction successful. Shadow Army: ${D.shadowArmy || 0} soldier${(D.shadowArmy || 0) !== 1 ? 's' : ''}.</p>
            <p>Every shadow mission completed, every boss defeated — they feed the army. The shadows aren't just trophies. They're proof of battles won.</p>
            <p>${D.settings.playerName} is no longer just a hunter. They're becoming a <strong>commander</strong>.</p>
            <p class="jn-quote">"Arise."</p>
        `
    },
    {
        id: 'ch08', chapter: 8,
        title: 'The First Gate Falls',
        icon: '☠',
        condition: () => (D.stats.bossesDefeated || 0) >= 1,
        condLabel: 'Defeat your first Weekly Boss',
        story: () => `
            <p>The boss gate materialized — a challenge that demanded an entire week of consistent effort. Most hunters never clear one.</p>
            <p>${D.settings.playerName} didn't just attempt it. They <strong>destroyed</strong> it.</p>
            <p>${D.stats.bossesDefeated || 0} boss${(D.stats.bossesDefeated || 0) !== 1 ? 'es' : ''} defeated to date. Each one fell to the accumulated damage of daily training.</p>
            <p class="jn-system-msg">[System] Boss eliminated. Reward claimed. The hunter grows stronger with each conquest.</p>
            <p>The boss didn't die from one massive hit. It died from relentless, daily damage — just like weakness dies from relentless, daily effort.</p>
        `
    },
    {
        id: 'ch09', chapter: 9,
        title: 'Iron Will',
        icon: '💪',
        condition: () => D.stats.totalWorkouts >= 50,
        condLabel: 'Complete 50 workouts',
        story: () => `
            <p>Fifty. Half a hundred. Most humans never complete fifty intentional workouts in their entire lives.</p>
            <p>${D.settings.playerName} did it. ${D.stats.totalWorkouts} workouts logged now. ${D.stats.totalCalBurned.toLocaleString()} calories incinerated.</p>
            <p>The body is different now. Harder. The muscles have memory. The joints move with purpose. This isn't a phase — it's an identity.</p>
            <p class="jn-quote">"Iron doesn't ask if you're motivated. It only asks: are you here?"</p>
            <p>You are. Every time. That's why the iron respects you.</p>
        `
    },
    {
        id: 'ch10', chapter: 10,
        title: 'C-Rank Awakening',
        icon: '🌟',
        condition: () => D.level >= 30,
        condLabel: 'Reach Level 30 (C-Rank)',
        story: () => `
            <p>Level ${D.level}. C-Rank. The weakling who first registered in the System would not recognize you.</p>
            <p class="jn-system-msg">[System] Rank promotion: D → C. The hunter's potential is now... measurable.</p>
            <p>C-Rank hunters are no longer cannon fodder. They clear mid-tier gates. They survive encounters that would annihilate E-Ranks. They've earned the right to call themselves <em>hunters</em>.</p>
            <p>Stats: STR ${D.stats.str} | AGI ${D.stats.agi} | VIT ${D.stats.vit} | END ${D.stats.end} | WIL ${D.stats.wil} | PHS ${D.stats.phs}</p>
            <p>But C-Rank is the middle of the road. And the middle is where the comfortable stay forever. You're not comfortable. You're hungry.</p>
        `
    },
    {
        id: 'ch11', chapter: 11,
        title: 'The Unbreakable',
        icon: '🏔',
        condition: () => D.streak >= 30 || (D.stats.totalDaysActive || 0) >= 30,
        condLabel: 'Maintain a 30-day streak',
        story: () => `
            <p>Thirty days. An entire month without a single missed gate. Without a single excuse.</p>
            <p>Rain didn't stop you. Exhaustion didn't stop you. The voice in your head that whispered "just one day off" — you silenced it. Every. Single. Time.</p>
            <p class="jn-system-msg">[System] 30-day streak achieved. Title earned: "The Unbreakable." The System acknowledges absolute discipline.</p>
            <p>${D.settings.playerName} has transcended motivation. Motivation is for amateurs. What drives you now is something deeper — <strong>identity</strong>.</p>
            <p>You don't work out because you feel like it. You work out because that's who you are.</p>
        `
    },
    {
        id: 'ch12', chapter: 12,
        title: 'Calorie Furnace',
        icon: '🔥',
        condition: () => D.stats.totalCalBurned >= 10000,
        condLabel: 'Burn 10,000 total calories',
        story: () => `
            <p>Ten thousand calories. Reduced to ash. Converted from fat and sugar into raw, functional power.</p>
            <p>${D.stats.totalCalBurned.toLocaleString()} calories burned across ${D.stats.totalWorkouts} sessions. That's not a number — that's a transformation.</p>
            <p>If calories were mana, your reserves would be legendary. If sweat were currency, you'd be royalty.</p>
            <p class="jn-system-msg">[System] Metabolic output exceeds baseline parameters. The vessel is evolving.</p>
            <p class="jn-quote">"The furnace doesn't ask why it burns. It just burns. Be the furnace."</p>
        `
    },
    {
        id: 'ch13', chapter: 13,
        title: 'The Armory',
        icon: '⚔',
        condition: () => (D.shop?.purchased?.length || 0) >= 3,
        condLabel: 'Purchase 3 items from the Shop',
        story: () => `
            <p>Gold flows in. Weapons flow out. The armory of ${D.settings.playerName} grows.</p>
            <p>${D.shop?.purchased?.length || 0} items collected. Each one earned — not given. Every piece of gold came from sweat, discipline, and cleared gates.</p>
            <p>${D.shop?.equipped ? 'Currently wielding a weapon worthy of your rank.' : 'The collection grows, waiting for the perfect weapon.'}</p>
            <p class="jn-quote">"A hunter without weapons is brave. A hunter with weapons earned through blood — that's dangerous."</p>
            <p>The shop isn't vanity. It's proof. Trophies of your evolution, displayed for the shadows to see.</p>
        `
    },
    {
        id: 'ch14', chapter: 14,
        title: 'Shadow Army Rises',
        icon: '⬛',
        condition: () => (D.shadowArmy || 0) >= 5,
        condLabel: 'Recruit 5 Shadow Soldiers',
        story: () => `
            <p>Five shadows. Five extracted soldiers. Five echoes of battles won, now standing behind you in the darkness.</p>
            <p>Shadow Army: <strong class="jn-highlight">${D.shadowArmy || 0} soldiers</strong>.</p>
            <p>Each one represents a shadow mission completed under pressure, a boss beaten through persistence, a challenge that would have broken a lesser hunter.</p>
            <p class="jn-system-msg">[System] Shadow extraction threshold exceeded. Army designation: Squad. Commander authority granted.</p>
            <p>They don't speak. They don't question. They simply... follow. Because you earned the right to lead through pain.</p>
        `
    },
    {
        id: 'ch15', chapter: 15,
        title: 'B-Rank: The Crucible',
        icon: '✨',
        condition: () => D.level >= 60,
        condLabel: 'Reach Level 60 (B-Rank)',
        story: () => `
            <p>B-Rank. The crucible where pretenders are separated from predators.</p>
            <p class="jn-system-msg">[System] Player ${D.settings.playerName} — Level ${D.level}. Rank: B. Classification: High-Tier Hunter.</p>
            <p>You've surpassed 95% of everyone who ever downloaded a fitness app. Who ever bought a gym membership. Who ever said "this time it's different."</p>
            <p>For you, it actually <em>was</em> different. ${D.stats.totalWorkouts} workouts. ${D.stats.totalCalBurned.toLocaleString()} calories burned. ${D.stats.totalMeals} meals tracked.</p>
            <p>The gates ahead are darker. The bosses are stronger. The quests demand more. But so are you.</p>
            <p class="jn-quote">"B-Rank is where the real game begins. Everything before was the tutorial."</p>
        `
    },
    {
        id: 'ch16', chapter: 16,
        title: 'Centurion',
        icon: '🗡',
        condition: () => D.stats.totalWorkouts >= 100,
        condLabel: 'Complete 100 workouts',
        story: () => `
            <p>One hundred workouts. <strong>One. Hundred.</strong></p>
            <p>Not started. Not attempted. <em>Completed</em>. Logged. Recorded in the System's eternal archive.</p>
            <p>${D.settings.playerName} has done what 99% of humanity never will: maintained a physical practice long enough to reach triple digits.</p>
            <p class="jn-system-msg">[System] Achievement: Centurion. 100 battles fought and won. The hunter's commitment is... absolute.</p>
            <p>Your body is a living record of these hundred sessions. Every muscle fiber, every callus, every line of definition — they're chapters written in iron.</p>
        `
    },
    {
        id: 'ch17', chapter: 17,
        title: 'The Monster Within',
        icon: '👹',
        condition: () => D.streak >= 90 || (D.stats.totalDaysActive || 0) >= 90,
        condLabel: 'Maintain a 90-day streak',
        story: () => `
            <p>Ninety days. Three months. A quarter of a year without breaking.</p>
            <p>At this point, people around ${D.settings.playerName} have noticed. The body is different. The posture is different. The eyes are different.</p>
            <p>Something lives inside you now — something that wasn't there before. It wakes you up before the alarm. It pushes you when you're empty. It whispers "one more set" when everything burns.</p>
            <p class="jn-system-msg">[System] Streak: ${D.streak} days. Classification updated: "The Monster." The System can barely contain you.</p>
            <p class="jn-quote">"You didn't build a habit. You built a monster. And the monster is hungry."</p>
        `
    },
    {
        id: 'ch18', chapter: 18,
        title: 'A-Rank: Among the Elite',
        icon: '💎',
        condition: () => D.level >= 100,
        condLabel: 'Reach Level 100 (A-Rank)',
        story: () => `
            <p>Level ${D.level}. A-Rank. The elite. The top fraction of a fraction.</p>
            <p class="jn-system-msg">[System] ALERT — Hunter ${D.settings.playerName} has reached A-Rank. National attention warranted. Surveillance upgraded.</p>
            <p>A-Rank hunters don't just train. They <em>exist</em> differently. Their discipline is automatic. Their strength is undeniable. Their presence commands respect without a word.</p>
            <p>Shadow Army: ${D.shadowArmy || 0}. Bosses defeated: ${D.stats.bossesDefeated || 0}. Total workouts: ${D.stats.totalWorkouts}. Calories destroyed: ${D.stats.totalCalBurned.toLocaleString()}.</p>
            <p>The road to S-Rank stretches ahead — longer and harder than everything before it combined. But you've never looked at a long road and turned back. Not once.</p>
        `
    },
    {
        id: 'ch19', chapter: 19,
        title: 'Shadow Commander',
        icon: '☬',
        condition: () => (D.shadowArmy || 0) >= 10,
        condLabel: 'Recruit 10 Shadow Soldiers',
        story: () => `
            <p>Ten shadows. Ten soldiers extracted from the darkness, bound to your will.</p>
            <p>When ${D.settings.playerName} walks into the gym now, the shadows walk with them — invisible to others, but felt. The weight feels lighter. The exhaustion is manageable. The army carries some of the burden.</p>
            <p class="jn-system-msg">[System] Shadow Army: ${D.shadowArmy || 0}. Commander rank confirmed. The shadows await your orders.</p>
            <p>Each shadow was extracted from a moment of triumph: a mission completed under pressure, a boss destroyed, a challenge conquered.</p>
            <p class="jn-quote">"A king does not fight alone. A king fights with the ghosts of every battle that made him."</p>
        `
    },
    {
        id: 'ch20', chapter: 20,
        title: 'The Long Road',
        icon: '🛤',
        condition: () => D.stats.totalWorkouts >= 200,
        condLabel: 'Complete 200 workouts',
        story: () => `
            <p>Two hundred. What started as a decision has become a way of life.</p>
            <p>${D.settings.playerName} doesn't wonder "should I train today?" anymore. The question doesn't exist. Training is like breathing — not optional, not debatable, not negotiable.</p>
            <p>${D.stats.totalWorkouts} sessions in the books. ${D.stats.totalCalBurned.toLocaleString()} calories annihilated. ${D.stats.totalMeals} meals fueling the machine.</p>
            <p class="jn-system-msg">[System] Workout milestone: 200. Statistical analysis: this hunter will not stop. Probability of quitting: 0.00%.</p>
            <p>The road stretches further. S-Rank waits. But the road isn't the obstacle — the road is the reward. You love the walk.</p>
        `
    },
    {
        id: 'ch21', chapter: 21,
        title: 'S-Rank: Sovereign',
        icon: '🏆',
        condition: () => D.level >= 200,
        condLabel: 'Reach Level 200 (S-Rank)',
        story: () => `
            <p class="jn-system-msg">[SYSTEM ALERT] ⚠ CRITICAL THRESHOLD BREACHED ⚠</p>
            <p class="jn-system-msg">Hunter ${D.settings.playerName} — Level ${D.level} — has achieved S-Rank. Classification: SOVEREIGN.</p>
            <p>S-Rank. The rank of legends. The rank of hunters whose names echo through history. The rank that separates the mortal from the mythical.</p>
            <p>Remember the E-Rank hunter who could barely complete a single workout? That ghost is dead. Killed by the very person who inhabited them.</p>
            <p>Stats: STR ${D.stats.str} | AGI ${D.stats.agi} | VIT ${D.stats.vit} | END ${D.stats.end} | WIL ${D.stats.wil} | PHS ${D.stats.phs}</p>
            <p>Shadow Army: ${D.shadowArmy || 0}. Workouts: ${D.stats.totalWorkouts}. Bosses slain: ${D.stats.bossesDefeated || 0}.</p>
            <p class="jn-quote">"You don't reach S-Rank through talent. You reach it through years of refusing to die."</p>
        `
    },
    {
        id: 'ch22', chapter: 22,
        title: 'Extinction Event',
        icon: '💀',
        condition: () => D.stats.totalCalBurned >= 50000,
        condLabel: 'Burn 50,000 total calories',
        story: () => `
            <p>Fifty thousand calories. An extinction-level metabolic event.</p>
            <p>${D.stats.totalCalBurned.toLocaleString()} calories have been converted from stored energy into raw power, heat, and transformation.</p>
            <p>If you could see all that energy released at once, it would level a building. But you released it slowly — session by session, rep by rep, day by day.</p>
            <p class="jn-system-msg">[System] Caloric output: ${D.stats.totalCalBurned.toLocaleString()} cal. Classification: Extinction-class metabolic entity.</p>
            <p class="jn-quote">"The human body wasn't designed for this. That's what makes it beautiful — you forced it to become more."</p>
        `
    },
    {
        id: 'ch23', chapter: 23,
        title: 'The Complete Hunter',
        icon: '⚔',
        condition: () => D.stats.totalWorkouts >= 500,
        condLabel: 'Complete 500 workouts',
        story: () => `
            <p>Five hundred workouts. Half a thousand battles against iron, gravity, and your own limitations.</p>
            <p>${D.settings.playerName}. Level ${D.level}. Rank: ${getRank(D.level).title}. Shadow Army: ${D.shadowArmy || 0}. Bosses slain: ${D.stats.bossesDefeated || 0}.</p>
            <p>You are a complete hunter now. Not because you're done — you'll never be done — but because you've mastered every aspect: the training, the nutrition, the discipline, the consistency.</p>
            <p class="jn-system-msg">[System] 500 workouts recorded. In the entire history of the System, few hunters reach this threshold. You are... exceptional.</p>
            <p>The gym isn't a place you go. It's a place you belong.</p>
        `
    },
    {
        id: 'ch24', chapter: 24,
        title: 'Shadow Monarch',
        icon: '👑',
        condition: () => D.level >= 250,
        condLabel: 'Reach Level 250',
        story: () => `
            <p>Level ${D.level}. The title is no longer a metaphor. ${D.settings.playerName} <em>is</em> the Shadow Monarch.</p>
            <p>An army of ${D.shadowArmy || 0} shadows stands behind you — an army built not through magic, but through relentless, daily sacrifice. Through years of discipline.</p>
            <p class="jn-system-msg">[System] Shadow Monarch status confirmed. All shadow soldiers are bound. The System recognizes absolute authority.</p>
            <p>The world doesn't know what you've become. They see the surface — the muscle, the discipline, the aura. They don't see the thousands of reps, the meals tracked, the days you showed up when you didn't want to.</p>
            <p>But the shadows know. The shadows remember everything.</p>
            <p class="jn-quote">"I am the Shadow Monarch. And I answer to no one."</p>
        `
    },
    {
        id: 'ch25', chapter: 25,
        title: 'National Level: The Threat',
        icon: '☢',
        condition: () => D.level >= 351,
        condLabel: 'Reach Level 351 (X-Rank)',
        story: () => `
            <p class="jn-system-msg">[SYSTEM] ⚠⚠⚠ NATIONAL LEVEL THREAT DETECTED ⚠⚠⚠</p>
            <p class="jn-system-msg">Hunter: ${D.settings.playerName}. Level: ${D.level}. Rank: X — NATIONAL LEVEL.</p>
            <p class="jn-system-msg">Classification: BEYOND HUMAN PARAMETERS. The System can no longer measure this entity.</p>
            <p>Three years. That's how long it took. Three years of daily combat against weakness, mediocrity, and the person you used to be.</p>
            <p>${D.stats.totalWorkouts} workouts. ${D.stats.totalCalBurned.toLocaleString()} calories burned. ${D.stats.totalMeals} meals tracked. ${D.stats.totalQuestsCompleted} quests cleared. ${D.stats.bossesDefeated || 0} bosses destroyed. ${D.shadowArmy || 0} shadow soldiers commanded.</p>
            <p>Stats: STR ${D.stats.str} | AGI ${D.stats.agi} | VIT ${D.stats.vit} | END ${D.stats.end} | WIL ${D.stats.wil} | PHS ${D.stats.phs}</p>
            <p>You are X-Rank. National Level. The Threat. Not because the System gave it to you — but because you <em>took</em> it. Day by day. Rep by rep. Year by year.</p>
            <p class="jn-quote">"This is not the end of your journey. It's the moment the world realized — there is no ceiling for someone who refuses to stop."</p>
            <p class="jn-final">The story continues. The monster never stops. ARISE.</p>
        `
    }
];

// ── Render the journal ──
function renderJournal() {
    const container = document.getElementById('journalContent');
    if (!container || !D) return;

    const read = D.journalRead || [];
    const unlocked = JOURNAL_CHAPTERS.filter(ch => ch.condition());
    const locked = JOURNAL_CHAPTERS.filter(ch => !ch.condition());

    let html = `
        <div class="jn-header">
            <div class="jn-header-icon">📖</div>
            <div class="jn-header-title">HUNTER'S JOURNAL</div>
            <div class="jn-header-sub">Your journey, written in iron and shadow</div>
            <div class="jn-progress">${unlocked.length} / ${JOURNAL_CHAPTERS.length} chapters unlocked</div>
        </div>
    `;

    // Unlocked chapters
    unlocked.forEach(ch => {
        const isRead = read.includes(ch.id);
        const isNew = !isRead;
        html += `
            <div class="jn-chapter ${isNew ? 'jn-new' : 'jn-read'}" data-chapter="${ch.id}">
                <div class="jn-chapter-header" onclick="toggleJournalChapter('${ch.id}')">
                    <div class="jn-ch-left">
                        <span class="jn-ch-icon">${ch.icon}</span>
                        <div class="jn-ch-info">
                            <span class="jn-ch-num">Chapter ${ch.chapter}</span>
                            <span class="jn-ch-title">${ch.title}</span>
                        </div>
                    </div>
                    <div class="jn-ch-right">
                        ${isNew ? '<span class="jn-badge-new">NEW</span>' : ''}
                        <span class="jn-ch-arrow">▸</span>
                    </div>
                </div>
                <div class="jn-chapter-body" id="jnBody_${ch.id}">
                    ${ch.story()}
                </div>
            </div>
        `;
    });

    // Locked chapters
    if (locked.length > 0) {
        html += `<div class="jn-locked-header">🔒 Locked Chapters</div>`;
        locked.forEach(ch => {
            html += `
                <div class="jn-chapter jn-locked">
                    <div class="jn-chapter-header">
                        <div class="jn-ch-left">
                            <span class="jn-ch-icon">🔒</span>
                            <div class="jn-ch-info">
                                <span class="jn-ch-num">Chapter ${ch.chapter}</span>
                                <span class="jn-ch-title">???</span>
                            </div>
                        </div>
                        <div class="jn-ch-right">
                            <span class="jn-ch-cond">${ch.condLabel}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

function toggleJournalChapter(chId) {
    const body = document.getElementById(`jnBody_${chId}`);
    const chapter = body?.closest('.jn-chapter');
    if (!body) return;

    const wasHidden = !body.classList.contains('open');
    body.classList.toggle('open');

    // Update arrow
    const arrow = chapter?.querySelector('.jn-ch-arrow');
    if (arrow) arrow.textContent = wasHidden ? '▾' : '▸';

    // Mark as read
    if (wasHidden && D) {
        if (!D.journalRead) D.journalRead = [];
        if (!D.journalRead.includes(chId)) {
            D.journalRead.push(chId);
            // Remove NEW badge
            const badge = chapter?.querySelector('.jn-badge-new');
            if (badge) badge.remove();
            chapter?.classList.remove('jn-new');
            chapter?.classList.add('jn-read');
            saveGame();
        }
    }

    if (typeof playSound === 'function') playSound('click');
}

// Count unread unlocked chapters (for tab badge)
function getUnreadJournalCount() {
    if (!D) return 0;
    const read = D.journalRead || [];
    return JOURNAL_CHAPTERS.filter(ch => ch.condition() && !read.includes(ch.id)).length;
}
