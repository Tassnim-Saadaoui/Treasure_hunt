import type { SoundEffectName } from '../../domain/hunt/types';

class TreasureSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || !this.enabled) {
      return null;
    }

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        return null;
      }
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainPeak = 0.08,
    delay = 0,
    endFreq?: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public play(effect: SoundEffectName): void {
    if (!this.enabled) return;

    switch (effect) {
      case 'click':
        this.playTone(540, 0.07, 'triangle', 0.055, 0, 320);
        break;

      case 'hoverTick':
        this.playTone(820, 0.035, 'sine', 0.025, 0, 720);
        break;

      case 'compassTick':
        this.playTone(960, 0.045, 'triangle', 0.045, 0, 620);
        break;

      case 'gearClick':
        this.playTone(260, 0.06, 'square', 0.03, 0, 170);
        this.playTone(520, 0.04, 'triangle', 0.03, 0.015, 380);
        break;

      case 'hint':
        this.playTone(784, 0.14, 'sine', 0.055, 0);
        this.playTone(1174.66, 0.22, 'sine', 0.05, 0.09);
        break;

      case 'stepUnlock':
        this.playTone(440, 0.14, 'triangle', 0.06, 0);
        this.playTone(554.37, 0.14, 'triangle', 0.06, 0.08);
        this.playTone(659.25, 0.24, 'sine', 0.07, 0.16);
        break;

      case 'correct':
        this.playTone(523.25, 0.14, 'triangle', 0.07, 0);
        this.playTone(659.25, 0.14, 'triangle', 0.07, 0.08);
        this.playTone(783.99, 0.16, 'sine', 0.075, 0.16);
        this.playTone(1046.5, 0.35, 'sine', 0.085, 0.24);
        break;

      case 'error':
        this.playTone(210, 0.14, 'sawtooth', 0.035, 0, 165);
        this.playTone(165, 0.18, 'triangle', 0.045, 0.11, 130);
        break;

      case 'keyTurn':
        this.playTone(340, 0.08, 'square', 0.035, 0, 240);
        this.playTone(680, 0.12, 'triangle', 0.055, 0.08, 880);
        this.playTone(1320, 0.25, 'sine', 0.06, 0.18);
        break;

      case 'treasureFanfare': {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          this.playTone(freq, 0.32, idx % 2 === 0 ? 'triangle' : 'sine', 0.075, idx * 0.085);
        });
        this.playTone(2093, 0.55, 'sine', 0.055, 0.54);
        break;
      }
    }
  }
}

export const soundEngine = new TreasureSoundEngine();
