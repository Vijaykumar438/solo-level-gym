// ==========================================
//  SOUNDS.JS — Web Audio Synthesized Sound FX
//  Zero external files — pure oscillator magic
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

// ---- Utility: play a tone ----
function playTone(freq, duration, type = 'sine', gainVal = 0.15, delay = 0) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
}

// ---- Utility: noise burst ----
function playNoise(duration, gainVal = 0.08, delay = 0) {
    const ctx = getAudioCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime + delay);
}

// ═══════════════════════════════════════════
//  SOUND DEFINITIONS
// ═══════════════════════════════════════════

const SOUNDS = {

    // ---- UI Click — subtle tap ----
    click: () => {
        playTone(800, 0.06, 'sine', 0.08);
    },

    // ---- XP Gain — ascending sparkle ----
    xpGain: () => {
        playTone(600, 0.1, 'sine', 0.1);
        playTone(900, 0.1, 'sine', 0.1, 0.06);
        playTone(1200, 0.12, 'sine', 0.08, 0.12);
    },

    // ---- Gold Gain — metallic clink ----
    goldGain: () => {
        playTone(1800, 0.08, 'square', 0.06);
        playTone(2400, 0.1, 'square', 0.05, 0.04);
        playTone(3200, 0.12, 'sine', 0.04, 0.08);
    },

    // ---- Quest Complete — sword slash whoosh ----
    questComplete: () => {
        playNoise(0.12, 0.12);
        playTone(400, 0.15, 'sawtooth', 0.08);
        playTone(800, 0.2, 'sine', 0.12, 0.08);
        playTone(1200, 0.15, 'sine', 0.08, 0.15);
    },

    // ---- Level Up — epic fanfare ----
    levelUp: () => {
        // Chord: C E G C (major chord ascending)
        playTone(523, 0.6, 'sine', 0.12);        // C5
        playTone(659, 0.5, 'sine', 0.10, 0.1);   // E5
        playTone(784, 0.5, 'sine', 0.10, 0.2);   // G5
        playTone(1047, 0.8, 'sine', 0.14, 0.35); // C6
        // Shimmer
        playTone(1568, 0.4, 'sine', 0.05, 0.5);  // G6
        playTone(2093, 0.5, 'sine', 0.04, 0.6);  // C7
        // Power drum
        playNoise(0.15, 0.15, 0.3);
    },

    // ---- Penalty / Decay — dark rumble ----
    penalty: () => {
        playTone(80, 0.5, 'sawtooth', 0.15);
        playTone(60, 0.6, 'sawtooth', 0.12, 0.1);
        playTone(40, 0.8, 'sawtooth', 0.10, 0.3);
        playNoise(0.4, 0.08, 0.1);
    },

    // ---- Error — low buzz ----
    error: () => {
        playTone(150, 0.15, 'square', 0.10);
        playTone(120, 0.15, 'square', 0.10, 0.1);
    },

    // ---- Shadow Mission Alarm — urgent siren ----
    shadowMission: () => {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.45);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.7);
    },

    // ---- Boss Defeated — explosion + triumph ----
    bossDefeat: () => {
        // Explosion
        playNoise(0.3, 0.2);
        playTone(60, 0.4, 'sawtooth', 0.15);
        // Triumph chord (delayed)
        playTone(440, 0.5, 'sine', 0.12, 0.3);   // A4
        playTone(554, 0.5, 'sine', 0.10, 0.4);   // C#5
        playTone(659, 0.5, 'sine', 0.10, 0.5);   // E5
        playTone(880, 0.8, 'sine', 0.14, 0.6);   // A5
        playNoise(0.1, 0.06, 0.7);
    },

    // ---- Shop Buy — cash register ding ----
    shopBuy: () => {
        playTone(1200, 0.08, 'sine', 0.10);
        playTone(1800, 0.12, 'sine', 0.08, 0.06);
        playTone(2400, 0.15, 'sine', 0.06, 0.12);
    },

    // ---- Stat Up — power surge ----
    statUp: () => {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    },

    // ---- Workout Logged — impact slam ----
    workout: () => {
        playTone(200, 0.1, 'sawtooth', 0.12);
        playNoise(0.08, 0.10);
        playTone(600, 0.15, 'sine', 0.10, 0.08);
        playTone(900, 0.12, 'sine', 0.06, 0.15);
    },

    // ---- Food Logged — soft chime ----
    food: () => {
        playTone(880, 0.12, 'sine', 0.08);
        playTone(1100, 0.12, 'sine', 0.06, 0.08);
    },

    // ---- Login Reward — treasure chest ----
    loginReward: () => {
        playTone(500, 0.12, 'sine', 0.08);
        playTone(630, 0.12, 'sine', 0.08, 0.1);
        playTone(800, 0.12, 'sine', 0.08, 0.2);
        playTone(1000, 0.25, 'sine', 0.10, 0.3);
        playTone(1260, 0.3, 'sine', 0.06, 0.4);
    },

    // ---- Boot Enter — system activation ----
    boot: () => {
        playTone(200, 0.2, 'sine', 0.06);
        playTone(400, 0.2, 'sine', 0.08, 0.15);
        playTone(600, 0.3, 'sine', 0.10, 0.3);
        playTone(800, 0.4, 'sine', 0.08, 0.45);
        playNoise(0.1, 0.04, 0.5);
    }
};
