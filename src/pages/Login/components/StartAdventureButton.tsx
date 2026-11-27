import { ArrowRight, Skull } from 'lucide-react';

interface StartAdventureButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

export function StartAdventureButton({ isLoading, disabled }: StartAdventureButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex min-h-[72px] w-full items-center justify-center gap-5 rounded-full border-2 border-[#FF5866] bg-gradient-to-b from-[#F51D32] to-[#C80022] px-6 text-lg font-extrabold tracking-wide text-white shadow-[0_8px_24px_rgba(225,29,63,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(225,29,63,0.5)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:text-xl"
    >
      <Skull className="h-9 w-9 shrink-0" strokeWidth={2.2} />
      <span>{isLoading ? 'SETTING SAIL…' : 'START ADVENTURE'}</span>
      <ArrowRight className="h-7 w-7 shrink-0" strokeWidth={3} />
    </button>
  );
}
