import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import { CHALLENGES } from '../../data/challenges';
import { soundEngine } from '../../lib/audio/soundEngine';

interface RulesViewProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
}

export function RulesView({ soundEnabled, onToggleSound, onNavigate }: RulesViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() => onNavigate('/map')}
        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#0A1B42] px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:border-white/30 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Trail</span>
      </button>

      <section className="rounded-3xl border border-white/10 bg-[#0A1B42] p-6 sm:p-8 shadow-2xl space-y-8">
        <div className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold text-[#F5C542]">NATEG ISSATSo Student Chapter</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
            Expedition Rules & Guide
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 leading-relaxed">
            Six software-themed challenges ramp from a quick warm-up to a production-readiness final. Debug the incident, decode the CI log, optimize the deployment, and collect clue tokens for the vault.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <h2 className="font-display text-base font-bold text-[#F5C542]">01. Follow the Trail</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Follow the trail in order for a gradual difficulty ramp: warm-up, fundamentals, debugging, encoding, optimization, then the final systems challenge.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-base font-bold text-[#F5C542]">02. Collect Clue Tokens</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every solved challenge grants a clue token. The final vault asks you to trace a request through the stack and read the matching digits in order.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-base font-bold text-[#F5C542]">03. Interactive Audio</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Synthesized Web Audio adds feedback to routing, gear math, decoding, deployments, and the vault. Mute or test audio anytime.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#051029]/80 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-[#F5C542]" />
            <div>
              <p className="text-sm font-semibold text-white">
                Sound Effects: {soundEnabled ? 'Active' : 'Muted'}
              </p>
              <p className="text-xs text-slate-400">
                Uses Web Audio synthesis with zero external audio downloads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!soundEnabled) {
                  onToggleSound();
                } else {
                  soundEngine.play('treasureFanfare');
                }
              }}
              className="min-h-[44px] rounded-xl border border-[#F5C542]/40 bg-[#0A1B42] px-4 py-2 text-xs font-semibold text-[#F5C542] hover:bg-[#10295E]"
            >
              Play Test Chime
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              className="min-h-[44px] rounded-xl border border-white/15 bg-[#0A1B42] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-white/35"
            >
              {soundEnabled ? 'Mute' : 'Unmute'}
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h2 className="text-sm font-bold text-white">All Six Stages</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {CHALLENGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(`/challenges/${item.id}`)}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#051029]/60 p-4 text-left transition-colors hover:border-[#F5C542]/40"
              >
                <div>
                  <p className="text-xs font-semibold text-[#F5C542]">
                    {item.numberLabel} · {item.difficulty} · {item.discipline}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.shortPrompt}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
