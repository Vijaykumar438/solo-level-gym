// ==========================================
//  AVATAR.JS — Rank-based body evolution
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
    
    // Aura layer (behind body)
    const aura = getAuraForRank(rankName);
    if (aura) svg.innerHTML += aura;
    
    // Body
    svg.innerHTML += getBodyForRank(rankName);
    
    // Particle effects for higher ranks
    if (['A', 'S'].includes(rankName)) {
        svg.innerHTML += getAvatarParticles(rankName);
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

function getAuraForRank(rank) {
    switch(rank) {
        case 'E': return ''; // No aura
        case 'D': return `
            <circle cx="100" cy="180" r="70" fill="none" stroke="rgba(102,187,106,0.1)" stroke-width="1" class="aura-pulse"/>`;
        case 'C': return `
            <circle cx="100" cy="180" r="80" fill="none" stroke="rgba(66,165,245,0.15)" stroke-width="2" class="aura-pulse"/>
            <circle cx="100" cy="180" r="65" fill="none" stroke="rgba(66,165,245,0.08)" stroke-width="1" class="aura-pulse-delay"/>`;
        case 'B': return `
            <ellipse cx="100" cy="200" rx="85" ry="120" fill="url(#auraGradB)" class="aura-breathe"/>
            <defs><radialGradient id="auraGradB"><stop offset="0%" stop-color="rgba(171,71,188,0.12)"/><stop offset="100%" stop-color="rgba(171,71,188,0)"/></radialGradient></defs>`;
        case 'A': return `
            <ellipse cx="100" cy="200" rx="90" ry="140" fill="url(#auraGradA)" class="aura-breathe"/>
            <defs><radialGradient id="auraGradA"><stop offset="0%" stop-color="rgba(255,167,38,0.18)"/><stop offset="100%" stop-color="rgba(255,167,38,0)"/></radialGradient></defs>
            <circle cx="100" cy="180" r="75" fill="none" stroke="rgba(255,167,38,0.15)" stroke-width="1.5" class="aura-pulse"/>`;
        case 'S': return `
            <ellipse cx="100" cy="200" rx="95" ry="160" fill="url(#auraGradS)" class="aura-breathe"/>
            <ellipse cx="100" cy="200" rx="75" ry="130" fill="url(#auraGradS2)" class="aura-breathe-fast"/>
            <defs>
                <radialGradient id="auraGradS"><stop offset="0%" stop-color="rgba(255,215,64,0.2)"/><stop offset="100%" stop-color="rgba(255,215,64,0)"/></radialGradient>
                <radialGradient id="auraGradS2"><stop offset="0%" stop-color="rgba(79,195,247,0.1)"/><stop offset="100%" stop-color="rgba(79,195,247,0)"/></radialGradient>
            </defs>
            <circle cx="100" cy="180" r="80" fill="none" stroke="rgba(255,215,64,0.2)" stroke-width="2" class="aura-pulse"/>
            <circle cx="100" cy="180" r="60" fill="none" stroke="rgba(79,195,247,0.1)" stroke-width="1" class="aura-pulse-delay"/>`;
        default: return '';
    }
}

function getBodyForRank(rank) {
    // Body color & stroke settings per rank
    const colors = {
        E: { fill: 'rgba(120,144,156,0.15)', stroke: '#78909c', glow: 'none', muscle: 0 },
        D: { fill: 'rgba(102,187,106,0.12)', stroke: '#66bb6a', glow: 'none', muscle: 1 },
        C: { fill: 'rgba(66,165,245,0.12)',  stroke: '#42a5f5', glow: 'url(#glowC)', muscle: 2 },
        B: { fill: 'rgba(171,71,188,0.12)',  stroke: '#ab47bc', glow: 'url(#glowB)', muscle: 3 },
        A: { fill: 'rgba(255,167,38,0.12)',  stroke: '#ffa726', glow: 'url(#glowA)', muscle: 4 },
        S: { fill: 'rgba(255,215,64,0.12)',  stroke: '#ffd740', glow: 'url(#glowS)', muscle: 5 }
    };
    
    const c = colors[rank] || colors.E;
    const sw = 1.5 + c.muscle * 0.3; // Stroke width grows
    
    // Muscle scale factors
    const chest = 22 + c.muscle * 3;    // Chest width
    const shoulder = 38 + c.muscle * 5; // Shoulder width  
    const arm = 6 + c.muscle * 1.5;     // Arm thickness
    const leg = 8 + c.muscle * 1.5;     // Leg thickness
    const torso = 18 + c.muscle * 2;    // Torso width at waist
    
    let defs = '';
    if (rank !== 'E' && rank !== 'D') {
        defs = `<defs>
            <filter id="glow${rank}"><feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>`;
    }
    
    const filter = c.glow !== 'none' ? `filter="${c.glow}"` : '';
    
    return `${defs}
    <g ${filter} class="avatar-body">
        <!-- Head -->
        <circle cx="100" cy="65" r="22" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw}"/>
        <!-- Eyes -->
        <circle cx="92" cy="62" r="2.5" fill="${c.stroke}" class="avatar-eye"/>
        <circle cx="108" cy="62" r="2.5" fill="${c.stroke}" class="avatar-eye"/>
        ${rank === 'S' ? '<circle cx="92" cy="62" r="1" fill="#ffd740"/><circle cx="108" cy="62" r="1" fill="#ffd740"/>' : ''}
        
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
        <!-- Abs -->
        <line x1="100" y1="140" x2="100" y2="200" stroke="${c.stroke}" stroke-width="0.6" opacity="0.3"/>
        <line x1="90" y1="160" x2="110" y2="160" stroke="${c.stroke}" stroke-width="0.5" opacity="0.2"/>
        <line x1="91" y1="175" x2="109" y2="175" stroke="${c.stroke}" stroke-width="0.5" opacity="0.2"/>
        <line x1="92" y1="190" x2="108" y2="190" stroke="${c.stroke}" stroke-width="0.5" opacity="0.2"/>
        ` : ''}
        
        <!-- Left Arm -->
        <line x1="${100 - shoulder}" y1="108" x2="${100 - shoulder - 8}" y2="170" stroke="${c.stroke}" stroke-width="${arm}" stroke-linecap="round"/>
        <line x1="${100 - shoulder - 8}" y1="170" x2="${100 - shoulder - 5}" y2="220" stroke="${c.stroke}" stroke-width="${arm - 1}" stroke-linecap="round"/>
        
        <!-- Right Arm -->
        <line x1="${100 + shoulder}" y1="108" x2="${100 + shoulder + 8}" y2="170" stroke="${c.stroke}" stroke-width="${arm}" stroke-linecap="round"/>
        <line x1="${100 + shoulder + 8}" y1="170" x2="${100 + shoulder + 5}" y2="220" stroke="${c.stroke}" stroke-width="${arm - 1}" stroke-linecap="round"/>
        
        ${c.muscle >= 3 ? `
        <!-- Bicep bumps -->
        <circle cx="${100 - shoulder - 4}" cy="145" r="${arm * 0.7}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="0.6" opacity="0.5"/>
        <circle cx="${100 + shoulder + 4}" cy="145" r="${arm * 0.7}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="0.6" opacity="0.5"/>
        ` : ''}
        
        <!-- Left Leg -->
        <line x1="${100 - torso + 3}" y1="210" x2="${100 - torso - 5}" y2="290" stroke="${c.stroke}" stroke-width="${leg}" stroke-linecap="round"/>
        <line x1="${100 - torso - 5}" y1="290" x2="${100 - torso - 3}" y2="355" stroke="${c.stroke}" stroke-width="${leg - 1}" stroke-linecap="round"/>
        
        <!-- Right Leg -->
        <line x1="${100 + torso - 3}" y1="210" x2="${100 + torso + 5}" y2="290" stroke="${c.stroke}" stroke-width="${leg}" stroke-linecap="round"/>
        <line x1="${100 + torso + 5}" y1="290" x2="${100 + torso + 3}" y2="355" stroke="${c.stroke}" stroke-width="${leg - 1}" stroke-linecap="round"/>
        
        <!-- Feet -->
        <ellipse cx="${100 - torso - 3}" cy="360" rx="8" ry="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw * 0.7}"/>
        <ellipse cx="${100 + torso + 3}" cy="360" rx="8" ry="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw * 0.7}"/>
        
        ${rank === 'S' ? `
        <!-- Crown -->
        <polygon points="80,40 87,50 93,38 100,50 107,38 113,50 120,40 118,55 82,55" 
                 fill="rgba(255,215,64,0.3)" stroke="#ffd740" stroke-width="1.2"/>
        ` : ''}
        
        ${rank === 'A' ? `
        <!-- Shoulder armor hints -->
        <path d="M${100 - shoulder - 5},100 Q${100 - shoulder},95 ${100 - shoulder + 5},100" fill="none" stroke="${c.stroke}" stroke-width="2" opacity="0.6"/>
        <path d="M${100 + shoulder - 5},100 Q${100 + shoulder},95 ${100 + shoulder + 5},100" fill="none" stroke="${c.stroke}" stroke-width="2" opacity="0.6"/>
        ` : ''}
    </g>`;
}

function getAvatarParticles(rank) {
    let particles = '';
    const count = rank === 'S' ? 12 : 6;
    const color = rank === 'S' ? '#ffd740' : '#ffa726';
    
    for (let i = 0; i < count; i++) {
        const x = 30 + Math.random() * 140;
        const y = 50 + Math.random() * 300;
        const r = 1 + Math.random() * 2;
        const delay = Math.random() * 3;
        particles += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.4" class="avatar-particle" style="animation-delay:${delay}s"/>`;
    }
    return particles;
}
