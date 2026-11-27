import { useState } from 'react';
import { ArrowRight, Building2, LockKeyhole, ScanEye } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ChallengePageProps } from '../types';
import { BuildingCluesPuzzle } from './components/BuildingCluesPuzzle';

export function Challenge4Page({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const [hasSolved, setHasSolved] = useState(completedIds.includes(4));
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);

  const handleSolve = () => {
    setHasSolved(true);
    onComplete(4);
    setErrorMsg(null);
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 pb-8">

      {/* ── Header ── */}
      <header className="relative overflow-hidden rounded-3xl border border-[#F5C542]/20 bg-gradient-to-br from-[#112754] via-[#0A1B42] to-[#07132E] p-5 shadow-2xl sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-8 opacity-[0.07]">
          <Building2 className="h-44 w-44 text-[#F5C542]" strokeWidth={1} />
        </div>

        <div className="relative flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5C542] sm:text-xs">
          <span className="rounded-full border border-[#F5C542]/30 bg-[#F5C542]/10 px-3 py-1">Challenge 4</span>
          <span>Observation</span>
        </div>

        <h1 className="relative mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          L'Indice du Bâtiment
        </h1>

        <div className="relative mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#051029]/55 p-4 sm:p-5">
          <ScanEye className="mt-0.5 h-5 w-5 shrink-0 text-[#F5C542]" />
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            Pour ouvrir la porte de secours du serveur, le système demande le résultat
            d'un calcul basé sur l'architecture réelle de l'événement. Lève les yeux,
            regarde autour de toi — les deux valeurs sont visibles dans cette salle.
          </p>
        </div>
      </header>

      {/* ── Locked ── */}
      {!isUnlocked ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0A1B42] p-5 text-slate-300" role="status">
          <LockKeyhole className="h-5 w-5 shrink-0 text-[#F5C542]" />
          <p>Ce niveau est encore verrouillé. Termine les étapes précédentes pour continuer.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#0A1B42] p-5 shadow-xl sm:p-6">
          <BuildingCluesPuzzle
            isSolved={hasSolved}
            onSolve={handleSolve}
            onWrongAttempt={(msg) => setErrorMsg(msg)}
          />
        </div>
      )}

      {/* ── Error ── */}
      <AnimatePresence>
        {errorMsg && !hasSolved && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3 rounded-2xl border border-[#E11D3F]/40 bg-[#E11D3F]/10 p-4 text-sm text-slate-200"
          >
            <span className="mt-0.5 shrink-0 text-[#E11D3F]">✗</span>
            <p>{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success ── */}
      {hasSolved && isUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start gap-4 rounded-2xl border border-[#F5C542]/30 bg-[#F5C542]/[0.07] p-5 sm:p-6"
        >
          <div>
            <p className="font-semibold text-white">Porte déverrouillée !</p>
            <p className="mt-1 text-sm text-slate-300">
              Tu as su lire l'environnement. Note le code pour la suite.
            </p>
          </div>

          <div className="w-full rounded-xl border border-[#F5C542]/40 bg-[#F5C542]/10 p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C542]">Code pour la suite</p>
            <p className="mt-1 font-mono text-3xl font-black tracking-[0.3em] text-white">20</p>
          </div>

          <button
            type="button"
            onClick={() => onVoyageToMap(4)}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E11D3F]"
          >
            Continuer l'expédition <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

    </section>
  );
}
