import { useRef, useState } from 'react';
import { ArrowRight, Bird, Compass, LockKeyhole, MapPinned } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ChallengePageProps } from '../types';
import { TreasureMapPuzzle } from './components/TreasureMapPuzzle';
import { ParrotEntranceAnimation } from './components/ParrotEntranceAnimation';
import { PieceScatterTransition } from './components/PieceScatterTransition';

type Phase = 'parrot' | 'scatter' | 'puzzle';

export function Challenge6Page({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const alreadySolved = completedIds.includes(6);
  const [hasSolved, setHasSolved] = useState(alreadySolved);
  const [phase, setPhase] = useState<Phase>(
    isUnlocked && !alreadySolved ? 'parrot' : 'puzzle'
  );

  // Ref sur le conteneur beige du puzzle — transmis à PieceScatterTransition
  // pour qu'il puisse mesurer la position exacte de la grille
  const puzzleContainerRef = useRef<HTMLDivElement>(null);

  const handleSolve = () => {
    setHasSolved(true);
    onComplete(6);
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8">
      <header className="relative overflow-hidden rounded-3xl border border-[#F5C542]/20 bg-gradient-to-br from-[#112754] via-[#0A1B42] to-[#07132E] p-5 shadow-2xl sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 opacity-[0.08]">
          <Compass className="h-44 w-44 text-[#F5C542]" strokeWidth={1} />
        </div>
        <div className="relative flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5C542] sm:text-xs">
          <span className="rounded-full border border-[#F5C542]/30 bg-[#F5C542]/10 px-3 py-1">Challenge 6</span>
          <span>Boss final</span>
        </div>
        <h1 className="relative mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          La carte de Barbe-Rouillée
        </h1>
        <div className="relative mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#051029]/55 p-4 sm:p-5">
          <Bird className="mt-0.5 h-5 w-5 shrink-0 text-[#F5C542]" />
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            Barbe-Rouillée avait dessiné sa carte au trésor avec amour. Mais Gérard, une mouette voleuse,
            l'a emportée pour faire son nid : les douze morceaux se sont éparpillés sur la plage. Gérard
            jure qu'il n'y est pour rien… même s'il a encore un bout de papier dans le bec. Remets la
            carte en ordre pour trouver où creuser, moussaillon !
          </p>
        </div>
      </header>

      {!isUnlocked ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0A1B42] p-5 text-slate-300" role="status">
          <LockKeyhole className="h-5 w-5 shrink-0 text-[#F5C542]" />
          <p>Cette carte est encore scellée. Termine les étapes précédentes pour l'ouvrir.</p>
        </div>
      ) : (
        <>
          {/* Phase 1 : perroquet */}
          <AnimatePresence>
            {phase === 'parrot' && (
              <ParrotEntranceAnimation
                key="parrot"
                onDone={() => setPhase('scatter')}
              />
            )}
          </AnimatePresence>

          {/* Phase 2 : pièces éparpillées → convergence vers la grille */}
          <AnimatePresence>
            {phase === 'scatter' && (
              <PieceScatterTransition
                key="scatter"
                puzzleContainerRef={puzzleContainerRef}
                onDone={() => setPhase('puzzle')}
              />
            )}
          </AnimatePresence>

          {/* Puzzle — toujours rendu (pour que le ref soit mesurable pendant scatter) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'puzzle' ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <TreasureMapPuzzle
              containerRef={puzzleContainerRef}
              isSolved={hasSolved}
              onSolve={handleSolve}
              onRedirect={() => onVoyageToMap(6)}
            />
          </motion.div>
        </>
      )}


      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <MapPinned className="h-3.5 w-3.5" />
        La crique de Barbe-Rouillée
      </p>
    </section>
  );
}
