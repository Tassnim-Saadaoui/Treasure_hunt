import { useEffect, useRef, useState } from 'react';
import { Building2, LockKeyhole, ScanEye, X } from 'lucide-react';
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
              {/* Scan lines animation — server / architecture vibe */}
              <div className="mb-6 flex flex-col items-center gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-[3px] rounded-full bg-[#38BDF8]"
                    initial={{ width: '0%', opacity: 0 }}
                    animate={{ width: ['0%', '100%', '60%', '85%', '40%'], opacity: [0, 1, 0.7, 1, 0.5] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.18,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    }}
                  />
                ))}
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
      <section className="mx-auto w-full max-w-3xl space-y-5 pb-8">
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
              onWrongAttempt={addToast}
            />
          </div>
        )}
      </section>
    </>
  );
}
