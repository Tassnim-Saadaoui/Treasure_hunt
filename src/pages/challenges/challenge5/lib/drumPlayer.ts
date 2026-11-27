/**
 * drumPlayer.ts
 *
 * Synthesises three realistic-sounding drum hits entirely with Web Audio API
 * (no samples, no external files) and plays a sequence of them at a given BPM.
 *
 * SOUND DESIGN
 * ─────────────
 * Kick  (P) : pitched sine sweep 150 → 40 Hz (0.35 s) + very short noise transient.
 *             Models the low-frequency "thud" of a bass drum.
 * Snare (C) : bandpass-filtered white noise (centre 250 Hz) + sharp high tone (180 Hz).
 *             Models the crack + body of a snare drum.
 * Cymbal (S): highpass-filtered white noise (> 5 kHz) with medium-long decay (0.4 s).
 *             Models the airy metallic wash of an open hi-hat / crash.
 *
 * TIMING
 * ──────
 * All scheduling uses AudioContext.currentTime offsets — sample-accurate and
 * immune to JS timer drift.  Visual callbacks use window.setTimeout aligned to
 * the same offsets so the highlight stays in sync on mobile.
 *
 * USAGE
 * ──────
 * const cancel = playDrumSequence(ctx, hits, bpm, onNote, onEnd);
 * // call cancel() to abort early (e.g. component unmount)
 */

export type DrumHit = 'P' | 'C' | 'S';

// ─── White noise buffer (1 s, cached) ────────────────────────────────────────

let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const len = ctx.sampleRate; // 1 second
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

// ─── Individual hit synthesisers ─────────────────────────────────────────────

function playKick(ctx: AudioContext, when: number): void {
  // Pitched sweep: 150 → 40 Hz
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, when);
  osc.frequency.exponentialRampToValueAtTime(40, when + 0.35);
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.9, when + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.38);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + 0.40);

  // Transient click (very short noise burst)
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const noiseGain = ctx.createGain();
  const hpf = ctx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 1200;
  noiseGain.gain.setValueAtTime(0.25, when);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.025);
  noise.connect(hpf);
  hpf.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(when);
  noise.stop(when + 0.03);
}

function playSnare(ctx: AudioContext, when: number): void {
  // Body: bandpass noise
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const bpf = ctx.createBiquadFilter();
  bpf.type = 'bandpass';
  bpf.frequency.value = 250;
  bpf.Q.value = 0.7;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.6, when);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.18);
  noise.connect(bpf);
  bpf.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(when);
  noise.stop(when + 0.20);

  // Crack: short pitched tone
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, when);
  osc.frequency.exponentialRampToValueAtTime(100, when + 0.05);
  oscGain.gain.setValueAtTime(0.3, when);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + 0.07);
}

function playCymbal(ctx: AudioContext, when: number): void {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const hpf = ctx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 5000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.42);
  noise.connect(hpf);
  hpf.connect(gain);
  gain.connect(ctx.destination);
  noise.start(when);
  noise.stop(when + 0.45);
}

// ─── Sequence scheduler ───────────────────────────────────────────────────────

/**
 * @param ctx     AudioContext (already resumed by caller on user gesture)
 * @param hits    Array of drum hits to play
 * @param bpm     Tempo in beats per minute (16th-note grid)
 * @param onNote  Called with the note index just before it plays (visual sync)
 * @param onEnd   Called when the last note has finished
 * @returns cancel function — clears all pending visual timers
 */
export function playDrumSequence(
  ctx: AudioContext,
  hits: DrumHit[],
  bpm: number,
  onNote: (index: number) => void,
  onEnd: () => void,
): () => void {
  const stepMs = (60 / bpm / 4) * 1000; // duration of one 16th note in ms
  const stepSec = stepMs / 1000;
  const startTime = ctx.currentTime + 0.05; // small lookahead

  const timers: ReturnType<typeof window.setTimeout>[] = [];

  hits.forEach((hit, i) => {
    const when = startTime + i * stepSec;
    const delayMs = (when - ctx.currentTime) * 1000;

    // Schedule audio (sample-accurate)
    switch (hit) {
      case 'P': playKick(ctx, when);   break;
      case 'C': playSnare(ctx, when);  break;
      case 'S': playCymbal(ctx, when); break;
    }

    // Schedule visual highlight (setTimeout aligned to same offset)
    timers.push(
      window.setTimeout(() => onNote(i), Math.max(0, delayMs - 20))
    );
  });

  // "Done" callback — fires after the last note has had time to decay
  const totalMs = hits.length * stepMs + 500;
  timers.push(
    window.setTimeout(onEnd, (startTime - ctx.currentTime) * 1000 + totalMs)
  );

  return () => timers.forEach(window.clearTimeout);
}

// ─── AudioContext factory (browser-compat) ───────────────────────────────────

export function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  return ctx;
}
