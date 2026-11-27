import { CircleCheck, Crosshair } from 'lucide-react';

export type ChatbotAnswer = 'alpha' | 'beta' | 'gamma';

const ANSWERS: Array<{ value: ChatbotAnswer; label: string }> = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Bêta' },
  { value: 'gamma', label: 'Gamma' },
];

interface AnswerSectionProps {
  selectedAnswer: ChatbotAnswer | null;
  isSubmitting: boolean;
  isSolved: boolean;
  error: string | null;
  isUnlocked: boolean;
  onSelect: (answer: ChatbotAnswer) => void;
  onSubmit: () => void;
}

export function AnswerSection({
  selectedAnswer,
  isSubmitting,
  isSolved,
  error,
  isUnlocked,
  onSelect,
  onSubmit,
}: AnswerSectionProps) {
  return (
    <section className="space-y-2 text-[#10234b]">
      <h2 className="mb-3 flex items-center gap-2.5 text-sm font-extrabold leading-snug sm:text-lg">
        <Crosshair className="h-7 w-7 shrink-0 text-[#f3294a]" strokeWidth={2.5} aria-hidden="true" />
        Dans quel terminal se cache le virus ?
      </h2>

      <fieldset disabled={isSolved || isSubmitting} className="space-y-2">
        <legend className="sr-only">Choisissez le terminal où se cache le virus</legend>
        {ANSWERS.map(({ value, label }) => {
          const isSelected = selectedAnswer === value;
          return (
            <label
              key={value}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-full border px-3.5 py-2 text-sm transition sm:min-h-12 sm:px-4 ${
                isSelected
                  ? 'border-[#087cf0] bg-[#dce9ff] text-[#0c2857] shadow-[0_0_0_1px_rgba(8,124,240,.12)]'
                  : 'border-transparent bg-[#e6ebfa] text-[#132c5c] hover:border-blue-300 hover:bg-[#dfe8fb]'
              } ${isSolved || isSubmitting ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <input
                type="radio"
                name="challenge-three-answer"
                value={value}
                checked={isSelected}
                onChange={() => onSelect(value)}
                className="h-[18px] w-[18px] shrink-0 accent-[#087cf0]"
              />
              <span className="font-medium">{label}</span>
            </label>
          );
        })}
      </fieldset>

      {error && <p className="mt-2 text-center text-xs font-semibold text-[#c8102e]" role="alert">{error}</p>}

      {!isSolved && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isUnlocked || isSubmitting}
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f31635] to-[#cf0028] px-5 py-2.5 text-base font-extrabold text-white shadow-[0_8px_20px_rgba(220,0,38,.3)] transition hover:brightness-105 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-4 sm:min-h-14 sm:text-lg"
        >
          <CircleCheck className="h-6 w-6" strokeWidth={2.7} aria-hidden="true" />
          {isSubmitting ? 'Analyse en cours…' : 'Valider'}
        </button>
      )}
      {!isUnlocked && <p className="mt-2 text-center text-xs font-semibold text-[#c8102e]">Ce défi est verrouillé.</p>}
    </section>
  );
}
