import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Ship, Sparkles } from 'lucide-react';
import { CHALLENGES } from '../../data/challenges';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ChallengeId } from '../../domain/hunt/types';
import { ChallengeIcon, TreasureChestIllustration } from '../artwork/ChallengeArtwork';

interface TreasureTrailMapProps {
  completedIds: ChallengeId[];
  nextRecommendedId: ChallengeId;
  maxUnlockedId: ChallengeId;
  hasProfile: boolean;
  isAllCompleted: boolean;
  voyageTransition: VoyageTransition | null;
  onVoyageArrival: () => void;
  onSelectChallenge: (id: ChallengeId) => void;
  onPrimaryCta: () => void;
}

export interface VoyageTransition {
  fromId: ChallengeId;
  toId: ChallengeId | 'treasure';
}

interface Point {
  x: number;
  y: number;
}

interface TrailSegment {
  id: ChallengeId;
  d: string;
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

const TRAIL_SEGMENTS: TrailSegment[] = [
  { id: 1, d: 'M 42 11 C 58 14, 72 18, 64 25', p0: { x: 42, y: 11 }, p1: { x: 58, y: 14 }, p2: { x: 72, y: 18 }, p3: { x: 64, y: 25 } },
  { id: 2, d: 'M 64 25 C 56 32, 32 33, 40 40', p0: { x: 64, y: 25 }, p1: { x: 56, y: 32 }, p2: { x: 32, y: 33 }, p3: { x: 40, y: 40 } },
  { id: 3, d: 'M 40 40 C 48 47, 72 48, 64 55', p0: { x: 40, y: 40 }, p1: { x: 48, y: 47 }, p2: { x: 72, y: 48 }, p3: { x: 64, y: 55 } },
  { id: 4, d: 'M 64 55 C 56 62, 32 63, 40 70', p0: { x: 64, y: 55 }, p1: { x: 56, y: 62 }, p2: { x: 32, y: 63 }, p3: { x: 40, y: 70 } },
  { id: 5, d: 'M 40 70 C 48 77, 72 78, 64 85', p0: { x: 40, y: 70 }, p1: { x: 48, y: 77 }, p2: { x: 72, y: 78 }, p3: { x: 64, y: 85 } },
  { id: 6, d: 'M 64 85 C 56 91, 48 93, 34 95', p0: { x: 64, y: 85 }, p1: { x: 56, y: 91 }, p2: { x: 48, y: 93 }, p3: { x: 34, y: 95 } },
];

function evaluateCurve(t: number, segment: TrailSegment): Point {
  const u = 1 - t;
  return {
    x: u ** 3 * segment.p0.x + 3 * u ** 2 * t * segment.p1.x + 3 * u * t ** 2 * segment.p2.x + t ** 3 * segment.p3.x,
    y: u ** 3 * segment.p0.y + 3 * u ** 2 * t * segment.p1.y + 3 * u * t ** 2 * segment.p2.y + t ** 3 * segment.p3.y,
  };
}

export function TreasureTrailMap({
  completedIds,
  nextRecommendedId,
  maxUnlockedId,
  hasProfile,
  isAllCompleted,
  voyageTransition,
  onVoyageArrival,
  onSelectChallenge,
  onPrimaryCta,
}: TreasureTrailMapProps) {
  const [travelPos, setTravelPos] = useState<Point | null>(null);
  const [arrivedTarget, setArrivedTarget] = useState<ChallengeId | 'treasure' | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!voyageTransition) {
      setTravelPos(null);
      return;
    }

    const segment = TRAIL_SEGMENTS.find(({ id }) => id === voyageTransition.fromId);
    if (!segment) return;

    setArrivedTarget(null);
    setTravelPos(segment.p0);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTravelPos(null);
      setArrivedTarget(voyageTransition.toId);
      onVoyageArrival();
      return;
    }

    const duration = 2200;
    const startedAt = performance.now();
    let frameId = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setTravelPos(evaluateCurve(eased, segment));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        setTravelPos(null);
        setArrivedTarget(voyageTransition.toId);
        soundEngine.play(voyageTransition.toId === 'treasure' ? 'treasureFanfare' : 'stepUnlock');
        onVoyageArrival();
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [voyageTransition, onVoyageArrival]);

  const isAnimating = Boolean(voyageTransition);
  const arrivedChallenge =
    arrivedTarget && arrivedTarget !== 'treasure'
      ? CHALLENGES.find((challenge) => challenge.id === arrivedTarget)
      : null;

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

      {isAnimating && voyageTransition && (
        <div role="status" className="relative z-20 mx-4 mt-4 rounded-2xl border border-emerald-400/50 bg-emerald-950/85 px-4 py-3 text-sm text-emerald-100 sm:mx-8">
          Challenge {voyageTransition.fromId} cleared! Sailing toward{' '}
          {voyageTransition.toId === 'treasure' ? 'the treasure vault' : `Step ${voyageTransition.toId}`}...
        </div>
      )}

      {!isAnimating && arrivedTarget && (
        <div role="status" className="relative z-20 mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/50 bg-emerald-950/85 px-4 py-3 text-sm text-emerald-100 sm:mx-8">
          <span>
            {arrivedChallenge
              ? `Arrived at Challenge ${arrivedChallenge.id}: ${arrivedChallenge.title}`
              : 'Arrived at the treasure vault!'}
          </span>
          <button
            type="button"
            onClick={() => {
              const destination = arrivedTarget;
              setArrivedTarget(null);
              if (destination === 'treasure') onPrimaryCta();
              else onSelectChallenge(destination);
            }}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-1.5 text-xs font-bold text-[#051029] hover:bg-[#4ADE80]"
          >
            {arrivedTarget === 'treasure' ? 'Open Treasure Vault' : `Enter Step ${arrivedTarget}`}
            <Check className="h-4 w-4" />
          </button>
        </div>
      )}

      {lockedNotice && (
        <div role="status" className="relative z-20 mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F5C542]/40 bg-[#0B1E48]/95 px-4 py-3 text-sm text-slate-100 sm:mx-8">
          <span>{lockedNotice}</span>
          <button
            type="button"
            onClick={() => {
              setLockedNotice(null);
              onSelectChallenge(maxUnlockedId);
            }}
            className="min-h-[40px] rounded-xl bg-[#C8102E] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#E11D3F]"
          >
            Go to Challenge {maxUnlockedId}
          </button>
        </div>
      )}

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
          {TRAIL_SEGMENTS.filter((segment) => completedIds.includes(segment.id)).map((segment) => {
            const isCurrentlyAnimating = voyageTransition?.fromId === segment.id;
            return (
              <motion.path
                key={`completed-${segment.id}`}
                d={segment.d}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="1.5"
                strokeDasharray="1.8 2.1"
                strokeLinecap="round"
                initial={isCurrentlyAnimating ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: isCurrentlyAnimating ? 2.2 : 0.5, ease: 'easeInOut' }}
              />
            );
          })}
        </svg>

        {travelPos && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${travelPos.x}%`, top: `${(travelPos.y / 110) * 100}%` }}
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/25 shadow-[0_0_24px_rgba(74,222,128,0.75)]">
              <Ship className="h-7 w-7 text-emerald-200" />
            </div>
          </div>
        )}

        {/* Challenge Steps 1 - 6 */}
        <ol className="relative z-10 space-y-5 sm:space-y-6">
          {CHALLENGES.map((challenge) => {
            const isCompleted = completedIds.includes(challenge.id);
            const isUnlocked = challenge.id <= maxUnlockedId || isCompleted;
            const isNext = !isAnimating && challenge.id === nextRecommendedId && !isAllCompleted;
            const isCurrentlyAnimating = voyageTransition?.fromId === challenge.id;
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
                  onMouseEnter={() => isUnlocked && soundEngine.play('hoverTick')}
                  onClick={() => {
                    if (!isUnlocked) {
                      soundEngine.play('error');
                      setLockedNotice(`Clear Challenge ${maxUnlockedId} first to unlock the next stage.`);
                      return;
                    }
                    setArrivedTarget(null);
                    setLockedNotice(null);
                    onSelectChallenge(challenge.id);
                  }}
                  aria-label={`${challenge.numberLabel}: ${challenge.title}${isCompleted ? ' (Completed)' : isUnlocked ? ' (Unlocked)' : ' (Locked)'}`}
                  className={`group flex items-center gap-3 sm:gap-4 rounded-2xl p-2.5 text-left transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C542] ${
                    isUnlocked ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-60'
                  } ${
                    isLeft ? 'flex-row' : 'flex-row-reverse text-right'
                  }`}
                >
                  {/* Custom Artwork & Label */}
                  <div className="flex flex-col items-center text-center min-w-[128px] sm:min-w-[152px]">
                    <div className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center transition-transform duration-150 ${isUnlocked ? 'group-hover:-translate-y-0.5' : 'grayscale'}`}>
                      <ChallengeIcon id={challenge.id} className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-md" />
                    </div>
                    <span className="mt-1 text-xs sm:text-sm font-semibold text-white">
                      {challenge.numberLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-tight text-[#F5C542] max-w-[155px]">
                      {challenge.title}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-300/80">
                      {isCompleted
                        ? `Solved · Clue ${challenge.clueToken}`
                        : isNext
                          ? `${challenge.difficulty} · Current`
                          : isUnlocked
                            ? `${challenge.difficulty} · ${challenge.discipline}`
                            : 'Locked'}
                    </span>
                  </div>

                  {/* Numbered Crimson/Gold Node */}
                  <motion.div
                    initial={isCurrentlyAnimating ? { backgroundColor: '#C8102E', borderColor: '#F5C542', scale: 1 } : false}
                    animate={isCurrentlyAnimating
                      ? { backgroundColor: '#16A34A', borderColor: '#4ADE80', scale: [1, 1.22, 1] }
                      : { scale: isNext ? 1.08 : 1 }}
                    transition={{ duration: isCurrentlyAnimating ? 1.1 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-bold tabular-nums transition-colors duration-700 ${
                      isCompleted
                        ? 'border-[#4ADE80] bg-[#16A34A] text-white shadow-[0_0_22px_rgba(74,222,128,0.6)]'
                        : isNext
                          ? 'border-[#F5C542] bg-[#C8102E] text-white shadow-[0_0_20px_rgba(200,16,46,0.65)]'
                          : 'border-white/25 bg-[#0B1D47] text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    ) : !isUnlocked ? (
                      <Lock className="h-4 w-4 text-slate-300" />
                    ) : (
                      <span className="text-base">{challenge.id}</span>
                    )}
                  </motion.div>
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

      <span className="sr-only" data-nodes={TRAIL_SEGMENTS.length} />
    </section>
  );
}
