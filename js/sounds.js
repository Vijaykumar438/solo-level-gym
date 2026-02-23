// ==========================================
//  SOUNDS.JS — Dark Fantasy Synthesized SFX
//  Dungeon echoes, war horns, and shadow magic
// ==========================================

let _audioCtx = null;

function getAudioCtx() {
    if (!_audioCtx) {
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_audioCtx.state === 'suspended') _audioCtx.resume();
    return _audioCtx;
}

// ---- Master toggle ----
function isSoundEnabled() {
    return D && D.settings && D.settings.soundEnabled !== false;
}

function toggleSound() {
    if (!D || !D.settings) return;
    D.settings.soundEnabled = !D.settings.soundEnabled;
    saveGame();
    const btn = document.getElementById('soundToggleBtn');
    if (btn) btn.textContent = D.settings.soundEnabled ? '🔊' : '🔇';
    if (D.settings.soundEnabled) playSound('click');
}

// ---- Core play helper ----
function playSound(name) {
    if (!isSoundEnabled()) return;
    try {
        const fn = SOUNDS[name];
        if (fn) fn();
    } catch (e) {
        console.warn('[Sound] Playback error:', e);
    }
}

// ---- Dark tone with optional filter for resonance ----
function darkTone(freq, duration, type = 'sawtooth', vol = 0.12, delay = 0, filterFreq = 0) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    if (filterFreq > 0) {
        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = filterFreq;
        filt.Q.value = 4;
        osc.connect(filt);
        filt.connect(gain);
    } else {
        osc.connect(gain);
    }
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
}

// ---- Deep rumble (sub-bass drone) ----
function darkRumble(freq, duration, vol = 0.12, delay = 0) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc2.type = 'sine';
    osc2.frequency.value = freq * 0.5;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = freq * 3;
    filt.Q.value = 2;
    osc.connect(filt);
    osc2.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + duration);
    osc2.stop(t + duration);
}

// ---- Dark noise (rumble-filtered) ----
function darkNoise(duration, vol = 0.08, delay = 0, cutoff = 800) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime + delay;
    const bufSize = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = cutoff;
    filt.Q.value = 1;
    src.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
}

// ---- Metallic bell / dark chime ----
function darkBell(freq, duration, vol = 0.08, delay = 0) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime + delay;
    // Fundamental + inharmonic partials for bell timbre
    [1, 2.76, 4.07, 5.2].forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const v = vol / (i + 1);
        osc.type = 'sine';
        osc.frequency.value = freq * ratio;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration / (i * 0.5 + 1));
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + duration);
    });
}

// ---- War horn / brass drone ----
function warHorn(freq, duration, vol = 0.10, delay = 0) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc2.type = 'sawtooth';
    osc2.frequency.value = freq * 1.005; // slight detune for thickness
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.08);
    gain.gain.setValueAtTime(vol * 0.8, t + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(freq * 2, t);
    filt.frequency.linearRampToValueAtTime(freq * 5, t + duration * 0.3);
    filt.frequency.linearRampToValueAtTime(freq * 1.5, t + duration);
    filt.Q.value = 3;
    osc.connect(filt);
    osc2.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + duration);
    osc2.stop(t + duration);
}

// ═══════════════════════════════════════════
//  DARK FANTASY SOUND DEFINITIONS
// ═══════════════════════════════════════════

const SOUNDS = {

    // ---- UI Click — stone button press in a dungeon ----
    click: () => {
        darkTone(120, 0.08, 'triangle', 0.07);
        darkNoise(0.04, 0.05, 0.01, 400);
    },

    // ---- XP Gain — soul absorption, dark whisper ----
    xpGain: () => {
        darkTone(220, 0.25, 'sine', 0.06);          // dark hum
        darkTone(330, 0.2, 'sine', 0.05, 0.05);     // minor 3rd
        darkTone(165, 0.3, 'sawtooth', 0.04, 0.08, 500); // sub rumble
        darkNoise(0.15, 0.03, 0.1, 600);             // whisper
    },

    // ---- Gold Gain — heavy coins on stone ----
    goldGain: () => {
        darkBell(800, 0.25, 0.06);
        darkBell(1050, 0.2, 0.04, 0.06);
        darkTone(100, 0.12, 'triangle', 0.05, 0.02); // weight thud
        darkNoise(0.06, 0.04, 0.03, 1200);
    },

    // ---- Quest Complete — dark blade slash + resonance ----
    questComplete: () => {
        // Blade whoosh
        darkNoise(0.15, 0.14, 0, 2000);
        // Deep impact
        darkRumble(70, 0.35, 0.12, 0.05);
        // Dark resonance bell
        darkBell(220, 0.5, 0.08, 0.1);
        // Minor 3rd confirmation
        darkTone(262, 0.3, 'sine', 0.07, 0.15);     // C4
        darkTone(311, 0.35, 'sine', 0.06, 0.22);     // Eb4 (minor 3rd)
    },

    // ---- Level Up — ominous power surge, dark choir ----
    levelUp: () => {
        // Deep foundation rumble
        darkRumble(55, 1.2, 0.14);
        // Dark choir — C minor chord (C Eb G)
        darkTone(131, 0.9, 'sawtooth', 0.06, 0.1, 600);  // C3
        darkTone(156, 0.9, 'sawtooth', 0.05, 0.15, 600);  // Eb3
        darkTone(196, 0.9, 'sawtooth', 0.05, 0.2, 600);   // G3
        // Higher octave choir swell
        darkTone(262, 0.8, 'sine', 0.08, 0.35);   // C4
        darkTone(311, 0.8, 'sine', 0.07, 0.4);    // Eb4
        darkTone(392, 0.8, 'sine', 0.07, 0.45);   // G4
        // Crown bell toll
        darkBell(523, 0.9, 0.10, 0.55);            // C5 bell
        // Thunder crack
        darkNoise(0.3, 0.12, 0.5, 400);
        // Final low power pulse
        darkRumble(40, 0.6, 0.08, 0.8);
    },

    // ---- Penalty / Decay — demonic growl + hellfire ----
    penalty: () => {
        // Demonic low drone
        darkRumble(35, 1.0, 0.16);
        darkRumble(42, 0.9, 0.12, 0.05); // dissonant layer
        // Gritty growl
        darkTone(55, 0.8, 'sawtooth', 0.10, 0.1, 200);
        // Tritone — the devil's interval
        darkTone(62, 0.6, 'sawtooth', 0.08, 0.2, 180);  // ~B1
        darkTone(88, 0.5, 'sawtooth', 0.07, 0.3, 180);  // ~F2 (tritone)
        // Hellfire crackle
        darkNoise(0.5, 0.10, 0.15, 300);
        darkNoise(0.3, 0.06, 0.4, 150);
    },

    // ---- Error — bone crack, dark rejection ----
    error: () => {
        darkTone(90, 0.12, 'square', 0.10);
        darkTone(65, 0.15, 'square', 0.10, 0.08);
        darkNoise(0.06, 0.08, 0.04, 500);
    },

    // ---- Shadow Mission Alarm — war horn + dungeon bell ----
    shadowMission: () => {
        // Ominous war horn
        warHorn(110, 0.7, 0.12);
        // Second horn (5th below)
        warHorn(73, 0.8, 0.08, 0.15);
        // Dark bell toll
        darkBell(180, 0.8, 0.10, 0.4);
        darkBell(180, 0.6, 0.07, 0.7);
        // Rumble underneath
        darkRumble(45, 0.9, 0.08, 0.1);
    },

    // ---- Boss Defeated — earth shatter + dark triumph ----
    bossDefeat: () => {
        // Massive impact
        darkRumble(30, 0.8, 0.18);
        darkNoise(0.4, 0.16, 0, 600);
        // Shattering
        darkNoise(0.2, 0.10, 0.1, 2500);
        // Dark triumph — A minor chord (A C E)
        darkTone(220, 0.7, 'sawtooth', 0.08, 0.35, 700);  // A3
        darkTone(262, 0.7, 'sawtooth', 0.07, 0.4, 700);   // C4
        darkTone(330, 0.7, 'sawtooth', 0.07, 0.45, 700);  // E4
        // Victorious bell
        darkBell(440, 0.8, 0.10, 0.55);
        darkBell(660, 0.6, 0.06, 0.65);
        // Final war horn
        warHorn(110, 0.6, 0.08, 0.7);
        darkRumble(50, 0.5, 0.06, 0.9);
    },

    // ---- Shop Buy — dark forge anvil strike ----
    shopBuy: () => {
        // Anvil impact
        darkBell(600, 0.3, 0.10);
        darkNoise(0.05, 0.08, 0, 1500);
        // Metal ring
        darkBell(900, 0.35, 0.06, 0.05);
        // Deep confirmation thud
        darkRumble(80, 0.2, 0.08, 0.08);
    },

    // ---- Stat Up — dark power channeling ----
    statUp: () => {
        const ctx = getAudioCtx();
        const t = ctx.currentTime;
        // Rising dark drone
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filt = ctx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.3);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(40, t);
        osc2.frequency.exponentialRampToValueAtTime(150, t + 0.3);
        filt.type = 'lowpass';
        filt.frequency.setValueAtTime(200, t);
        filt.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
        filt.Q.value = 5;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(filt);
        osc2.connect(filt);
        filt.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.45);
        osc2.stop(t + 0.45);
        // Dark spark
        darkBell(400, 0.2, 0.05, 0.15);
    },

    // ---- Workout Logged — heavy war hammer impact ----
    workout: () => {
        // Ground slam
        darkRumble(50, 0.35, 0.14);
        darkNoise(0.1, 0.12, 0, 800);
        // Metallic ring from impact
        darkBell(300, 0.3, 0.06, 0.05);
        // Aftershock
        darkRumble(35, 0.25, 0.06, 0.15);
    },

    // ---- Food Logged — potion bubble + dark cauldron ----
    food: () => {
        // Cauldron bubble
        darkTone(200, 0.15, 'sine', 0.06);
        darkTone(260, 0.12, 'sine', 0.05, 0.06);
        // Liquid pour
        darkNoise(0.1, 0.04, 0.04, 900);
        // Deep satisfaction
        darkTone(150, 0.2, 'triangle', 0.05, 0.12);
    },

    // ---- Login Reward — dungeon chest opening ----
    loginReward: () => {
        // Chest creak
        darkNoise(0.15, 0.06, 0, 400);
        // Treasure glow — ascending dark minor arpeggio
        darkBell(220, 0.4, 0.06, 0.1);    // A3
        darkBell(262, 0.4, 0.06, 0.2);    // C4
        darkBell(330, 0.4, 0.07, 0.3);    // E4
        darkBell(440, 0.5, 0.08, 0.4);    // A4
        // Magic shimmer
        darkTone(523, 0.4, 'sine', 0.05, 0.45);
        // Deep gong
        darkRumble(60, 0.4, 0.06, 0.5);
    },

    // ---- Boot Enter — dark awakening from the abyss ----
    boot: () => {
        // Abyss rumble rising
        darkRumble(30, 0.8, 0.08);
        darkRumble(45, 0.7, 0.06, 0.15);
        // War horn announces awakening
        warHorn(73, 0.6, 0.07, 0.3);
        // Heartbeat
        darkTone(40, 0.1, 'sine', 0.10, 0.5);
        darkTone(40, 0.1, 'sine', 0.08, 0.65);
        // Dark bell toll — the system awakens
        darkBell(146, 0.8, 0.10, 0.75);
        // Final shadow pulse
        darkRumble(35, 0.5, 0.06, 0.9);
    }
};
