/**
 * drumPlayer.ts — mobile-safe Web Audio drum synthesiser
 *
 * iOS/Android unlock strategy
 * ───────────────────────────
 * Mobile browsers require that BOTH of these happen synchronously inside
 * the same user-gesture call stack (the button onClick):
 *   1. new AudioContext()  — or ctx.resume() on an existing suspended one
 *   2. At least one AudioNode.start() call
 *
 * If either happens inside a Promise/await the browser treats it as
 * "not user-initiated" and keeps the context suspended forever.
 *
 * Solution:
 *   • unlockAudioContext(ctx) — call this SYNCHRONOUSLY in the onClick.
 *     It resumes the ctx AND immediately starts a silent 1-frame oscillator.
 *     This satisfies both requirements on every browser.
 *   • playDrumSequence() then uses a fixed lookahead (200 ms) so notes
 *     always land in the future even if resume() takes ~150 ms on iOS.
 *   • Visual setTimeout offsets are aligned to the same absolute times.
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
 * MUST be called synchronously inside the onClick handler.
 * Resumes the context AND fires a silent node — this is the iOS unlock trick.
 */
export function unlockAudioContext(ctx: AudioContext): void {
  // Resume (no-op if already running)
  void ctx.resume();

  // Play a silent oscillator for 1 ms — this is what actually unlocks iOS
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime); // silent
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.001);
}

// ─── Noise buffer ─────────────────────────────────────────────────────────────

let _noiseBuf: AudioBuffer | null = null;
let _noiseSR  = 0;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (_noiseBuf && _noiseSR === ctx.sampleRate) return _noiseBuf;
  const len  = ctx.sampleRate * 2; // 2 s
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  _noiseBuf = buf;
  _noiseSR  = ctx.sampleRate;
  return buf;
}

function makeNoise(ctx: AudioContext): AudioBufferSourceNode {
  const src  = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  src.loop   = false;
  return src;
}

// ─── Drum synthesisers ────────────────────────────────────────────────────────

function playKick(ctx: AudioContext, when: number): void {
  // Sine sweep 160 → 45 Hz
  const osc     = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, when);
  osc.frequency.exponentialRampToValueAtTime(45, when + 0.4);
  oscGain.gain.setValueAtTime(0.001, when);
  oscGain.gain.linearRampToValueAtTime(1.8, when + 0.005);
  oscGain.gain.exponentialRampToValueAtTime(0.001, when + 0.42);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + 0.44);

  // Click transient
  const noise     = makeNoise(ctx);
  const hpf       = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  hpf.type            = 'highpass';
  hpf.frequency.value = 1800;
  noiseGain.gain.setValueAtTime(0.6, when);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, when + 0.03);
  noise.connect(hpf);
  hpf.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(when);
  noise.stop(when + 0.04);
}

function playSnare(ctx: AudioContext, when: number): void {
  // Noise body
  const noise     = makeNoise(ctx);
  const bpf       = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  bpf.type            = 'bandpass';
  bpf.frequency.value = 300;
  bpf.Q.value         = 0.6;
  noiseGain.gain.setValueAtTime(1.2, when);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, when + 0.2);
  noise.connect(bpf);
  bpf.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(when);
  noise.stop(when + 0.22);

  // Pitched crack
  const osc     = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, when);
  osc.frequency.exponentialRampToValueAtTime(110, when + 0.06);
  oscGain.gain.setValueAtTime(0.6, when);
  oscGain.gain.exponentialRampToValueAtTime(0.001, when + 0.07);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + 0.08);
}

function playCymbal(ctx: AudioContext, when: number): void {
  const noise = makeNoise(ctx);
  const hpf1  = ctx.createBiquadFilter();
  const hpf2  = ctx.createBiquadFilter();
  const gain  = ctx.createGain();
  hpf1.type = 'highpass'; hpf1.frequency.value = 6000;
  hpf2.type = 'highpass'; hpf2.frequency.value = 8000;
  gain.gain.setValueAtTime(0.8, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.45);
  noise.connect(hpf1);
  hpf1.connect(hpf2);
  hpf2.connect(gain);
  gain.connect(ctx.destination);
  noise.start(when);
  noise.stop(when + 0.5);
}

// ─── Sequence scheduler ───────────────────────────────────────────────────────

/**
 * Schedule all drum hits and their visual callbacks.
 *
 * Call unlockAudioContext(ctx) BEFORE this, synchronously in onClick.
 * This function itself is synchronous — no await — so notes are always
 * scheduled before any Promise microtask runs.
 */
export function playDrumSequence(
  ctx: AudioContext,
  hits: DrumHit[],
  bpm: number,
  onNote: (index: number) => void,
  onEnd: () => void,
): () => void {
  const stepSec    = 60 / bpm / 4;
  const stepMs     = stepSec * 1000;
  // 200 ms lookahead — covers iOS resume latency (~80–150 ms) with margin
  const startTime  = ctx.currentTime + 0.20;
  const timers: number[] = [];
  let   cancelled  = false;

  hits.forEach((hit, i) => {
    const when    = startTime + i * stepSec;
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000 - 15);

    // Audio (synchronous, sample-accurate)
    switch (hit) {
      case 'P': playKick(ctx, when);   break;
      case 'C': playSnare(ctx, when);  break;
      case 'S': playCymbal(ctx, when); break;
    }

    // Visual (setTimeout aligned to audio time)
    timers.push(
      window.setTimeout(() => { if (!cancelled) onNote(i); }, delayMs)
    );
  });

  // End callback
  const endMs = Math.max(0, (startTime - ctx.currentTime) * 1000 + hits.length * stepMs + 400);
  timers.push(
    window.setTimeout(() => { if (!cancelled) onEnd(); }, endMs)
  );

  return () => {
    cancelled = true;
    timers.forEach(window.clearTimeout);
  };
}
