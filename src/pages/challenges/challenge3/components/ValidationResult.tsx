import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowRight, BadgeCheck } from 'lucide-react';

export type ChallengeThreeResult = 'correct' | 'incorrect' | null;

interface ValidationResultProps {
  result: ChallengeThreeResult;
  onContinue: () => void;
}

export function ValidationResult({ result, onContinue }: ValidationResultProps) {
  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key={result}
          role={result === 'correct' ? 'status' : 'alert'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
          className={`rounded-2xl border px-3.5 py-3 ${
            result === 'correct'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : 'border-amber-300 bg-amber-50 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {result === 'correct'
              ? <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {result === 'correct' ? 'Bonne déduction !' : 'Pas encore. Réexaminez les déclarations.'}
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                {result === 'correct'
                  ? 'Vous avez identifié le terminal infecté en analysant les déclarations.'
                  : 'Un seul terminal dit vrai et les deux autres mentent. Réexaminez les trois déclarations, puis réessayez.'}
              </p>
              {result === 'correct' && (
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
