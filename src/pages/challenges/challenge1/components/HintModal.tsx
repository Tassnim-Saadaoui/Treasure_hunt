import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Lightbulb, X } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  hint: string;
  onClose: () => void;
}

export function HintModal({ isOpen, hint, onClose }: HintModalProps) {
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !modalRef.current?.contains(event.target)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={modalRef}
          role="dialog"
          aria-labelledby="hint-title"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[1.5rem] border border-[#138dff] bg-gradient-to-br from-[#0b2454] to-[#071633] p-4 shadow-[0_0_22px_rgba(0,127,255,0.32)] sm:p-5"
        >
          <div className="flex items-center justify-between">
            <h2 id="hint-title" className="flex items-center gap-2 text-lg font-bold text-white">
              <Lightbulb className="h-7 w-7 text-amber-400" aria-hidden="true" />
              Indice
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-blue-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fermer l’indice"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-3 text-center text-sm leading-relaxed text-slate-100 sm:text-base">
            {hint.split(/(énergie|3 mètres)/g).map((part, index) =>
              part === 'énergie' || part === '3 mètres' ? (
                <strong key={index} className="text-cyan-300">{part}</strong>
              ) : (
                part
              ),
            )}
          </p>
          <span className="pointer-events-none absolute bottom-0 right-0 h-10 w-24 rounded-br-[1.5rem] rounded-tl-full border-t border-l border-[#ed1238]/60 bg-gradient-to-br from-transparent to-[#d4113d]/25" />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
