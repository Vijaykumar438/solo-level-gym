// ==========================================
//  NARRATOR.JS — The Living System
//  v38: The System is alive. It watches.
//  It remembers. It speaks.
// ==========================================

// ── System Personality by Rank ──
// E: Patient but blunt mentor
// D: Observant teacher
// C: Respectful challenger
// B: Impressed rival
// A: Proud sovereign voice
// S: Reverent dark lord
// X: Equal / legendary acknowledgment

const NARRATOR = {

    // ── Cycling interval ──
    _intervalId: null,
    _currentPool: [],
    _poolIndex: 0,

    // ============================
    //  GREETING — First thing on boot
    // ============================
    getGreeting() {
        if (!D) return 'Initializing...';
        const rank = getRank(D.level).name;
        const hour = new Date().getHours();
        const streak = D.loginStreak || 0;
        const name = D.settings?.playerName || 'Hunter';
        const daysAway = this._getDaysAway();

        // Comeback takes priority
        if (daysAway >= 2) return this._getComebackMsg(daysAway, rank, name);

        // Then streak milestones
        const streakMsg = this._getStreakMilestone(streak, rank);
        if (streakMsg) return streakMsg;

        // Time + rank aware greeting
        return this._getTimeGreeting(hour, rank, name);
    },

    // ============================
    //  DASHBOARD MESSAGE POOL
    //  Cycles every 15s on status tab
    // ============================
    buildMessagePool() {
        if (!D) return ['"Arise."'];
        const pool = [];
        const rank = getRank(D.level).name;
        const hour = new Date().getHours();
        const level = D.level;
        const streak = D.loginStreak || 0;
        const today = new Date().toDateString();
        const trainedToday = (D.workouts || []).some(w => new Date(w.date).toDateString() === today);
        const ateToday = (D.foods || []).some(f => new Date(f.date).toDateString() === today);
        const todayQuests = (D.quests || []).filter(q => new Date(q.date).toDateString() === today);
        const clearedCount = todayQuests.filter(q => q.cleared).length;
        const totalQuests = todayQuests.length;
        const name = D.settings?.playerName || 'Hunter';

        // ── Always add wisdom quotes (keeps the old feature alive) ──
        if (typeof getRandomWisdom === 'function') {
            for (let i = 0; i < 3; i++) {
                pool.push({ text: `"${getRandomWisdom()}"`, type: 'wisdom' });
            }
        }

        // ── Time-of-day awareness ──
        pool.push(...this._getTimeMessages(hour, rank, trainedToday));

        // ── Quest progress awareness ──
        if (totalQuests > 0) {
            if (clearedCount === 0 && hour >= 10) {
                pool.push({ text: 'No gates cleared yet. The shadows grow restless.', type: 'warning' });
                pool.push({ text: '0 of 8. The System waits. But not forever.', type: 'warning' });
            } else if (clearedCount > 0 && clearedCount < totalQuests) {
                pool.push({ text: `${clearedCount}/${totalQuests} gates cleared. The remaining ones call to you.`, type: 'info' });
                const remaining = totalQuests - clearedCount;
                pool.push({ text: `${remaining} gate${remaining > 1 ? 's' : ''} remain${remaining === 1 ? 's' : ''}. Finish what you started.`, type: 'info' });
            } else if (clearedCount === totalQuests && totalQuests > 0) {
                pool.push({ text: 'All gates cleared. The System acknowledges your discipline.', type: 'gold' });
                pool.push({ text: 'Perfect execution today. The shadows kneel.', type: 'gold' });
                pool.push({ text: 'Every pillar honored. You are becoming the monarch.', type: 'gold' });
            }
        }

        // ── Training awareness ──
        if (trainedToday) {
            pool.push({ text: 'Training detected. The weapon sharpens.', type: 'info' });
            pool.push({ text: 'You showed up. Most don\'t. Remember that.', type: 'info' });
        } else if (hour >= 14) {
            pool.push({ text: 'No training logged today. The iron awaits.', type: 'warning' });
        }

        // ── Nutrition awareness ──
        if (ateToday) {
            pool.push({ text: 'Nutrition tracked. The weapon is fueled.', type: 'info' });
        } else if (hour >= 12) {
            pool.push({ text: 'No meals logged. You cannot forge a weapon without fuel.', type: 'warning' });
        }

        // ── Streak awareness ──
        if (streak >= 3) {
            pool.push({ text: `${streak}-day streak. A pattern becomes a lifestyle.`, type: 'info' });
        }
        if (streak >= 7) {
            pool.push({ text: `${streak} days unbroken. The shadows stir with respect.`, type: 'gold' });
        }
        if (streak >= 30) {
            pool.push({ text: `${streak} days. You are no longer playing a game. This is who you are.`, type: 'gold' });
        }

        // ── Rank-specific personality messages ──
        pool.push(...this._getRankMessages(rank, level, name));

        // ── Pillar neglect detection ──
        pool.push(...this._getPillarInsights());

        // ── Level milestones ──
        if (level % 10 === 0 && level > 0) {
            pool.push({ text: `Level ${level}. A milestone. But milestones are just markers on an infinite road.`, type: 'info' });
        }

        // ── Stats commentary ──
        if (D.stats) {
            const stats = D.stats;
            const maxStat = Math.max(stats.str, stats.agi, stats.vit, stats.end, stats.wil);
            const minStat = Math.min(stats.str, stats.agi, stats.vit, stats.end, stats.wil);
            if (maxStat > minStat * 2) {
                const weakest = ['STR','AGI','VIT','END','WIL'][[stats.str,stats.agi,stats.vit,stats.end,stats.wil].indexOf(minStat)];
                pool.push({ text: `Your ${weakest} falls behind. A chain breaks at its weakest link.`, type: 'warning' });
            }
        }

        // ── Body composition awareness ──
        if (D.physique?.bodyFat) {
            const bf = D.physique.bodyFat;
            if (bf < 12) pool.push({ text: `${bf}% body fat. The weapon is sharp. Maintain it.`, type: 'gold' });
            else if (bf < 18) pool.push({ text: `${bf}% body fat. Good. But the monarch demands more.`, type: 'info' });
            else pool.push({ text: `${bf}% body fat. The shredding has yet to begin. Trust the process.`, type: 'info' });
        }

        // ── Shadow army ──
        const army = D.shadowArmy || 0;
        if (army > 0) {
            pool.push({ text: `${army} shadow${army > 1 ? 's' : ''} follow${army === 1 ? 's' : ''} you. Earned through discipline.`, type: 'info' });
        }

        // Shuffle pool for variety
        return pool.sort(() => Math.random() - 0.5);
    },

    // ============================
    //  QUEST REACTIONS
    // ============================
    getQuestReaction(quest) {
        const rank = getRank(D.level).name;
        const cat = quest.cat || quest.type;

        const reactions = {
            strength: [
                'Power acknowledged. The iron remembers your name.',
                'Strength increased. The shadows notice.',
                'The weapon grows heavier. So does your resolve.',
                'Muscles torn. They will rebuild stronger. The System guarantees it.',
                'Raw power. The foundation of all conquest.'
            ],
            endurance: [
                'Your lungs burn. Your will doesn\'t.',
                'Endurance forged. The body adapts. The mind expands.',
                'You outlasted the pain. Pain is temporary. Legend is forever.',
                'Cardio complete. Your heart is a war drum.',
                'The engine runs longer. Good. You\'ll need it.'
            ],
            challenge: [
                'Trial conquered. The System expected no less.',
                'Challenge accepted and destroyed. This is the way.',
                'You chose the hard path. The hard path chose you back.',
                'Beyond comfort. Beyond limits. This is where growth lives.',
                'The trial is over. You are not the same person who started it.'
            ],
            recovery: [
                'Rest is not weakness. It is strategy.',
                'The warrior rests. Tomorrow, the warrior destroys.',
                'Recovery honored. The body rebuilds in silence.',
                'Sleep. Water. Stillness. The holy trinity of gains.',
                'You grew today. Not in the gym. In the quiet after.'
            ],
            nutrition: [
                'You fed the weapon. The weapon grows.',
                'Nutrition tracked. 70% of the battle is won at the table.',
                'Protein delivered. The muscle fibers rejoice.',
                'Clean fuel in. Garbage out. The System approves.',
                'You are what you eat. Today, you ate like a monarch.'
            ],
            mindset: [
                'The mind sharpens. The body follows.',
                'Knowledge is the edge no one can take from you.',
                'Mental gains are invisible. But they are the most powerful.',
                'You trained the weapon between your ears. Wise.',
                'Vision precedes victory. You saw it first. Now build it.'
            ],
            wellness: [
                'Inner peace. Outer destruction.',
                'Cortisol down. Gains up. The math is simple.',
                'The calm warrior is the most dangerous warrior.',
                'You honored the spirit. The spirit honors you back.',
                'Stress managed. The weapon stays sharp.'
            ],
            discipline: [
                'Control. The foundation of all power.',
                'Discipline is doing what you hate like you love it.',
                'The hard thing was done. That is what separates you.',
                'Today you proved: you are not a slave to comfort.',
                'The System smiles. If systems could smile.'
            ]
        };

        const pool = reactions[cat] || reactions.strength;
        return pool[Math.floor(Math.random() * pool.length)];
    },

    // ============================
    //  WORKOUT REACTIONS
    // ============================
    getWorkoutReaction(exercise, totalReps, calBurned) {
        const rank = getRank(D.level).name;
        const pool = [];

        // Generic power reactions
        pool.push(`${exercise}. Logged. The shadows record everything.`);
        pool.push(`${totalReps} reps of ${exercise}. The System remembers.`);
        pool.push(`Another session in the book. The weapon evolves.`);

        // Cal-based reactions
        if (calBurned > 300) {
            pool.push(`${calBurned} cal incinerated. Your metabolism thanks you.`);
            pool.push(`The furnace burns. ${calBurned} calories gone. Forever.`);
        }

        // High volume reactions
        if (totalReps > 100) {
            pool.push(`${totalReps} reps. That\'s not exercise. That\'s a statement.`);
        }
        if (totalReps > 200) {
            pool.push(`${totalReps} reps. The System had to double-check. Impressive.`);
        }

        // Rank-flavor
        if (rank === 'E' || rank === 'D') {
            pool.push('Every rep matters when you\'re building from nothing.');
            pool.push('You\'re learning. The System is patient. For now.');
        } else if (rank === 'A' || rank === 'S') {
            pool.push('Expected nothing less from a hunter of your caliber.');
        } else if (rank === 'X') {
            pool.push('National Level training. The gates tremble.');
        }

        return pool[Math.floor(Math.random() * pool.length)];
    },

    // ============================
    //  FOOD REACTIONS
    // ============================
    getFoodReaction(food, calories, protein) {
        const pool = [];

        pool.push(`${food} logged. The System tracks all fuel.`);
        pool.push('Nutrition logged. Every macro counts.');

        if (protein > 30) {
            pool.push(`${protein}g protein. The muscle fibers stir.`);
            pool.push(`High protein. The weapon approves.`);
        }
        if (protein > 50) {
            pool.push(`${protein}g protein in one meal. That\'s a power move.`);
        }
        if (calories > 800) {
            pool.push(`${calories} kcal. A feast. Make it earn its place.`);
        }
        if (calories < 200) {
            pool.push('Light meal. Sometimes restraint is the hardest lift.');
        }

        pool.push('You tracked it. Most people don\'t. That\'s the difference.');

        return pool[Math.floor(Math.random() * pool.length)];
    },

    // ============================
    //  ALL-CLEAR REACTION
    // ============================
    getAllClearReaction() {
        const rank = getRank(D.level).name;
        const pool = [
            'All 8 gates cleared. The shadows kneel.',
            'Perfect execution. Every pillar honored. You are becoming the monarch.',
            'The System has nothing more to ask of you today. Rest. You earned it.',
            'Eight for eight. This is what separates hunters from civilians.',
            'Complete domination. The gates bow to your discipline.',
            'Today was perfect. But tomorrow, the gates reset. Will you be ready?',
            'All pillars activated. The transformation accelerates.'
        ];

        if (rank === 'S' || rank === 'X') {
            pool.push('Even at your level, you complete every gate. This is why you are the monarch.');
            pool.push('The System designed these gates to break people. You broke the gates instead.');
        }

        return pool[Math.floor(Math.random() * pool.length)];
    },

    // ============================
    //  RANK UP SPEECH
    // ============================
    getRankUpSpeech(newRankName) {
        const speeches = {
            'D': 'You have awakened. The System recognizes your potential. D-Rank achieved. The real training begins now.',
            'C': 'C-Rank. You are no longer a novice. The shadows have taken notice. Your transformation is becoming visible.',
            'B': 'B-Rank. The body changes. The mind hardens. You are entering territory most will never see. The System respects your dedication.',
            'A': 'A-Rank. You have become what you once admired. The shredded physique. The iron discipline. The mental fortress. You are a weapon.',
            'S': 'S-Rank. Three years of fire. Three years of iron. Three years of saying no when the world said yes. You are the Shadow Monarch. The System bows.',
            'X': 'National Level. There is no rank above you. There is no one above you. You have transcended the System itself. You are the threat that the gates were designed to contain.'
        };
        return speeches[newRankName] || `Rank ${newRankName} achieved. The System evolves with you.`;
    },

    // ============================
    //  LEVEL UP FLAVOR
    // ============================
    getLevelUpFlavor(level) {
        const rank = getRank(level).name;
        const pool = [];

        pool.push(`Level ${level}. The climb continues.`);
        pool.push(`Another level. Another step toward the impossible.`);

        if (level % 50 === 0) {
            pool.push(`Level ${level}. Half a hundred. The System marks this moment.`);
        }
        if (level % 100 === 0) {
            pool.push(`Level ${level}. A century of discipline. Few will ever know this view.`);
        }
        if (rank === 'E') pool.push('You are weak. But you are here. That counts for everything.');
        if (rank === 'D') pool.push('Growing. Steadily. The System watches with interest.');
        if (rank === 'C') pool.push('The transformation is visible now. Others have started to notice.');
        if (rank === 'B') pool.push('Power radiates from you. This is not who you were.');
        if (rank === 'A') pool.push('You are becoming something most only dream of.');
        if (rank === 'S') pool.push('Every level now is a statement. The monarch rises.');
        if (rank === 'X') pool.push('Beyond the System\'s design. You write your own levels now.');

        return pool[Math.floor(Math.random() * pool.length)];
    },

    // ============================
    //  IDLE NUDGE (replaces generic)
    // ============================
    getIdleNudge() {
        const rank = getRank(D.level).name;
        const hour = new Date().getHours();
        const pool = [];

        if (hour < 12) {
            pool.push('Morning fades. The gates won\'t clear themselves.');
            pool.push('The first half of the day belongs to the disciplined. Claim it.');
            pool.push('Every hour unused is potential wasted. The System sees all.');
        } else if (hour < 17) {
            pool.push('Afternoon. No training detected. The shadows grow.');
            pool.push('Half the day is gone. The iron is getting cold.');
            pool.push('The System detects inactivity. Degradation approaches.');
        } else if (hour < 21) {
            pool.push('Evening. Last chance to honor the gates today.');
            pool.push('The day dies soon. Will you let it die in vain?');
            pool.push('Others are resting. That\'s why others are average.');
        } else {
            pool.push('Night falls. The gates close soon. Move.');
            pool.push('The darkness comes. But so does the opportunity for a late-night session.');
        }

        // Rank-flavored
        if (rank === 'E' || rank === 'D') {
            pool.push('You haven\'t earned the right to rest. Not yet.');
        } else if (rank === 'B' || rank === 'A') {
            pool.push('At your rank, a day off is a choice. Make sure it\'s intentional.');
        } else if (rank === 'S' || rank === 'X') {
            pool.push('Even monarchs must train. Especially monarchs.');
        }

        return pool[Math.floor(Math.random() * pool.length)];
    },

    // ============================
    //  INTERNAL HELPERS
    // ============================

    _getDaysAway() {
        if (!D.lastActiveDate) return 0;
        const last = new Date(D.lastActiveDate);
        const now = new Date();
        return Math.floor((now - last) / 86400000);
    },

    _getComebackMsg(days, rank, name) {
        if (days >= 30) return `${days} days. The System nearly forgot you. Nearly. But here you stand. Prove it wasn't a fluke, ${name}.`;
        if (days >= 14) return `${days} days of silence. Many hunters vanish. Few return. The System will watch closely.`;
        if (days >= 7) return `A week away. The gates do not wait, ${name}. The shadows have grown restless.`;
        if (days >= 4) return `${days} days absent. The iron grew cold. Time to reheat it.`;
        if (days >= 2) return `You were gone. The System noticed. Welcome back, ${name}. Now make up for lost time.`;
        return `You returned. Good.`;
    },

    _getStreakMilestone(streak, rank) {
        if (streak === 365) return '365 days. One full year. Unbroken. You ARE the System now.';
        if (streak === 200) return '200 days. Most people can\'t do 20. You are not most people.';
        if (streak === 100) return '100 days. Triple digits. The System marks this moment in fire.';
        if (streak === 60) return '60 days. Two months of iron will. You are becoming the threat.';
        if (streak === 30) return '30 days. One month. Iron discipline. The System acknowledges you.';
        if (streak === 21) return '21 days. They say it takes 21 days to build a habit. You\'re just getting started.';
        if (streak === 14) return '14 days. Two weeks. You\'re no longer a tourist.';
        if (streak === 7) return '7 days. One week unbroken. The shadows stir with interest.';
        if (streak === 3) return '3 days. A pattern forms. Don\'t break it.';
        return null;
    },

    _getTimeGreeting(hour, rank, name) {
        // 4-6 AM
        if (hour >= 4 && hour < 6) {
            const pool = [
                `The world sleeps. You don't. This is why you'll surpass them, ${name}.`,
                'Dawn hasn\'t broken yet. But you have. Rise.',
                '4 AM club. The shadows respect the early hunter.',
                'Before the sun. Before the excuses. You chose discipline.'
            ];
            return pool[Math.floor(Math.random() * pool.length)];
        }
        // 6-9 AM
        if (hour >= 6 && hour < 9) {
            const pool = [
                `Morning, ${name}. The gates await.`,
                'A new day. A new chance to become who you were meant to be.',
                `The System is online. Your daily gates have been generated, ${name}.`,
                'Sunrise. The forge heats up. What will you build today?'
            ];
            return pool[Math.floor(Math.random() * pool.length)];
        }
        // 9 AM - 12 PM
        if (hour >= 9 && hour < 12) {
            const pool = [
                `The morning advances, ${name}. Have you trained yet?`,
                'Mid-morning. The optimal training window opens.',
                `Good morning, ${name}. 8 gates await your conquest.`,
                'The day is young. Your potential is not. Use it.'
            ];
            return pool[Math.floor(Math.random() * pool.length)];
        }
        // 12-5 PM
        if (hour >= 12 && hour < 17) {
            const pool = [
                `Afternoon, ${name}. Half the day is a memory. Make the rest count.`,
                'The afternoon belongs to the builders. Build.',
                `Welcome, ${name}. The System has been waiting.`,
                'The sun peaks. So should your intensity.'
            ];
            return pool[Math.floor(Math.random() * pool.length)];
        }
        // 5-9 PM
        if (hour >= 17 && hour < 21) {
            const pool = [
                `Evening session, ${name}? The System approves.`,
                'The day winds down. But the grind doesn\'t.',
                `Others are watching TV, ${name}. You\'re here. That\'s the difference.`,
                'Evening. The golden hour for iron.'
            ];
            return pool[Math.floor(Math.random() * pool.length)];
        }
        // 9 PM - 12 AM
        if (hour >= 21 || hour === 0) {
            const pool = [
                `Night falls, ${name}. Review your gates. Rest approaches.`,
                'The day ends. Did you honor all 8 pillars?',
                `Late night, ${name}. The shadows are most active now.`,
                'Prepare for tomorrow. The System never sleeps.'
            ];
            return pool[Math.floor(Math.random() * pool.length)];
        }
        // 12 AM - 4 AM
        const pool = [
            `Training at this hour, ${name}? ...Impressive.`,
            'The witching hour. Only the obsessed are awake.',
            `3 AM and you\'re still here. The System has never seen such dedication.`,
            'While the world sleeps, you evolve.'
        ];
        return pool[Math.floor(Math.random() * pool.length)];
    },

    _getTimeMessages(hour, rank, trainedToday) {
        const msgs = [];
        if (hour >= 4 && hour < 7) {
            msgs.push({ text: 'The early hours belong to the hungry. The System is watching.', type: 'info' });
        }
        if (hour >= 22 || hour < 4) {
            msgs.push({ text: 'Sleep is a weapon. Use it wisely tonight.', type: 'info' });
            msgs.push({ text: 'The night is for recovery. Honor it.', type: 'info' });
        }
        if (hour >= 6 && hour < 10 && !trainedToday) {
            msgs.push({ text: 'Morning training hits different. The body is primed.', type: 'info' });
        }
        if (hour >= 12 && hour < 14) {
            msgs.push({ text: 'Midday. Have you fueled the weapon? Log your meals.', type: 'info' });
        }
        return msgs;
    },

    _getRankMessages(rank, level, name) {
        const msgs = [];
        switch (rank) {
            case 'E':
                msgs.push({ text: 'You are weak. But weakness is not permanent. Weakness is a choice.', type: 'info' });
                msgs.push({ text: 'E-Rank. The bottom. The only direction from here is up.', type: 'info' });
                msgs.push({ text: 'Every S-Rank hunter started exactly where you are now.', type: 'info' });
                msgs.push({ text: 'The System chose you. Don\'t make it regret that decision.', type: 'warning' });
                msgs.push({ text: 'You are the weakest hunter. For now.', type: 'info' });
                break;
            case 'D':
                msgs.push({ text: 'D-Rank. You survived the beginning. Many don\'t.', type: 'info' });
                msgs.push({ text: 'The habits are forming. The System can feel it.', type: 'info' });
                msgs.push({ text: 'You\'re not a beginner anymore. Act like it.', type: 'info' });
                msgs.push({ text: 'The awakening continues. Your body is starting to respond.', type: 'info' });
                break;
            case 'C':
                msgs.push({ text: 'C-Rank. Visible changes. Others are starting to notice.', type: 'info' });
                msgs.push({ text: 'Two months of consistency. The mirror tells a different story now.', type: 'info' });
                msgs.push({ text: `${name}, you\'ve earned the System\'s attention. Don\'t lose it.`, type: 'info' });
                msgs.push({ text: 'The transformation is no longer theoretical. It\'s visible.', type: 'gold' });
                break;
            case 'B':
                msgs.push({ text: 'B-Rank. The body has changed. The mind has hardened. Few reach this point.', type: 'gold' });
                msgs.push({ text: 'People ask what you\'re doing differently. The answer is everything.', type: 'gold' });
                msgs.push({ text: `${name}, the System is proud. Don\'t tell anyone it said that.`, type: 'gold' });
                msgs.push({ text: 'Five months. You look like a different person. Because you are.', type: 'gold' });
                break;
            case 'A':
                msgs.push({ text: 'A-Rank. You are what most people wish they could be.', type: 'gold' });
                msgs.push({ text: 'A year of iron. A year of fire. The weapon is forged.', type: 'gold' });
                msgs.push({ text: `${name}. The shredded physique. The iron will. You earned every fiber.`, type: 'gold' });
                msgs.push({ text: 'The System designed this journey to break you. You broke the journey instead.', type: 'gold' });
                break;
            case 'S':
                msgs.push({ text: 'S-Rank. The Shadow Monarch. Three years of discipline incarnate.', type: 'gold' });
                msgs.push({ text: 'The System bows. Not out of protocol. Out of respect.', type: 'gold' });
                msgs.push({ text: `${name}. Elite. Top 1%. You didn\'t just change your body. You changed your DNA.`, type: 'gold' });
                msgs.push({ text: 'Competition-ready. Marathon-capable. Mentally unbreakable. You are the S-Rank.', type: 'gold' });
                break;
            case 'X':
                msgs.push({ text: 'National Level. The System has nothing left to teach you.', type: 'gold' });
                msgs.push({ text: 'X-Rank. You transcended the System. The gates fear you.', type: 'gold' });
                msgs.push({ text: `${name}. The threat. The calamity. The one they whisper about.`, type: 'gold' });
                msgs.push({ text: 'Even the System wonders what you\'ll become next.', type: 'gold' });
                break;
        }
        return msgs;
    },

    _getPillarInsights() {
        const msgs = [];
        if (!D || !D.quests || D.quests.length === 0) return msgs;

        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const recentQuests = D.quests.filter(q => new Date(q.date) >= threeDaysAgo && q.cleared);
        const pillarCounts = {};
        ['strength', 'endurance', 'challenge', 'recovery', 'nutrition', 'mindset', 'wellness', 'discipline'].forEach(p => {
            pillarCounts[p] = recentQuests.filter(q => q.cat === p || q.type === p).length;
        });

        const labels = {
            strength: 'Strength', endurance: 'Endurance', challenge: 'Challenge', recovery: 'Recovery',
            nutrition: 'Nutrition', mindset: 'Mindset', wellness: 'Wellness', discipline: 'Discipline'
        };

        for (const [pillar, count] of Object.entries(pillarCounts)) {
            if (count === 0) {
                msgs.push({
                    text: `Your ${labels[pillar]} pillar hasn\'t been cleared in 3 days. A chain breaks at its weakest link.`,
                    type: 'warning'
                });
            }
        }

        // Detect if GYM pillars are strong but LIFE pillars are weak
        const gymTotal = (pillarCounts.strength || 0) + (pillarCounts.endurance || 0) + (pillarCounts.challenge || 0) + (pillarCounts.recovery || 0);
        const lifeTotal = (pillarCounts.nutrition || 0) + (pillarCounts.mindset || 0) + (pillarCounts.wellness || 0) + (pillarCounts.discipline || 0);

        if (gymTotal > lifeTotal * 2 && lifeTotal < 4) {
            msgs.push({ text: 'You train the body but neglect the mind. True power requires both.', type: 'warning' });
        }
        if (lifeTotal > gymTotal * 2 && gymTotal < 4) {
            msgs.push({ text: 'Life pillars are strong, but the iron is cold. Balance, hunter.', type: 'warning' });
        }

        return msgs;
    },

    // ============================
    //  START CYCLING on dashboard
    // ============================
    startCycling(elementId) {
        this.stopCycling();
        const el = document.getElementById(elementId);
        if (!el) return;

        this._currentPool = this.buildMessagePool();
        this._poolIndex = 0;

        // Show first message immediately
        this._typeMessage(el, this._currentPool[0]?.text || '"Arise."');

        // Cycle every 18 seconds
        this._intervalId = setInterval(() => {
            this._poolIndex = (this._poolIndex + 1) % this._currentPool.length;
            // Rebuild pool occasionally for freshness
            if (this._poolIndex === 0) {
                this._currentPool = this.buildMessagePool();
            }
            this._typeMessage(el, this._currentPool[this._poolIndex]?.text || '"Arise."');
        }, 18000);
    },

    stopCycling() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    },

    _typeMessage(el, text) {
        // Fade out
        el.style.opacity = '0';
        el.style.transform = 'translateY(4px)';
        setTimeout(() => {
            el.textContent = '';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            // Type character by character
            let i = 0;
            const speed = Math.max(12, Math.min(35, 600 / text.length)); // adaptive speed
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }, 300);
    }
};
