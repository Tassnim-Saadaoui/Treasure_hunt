import { Circle } from 'lucide-react';

export type DiagnosticAnswer = 'propellers' | 'battery' | 'gps' | 'weight';

const ANSWER_OPTIONS: Array<{ value: DiagnosticAnswer; label: string }> = [
  { value: 'propellers', label: 'Défaillance des hélices.' },
  { value: 'battery', label: 'Batterie insuffisante.' },
  { value: 'gps', label: 'Perte du signal GPS.' },
  { value: 'weight', label: 'Colis au-delà de la limite de poids.' },
];

interface AnswerOptionsProps {
  value: DiagnosticAnswer | null;
  disabled: boolean;
  onChange: (answer: DiagnosticAnswer) => void;
}

export function AnswerOptions({ value, disabled, onChange }: AnswerOptionsProps) {
  return (
    <fieldset disabled={disabled} className="space-y-2">
      <legend className="mb-2 text-sm font-bold leading-relaxed text-[#10234b] sm:text-base">
        Quel est le problème qui empêche le drone de décoller ?
      </legend>
      <div role="radiogroup" aria-label="Causes possibles du blocage">
        {ANSWER_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={`mb-2 flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition sm:min-h-12 sm:text-sm ${
                isSelected
                  ? 'border-[#087cf0] bg-blue-50 text-[#10234b] shadow-[0_0_0_1px_rgba(8,124,240,0.16)]'
                  : 'border-[#d7dfef] bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/60'
              } ${disabled ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                isSelected ? 'border-[#087cf0] bg-[#087cf0] text-white' : 'border-slate-400 bg-white text-transparent'
              }`}>
                {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : <Circle className="h-2 w-2" />}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
