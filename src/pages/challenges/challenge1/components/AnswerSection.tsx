import { CircleCheck } from 'lucide-react';

interface AnswerSectionProps {
  value: string;
  isUnlocked: boolean;
  isSubmitting: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function AnswerSection({
  value,
  isUnlocked,
  isSubmitting,
  error,
  onChange,
  onSubmit,
}: AnswerSectionProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="mt-auto rounded-t-[2rem] bg-gradient-to-b from-white to-[#f2f4ff] px-4 pb-3 pt-4 text-slate-900 shadow-[0_-8px_24px_rgba(179,197,255,0.18)] sm:px-5"
    >
      <label className="sr-only" htmlFor="challenge-keyword">Mot-clé du challenge</label>
      <input
        id="challenge-keyword"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Entrez le mot-clé ici..."
        autoComplete="off"
        className="min-h-12 w-full rounded-full border border-[#d6ddff] bg-[#eef1ff] px-4 text-sm text-[#17356c] outline-none placeholder:text-[#5574b1] focus:border-[#5790ff] focus:ring-2 focus:ring-blue-200"
      />
      <button
        type="submit"
        disabled={!isUnlocked || isSubmitting}
        className="mt-3 flex min-h-[3.6rem] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fa1235] to-[#d90025] px-5 py-3 text-lg font-bold text-white shadow-[0_8px_20px_rgba(220,0,38,0.24)] transition-transform hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CircleCheck className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
        {isSubmitting ? 'Vérification…' : 'Valider'}
      </button>
      {error && <p className="mt-2 text-center text-sm font-medium text-[#c8102e]" role="alert">{error}</p>}
      <div className="mx-auto mt-4 h-1.5 w-1/2 max-w-36 rounded-full bg-[#2f4f91]" aria-hidden="true" />
    </form>
  );
}
