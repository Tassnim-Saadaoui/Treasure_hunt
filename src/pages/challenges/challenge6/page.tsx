import { useRef, useState } from 'react';
import { Compass, Info, LockKeyhole, MapPinned } from 'lucide-react';
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
  const [hasSolved, setHasSolved]   = useState(alreadySolved);
  const [phase, setPhase]           = useState<Phase>(
    isUnlocked && !alreadySolved ? 'parrot' : 'puzzle'
  );

  // Ref sur le conteneur beige — mesuré par PieceScatterTransition
  const puzzleContainerRef = useRef<HTMLDivElement>(null);

  const handleSolve = () => {
    setHasSolved(true);
    onComplete(6);
  };

  const isAnimating = phase === 'parrot' || phase === 'scatter';

  return (
    <>
      {/* ── Écran plein qui recouvre TOUTE la page pendant l'animation ───────
          z-[48] = sous les overlays du perroquet (z-50) et scatter (z-40)
          mais au-dessus de tout le reste de l'UI.
          Disparaît avec un fade rapide quand le puzzle apparaît.          */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="page-cover"
            className="fixed inset-0 z-[38] bg-[#07132E]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* ── Phase 1 : perroquet (fixed, z-50) ───────────────────────────── */}
      <AnimatePresence>
        {phase === 'parrot' && (
          <ParrotEntranceAnimation
            key="parrot"
            onDone={() => setPhase('scatter')}
          />
        )}
      </AnimatePresence>

      {/* ── Phase 2 : scatter (fixed, z-40) ─────────────────────────────── */}
      <AnimatePresence>
        {phase === 'scatter' && (
          <PieceScatterTransition
            key="scatter"
            puzzleContainerRef={puzzleContainerRef}
            onDone={() => setPhase('puzzle')}
          />
        )}
      </AnimatePresence>

      {/* ── Contenu de page — invisible pendant l'animation ──────────────── */}
      <section className="mx-auto w-full max-w-5xl space-y-5 pb-8">
        <header className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#00B8FF]/60 bg-gradient-to-br from-[#101A42] via-[#071A3B] to-[#04132D] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-48 w-48 rounded-full bg-[#E11D48]/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-14 bottom-0 h-48 w-48 rounded-full bg-[#00B8FF]/10 blur-3xl" />

          <div className="relative flex justify-center pt-1">
            <div className="relative flex h-32 w-52 items-center justify-center rounded-[2rem] border border-dashed border-[#00B8FF]/25 bg-[#061735]/55">
              <span aria-hidden="true" className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-lg border-l-[5px] border-t-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-lg border-r-[5px] border-t-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-lg border-b-[5px] border-l-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-lg border-b-[5px] border-r-[5px] border-[#00B8FF]" />
              <Compass className="h-24 w-24 text-[#00B8FF] sm:h-28 sm:w-28" strokeWidth={1.25} />
              <span className="absolute bottom-4 right-7 rounded-full border-4 border-[#071A3B] bg-[#E11D48] p-2 text-white shadow-lg sm:bottom-3 sm:right-6">
                <MapPinned className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
              </span>
            </div>
          </div>

          <h1 className="relative mt-3 text-center font-display text-3xl font-black italic leading-tight text-white sm:mt-4 sm:text-4xl">
            La carte de<br /><span className="text-[#F22555]">Barbe-Rouillée</span>
          </h1>

          <div className="relative mt-3 flex justify-center">
            <span className="rounded-full border border-[#00B8FF]/50 bg-[#061735]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(0,184,255,0.12)]">
              <span className="mr-2 text-[#E11D48]">●</span>Trésor final · Challenge 6
            </span>
          </div>

          <div className="relative mt-6 rounded-[1.75rem] border border-[#00B8FF]/70 bg-[#0A2149]/80 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-6 w-6 shrink-0 text-[#00B8FF]" strokeWidth={2.5} />
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#00B8FF]">La situation</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
                  Barbe-Rouillée avait dessiné sa carte au trésor avec amour. Mais Gérard, une mouette voleuse,
                  l'a emportée pour faire son nid : les douze morceaux se sont éparpillés sur la plage. Gérard
                  jure qu'il n'y est pour rien… même s'il a encore un bout de papier dans le bec. Remets la
                  carte en ordre pour trouver où creuser, moussaillon !
                </p>
              </div>
            </div>
          </div>
        </header>

        {!isUnlocked ? (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-[#00B8FF]/25 bg-[#0A1B42] p-5 text-slate-300" role="status">
            <LockKeyhole className="h-5 w-5 shrink-0 text-[#00B8FF]" />
            <p>Cette carte est encore scellée. Termine les étapes précédentes pour l'ouvrir.</p>
          </div>
        ) : (
          <>
            {/* Puzzle : monté dès la phase scatter pour que le ref soit mesurable,
                mais invisible jusqu'à la phase puzzle */}
            {phase !== 'parrot' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'puzzle' ? 1 : 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <TreasureMapPuzzle
                  containerRef={puzzleContainerRef}
                  isSolved={hasSolved}
                  onSolve={handleSolve}
                  onRedirect={() => onVoyageToMap(6)}
                />
              </motion.div>
            )}
          </>
        )}

        <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <MapPinned className="h-3.5 w-3.5" />
          La crique de Barbe-Rouillée
        </p>
      </section>
    </>
  );
}
