const fs = require('fs');
let code = fs.readFileSync('js/features.js', 'utf8');

const start = code.indexOf('const BOSS_POOL = {');
const endMarker = '};\r\n\r\nfunction getWeeklyBoss()';
let end = code.indexOf(endMarker);
if (end === -1) {
    // try unix line endings
    end = code.indexOf('};\n\nfunction getWeeklyBoss()');
}

if (start === -1 || end === -1) {
    console.error('Could not find BOSS_POOL boundaries', start, end);
    process.exit(1);
}

const newPool = [
"const BOSS_POOL = {",
"    E: [",
"        { name: 'Iron Golem',         img: 'icons/bosses/iron_golem.svg',         hp: 500,   reward: { xp: 300,  gold: 100 } },",
"        { name: 'Stone Sentinel',     img: 'icons/bosses/stone_sentinel.svg',     hp: 450,   reward: { xp: 280,  gold: 90 } },",
"        { name: 'Ruin Crawler',       img: 'icons/bosses/ruin_crawler.svg',       hp: 550,   reward: { xp: 320,  gold: 110 } },",
"    ],",
"    D: [",
"        { name: 'Cerberus',           img: 'icons/bosses/cerberus.svg',           hp: 1200,  reward: { xp: 600,  gold: 200 } },",
"        { name: 'Venom Serpent',      img: 'icons/bosses/venom_serpent.svg',      hp: 1100,  reward: { xp: 550,  gold: 180 } },",
"        { name: 'Shadow Stalker',     img: 'icons/bosses/shadow_stalker.svg',     hp: 1300,  reward: { xp: 650,  gold: 220 } },",
"    ],",
"    C: [",
"        { name: 'Ice Monarch',        img: 'icons/bosses/ice_monarch.svg',        hp: 2500,  reward: { xp: 1000, gold: 350 } },",
"        { name: 'Blood Ogre',         img: 'icons/bosses/blood_ogre.svg',         hp: 2800,  reward: { xp: 1100, gold: 380 } },",
"        { name: 'Thunder Wyvern',     img: 'icons/bosses/thunder_wyvern.svg',     hp: 2300,  reward: { xp: 950,  gold: 320 } },",
"        { name: 'Curse Wraith',       img: 'icons/bosses/curse_wraith.svg',       hp: 2600,  reward: { xp: 1050, gold: 360 } },",
"    ],",
"    B: [",
"        { name: 'Demon King Baran',   img: 'icons/bosses/demon_king_baran.svg',   hp: 5000,  reward: { xp: 1800, gold: 500 } },",
"        { name: 'Flame Titan',        img: 'icons/bosses/flame_titan.svg',        hp: 5500,  reward: { xp: 2000, gold: 550 } },",
"        { name: 'Abyss Knight',       img: 'icons/bosses/abyss_knight.svg',       hp: 4800,  reward: { xp: 1700, gold: 480 } },",
"        { name: 'Bone Dragon',        img: 'icons/bosses/bone_dragon.svg',        hp: 5200,  reward: { xp: 1900, gold: 520 } },",
"    ],",
"    A: [",
"        { name: 'Frost Dragon',       img: 'icons/bosses/frost_dragon.svg',       hp: 10000, reward: { xp: 3000, gold: 800 } },",
"        { name: 'Monarch of Plague',   img: 'icons/bosses/monarch_of_plague.svg', hp: 11000, reward: { xp: 3200, gold: 850 } },",
"        { name: 'Beast Sovereign',     img: 'icons/bosses/beast_sovereign.svg',   hp: 9500,  reward: { xp: 2800, gold: 750 } },",
"        { name: 'Iron Body Monarch',   img: 'icons/bosses/iron_body_monarch.svg', hp: 12000, reward: { xp: 3500, gold: 900 } },",
"    ],",
"    S: [",
"        { name: 'Antares',            img: 'icons/bosses/antares.svg',            hp: 25000, reward: { xp: 6000,  gold: 1500 } },",
"        { name: 'Shadow Monarch',     img: 'icons/bosses/shadow_monarch.svg',     hp: 28000, reward: { xp: 6500,  gold: 1700 } },",
"        { name: 'Legia',              img: 'icons/bosses/legia.svg',              hp: 23000, reward: { xp: 5500,  gold: 1400 } },",
"        { name: 'Monarch of Frost',   img: 'icons/bosses/monarch_of_frost.svg',   hp: 26000, reward: { xp: 6200,  gold: 1600 } },",
"        { name: 'Beru',               img: 'icons/bosses/beru.svg',               hp: 22000, reward: { xp: 5200,  gold: 1300 } },",
"    ],",
"    X: [",
"        { name: 'The Absolute Being', img: 'icons/bosses/the_absolute_being.svg', hp: 100000, reward: { xp: 25000, gold: 10000 } },",
"        { name: 'Ashborn Reborn',     img: 'icons/bosses/ashborn_reborn.svg',     hp: 90000,  reward: { xp: 22000, gold: 9000 } },",
"        { name: 'Ruler of Death',     img: 'icons/bosses/ruler_of_death.svg',     hp: 110000, reward: { xp: 28000, gold: 11000 } },",
"        { name: 'The Architect',      img: 'icons/bosses/the_architect.svg',      hp: 95000,  reward: { xp: 24000, gold: 9500 } },",
"        { name: 'Chaos Sovereign',    img: 'icons/bosses/chaos_sovereign.svg',    hp: 120000, reward: { xp: 30000, gold: 12000 } },",
"    ],",
"};"
].join('\n');

code = code.substring(0, start) + newPool + code.substring(end);
fs.writeFileSync('js/features.js', code, 'utf8');
console.log('BOSS_POOL updated successfully');
