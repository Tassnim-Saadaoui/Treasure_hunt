/**
 * drumPlayer.ts — oscillator-only drum synthesiser (iOS-safe)
 *
 * Root cause of silence on iOS
 * ─────────────────────────────
 * AudioBufferSourceNode (noise buffer) silently drops on iOS Safari when the
 * AudioContext was suspended at the moment .start() was called, even after
 * resume(). OscillatorNode does NOT have this problem — it works on every
 * browser including iOS Safari.
 *
 * All three drum sounds are therefore synthesised with oscillators only:
 *
 *   Kick  (P) : low sine sweep 150→40 Hz, fast attack, slow decay
 *   Snare (C) : mid triangle sweep 300→120 Hz + higher overtone 600→240 Hz
 *               layered — mimics the crack + body of a snare
 *   Cymbal(S) : high sawtooth 3200 Hz, very short decay — metallic tick
 *
 * This matches exactly what soundEngine.ts does (all oscillators) and is
 * why that engine works on mobile while our BufferSource approach did not.
 */

export type DrumHit = 'P' | 'C' | 'S';

// ─── Shared AudioContext singleton ───────────────────────────────────────────

let _ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (_ctx) return _ctx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  _ctx = new Ctor();
  return _ctx;
}

/**
 * Call this SYNCHRONOUSLY in the onClick handler.
 * Resumes the context AND fires a silent oscillator — the iOS unlock trick.
 * OscillatorNode.start() in the same gesture tick is what actually unlocks
 * audio hardware on iOS Safari.
 */
export function unlockAudioContext(ctx: AudioContext): void {
  void ctx.resume();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.001);
}

// ─── Oscillator helper ────────────────────────────────────────────────────────

function tone(
  ctx:      AudioContext,
  when:     number,
  freq:     number,
  endFreq:  number,
  dur:      number,
  type:     OscillatorType,
  peak:     number,
): void {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  if (endFreq !== freq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), when + dur);
  }
  gain.gain.setValueAtTime(0.001, when);
  gain.gain.linearRampToValueAtTime(peak, when + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur + 0.01);
}

// ─── Drum synthesisers (oscillators only) ────────────────────────────────────

function playKick(ctx: AudioContext, when: number): void {
  // Deep sine sweep — the classic 808-style kick
  tone(ctx, when, 150, 40, 0.42, 'sine', 1.6);
  // Sub-click for attack punch
  tone(ctx, when, 320, 80, 0.06, 'triangle', 0.6);
}

function playSnare(ctx: AudioContext, when: number): void {
  // Body: mid sweep
  tone(ctx, when, 280, 120, 0.18, 'triangle', 0.9);
  // Crack: upper harmonic
  tone(ctx, when, 580, 220, 0.10, 'sawtooth', 0.5);
  // Buzz overtone for snare wire character
  tone(ctx, when, 900, 400, 0.07, 'square',   0.25);
}

function playCymbal(ctx: AudioContext, when: number): void {
  // High metallic tick — sawtooth at high freq decays fast
  tone(ctx, when, 3400, 2800, 0.22, 'sawtooth', 0.35);
  // Shimmer layer
  tone(ctx, when, 5200, 4000, 0.14, 'sawtooth', 0.18);
}

// ─── Sequence scheduler ───────────────────────────────────────────────────────

/**
 * Schedules all drum hits synchronously (no await, no Promise).
 * Call unlockAudioContext(ctx) first, in the same onClick.
 * Uses 200 ms lookahead to cover iOS resume latency.
 */
export function playDrumSequence(
  ctx:    AudioContext,
  hits:   DrumHit[],
  bpm:    number,
  onNote: (index: number) => void,
  onEnd:  () => void,
): () => void {
  const stepSec   = 60 / bpm / 4;        // one 16th note
  const stepMs    = stepSec * 1000;
  const startTime = ctx.currentTime + 0.20; // 200 ms lookahead
  const timers: number[] = [];
  let   cancelled = false;

  hits.forEach((hit, i) => {
    const when    = startTime + i * stepSec;
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000 - 15);

    switch (hit) {
      case 'P': playKick(ctx, when);   break;
      case 'C': playSnare(ctx, when);  break;
      case 'S': playCymbal(ctx, when); break;
    }

    timers.push(
      window.setTimeout(() => { if (!cancelled) onNote(i); }, delayMs)
    );
  });

  const endMs = Math.max(0,
    (startTime - ctx.currentTime) * 1000 + hits.length * stepMs + 400
  );
  timers.push(
    window.setTimeout(() => { if (!cancelled) onEnd(); }, endMs)
  );

  return () => {
    cancelled = true;
    timers.forEach(window.clearTimeout);
  };
}
