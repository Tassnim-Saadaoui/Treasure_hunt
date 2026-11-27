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

interface Point { x: number; y: number; }
interface TrailSegment { id: ChallengeId; d: string; p0: Point; p1: Point; p2: Point; p3: Point; }

// ─── SVG viewBox: 100 wide × 100 tall (percentage-based) ─────────────────────
// 6 nodes alternating left (x≈22) / right (x≈78), spaced ~14 units vertically.
// Nodes: 1L(22,8) → 2R(78,22) → 3L(22,36) → 4R(78,50) → 5L(22,64) → 6R(78,78) → chest(50,94)

const NODE_POS: Record<number, Point> = {
  1: { x: 22, y: 8  },
  2: { x: 78, y: 22 },
  3: { x: 22, y: 36 },
  4: { x: 78, y: 50 },
  5: { x: 22, y: 64 },
  6: { x: 78, y: 78 },
};

const TRAIL_SEGMENTS: TrailSegment[] = [
  { id:1, d:'M 22 8  C 40 8,  70 14, 78 22', p0:{x:22,y:8},  p1:{x:40,y:8},  p2:{x:70,y:14}, p3:{x:78,y:22} },
  { id:2, d:'M 78 22 C 60 22, 30 28, 22 36', p0:{x:78,y:22}, p1:{x:60,y:22}, p2:{x:30,y:28}, p3:{x:22,y:36} },
  { id:3, d:'M 22 36 C 40 36, 70 42, 78 50', p0:{x:22,y:36}, p1:{x:40,y:36}, p2:{x:70,y:42}, p3:{x:78,y:50} },
  { id:4, d:'M 78 50 C 60 50, 30 56, 22 64', p0:{x:78,y:50}, p1:{x:60,y:50}, p2:{x:30,y:56}, p3:{x:22,y:64} },
  { id:5, d:'M 22 64 C 40 64, 70 70, 78 78', p0:{x:22,y:64}, p1:{x:40,y:64}, p2:{x:70,y:70}, p3:{x:78,y:78} },
  { id:6, d:'M 78 78 C 65 78, 55 86, 50 94', p0:{x:78,y:78}, p1:{x:65,y:78}, p2:{x:55,y:86}, p3:{x:50,y:94} },
];

const FULL_PATH = TRAIL_SEGMENTS.map(s => s.d).join(' ');

function evalCurve(t: number, s: TrailSegment): Point {
  const u = 1 - t;
  return {
    x: u**3*s.p0.x + 3*u**2*t*s.p1.x + 3*u*t**2*s.p2.x + t**3*s.p3.x,
    y: u**3*s.p0.y + 3*u**2*t*s.p1.y + 3*u*t**2*s.p2.y + t**3*s.p3.y,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TreasureTrailMap({
  completedIds, nextRecommendedId, maxUnlockedId,
  isAllCompleted, voyageTransition, onVoyageArrival,
  onSelectChallenge, onPrimaryCta,
}: TreasureTrailMapProps) {
  const [travelPos, setTravelPos] = useState<Point | null>(null);

  useEffect(() => {
    if (!voyageTransition) { setTravelPos(null); return; }
    const seg = TRAIL_SEGMENTS.find(s => s.id === voyageTransition.fromId);
    if (!seg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onVoyageArrival(); return; }

    setTravelPos(seg.p0);
    const dur = 1800;
    const t0 = performance.now();
    let fid = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = p < .5 ? 4*p**3 : 1-(-2*p+2)**3/2;
      setTravelPos(evalCurve(e, seg));
      if (p < 1) { fid = requestAnimationFrame(tick); }
      else {
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
      className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
      style={{ background: 'radial-gradient(ellipse at 80% 0%, #6b0a0a 0%, #0a1540 45%, #061030 100%)' }}
    >
      {/* Background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#C8102E]/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 h-48 w-48 rounded-full bg-[#1a1060]/40 blur-3xl" />

      {/* ── Hero ── */}
      <div className="relative z-10 px-6 pb-4 pt-8 text-center sm:pb-6 sm:pt-10">
        <p className="font-display text-sm font-black tracking-[0.3em] text-[#F5C542] sm:text-base">
          NATEG
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-none tracking-wide text-[#F5C542] sm:text-6xl">
          TREASURE<br />HUNT
        </h1>
        <p className="mt-3 text-xs font-bold tracking-widest text-white sm:text-sm">
          THE GREAT CHALLENGE STARTS HERE!
        </p>
        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-300 sm:text-sm">
          Find the clues, solve the puzzles, and reach the final treasure!
        </p>
      </div>

      {/* ── Trail area ── */}
      <div className="relative z-10 px-2 pb-6 sm:px-4">
        {/*
          Container: fixed aspect ratio so the SVG coordinates map correctly.
          We use a 100×100 viewBox but the nodes are % of this container's size.
          padding-bottom trick: container height = 1.6× its width (portrait feel).
        */}
        <div className="relative mx-auto w-full max-w-sm" style={{ paddingBottom: '155%' }}>

          {/* ── SVG path layer ── */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="b" />
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Base dashed golden trail */}
            <path
              d={FULL_PATH}
              fill="none"
              stroke="#F5C542"
              strokeWidth="1.4"
              strokeDasharray="2.5 2.8"
              strokeLinecap="round"
              opacity="0.55"
              filter="url(#goldGlow)"
            />

            {/* Completed segments — bright green glow */}
            {TRAIL_SEGMENTS.filter(s => completedIds.includes(s.id)).map(s => (
              <motion.path
                key={s.id}
                d={s.d}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#greenGlow)"
                initial={voyageTransition?.fromId === s.id ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: voyageTransition?.fromId === s.id ? 1.8 : 0.4, ease: 'easeInOut' }}
              />
            ))}
          </svg>

          {/* ── Animated ship ── */}
          {travelPos && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
              style={{ left:`${travelPos.x}%`, top:`${travelPos.y}%` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/25 shadow-[0_0_18px_rgba(74,222,128,0.8)]">
                <Ship className="h-5 w-5 text-emerald-100" />
              </div>
            </div>
          )}

          {/* ── Challenge nodes ── */}
          {CHALLENGES.map(challenge => {
            const contentId   = CHALLENGE_CONTENT_ID_BY_STAGE[challenge.id - 1];
            const isCompleted = completedIds.includes(challenge.id);
            const isUnlocked  = challenge.id <= maxUnlockedId || isCompleted;
            const isNext      = challenge.id === nextRecommendedId && !isAllCompleted;
            const isLeft      = challenge.side === 'left';
            const pos         = NODE_POS[challenge.id];

            return (
              <div
                key={challenge.id}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top:  `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => { if (!isUnlocked) return; soundEngine.play('click'); onSelectChallenge(challenge.id); }}
                  aria-label={`Challenge ${challenge.id} — ${challenge.title}`}
                  className={`group flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] ${
                    isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  } ${isLeft ? 'items-start' : 'items-end'}`}
                >
                  {/* Row: icon + number badge */}
                  <div className={`flex items-center gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

                    {/* Icon rounded square */}
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 shadow-lg transition-transform duration-150 group-hover:scale-105 sm:h-16 sm:w-16 ${
                        isCompleted
                          ? 'border-emerald-400/60 bg-emerald-900/40'
                          : isNext
                          ? 'border-[#F5C542]/60 bg-[#1a0a30] shadow-[0_0_20px_rgba(245,197,66,0.3)]'
                          : isUnlocked
                          ? 'border-white/20 bg-[#0d1b3e]'
                          : 'border-white/10 bg-[#080f20]'
                      }`}
                    >
                      <ChallengeIcon
                        id={contentId}
                        className={`h-7 w-7 sm:h-8 sm:w-8 ${
                          isCompleted ? 'text-emerald-300'
                          : isNext    ? 'text-[#F5C542]'
                          : isUnlocked? 'text-[#38BDF8]'
                          : 'text-slate-600'
                        }`}
                      />
                    </div>

                    {/* Number circle */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black shadow-md ${
                        isCompleted
                          ? 'border-emerald-400 bg-emerald-500 text-white'
                          : isNext
                          ? 'border-[#F5C542] bg-[#C8102E] text-white shadow-[0_0_14px_rgba(200,16,46,0.7)]'
                          : isUnlocked
                          ? 'border-white/30 bg-[#C8102E] text-white'
                          : 'border-white/15 bg-[#1a1a2e] text-slate-500'
                      }`}
                    >
                      {isCompleted
                        ? <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        : isUnlocked
                        ? challenge.id
                        : <Lock className="h-3 w-3" />}
                    </div>
                  </div>

                  {/* Label */}
                  <div className={`max-w-[110px] sm:max-w-[130px] ${isLeft ? 'text-left' : 'text-right'}`}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      Challenge {challenge.id}
                    </p>
                    <p className={`text-[11px] font-bold leading-tight sm:text-xs ${
                      isNext ? 'text-[#F5C542]' : isCompleted ? 'text-emerald-300' : 'text-white'
                    }`}>
                      {challenge.title}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}

          {/* ── Treasure chest ── */}
          <div
            className="absolute"
            style={{ left: '50%', top: '94%', transform: 'translate(-50%, -50%)' }}
          >
            <TreasureChestIllustration className="h-16 w-20 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] sm:h-20 sm:w-24" />
          </div>

        </div>{/* end relative container */}

        {/* ── CTA button ── */}
        <div className="mt-2 flex flex-col items-center gap-1 pb-2 sm:mt-4">
          <button
            type="button"
            disabled={isAllCompleted}
            onClick={() => { soundEngine.play('stepUnlock'); onPrimaryCta(); }}
            className="flex min-h-[52px] w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-[#C8102E] px-6 text-sm font-black tracking-widest text-white shadow-[0_8px_28px_rgba(200,16,46,0.5)] transition-all hover:bg-[#E11D3F] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-default disabled:bg-emerald-700 disabled:shadow-none sm:max-w-xs sm:text-base"
          >
            {isAllCompleted && <Sparkles className="h-4 w-4" />}
            {isAllCompleted
              ? 'HUNT COMPLETE'
              : completedIds.length
              ? `CONTINUE — CHALLENGE ${nextRecommendedId}`
              : 'JOIN THE ADVENTURE'}
          </button>
          <p className="mt-2 text-center text-[10px] text-slate-500">
            Un événement organisé par NATEG ISSATSo Student Chapter
          </p>
        </div>
      </div>
    </section>
  );
}
