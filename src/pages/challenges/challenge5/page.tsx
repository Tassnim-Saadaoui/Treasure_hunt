import { useEffect, useRef, useState } from 'react';
import { Drum, Info, LockKeyhole, Music } from 'lucide-react';
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
      <section className="mx-auto w-full max-w-xl space-y-4 pb-8">

        {/* Header */}
        <header className="relative overflow-hidden rounded-[2rem] border border-[#00B8FF]/60 bg-gradient-to-br from-[#101A42] via-[#071A3B] to-[#04132D] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-48 w-48 rounded-full bg-[#E11D48]/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-14 bottom-0 h-48 w-48 rounded-full bg-[#00B8FF]/10 blur-3xl" />

          <div className="relative flex justify-center pt-1">
            <div className="relative flex h-32 w-52 items-center justify-center rounded-[2rem] border border-dashed border-[#00B8FF]/25 bg-[#061735]/55">
              <span aria-hidden="true" className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-lg border-l-[5px] border-t-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-lg border-r-[5px] border-t-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-lg border-b-[5px] border-l-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-lg border-b-[5px] border-r-[5px] border-[#00B8FF]" />
              <Drum className="h-24 w-24 text-[#00B8FF] sm:h-28 sm:w-28" strokeWidth={1.25} />
              <span className="absolute bottom-4 right-7 rounded-full border-4 border-[#071A3B] bg-[#E11D48] p-2 text-white shadow-lg sm:bottom-3 sm:right-6">
                <Music className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
              </span>
            </div>
          </div>

          <h1 className="relative mt-3 text-center font-display text-3xl font-black italic leading-tight text-white sm:mt-4 sm:text-4xl">
            Le Rythme en<br /><span className="text-[#F22555]">Studio</span>
          </h1>

          <div className="relative mt-3 flex justify-center">
            <span className="rounded-full border border-[#00B8FF]/50 bg-[#061735]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(0,184,255,0.12)]">
              <span className="mr-2 text-[#E11D48]">●</span>Énigme musicale · Challenge 5
            </span>
          </div>

          <div className="relative mt-6 rounded-[1.75rem] border border-[#00B8FF]/70 bg-[#0A2149]/80 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-6 w-6 shrink-0 text-[#00B8FF]" strokeWidth={2.5} />
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#00B8FF]">La situation</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
                  Pour déverrouiller le studio d'enregistrement d'une IA musicale, tu dois terminer
                  la partition de batterie d'un morceau dont la fin a été coupée. Chaque lettre
                  correspond à un instrument précis :{' '}
                  <span className="font-semibold text-[#F22555]">P = Pied (grosse caisse)</span>,{' '}
                  <span className="font-semibold text-[#F5C542]">C = Caisse claire</span>,{' '}
                  <span className="font-semibold text-[#00B8FF]">S = Symbole (cymbale)</span>.{' '}
                  Le rythme monte en puissance — repère la logique et complète les deux dernières notes.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Locked */}
        {!isUnlocked ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#00B8FF]/25 bg-[#0A1B42] p-5 text-slate-300" role="status">
            <LockKeyhole className="h-5 w-5 shrink-0 text-[#00B8FF]" />
            <p>Ce studio est encore verrouillé. Termine les étapes précédentes pour y accéder.</p>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-[#00B8FF]/70 bg-[#0A2149] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:p-6">
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
