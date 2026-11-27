import { useEffect, useRef, useState } from 'react';
import { Building2, Info, LockKeyhole, LockKeyholeOpen, ScanEye, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ChallengePageProps } from '../types';
import { BuildingCluesPuzzle } from './components/BuildingCluesPuzzle';
import { soundEngine } from '../../../lib/audio/soundEngine';

// ─── Toast (erreurs uniquement) ───────────────────────────────────────────────

interface Toast { id: number; message: string; }
let _toastId = 0;

export function Challenge4Page({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const [hasSolved, setHasSolved]     = useState(completedIds.includes(4));
  const [showOverlay, setShowOverlay] = useState(false);
  const [lockOpen, setLockOpen]       = useState(false);
  const [toasts, setToasts]           = useState<Toast[]>([]);
  const timersRef                     = useRef<Map<number, number>>(new Map());
  const redirectTimerRef              = useRef<number | null>(null);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current);
    };
  }, []);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = (message: string) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, message }]);
    const t = window.setTimeout(() => dismissToast(id), 4000);
    timersRef.current.set(id, t);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timersRef.current.get(id);
    if (t !== undefined) { window.clearTimeout(t); timersRef.current.delete(id); }
  };

  // ── Solve handler ──────────────────────────────────────────────────────────
  const handleSolve = () => {
    setHasSolved(true);
    onComplete(4);
    soundEngine.play('treasureFanfare');
    setShowOverlay(true);

    // Auto-redirect after 5 s if the player doesn't click
    redirectTimerRef.current = window.setTimeout(() => onVoyageToMap(4), 5000);
  };

  const handleManualRedirect = () => {
    if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current);
    onVoyageToMap(4);
  };

  return (
    <>
      {/* ── Success overlay ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="ch4-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* Blurred backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#020D1A]/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />

            {/* Card */}
            <motion.div
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#38BDF8]/25 bg-[#061322] p-8 text-center shadow-2xl"
              initial={{ scale: 0.82, opacity: 0, y: 24 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 320, damping: 24 }}
            >
              {/* Lock unlock animation — closed → shake → open → fade out */}
              <div className="mb-6 flex items-center justify-center" aria-hidden="true">
                <AnimatePresence mode="wait">
                  {/* Step 1: locked + shake (0 → 0.6 s) */}
                  <motion.div
                    key="locked"
                    initial={{ opacity: 1, rotate: 0, scale: 1 }}
                    animate={{ rotate: [-6, 6, -5, 5, -3, 3, 0], scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, y: -10 }}
                    transition={{
                      rotate: { duration: 0.5, delay: 0.15, ease: 'easeInOut' },
                    }}
                    onAnimationComplete={() => setLockOpen(true)}
                    className="text-[#38BDF8]"
                    style={{ display: lockOpen ? 'none' : 'block' }}
                  >
                    <LockKeyhole className="h-14 w-14" strokeWidth={1.5} />
                  </motion.div>

                  {/* Step 2: open → rise and fade (0.7 → 1.6 s) */}
                  {lockOpen && (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, scale: 0.6, y: 8 }}
                      animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.15, 1.1, 0.8], y: [8, 0, -4, -20] }}
                      transition={{ duration: 0.9, times: [0, 0.25, 0.6, 1], ease: 'easeOut' }}
                      className="text-[#38BDF8]"
                    >
                      <LockKeyholeOpen className="h-14 w-14" strokeWidth={1.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status line */}
              <motion.p
                className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#38BDF8]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Accès accordé
              </motion.p>

              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Porte déverrouillée !
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Tu as su lire l'environnement. Note le code pour la suite.
              </p>

              {/* Code */}
              <div className="mt-6 rounded-2xl border border-[#38BDF8]/25 bg-[#38BDF8]/5 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#38BDF8]">
                  Code pour la suite
                </p>
                <p className="mt-1 font-mono text-4xl font-black tracking-[0.35em] text-white">
                  20
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[#38BDF8]"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>

              <button
                type="button"
                onClick={handleManualRedirect}
                className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Revenir à la carte
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error toasts — top-right ── */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2 sm:right-6 sm:top-6" aria-live="polite">
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{    opacity: 0, x: 60, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative w-[min(88vw,340px)] overflow-hidden rounded-2xl border border-[#E11D3F]/30 bg-[#0A1B42] shadow-xl"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-[#E11D3F]" />
              <div className="pl-4 pr-10 py-4">
                <p className="text-sm font-bold text-[#E11D3F]">Mauvais résultat</p>
                <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="absolute right-2.5 top-2.5 rounded-lg p-1 text-slate-500 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#E11D3F]/50"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Page ── */}
      <section className="mx-auto w-full max-w-xl space-y-4 pb-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-[#00B8FF]/60 bg-gradient-to-br from-[#101A42] via-[#071A3B] to-[#04132D] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-48 w-48 rounded-full bg-[#E11D48]/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-14 bottom-0 h-48 w-48 rounded-full bg-[#00B8FF]/10 blur-3xl" />

          <div className="relative flex justify-center pt-1">
            <div className="relative flex h-32 w-52 items-center justify-center rounded-[2rem] border border-dashed border-[#00B8FF]/25 bg-[#061735]/55">
              <span aria-hidden="true" className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-lg border-l-[5px] border-t-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-lg border-r-[5px] border-t-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-lg border-b-[5px] border-l-[5px] border-[#00B8FF]" />
              <span aria-hidden="true" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-lg border-b-[5px] border-r-[5px] border-[#00B8FF]" />
              <Building2 className="h-24 w-24 text-[#00B8FF] sm:h-28 sm:w-28" strokeWidth={1.25} />
              <span className="absolute bottom-4 right-7 rounded-full border-4 border-[#071A3B] bg-[#E11D48] p-2 text-white shadow-lg sm:bottom-3 sm:right-6">
                <ScanEye className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
              </span>
            </div>
          </div>

          <h1 className="relative mt-3 text-center font-display text-3xl font-black italic leading-tight text-white sm:mt-4 sm:text-4xl">
            Le Code de la<br /><span className="text-[#F22555]">Salle Serveur</span>
          </h1>

          <div className="relative mt-3 flex justify-center">
            <span className="rounded-full border border-[#00B8FF]/50 bg-[#061735]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(0,184,255,0.12)]">
              <span className="mr-2 text-[#E11D48]">●</span>Indice terrain · Challenge 4
            </span>
          </div>

          <div className="relative mt-6 rounded-[1.75rem] border border-[#00B8FF]/70 bg-[#0A2149]/80 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-6 w-6 shrink-0 text-[#00B8FF]" strokeWidth={2.5} />
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#00B8FF]">La situation</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
                  La porte de secours du serveur est verrouillée. Pour obtenir le code,
                  repère dans la salle les deux informations sur l'événement : le nombre
                  de sessions au programme et le nombre de membres du bureau. Multiplie-les
                  pour reconstituer le code d'accès.
                </p>
              </div>
            </div>
          </div>
        </header>

        {!isUnlocked ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#00B8FF]/25 bg-[#0A1B42] p-5 text-slate-300" role="status">
            <LockKeyhole className="h-5 w-5 shrink-0 text-[#00B8FF]" />
            <p>Ce niveau est encore verrouillé. Termine les étapes précédentes pour continuer.</p>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-[#00B8FF]/70 bg-[#0A2149] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:p-6">
            <BuildingCluesPuzzle
              isSolved={hasSolved}
              onSolve={handleSolve}
              onWrongAttempt={addToast}
            />
          </div>
        )}
      </section>
    </>
  );
}
