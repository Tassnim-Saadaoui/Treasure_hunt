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
  isAllCompleted,
  voyageTransition,
  onVoyageArrival,
  onSelectChallenge,
  onPrimaryCta,
}: TreasureTrailMapProps) {
  const [travelPos, setTravelPos] = useState<Point | null>(null);

  useEffect(() => {
    if (!voyageTransition) {
      setTravelPos(null);
      return;
    }

    const segment = TRAIL_SEGMENTS.find(({ id }) => id === voyageTransition.fromId);
    if (!segment) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      onVoyageArrival();
      return;
    }

    setTravelPos(segment.p0);
    const duration = 1800;
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
        soundEngine.play(voyageTransition.toId === 'treasure' ? 'treasureFanfare' : 'stepUnlock');
        onVoyageArrival();
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [onVoyageArrival, voyageTransition]);

  return (
    <section
      aria-label="NATEG Treasure Hunt"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#061433] shadow-2xl"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#C8102E]/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C8102E]/25 blur-3xl" />

      <div className="relative z-10 border-b border-white/10 bg-[radial-gradient(circle_at_80%_0%,rgba(225,29,63,0.9),transparent_42%),linear-gradient(145deg,#250523_0%,#09183e_62%,#1e0621_100%)] px-3 pb-3 pt-4 text-center sm:px-8 sm:pb-8 sm:pt-9 lg:pb-12 lg:pt-12">
        <p className="font-display text-xs font-bold tracking-[0.26em] text-[#F5C542] sm:text-lg">NATEG</p>
        <h1 className="mt-0.5 font-display text-2xl font-extrabold tracking-wide text-[#F5C542] sm:mt-1 sm:text-5xl lg:text-6xl">
          TREASURE HUNT
        </h1>
        <p className="mt-1 text-[10px] font-bold tracking-wide text-white sm:mt-3 sm:text-base">THE GREAT CHALLENGE STARTS HERE!</p>
        <p className="mx-auto mt-2 hidden max-w-sm text-sm leading-relaxed text-slate-100 sm:block sm:text-base">
          Find the clues, solve the puzzles, and reach the final treasure!
        </p>
      </div>

      <div className="relative px-2 pb-3 pt-2 sm:px-8 sm:pb-7 sm:pt-6 lg:px-14 lg:pb-12 lg:pt-10 xl:px-20">
        <svg aria-hidden="true" viewBox="0 0 100 110" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <filter id="trailGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path
            d="M 42 11 C 58 14, 72 18, 64 25 C 56 32, 32 33, 40 40 C 48 47, 72 48, 64 55 C 56 62, 32 63, 40 70 C 48 77, 72 78, 64 85 C 56 91, 44 92, 34 95"
            fill="none"
            stroke="#FDE047"
            strokeWidth="1.1"
            strokeDasharray="2 2.3"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#trailGlow)"
          />
          {TRAIL_SEGMENTS.filter((segment) => completedIds.includes(segment.id)).map((segment) => {
            const isCurrentVoyage = voyageTransition?.fromId === segment.id;
            return (
              <motion.path
                key={segment.id}
                d={segment.d}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="1.7"
                strokeDasharray="2 2.3"
                strokeLinecap="round"
                initial={isCurrentVoyage ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: isCurrentVoyage ? 1.8 : 0.4, ease: 'easeInOut' }}
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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/25 shadow-[0_0_26px_rgba(74,222,128,0.8)]">
              <Ship className="h-8 w-8 text-emerald-100" />
            </div>
          </div>
        )}

        <ol className="relative z-10 space-y-1 sm:space-y-9 lg:space-y-11 xl:space-y-12">
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
                  className={`flex max-w-[180px] items-center gap-1.5 rounded-xl p-1 text-left transition-transform sm:max-w-[280px] sm:gap-4 sm:rounded-2xl sm:p-3 lg:max-w-[380px] lg:gap-6 lg:p-4 xl:max-w-[420px] ${
                    isUnlocked ? 'hover:scale-[1.02] active:scale-[0.98]' : 'cursor-not-allowed opacity-55'
                  } ${isLeft ? 'flex-row' : 'flex-row-reverse text-right'}`}
                >
                  <div className="flex min-w-0 w-[116px] flex-row items-center gap-1.5 text-left sm:w-auto sm:min-w-[150px] sm:flex-col sm:gap-0 sm:text-center lg:min-w-[220px] xl:min-w-[250px]">
                    <ChallengeIcon id={challenge.id} className={`h-8 w-8 shrink-0 sm:mt-1.5 sm:h-20 sm:w-20 lg:h-28 lg:w-28 xl:h-32 xl:w-32 ${isUnlocked ? '' : 'grayscale'}`} />
                    <div className="flex min-w-0 flex-col sm:items-center">
                      <span className="text-[11px] font-semibold leading-tight text-white sm:mt-2 sm:text-sm lg:text-lg xl:text-xl">Challenge {challenge.id}</span>
                      <span className="mt-0.5 text-[9px] font-bold leading-tight text-[#F5C542] sm:text-xs lg:mt-1 lg:text-sm xl:text-base">
                        {challenge.title}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold sm:h-14 sm:w-14 sm:text-lg lg:h-20 lg:w-20 lg:text-2xl xl:h-[88px] xl:w-[88px] xl:text-3xl ${
                      isCompleted
                        ? 'border-[#4ADE80] bg-[#16A34A] text-white'
                        : isNext
                          ? 'border-[#F5C542] bg-[#C8102E] text-white shadow-[0_0_20px_rgba(200,16,46,0.65)]'
                          : 'border-white/25 bg-[#0B1D47] text-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 xl:h-9 xl:w-9" strokeWidth={3} /> : isUnlocked ? challenge.id : <Lock className="h-3.5 w-3.5 sm:h-5 sm:w-5 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative z-10 mt-2 flex flex-col items-center sm:mt-5">
          <TreasureChestIllustration className="h-12 w-16 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] sm:h-36 sm:w-44 lg:h-40 lg:w-48 xl:h-44 xl:w-52" />
          <button
            type="button"
            disabled={isAllCompleted}
            onClick={() => {
              soundEngine.play('stepUnlock');
              onPrimaryCta();
            }}
            className="mt-1 flex min-h-[42px] w-full max-w-[240px] items-center justify-center gap-2 rounded-full bg-[#C8102E] px-4 py-2 text-xs font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(200,16,46,0.45)] transition-transform hover:bg-[#E11D3F] active:scale-[0.98] disabled:cursor-default disabled:bg-emerald-700 disabled:shadow-none sm:mt-2 sm:min-h-[58px] sm:max-w-sm sm:px-8 sm:py-4 sm:text-base"
          >
            {isAllCompleted && <Sparkles className="h-4 w-4" />}
            {isAllCompleted ? 'HUNT COMPLETE' : completedIds.length ? `CONTINUE CHALLENGE ${nextRecommendedId}` : 'JOIN THE ADVENTURE'}
          </button>
         
        </div>
      </div>
    </section>
  );
}
