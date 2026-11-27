/**
 * ParrotEntranceAnimation – Challenge 6
 *
 * Trois frames de vol réelles :
 *   closed → piroquetsansbg.png  (perroquet posé avec la carte)
 *   up     → parrot_wings_up     (ailes levées)
 *   down   → parrot_wings_down   (ailes déployées / baissées)
 *
 * Les JPG (up/down) ont un fond blanc : removeWhiteBackgroundFromEdges() les
 * traite par flood-fill canvas avant de les afficher.
 * Le PNG closed est déjà transparent.
 *
 * Séquence : closed → up → down → up → down … (accélère légèrement)
 * La frame active est commutée par des setTimeout calés sur WING_SEQUENCE.
 * Un liftOffset CSS synchronise corps et gravité à chaque battement.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import parrotClosedRaw from '../puzzle/Gemini_Generated_Image_r25m58r25m58r25m-removebg-preview_057ac7c0 (1).png';
import parrotWingsUpRaw   from '../puzzle/parrot_wings_up_1795783109658.jpg';
import parrotWingsDownRaw from '../puzzle/parrot_wings_down_1795783111213.jpg';
import { removeWhiteBackgroundFromEdges } from '../../../../utils/transparentSprite';

// ─── Types ────────────────────────────────────────────────────────────────────

type WingFrame = 'up' | 'down' | 'closed';

interface WingStep { atMs: number; frame: WingFrame; }

// Séquence : départ posé, puis battements s'accélérant légèrement
const WING_SEQUENCE: WingStep[] = [
  { atMs:    0, frame: 'closed' },
  { atMs:  180, frame: 'up'     },
  { atMs:  360, frame: 'down'   },
  { atMs:  530, frame: 'up'     },
  { atMs:  695, frame: 'down'   },
  { atMs:  850, frame: 'up'     },
  { atMs: 1000, frame: 'down'   },
  { atMs: 1145, frame: 'up'     },
  { atMs: 1285, frame: 'down'   },
  { atMs: 1420, frame: 'up'     },
  { atMs: 1550, frame: 'down'   },
  { atMs: 1675, frame: 'up'     },
];

// ─── Plumes SVG ───────────────────────────────────────────────────────────────

const FEATHERS = [
  { id: 1, color: '#D93829', accent: '#9E1F14', delay: 0.28, startX: -75, startY:  42, driftX: -120, driftY: 85, rotateStart: -20, rotateEnd: -115, scale: 0.95 },
  { id: 2, color: '#F2B705', accent: '#C48A00', delay: 0.48, startX: -18, startY:  14, driftX: -105, driftY: 92, rotateStart:  12, rotateEnd:  118, scale: 0.85 },
  { id: 3, color: '#1D6FA5', accent: '#0F476E', delay: 0.68, startX:  40, startY: -24, driftX: -112, driftY: 84, rotateStart: -32, rotateEnd: -138, scale: 0.88 },
  { id: 4, color: '#D93829', accent: '#9E1F14', delay: 0.92, startX: 112, startY: -78, driftX:  -95, driftY: 78, rotateStart:  15, rotateEnd:  -88, scale: 0.78 },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ParrotEntranceAnimationProps {
  onDone: () => void;
  durationSeconds?: number;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function ParrotEntranceAnimation({
  onDone,
  durationSeconds = 2.0,
}: ParrotEntranceAnimationProps) {
  const reduced     = useReducedMotion();
  const doneRef     = useRef(false);

  // Sprites après suppression du fond blanc
  const [sprites, setSprites] = useState<{ up: string; down: string; closed: string } | null>(null);
  const [activeFrame, setActiveFrame] = useState<WingFrame>('closed');

  const finishOnce = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  // ── Chargement + suppression fond blanc des JPG ──────────────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      removeWhiteBackgroundFromEdges(parrotWingsUpRaw,   640),
      removeWhiteBackgroundFromEdges(parrotWingsDownRaw, 640),
      Promise.resolve(parrotClosedRaw), // PNG déjà transparent
    ]).then(([up, down, closed]) => {
      if (!cancelled) setSprites({ up, down, closed });
    });
    return () => { cancelled = true; };
  }, []);

  // ── Séquence de battements d'ailes ──────────────────────────────────────
  useEffect(() => {
    if (!sprites || reduced) return;
    const ratio = durationSeconds / 1.85;
    const timers = WING_SEQUENCE.map((step) =>
      window.setTimeout(
        () => setActiveFrame(step.frame),
        Math.round(step.atMs * ratio)
      )
    );
    return () => timers.forEach(window.clearTimeout);
  }, [sprites, reduced, durationSeconds]);

  // ── Fallback timer ───────────────────────────────────────────────────────
  useEffect(() => {
    const ms = reduced ? 520 : Math.round(durationSeconds * 1000) + 500;
    const id = window.setTimeout(finishOnce, ms);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSeconds, reduced]);

  // ── Portance synchronisée avec le battement ──────────────────────────────
  const liftTransform =
    activeFrame === 'down' ? 'translate3d(0,-6px,0) rotate(-1.5deg)' :
    activeFrame === 'up'   ? 'translate3d(0, 5px,0) rotate( 1.0deg)' :
                             'translate3d(0, 0px,0) rotate( 0.0deg)';

  // ── Reduced-motion ───────────────────────────────────────────────────────
  if (reduced) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#07132E]"
        role="status"
        aria-label="Ouverture du challenge"
      >
        <motion.img
          src={parrotClosedRaw}
          alt="Perroquet tenant la carte au trésor"
          draggable={false}
          className="w-48 sm:w-64 h-auto select-none drop-shadow-[0_14px_24px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.55, times: [0, 0.2, 0.75, 1] }}
        />
      </div>
    );
  }

  // ── Animation complète ───────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center select-none"
      style={{ perspective: '1000px' }}
      role="status"
      aria-label="Le perroquet s'envole avec la carte au trésor"
    >
      {/* Fond maritime sombre */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#07132E]"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.95, 0.75, 0] }}
        transition={{ duration: durationSeconds, times: [0, 0.35, 0.78, 1], ease: 'easeOut' }}
      />

      {/* Traînées + plumes (affichées dès le montage, indépendant du chargement sprites) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[
          { delay: 0.36, xo: -36, yo:  28, w: 170, op: 0.36 },
          { delay: 0.62, xo:  30, yo: -18, w: 215, op: 0.45 },
          { delay: 0.88, xo:  98, yo: -68, w: 190, op: 0.38 },
        ].map((s, i) => (
          <motion.div
            key={i}
            style={{ width: s.w }}
            className="absolute h-[2.5px] -rotate-45 rounded-full bg-gradient-to-r from-transparent via-[#f3d48c]/75 to-transparent"
            initial={{ opacity: 0, x: s.xo + 30, y: s.yo - 30, scaleX: 0.35 }}
            animate={{
              opacity: [0, s.op, 0],
              x: [s.xo + 20, s.xo - 85, s.xo - 200],
              y: [s.yo - 20, s.yo + 85, s.yo + 200],
              scaleX: [0.35, 1.15, 0.55],
            }}
            transition={{ duration: 0.78, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {FEATHERS.map((f) => (
          <motion.svg
            key={f.id}
            viewBox="0 0 32 16"
            className="absolute w-7 h-4 overflow-visible"
            initial={{ opacity: 0, x: f.startX, y: f.startY, rotate: f.rotateStart, scale: f.scale * 0.65 }}
            animate={{
              opacity: [0, 0.9, 0.75, 0],
              x: [f.startX, f.startX + f.driftX * 0.55, f.startX + f.driftX],
              y: [f.startY, f.startY + f.driftY * 0.45, f.startY + f.driftY],
              rotate: [f.rotateStart, f.rotateStart + 30, f.rotateEnd],
              scale: [f.scale * 0.65, f.scale, f.scale * 0.85],
            }}
            transition={{ duration: 0.92, delay: f.delay, ease: 'easeOut' }}
          >
            <path d="M2 9 C10 2, 22 2, 30 7 C22 12, 11 13, 2 9 Z" fill={f.color} />
            <path d="M3 9 C12 7, 21 7, 29 7" stroke={f.accent} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </motion.svg>
        ))}
      </div>

      {/* Perroquet — trajectoire diagonale. Rendu seulement quand sprites prêts. */}
      {sprites && (
        <motion.div
          className="relative flex items-center justify-center will-change-transform"
          initial={{ x: '-28vw', y: '22vh', scale: 0.84, rotate: -4, opacity: 0 }}
          animate={{
            x:       ['-28vw', '-6vw',  '16vw',  '54vw', '104vw'],
            y:       [ '22vh',  '4vh', '-12vh', '-42vh',  '-88vh'],
            scale:   [   0.84,   1.05,    1.02,    0.88,    0.72],
            rotate:  [     -4,     -8,     -13,     -19,     -24],
            opacity: [      0,      1,       1,       1,       0],
          }}
          transition={{
            duration: durationSeconds,
            times: [0, 0.28, 0.56, 0.82, 1],
            ease: 'easeInOut',
          }}
          onAnimationComplete={finishOnce}
        >
          {/* Halo */}
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full blur-xl bg-[radial-gradient(circle,rgba(242,183,5,0.22)_0%,rgba(217,56,41,0.1)_48%,transparent_72%)]"
          />

          {/* Conteneur des 3 frames — transition CSS douce entre frames */}
          <div
            className="relative w-64 sm:w-80 md:w-96 lg:w-[420px] aspect-square will-change-transform"
            style={{
              transform: liftTransform,
              transition: 'transform 140ms ease-in-out',
            }}
          >
            {/* Frame : closed (PNG transparent, perroquet avec carte) */}
            <img
              src={sprites.closed}
              alt={activeFrame === 'closed' ? 'Perroquet rouge, bleu et jaune tenant la carte au trésor' : ''}
              aria-hidden={activeFrame !== 'closed'}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.52)] transition-opacity duration-[120ms] ${
                activeFrame === 'closed' ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Frame : ailes levées (JPG, fond supprimé) */}
            <img
              src={sprites.up}
              alt={activeFrame === 'up' ? 'Perroquet ailes levées' : ''}
              aria-hidden={activeFrame !== 'up'}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.52)] transition-opacity duration-[120ms] ${
                activeFrame === 'up' ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Frame : ailes baissées (JPG, fond supprimé) */}
            <img
              src={sprites.down}
              alt={activeFrame === 'down' ? 'Perroquet ailes baissées' : ''}
              aria-hidden={activeFrame !== 'down'}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.52)] transition-opacity duration-[120ms] ${
                activeFrame === 'down' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </motion.div>
      )}

      {/* Légende */}
      <motion.p
        aria-hidden="true"
        className="absolute bottom-[13%] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-base font-bold text-[#F5C542] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -4] }}
        transition={{ duration: durationSeconds * 0.88, delay: 0.22, times: [0, 0.18, 0.70, 1] }}
      >
        Gérard s'enfuit avec la carte… 🦜
      </motion.p>
    </div>
  );
}
