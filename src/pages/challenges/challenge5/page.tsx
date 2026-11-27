import { useEffect, useRef, useState } from 'react';
import { Drum, LockKeyhole, Music } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ChallengePageProps } from '../types';
import { DrumSequencePuzzle } from './components/DrumSequencePuzzle';
import {
  getAudioContext,
  unlockAudioContext,
  playDrumSequence,
} from './lib/drumPlayer';

// Séquence complète incluant les deux réponses S + P
const FULL_SEQUENCE = ['P','P','C','S','P','P','C','C','S','P','P','C','C','C','S','P'] as const;
const BPM           = 108;
// Durée de la séquence + marge avant redirection (ms)
const REDIRECT_DELAY_MS = FULL_SEQUENCE.length * (60 / BPM / 4) * 1000 + 200 + 1800;

export function Challenge5Page({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const [hasSolved, setHasSolved] = useState(completedIds.includes(5));
  const [showOverlay, setShowOverlay] = useState(false);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);
  const redirectTimerRef              = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const handleSolve = () => {
    setHasSolved(true);
    onComplete(5);
    setErrorMsg(null);
    setShowOverlay(true);

    // Play the full sequence (including the two answer notes) synchronously
    const ctx = getAudioContext();
    if (ctx) {
      unlockAudioContext(ctx);
      playDrumSequence(ctx, [...FULL_SEQUENCE], BPM, () => {}, () => {});
    }

    // Auto-redirect after the music finishes
    redirectTimerRef.current = window.setTimeout(
      () => onVoyageToMap(5),
      REDIRECT_DELAY_MS
    );
  };

  const handleWrongAttempt = (msg: string) => {
    setErrorMsg(msg);
  };

  return (
    <>
      {/* ── Success overlay — fixed, blurs the whole page ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="success-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* Blurred backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#07132E]/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />

            {/* Card */}
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-[#F5C542]/30 bg-[#0A1B42] p-8 text-center shadow-2xl"
              initial={{ scale: 0.82, opacity: 0, y: 24 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 320, damping: 24 }}
            >
              {/* Animated equalizer bars — visual flair */}
              <div className="mb-6 flex items-end justify-center gap-1" aria-hidden="true">
                {[0,1,2,3,4].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 rounded-full bg-[#F5C542]"
                    animate={{ height: ['8px','28px','12px','24px','8px'] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Studio déverrouillé !
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Le roulement est complet. La piste se relance.
              </p>

              <div className="mt-6 rounded-2xl border border-[#F5C542]/30 bg-[#F5C542]/10 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5C542]">
                  Code pour la suite
                </p>
                <p className="mt-1 font-mono text-4xl font-black tracking-[0.35em] text-white">
                  SP
                </p>
              </div>

              {/* Progress bar showing time before redirect */}
              <motion.div
                className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full rounded-full bg-[#F5C542]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: REDIRECT_DELAY_MS / 1000, ease: 'linear' }}
                />
              </motion.div>

              <button
                type="button"
                onClick={() => {
                  if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current);
                  onVoyageToMap(5);
                }}
                className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Revenir à la carte
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <section className="mx-auto w-full max-w-3xl space-y-5 pb-8">

        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl border border-[#F5C542]/20 bg-gradient-to-br from-[#112754] via-[#0A1B42] to-[#07132E] p-5 shadow-2xl sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-8 opacity-[0.07]">
            <Drum className="h-44 w-44 text-[#F5C542]" strokeWidth={1} />
          </div>
          <div className="relative flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5C542] sm:text-xs">
            <span className="rounded-full border border-[#F5C542]/30 bg-[#F5C542]/10 px-3 py-1">Challenge 5</span>
            <span>Intermédiaire</span>
          </div>
          <h1 className="relative mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Le Rythme en Studio
          </h1>
          <div className="relative mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#051029]/55 p-4 sm:p-5">
            <Music className="mt-0.5 h-5 w-5 shrink-0 text-[#F5C542]" />
            <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
              Pour déverrouiller le studio d'enregistrement d'une IA musicale, tu dois terminer
              la partition de batterie d'un morceau dont la fin a été coupée. Chaque lettre
              correspond à un instrument précis :{' '}
              <span className="font-semibold text-[#C8102E]">P = Pied (grosse caisse)</span>,{' '}
              <span className="font-semibold text-[#F5C542]">C = Caisse claire</span>,{' '}
              <span className="font-semibold text-[#38BDF8]">S = Symbole (cymbale)</span>.{' '}
              Le rythme monte en puissance — repère la logique et complète les deux dernières notes.
            </p>
          </div>
        </header>

        {/* Locked */}
        {!isUnlocked ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0A1B42] p-5 text-slate-300" role="status">
            <LockKeyhole className="h-5 w-5 shrink-0 text-[#F5C542]" />
            <p>Ce studio est encore verrouillé. Termine les étapes précédentes pour y accéder.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#0A1B42] p-5 shadow-xl sm:p-6">
            <DrumSequencePuzzle
              isSolved={hasSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          </div>
        )}

        {/* Error banner */}
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

      </section>
    </>
  );
}
