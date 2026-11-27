import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowRight, BadgeCheck } from 'lucide-react';

type ValidationStatus = 'correct' | 'incorrect' | null;

interface ValidationResultProps {
  status: ValidationStatus;
  onContinue: () => void;
}

export function ValidationResult({ status, onContinue }: ValidationResultProps) {
  return (
    <AnimatePresence mode="wait">
      {status && (
        <motion.div
          key={status}
          role={status === 'correct' ? 'status' : 'alert'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`mb-3 rounded-xl border p-3 ${
            status === 'correct'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : 'border-amber-300 bg-amber-50 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {status === 'correct'
              ? <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {status === 'correct' ? 'Diagnostic confirmé !' : 'Pas encore. Continuez votre enquête.'}
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                {status === 'correct'
                  ? 'La pluie a alourdi le carton. Le poids réel dépasse la limite, alors le système de sécurité bloque le décollage.'
                  : 'Réexaminez les relevés techniques et cherchez un détail dans la scène qui pourrait modifier les données déclarées.'}
              </p>
              {status === 'correct' && (
                <button
                  type="button"
                  onClick={onContinue}
                  className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#087cf0] px-4 text-xs font-bold text-white transition hover:bg-[#0564c8]"
                >
                  Continuer vers la carte <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
