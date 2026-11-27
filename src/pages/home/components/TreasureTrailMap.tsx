import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Ship, Sparkles } from 'lucide-react';
import { CHALLENGES, CHALLENGE_CONTENT_ID_BY_STAGE } from '../../../data/challenges';
import { soundEngine } from '../../../lib/audio/soundEngine';
import type { ChallengeId } from '../../../domain/hunt/types';
import { ChallengeIcon, TreasureChestIllustration } from '../../../components/artwork/ChallengeArtwork';

export interface VoyageTransition {
  fromId: ChallengeId;
  toId: ChallengeId | 'treasure';
}

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

// ─── SVG viewBox: 100 × 175 (ratio ~1:1 avec un conteneur 360×630) ──────────
// Écart horizontal x=38 ↔ x=62 avec pas vertical dy=25 → vrai zigzag à ~45°
// et pointillés parfaitement réguliers.

const SVG_HEIGHT = 175;

const NODE_POS: Record<number, Point> = {
  1: { x: 38, y: 12 },
  2: { x: 62, y: 37 },
  3: { x: 38, y: 62 },
  4: { x: 62, y: 87 },
  5: { x: 38, y: 112 },
  6: { x: 62, y: 137 },
};

const TRAIL_SEGMENTS: TrailSegment[] = [
  { id: 1, d: 'M 38 12  C 56 15,  65 25,  62 37',  p0: { x: 38, y: 12 },  p1: { x: 56, y: 15 },  p2: { x: 65, y: 25 },  p3: { x: 62, y: 37 } },
  { id: 2, d: 'M 62 37  C 59 49,  36 50,  38 62',  p0: { x: 62, y: 37 },  p1: { x: 59, y: 49 },  p2: { x: 36, y: 50 },  p3: { x: 38, y: 62 } },
  { id: 3, d: 'M 38 62  C 40 74,  65 75,  62 87',  p0: { x: 38, y: 62 },  p1: { x: 40, y: 74 },  p2: { x: 65, y: 75 },  p3: { x: 62, y: 87 } },
  { id: 4, d: 'M 62 87  C 59 99,  36 100, 38 112', p0: { x: 62, y: 87 },  p1: { x: 59, y: 99 },  p2: { x: 36, y: 100 }, p3: { x: 38, y: 112 } },
  { id: 5, d: 'M 38 112 C 40 124, 65 125, 62 137', p0: { x: 38, y: 112 }, p1: { x: 40, y: 124 }, p2: { x: 65, y: 125 }, p3: { x: 62, y: 137 } },
  { id: 6, d: 'M 62 137 C 56 152, 40 158, 28 161', p0: { x: 62, y: 137 }, p1: { x: 56, y: 152 }, p2: { x: 40, y: 158 }, p3: { x: 28, y: 161 } },
];

const FULL_PATH = TRAIL_SEGMENTS.map((s) => s.d).join(' ');

function evalCurve(t: number, s: TrailSegment): Point {
  const u = 1 - t;
  return {
    x: u ** 3 * s.p0.x + 3 * u ** 2 * t * s.p1.x + 3 * u * t ** 2 * s.p2.x + t ** 3 * s.p3.x,
    y: u ** 3 * s.p0.y + 3 * u ** 2 * t * s.p1.y + 3 * u * t ** 2 * s.p2.y + t ** 3 * s.p3.y,
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
    const seg = TRAIL_SEGMENTS.find((s) => s.id === voyageTransition.fromId);
    if (!seg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onVoyageArrival();
      return;
    }

    setTravelPos(seg.p0);
    const dur = 1800;
    const t0 = performance.now();
    let fid = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
      setTravelPos(evalCurve(e, seg));
      if (p < 1) {
        fid = requestAnimationFrame(tick);
      } else {
        setTravelPos(null);
        soundEngine.play(voyageTransition.toId === 'treasure' ? 'treasureFanfare' : 'stepUnlock');
        onVoyageArrival();
      }
    };

    fid = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(fid);
  }, [onVoyageArrival, voyageTransition]);

  return (
    <section
      aria-label="NATEG Treasure Hunt"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#06132E] shadow-2xl"
    >
      {/* Halo rouge courbé en haut à droite */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 h-72 w-[135%] rounded-[100%] opacity-90"
        style={{
          background:
            'radial-gradient(ellipse at 82% 28%, rgba(220, 38, 38, 0.9) 0%, rgba(139, 18, 32, 0.8) 38%, rgba(30, 18, 56, 0.4) 72%, rgba(6, 19, 46, 0) 100%)',
        }}
      />

      {/* Halo rouge en bas derrière le coffre et le bouton */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 inset-x-0 h-64"
        style={{
          background:
            'radial-gradient(ellipse at 50% 90%, rgba(220, 38, 38, 0.82) 0%, rgba(153, 27, 27, 0.45) 45%, rgba(6, 19, 46, 0) 78%)',
        }}
      />

      {/* Étoiles subtiles dans le ciel bleu nuit */}
      <svg
        viewBox="0 0 400 760"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
      >
        {[
          { x: 30, y: 240, s: 10 },
          { x: 315, y: 265, s: 7 },
          { x: 355, y: 455, s: 9 },
          { x: 36, y: 545, s: 9 },
          { x: 332, y: 635, s: 7 },
        ].map((star, idx) => (
          <path
            key={idx}
            d={`M ${star.x} ${star.y - star.s} Q ${star.x} ${star.y} ${star.x + star.s} ${star.y} Q ${star.x} ${star.y} ${star.x} ${star.y + star.s} Q ${star.x} ${star.y} ${star.x - star.s} ${star.y} Q ${star.x} ${star.y} ${star.x} ${star.y - star.s} Z`}
            fill="#60A5FA"
            fillOpacity="0.55"
          />
        ))}
      </svg>

      {/* ── Hero ── */}
      <div className="relative z-10 px-5 pb-2 pt-7 text-center sm:px-6 sm:pb-4 sm:pt-10">
        <p className="font-display text-sm font-black tracking-[0.3em] text-[#F5C542] sm:text-base">
          NATEG
        </p>
        <h1 className="font-display text-3xl font-extrabold leading-none tracking-wide text-[#F5C542] sm:text-5xl">
          TREASURE
          <br />
          HUNT
        </h1>
        <p className="mt-2.5 text-xs font-bold tracking-widest text-white sm:mt-3 sm:text-sm">
          THE GREAT CHALLENGE STARTS HERE!
        </p>
        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-300 sm:text-sm">
          Find the clues, solve the puzzles, and reach the final treasure!
        </p>
      </div>

      {/* ── Zone du parcours ── */}
      <div className="relative z-10 px-2 pb-4 sm:px-4">
        <div className="relative mx-auto h-[630px] w-full max-w-[380px] sm:h-[660px] sm:max-w-[400px]">
          {/* Tracé SVG pointillé doré + segments validés en vert */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 100 ${SVG_HEIGHT}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Chemin de base doré en pointillés */}
            <path
              d={FULL_PATH}
              fill="none"
              stroke="#F5C542"
              strokeWidth="1.5"
              strokeDasharray="2.5 3"
              strokeLinecap="round"
              opacity="0.82"
              filter="url(#goldGlow)"
            />

            {/* Segments complétés en vert lumineux */}
            {TRAIL_SEGMENTS.filter((s) => completedIds.includes(s.id)).map((s) => (
              <motion.path
                key={s.id}
                d={s.d}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2.1"
                strokeLinecap="round"
                filter="url(#greenGlow)"
                initial={voyageTransition?.fromId === s.id ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: voyageTransition?.fromId === s.id ? 1.8 : 0.4,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>

          {/* Navire animé pendant la transition */}
          {travelPos && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${travelPos.x}%`,
                top: `${(travelPos.y / SVG_HEIGHT) * 100}%`,
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/25 shadow-[0_0_18px_rgba(74,222,128,0.8)]">
                <Ship className="h-5 w-5 text-emerald-100" />
              </div>
            </div>
          )}

          {/* Nœuds des 6 challenges */}
          {CHALLENGES.map((challenge) => {
            const contentId = CHALLENGE_CONTENT_ID_BY_STAGE[challenge.id - 1];
            const isCompleted = completedIds.includes(challenge.id);
            const isUnlocked = challenge.id <= maxUnlockedId || isCompleted;
            const isNext = challenge.id === nextRecommendedId && !isAllCompleted;
            const isLeft = challenge.id % 2 === 1;
            const pos = NODE_POS[challenge.id];
            const topPct = (pos.y / SVG_HEIGHT) * 100;

            const handlePick = () => {
              if (!isUnlocked) return;
              soundEngine.play('click');
              onSelectChallenge(challenge.id);
            };

            return (
              <div
                key={challenge.id}
                className="absolute inset-x-0"
                style={{ top: `${topPct}%`, transform: 'translateY(-50%)' }}
              >
                {/* Icône sans bordure + libellé borné à 30% pour éviter tout contact avec le cercle */}
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={handlePick}
                  aria-label={`Challenge ${challenge.id} — ${challenge.title}`}
                  className={`group absolute top-1/2 -translate-y-1/2 flex w-[30%] flex-col items-center text-center transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] rounded-xl p-0.5 ${
                    isLeft ? 'left-[1%]' : 'right-[1%]'
                  } ${
                    isUnlocked
                      ? 'cursor-pointer hover:scale-105 active:scale-95'
                      : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <ChallengeIcon
                    id={contentId}
                    className={`h-9 w-9 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)] sm:h-11 sm:w-11 ${
                      isCompleted
                        ? 'text-emerald-300'
                        : isNext
                          ? 'text-[#F5C542]'
                          : isUnlocked
                            ? 'text-[#38BDF8]'
                            : 'text-slate-400'
                    }`}
                  />

                  <span className="mt-1 text-[10px] font-semibold leading-tight text-white sm:text-xs">
                    Challenge {challenge.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold leading-tight sm:text-xs ${
                      isCompleted ? 'text-emerald-300' : 'text-[#F5C542]'
                    }`}
                  >
                    {challenge.title}
                  </span>

                  {!isUnlocked && (
                    <span className="mt-0.5 inline-flex items-center gap-1 text-[9px] text-slate-400 sm:text-[10px]">
                      <Lock className="h-2.5 w-2.5" /> Locked
                    </span>
                  )}
                </button>

                {/* Cercle numéroté centré sur le sommet du zigzag */}
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={handlePick}
                  style={{ left: `${pos.x}%` }}
                  aria-label={`Ouvrir Challenge ${challenge.id}`}
                  className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] sm:h-11 sm:w-11 sm:text-sm ${
                    isCompleted
                      ? 'border-emerald-400 bg-emerald-600 text-white shadow-[0_0_16px_rgba(74,222,128,0.55)] cursor-pointer'
                      : isNext
                        ? 'border-[#FDE047] bg-[#DC2626] text-white shadow-[0_0_20px_rgba(245,197,66,0.55)] scale-105 cursor-pointer'
                        : isUnlocked
                          ? 'border-[#DC2626] bg-[#101C3E] text-white hover:bg-[#DC2626] cursor-pointer'
                          : 'border-[#991B1B]/75 bg-[#09142E] text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : challenge.id}
                </button>
              </div>
            );
          })}

          {/* Coffre au trésor en bas à gauche */}
          <div
            className="absolute"
            style={{ left: '20%', top: `${(161 / SVG_HEIGHT) * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <TreasureChestIllustration className="h-20 w-24 drop-shadow-[0_10px_22px_rgba(0,0,0,0.7)] sm:h-28 sm:w-32" />
          </div>
        </div>

        {/* ── Bouton CTA principal + Pied de page ── */}
        <div className="mt-3 flex flex-col items-center gap-1 pb-3 sm:mt-4">
          <button
            type="button"
            disabled={isAllCompleted}
            onClick={() => {
              soundEngine.play('stepUnlock');
              onPrimaryCta();
            }}
            className="flex min-h-[50px] w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#E11D48] to-[#B91C1C] px-6 text-sm font-black tracking-widest text-white shadow-[0_10px_28px_rgba(220,38,38,0.5)] transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-default disabled:bg-emerald-700 disabled:shadow-none sm:max-w-xs sm:text-base"
          >
            {isAllCompleted && <Sparkles className="h-4 w-4" />}
            {isAllCompleted
              ? 'HUNT COMPLETE'
              : completedIds.length
                ? `CONTINUE — CHALLENGE ${nextRecommendedId}`
                : 'JOIN THE ADVENTURE'}
          </button>

         
        </div>
      </div>
    </section>
  );
}