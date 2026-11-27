import { ChevronRight, Lightbulb } from 'lucide-react';

interface HintButtonProps {
  onClick: () => void;
}

export function HintButton({ onClick }: HintButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex min-h-12 min-w-40 items-center justify-center gap-2 rounded-full border border-[#009cff] bg-[#082456] px-5 py-2 text-base font-semibold text-white shadow-[0_0_18px_rgba(0,137,255,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Lightbulb className="h-6 w-6 text-amber-400" aria-hidden="true" />
      Hint
      <ChevronRight className="h-5 w-5 text-blue-400" aria-hidden="true" />
    </button>
  );
}
