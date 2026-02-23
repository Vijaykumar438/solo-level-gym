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

    // ===== SCROLLS — Wisdom & Titles =====
    { id: 's_scroll_pain',      cat: 'scroll',  name: 'Scroll of Pain',           icon: '📜',  desc: "Pain is the price of growth. Pay it willingly.",                                  cost: 60,   rankReq: 'E', tier: 1 },
    { id: 's_scroll_shadow',    cat: 'scroll',  name: 'Shadow Scripture',         icon: '📜',  desc: "In the darkness, I found my true form.",                                         cost: 150,  rankReq: 'D', tier: 2 },
    { id: 's_scroll_rebirth',   cat: 'scroll',  name: 'Scroll of Rebirth',        icon: '📜',  desc: "They broke me. I used the pieces to build something better.",                    cost: 350,  rankReq: 'C', tier: 3 },
    { id: 's_scroll_monarch',   cat: 'scroll',  name: 'Monarch Manuscript',       icon: '📜',  desc: "A king is not born. A king is forged in the fire others ran from.",              cost: 1000, rankReq: 'B', tier: 4 },
    { id: 's_scroll_sovereign', cat: 'scroll',  name: 'Sovereign Codex',          icon: '📜',  desc: "I am the one who remained when everyone else left.",                             cost: 3000, rankReq: 'A', tier: 5 },
    { id: 's_scroll_absolute',  cat: 'scroll',  name: 'Absolute Truth',           icon: '📜',  desc: "The Shadow Monarch needs no validation. Only discipline.",                       cost: 8000, rankReq: 'S', tier: 6 },
];

// Rank order for comparison
const RANK_ORDER = { E: 0, D: 1, C: 2, B: 3, A: 4, S: 5 };

// ---- Initialize shop data in save ----
function initShopData() {
    if (!D.shop) {
        D.shop = {
            purchased: [],  // ids of bought items (weapons/relics/scrolls are one-time)
            inventory: [],  // { id, qty } for consumables
            equipped: null  // currently equipped weapon id
        };
        saveGame();
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
