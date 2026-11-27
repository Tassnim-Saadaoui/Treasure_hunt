/**
 * PieceScatterTransition
 *
 * Séquence en deux temps :
 *
 * 1. SCATTER (0 → ~1.2 s)
 *    Les 12 vraies pièces PNG tombent depuis hors-écran, en cascade décalée,
 *    avec rotation — comme lâchées par Gérard en s'envolant.
 *    Elles s'immobilisent éparpillées sur le fond sombre.
 *
 * 2. GATHER (1.2 → ~2.4 s)
 *    Chaque pièce rejoint en vol sa cellule exacte dans la grille du puzzle
 *    (position mesurée via un ref sur le conteneur du puzzle).
 *    Elles se positionnent, se réduisent à la bonne taille, se fondent
 *    dans le puzzle → le puzzle réel apparaît en dessous au même moment.
 *
 * La transition est volontairement rapide et élégante (~2.4 s total).
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import piece1  from '../puzzle/1.png';
import piece2  from '../puzzle/2.png';
import piece3  from '../puzzle/3.png';
import piece4  from '../puzzle/4.png';
import piece5  from '../puzzle/5.png';
import piece6  from '../puzzle/6.png';
import piece7  from '../puzzle/7.png';
import piece8  from '../puzzle/8.png';
import piece9  from '../puzzle/9.png';
import piece10 from '../puzzle/10.png';
import piece11 from '../puzzle/11.png';
import piece12 from '../puzzle/12.png';

const IMGS = [piece1,piece2,piece3,piece4,piece5,piece6,piece7,piece8,piece9,piece10,piece11,piece12];

// Géométrie du puzzle (mirror de TreasureMapPuzzle.tsx)
const COLS   = 3;
const ROWS   = 4;
const CORE_W = 341; // px natifs par cellule
const CORE_H = 255;
const TOTAL_W = CORE_W * COLS; // 1023
const TOTAL_H = CORE_H * ROWS; // 1020

// Positions de départ éparpillées (vw/vh relatifs au centre de l'écran)
const SCATTER: { sx: string; sy: string; rot: number }[] = [
  { sx: '-44vw', sy: '-52vh', rot:  -32 },
  { sx: '-18vw', sy: '-60vh', rot:   16 },
  { sx:  '20vw', sy: '-55vh', rot:  -48 },
  { sx:  '48vw', sy: '-50vh', rot:   24 },
  { sx: '-50vw', sy: '-28vh', rot:   38 },
  { sx: '-24vw', sy: '-64vh', rot:  -20 },
  { sx:  '10vw', sy: '-62vh', rot:   52 },
  { sx:  '44vw', sy: '-35vh', rot:  -36 },
  { sx: '-40vw', sy: '-18vh', rot:   18 },
  { sx: '-10vw', sy: '-68vh', rot:  -58 },
  { sx:  '28vw', sy: '-44vh', rot:   42 },
  { sx:  '56vw', sy: '-22vh', rot:  -26 },
];

// Positions intermédiaires (où les pièces s'arrêtent avant de converger)
const REST: { rx: string; ry: string }[] = [
  { rx: '-38vw', ry: '-24vh' },
  { rx:  '-8vw', ry: '-32vh' },
  { rx:  '26vw', ry: '-28vh' },
  { rx:  '42vw', ry: '-18vh' },
  { rx: '-44vw', ry:   '2vh' },
  { rx: '-14vw', ry:  '-8vh' },
  { rx:  '12vw', ry:   '4vh' },
  { rx:  '40vw', ry:   '8vh' },
  { rx: '-36vw', ry:  '22vh' },
  { rx:  '-4vw', ry:  '26vh' },
  { rx:  '24vw', ry:  '20vh' },
  { rx:  '48vw', ry:  '24vh' },
];

// Timing
const FALL_STAGGER = 0.08;  // s entre chaque pièce
const FALL_DUR     = 0.55;  // durée de la chute
const GATHER_START = 1.15;  // s — les pièces commencent à converger
const GATHER_DUR   = 0.55;  // durée de convergence
const FADE_DELAY   = GATHER_START + GATHER_DUR - 0.1;
const TOTAL_MS     = (FADE_DELAY + 0.4) * 1000 + 300;

interface PieceScatterTransitionProps {
  /** Ref sur le conteneur beige du puzzle (max-w-[600px]).
   *  Passé depuis page.tsx pour mesurer la position exacte de la grille. */
  puzzleContainerRef: React.RefObject<HTMLDivElement | null>;
  onDone: () => void;
}

interface CellTarget {
  /** Position du centre de la cellule en px depuis le centre de l'écran */
  cx: number;
  cy: number;
  /** Largeur affichée de la pièce dans la grille (px) */
  pieceW: number;
  pieceH: number;
}

export function PieceScatterTransition({ puzzleContainerRef, onDone }: PieceScatterTransitionProps) {
  const doneRef  = useRef(false);
  const finishOnce = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  // Positions cibles calculées à partir du DOM
  const [targets, setTargets] = useState<CellTarget[] | null>(null);

  useLayoutEffect(() => {
    // Mesure la grille dès que le composant est monté
    // On attend un frame pour que le puzzle soit rendu et mesuré
    const id = requestAnimationFrame(() => {
      const container = puzzleContainerRef.current;
      if (!container) { setTargets(null); return; }

      const rect = container.getBoundingClientRect();

      // Le puzzle (inner div) a un padding interne de ~12-16px (p-3 sm:p-4)
      // On prend la zone intérieure approximative
      const padding = window.innerWidth >= 640 ? 16 : 12;
      const innerW  = rect.width  - padding * 2;
      const innerH  = rect.height - padding * 2;
      const innerLeft = rect.left + padding;
      const innerTop  = rect.top  + padding;

      // Échelle : innerW correspond à TOTAL_W pixels natifs
      const scale = innerW / TOTAL_W;

      const vCx = window.innerWidth  / 2;
      const vCy = window.innerHeight / 2;

      const list: CellTarget[] = [];
      for (let pos = 0; pos < 12; pos++) {
        const col = pos % COLS;
        const row = Math.floor(pos / COLS);

        // Centre de la cellule dans le référentiel écran
        const cellScreenX = innerLeft + (col + 0.5) * CORE_W * scale;
        const cellScreenY = innerTop  + (row + 0.5) * CORE_H * scale;

        list.push({
          cx:     cellScreenX - vCx,
          cy:     cellScreenY - vCy,
          pieceW: (584 / TOTAL_W) * innerW,  // largeur d'une pièce dans la grille
          pieceH: (498 / TOTAL_H) * innerH,
        });
      }
      setTargets(list);
    });
    return () => cancelAnimationFrame(id);
  }, [puzzleContainerRef]);

  useEffect(() => {
    const id = window.setTimeout(finishOnce, TOTAL_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Taille d'affichage des pièces pendant le scatter (responsive)
  const scatterW = Math.min(180, window.innerWidth * 0.22);

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden pointer-events-none flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: FADE_DELAY, ease: 'easeInOut' }}
      onAnimationComplete={finishOnce}
    >
      {/* Fond maritime */}
      <div className="absolute inset-0 bg-[#07132E]" />

      {/* Les 12 pièces */}
      {IMGS.map((img, i) => {
        const s   = SCATTER[i];
        const r   = REST[i];
        const t   = targets?.[i];
        const delay = i * FALL_STAGGER;

        // Phase 1 : chute vers position de repos
        // Phase 2 : convergence vers la grille (si targets disponibles)
        const animX = t
          ? [s.sx, r.rx, `${t.cx}px`]
          : [s.sx, r.rx];

        const animY = t
          ? [s.sy, r.ry, `${t.cy}px`]
          : [s.sy, r.ry];

        const animRot = t
          ? [s.rot * 2, s.rot * 0.4, 0]
          : [s.rot * 2, s.rot * 0.4];

        const animScale = t
          ? [0.45, 1.0, (t.pieceW / scatterW) * 0.9]
          : [0.45, 1.0];

        const animOpacity = t
          ? [0, 1, 0]
          : [0, 1];

        const times = t ? [0, 0.45, 1] : [0, 1];

        const totalDur = t
          ? FALL_DUR + (GATHER_START - delay - FALL_DUR * 0.45) + GATHER_DUR
          : FALL_DUR;

        return (
          <motion.img
            key={i}
            src={img}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute object-contain"
            style={{
              width:  scatterW,
              height: 'auto',
              top:    '50%',
              left:   '50%',
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{
              x:       s.sx,
              y:       s.sy,
              rotate:  s.rot * 2,
              scale:   0.45,
              opacity: 0,
            }}
            animate={{
              x:       animX,
              y:       animY,
              rotate:  animRot,
              scale:   animScale,
              opacity: animOpacity,
            }}
            transition={{
              duration: totalDur,
              delay,
              times,
              ease: 'easeInOut',
              opacity: {
                duration: t ? totalDur : FALL_DUR,
                delay,
                times: t ? [0, 0.12, 0.85] : [0, 1],
                ease: 'easeInOut',
              },
            }}
          />
        );
      })}

      {/* Phrase d'accroche */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-1 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6] }}
        transition={{
          duration: 1.1,
          delay: 0.7,
          times: [0, 0.18, 0.68, 1],
          ease: 'easeInOut',
        }}
      >
        <p className="text-center font-display text-lg font-bold text-[#F5C542] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-2xl">
          Les morceaux s'éparpillent…
        </p>
        <p className="text-center text-sm font-semibold text-slate-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] sm:text-base">
          À toi de reconstituer la carte, moussaillon !
        </p>
      </motion.div>
    </motion.div>
  );
}
