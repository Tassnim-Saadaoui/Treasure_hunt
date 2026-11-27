/**
 * PieceScatterTransition
 *
 * Affiche les 12 vraies pièces du puzzle qui tombent en pluie depuis
 * différentes positions hors-écran, tournoyantes, puis s'immobilisent
 * éparpillées. La phrase d'accroche apparaît, puis tout disparaît
 * et le puzzle devient interactif.
 */

import { useEffect, useRef } from 'react';
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

interface PieceScatterTransitionProps {
  onDone: () => void;
}

// Paramètres de chaque pièce : position de départ (hors-écran), position
// d'atterrissage éparpillée, et rotation finale
const PIECES = [
  { img: piece1,  startX: '-55vw', startY: '-60vh', landX: '-38vw', landY: '-22vh', rot:  -28 },
  { img: piece2,  startX: '-20vw', startY: '-65vh', landX:  '-8vw', landY: '-30vh', rot:   14 },
  { img: piece3,  startX:  '20vw', startY: '-60vh', landX:  '30vw', landY: '-26vh', rot:  -42 },
  { img: piece4,  startX:  '58vw', startY: '-55vh', landX:  '44vw', landY: '-18vh', rot:   22 },
  { img: piece5,  startX: '-60vw', startY: '-45vh', landX: '-46vw', landY:   '2vh', rot:   35 },
  { img: piece6,  startX: '-35vw', startY: '-70vh', landX: '-18vw', landY:  '-6vh', rot:  -18 },
  { img: piece7,  startX:  '10vw', startY: '-68vh', landX:  '10vw', landY:   '0vh', rot:   48 },
  { img: piece8,  startX:  '50vw', startY: '-62vh', landX:  '38vw', landY:   '4vh', rot:  -32 },
  { img: piece9,  startX: '-50vw', startY: '-50vh', landX: '-34vw', landY:  '20vh', rot:   20 },
  { img: piece10, startX: '-15vw', startY: '-72vh', landX:  '-6vw', landY:  '24vh', rot:  -55 },
  { img: piece11, startX:  '30vw', startY: '-58vh', landX:  '22vw', landY:  '18vh', rot:   38 },
  { img: piece12, startX:  '62vw', startY: '-48vh', landX:  '46vw', landY:  '22vh', rot:  -24 },
];

// Timing global
const FALL_START   = 0;     // première pièce commence à tomber
const FALL_STAGGER = 0.09;  // écart entre chaque pièce
const FALL_DUR     = 0.7;   // durée de chute par pièce
const PHRASE_DELAY = 1.4;   // la phrase apparaît quand toutes les pièces sont posées
const PHRASE_DUR   = 1.2;   // durée de la phrase
const EXIT_DELAY   = 2.4;   // tout disparaît
const EXIT_DUR     = 0.5;
const TOTAL        = EXIT_DELAY + EXIT_DUR + 0.2;

export function PieceScatterTransition({ onDone }: PieceScatterTransitionProps) {
  const doneRef = useRef(false);
  const finishOnce = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const id = window.setTimeout(finishOnce, TOTAL * 1000 + 200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: EXIT_DUR, delay: EXIT_DELAY, ease: 'easeInOut' }}
      onAnimationComplete={finishOnce}
    >
      {/* Fond maritime sombre */}
      <div className="absolute inset-0 bg-[#07132E]" />

      {/* Les 12 pièces qui tombent */}
      {PIECES.map((p, i) => {
        const delay = FALL_START + i * FALL_STAGGER;
        return (
          <motion.img
            key={i}
            src={p.img}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute w-[22vw] max-w-[180px] h-auto object-contain"
            style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
            initial={{
              x: p.startX,
              y: p.startY,
              rotate: p.rot * 2.5,
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              x:       [p.startX,  p.landX,   p.landX],
              y:       [p.startY,  p.landY,   p.landY],
              rotate:  [p.rot * 2.5, p.rot,   p.rot],
              scale:   [0.5,         1.0,      1.0],
              opacity: [0,           1,        1],
            }}
            transition={{
              duration: FALL_DUR,
              delay,
              times: [0, 0.85, 1],
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.2, delay, ease: 'easeOut' },
            }}
          />
        );
      })}

      {/* Phrase d'accroche */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-1 px-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
        transition={{
          duration: PHRASE_DUR,
          delay: PHRASE_DELAY,
          times: [0, 0.18, 0.72, 1],
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
