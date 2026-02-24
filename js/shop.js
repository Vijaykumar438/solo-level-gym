// ==========================================
//  SHOP.JS — Hunter's Armory & Item Shop
//  "From ashes, you rose. These are the proof."
// ==========================================

const SHOP_ITEMS = [
    // ===== WEAPONS — Cosmetic trophies of your evolution =====
    { id: 'w_rusty_dagger',      cat: 'weapon',  name: 'Rusty Dagger',             icon: '🗡️',  desc: "A broken blade you started with. Every legend begins here.",                       cost: 50,   rankReq: 'E', tier: 1 },
    { id: 'w_wooden_shield',     cat: 'weapon',  name: 'Wooden Shield',            icon: '🛡️',  desc: "Barely holds. But you held on. That is what matters.",                              cost: 80,   rankReq: 'E', tier: 1 },
    { id: 'w_iron_sword',        cat: 'weapon',  name: 'Iron Sword',               icon: '⚔️',  desc: "Forged from your first real grind. It cuts deeper than doubt.",                     cost: 200,  rankReq: 'D', tier: 2 },
    { id: 'w_hunters_bow',       cat: 'weapon',  name: "Hunter's Bow",             icon: '🏹',  desc: "Precision. Patience. You learned to aim at goals, not people.",                    cost: 300,  rankReq: 'D', tier: 2 },
    { id: 'w_shadow_blade',      cat: 'weapon',  name: 'Shadow Blade',             icon: '🔪',  desc: "Born from the darkness you walked through. Lethal and silent.",                    cost: 600,  rankReq: 'C', tier: 3 },
    { id: 'w_demon_fang',        cat: 'weapon',  name: 'Demon Fang',               icon: '🦷',  desc: "Ripped from a demon you defeated. The demon was your old self.",                   cost: 800,  rankReq: 'C', tier: 3 },
    { id: 'w_crimson_greatsword', cat: 'weapon', name: 'Crimson Greatsword',       icon: '⚔️',  desc: "Stained red from battles that almost broke you. Still standing.",                  cost: 1500, rankReq: 'B', tier: 4 },
    { id: 'w_dragon_slayer',     cat: 'weapon',  name: 'Dragon Slayer',            icon: '🐉',  desc: "For slaying the dragon of self-pity. No one is coming to save you.",               cost: 2500, rankReq: 'B', tier: 4 },
    { id: 'w_monarchs_katana',   cat: 'weapon',  name: "Monarch's Katana",         icon: '⚔️',  desc: "One clean cut. One purpose. Zero hesitation.",                                     cost: 5000, rankReq: 'A', tier: 5 },
    { id: 'w_divine_spear',      cat: 'weapon',  name: 'Divine Spear',             icon: '🔱',  desc: "It pierces through every excuse, every lie you told yourself.",                    cost: 7000, rankReq: 'A', tier: 5 },
    { id: 'w_shadow_monarch',    cat: 'weapon',  name: "Shadow Sovereign's Blade", icon: '🌑',  desc: "The final weapon. Forged from every tear, every sleepless night, every rep.",       cost: 15000, rankReq: 'S', tier: 6 },
    { id: 'w_extinction_blade',  cat: 'weapon',  name: "Extinction Blade",         icon: '💀',  desc: "A weapon that should not exist. Neither should you — at this level.",               cost: 30000, rankReq: 'X', tier: 7 },
    { id: 'w_national_scythe',   cat: 'weapon',  name: "National Level Scythe",    icon: '⚰️',  desc: "You don't fight anymore. You end things. This is the proof.",                      cost: 50000, rankReq: 'X', tier: 7 },

    // ===== POTIONS — Consumable buffs =====
    { id: 'p_xp_minor',         cat: 'potion',  name: 'XP Elixir (Minor)',        icon: '🧪',  desc: "Grants +50 XP instantly. Small steps compound.",                                  cost: 30,   rankReq: 'E', tier: 1, consumable: true, effect: { type: 'xp', value: 50 } },
    { id: 'p_xp_major',         cat: 'potion',  name: 'XP Elixir (Major)',        icon: '⚗️',  desc: "Grants +200 XP instantly. Growth accelerator.",                                   cost: 100,  rankReq: 'D', tier: 2, consumable: true, effect: { type: 'xp', value: 200 } },
    { id: 'p_xp_supreme',       cat: 'potion',  name: 'XP Elixir (Supreme)',      icon: '🔮',  desc: "Grants +500 XP instantly. Raw power in a bottle.",                                cost: 250,  rankReq: 'C', tier: 3, consumable: true, effect: { type: 'xp', value: 500 } },
    { id: 'p_gold_boost',       cat: 'potion',  name: 'Gold Multiplier',          icon: '💰',  desc: "Grants +100 Gold. Fortune favors the disciplined.",                               cost: 40,   rankReq: 'E', tier: 1, consumable: true, effect: { type: 'gold', value: 100 } },
    { id: 'p_stat_reset',       cat: 'potion',  name: 'Stat Reset Crystal',       icon: '💎',  desc: "Refund ALL allocated stat points. Rebuild from zero.",                            cost: 500,  rankReq: 'C', tier: 3, consumable: true, effect: { type: 'stat_reset' } },
    { id: 'p_streak_restore',   cat: 'potion',  name: 'Streak Shield',            icon: '🔰',  desc: "Restores your streak to your highest-ever. Never truly fall.",                   cost: 300,  rankReq: 'D', tier: 2, consumable: true, effect: { type: 'streak_restore' } },
    { id: 'p_heal',             cat: 'potion',  name: 'Recovery Potion',          icon: '💚',  desc: "Clears all penalties from this week. A second chance.",                           cost: 200,  rankReq: 'D', tier: 2, consumable: true, effect: { type: 'clear_penalties' } },

    // ===== RELICS — Permanent passive trophies =====
    { id: 'r_iron_ring',        cat: 'relic',   name: 'Ring of Iron Will',        icon: '💍',  desc: "You chose discipline over comfort. Permanent +2 WIL.",                            cost: 150,  rankReq: 'D', tier: 2, passive: { stat: 'wil', value: 2 } },
    { id: 'r_shadow_amulet',    cat: 'relic',   name: 'Shadow Amulet',            icon: '📿',  desc: "The darkness made you stronger. Permanent +2 END.",                               cost: 400,  rankReq: 'C', tier: 3, passive: { stat: 'end', value: 2 } },
    { id: 'r_phoenix_feather',  cat: 'relic',   name: 'Phoenix Feather',          icon: '🪶',  desc: "You burned and came back. Permanent +3 VIT.",                                    cost: 800,  rankReq: 'C', tier: 3, passive: { stat: 'vit', value: 3 } },
    { id: 'r_demon_heart',      cat: 'relic',   name: "Demon's Heart",            icon: '♥️',  desc: "Ripped from your inner demons. Permanent +3 STR.",                                cost: 1200, rankReq: 'B', tier: 4, passive: { stat: 'str', value: 3 } },
    { id: 'r_lightning_core',   cat: 'relic',   name: 'Lightning Core',           icon: '⚡',  desc: "Speed of someone who stopped waiting. Permanent +3 AGI.",                        cost: 1200, rankReq: 'B', tier: 4, passive: { stat: 'agi', value: 3 } },
    { id: 'r_monarchs_crown',   cat: 'relic',   name: "Monarch's Crown",          icon: '👑',  desc: "You earned this. No one gave it to you. Permanent +5 ALL stats.",                cost: 10000, rankReq: 'A', tier: 5, passive: { stat: 'all', value: 5 } },
    { id: 'r_threat_core',      cat: 'relic',   name: "Threat Core",              icon: '🩸',  desc: "The beating heart of a monster. Permanent +5 STR, +5 END.",                     cost: 20000, rankReq: 'S', tier: 6, passive: { stat: 'str', value: 5 } },
    { id: 'r_extinction_sigil', cat: 'relic',   name: "Extinction Sigil",         icon: '☠️',  desc: "Nations branded you. You branded yourself. Permanent +10 ALL stats.",           cost: 50000, rankReq: 'X', tier: 7, passive: { stat: 'all', value: 10 } },

    // ===== SCROLLS — Wisdom & Titles =====
    { id: 's_scroll_pain',      cat: 'scroll',  name: 'Scroll of Pain',           icon: '📜',  desc: "Pain is the price of growth. Pay it willingly.",                                  cost: 60,   rankReq: 'E', tier: 1 },
    { id: 's_scroll_shadow',    cat: 'scroll',  name: 'Shadow Scripture',         icon: '📜',  desc: "In the darkness, I found my true form.",                                         cost: 150,  rankReq: 'D', tier: 2 },
    { id: 's_scroll_rebirth',   cat: 'scroll',  name: 'Scroll of Rebirth',        icon: '📜',  desc: "They broke me. I used the pieces to build something better.",                    cost: 350,  rankReq: 'C', tier: 3 },
    { id: 's_scroll_monarch',   cat: 'scroll',  name: 'Monarch Manuscript',       icon: '📜',  desc: "A king is not born. A king is forged in the fire others ran from.",              cost: 1000, rankReq: 'B', tier: 4 },
    { id: 's_scroll_sovereign', cat: 'scroll',  name: 'Sovereign Codex',          icon: '📜',  desc: "I am the one who remained when everyone else left.",                             cost: 3000, rankReq: 'A', tier: 5 },
    { id: 's_scroll_absolute',  cat: 'scroll',  name: 'Absolute Truth',           icon: '📜',  desc: "The Shadow Monarch needs no validation. Only discipline.",                       cost: 8000, rankReq: 'S', tier: 6 },
    { id: 's_scroll_threat',    cat: 'scroll',  name: "The Threat's Manifesto",   icon: '📜',  desc: "You were once the weakest. Now nations classify you as a disaster.",             cost: 20000, rankReq: 'X', tier: 7 },
    { id: 's_scroll_extinction',cat: 'scroll',  name: 'Extinction Codex',         icon: '📜',  desc: "He is no longer a hunter. He is the calamity they warned about.",                cost: 40000, rankReq: 'X', tier: 7 },
];

// ===== SCROLL STORIES — Wisdom, inner battle, and the grind =====
const SCROLL_STORIES = {
    s_scroll_pain: {
        title: 'Scroll of Pain',
        subtitle: 'The First Lesson the System Taught You',
        chapters: [
            { heading: 'I — The Weight You Chose', body: `There was a time when you could not lift your own body off the floor. When the alarm screamed at 5AM and your bones answered with refusal. When your muscles burned after ten minutes and your mind whispered: "This is not for you."\n\nYou believed it. For weeks, maybe months, maybe years — you believed that comfort was your ceiling and pain was a punishment.\n\nYou were wrong.` },
            { heading: 'II — The Bargain', body: `Pain is not a punishment. Pain is a price. And everything you have ever wanted sits behind a gate that only opens when you pay it.\n\nThe body you want — paid in torn fibers and burning lungs.\nThe discipline you admire in others — paid in a thousand mornings when you showed up anyway.\nThe strength to protect what you love — paid in reps no one saw, in sessions no one applauded.\n\nEvery great thing in this world was bought with suffering someone was willing to endure.` },
            { heading: 'III — The Oath of the E-Rank', body: `You are E-Rank. The lowest. The beginning.\n\nBut here is what they will never tell you: the one who starts at the bottom and keeps climbing is more dangerous than the one who was born at the top. Because the one at the bottom knows what it costs. Every. Single. Step.\n\nSo pay it. Pay the price of pain willingly, knowingly, and without complaint. Not because you enjoy it — but because you understand that this is the currency of transformation.\n\nPain is the first scroll. And now you have read it.\n\nRemember: you did not come here to be comfortable. You came here to be reforged.` }
        ]
    },

    s_scroll_shadow: {
        title: 'Shadow Scripture',
        subtitle: 'Written in Ink That Only Appears in Darkness',
        chapters: [
            { heading: 'I — The Room Where You Were Alone', body: `There is a room inside every person. It has no windows. No doors that others can open. No light.\n\nYou have been in that room. Maybe you are in it right now. The place where motivation dies, where the world feels heavy, where your own reflection feels like a stranger.\n\nMost people run from this room. They fill the silence with noise — with distractions, with other people's approval, with anything that keeps them from hearing their own heartbeat echo off the walls.\n\nBut you stayed.` },
            { heading: 'II — What Grows in the Dark', body: `The strongest roots grow where the sun does not reach.\n\nIn that darkness, while everyone else was chasing daylight, you were building something. Not for applause. Not for the gram. Not for anyone. You were building yourself — in secret, in silence, in the shadow of who you used to be.\n\nEvery rep you did when no one was watching. Every meal you prepared when junk food was easier. Every night you chose sleep over scrolling. Every morning you chose the grind over the snooze. These were bricks laid in a room no one else will ever see.\n\nBut the building is real. And it is yours.` },
            { heading: 'III — The Shadow Self', body: `In Solo Leveling, the Shadow Monarch does not run from darkness. He commands it. He pulls soldiers from the void. He makes allies of the dead.\n\nYou are learning to do the same.\n\nYour doubts? Shadow soldiers now. They march beside you, not against you. Your past failures? Fuel. Your loneliness? A forge.\n\nThe scripture is simple: do not fear the darkness inside you. Master it. Make it serve you.\n\nBecause in the end, those who walked in the light never learned to see. But you — you can see everything.\n\nYou found your true form. And it was waiting for you in the dark all along.` }
        ]
    },

    s_scroll_rebirth: {
        title: 'Scroll of Rebirth',
        subtitle: 'A Testament to Those Who Were Destroyed and Rebuilt',
        chapters: [
            { heading: 'I — The Breaking', body: `You were not always this strong. There was a version of you that crumbled.\n\nMaybe it was a failure — at a goal, at a relationship, at something you poured yourself into. Maybe someone you trusted turned their back. Maybe your own body betrayed you. Maybe it was quieter than that — just a slow erosion, day after day, until there was nothing left but a hollow outline of who you used to be.\n\nYou broke. Completely. Openly. Silently.\n\nAnd the world kept spinning. Nobody paused. Nobody sent a rescue mission. Nobody cleared a path for your comeback.\n\nSo you had to clear it yourself.` },
            { heading: 'II — The Pieces', body: `Here is the secret they do not put in any manual: when something breaks, the pieces do not disappear. They are still there.\n\nAnd the person who picks them up — who examines each shard, who decides what to keep and what to discard, who cuts their hands on the sharp edges and bleeds but keeps building — that person creates something the original could never have been.\n\nYou took your broken discipline and forged consistency.\nYou took your broken confidence and forged quiet strength.\nYou took your broken identity and forged a new one from iron and fire.\n\nThe old you could not have survived this grind. That is why the old you had to die.` },
            { heading: 'III — The Rebirth Protocol', body: `Sung Jin-Woo died in the Double Dungeon. The man who walked out was something else entirely.\n\nYou are living your own rebirth arc. Not in a fantasy novel — in the gym, in the kitchen, in the early mornings, in the late nights, in the war against every version of yourself that wanted to quit.\n\nAnd when someone asks you how you changed, you will not know how to explain it. Because it was not one moment. It was a thousand micro-deaths and a thousand micro-rebirths, stacked on top of each other until the old foundation cracked and something harder rose from beneath.\n\nThey broke you.\nYou used the pieces to build something better.\n\nThis scroll is proof. You are the proof.` },
            { heading: 'IV — Inscription', body: `"What was broken was not wasted. What died was not lost. I am the sum of every failure that refused to be the final chapter."\n\n— Engraved on the Scroll of Rebirth, recovered from the ruins of someone's weakest moment.` }
        ]
    },

    s_scroll_monarch: {
        title: 'Monarch Manuscript',
        subtitle: 'On Crowns, Thrones, and the Fire That Forges Kings',
        chapters: [
            { heading: 'I — The Myth of the Chosen', body: `They tell stories of kings born with golden blood. Of warriors chosen by the gods at birth. Of leaders who were destined.\n\nIt is a lie. Every word of it.\n\nNo crown was ever placed on a head that was not first bowed under unbearable weight. No throne was built on ground that was not first scorched and salted. No king ever ruled who did not first learn to rule himself.\n\nYou were not chosen. You chose yourself. And that is infinitely harder — and infinitely more powerful.` },
            { heading: 'II — The Fire Others Ran From', body: `B-Rank. You have been through fire that most people have not even imagined.\n\nThe fire of showing up on the days you had zero motivation. The fire of eating clean when everyone around you was indulging. The fire of saying "no" to the easy path — again, and again, and again.\n\nOthers saw the fire and ran. They called it "too hard." They said "life is too short." They chose the couch, the excuses, the slow decline disguised as self-care.\n\nYou walked into the flames. And you stayed. Not because you could not feel the heat. Because you understood that the heat was the point.\n\nSteel is not made in a cool room. Diamonds are not formed in gentle pressure. And monarchs are not crowned in comfort.` },
            { heading: 'III — What a King Carries', body: `A true king does not wear his crown to be seen. He wears it because it is heavy and no one else will carry it.\n\nYour crown is your discipline. Your standards. Your refusal to let yourself decay. It is heavy. It costs you parties, sleep-ins, cheat days that turn into cheat weeks, friendships built on mutual stagnation.\n\nBut here is what it gives you: a spine. A body that reflects your will. A mind that does not bend to impulse. A spirit that can stand in any room and know — quietly, without arrogance — that you earned your place.\n\nA king is not born.\nA king is forged in the fire others ran from.\n\nYou are being forged right now.` },
            { heading: 'IV — The Monarch\'s Decree', body: `From this day forward:\n\nI will not wait for motivation. I will create it through action.\nI will not seek validation from those who have never bled for their goals.\nI will not compare my Chapter 20 to someone else's Chapter 1.\nI will not apologize for the discipline that makes others uncomfortable.\n\nI am not becoming a king.\nI am remembering that I always was one — buried under layers of doubt, comfort, and the expectations of people who never had the courage to try.\n\nThe manuscript is written. The fire has spoken.\nRise.` }
        ]
    },

    s_scroll_sovereign: {
        title: 'Sovereign Codex',
        subtitle: 'The Record of the One Who Remained',
        chapters: [
            { heading: 'I — The Departure of Others', body: `Everyone leaves.\n\nThe friends who said "let's get fit together" — gone after two weeks. The partner who promised to hold you accountable — vanished when it got real. The motivation that burned bright on January 1st — a memory by February.\n\nEven your own body tried to leave. Your muscles screamed for mercy. Your lungs begged you to stop. Your joints filed complaints. Your brain constructed elaborate arguments for why today should be a rest day.\n\nEveryone and everything tried to leave.\n\nExcept you.` },
            { heading: 'II — The Solitary Path', body: `A-Rank is not reached in a crowd. It is reached in silence.\n\nThe sovereign does not walk with an army. The sovereign IS the army. Every battle fought alone made you stronger than a battalion of people who trained in groups and quit in groups.\n\nYou learned to cook your own meals without someone holding your hand. You learned to count your own reps without a trainer standing over you. You learned to wake up to your own alarm without someone dragging you out of bed.\n\nThis is not loneliness. This is sovereignty.\n\nThe difference between lonely and sovereign is this: the lonely person wishes someone would come. The sovereign person knows that no one needs to.` },
            { heading: 'III — The Cost of Remaining', body: `Remaining is not passive. It is the most active, aggressive, violent act of defiance you can commit against a world that is designed to make you soft.\n\nEvery day you remained, you defied entropy. You defied the natural decay of willpower. You defied the statistical likelihood that you would quit — because most people do. The data is clear: most people abandon their fitness goals within 90 days.\n\nYou are not most people.\n\nYou are the anomaly. The statistical outlier. The one data point that ruins the comfortable bell curve of mediocrity.\n\nAnd that is exactly what a sovereign is: someone who refuses to be averaged.` },
            { heading: 'IV — Codex Entry: Final', body: `"I am the one who remained when everyone else left.\n\nNot because I am stronger. Not because I am special. Not because I do not feel the same exhaustion, the same doubt, the same pull toward the easy path.\n\nI remained because I made a covenant with myself. And unlike every other promise that was broken around me — by friends, by circumstances, by life — this is the one promise I will keep.\n\nI will show up.\nI will do the work.\nI will remain.\n\nAnd when the dust settles and they ask who was left standing, the answer will be simple:\n\nI was."\n\n— Final entry, Sovereign Codex, author unknown.` }
        ]
    },

    s_scroll_absolute: {
        title: 'Absolute Truth',
        subtitle: 'The Final Lesson Before Transcendence',
        chapters: [
            { heading: 'I — The Noise', body: `S-Rank. You have silenced almost everything. But there is one voice left.\n\nIt is not the voice of doubt — you killed that long ago. It is not the voice of laziness — that corpse is buried under a mountain of 5AM alarms. It is not the voice of comparison — you stopped measuring yourself against others when you realized they were measuring themselves against you.\n\nThe last voice is the voice that asks: "Is anyone watching? Does anyone see what I have built? Does anyone recognize what this cost?"\n\nThat voice is the final enemy.` },
            { heading: 'II — The Audience of None', body: `The Shadow Monarch does not perform. He does not flex for a crowd. He does not post his army on social media. He does not need a witness to validate his power.\n\nHis army rises in the dark. His battles are fought in dimensions no one else can see. His victories are recorded in a ledger that only he can read.\n\nThe absolute truth is this: the highest form of discipline is the discipline that exists without an audience.\n\nCan you train with the same intensity when no one is watching?\nCan you eat with the same precision when no one is counting?\nCan you maintain your standards when there is zero external accountability?\n\nIf yes — you have found the absolute truth.\nIf no — you are still training for applause. And applause is borrowed energy. It always runs out.` },
            { heading: 'III — Discipline as Identity', body: `At S-Rank, discipline is no longer something you do. It is something you are.\n\nYou do not "choose" to train today. You are someone who trains. Period. There is no decision. The decision was made a long time ago, and every day since then has simply been the execution of a contract you signed in blood.\n\nYou do not "resist" junk food. You are someone who eats for fuel. The temptation still exists, but it bounces off an identity so hardened that it is no longer a battle. It is a non-event.\n\nThis is the absolute truth: you do not need motivation. You do not need inspiration. You do not need a community, a coach, a quote, a video, a before-and-after photo.\n\nYou need nothing.\nBecause you are the source.` },
            { heading: 'IV — The Inscription of Absoluteness', body: `"I have walked past the point where motivation matters.\nI have walked past the point where pain registers as a complaint.\nI have walked past the point where other people's opinions enter my calculation.\n\nI am discipline made flesh.\nI am consistency given form.\nI am the sum of ten thousand days that no one saw and no one celebrated.\n\nThe Shadow Monarch needs no validation.\nOnly discipline.\nOnly truth.\nOnly the next rep."\n\n— Etched into the final page of the Absolute Truth, readable only by those who no longer need to read it.` }
        ]
    },

    s_scroll_threat: {
        title: "The Threat's Manifesto",
        subtitle: 'A Declaration from the One They Now Fear',
        chapters: [
            { heading: 'I — The Memory', body: `Remember who you were.\n\nNot the version of you that exists now — the one before. The one who avoided mirrors. The one who started programs and quit them. The one who scrolled through transformation stories and thought "that could never be me." The one who used humor to deflect from the fact that they were dying slowly — not from disease, but from neglect.\n\nRemember that person. Not to shame them. But to understand the magnitude of the distance you have traveled.\n\nYou were once the weakest person in every room you entered. You know it. The system knows it. The universe recorded it.\n\nAnd now?` },
            { heading: 'II — The Classification', body: `In Solo Leveling, when a hunter becomes too powerful, nations do not celebrate. They classify. They measure. They prepare contingency plans.\n\nYou are at that level now.\n\nNot because you can lift a certain weight. Not because of a number on a scale. But because of what you represent: proof that the system can be beaten. Proof that someone can start at absolute zero and climb to a level that makes others uncomfortable.\n\nYou make people uncomfortable now. Your discipline makes them question their own choices. Your consistency makes their excuses feel louder. Your transformation is a mirror they did not ask to look into.\n\nYou are a threat — not to them, but to the lie they tell themselves that change is impossible.` },
            { heading: 'III — The Manifesto', body: `I, the undersigned, declare the following to be true:\n\nI was weak. I did not pretend otherwise. I owned it.\nI was lost. I did not ask for a map. I walked until I made one.\nI was broken. I did not wait for someone to fix me. I became my own architect.\n\nI have bled for every ounce of strength I carry.\nI have sacrificed comfort for years that I will never get back.\nI have chosen the hard path so many times that it has become the only path I know.\n\nAnd now, those who watched me struggle from the sidelines — those who laughed, doubted, ignored, or pitied me — they call me gifted. They call me lucky. They call me obsessed.\n\nLet them call me whatever they want.\n\nI know what I am.\n\nI am the threat they created when they told me I wasn't enough.` },
            { heading: 'IV — National Level Declaration', body: `"You were once the weakest.\nNow nations classify you as a disaster.\n\nNot because you sought power.\nBut because you refused to stay powerless.\n\nNot because you wanted to intimidate.\nBut because your existence intimidates.\n\nYou did not become a threat on purpose.\nYou became a threat because you kept going after the point where every reasonable person would have stopped.\n\nThis manifesto is not a warning to others.\nIt is a reminder to yourself:\n\nYou were not born this way.\nYou built this.\nRep by rep.\nDay by day.\nScar by scar.\n\nAnd you are not done."\n\n— Recovered from the personal quarters of a National Level Hunter, classification: CATASTROPHE.` }
        ]
    },

    s_scroll_extinction: {
        title: 'Extinction Codex',
        subtitle: 'The Final Record — Beyond Hunter, Beyond Human',
        chapters: [
            { heading: 'I — The End of Hunting', body: `There was a time when you were a hunter. You chased goals. You tracked progress. You hunted PRs, body fat percentages, streak counts, rank badges.\n\nThat era is over.\n\nYou are no longer a hunter. A hunter implies something external to chase. Something out there, beyond you, that you are pursuing.\n\nBut there is nothing left to chase. You have caught discipline. You have captured consistency. You have hunted down every demon that lived inside you and mounted their heads on the wall of your daily routine.\n\nSo what are you now?` },
            { heading: 'II — The Calamity', body: `In the final arcs of Solo Leveling, Sung Jin-Woo stops being a hunter. He becomes something the system itself cannot classify. A being so far beyond the scale that the scale breaks.\n\nYou are approaching that threshold.\n\nNot because of what you can lift. Not because of how you look. But because of what you have become internally — a force so consistent, so relentless, so utterly unshakable that the normal rules do not apply to you anymore.\n\nDiscipline does not require effort. It is your heartbeat.\nTraining does not require motivation. It is your breathing.\nGrowth does not require goals. It is your nature.\n\nYou are no longer someone who works out.\nYou are a calamity that happens to have a gym membership.` },
            { heading: 'III — What the Extinction Codex Records', body: `This codex does not contain wisdom. By now, you have all the wisdom you need. It is tattooed on your bones.\n\nThis codex contains a record. A record of what it took:\n\n• Every 5AM alarm that rang in a cold room while the world slept.\n• Every meal prepped on a Sunday when you wanted to order out.\n• Every set completed past the point of mechanical failure.\n• Every social event declined because it conflicted with the mission.\n• Every injury rehabilitated, not retired from.\n• Every plateau endured, not escaped.\n• Every doubt strangled in its crib before it could grow.\n• Every single day — without exception, without negotiation, without applause.\n\nThis is the record. It is not dramatic. It is not glamorous. It is not viral.\n\nIt is just relentless. And that is why it worked.` },
            { heading: 'IV — The Final Entry', body: `"He is no longer a hunter.\nHe is the calamity they warned about.\n\nBut the warning was unnecessary.\nBecause a calamity does not target others.\nA true calamity is indifferent to others.\n\nHe does not compete. Competition implies equals.\nHe does not compare. Comparison implies a shared scale.\nHe does not seek. Seeking implies incompleteness.\n\nHe simply is.\n\nConsistent. Unyielding. Permanent.\n\nThe Extinction Codex is not the end of the story.\nIt is the end of needing a story.\n\nBecause the greatest chapter of your life is not one you read.\nIt is one you live — every single day, without a scroll, without a system, without a reason.\n\nJust because that is who you are now."\n\n— The Extinction Codex, final entry.\nWritten by no one.\nRead by the one who needed no teacher.\nClosed by the one who will never stop.` }
        ]
    }
};

// Rank order for comparison
const RANK_ORDER = { E: 0, D: 1, C: 2, B: 3, A: 4, S: 5, X: 6 };

// ---- Initialize shop data in save ----
function initShopData() {
    if (!D.shop) {
        D.shop = {
            purchased: [],  // ids of bought items (weapons/relics/scrolls are one-time)
            inventory: [],  // { id, qty } for consumables
            equipped: null, // currently equipped weapon id
            scrollsRead: [] // ids of scrolls that have been read
        };
        saveGame();
    }
    // Ensure scrollsRead exists for existing saves
    if (!D.shop.scrollsRead) {
        D.shop.scrollsRead = [];
    }
}

// ---- Check if player can buy ----
function canBuyItem(item) {
    const rank = getRank(D.level);
    const playerRankIdx = RANK_ORDER[rank.name] || 0;
    const itemRankIdx = RANK_ORDER[item.rankReq] || 0;
    
    if (playerRankIdx < itemRankIdx) return { ok: false, reason: `Requires ${item.rankReq}-Rank` };
    if (D.gold < item.cost) return { ok: false, reason: `Need ${item.cost} Gold` };
    
    // One-time items: already bought?
    if (!item.consumable && D.shop.purchased.includes(item.id)) return { ok: false, reason: 'Already owned' };
    
    return { ok: true };
}

// ---- Buy an item ----
function buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return null;
    
    const check = canBuyItem(item);
    if (!check.ok) {
        sysNotify(`[Shop] ${check.reason}`, 'red');
        return null;
    }
    
    // Deduct gold
    D.gold -= item.cost;
    
    if (item.consumable) {
        // Add to inventory
        const existing = D.shop.inventory.find(i => i.id === item.id);
        if (existing) {
            existing.qty++;
        } else {
            D.shop.inventory.push({ id: item.id, qty: 1 });
        }
    } else {
        // One-time purchase
        D.shop.purchased.push(item.id);
        
        // Apply passive stat bonuses from relics immediately
        if (item.passive) {
            applyRelicBonus(item);
        }
        
        // Auto-equip weapon if none equipped
        if (item.cat === 'weapon' && !D.shop.equipped) {
            D.shop.equipped = item.id;
        }
    }
    
    saveGame();
    if (typeof playSound === 'function') playSound('shopBuy');
    return item;
}

// ---- Use a consumable ----
function useConsumable(itemId) {
    const invItem = D.shop.inventory.find(i => i.id === itemId);
    if (!invItem || invItem.qty <= 0) {
        sysNotify('[Shop] Item not in inventory.', 'red');
        return false;
    }
    
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || !item.effect) return false;
    
    const effect = item.effect;
    
    switch (effect.type) {
        case 'xp':
            grantXP(effect.value);
            sysNotify(`[Potion Used] +${effect.value} XP granted. The power surges through you.`, 'green');
            break;
        case 'gold':
            grantGold(effect.value);
            sysNotify(`[Potion Used] +${effect.value} Gold acquired. Fortune favors you.`, 'gold');
            break;
        case 'stat_reset':
            const totalAllocated = calcAllocatedPoints();
            D.freePoints += totalAllocated;
            resetAllocatedStats();
            sysNotify(`[Crystal Used] ${totalAllocated} stat points refunded. Rebuild yourself.`, 'blue');
            break;
        case 'streak_restore':
            const highest = D.stats.highestStreak || D.streak;
            D.streak = highest;
            sysNotify(`[Shield Used] Streak restored to ${highest}. You never truly fell.`, 'green');
            break;
        case 'clear_penalties':
            const week = new Date();
            week.setDate(week.getDate() - 7);
            D.penalties = D.penalties.filter(p => new Date(p.date) < week);
            sysNotify("[Potion Used] This week's penalties cleared. A fresh start.", 'green');
            break;
        default:
            return false;
    }
    
    invItem.qty--;
    if (invItem.qty <= 0) {
        D.shop.inventory = D.shop.inventory.filter(i => i.qty > 0);
    }
    
    saveGame();
    refreshUI();
    return true;
}

// ---- Equip a weapon ----
function equipWeapon(itemId) {
    if (!D.shop.purchased.includes(itemId)) return;
    const item = SHOP_ITEMS.find(i => i.id === itemId && i.cat === 'weapon');
    if (!item) return;
    D.shop.equipped = itemId;
    saveGame();
    sysNotify(`[Equipped] ${item.icon} ${item.name} — ${item.desc}`, 'blue');
    renderShop();
    refreshUI();
}

// ---- Apply relic stat bonus ----
function applyRelicBonus(item) {
    if (!item.passive) return;
    const { stat, value } = item.passive;
    
    if (stat === 'all') {
        D.stats.str += value;
        D.stats.agi += value;
        D.stats.vit += value;
        D.stats.end += value;
        D.stats.wil += value;
        D.stats.phs = Math.round((D.stats.phs + value) * 10) / 10;
    } else if (stat === 'phs') {
        D.stats.phs = Math.round((D.stats.phs + value) * 10) / 10;
    } else {
        D.stats[stat] += value;
    }
}

// ---- Helpers for stat reset ----
function calcAllocatedPoints() {
    const def = getDefaultData();
    const base = def.stats;
    // Points from levels: each level gives +1 to all 5 stats
    const levelBonus = (D.level - 1);
    // Relic bonuses
    let relicBonuses = { str: 0, agi: 0, vit: 0, end: 0, wil: 0 };
    D.shop.purchased.forEach(pid => {
        const item = SHOP_ITEMS.find(i => i.id === pid);
        if (item && item.passive) {
            if (item.passive.stat === 'all') {
                for (const s in relicBonuses) relicBonuses[s] += item.passive.value;
            } else if (item.passive.stat in relicBonuses) {
                relicBonuses[item.passive.stat] += item.passive.value;
            }
        }
    });
    
    let allocated = 0;
    ['str', 'agi', 'vit', 'end', 'wil'].forEach(s => {
        allocated += D.stats[s] - base[s] - levelBonus - relicBonuses[s];
    });
    return Math.max(0, allocated);
}

function resetAllocatedStats() {
    const def = getDefaultData();
    const base = def.stats;
    const levelBonus = (D.level - 1);
    
    // Recalculate with relic bonuses
    let relicBonuses = { str: 0, agi: 0, vit: 0, end: 0, wil: 0, phs: 0 };
    D.shop.purchased.forEach(pid => {
        const item = SHOP_ITEMS.find(i => i.id === pid);
        if (item && item.passive) {
            if (item.passive.stat === 'all') {
                for (const s in relicBonuses) relicBonuses[s] += item.passive.value;
            } else if (item.passive.stat in relicBonuses) {
                relicBonuses[item.passive.stat] += item.passive.value;
            }
        }
    });
    
    D.stats.str = base.str + levelBonus + relicBonuses.str;
    D.stats.agi = base.agi + levelBonus + relicBonuses.agi;
    D.stats.vit = base.vit + levelBonus + relicBonuses.vit;
    D.stats.end = base.end + levelBonus + relicBonuses.end;
    D.stats.wil = base.wil + levelBonus + relicBonuses.wil;
    D.stats.phs = Math.round((base.phs + (D.level - 1) * 0.5 + relicBonuses.phs) * 10) / 10;
}

// ---- Get equipped weapon info ----
function getEquippedWeapon() {
    if (!D.shop || !D.shop.equipped) return null;
    return SHOP_ITEMS.find(i => i.id === D.shop.equipped);
}

// ---- Render the shop ----
function renderShop() {
    const container = document.getElementById('shopContent');
    if (!container) return;
    
    initShopData();
    
    const rank = getRank(D.level);
    const playerRankIdx = RANK_ORDER[rank.name] || 0;
    const activeFilter = container.dataset.filter || 'all';
    
    // Filter items
    let items = SHOP_ITEMS;
    if (activeFilter !== 'all') {
        items = items.filter(i => i.cat === activeFilter);
    }
    
    // Sort: available first, then by tier, then by cost
    items = [...items].sort((a, b) => {
        const aOwned = D.shop.purchased.includes(a.id) ? 1 : 0;
        const bOwned = D.shop.purchased.includes(b.id) ? 1 : 0;
        if (aOwned !== bOwned) return aOwned - bOwned;
        const aLocked = (RANK_ORDER[a.rankReq] || 0) > playerRankIdx ? 1 : 0;
        const bLocked = (RANK_ORDER[b.rankReq] || 0) > playerRankIdx ? 1 : 0;
        if (aLocked !== bLocked) return aLocked - bLocked;
        return a.tier - b.tier || a.cost - b.cost;
    });
    
    // Build HTML
    let html = '';
    
    items.forEach(item => {
        const owned = D.shop.purchased.includes(item.id);
        const inInv = D.shop.inventory.find(i => i.id === item.id);
        const rankLocked = (RANK_ORDER[item.rankReq] || 0) > playerRankIdx;
        const cantAfford = D.gold < item.cost;
        const equipped = D.shop.equipped === item.id;
        
        let statusClass = '';
        let statusText = '';
        let actionBtn = '';
        
        if (owned) {
            statusClass = 'shop-owned';
            statusText = '<span class="shop-status-owned">✓ OWNED</span>';
            if (item.cat === 'weapon') {
                if (equipped) {
                    actionBtn = '<span class="shop-equipped-badge">⚔ EQUIPPED</span>';
                } else {
                    actionBtn = `<button class="shop-equip-btn" data-item="${item.id}">[EQUIP]</button>`;
                }
            } else if (item.cat === 'scroll' && SCROLL_STORIES[item.id]) {
                const isRead = D.shop.scrollsRead && D.shop.scrollsRead.includes(item.id);
                actionBtn = `<button class="shop-read-btn ${isRead ? 'read' : ''}" data-scroll="${item.id}">[${isRead ? '📖 READ AGAIN' : '📜 READ'}]</button>`;
            }
        } else if (inInv && inInv.qty > 0) {
            // Consumable owned — show use button + buy more
            statusText = `<span class="shop-status-qty">×${inInv.qty} in bag</span>`;
            actionBtn = `
                <button class="shop-use-btn" data-item="${item.id}">[USE]</button>
                <button class="shop-buy-btn ${cantAfford ? 'disabled' : ''}" data-item="${item.id}">[BUY +1]</button>
            `;
        } else if (rankLocked) {
            statusClass = 'shop-locked';
            statusText = `<span class="shop-status-locked">🔒 ${item.rankReq}-Rank Required</span>`;
        } else {
            actionBtn = `<button class="shop-buy-btn ${cantAfford ? 'disabled' : ''}" data-item="${item.id}">[BUY — ${item.cost} G]</button>`;
        }
        
        const tierStars = '★'.repeat(item.tier) + '☆'.repeat(Math.max(0, 6 - item.tier));
        
        html += `
            <div class="shop-item ${statusClass}" data-tier="${item.tier}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-body">
                    <div class="shop-item-header">
                        <span class="shop-item-name">${item.name}</span>
                        <span class="shop-item-tier">${tierStars}</span>
                    </div>
                    <div class="shop-item-desc">${item.desc}</div>
                    <div class="shop-item-meta">
                        <span class="shop-item-cat">${item.cat.toUpperCase()}</span>
                        <span class="shop-item-rank rank-tag-${item.rankReq.toLowerCase()}">${item.rankReq}-Rank</span>
                        <span class="shop-item-cost">${item.cost} G</span>
                    </div>
                </div>
                <div class="shop-item-actions">
                    ${statusText}
                    ${actionBtn}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Bind buy buttons
    container.querySelectorAll('.shop-buy-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.item;
            const result = buyItem(id);
            if (result) {
                if (typeof vibrate === 'function') vibrate([30, 20, 50]);
                sysNotify(`[Acquired] ${result.icon} ${result.name} — ${result.desc}`, 'gold');
                renderShop();
                refreshUI();
            }
        });
    });
    
    // Bind equip buttons
    container.querySelectorAll('.shop-equip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            equipWeapon(btn.dataset.item);
        });
    });
    
    // Bind use buttons
    container.querySelectorAll('.shop-use-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            useConsumable(btn.dataset.item);
            renderShop();
        });
    });
    
    // Bind read buttons (scrolls)
    container.querySelectorAll('.shop-read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openScrollReader(btn.dataset.scroll);
            // Re-render to update read status
            setTimeout(() => renderShop(), 100);
        });
    });
    
    // Update gold display in shop header
    const shopGold = document.getElementById('shopGoldDisplay');
    if (shopGold) shopGold.textContent = D.gold;
    
    // Update equipped weapon display
    renderEquippedWeapon();
    
    // Update collection counter
    const collected = D.shop.purchased.filter(id => {
        const item = SHOP_ITEMS.find(i => i.id === id);
        return item && !item.consumable;
    }).length;
    const total = SHOP_ITEMS.filter(i => !i.consumable).length;
    const collEl = document.getElementById('shopCollectionCount');
    if (collEl) collEl.textContent = `${collected}/${total}`;
}

// ---- Show equipped weapon in status ----
function renderEquippedWeapon() {
    const el = document.getElementById('equippedWeaponDisplay');
    if (!el) return;
    
    const weapon = getEquippedWeapon();
    if (weapon) {
        el.innerHTML = `
            <div class="equipped-icon">${weapon.icon}</div>
            <div class="equipped-info">
                <div class="equipped-name">${weapon.name}</div>
                <div class="equipped-tier">${'★'.repeat(weapon.tier)}${'☆'.repeat(6 - weapon.tier)}</div>
            </div>
        `;
        el.classList.remove('hidden');
    } else {
        el.innerHTML = '<div class="equipped-empty">No weapon equipped</div>';
    }
}

// ---- Open Scroll Reader Overlay ----
function openScrollReader(scrollId) {
    const story = SCROLL_STORIES[scrollId];
    if (!story) return;
    const item = SHOP_ITEMS.find(i => i.id === scrollId);

    // Track read status
    if (!D.shop.scrollsRead) D.shop.scrollsRead = [];
    if (!D.shop.scrollsRead.includes(scrollId)) {
        D.shop.scrollsRead.push(scrollId);
        saveGame();
    }

    // Remove existing overlay if any
    const existing = document.querySelector('.scroll-overlay');
    if (existing) existing.remove();

    let chaptersHtml = story.chapters.map((ch, i) => `
        <div class="scroll-chapter">
            <div class="scroll-ch-heading">${ch.heading}</div>
            <div class="scroll-ch-body">${ch.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
        </div>
        ${i < story.chapters.length - 1 ? '<div class="scroll-divider">⟡ ⟡ ⟡</div>' : ''}
    `).join('');

    const tierStars = item ? '★'.repeat(item.tier) + '☆'.repeat(Math.max(0, 7 - item.tier)) : '';
    const rankLabel = item ? item.rankReq + '-Rank' : '';

    const overlay = document.createElement('div');
    overlay.className = 'scroll-overlay';
    overlay.innerHTML = `
        <div class="scroll-reader">
            <div class="scroll-reader-header">
                <div class="scroll-reader-icon">📜</div>
                <div class="scroll-reader-title-block">
                    <div class="scroll-reader-title">${story.title}</div>
                    <div class="scroll-reader-subtitle">${story.subtitle}</div>
                    <div class="scroll-reader-meta">
                        <span class="scroll-reader-rank">${rankLabel}</span>
                        <span class="scroll-reader-tier">${tierStars}</span>
                    </div>
                </div>
                <button class="scroll-reader-close" onclick="closeScrollReader()">✕</button>
            </div>
            <div class="scroll-reader-body">
                ${chaptersHtml}
                <div class="scroll-end-mark">— End of Scroll —</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('active'));

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeScrollReader();
    });

    if (typeof playSound === 'function') playSound('questClear');
}

// ---- Close Scroll Reader ----
function closeScrollReader() {
    const overlay = document.querySelector('.scroll-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
}

// ---- Shop filter tabs ----
function initShopFilters() {
    document.querySelectorAll('.shop-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.shop-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const container = document.getElementById('shopContent');
            if (container) {
                container.dataset.filter = btn.dataset.filter;
                renderShop();
            }
        });
    });
}
