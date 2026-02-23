// ==========================================
//  SKILL-TREE.JS — Branching Skill Paths
//  3 branches: Strength / Endurance / Shadow
//  Earn 1 skill point every 5 levels
// ==========================================

const SKILL_TREE = {
    strength: {
        name: 'Path of Destruction',
        icon: '⚔',
        color: '#ff4444',
        desc: 'Raw power. Crush everything.',
        nodes: [
            { id: 'str_t1', name: 'Iron Fist',          icon: '👊', desc: '+15% STR growth from workouts.',               cost: 1, tier: 1, requires: null,     effect: { stat: 'str', bonus: 0.15 } },
            { id: 'str_t2', name: 'Titan Grip',         icon: '🦾', desc: '+10% bonus XP from strength exercises.',       cost: 1, tier: 2, requires: 'str_t1', effect: { stat: 'str_xp', bonus: 0.10 } },
            { id: 'str_t3', name: 'Berserker Blood',    icon: '🩸', desc: '+20% STR growth. +5% boss damage.',            cost: 2, tier: 3, requires: 'str_t2', effect: { stat: 'str', bonus: 0.20, bossDmg: 0.05 } },
            { id: 'str_t4', name: 'War Machine',        icon: '⚙',  desc: '+10% to all physical stat growth.',            cost: 2, tier: 4, requires: 'str_t3', effect: { stat: 'all_phys', bonus: 0.10 } },
            { id: 'str_t5', name: 'Monarch\'s Wrath',   icon: '💥', desc: 'ULTIMATE: +30% STR, +15% boss damage.',        cost: 3, tier: 5, requires: 'str_t4', effect: { stat: 'str', bonus: 0.30, bossDmg: 0.15 } },
        ]
    },
    endurance: {
        name: 'Path of Resilience',
        icon: '◉',
        color: '#44ff44',
        desc: 'Outlast everything. Never break.',
        nodes: [
            { id: 'end_t1', name: 'Second Wind',        icon: '💨', desc: '+15% END growth from workouts.',               cost: 1, tier: 1, requires: null,     effect: { stat: 'end', bonus: 0.15 } },
            { id: 'end_t2', name: 'Runner\'s High',     icon: '🏃', desc: '+10% bonus XP from cardio exercises.',         cost: 1, tier: 2, requires: 'end_t1', effect: { stat: 'end_xp', bonus: 0.10 } },
            { id: 'end_t3', name: 'Iron Lungs',         icon: '🫁', desc: '+20% VIT growth. +10% streak protection.',     cost: 2, tier: 3, requires: 'end_t2', effect: { stat: 'vit', bonus: 0.20 } },
            { id: 'end_t4', name: 'Unbreakable Core',   icon: '🏔',  desc: '+10% to END and VIT growth.',                  cost: 2, tier: 4, requires: 'end_t3', effect: { stat: 'end_vit', bonus: 0.10 } },
            { id: 'end_t5', name: 'Immortal Vessel',    icon: '♾',  desc: 'ULTIMATE: +30% END/VIT, -20% decay penalty.',  cost: 3, tier: 5, requires: 'end_t4', effect: { stat: 'end', bonus: 0.30, decayReduce: 0.20 } },
        ]
    },
    shadow: {
        name: 'Path of Shadows',
        icon: '☬',
        color: '#aa44ff',
        desc: 'Discipline. Control. Transcendence.',
        nodes: [
            { id: 'shd_t1', name: 'Shadow Discipline',  icon: '🧘', desc: '+15% WIL growth. Mind over matter.',           cost: 1, tier: 1, requires: null,     effect: { stat: 'wil', bonus: 0.15 } },
            { id: 'shd_t2', name: 'Dark Meditation',    icon: '🌙', desc: '+10% bonus XP from discipline quests.',        cost: 1, tier: 2, requires: 'shd_t1', effect: { stat: 'wil_xp', bonus: 0.10 } },
            { id: 'shd_t3', name: 'Shadow Extract',     icon: '🖤', desc: '+1 shadow soldier per 2 boss kills (was 1).',  cost: 2, tier: 3, requires: 'shd_t2', effect: { stat: 'shadow_army', bonus: 1 } },
            { id: 'shd_t4', name: 'Void Walker',        icon: '🕳',  desc: '+15% gold from all sources.',                  cost: 2, tier: 4, requires: 'shd_t3', effect: { stat: 'gold', bonus: 0.15 } },
            { id: 'shd_t5', name: 'Shadow Sovereign',   icon: '👑', desc: 'ULTIMATE: +25% all growth, +20% gold.',        cost: 3, tier: 5, requires: 'shd_t4', effect: { stat: 'all', bonus: 0.25, goldBonus: 0.20 } },
        ]
    }
};

// Calculate total skill points earned (1 per 5 levels)
function getTotalSkillPoints() {
    return Math.floor((D.level) / 5);
}

// Calculate spent skill points
function getSpentSkillPoints() {
    if (!D.skillTree) return 0;
    let spent = 0;
    for (const branch of Object.keys(SKILL_TREE)) {
        const unlocked = D.skillTree[branch] || [];
        for (const nodeId of unlocked) {
            const node = SKILL_TREE[branch].nodes.find(n => n.id === nodeId);
            if (node) spent += node.cost;
        }
    }
    return spent;
}

function getAvailableSkillPoints() {
    return getTotalSkillPoints() - getSpentSkillPoints();
}

// Check if a node can be unlocked
function canUnlockNode(branch, nodeId) {
    const branchData = SKILL_TREE[branch];
    if (!branchData) return false;
    const node = branchData.nodes.find(n => n.id === nodeId);
    if (!node) return false;

    const unlocked = (D.skillTree && D.skillTree[branch]) || [];

    // Already unlocked?
    if (unlocked.includes(nodeId)) return false;

    // Has enough points?
    if (getAvailableSkillPoints() < node.cost) return false;

    // Prerequisite met?
    if (node.requires && !unlocked.includes(node.requires)) return false;

    return true;
}

// Unlock a node
function unlockSkillNode(branch, nodeId) {
    if (!canUnlockNode(branch, nodeId)) return false;

    if (!D.skillTree) D.skillTree = {};
    if (!D.skillTree[branch]) D.skillTree[branch] = [];

    D.skillTree[branch].push(nodeId);

    const node = SKILL_TREE[branch].nodes.find(n => n.id === nodeId);
    if (typeof playSound === 'function') playSound('levelUp');
    if (typeof vibrate === 'function') vibrate([40, 60, 40]);
    sysNotify(`[Skill Unlocked] ${node.icon} ${node.name} — ${node.desc}`, 'green');

    saveGame();
    renderSkillTree();
    return true;
}

// Check if a node is unlocked
function isNodeUnlocked(branch, nodeId) {
    return D.skillTree && D.skillTree[branch] && D.skillTree[branch].includes(nodeId);
}

// Get node state: 'unlocked', 'available', 'locked'
function getNodeState(branch, nodeId) {
    if (isNodeUnlocked(branch, nodeId)) return 'unlocked';
    if (canUnlockNode(branch, nodeId)) return 'available';
    return 'locked';
}

// Get total bonuses from skill tree (for engine integration)
function getSkillTreeBonuses() {
    const bonuses = {
        str: 0, agi: 0, vit: 0, end: 0, wil: 0, phs: 0,
        allGrowth: 0, bossDmg: 0, goldBonus: 0, decayReduce: 0,
        strXp: 0, endXp: 0, wilXp: 0
    };

    if (!D.skillTree) return bonuses;

    for (const branch of Object.keys(SKILL_TREE)) {
        const unlocked = D.skillTree[branch] || [];
        for (const nodeId of unlocked) {
            const node = SKILL_TREE[branch].nodes.find(n => n.id === nodeId);
            if (!node) continue;
            const e = node.effect;

            if (e.stat === 'str') bonuses.str += e.bonus;
            if (e.stat === 'end') bonuses.end += e.bonus;
            if (e.stat === 'vit') bonuses.vit += e.bonus;
            if (e.stat === 'wil') bonuses.wil += e.bonus;
            if (e.stat === 'all_phys') { bonuses.str += e.bonus; bonuses.agi += e.bonus; bonuses.vit += e.bonus; bonuses.end += e.bonus; }
            if (e.stat === 'end_vit') { bonuses.end += e.bonus; bonuses.vit += e.bonus; }
            if (e.stat === 'all') bonuses.allGrowth += e.bonus;
            if (e.stat === 'str_xp') bonuses.strXp += e.bonus;
            if (e.stat === 'end_xp') bonuses.endXp += e.bonus;
            if (e.stat === 'wil_xp') bonuses.wilXp += e.bonus;
            if (e.stat === 'gold') bonuses.goldBonus += e.bonus;
            if (e.bossDmg) bonuses.bossDmg += e.bossDmg;
            if (e.goldBonus) bonuses.goldBonus += e.goldBonus;
            if (e.decayReduce) bonuses.decayReduce += e.decayReduce;
        }
    }

    return bonuses;
}

// ---- RENDER ----
let currentBranch = 'strength';

function renderSkillTree() {
    const container = document.getElementById('skillTreeContent');
    if (!container) return;

    const avail = getAvailableSkillPoints();
    const total = getTotalSkillPoints();
    const spent = getSpentSkillPoints();

    // Points display
    document.getElementById('stPointsCount').textContent = avail;
    document.getElementById('stPointsTotal').textContent = `${spent} spent · ${total} earned (1 per 5 levels)`;

    // Branch tabs
    document.querySelectorAll('.st-branch-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.branch === currentBranch);
    });

    // Render active branch
    const branch = SKILL_TREE[currentBranch];
    const nodesEl = document.getElementById('stNodes');
    const unlocked = (D.skillTree && D.skillTree[currentBranch]) || [];

    // Branch header
    document.getElementById('stBranchName').textContent = branch.name;
    document.getElementById('stBranchName').style.color = branch.color;
    document.getElementById('stBranchName').style.textShadow = `0 0 10px ${branch.color}50`;
    document.getElementById('stBranchDesc').textContent = branch.desc;

    // Count unlocked in this branch
    const branchUnlocked = unlocked.length;
    const branchTotal = branch.nodes.length;
    document.getElementById('stBranchProgress').textContent = `${branchUnlocked} / ${branchTotal}`;
    document.getElementById('stBranchProgress').style.color = branch.color;

    // Nodes
    let html = '';
    for (const node of branch.nodes) {
        const state = getNodeState(currentBranch, node.id);
        const stateClass = state;

        // Connection line dot
        const dotColor = state === 'unlocked' ? branch.color :
                         state === 'available' ? '#ffff44' : 'rgba(255,255,255,0.15)';

        html += `<div class="st-connector"><div class="st-dot" style="background:${dotColor};box-shadow:0 0 8px ${dotColor}"></div></div>`;

        html += `<div class="st-node ${stateClass}" data-node="${node.id}" data-branch="${currentBranch}" onclick="handleNodeClick('${currentBranch}','${node.id}')">
            <div class="st-node-icon" style="${state === 'unlocked' ? 'color:' + branch.color : ''}">${node.icon}</div>
            <div class="st-node-info">
                <div class="st-node-name">${node.name}</div>
                <div class="st-node-desc">${node.desc}</div>
                <div class="st-node-meta">
                    <span class="st-node-tier">Tier ${node.tier}</span>
                    <span class="st-node-cost">${node.cost} SP</span>
                    ${state === 'unlocked' ? '<span class="st-node-tag st-unlocked-tag">✓ UNLOCKED</span>' : ''}
                    ${state === 'available' ? '<span class="st-node-tag st-available-tag">⬡ AVAILABLE</span>' : ''}
                    ${state === 'locked' ? '<span class="st-node-tag st-locked-tag">🔒 LOCKED</span>' : ''}
                </div>
            </div>
        </div>`;
    }

    nodesEl.innerHTML = html;
}

function handleNodeClick(branch, nodeId) {
    const state = getNodeState(branch, nodeId);
    if (state === 'available') {
        unlockSkillNode(branch, nodeId);
    } else if (state === 'locked') {
        const node = SKILL_TREE[branch].nodes.find(n => n.id === nodeId);
        if (node.requires && !isNodeUnlocked(branch, node.requires)) {
            const req = SKILL_TREE[branch].nodes.find(n => n.id === node.requires);
            sysNotify(`[Locked] Requires "${req.name}" first.`, 'red');
        } else {
            sysNotify(`[Locked] Not enough skill points (need ${node.cost}).`, 'red');
        }
    }
}

function switchBranch(branch) {
    currentBranch = branch;
    renderSkillTree();
}

function initSkillTree() {
    // Branch tab clicks
    document.querySelectorAll('.st-branch-tab').forEach(tab => {
        tab.addEventListener('click', () => switchBranch(tab.dataset.branch));
    });

    // Ensure D.skillTree exists
    if (!D.skillTree) {
        D.skillTree = { strength: [], endurance: [], shadow: [] };
        saveGame();
    }
}
