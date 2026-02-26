// ==========================================
//  FEATURES.JS — Shadow Missions, Boss Raid,
//  Shadow Army, Daily Login Rewards
// ==========================================

// ============= SURPRISE SHADOW MISSIONS =============
const SHADOW_MISSIONS = [
    // Quick Burst challenges (30-120 sec timer)
    { title: '⚡ SHADOW SURGE', desc: 'Drop and do 20 push-ups RIGHT NOW!', timer: 90, xp: 120, gold: 30, type: 'burst' },
    { title: '⚡ GHOST SPRINT', desc: '30 seconds of high-knees — GO!', timer: 60, xp: 100, gold: 25, type: 'burst' },
    { title: '⚡ IRON HOLD', desc: 'Hold a plank for 45 seconds. The shadows are watching.', timer: 60, xp: 110, gold: 28, type: 'burst' },
    { title: '⚡ SHADOW SQUATS', desc: '25 bodyweight squats. Feel the burn. Embrace it.', timer: 75, xp: 100, gold: 25, type: 'burst' },
    { title: '⚡ PHANTOM BURSTS', desc: '10 burpees. No rest. No mercy.', timer: 90, xp: 140, gold: 35, type: 'burst' },
    { title: '⚡ DEMON LUNGES', desc: '20 walking lunges. Each step brings power.', timer: 75, xp: 100, gold: 25, type: 'burst' },
    { title: '⚡ SHADOW DIPS', desc: '15 dips on any surface — chair, bench, floor.', timer: 60, xp: 90, gold: 22, type: 'burst' },
    { title: '⚡ MONARCH\'S CRUNCH', desc: '30 crunches. The core is the throne of power.', timer: 75, xp: 95, gold: 24, type: 'burst' },
    // Discipline challenges
    { title: '🧊 COLD DECREE', desc: 'Splash cold water on your face or take a cold shower now.', timer: 120, xp: 80, gold: 20, type: 'discipline' },
    { title: '🧘 SHADOW SILENCE', desc: '60 seconds of eyes-closed deep breathing. Still your mind.', timer: 90, xp: 70, gold: 18, type: 'discipline' },
    { title: '💧 HYDRATION ORDER', desc: 'Drink a full glass of water right now. Fuel the machine.', timer: 45, xp: 50, gold: 12, type: 'discipline' },
    { title: '📖 MENTAL GATE', desc: 'Read one page of any book. Knowledge is power.', timer: 120, xp: 60, gold: 15, type: 'discipline' },
    // Power challenges (harder, more reward)
    { title: '💀 MONARCH\'S TRIAL', desc: '15 push-ups + 15 squats + 30s plank. No breaks.', timer: 120, xp: 200, gold: 50, type: 'power' },
    { title: '💀 SHADOW GAUNTLET', desc: '10 burpees + 20 mountain climbers. Survive.', timer: 120, xp: 220, gold: 55, type: 'power' },
    { title: '💀 ARISE PROTOCOL', desc: '1 minute wall sit + 20 push-ups. The shadows demand it.', timer: 150, xp: 250, gold: 60, type: 'power' },
];

let shadowMissionActive = false;
let shadowMissionTimer = null;
let shadowMissionInterval = null;

function tryTriggerShadowMission() {
    if (shadowMissionActive) return;
    if (!D) return;
    
    // Don't trigger if player just started (level 1, no workouts)
    if (D.level < 2 && D.stats.totalWorkouts < 1) return;
    
    // Check cooldown — max 1 per 30 min
    const lastMission = D.lastShadowMission || 0;
    const now = Date.now();
    if (now - lastMission < 30 * 60 * 1000) return;
    
    // Random chance: ~15% on each trigger check
    if (Math.random() > 0.15) return;
    
    // Filter by level
    let pool = SHADOW_MISSIONS.filter(m => m.type === 'burst' || m.type === 'discipline');
    if (D.level >= 10) pool = pool.concat(SHADOW_MISSIONS.filter(m => m.type === 'power'));
    
    const mission = pool[Math.floor(Math.random() * pool.length)];
    showShadowMission(mission);
}

function showShadowMission(mission) {
    shadowMissionActive = true;
    D.lastShadowMission = Date.now();
    saveGame();
    
    if (typeof vibrate === 'function') vibrate([100, 50, 100, 50, 200]);
    
    const overlay = document.getElementById('shadowMissionOverlay');
    document.getElementById('smTitle').textContent = mission.title;
    document.getElementById('smDesc').textContent = mission.desc;
    document.getElementById('smReward').textContent = `+${mission.xp} XP · +${mission.gold} Gold`;
    
    let remaining = mission.timer;
    const timerEl = document.getElementById('smTimer');
    const timerFill = document.getElementById('smTimerFill');
    timerEl.textContent = remaining + 's';
    timerFill.style.width = '100%';
    
    overlay.classList.remove('hidden');
    overlay.classList.add('sm-entrance');
    setTimeout(() => overlay.classList.remove('sm-entrance'), 600);
    if (typeof playSound === 'function') playSound('shadowMission');
    
    shadowMissionInterval = setInterval(() => {
        remaining--;
        timerEl.textContent = remaining + 's';
        timerFill.style.width = ((remaining / mission.timer) * 100) + '%';
        
        if (remaining <= 10) timerFill.classList.add('sm-urgent');
        
        if (remaining <= 0) {
            failShadowMission(mission);
        }
    }, 1000);
    
    // Store current mission for the buttons
    overlay._mission = mission;
}

function completeShadowMission() {
    const overlay = document.getElementById('shadowMissionOverlay');
    const mission = overlay._mission;
    clearInterval(shadowMissionInterval);
    
    grantXP(mission.xp);
    grantGold(mission.gold);
    D.stats.shadowMissionsCompleted = (D.stats.shadowMissionsCompleted || 0) + 1;
    
    // Shadow army: every 3 missions = +1 soldier
    if (D.stats.shadowMissionsCompleted % 3 === 0) {
        D.shadowArmy = (D.shadowArmy || 0) + 1;
        sysNotify(`[Shadow Extraction] A new shadow soldier has joined your army! (${D.shadowArmy} total)`, 'gold');
    }
    
    saveGame();
    
    if (typeof vibrate === 'function') vibrate([40, 30, 40]);
    sysNotify(`[Mission Complete] ${mission.title} — +${mission.xp} XP, +${mission.gold} Gold`, 'green');
    
    // Check shadow soldier extractions (shadowMissions milestone)
    if (typeof checkShadowExtractions === 'function') setTimeout(() => checkShadowExtractions(), 1200);
    
    overlay.classList.add('hidden');
    shadowMissionActive = false;
    refreshUI();
}

function failShadowMission(mission) {
    clearInterval(shadowMissionInterval);
    const overlay = document.getElementById('shadowMissionOverlay');
    
    const xpLost = Math.round(mission.xp * 0.3);
    applyPenalty(`Shadow Mission failed: "${mission.title}"`, xpLost);
    
    if (typeof vibrate === 'function') vibrate([200]);
    sysNotify(`[Mission Failed] Time expired. -${xpLost} XP penalty.`, 'red');
    
    overlay.classList.add('hidden');
    shadowMissionActive = false;
    refreshUI();
}

function skipShadowMission() {
    clearInterval(shadowMissionInterval);
    const overlay = document.getElementById('shadowMissionOverlay');
    
    sysNotify('[Mission Declined] The shadows note your hesitation...', '');
    
    overlay.classList.add('hidden');
    shadowMissionActive = false;
}


// ============= WEEKLY BOSS RAID =============
const BOSS_POOL = {
    E: [
        { name: 'Dungeon Slime',        img: 'icons/Mbosses/delapouite/slime.svg',              hp: 300,  reward: { xp: 200,  gold: 70 } },
        { name: 'Cave Goblin',          img: 'icons/Mbosses/caro-asercion/goblin.svg',          hp: 350,  reward: { xp: 220,  gold: 75 } },
        { name: 'Goblin Scout',         img: 'icons/Mbosses/delapouite/goblin-head.svg',        hp: 320,  reward: { xp: 210,  gold: 72 } },
        { name: 'Wicked Gnome',         img: 'icons/Mbosses/cathelineau/bad-gnome.svg',         hp: 340,  reward: { xp: 215,  gold: 74 } },
        { name: 'Shadow Imp',           img: 'icons/Mbosses/lorc/imp.svg',                      hp: 380,  reward: { xp: 230,  gold: 78 } },
        { name: 'Cackling Imp',         img: 'icons/Mbosses/lorc/imp-laugh.svg',                hp: 360,  reward: { xp: 225,  gold: 76 } },
        { name: 'Gate Minion',          img: 'icons/Mbosses/delapouite/bully-minion.svg',       hp: 400,  reward: { xp: 240,  gold: 82 } },
        { name: 'Swamp Bat',            img: 'icons/Mbosses/delapouite/swamp-bat.svg',          hp: 310,  reward: { xp: 205,  gold: 71 } },
        { name: 'Shadow Bat',           img: 'icons/Mbosses/lorc/evil-bat.svg',                 hp: 330,  reward: { xp: 212,  gold: 73 } },
        { name: 'Maneater Plant',       img: 'icons/Mbosses/delapouite/carnivorous-plant.svg',  hp: 420,  reward: { xp: 250,  gold: 85 } },
        { name: 'Cursed Treant',        img: 'icons/Mbosses/lorc/evil-tree.svg',                hp: 450,  reward: { xp: 260,  gold: 88 } },
        { name: 'Ancient Treemask',     img: 'icons/Mbosses/cathelineau/tree-face.svg',         hp: 440,  reward: { xp: 255,  gold: 86 } },
        { name: 'Poison Toad',          img: 'icons/Mbosses/lorc/toad-teeth.svg',               hp: 370,  reward: { xp: 228,  gold: 77 } },
        { name: 'Tunnel Slug',          img: 'icons/Mbosses/delapouite/grasping-slug.svg',      hp: 350,  reward: { xp: 218,  gold: 74 } },
        { name: 'Ceiling Lurker',       img: 'icons/Mbosses/delapouite/ceiling-barnacle.svg',   hp: 390,  reward: { xp: 235,  gold: 80 } },
        { name: 'Parasitic Egg',        img: 'icons/Mbosses/delapouite/alien-egg.svg',          hp: 500,  reward: { xp: 290,  gold: 100 } },
        { name: 'Nest Egg',             img: 'icons/Mbosses/lorc/dinosaur-egg.svg',             hp: 550,  reward: { xp: 310,  gold: 110 } },
    ],
    D: [
        { name: 'Red Gate Ogre',        img: 'icons/Mbosses/delapouite/ogre.svg',               hp: 900,   reward: { xp: 480,  gold: 160 } },
        { name: 'Orc Warlord',          img: 'icons/Mbosses/delapouite/orc-head.svg',           hp: 950,   reward: { xp: 500,  gold: 170 } },
        { name: 'Bridge Troll',         img: 'icons/Mbosses/delapouite/troglodyte.svg',         hp: 1000,  reward: { xp: 520,  gold: 175 } },
        { name: 'Lizard Sentry',        img: 'icons/Mbosses/lorc/lizardman.svg',                hp: 1050,  reward: { xp: 540,  gold: 180 } },
        { name: 'Crawler',              img: 'icons/Mbosses/delapouite/half-body-crawling.svg', hp: 850,   reward: { xp: 460,  gold: 155 } },
        { name: 'Risen Dead',           img: 'icons/Mbosses/delapouite/shambling-zombie.svg',   hp: 880,   reward: { xp: 470,  gold: 158 } },
        { name: 'Mound Horror',         img: 'icons/Mbosses/delapouite/shambling-mound.svg',    hp: 1100,  reward: { xp: 560,  gold: 190 } },
        { name: 'Arachne',              img: 'icons/Mbosses/delapouite/spider-eye.svg',         hp: 1150,  reward: { xp: 580,  gold: 195 } },
        { name: 'Gel Golem',            img: 'icons/Mbosses/cathelineau/transparent-slime.svg',  hp: 1000,  reward: { xp: 520,  gold: 175 } },
        { name: 'Flesh Amalgam',        img: 'icons/Mbosses/lorc/fleshy-mass.svg',              hp: 1200,  reward: { xp: 600,  gold: 200 } },
        { name: 'Deep Sea Horror',      img: 'icons/Mbosses/delapouite/fish-monster.svg',       hp: 1100,  reward: { xp: 560,  gold: 190 } },
        { name: 'Abyssal Lurker',       img: 'icons/Mbosses/skoll/sea-creature.svg',            hp: 1150,  reward: { xp: 570,  gold: 192 } },
        { name: 'Tentacle Fiend',       img: 'icons/Mbosses/delapouite/purple-tentacle.svg',    hp: 1250,  reward: { xp: 620,  gold: 210 } },
        { name: 'Stalker Eye',          img: 'icons/Mbosses/lorc/eyestalk.svg',                 hp: 1050,  reward: { xp: 540,  gold: 182 } },
        { name: 'Hive Bug',             img: 'icons/Mbosses/delapouite/alien-bug.svg',          hp: 1300,  reward: { xp: 640,  gold: 215 } },
        { name: 'Stone Block',          img: 'icons/Mbosses/delapouite/thwomp.svg',             hp: 1350,  reward: { xp: 660,  gold: 220 } },
        { name: 'Frankenstein',         img: 'icons/Mbosses/lorc/frankenstein-creature.svg',    hp: 1400,  reward: { xp: 680,  gold: 230 } },
    ],
    C: [
        { name: 'Iron Minotaur',        img: 'icons/Mbosses/lorc/minotaur.svg',                hp: 2000,  reward: { xp: 850,  gold: 280 } },
        { name: 'One-Eyed Giant',       img: 'icons/Mbosses/lorc/cyclops.svg',                 hp: 2200,  reward: { xp: 900,  gold: 300 } },
        { name: 'Eyeless Cyclops',      img: 'icons/Mbosses/delapouite/jawless-cyclop.svg',    hp: 2100,  reward: { xp: 880,  gold: 290 } },
        { name: 'War Centaur',          img: 'icons/Mbosses/delapouite/centaur.svg',           hp: 2300,  reward: { xp: 920,  gold: 310 } },
        { name: 'Stone Gargoyle',       img: 'icons/Mbosses/delapouite/gargoyle.svg',          hp: 2400,  reward: { xp: 950,  gold: 320 } },
        { name: 'Storm Harpy',          img: 'icons/Mbosses/lorc/harpy.svg',                   hp: 2150,  reward: { xp: 890,  gold: 295 } },
        { name: 'Blood Werewolf',       img: 'icons/Mbosses/lorc/werewolf.svg',                hp: 2500,  reward: { xp: 980,  gold: 330 } },
        { name: 'Forest Sasquatch',     img: 'icons/Mbosses/delapouite/sasquatch.svg',         hp: 2600,  reward: { xp: 1000, gold: 340 } },
        { name: 'Red Oni',              img: 'icons/Mbosses/delapouite/oni.svg',               hp: 2700,  reward: { xp: 1020, gold: 350 } },
        { name: 'Iron Golem',           img: 'icons/Mbosses/delapouite/golem-head.svg',        hp: 2800,  reward: { xp: 1050, gold: 360 } },
        { name: 'Stone Sentinel',       img: 'icons/Mbosses/delapouite/rock-golem.svg',        hp: 2900,  reward: { xp: 1080, gold: 370 } },
        { name: 'Ice Golem',            img: 'icons/Mbosses/delapouite/ice-golem.svg',         hp: 2750,  reward: { xp: 1040, gold: 355 } },
        { name: 'Elder Treant',         img: 'icons/Mbosses/lorc/ent-mouth.svg',               hp: 2350,  reward: { xp: 940,  gold: 315 } },
        { name: 'Raven Lord',           img: 'icons/Mbosses/delapouite/kenku-head.svg',        hp: 2550,  reward: { xp: 990,  gold: 335 } },
        { name: 'Horned Drake',         img: 'icons/Mbosses/delapouite/horned-reptile.svg',    hp: 3000,  reward: { xp: 1100, gold: 380 } },
        { name: 'Wandering Ghost',      img: 'icons/Mbosses/delapouite/floating-ghost.svg',    hp: 2250,  reward: { xp: 910,  gold: 305 } },
        { name: 'Phantom Spirit',       img: 'icons/Mbosses/lorc/ghost.svg',                   hp: 2650,  reward: { xp: 1010, gold: 345 } },
        { name: 'Bullet Golem',         img: 'icons/Mbosses/delapouite/bullet-bill.svg',       hp: 3200,  reward: { xp: 1150, gold: 400 } },
    ],
    B: [
        { name: 'Demon King Baran',     img: 'icons/Mbosses/lorc/daemon-skull.svg',            hp: 4500,  reward: { xp: 1500, gold: 420 } },
        { name: 'Daemon Puppeteer',     img: 'icons/Mbosses/delapouite/daemon-pull.svg',       hp: 4700,  reward: { xp: 1560, gold: 440 } },
        { name: 'Devil Mask',           img: 'icons/Mbosses/delapouite/devil-mask.svg',        hp: 4800,  reward: { xp: 1600, gold: 450 } },
        { name: 'Ooze Demon',           img: 'icons/Mbosses/lorc/gooey-daemon.svg',            hp: 4600,  reward: { xp: 1530, gold: 430 } },
        { name: 'Shadow Minion Lord',   img: 'icons/Mbosses/lorc/evil-minion.svg',             hp: 5000,  reward: { xp: 1700, gold: 480 } },
        { name: 'Cursed Trident',       img: 'icons/Mbosses/lorc/evil-fork.svg',               hp: 4900,  reward: { xp: 1650, gold: 465 } },
        { name: 'Eclipse Fiend',        img: 'icons/Mbosses/lorc/evil-moon.svg',               hp: 5100,  reward: { xp: 1720, gold: 490 } },
        { name: 'Doom Comet',           img: 'icons/Mbosses/lorc/evil-comet.svg',              hp: 5200,  reward: { xp: 1750, gold: 500 } },
        { name: 'Hellfire Fiend',       img: 'icons/Mbosses/lorc/unfriendly-fire.svg',         hp: 5400,  reward: { xp: 1800, gold: 520 } },
        { name: 'Pharaoh\'s Curse',     img: 'icons/Mbosses/delapouite/mummy-head.svg',        hp: 5000,  reward: { xp: 1700, gold: 480 } },
        { name: 'Hex Witch',            img: 'icons/Mbosses/cathelineau/witch-face.svg',       hp: 5100,  reward: { xp: 1720, gold: 490 } },
        { name: 'Witch of the Wilds',   img: 'icons/Mbosses/lorc/witch-flight.svg',            hp: 5300,  reward: { xp: 1780, gold: 510 } },
        { name: 'Nosferatu',            img: 'icons/Mbosses/delapouite/female-vampire.svg',    hp: 5500,  reward: { xp: 1820, gold: 530 } },
        { name: 'Count Dracula',        img: 'icons/Mbosses/delapouite/vampire-dracula.svg',   hp: 5600,  reward: { xp: 1850, gold: 540 } },
        { name: 'Dormant Vampire',      img: 'icons/Mbosses/delapouite/resting-vampire.svg',   hp: 5200,  reward: { xp: 1750, gold: 500 } },
        { name: 'Fang Beast',           img: 'icons/Mbosses/lorc/pretty-fangs.svg',            hp: 5300,  reward: { xp: 1780, gold: 510 } },
        { name: 'Bestial Maw',          img: 'icons/Mbosses/lorc/bestial-fangs.svg',           hp: 5800,  reward: { xp: 1900, gold: 560 } },
        { name: 'Mimic Chest',          img: 'icons/Mbosses/delapouite/mimic-chest.svg',       hp: 6000,  reward: { xp: 2000, gold: 600 } },
    ],
    A: [
        { name: 'Frost Dragon',         img: 'icons/Mbosses/faithtoken/dragon-head.svg',       hp: 8000,  reward: { xp: 2500,  gold: 650 } },
        { name: 'Crimson Dragon',       img: 'icons/Mbosses/lorc/dragon-head.svg',             hp: 8500,  reward: { xp: 2650,  gold: 700 } },
        { name: 'Spiked Wyrm',          img: 'icons/Mbosses/delapouite/spiked-dragon-head.svg',hp: 9000,  reward: { xp: 2800,  gold: 750 } },
        { name: 'Longship Dragon',      img: 'icons/Mbosses/delapouite/drakkar-dragon.svg',    hp: 9500,  reward: { xp: 2900,  gold: 780 } },
        { name: 'Spiral Wyrm',          img: 'icons/Mbosses/lorc/dragon-spiral.svg',           hp: 10000, reward: { xp: 3000,  gold: 800 } },
        { name: 'Sea Leviathan',        img: 'icons/Mbosses/lorc/sea-dragon.svg',              hp: 10500, reward: { xp: 3100,  gold: 830 } },
        { name: 'Hydra',                img: 'icons/Mbosses/lorc/hydra.svg',                   hp: 11000, reward: { xp: 3200,  gold: 850 } },
        { name: 'Hydra Matriarch',      img: 'icons/Mbosses/lorc/hydra-shot.svg',              hp: 11500, reward: { xp: 3300,  gold: 880 } },
        { name: 'Thunder Wyvern',       img: 'icons/Mbosses/lorc/wyvern.svg',                  hp: 10000, reward: { xp: 3000,  gold: 800 } },
        { name: 'Grim Reaper',          img: 'icons/Mbosses/lorc/grim-reaper.svg',             hp: 12000, reward: { xp: 3500,  gold: 900 } },
        { name: 'Medusa Queen',         img: 'icons/Mbosses/cathelineau/medusa-head.svg',      hp: 9500,  reward: { xp: 2900,  gold: 780 } },
        { name: 'Golden Griffin',       img: 'icons/Mbosses/delapouite/griffin-symbol.svg',    hp: 10500, reward: { xp: 3100,  gold: 830 } },
        { name: 'Fomorian Giant',       img: 'icons/Mbosses/cathelineau/fomorian.svg',         hp: 11000, reward: { xp: 3200,  gold: 850 } },
        { name: 'Triton Warlord',       img: 'icons/Mbosses/lorc/triton-head.svg',             hp: 9000,  reward: { xp: 2800,  gold: 750 } },
        { name: 'Kraken',               img: 'icons/Mbosses/delapouite/kraken-tentacle.svg',   hp: 12500, reward: { xp: 3600,  gold: 920 } },
        { name: 'Tentacle Abomination', img: 'icons/Mbosses/delapouite/floating-tentacles.svg',hp: 11500, reward: { xp: 3300,  gold: 880 } },
        { name: 'Mind Flayer',          img: 'icons/Mbosses/delapouite/brain-tentacle.svg',    hp: 13000, reward: { xp: 3800,  gold: 950 } },
        { name: 'Flame Ifrit',          img: 'icons/Mbosses/lorc/ifrit.svg',                   hp: 14000, reward: { xp: 4000,  gold: 1000 } },
    ],
    S: [
        { name: 'Twin Dragon',          img: 'icons/Mbosses/lorc/double-dragon.svg',           hp: 20000, reward: { xp: 5000,  gold: 1200 } },
        { name: 'Rex Sovereign',         img: 'icons/Mbosses/lorc/dinosaur-rex.svg',           hp: 22000, reward: { xp: 5400,  gold: 1300 } },
        { name: 'Bone Dragon',          img: 'icons/Mbosses/lorc/dinosaur-bones.svg',          hp: 21000, reward: { xp: 5200,  gold: 1250 } },
        { name: 'Diablo',               img: 'icons/Mbosses/lorc/diablo-skull.svg',            hp: 25000, reward: { xp: 6000,  gold: 1500 } },
        { name: 'Horned Monarch',       img: 'icons/Mbosses/lorc/horned-skull.svg',            hp: 24000, reward: { xp: 5800,  gold: 1450 } },
        { name: 'Void Skull',           img: 'icons/Mbosses/lorc/cracked-alien-skull.svg',     hp: 23000, reward: { xp: 5600,  gold: 1350 } },
        { name: 'Spectre Lord',         img: 'icons/Mbosses/lorc/spectre.svg',                 hp: 26000, reward: { xp: 6200,  gold: 1550 } },
        { name: 'Haunting Wraith',      img: 'icons/Mbosses/lorc/haunting.svg',                hp: 22500, reward: { xp: 5500,  gold: 1320 } },
        { name: 'Elysium Shade',        img: 'icons/Mbosses/delapouite/elysium-shade.svg',    hp: 27000, reward: { xp: 6400,  gold: 1600 } },
        { name: 'Shadow Monarch',       img: 'icons/Mbosses/delapouite/bottled-shadow.svg',   hp: 28000, reward: { xp: 6500,  gold: 1700 } },
        { name: 'Monarch of Plague',    img: 'icons/Mbosses/lorc/infested-mass.svg',           hp: 25000, reward: { xp: 6000,  gold: 1500 } },
        { name: 'Vile Corruption',      img: 'icons/Mbosses/lorc/vile-fluid.svg',             hp: 24000, reward: { xp: 5800,  gold: 1450 } },
        { name: 'Gluttony Demon',       img: 'icons/Mbosses/lorc/gluttonous-smile.svg',       hp: 23500, reward: { xp: 5700,  gold: 1400 } },
        { name: 'Grinning Fiend',       img: 'icons/Mbosses/lorc/sharp-smile.svg',            hp: 26000, reward: { xp: 6200,  gold: 1550 } },
        { name: 'Spark Spirit',         img: 'icons/Mbosses/lorc/spark-spirit.svg',           hp: 27000, reward: { xp: 6400,  gold: 1600 } },
        { name: 'The Beholder',         img: 'icons/Mbosses/lorc/behold.svg',                 hp: 30000, reward: { xp: 7000,  gold: 1750 } },
        { name: 'Parasite Metroid',     img: 'icons/Mbosses/delapouite/metroid.svg',          hp: 29000, reward: { xp: 6800,  gold: 1720 } },
        { name: 'World Swallower',      img: 'icons/Mbosses/delapouite/swallower.svg',        hp: 32000, reward: { xp: 7500,  gold: 1800 } },
    ],
    X: [
        { name: 'Anubis',               img: 'icons/Mbosses/delapouite/anubis.svg',            hp: 80000,  reward: { xp: 20000,  gold: 8000 } },
        { name: 'Horus, the Sky God',   img: 'icons/Mbosses/delapouite/horus.svg',             hp: 85000,  reward: { xp: 21000,  gold: 8500 } },
        { name: 'Sphinx of Riddles',    img: 'icons/Mbosses/delapouite/egyptian-sphinx.svg',   hp: 90000,  reward: { xp: 22000,  gold: 9000 } },
        { name: 'Greek Sphinx',         img: 'icons/Mbosses/delapouite/greek-sphinx.svg',      hp: 88000,  reward: { xp: 21500,  gold: 8800 } },
        { name: 'Djinn of Chaos',       img: 'icons/Mbosses/delapouite/djinn.svg',             hp: 95000,  reward: { xp: 23000,  gold: 9200 } },
        { name: 'Titan',                img: 'icons/Mbosses/delapouite/giant.svg',             hp: 100000, reward: { xp: 25000,  gold: 10000 } },
        { name: 'Iron Body Monarch',    img: 'icons/Mbosses/delapouite/brute.svg',             hp: 105000, reward: { xp: 26000,  gold: 10500 } },
        { name: 'Siren Empress',        img: 'icons/Mbosses/delapouite/mermaid.svg',           hp: 82000,  reward: { xp: 20500,  gold: 8200 } },
        { name: 'Fae Monarch',          img: 'icons/Mbosses/delapouite/fairy.svg',             hp: 85000,  reward: { xp: 21000,  gold: 8500 } },
        { name: 'Spirit Monarch',       img: 'icons/Mbosses/lorc/fairy.svg',                   hp: 88000,  reward: { xp: 21500,  gold: 8800 } },
        { name: 'Unicorn of Light',     img: 'icons/Mbosses/delapouite/unicorn.svg',           hp: 92000,  reward: { xp: 22500,  gold: 9100 } },
        { name: 'Pick of Destiny',      img: 'icons/Mbosses/delapouite/pick-of-destiny.svg',   hp: 98000,  reward: { xp: 24000,  gold: 9600 } },
        { name: 'The Architect',        img: 'icons/Mbosses/lorc/evil-book.svg',               hp: 110000, reward: { xp: 28000,  gold: 11000 } },
        { name: 'Death Rider',          img: 'icons/Mbosses/caro-asercion/cloaked-figure-on-horseback.svg', hp: 120000, reward: { xp: 30000, gold: 12000 } },
        { name: 'Beast Sovereign',      img: 'icons/Mbosses/lorc/beast-eye.svg',               hp: 115000, reward: { xp: 29000,  gold: 11500 } },
        { name: 'Antares',              img: 'icons/Mbosses/lorc/daemon-skull.svg',            hp: 130000, reward: { xp: 32000,  gold: 13000 } },
        { name: 'Chaos Sovereign',      img: 'icons/Mbosses/skoll/troll.svg',                  hp: 150000, reward: { xp: 35000,  gold: 15000 } },
    ],
};

function getWeeklyBoss() {
    if (!D) return null;
    const now = new Date();
    // Week key: year + ISO week number
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    const weekKey = now.getFullYear() + '-W' + weekNum;
    
    if (!D.boss) D.boss = {};
    
    if (D.boss.weekKey !== weekKey || !D.boss.img || !D.boss.img.includes('Mbosses')) {
        // New week, missing img, or old icon path — pick from rank pool
        const rank = getRank(D.level);
        const pool = BOSS_POOL[rank.name] || BOSS_POOL.E;
        const bossIdx = weekNum % pool.length;
        const template = pool[bossIdx];
        
        // Scale HP by level — keep current HP if same week (img upgrade)
        const hpScale = 1 + (D.level * 0.05);
        const isSameWeek = D.boss.weekKey === weekKey;
        
        D.boss = {
            weekKey,
            name: template.name,
            img: template.img,
            rank: rank.name,
            maxHp: Math.round(template.hp * hpScale),
            currentHp: isSameWeek && D.boss.currentHp != null ? D.boss.currentHp : Math.round(template.hp * hpScale),
            reward: template.reward,
            defeated: isSameWeek ? !!D.boss.defeated : false,
            damageLog: isSameWeek && D.boss.damageLog ? D.boss.damageLog : []
        };
        saveGame();
    }
    
    return D.boss;
}

function dealBossDamage(amount, source) {
    if (!D.boss || D.boss.defeated) return;
    
    D.boss.currentHp = Math.max(0, D.boss.currentHp - amount);
    D.boss.damageLog.push({
        date: new Date().toISOString(),
        damage: amount,
        source
    });
    
    if (D.boss.currentHp <= 0) {
        D.boss.defeated = true;
        D.boss.currentHp = 0;
        grantXP(D.boss.reward.xp);
        grantGold(D.boss.reward.gold);
        D.stats.bossesDefeated = (D.stats.bossesDefeated || 0) + 1;
        
        // +1 shadow soldier for boss kill
        D.shadowArmy = (D.shadowArmy || 0) + 1;
        
        if (typeof vibrate === 'function') vibrate([50, 100, 50, 100, 50, 200]);
        if (typeof playSound === 'function') playSound('bossDefeat');
        sysNotify(`[BOSS DEFEATED] \u2620 ${D.boss.name} has fallen! +${D.boss.reward.xp} XP, +${D.boss.reward.gold} Gold, +1 Shadow Soldier!`, 'gold');
        saveGame();
        // Check if any new shadow soldiers can be extracted
        if (typeof checkShadowExtractions === 'function') setTimeout(() => checkShadowExtractions(), 1500);
        refreshUI();
        return true;
    }
    
    saveGame();
    return false;
}


// ============= DAILY LOGIN REWARDS =============
const LOGIN_REWARDS = [
    { day: 1, xp: 50,  gold: 10,  label: '50 XP' },
    { day: 2, xp: 75,  gold: 15,  label: '75 XP' },
    { day: 3, xp: 100, gold: 25,  label: '100 XP' },
    { day: 4, xp: 100, gold: 30,  label: '100 XP + 30G' },
    { day: 5, xp: 150, gold: 40,  label: '150 XP' },
    { day: 6, xp: 150, gold: 50,  label: '150 XP + 50G' },
    { day: 7, xp: 300, gold: 100, label: '🌟 300 XP + 100G + Shadow Soldier!' },
];

function checkDailyLogin() {
    if (!D) return;
    const today = new Date().toDateString();
    
    if (D.lastLoginReward === today) return; // Already claimed today
    
    D.lastLoginReward = today;
    D.loginStreak = (D.loginStreak || 0) + 1;
    
    // Check if streak was broken (more than 1 day gap)
    if (D.lastActiveDate) {
        const last = new Date(D.lastActiveDate);
        const now = new Date(today);
        const diff = Math.floor((now - last) / 86400000);
        if (diff > 1) {
            D.loginStreak = 1; // Reset streak
        }
    }
    
    const dayIdx = ((D.loginStreak - 1) % 7); // Cycle every 7 days
    const reward = LOGIN_REWARDS[dayIdx];
    
    grantXP(reward.xp);
    grantGold(reward.gold);
    
    // Day 7 bonus: shadow soldier
    if (dayIdx === 6) {
        D.shadowArmy = (D.shadowArmy || 0) + 1;
    }
    
    saveGame();
    
    // Show login reward popup after a small delay
    setTimeout(() => {
        showLoginReward(reward, D.loginStreak, dayIdx);
    }, 1500);
}

function showLoginReward(reward, streak, dayIdx) {
    const overlay = document.getElementById('loginRewardOverlay');
    document.getElementById('lrStreak').textContent = `Day ${streak} · Login Streak`;
    document.getElementById('lrReward').textContent = `Today: ${reward.label}`;
    
    // Render the 7-day grid
    const grid = document.getElementById('lrGrid');
    grid.innerHTML = LOGIN_REWARDS.map((r, i) => {
        let cls = 'lr-day';
        if (i < dayIdx) cls += ' lr-claimed';
        else if (i === dayIdx) cls += ' lr-today';
        else cls += ' lr-locked';
        return `<div class="${cls}">
            <div class="lr-day-num">Day ${i + 1}</div>
            <div class="lr-day-icon">${i === 6 ? '🌟' : '◆'}</div>
            <div class="lr-day-val">${r.xp} XP</div>
        </div>`;
    }).join('');
    
    overlay.classList.remove('hidden');
    if (typeof vibrate === 'function') vibrate([30, 50, 30]);
    if (typeof playSound === 'function') playSound('loginReward');
}

function closeLoginReward() {
    document.getElementById('loginRewardOverlay').classList.add('hidden');
}


// ============= NAMED SHADOW SOLDIERS =============
const SHADOW_SOLDIERS = [
    // ── Tier 1: Foot Soldiers (Early game) ──
    { id:'iron',   name:'Iron',          title:'Shadow Knight',          icon:'\u2694\uFE0F', rank:'E', tier:1,
      unlock:{type:'level', value:5},     passive:'XP +3%',             bonus:{xp:0.03},
      lore:'The first shadow to kneel. A loyal knight bound to your will.' },

    { id:'fang',   name:'Fang',          title:'Shadow Wolf',            icon:'\uD83D\uDC3A', rank:'E', tier:1,
      unlock:{type:'workouts', value:10}, passive:'Gold +3%',            bonus:{gold:0.03},
      lore:'A beast of shadow, swift and tireless. Extracted from the hunt.' },

    { id:'steel',  name:'Steel',         title:'Shadow Infantry',        icon:'\uD83D\uDEE1\uFE0F', rank:'E', tier:1,
      unlock:{type:'shadowMissions', value:5}, passive:'Boss DMG +3%',   bonus:{bossDmg:0.03},
      lore:'Forged in the crucible of shadow missions. The foot soldier who never retreats.' },

    // ── Tier 2: Elite Soldiers ──
    { id:'tank',   name:'Tank',          title:'High Orc Shadow',        icon:'\uD83D\uDC79', rank:'D', tier:2,
      unlock:{type:'level', value:15},    passive:'Boss DMG +5%',        bonus:{bossDmg:0.05},
      lore:'An orcish titan. The ground trembles where he stands.' },

    { id:'tusk',   name:'Tusk',          title:'Orc Shaman',             icon:'\uD83E\uDDB4', rank:'D', tier:2,
      unlock:{type:'bossKills', value:5}, passive:'XP +5%',              bonus:{xp:0.05},
      lore:'Ancient magic flows through his bones. The shaman sees all.' },

    // ── Tier 3: Commanders ──
    { id:'igris',  name:'Igris',         title:'Blood-Red Knight',       icon:'\uD83D\uDD34', rank:'C', tier:3,
      unlock:{type:'level', value:30},    passive:'All +5%',             bonus:{xp:0.05, gold:0.05, bossDmg:0.05},
      lore:'The most loyal shadow. A knight who chose his monarch over death itself.' },

    { id:'jima',   name:'Jima',          title:'Ice Elf Shadow',         icon:'\u2744\uFE0F', rank:'C', tier:3,
      unlock:{type:'streak', value:14},   passive:'Gold +8%',            bonus:{gold:0.08},
      lore:'Frozen discipline given form. Two weeks of ice in your veins.' },

    // ── Tier 4: Generals ──
    { id:'fangs',  name:'Fangs',         title:'Shadow Beast',           icon:'\uD83D\uDC32', rank:'B', tier:4,
      unlock:{type:'bossKills', value:15},passive:'Boss DMG +10%',       bonus:{bossDmg:0.10},
      lore:'A creature of pure instinct and savage power. 15 bosses fed its hunger.' },

    { id:'greed',  name:'Greed',         title:'Giant Shadow',           icon:'\uD83D\uDC4A', rank:'B', tier:4,
      unlock:{type:'quests', value:100},  passive:'XP +8%',              bonus:{xp:0.08},
      lore:'An insatiable hunger for power. 100 quests devoured.' },

    { id:'iron_b', name:'Iron Body',     title:'Elite Knight',           icon:'\u2699\uFE0F', rank:'B', tier:4,
      unlock:{type:'level', value:50},    passive:'Gold +10%',           bonus:{gold:0.10},
      lore:'The original knight, reforged. Stronger, sharper, unstoppable.' },

    // ── Tier 5: Monarch's Guard ──
    { id:'kaisel', name:'Kaisel',        title:'Shadow Dragon',          icon:'\uD83D\uDC09', rank:'A', tier:5,
      unlock:{type:'level', value:70},    passive:'All +8%',             bonus:{xp:0.08, gold:0.08, bossDmg:0.08},
      lore:'The sky belongs to the Monarch. A dragon of pure shadow soars above.' },

    { id:'beru',   name:'Beru',          title:'Ant King',               icon:'\uD83D\uDC1C', rank:'A', tier:5,
      unlock:{type:'bossKills', value:30},passive:'Boss DMG +15%',       bonus:{bossDmg:0.15},
      lore:'"My liege! Shall I destroy them all?" The strongest soldier awakens.' },

    // ── Tier 6: Legendary ──
    { id:'bellion',name:'Bellion',       title:'Grand Marshal',          icon:'\uD83D\uDC51', rank:'S', tier:6,
      unlock:{type:'level', value:100},   passive:'All +12%',            bonus:{xp:0.12, gold:0.12, bossDmg:0.12},
      lore:'Commander of the Shadow Army. The Grand Marshal kneels only to the Monarch.' },

    { id:'marshal_igris', name:'Marshal Igris', title:'Shadow Marshal',  icon:'\u265B',  rank:'S', tier:6,
      unlock:{type:'streak', value:60},   passive:'XP +15%',             bonus:{xp:0.15},
      lore:'60 days of unbroken discipline. Igris evolves beyond mortal limits.' },

    { id:'ashborn',name:'Ashborn\'s Will',title:'Shadow Monarch Fragment',icon:'\u2B1B', rank:'X', tier:7,
      unlock:{type:'level', value:150},   passive:'All +20%',            bonus:{xp:0.20, gold:0.20, bossDmg:0.20},
      lore:'A fragment of the Shadow Monarch\'s own will. The ultimate power awakens.' },
];

// ── Shadow Army Count (backward compat) ──
function getShadowArmyCount() {
    return D.shadowArmy || 0;
}

function getShadowArmyRank() {
    const unlocked = getUnlockedShadows().length;
    if (unlocked >= 14) return { name: 'Shadow Monarch\'s Legion', icon: '\uD83D\uDC51', tier: 7 };
    if (unlocked >= 11) return { name: 'Monarch\'s Guard',    icon: '\u2B1B', tier: 6 };
    if (unlocked >= 8)  return { name: 'Shadow Battalion',    icon: '\u265B', tier: 5 };
    if (unlocked >= 5)  return { name: 'Shadow Company',      icon: '\uD83D\uDD34', tier: 4 };
    if (unlocked >= 3)  return { name: 'Shadow Squad',        icon: '\uD83D\uDC79', tier: 3 };
    if (unlocked >= 1)  return { name: 'First Shadow',        icon: '\u25AA', tier: 1 };
    return { name: 'No Shadows', icon: '\u25CB', tier: 0 };
}

function getUnlockedShadows() {
    if (!D || !D.shadows) return [];
    return SHADOW_SOLDIERS.filter(s => D.shadows[s.id]);
}

// ── Calculate total passive bonuses from all unlocked shadows ──
function getShadowBonuses() {
    const result = { xp: 0, gold: 0, bossDmg: 0 };
    if (!D || !D.shadows) return result;
    SHADOW_SOLDIERS.forEach(s => {
        if (D.shadows[s.id]) {
            if (s.bonus.xp)      result.xp      += s.bonus.xp;
            if (s.bonus.gold)    result.gold    += s.bonus.gold;
            if (s.bonus.bossDmg) result.bossDmg += s.bonus.bossDmg;
        }
    });
    return result;
}

// ── Check if any new shadows should be extracted ──
let _ariseQueue = [];
let _ariseShowing = false;

function checkShadowExtractions() {
    if (!D || !D.shadows) { D.shadows = {}; }
    const newShadows = [];

    SHADOW_SOLDIERS.forEach(s => {
        if (D.shadows[s.id]) return; // already extracted
        let met = false;
        switch (s.unlock.type) {
            case 'level':
                met = D.level >= s.unlock.value; break;
            case 'bossKills':
                met = (D.stats.bossesDefeated || 0) >= s.unlock.value; break;
            case 'workouts':
                met = (D.stats.totalWorkouts || 0) >= s.unlock.value; break;
            case 'quests':
                met = (D.stats.totalQuestsCompleted || 0) >= s.unlock.value; break;
            case 'streak':
                met = (D.streak || 0) >= s.unlock.value; break;
            case 'shadowMissions':
                met = (D.stats.shadowMissionsCompleted || 0) >= s.unlock.value; break;
        }
        if (met) {
            D.shadows[s.id] = true;
            D.shadowArmy = (D.shadowArmy || 0) + 1;
            newShadows.push(s);
        }
    });

    if (newShadows.length > 0) {
        saveGame();
        _ariseQueue.push(...newShadows);
        if (!_ariseShowing) showNextArise();
    }
}

function showNextArise() {
    if (_ariseQueue.length === 0) { _ariseShowing = false; refreshUI(); return; }
    _ariseShowing = true;
    const shadow = _ariseQueue.shift();
    showAriseAnimation(shadow);
}

function showAriseAnimation(shadow) {
    const overlay = document.getElementById('ariseOverlay');
    if (!overlay) return;

    document.getElementById('ariseName').textContent = shadow.name;
    document.getElementById('ariseTitle').textContent = shadow.title;
    document.getElementById('ariseIcon').textContent = shadow.icon;
    document.getElementById('ariseRank').textContent = shadow.rank + '-Rank';
    document.getElementById('arisePassive').textContent = shadow.passive;
    document.getElementById('ariseLore').textContent = shadow.lore;

    // Rank color
    const rankColors = { E:'#4fc3f7', D:'#69f0ae', C:'#ffd740', B:'#ff9800', A:'#ff5252', S:'#e040fb', X:'#ff1744' };
    const rColor = rankColors[shadow.rank] || '#4fc3f7';
    document.getElementById('ariseRank').style.color = rColor;
    document.getElementById('ariseIcon').style.textShadow = '0 0 30px ' + rColor + ', 0 0 60px ' + rColor;

    overlay.classList.remove('hidden');
    overlay.classList.add('arise-entrance');
    setTimeout(() => overlay.classList.remove('arise-entrance'), 800);

    if (typeof playSound === 'function') playSound('levelUp');
    if (typeof vibrate === 'function') vibrate([100, 50, 100, 50, 200]);

    // Narrator reaction
    if (typeof narratorSpeak === 'function') {
        const msgs = [
            `"ARISE." — ${shadow.name} has joined your shadow army.`,
            `Shadow extracted: ${shadow.name}, the ${shadow.title}. ${shadow.passive} bonus activated.`,
            `The darkness parts. ${shadow.name} kneels before you. Another soldier for the army.`,
            `"${shadow.name}... you belong to me now." Shadow extraction complete.`,
            `A new shadow rises from the void. ${shadow.name} — ${shadow.title}. The army grows.`
        ];
        setTimeout(() => narratorSpeak(msgs[Math.floor(Math.random() * msgs.length)]), 600);
    }

    sysNotify(`[ARISE!] ${shadow.icon} ${shadow.name} — ${shadow.title} extracted! ${shadow.passive}`, 'gold');
}

function closeAriseOverlay() {
    const overlay = document.getElementById('ariseOverlay');
    if (overlay) overlay.classList.add('hidden');
    // Show next in queue
    setTimeout(() => showNextArise(), 400);
}

// ── Get unlock progress description ──
function getShadowUnlockHint(shadow) {
    const u = shadow.unlock;
    let current = 0;
    switch (u.type) {
        case 'level':          current = D.level || 0; break;
        case 'bossKills':      current = D.stats.bossesDefeated || 0; break;
        case 'workouts':       current = D.stats.totalWorkouts || 0; break;
        case 'quests':         current = D.stats.totalQuestsCompleted || 0; break;
        case 'streak':         current = D.streak || 0; break;
        case 'shadowMissions': current = D.stats.shadowMissionsCompleted || 0; break;
    }
    const labels = {
        level: 'Reach Level',
        bossKills: 'Defeat Bosses',
        workouts: 'Log Workouts',
        quests: 'Clear Quests',
        streak: 'Day Streak',
        shadowMissions: 'Shadow Missions'
    };
    const pct = Math.min(100, Math.round((current / u.value) * 100));
    return { label: labels[u.type] || u.type, current, target: u.value, pct };
}


// ============= BOSS DAMAGE INTEGRATION =============
// Hook into workout logging to deal boss damage
const _originalLogWorkout = logWorkout;
logWorkout = function(exercise, reps, sets, weight, intensity) {
    const result = _originalLogWorkout(exercise, reps, sets, weight, intensity);
    
    // Deal boss damage based on calories burned — apply weapon + boost multiplier
    let damage = Math.round(result.calBurned * 1.5 + result.xpGain * 0.5);
    if (typeof getShopBossDmgMultiplier === 'function') {
        damage = Math.round(damage * getShopBossDmgMultiplier());
    }
    // Apply shadow soldier boss damage bonus
    if (typeof getShadowBonuses === 'function') {
        const sb = getShadowBonuses();
        if (sb.bossDmg > 0) damage = Math.round(damage * (1 + sb.bossDmg));
    }
    const boss = getWeeklyBoss();
    if (boss && !boss.defeated) {
        dealBossDamage(damage, exercise);
    }
    
    // Chance to trigger shadow mission after workout
    setTimeout(() => tryTriggerShadowMission(), 3000);
    
    return result;
};


// ============= SHADOW MISSION SCHEDULER =============
// Check for random shadow missions periodically
let shadowMissionScheduler = null;

function startShadowMissionScheduler() {
    // Check every 5-10 minutes
    shadowMissionScheduler = setInterval(() => {
        tryTriggerShadowMission();
    }, (5 + Math.random() * 5) * 60 * 1000);
    
    // Also check 30 seconds after boot
    setTimeout(() => tryTriggerShadowMission(), 30000);
}


// ============= UI RENDER HELPERS =============
function renderBossPanel() {
    const sec = document.getElementById('bossSection');
    if (!sec) return;
    
    const boss = getWeeklyBoss();
    if (!boss) return;
    
    const b = D.boss;
    const defeated = b && b.defeated;
    
    document.getElementById('bossRankLabel').textContent = boss.rank + '-Rank';
    const bossIconEl = document.getElementById('bossIcon');
    if (boss.img) {
        const imgPath = boss.img.startsWith('/') ? boss.img : '/' + boss.img;
        bossIconEl.innerHTML = '<img src="' + imgPath + '" alt="' + boss.name + '" draggable="false" onerror="this.style.display=\'none\';this.parentNode.textContent=\'☠\'">';
    } else {
        bossIconEl.textContent = '☠';
    }
    document.getElementById('bossName').textContent = boss.name;
    
    if (defeated) {
        document.getElementById('bossHpText').textContent = 'DEFEATED';
        document.getElementById('bossHpFill').style.width = '0%';
        document.getElementById('bossHpFill').style.background = 'var(--green)';
        const hint = sec.querySelector('.boss-damage-hint');
        if (hint) hint.innerHTML = '<span style="color:var(--green)">✓ Boss defeated this week! +' + boss.reward.xp + ' XP earned</span>';
    } else if (b) {
        const pct = Math.max((b.currentHp / b.maxHp) * 100, 0);
        document.getElementById('bossHpText').textContent = Math.ceil(b.currentHp) + ' / ' + b.maxHp;
        document.getElementById('bossHpFill').style.width = pct + '%';
        
        // Color shifts as HP drops
        if (pct < 25) document.getElementById('bossHpFill').style.background = 'linear-gradient(90deg,#1b5e20,#4caf50)';
        else if (pct < 50) document.getElementById('bossHpFill').style.background = 'linear-gradient(90deg,#e65100,#ff9800)';
    }
}

function renderArmyPanel() {
    const sec = document.getElementById('armySection');
    if (!sec) return;

    const unlocked = getUnlockedShadows();
    const armyRank = getShadowArmyRank();
    const bonuses = getShadowBonuses();

    // Header info
    const countEl = document.getElementById('armyCount');
    const rankEl = document.getElementById('armyRankName');
    if (countEl) countEl.textContent = unlocked.length + ' / ' + SHADOW_SOLDIERS.length;
    if (rankEl) rankEl.textContent = armyRank.icon + ' ' + armyRank.name;

    // Bonus summary
    const bonusSumEl = document.getElementById('armyBonusSummary');
    if (bonusSumEl) {
        const parts = [];
        if (bonuses.xp > 0)      parts.push('XP +' + Math.round(bonuses.xp * 100) + '%');
        if (bonuses.gold > 0)    parts.push('Gold +' + Math.round(bonuses.gold * 100) + '%');
        if (bonuses.bossDmg > 0) parts.push('Boss DMG +' + Math.round(bonuses.bossDmg * 100) + '%');
        bonusSumEl.textContent = parts.length > 0 ? parts.join(' \u00B7 ') : 'No bonuses yet';
    }

    // Render shadow cards
    const grid = document.getElementById('shadowGrid');
    if (!grid) return;

    const rankColors = { E:'#4fc3f7', D:'#69f0ae', C:'#ffd740', B:'#ff9800', A:'#ff5252', S:'#e040fb', X:'#ff1744' };

    grid.innerHTML = SHADOW_SOLDIERS.map(s => {
        const isUnlocked = D.shadows && D.shadows[s.id];
        const rc = rankColors[s.rank] || '#4fc3f7';

        if (isUnlocked) {
            return '<div class="shadow-card shadow-unlocked" style="--sc-color:' + rc + '">' +
                '<div class="sc-rank" style="color:' + rc + '">' + s.rank + '</div>' +
                '<div class="sc-icon">' + s.icon + '</div>' +
                '<div class="sc-name">' + s.name + '</div>' +
                '<div class="sc-title">' + s.title + '</div>' +
                '<div class="sc-passive">' + s.passive + '</div>' +
            '</div>';
        } else {
            const hint = getShadowUnlockHint(s);
            return '<div class="shadow-card shadow-locked">' +
                '<div class="sc-rank" style="color:' + rc + '">' + s.rank + '</div>' +
                '<div class="sc-icon sc-icon-locked">?</div>' +
                '<div class="sc-name">???</div>' +
                '<div class="sc-title">' + s.title + '</div>' +
                '<div class="sc-unlock-bar">' +
                    '<div class="sc-unlock-fill" style="width:' + hint.pct + '%;background:' + rc + '"></div>' +
                '</div>' +
                '<div class="sc-unlock-hint">' + hint.label + ': ' + hint.current + '/' + hint.target + '</div>' +
            '</div>';
        }
    }).join('');
}
