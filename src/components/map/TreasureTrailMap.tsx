import { Check, Lock, Sparkles } from 'lucide-react';
import { CHALLENGES } from '../../data/challenges';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ChallengeId } from '../../domain/hunt/types';
import { ChallengeIcon, TreasureChestIllustration } from '../artwork/ChallengeArtwork';

interface TreasureTrailMapProps {
  completedIds: ChallengeId[];
  nextRecommendedId: ChallengeId;
  maxUnlockedId: ChallengeId;
  isAllCompleted: boolean;
  onSelectChallenge: (id: ChallengeId) => void;
  onPrimaryCta: () => void;
}

export function TreasureTrailMap({
  completedIds,
  nextRecommendedId,
  maxUnlockedId,
  isAllCompleted,
  onSelectChallenge,
  onPrimaryCta,
}: TreasureTrailMapProps) {
  return (
    <section
      aria-label="NATEG Treasure Hunt"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#061433] shadow-2xl"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#C8102E]/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C8102E]/25 blur-3xl" />

      <div className="relative z-10 border-b border-white/10 bg-gradient-to-b from-[#17091F]/75 to-transparent px-5 pb-9 pt-10 text-center sm:px-8">
        <p className="font-display text-base font-bold tracking-[0.26em] text-[#F5C542]">NATEG</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold tracking-wide text-[#F5C542] sm:text-5xl">
          TREASURE HUNT
        </h1>
        <p className="mt-4 text-sm font-bold tracking-wide text-white">THE GREAT CHALLENGE STARTS HERE!</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
          Six steps. One treasure.
        </p>
      </div>

      <div className="relative px-4 pb-8 pt-7 sm:px-8">
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <path
            d="M 42 6 C 72 13, 70 20, 58 26 C 28 34, 30 42, 43 48 C 72 55, 71 63, 58 69 C 30 77, 34 86, 49 96"
            fill="none"
            stroke="#FDE047"
            strokeWidth="1.1"
            strokeDasharray="2 2.3"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>

        <ol className="relative z-10 space-y-8 sm:space-y-10">
          {CHALLENGES.map((challenge) => {
            const isCompleted = completedIds.includes(challenge.id);
            const isUnlocked = challenge.id <= maxUnlockedId || isCompleted;
            const isNext = challenge.id === nextRecommendedId && !isAllCompleted;
            const isLeft = challenge.side === 'left';

            return (
              <li key={challenge.id} className={isLeft ? 'flex justify-start' : 'flex justify-end'}>
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (!isUnlocked) return;
                    soundEngine.play('click');
                    onSelectChallenge(challenge.id);
                  }}
                  aria-label={`Challenge ${challenge.id}${isCompleted ? ', completed' : isUnlocked ? ', ready' : ', locked'}`}
                  className={`flex max-w-[280px] items-center gap-4 rounded-2xl p-3 text-left transition-transform ${
                    isUnlocked ? 'hover:scale-[1.02] active:scale-[0.98]' : 'cursor-not-allowed opacity-55'
                  } ${isLeft ? 'flex-row' : 'flex-row-reverse text-right'}`}
                >
                  <div className="flex min-w-[150px] flex-col items-center text-center">
                    <ChallengeIcon id={challenge.id} className={`h-20 w-20 ${isUnlocked ? '' : 'grayscale'}`} />
                    <span className="mt-2 text-sm font-semibold text-white">Challenge {challenge.id}</span>
                    <span className="mt-1 text-xs font-medium text-[#F5C542]">
                      {isCompleted ? 'Completed' : isNext ? 'Ready' : isUnlocked ? 'Open' : 'Locked'}
                    </span>
                  </div>
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold ${
                      isCompleted
                        ? 'border-[#4ADE80] bg-[#16A34A] text-white'
                        : isNext
                          ? 'border-[#F5C542] bg-[#C8102E] text-white shadow-[0_0_20px_rgba(200,16,46,0.65)]'
                          : 'border-white/25 bg-[#0B1D47] text-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="h-6 w-6" strokeWidth={3} /> : isUnlocked ? challenge.id : <Lock className="h-5 w-5" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative z-10 mt-5 flex flex-col items-center">
          <TreasureChestIllustration className="h-32 w-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" />
          <button
            type="button"
            disabled={isAllCompleted}
            onClick={() => {
              soundEngine.play('stepUnlock');
              onPrimaryCta();
            }}
            className="mt-2 flex min-h-[58px] w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#C8102E] px-8 py-4 text-base font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(200,16,46,0.45)] transition-transform hover:bg-[#E11D3F] active:scale-[0.98] disabled:cursor-default disabled:bg-emerald-700 disabled:shadow-none"
          >
            {isAllCompleted && <Sparkles className="h-4 w-4" />}
            {isAllCompleted ? 'HUNT COMPLETE' : `START CHALLENGE ${nextRecommendedId}`}
          </button>
        </div>
      </div>
    </section>
  );
}
