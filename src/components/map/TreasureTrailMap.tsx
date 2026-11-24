import { Check, Sparkles } from 'lucide-react';
import { CHALLENGES } from '../../data/challenges';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ChallengeId } from '../../domain/hunt/types';
import { ChallengeIcon, TreasureChestIllustration } from '../artwork/ChallengeArtwork';

interface TreasureTrailMapProps {
  completedIds: ChallengeId[];
  nextRecommendedId: ChallengeId;
  hasProfile: boolean;
  isAllCompleted: boolean;
  onSelectChallenge: (id: ChallengeId) => void;
  onPrimaryCta: () => void;
}

const NODE_COORDINATES: Record<ChallengeId, { x: number; y: number }> = {
  1: { x: 42, y: 10 },
  2: { x: 64, y: 24 },
  3: { x: 40, y: 39 },
  4: { x: 64, y: 54 },
  5: { x: 40, y: 69 },
  6: { x: 64, y: 84 },
};

export function TreasureTrailMap({
  completedIds,
  nextRecommendedId,
  hasProfile,
  isAllCompleted,
  onSelectChallenge,
  onPrimaryCta,
}: TreasureTrailMapProps) {
  const ctaLabel = isAllCompleted
    ? 'OPEN TREASURE VAULT'
    : hasProfile
      ? `CONTINUE CHALLENGE ${nextRecommendedId}`
      : 'JOIN THE ADVENTURE';

  return (
    <section
      aria-label="NATEG Treasure Hunt Winding Trail"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#061433] shadow-2xl"
    >
      {/* Top crimson curve & midnight gradient matching the event visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full bg-radial from-[#C8102E]/75 via-[#C8102E]/25 to-transparent blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-radial from-[#C8102E]/65 via-[#C8102E]/20 to-transparent blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-radial from-[#C8102E]/50 via-transparent to-transparent blur-2xl"
      />

      {/* Hero Header inside the map */}
      <div className="relative z-10 border-b border-white/10 bg-gradient-to-b from-[#17091F]/70 via-[#0C173B]/50 to-transparent px-5 pt-8 pb-7 text-center sm:px-8">
        <p className="font-display text-lg sm:text-xl font-bold tracking-[0.18em] text-[#F5C542]">
          NATEG
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#F5C542] drop-shadow-[0_2px_10px_rgba(245,197,66,0.25)]">
          TREASURE HUNT
        </h1>
        <p className="mt-3 text-sm sm:text-base font-bold tracking-wide text-white uppercase">
          THE GREAT CHALLENGE STARTS HERE!
        </p>
        <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-slate-200/90">
          Find the clues, solve the puzzles, and reach the final treasure!
        </p>
      </div>

      {/* Winding S-Curve Map Area */}
      <div className="relative z-10 px-4 pt-6 pb-8 sm:px-8">
        {/* Subtle decorative four-point stars in background */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 110"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <filter id="goldTrailGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Winding dotted golden path from Node 1 -> 6 -> Chest */}
          <path
            d="M 42 11
               C 58 14, 72 18, 64 25
               C 56 32, 32 33, 40 40
               C 48 47, 72 48, 64 55
               C 56 62, 32 63, 40 70
               C 48 77, 72 78, 64 85
               C 56 91, 44 92, 34 95"
            fill="none"
            stroke="#F5C542"
            strokeOpacity="0.32"
            strokeWidth="1.6"
            strokeDasharray="1.8 2.1"
            strokeLinecap="round"
            filter="url(#goldTrailGlow)"
          />
          <path
            d="M 42 11
               C 58 14, 72 18, 64 25
               C 56 32, 32 33, 40 40
               C 48 47, 72 48, 64 55
               C 56 62, 32 63, 40 70
               C 48 77, 72 78, 64 85
               C 56 91, 44 92, 34 95"
            fill="none"
            stroke="#FDE047"
            strokeWidth="0.9"
            strokeDasharray="1.8 2.1"
            strokeLinecap="round"
          />
        </svg>

        {/* Challenge Steps 1 - 6 */}
        <ol className="relative z-10 space-y-5 sm:space-y-6">
          {CHALLENGES.map((challenge) => {
            const isCompleted = completedIds.includes(challenge.id);
            const isNext = challenge.id === nextRecommendedId && !isAllCompleted;
            const isLeft = challenge.side === 'left';

            return (
              <li
                key={challenge.id}
                className={`flex items-center gap-3 sm:gap-5 ${
                  isLeft ? 'justify-start pl-1 sm:pl-6' : 'justify-end pr-1 sm:pr-6'
                }`}
              >
                <button
                  type="button"
                  onMouseEnter={() => soundEngine.play('hoverTick')}
                  onClick={() => onSelectChallenge(challenge.id)}
                  aria-label={`${challenge.numberLabel}: ${challenge.title}${isCompleted ? ' (Completed)' : ''}`}
                  className={`group flex items-center gap-3 sm:gap-4 rounded-2xl p-2.5 text-left transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C542] ${
                    isLeft ? 'flex-row' : 'flex-row-reverse text-right'
                  }`}
                >
                  {/* Custom Artwork & Label */}
                  <div className="flex flex-col items-center text-center min-w-[128px] sm:min-w-[152px]">
                    <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center transition-transform duration-150 group-hover:-translate-y-0.5">
                      <ChallengeIcon id={challenge.id} className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-md" />
                    </div>
                    <span className="mt-1 text-xs sm:text-sm font-semibold text-white">
                      {challenge.numberLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-tight text-[#F5C542] max-w-[155px]">
                      {challenge.title}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-300/80">
                      {isCompleted ? `Solved · Clue ${challenge.clueToken}` : isNext ? 'Current Step' : challenge.discipline}
                    </span>
                  </div>

                  {/* Numbered Crimson/Gold Node */}
                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-bold tabular-nums transition-all duration-150 ${
                      isCompleted
                        ? 'border-[#F5C542] bg-[#166534] text-white shadow-[0_0_18px_rgba(245,197,66,0.45)]'
                        : isNext
                          ? 'border-[#F5C542] bg-[#C8102E] text-white shadow-[0_0_20px_rgba(200,16,46,0.65)] scale-105'
                          : 'border-[#E11D3F] bg-[#0B1D47] text-white group-hover:border-[#F5C542] group-hover:bg-[#C8102E]/90'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-[#F5C542]" strokeWidth={3} />
                    ) : (
                      <span className="text-base">{challenge.id}</span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Bottom Treasure Chest & Main CTA */}
        <div className="relative z-10 mt-6 flex flex-col items-center pt-2">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute h-28 w-28 rounded-full bg-[#F5C542]/20 blur-2xl"
            />
            <TreasureChestIllustration className="relative h-28 w-32 sm:h-32 sm:w-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" />
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.play(isAllCompleted ? 'treasureFanfare' : 'stepUnlock');
              onPrimaryCta();
            }}
            className="mt-1 flex min-h-[48px] w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#C8102E] px-8 py-3.5 text-sm sm:text-base font-bold tracking-wider text-white shadow-[0_10px_28px_rgba(200,16,46,0.45)] transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C542] whitespace-nowrap"
          >
            {isAllCompleted && <Sparkles className="h-4 w-4 shrink-0" />}
            <span>{ctaLabel}</span>
          </button>
        </div>
      </div>

      {/* Node coordinates map kept strictly for reference alignment */}
      <span className="sr-only" data-nodes={Object.keys(NODE_COORDINATES).length} />
    </section>
  );
}
