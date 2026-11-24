import { ArrowRight, CheckCircle2, Circle, Volume2, VolumeX } from 'lucide-react';
import { CHALLENGES } from '../../data/challenges';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ChallengeId, ExplorerProfile } from '../../domain/hunt/types';

interface ExpeditionSidePanelProps {
  profile: ExplorerProfile | null;
  completedIds: ChallengeId[];
  nextRecommendedId: ChallengeId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectChallenge: (id: ChallengeId) => void;
  onNavigate: (path: string) => void;
}

export function ExpeditionSidePanel({
  profile,
  completedIds,
  nextRecommendedId,
  soundEnabled,
  onToggleSound,
  onSelectChallenge,
  onNavigate,
}: ExpeditionSidePanelProps) {
  const solvedCount = completedIds.length;
  const progressPercent = Math.round((solvedCount / CHALLENGES.length) * 100);

  return (
    <aside className="flex flex-col gap-6" aria-label="Expedition Overview">
      {/* Sound & Team Status Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0A1B42] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-400">
              {profile ? `Team ${profile.teamName}` : 'Expedition Briefing'}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-[#F5C542]">
              {profile ? profile.explorerName : 'Ready to Explore'}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {profile
                ? `${profile.specialty} Lead · ${solvedCount} of ${CHALLENGES.length} solved`
                : 'ISSATSo Campus Challenge · 6 Interactive Stages'}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#051029] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#F5C542]/60 hover:text-[#F5C542] whitespace-nowrap shrink-0"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-[#F5C542]" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-slate-400" />
                <span>Muted</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Track */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">Expedition Progress</span>
            <span className="font-mono font-semibold text-[#F5C542] tabular-nums">
              {solvedCount}/{CHALLENGES.length} · {progressPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#051029]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C8102E] via-[#E11D3F] to-[#F5C542] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Collected Clue Tokens */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs font-medium text-slate-400">Collected Clue Tokens</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm tabular-nums">
            {CHALLENGES.map((c, idx) => {
              const unlocked = completedIds.includes(c.id);
              return (
                <span key={c.id} className="inline-flex items-center gap-2">
                  <span className={unlocked ? 'font-bold text-[#F5C542]' : 'text-slate-500'}>
                    {unlocked ? c.clueToken : '••'}
                  </span>
                  {idx < CHALLENGES.length - 1 && (
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {!profile && (
            <button
              type="button"
              onClick={() => onNavigate('/join')}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#E11D3F] whitespace-nowrap"
            >
              <span>Register Team</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              soundEngine.play('stepUnlock');
              onSelectChallenge(nextRecommendedId);
            }}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#F5C542]/40 bg-[#051029] px-4 py-2.5 text-xs font-semibold text-[#F5C542] hover:bg-[#0D2152] whitespace-nowrap"
          >
            <span>Open Challenge {nextRecommendedId}</span>
          </button>
        </div>
      </div>

      {/* Challenge Directory */}
      <div className="rounded-3xl border border-white/10 bg-[#0A1B42] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Challenge Stages</h3>
          <span className="text-xs text-slate-400">Select any stage</span>
        </div>

        <ul className="mt-4 divide-y divide-white/10">
          {CHALLENGES.map((challenge) => {
            const isDone = completedIds.includes(challenge.id);
            const isCurrent = challenge.id === nextRecommendedId;
            return (
              <li key={challenge.id}>
                <button
                  type="button"
                  onMouseEnter={() => soundEngine.play('hoverTick')}
                  onClick={() => onSelectChallenge(challenge.id)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:text-[#F5C542]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#F5C542]" />
                    ) : (
                      <Circle
                        className={`h-5 w-5 shrink-0 ${
                          isCurrent ? 'text-[#E11D3F]' : 'text-slate-500'
                        }`}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {challenge.id}. {challenge.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {challenge.difficulty} · ~{challenge.estimatedMinutes} min
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-300 tabular-nums">
                    {isDone ? challenge.clueToken : isCurrent ? 'Next' : 'Open'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
