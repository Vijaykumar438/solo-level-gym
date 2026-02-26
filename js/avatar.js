// ==========================================
//  AVATAR.JS — Rank-based body evolution
//  v36: Enhanced animations & visual effects
// ==========================================

function renderAvatar() {
    const container = document.getElementById('avatarContainer');
    if (!container) return;
    
    const rank = getRank(D.level);
    const rankName = rank.name;
    
    container.innerHTML = '';
    container.className = 'avatar-wrap avatar-' + rankName.toLowerCase();
    
    // Build SVG avatar
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 400');
    svg.setAttribute('class', 'avatar-svg');
    
    // Background energy field (behind everything)
    svg.innerHTML += getEnergyField(rankName);
    
    // Aura layer (behind body)
    const aura = getAuraForRank(rankName);
    if (aura) svg.innerHTML += aura;
    
    // Body
    svg.innerHTML += getBodyForRank(rankName);
    
    // Particle effects (all ranks get subtle particles, higher ranks get more)
    svg.innerHTML += getAvatarParticles(rankName);
    
    // Rising energy wisps for B+ ranks
    if (['B', 'A', 'S', 'X'].includes(rankName)) {
        svg.innerHTML += getEnergyWisps(rankName);
    }
    
    // Lightning arcs for S & X ranks
    if (['S', 'X'].includes(rankName)) {
        svg.innerHTML += getLightningArcs(rankName);
    }
    
    container.appendChild(svg);
    
    // Rank label
    const label = document.createElement('div');
    label.className = 'avatar-rank-label';
    label.innerHTML = `<span class="arl-rank rank-badge-sm ${rank.css}">${rankName}</span>
        <span class="arl-title">${getTitle(D.level)}</span>`;
    container.appendChild(label);
    
    // Stat bars under avatar
    const bars = document.createElement('div');
    bars.className = 'avatar-stats';
    const mainStats = ['str', 'agi', 'vit'];
    bars.innerHTML = mainStats.map(s => {
        const val = D.stats[s];
        const pct = Math.min((val / 150) * 100, 100);
        return `<div class="avs-row">
            <span class="avs-name">${s.toUpperCase()}</span>
            <div class="avs-track"><div class="avs-fill avs-${s}" style="width:${pct}%"></div></div>
            <span class="avs-val">${val}</span>
        </div>`;
    }).join('');
    container.appendChild(bars);
}

// ---- Background Energy Field ----
function getEnergyField(rank) {
    const fields = {
        E: '',
        D: `<circle cx="100" cy="200" r="120" fill="url(#fieldD)" class="energy-field-slow"/>
            <defs><radialGradient id="fieldD"><stop offset="0%" stop-color="rgba(102,187,106,0.04)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>`,
        C: `<circle cx="100" cy="200" r="130" fill="url(#fieldC)" class="energy-field"/>
            <defs><radialGradient id="fieldC"><stop offset="0%" stop-color="rgba(66,165,245,0.06)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>`,
        B: `<circle cx="100" cy="200" r="140" fill="url(#fieldB)" class="energy-field"/>
            <circle cx="100" cy="200" r="100" fill="url(#fieldB2)" class="energy-field-rev"/>
            <defs>
                <radialGradient id="fieldB"><stop offset="0%" stop-color="rgba(171,71,188,0.06)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldB2"><stop offset="0%" stop-color="rgba(206,147,216,0.04)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            </defs>`,
        A: `<circle cx="100" cy="200" r="150" fill="url(#fieldA)" class="energy-field"/>
            <circle cx="100" cy="200" r="110" fill="url(#fieldA2)" class="energy-field-rev"/>
            <defs>
                <radialGradient id="fieldA"><stop offset="0%" stop-color="rgba(255,167,38,0.08)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldA2"><stop offset="0%" stop-color="rgba(255,224,130,0.04)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            </defs>`,
        S: `<circle cx="100" cy="200" r="160" fill="url(#fieldS)" class="energy-field"/>
            <circle cx="100" cy="200" r="120" fill="url(#fieldS2)" class="energy-field-rev"/>
            <circle cx="100" cy="200" r="80" fill="url(#fieldS3)" class="energy-field"/>
            <defs>
                <radialGradient id="fieldS"><stop offset="0%" stop-color="rgba(255,215,64,0.1)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldS2"><stop offset="0%" stop-color="rgba(79,195,247,0.06)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldS3"><stop offset="0%" stop-color="rgba(255,255,255,0.04)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            </defs>`,
        X: `<circle cx="100" cy="200" r="170" fill="url(#fieldX)" class="energy-field-pulse"/>
            <circle cx="100" cy="200" r="130" fill="url(#fieldX2)" class="energy-field-rev"/>
            <circle cx="100" cy="200" r="90" fill="url(#fieldX3)" class="energy-field-pulse"/>
            <circle cx="100" cy="200" r="50" fill="url(#fieldX4)" class="energy-field"/>
            <defs>
                <radialGradient id="fieldX"><stop offset="0%" stop-color="rgba(213,0,0,0.12)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldX2"><stop offset="0%" stop-color="rgba(0,0,0,0.15)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldX3"><stop offset="0%" stop-color="rgba(255,23,68,0.1)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
                <radialGradient id="fieldX4"><stop offset="0%" stop-color="rgba(255,82,82,0.06)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            </defs>`
    };
    return fields[rank] || '';
}

// ---- Aura System ----
function getAuraForRank(rank) {
    switch(rank) {
        case 'E': return '';
        case 'D': return `
            <circle cx="100" cy="180" r="70" fill="none" stroke="rgba(102,187,106,0.1)" stroke-width="1" class="aura-pulse"/>`;
        case 'C': return `
            <circle cx="100" cy="180" r="80" fill="none" stroke="rgba(66,165,245,0.15)" stroke-width="2" class="aura-pulse"/>
            <circle cx="100" cy="180" r="65" fill="none" stroke="rgba(66,165,245,0.08)" stroke-width="1" class="aura-pulse-delay"/>`;
        case 'B': return `
            <ellipse cx="100" cy="200" rx="85" ry="120" fill="url(#auraGradB)" class="aura-breathe"/>
            <defs><radialGradient id="auraGradB"><stop offset="0%" stop-color="rgba(171,71,188,0.12)"/><stop offset="100%" stop-color="rgba(171,71,188,0)"/></radialGradient></defs>
            <circle cx="100" cy="180" r="75" fill="none" stroke="rgba(171,71,188,0.12)" stroke-width="1.5" class="aura-ring-spin" stroke-dasharray="10 15"/>`;
        case 'A': return `
            <ellipse cx="100" cy="200" rx="90" ry="140" fill="url(#auraGradA)" class="aura-breathe"/>
            <defs><radialGradient id="auraGradA"><stop offset="0%" stop-color="rgba(255,167,38,0.18)"/><stop offset="100%" stop-color="rgba(255,167,38,0)"/></radialGradient></defs>
            <circle cx="100" cy="180" r="75" fill="none" stroke="rgba(255,167,38,0.15)" stroke-width="1.5" class="aura-ring-spin" stroke-dasharray="8 12"/>
            <circle cx="100" cy="180" r="90" fill="none" stroke="rgba(255,167,38,0.08)" stroke-width="1" class="aura-ring-spin-rev" stroke-dasharray="5 15"/>`;
        case 'S': return `
            <ellipse cx="100" cy="200" rx="95" ry="160" fill="url(#auraGradS)" class="aura-breathe"/>
            <ellipse cx="100" cy="200" rx="75" ry="130" fill="url(#auraGradS2)" class="aura-breathe-fast"/>
            <defs>
                <radialGradient id="auraGradS"><stop offset="0%" stop-color="rgba(255,215,64,0.2)"/><stop offset="100%" stop-color="rgba(255,215,64,0)"/></radialGradient>
                <radialGradient id="auraGradS2"><stop offset="0%" stop-color="rgba(79,195,247,0.1)"/><stop offset="100%" stop-color="rgba(79,195,247,0)"/></radialGradient>
            </defs>
            <circle cx="100" cy="180" r="80" fill="none" stroke="rgba(255,215,64,0.2)" stroke-width="2" class="aura-ring-spin" stroke-dasharray="5 8"/>
            <circle cx="100" cy="180" r="60" fill="none" stroke="rgba(79,195,247,0.12)" stroke-width="1.5" class="aura-ring-spin-rev" stroke-dasharray="3 10"/>
            <circle cx="100" cy="180" r="95" fill="none" stroke="rgba(255,215,64,0.08)" stroke-width="1" class="aura-pulse"/>`;
        case 'X': return `
            <ellipse cx="100" cy="200" rx="100" ry="180" fill="url(#auraGradX)" class="aura-breathe"/>
            <ellipse cx="100" cy="200" rx="80" ry="145" fill="url(#auraGradX2)" class="aura-breathe-fast"/>
            <ellipse cx="100" cy="200" rx="60" ry="110" fill="url(#auraGradX3)" class="aura-breathe"/>
            <defs>
                <radialGradient id="auraGradX"><stop offset="0%" stop-color="rgba(213,0,0,0.25)"/><stop offset="100%" stop-color="rgba(213,0,0,0)"/></radialGradient>
                <radialGradient id="auraGradX2"><stop offset="0%" stop-color="rgba(0,0,0,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient>
                <radialGradient id="auraGradX3"><stop offset="0%" stop-color="rgba(255,23,68,0.15)"/><stop offset="100%" stop-color="rgba(255,23,68,0)"/></radialGradient>
            </defs>
            <circle cx="100" cy="180" r="90" fill="none" stroke="rgba(213,0,0,0.25)" stroke-width="2.5" class="aura-ring-spin" stroke-dasharray="4 6"/>
            <circle cx="100" cy="180" r="70" fill="none" stroke="rgba(255,23,68,0.15)" stroke-width="1.5" class="aura-ring-spin-rev" stroke-dasharray="6 8"/>
            <circle cx="100" cy="180" r="50" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1" class="aura-ring-spin" stroke-dasharray="2 12"/>
            <circle cx="100" cy="180" r="105" fill="none" stroke="rgba(213,0,0,0.1)" stroke-width="1" class="aura-pulse"/>`;
        default: return '';
    }
}

// ---- Body SVG ----
function getBodyForRank(rank) {
    const colors = {
        E: { fill: 'rgba(120,144,156,0.15)', stroke: '#78909c', glow: 'none', muscle: 0 },
        D: { fill: 'rgba(102,187,106,0.12)', stroke: '#66bb6a', glow: 'none', muscle: 1 },
        C: { fill: 'rgba(66,165,245,0.12)',  stroke: '#42a5f5', glow: 'url(#glowC)', muscle: 2 },
        B: { fill: 'rgba(171,71,188,0.12)',  stroke: '#ab47bc', glow: 'url(#glowB)', muscle: 3 },
        A: { fill: 'rgba(255,167,38,0.12)',  stroke: '#ffa726', glow: 'url(#glowA)', muscle: 4 },
        S: { fill: 'rgba(255,215,64,0.12)',  stroke: '#ffd740', glow: 'url(#glowS)', muscle: 5 },
        X: { fill: 'rgba(213,0,0,0.15)',     stroke: '#ff1744', glow: 'url(#glowX)', muscle: 6 }
    };
    
    const c = colors[rank] || colors.E;
    const sw = 1.5 + c.muscle * 0.3;
    
    const chest = 22 + c.muscle * 3;
    const shoulder = 38 + c.muscle * 5;
    const arm = 6 + c.muscle * 1.5;
    const leg = 8 + c.muscle * 1.5;
    const torso = 18 + c.muscle * 2;
    
    let defs = '';
    if (rank !== 'E' && rank !== 'D') {
        defs = `<defs>
            <filter id="glow${rank}"><feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>`;
    }
    
    const filter = c.glow !== 'none' ? `filter="${c.glow}"` : '';
    
    // Eye style per rank
    let eyes = `
        <circle cx="92" cy="62" r="2.5" fill="${c.stroke}" class="avatar-eye"/>
        <circle cx="108" cy="62" r="2.5" fill="${c.stroke}" class="avatar-eye"/>`;
    
    if (rank === 'A') {
        eyes += `<circle cx="92" cy="62" r="1.2" fill="#ffa726" class="eye-glow-a"/>
                 <circle cx="108" cy="62" r="1.2" fill="#ffa726" class="eye-glow-a"/>`;
    } else if (rank === 'S') {
        eyes += `<circle cx="92" cy="62" r="1.5" fill="#ffd740" class="eye-glow-s"/>
                 <circle cx="108" cy="62" r="1.5" fill="#ffd740" class="eye-glow-s"/>`;
    } else if (rank === 'X') {
        eyes = `<circle cx="92" cy="62" r="3" fill="#ff1744" class="avatar-eye eye-glow-x"/>
                <circle cx="108" cy="62" r="3" fill="#ff1744" class="avatar-eye eye-glow-x"/>
                <circle cx="92" cy="62" r="1" fill="#fff"/>
                <circle cx="108" cy="62" r="1" fill="#fff"/>`;
    }

    // Energy veins for A+ ranks
    let veins = '';
    if (c.muscle >= 4) {
        const veinColor = rank === 'X' ? '#d50000' : rank === 'S' ? '#ffd740' : '#ffa726';
        const veinOp = rank === 'X' ? 0.4 : 0.25;
        veins = `
        <path d="M90,120 Q85,140 88,165 Q90,185 92,200" fill="none" stroke="${veinColor}" stroke-width="0.6" opacity="${veinOp}" class="vein-pulse"/>
        <path d="M110,120 Q115,140 112,165 Q110,185 108,200" fill="none" stroke="${veinColor}" stroke-width="0.6" opacity="${veinOp}" class="vein-pulse vein-d1"/>
        <path d="M${100-shoulder-2},115 Q${100-shoulder-6},140 ${100-shoulder-5},165" fill="none" stroke="${veinColor}" stroke-width="0.5" opacity="${veinOp * 0.8}" class="vein-pulse vein-d2"/>
        <path d="M${100+shoulder+2},115 Q${100+shoulder+6},140 ${100+shoulder+5},165" fill="none" stroke="${veinColor}" stroke-width="0.5" opacity="${veinOp * 0.8}" class="vein-pulse vein-d3"/>`;
    }

    return `${defs}
    <g ${filter} class="avatar-body">
        <!-- Head -->
        <circle cx="100" cy="65" r="22" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw}" class="head-idle"/>
        ${eyes}
        
        <!-- Neck -->
        <line x1="100" y1="87" x2="100" y2="100" stroke="${c.stroke}" stroke-width="${sw + 1}"/>
        
        <!-- Shoulders -->
        <line x1="${100 - shoulder}" y1="108" x2="${100 + shoulder}" y2="108" stroke="${c.stroke}" stroke-width="${sw + 1}" stroke-linecap="round"/>
        
        <!-- Torso -->
        <path d="M${100 - shoulder},108 L${100 - chest},150 L${100 - torso},210 L${100 + torso},210 L${100 + chest},150 L${100 + shoulder},108" 
              fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
        
        ${c.muscle >= 2 ? `
        <!-- Chest definition -->
        <path d="M92,120 Q100,135 108,120" fill="none" stroke="${c.stroke}" stroke-width="0.8" opacity="0.4"/>
        <!-- Center line -->
        <line x1="100" y1="140" x2="100" y2="200" stroke="${c.stroke}" stroke-width="0.6" opacity="0.3"/>
        <!-- Abs -->
        <line x1="90" y1="160" x2="110" y2="160" stroke="${c.stroke}" stroke-width="0.5" opacity="0.25"/>
        <line x1="91" y1="175" x2="109" y2="175" stroke="${c.stroke}" stroke-width="0.5" opacity="0.25"/>
        <line x1="92" y1="190" x2="108" y2="190" stroke="${c.stroke}" stroke-width="0.5" opacity="0.25"/>
        ` : ''}

        ${veins}
        
        <!-- Left Arm -->
        <line x1="${100 - shoulder}" y1="108" x2="${100 - shoulder - 8}" y2="170" stroke="${c.stroke}" stroke-width="${arm}" stroke-linecap="round" class="arm-left"/>
        <line x1="${100 - shoulder - 8}" y1="170" x2="${100 - shoulder - 5}" y2="220" stroke="${c.stroke}" stroke-width="${arm - 1}" stroke-linecap="round" class="forearm-left"/>
        
        <!-- Right Arm -->
        <line x1="${100 + shoulder}" y1="108" x2="${100 + shoulder + 8}" y2="170" stroke="${c.stroke}" stroke-width="${arm}" stroke-linecap="round" class="arm-right"/>
        <line x1="${100 + shoulder + 8}" y1="170" x2="${100 + shoulder + 5}" y2="220" stroke="${c.stroke}" stroke-width="${arm - 1}" stroke-linecap="round" class="forearm-right"/>
        
        ${c.muscle >= 3 ? `
        <!-- Bicep bumps -->
        <circle cx="${100 - shoulder - 4}" cy="145" r="${arm * 0.7}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="0.6" opacity="0.5"/>
        <circle cx="${100 + shoulder + 4}" cy="145" r="${arm * 0.7}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="0.6" opacity="0.5"/>
        <!-- Deltoid caps -->
        <path d="M${100 - shoulder - 6},105 Q${100 - shoulder},98 ${100 - shoulder + 6},105" fill="none" stroke="${c.stroke}" stroke-width="0.8" opacity="0.4"/>
        <path d="M${100 + shoulder - 6},105 Q${100 + shoulder},98 ${100 + shoulder + 6},105" fill="none" stroke="${c.stroke}" stroke-width="0.8" opacity="0.4"/>
        ` : ''}
        
        <!-- Hands -->
        <circle cx="${100 - shoulder - 5}" cy="224" r="${arm * 0.5}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="0.8"/>
        <circle cx="${100 + shoulder + 5}" cy="224" r="${arm * 0.5}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="0.8"/>

        <!-- Left Leg -->
        <line x1="${100 - torso + 3}" y1="210" x2="${100 - torso - 5}" y2="290" stroke="${c.stroke}" stroke-width="${leg}" stroke-linecap="round"/>
        <line x1="${100 - torso - 5}" y1="290" x2="${100 - torso - 3}" y2="355" stroke="${c.stroke}" stroke-width="${leg - 1}" stroke-linecap="round"/>
        
        <!-- Right Leg -->
        <line x1="${100 + torso - 3}" y1="210" x2="${100 + torso + 5}" y2="290" stroke="${c.stroke}" stroke-width="${leg}" stroke-linecap="round"/>
        <line x1="${100 + torso + 5}" y1="290" x2="${100 + torso + 3}" y2="355" stroke="${c.stroke}" stroke-width="${leg - 1}" stroke-linecap="round"/>
        
        ${c.muscle >= 4 ? `
        <!-- Quad definition -->
        <path d="M${100 - torso},220 Q${100 - torso - 3},255 ${100 - torso - 4},280" fill="none" stroke="${c.stroke}" stroke-width="0.5" opacity="0.3"/>
        <path d="M${100 + torso},220 Q${100 + torso + 3},255 ${100 + torso + 4},280" fill="none" stroke="${c.stroke}" stroke-width="0.5" opacity="0.3"/>
        ` : ''}

        <!-- Feet -->
        <ellipse cx="${100 - torso - 3}" cy="360" rx="8" ry="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw * 0.7}"/>
        <ellipse cx="${100 + torso + 3}" cy="360" rx="8" ry="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw * 0.7}"/>
        
        ${rank === 'S' ? `
        <!-- Crown -->
        <polygon points="80,40 87,50 93,38 100,50 107,38 113,50 120,40 118,55 82,55" 
                 fill="rgba(255,215,64,0.3)" stroke="#ffd740" stroke-width="1.2" class="crown-glow"/>
        <!-- Crown gems -->
        <circle cx="93" cy="46" r="1.5" fill="#4fc3f7"/>
        <circle cx="100" cy="42" r="1.5" fill="#4fc3f7"/>
        <circle cx="107" cy="46" r="1.5" fill="#4fc3f7"/>
        ` : ''}
        
        ${rank === 'X' ? `
        <!-- Demon Horns -->
        <path d="M78,55 Q70,25 62,5" fill="none" stroke="#ff1744" stroke-width="3" stroke-linecap="round" class="horn-pulse"/>
        <path d="M122,55 Q130,25 138,5" fill="none" stroke="#ff1744" stroke-width="3" stroke-linecap="round" class="horn-pulse"/>
        <path d="M78,55 Q70,25 62,5" fill="none" stroke="#ff5252" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        <path d="M122,55 Q130,25 138,5" fill="none" stroke="#ff5252" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        <!-- Horn glow tips -->
        <circle cx="62" cy="5" r="4" fill="#ff1744" opacity="0.6" class="horn-tip-glow"/>
        <circle cx="138" cy="5" r="4" fill="#ff1744" opacity="0.6" class="horn-tip-glow"/>
        <circle cx="62" cy="5" r="2" fill="#fff" opacity="0.4"/>
        <circle cx="138" cy="5" r="2" fill="#fff" opacity="0.4"/>
        <!-- Threat markings -->
        <line x1="82" y1="55" x2="78" y2="70" stroke="#d50000" stroke-width="1.2" opacity="0.5"/>
        <line x1="118" y1="55" x2="122" y2="70" stroke="#d50000" stroke-width="1.2" opacity="0.5"/>
        <line x1="85" y1="58" x2="82" y2="72" stroke="#d50000" stroke-width="0.8" opacity="0.3"/>
        <line x1="115" y1="58" x2="118" y2="72" stroke="#d50000" stroke-width="0.8" opacity="0.3"/>
        <!-- Chest scars -->
        <line x1="88" y1="125" x2="100" y2="145" stroke="#d50000" stroke-width="0.8" opacity="0.4"/>
        <line x1="112" y1="125" x2="100" y2="145" stroke="#d50000" stroke-width="0.8" opacity="0.4"/>
        <line x1="95" y1="150" x2="105" y2="165" stroke="#d50000" stroke-width="0.6" opacity="0.3"/>
        <!-- Dark mist at feet -->
        <ellipse cx="100" cy="365" rx="50" ry="12" fill="rgba(0,0,0,0.3)" class="dark-mist"/>
        ` : ''}
        
        ${rank === 'A' ? `
        <!-- Shoulder armor -->
        <path d="M${100 - shoulder - 6},100 Q${100 - shoulder},93 ${100 - shoulder + 6},100" fill="rgba(255,167,38,0.1)" stroke="${c.stroke}" stroke-width="2" opacity="0.6"/>
        <path d="M${100 + shoulder - 6},100 Q${100 + shoulder},93 ${100 + shoulder + 6},100" fill="rgba(255,167,38,0.1)" stroke="${c.stroke}" stroke-width="2" opacity="0.6"/>
        ` : ''}

        ${rank === 'B' ? `
        <!-- Shoulder plates -->
        <path d="M${100 - shoulder - 4},102 Q${100 - shoulder},97 ${100 - shoulder + 4},102" fill="none" stroke="${c.stroke}" stroke-width="1.5" opacity="0.5"/>
        <path d="M${100 + shoulder - 4},102 Q${100 + shoulder},97 ${100 + shoulder + 4},102" fill="none" stroke="${c.stroke}" stroke-width="1.5" opacity="0.5"/>
        ` : ''}
    </g>`;
}

// ---- Floating Particles ----
function getAvatarParticles(rank) {
    let particles = '';
    const configs = {
        E: { count: 3, color: '#78909c', maxR: 1.5 },
        D: { count: 5, color: '#66bb6a', maxR: 1.8 },
        C: { count: 8, color: '#42a5f5', maxR: 2 },
        B: { count: 10, color: '#ab47bc', maxR: 2.2 },
        A: { count: 14, color: '#ffa726', maxR: 2.5 },
        S: { count: 18, color: '#ffd740', maxR: 3 },
        X: { count: 24, color: '#ff1744', maxR: 3.5 }
    };
    const cfg = configs[rank] || configs.E;
    
    for (let i = 0; i < cfg.count; i++) {
        const x = 25 + Math.random() * 150;
        const y = 40 + Math.random() * 320;
        const r = 0.5 + Math.random() * cfg.maxR;
        const delay = Math.random() * 4;
        const dur = 2.5 + Math.random() * 2;
        particles += `<circle cx="${x}" cy="${y}" r="${r}" fill="${cfg.color}" opacity="0.35" 
            class="avatar-particle" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`;
    }
    
    // X-rank dark energy particles
    if (rank === 'X') {
        for (let i = 0; i < 10; i++) {
            const x = 35 + Math.random() * 130;
            const y = 50 + Math.random() * 300;
            const r = 1.5 + Math.random() * 3;
            const delay = Math.random() * 5;
            particles += `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" opacity="0.25" 
                class="avatar-particle-dark" style="animation-delay:${delay}s"/>`;
        }
    }
    
    // S-rank sparkle particles
    if (rank === 'S') {
        for (let i = 0; i < 6; i++) {
            const x = 40 + Math.random() * 120;
            const y = 50 + Math.random() * 280;
            const delay = Math.random() * 3;
            particles += `<circle cx="${x}" cy="${y}" r="1" fill="#fff" opacity="0" 
                class="sparkle-particle" style="animation-delay:${delay}s"/>`;
        }
    }
    
    return particles;
}

// ---- Rising Energy Wisps (B+ ranks) ----
function getEnergyWisps(rank) {
    let wisps = '';
    const wispColors = {
        B: '#ce93d8', A: '#ffcc80', S: '#fff176', X: '#ff5252'
    };
    const color = wispColors[rank] || '#fff';
    const count = rank === 'X' ? 8 : rank === 'S' ? 6 : 4;
    
    for (let i = 0; i < count; i++) {
        const x = 50 + Math.random() * 100;
        const startY = 340 + Math.random() * 40;
        const delay = Math.random() * 5;
        const opacity = 0.15 + Math.random() * 0.2;
        const drift = -15 + Math.random() * 30;
        wisps += `<line x1="${x}" y1="${startY}" x2="${x + drift * 0.3}" y2="${startY - 15}" 
            stroke="${color}" stroke-width="1.5" stroke-linecap="round" 
            opacity="${opacity}" class="energy-wisp" 
            style="animation-delay:${delay}s;--wisp-drift:${drift}px"/>`;
    }
    
    // X-rank shadow wisps (dark energy rising)
    if (rank === 'X') {
        for (let i = 0; i < 5; i++) {
            const x = 55 + Math.random() * 90;
            const startY = 350 + Math.random() * 30;
            const delay = Math.random() * 6;
            wisps += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY - 20}" 
                stroke="#000" stroke-width="2" stroke-linecap="round" 
                opacity="0.2" class="shadow-wisp" 
                style="animation-delay:${delay}s"/>`;
        }
    }
    
    return wisps;
}

// ---- Lightning Arcs (S & X ranks) ----
function getLightningArcs(rank) {
    let arcs = '';
    const color = rank === 'X' ? '#ff1744' : '#4fc3f7';
    const count = rank === 'X' ? 4 : 2;
    
    for (let i = 0; i < count; i++) {
        const cx = 100;
        const cy = 180;
        const angle = Math.random() * Math.PI * 2;
        const r = 60 + Math.random() * 40;
        const x1 = cx + Math.cos(angle) * r;
        const y1 = cy + Math.sin(angle) * r * 1.4;
        const midAngle = angle + (Math.random() - 0.5) * 0.5;
        const midR = r * 0.5;
        const mx = cx + Math.cos(midAngle) * midR;
        const my = cy + Math.sin(midAngle) * midR * 1.4;
        const delay = Math.random() * 4;
        
        arcs += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} L${mx.toFixed(1)},${my.toFixed(1)} L${cx},${cy}" 
            fill="none" stroke="${color}" stroke-width="0.8" opacity="0"
            class="lightning-arc" style="animation-delay:${delay}s"/>`;
    }
    
    return arcs;
}
