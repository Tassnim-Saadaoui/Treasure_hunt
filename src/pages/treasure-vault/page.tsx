import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { CHALLENGES } from '../../data/challenges';
import { areAllChallengesCompleted } from '../../domain/hunt/progress';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ChallengeId, ExplorerProfile } from '../../domain/hunt/types';
import { TreasureChestIllustration } from '../../components/artwork/ChallengeArtwork';

interface TreasureVaultViewProps {
  profile: ExplorerProfile | null;
  completedIds: ChallengeId[];
  hintsUsedByChallenge: Record<number, number>;
  startedAt: number | null;
  completedAt: number | null;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
  onReset: () => void;
}

export function TreasureVaultView({
  profile,
  completedIds,
  hintsUsedByChallenge,
  startedAt,
  completedAt,
  onNavigate,
  onReset,
}: TreasureVaultViewProps) {
  const isUnlocked = areAllChallengesCompleted(completedIds);
  const totalHints = Object.values(hintsUsedByChallenge).reduce((sum, count) => sum + count, 0);

  const durationMinutes =
    startedAt && completedAt
      ? Math.max(1, Math.round((completedAt - startedAt) / 60000))
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => onNavigate('/map')}
        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#0A1B42] px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:border-white/30 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Trail</span>
      </button>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A1B42] p-6 sm:p-10 text-center shadow-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#F5C542]/15 blur-3xl"
        />

        <div className="relative z-10 flex flex-col items-center">
          <TreasureChestIllustration className="h-32 w-36 sm:h-36 sm:w-40" />

          <p className="mt-2 text-xs font-semibold text-[#F5C542]">
            {isUnlocked ? 'Expedition Complete' : 'Vault Seal Locked'}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-4xl font-extrabold text-white">
            {isUnlocked ? 'The NATEG Treasure Is Yours!' : 'Unlock All 6 Challenges'}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-slate-300 leading-relaxed">
            {isUnlocked
              ? `Congratulations${profile ? `, ${profile.explorerName} (${profile.teamName})` : ''}! Your team debugged the incident, decoded the CI log, shipped the deployment, and passed the production review.`
              : `You have solved ${completedIds.length} of ${CHALLENGES.length} challenges so far. Complete the remaining challenges along the trail to claim the treasure.`}
          </p>

          {/* Summary Metrics */}
          <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-4 border-y border-white/10 py-5">
            <div>
              <p className="text-xs text-slate-400">Solved</p>
              <p className="mt-1 font-mono text-xl font-bold text-[#F5C542] tabular-nums">
                {completedIds.length}/{CHALLENGES.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Hints Used</p>
              <p className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
                {totalHints}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Duration</p>
              <p className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
                {durationMinutes ? `${durationMinutes} min` : 'In Progress'}
              </p>
            </div>
          </div>

          {/* Clue Token Ledger */}
          <div className="mt-6 w-full max-w-lg">
            <p className="text-xs font-medium text-slate-400">Expedition Clue Tokens</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {CHALLENGES.map((c) => {
                const earned = completedIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border py-2.5 px-2 ${
                      earned
                        ? 'border-[#F5C542]/50 bg-[#051029] text-[#F5C542]'
                        : 'border-white/10 bg-[#051029]/40 text-slate-500'
                    }`}
                  >
                    <span className="block text-[10px]">C{c.id}</span>
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {earned ? c.clueToken : '••'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isUnlocked ? (
              <button
                type="button"
                onClick={() => soundEngine.play('treasureFanfare')}
                className="flex min-h-[48px] items-center gap-2 rounded-xl bg-[#F5C542] px-6 py-3 text-sm font-bold text-[#051029] hover:bg-[#FDE047]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Replay Victory Fanfare</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const next = ([1, 2, 3, 4, 5, 6] as ChallengeId[]).find(
                    (id) => !completedIds.includes(id)
                  ) ?? 1;
                  onNavigate(`/challenges/${next}`);
                }}
                className="flex min-h-[48px] items-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-bold text-white hover:bg-[#E11D3F]"
              >
                <span>Resume Hunt</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onReset();
                onNavigate('/map');
              }}
              className="flex min-h-[48px] items-center gap-2 rounded-xl border border-white/15 bg-[#051029] px-5 py-3 text-sm font-semibold text-slate-200 hover:border-white/35 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
