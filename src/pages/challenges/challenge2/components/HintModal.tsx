import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Lightbulb, X } from 'lucide-react';
import { progressiveHints } from './droneDiagnosticData';

interface HintModalProps {
  isOpen: boolean;
  hintsSeen: number;
  onNext: () => void;
  onClose: () => void;
}

export function HintModal({ isOpen, hintsSeen, onNext, onClose }: HintModalProps) {
  const hintIndex = Math.min(hintsSeen, progressiveHints.length - 1);
  const isLastHint = hintIndex === progressiveHints.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="drone-hint-title"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-[#138dff] bg-gradient-to-br from-[#0b2454] to-[#071633] p-5 shadow-[0_0_30px_rgba(0,127,255,0.35)]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="drone-hint-title" className="flex items-center gap-2 text-lg font-bold text-white">
                <Lightbulb className="h-6 w-6 text-amber-400" aria-hidden="true" />
                Indice {hintIndex + 1} <span className="text-sm font-medium text-cyan-300">/ 3</span>
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-blue-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Fermer les indices"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 min-h-20 text-sm leading-relaxed text-slate-100 sm:text-base">
              {progressiveHints[hintIndex]}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-1.5" aria-label={`${hintIndex + 1} indice(s) affiché(s)`}>
                {progressiveHints.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 w-7 rounded-full ${index <= hintIndex ? 'bg-cyan-300' : 'bg-white/15'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={isLastHint ? onClose : onNext}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-cyan-300/40 bg-[#087cf0]/20 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-[#087cf0]/35"
              >
                {isLastHint ? 'Terminer' : 'Indice suivant'}
                {!isLastHint && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
            <span className="pointer-events-none absolute bottom-0 right-0 h-12 w-28 rounded-br-[1.6rem] rounded-tl-full border-l border-t border-[#ed1238]/50 bg-gradient-to-br from-transparent to-[#d4113d]/20" />
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
