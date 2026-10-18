/**
 * Web Audio API Synthesized Sound Engine
 * Zero-dependency, ultra-low latency, tactile sound design.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Satisfying, uplifting harmonic arpeggio when completing a task
 * (C5 -> E5 -> G5 -> C6 with smooth exponential decay)
 */
export function playTaskCompleteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.35, gain: 0.12 }, // C5
      { freq: 659.25, time: 0.06, dur: 0.35, gain: 0.12 }, // E5
      { freq: 783.99, time: 0.12, dur: 0.40, gain: 0.14 }, // G5
      { freq: 1046.50, time: 0.18, dur: 0.55, gain: 0.15 }, // C6
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(noteGain, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch {
    // Graceful fallback if audio is not permitted
  }
}

/**
 * Tactile mechanical/wood micro-click for subtask toggling
 */
export function playSubtaskCheckSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Graceful fallback
  }
}

/**
 * Subtle downward sweep for task deletion
 */
export function playDeleteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Graceful fallback
  }
}

/**
 * Celebratory triumphant fanfare for streaks and major achievements
 */
export function playStreakCelebrationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [
      { freq: 440.00, time: 0.00, dur: 0.2, gain: 0.10 }, // A4
      { freq: 554.37, time: 0.08, dur: 0.25, gain: 0.11 }, // C#5
      { freq: 659.25, time: 0.16, dur: 0.3, gain: 0.13 }, // E5
      { freq: 880.00, time: 0.24, dur: 0.6, gain: 0.16 }, // A5
      { freq: 1108.73, time: 0.32, dur: 0.8, gain: 0.14 }, // C#6
    ];

    chords.forEach(({ freq, time, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(noteGain, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Gentle glassy ping for opening popups or modals
 */
export function playModalOpenSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.07);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Graceful fallback
  }
}

/**
 * Light tactile tap for micro-interactions
 */
export function playButtonTapSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Graceful fallback
  }
}

// Backwards-compatible aliases
export const playCompletionChime = playTaskCompleteSound;
export const playSubtaskTick = playSubtaskCheckSound;
