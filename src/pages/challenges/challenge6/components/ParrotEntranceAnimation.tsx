/**
 * ParrotEntranceAnimation – Challenge 6
 *
 * Animation d'introduction : le perroquet (GIF fourni) entre depuis le bas-gauche,
 * survole l'écran en diagonale avec un banking 3D, accélère et sort par le coin
 * supérieur-droit. Des plumes SVG colorées et des traînées lumineuses suivent le
 * sillage. L'overlay s'efface, puis `onDone` est appelé.
 *
 * prefers-reduced-motion : simple fade statique (~520 ms) sans déplacement.
 * Fallback timer : onDone se déclenche même si onAnimationComplete ne tire pas.
 */

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import parrotGif from '../puzzle/User attachment.gif';

export interface ParrotEntranceAnimationProps {
  /** Appelé dès que l'animation est terminée et que le puzzle peut apparaître. */
  onDone: () => void;
  /** Durée totale du vol en secondes (défaut : 1.8 s). */
  durationSeconds?: number;
}

// ─── Plumes SVG dans le sillage ──────────────────────────────────────────────

interface FeatherParticle {
  id: number;
  /** Couleur de remplissage principale */
  color: string;
  /** Couleur de la nervure centrale */
  accent: string;
  delay: number;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  rotateStart: number;
  rotateEnd: number;
  scale: number;
}

const FEATHER_PARTICLES: FeatherParticle[] = [
  {
    id: 1,
    color: '#D93829',
    accent: '#9E1F14',
    delay: 0.35,
    startX: -60,
    startY: 36,
    driftX: -120,
    driftY: 85,
    rotateStart: -20,
    rotateEnd: -105,
    scale: 0.95,
  },
  {
    id: 2,
    color: '#F2B705',
    accent: '#C48A00',
    delay: 0.54,
    startX: -10,
    startY: 8,
    driftX: -105,
    driftY: 95,
    rotateStart: 12,
    rotateEnd: 115,
    scale: 0.85,
  },
  {
    id: 3,
    color: '#1D6FA5',
    accent: '#0F476E',
    delay: 0.72,
    startX: 48,
    startY: -34,
    driftX: -110,
    driftY: 85,
    rotateStart: -32,
    rotateEnd: -135,
    scale: 0.9,
  },
  {
    id: 4,
    color: '#D93829',
    accent: '#9E1F14',
    delay: 0.92,
    startX: 118,
    startY: -88,
    driftX: -95,
    driftY: 80,
    rotateStart: 15,
    rotateEnd: -85,
    scale: 0.78,
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export function ParrotEntranceAnimation({
  onDone,
  durationSeconds = 1.8,
}: ParrotEntranceAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const completedRef = useRef(false);

  /** Garantit que onDone n'est appelé qu'une seule fois. */
  const finishOnce = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onDone();
  };

  // Fallback : si onAnimationComplete ne tire pas (SSR, erreur…), on force la fin.
  useEffect(() => {
    const delay = prefersReducedMotion ? 520 : Math.round(durationSeconds * 1000) + 350;
    const id = window.setTimeout(finishOnce, delay);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSeconds, prefersReducedMotion]);

  // ── Reduced-motion : fade statique ────────────────────────────────────────

  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1820]/85 px-6"
        role="status"
        aria-live="polite"
        aria-label="Ouverture du challenge Puzzle"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.45, 1], ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <img
            src={parrotGif}
            alt="Perroquet tenant la carte au trésor"
            className="w-44 sm:w-56 h-auto select-none drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)]"
            draggable={false}
          />
        </motion.div>
      </div>
    );
  }

  // ── Animation complète ────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center select-none"
      style={{ perspective: '1000px' }}
      role="status"
      aria-live="polite"
      aria-label="Le perroquet apporte la carte au trésor"
    >
      {/* Voile atmosphérique cohérent avec la palette maritime Treasure Hunt */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: [0.9, 0.82, 0.65, 0] }}
        transition={{
          duration: durationSeconds,
          times: [0, 0.4, 0.78, 1],
          ease: 'easeOut',
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_45%_55%,rgba(28,58,74,0.72)_0%,rgba(10,22,30,0.92)_70%)] backdrop-blur-[2px]"
      />

      {/* Traînées lumineuses + plumes SVG dans le sillage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {/* Traînées d'air */}
        {[
          { delay: 0.42, xOffset: -30, yOffset: 26,  width: 170, opacity: 0.38 },
          { delay: 0.64, xOffset:  35, yOffset: -20, width: 220, opacity: 0.48 },
          { delay: 0.88, xOffset: 105, yOffset: -72, width: 190, opacity: 0.4  },
        ].map((streak, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: streak.xOffset + 30, y: streak.yOffset - 30, scaleX: 0.35 }}
            animate={{
              opacity:  [0, streak.opacity, 0],
              x:        [streak.xOffset + 20, streak.xOffset - 85,  streak.xOffset - 200],
              y:        [streak.yOffset - 20, streak.yOffset + 85,  streak.yOffset + 200],
              scaleX:   [0.35, 1.15, 0.55],
            }}
            transition={{
              duration: 0.78,
              delay: streak.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ width: streak.width }}
            className="absolute h-[2.5px] -rotate-45 rounded-full bg-gradient-to-r from-transparent via-[#f3d48c]/75 to-transparent"
          />
        ))}

        {/* Plumes SVG */}
        {FEATHER_PARTICLES.map((feather) => (
          <motion.svg
            key={feather.id}
            viewBox="0 0 32 16"
            className="absolute w-7 h-4 overflow-visible"
            initial={{
              opacity: 0,
              x: feather.startX,
              y: feather.startY,
              rotate: feather.rotateStart,
              scale: feather.scale * 0.65,
            }}
            animate={{
              opacity: [0, 0.9, 0.78, 0],
              x: [
                feather.startX,
                feather.startX + feather.driftX * 0.55,
                feather.startX + feather.driftX,
              ],
              y: [
                feather.startY,
                feather.startY + feather.driftY * 0.45,
                feather.startY + feather.driftY,
              ],
              rotate: [feather.rotateStart, feather.rotateStart + 30, feather.rotateEnd],
              scale:  [feather.scale * 0.65, feather.scale, feather.scale * 0.85],
            }}
            transition={{
              duration: 0.95,
              delay: feather.delay,
              ease: 'easeOut',
            }}
          >
            <path d="M2 9 C10 2, 22 2, 30 7 C22 12, 11 13, 2 9 Z" fill={feather.color} />
            <path
              d="M3 9 C12 7, 21 7, 29 7"
              stroke={feather.accent}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>
        ))}
      </div>

      {/* Perroquet — trajectoire parabolique avec banking 3D et accélération */}
      <motion.div
        initial={{
          x: '-34vw',
          y: '28vh',
          scale: 0.8,
          rotate: -10,
          rotateY: 16,
          opacity: 0,
        }}
        animate={{
          x:       ['-34vw', '-8vw',  '4vw',  '28vw',  '62vw',  '98vw'],
          y:       ['28vh',  '4vh',   '-2vh', '-22vh', '-54vh', '-92vh'],
          scale:   [0.8,     1.04,    1.06,   0.98,    0.84,    0.68],
          rotate:  [-10,     -2,      3,      -12,     -20,     -25],
          rotateY: [16,      4,       -6,     -16,     -24,     -30],
          opacity: [0,       1,       1,      1,       1,       0],
        }}
        transition={{
          duration: durationSeconds,
          times: [0, 0.24, 0.44, 0.66, 0.85, 1],
          ease: 'easeInOut',
        }}
        onAnimationComplete={finishOnce}
        className="relative flex items-center justify-center will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Halo lumineux derrière le perroquet */}
        <div
          aria-hidden="true"
          className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(242,183,5,0.22)_0%,rgba(217,56,41,0.1)_48%,transparent_72%)] blur-xl"
        />

        <img
          src={parrotGif}
          alt="Perroquet rouge, bleu et jaune tenant la carte au trésor"
          draggable={false}
          className="relative w-56 sm:w-72 md:w-80 lg:w-96 h-auto object-contain drop-shadow-[0_26px_34px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      {/* Légende */}
      <motion.p
        aria-hidden="true"
        className="absolute bottom-[14%] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-base font-bold text-[#F5C542] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -4] }}
        transition={{
          duration: durationSeconds * 0.9,
          delay: 0.2,
          times: [0, 0.18, 0.72, 1],
        }}
      >
        Gérard s'enfuit avec la carte… 🦜
      </motion.p>
    </div>
  );
}
